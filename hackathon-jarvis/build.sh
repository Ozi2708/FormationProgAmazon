#!/usr/bin/env bash
# Fabrique un film : repères sonores → bande-son → rendu vidéo → assemblage.
#   ./build.sh                 film long (3:43, index.html)
#   FILM=pitch ./build.sh      version pitch (2:00, pitch.html)
#   FILM=v2 ./build.sh         film jury v2 (90 s, pitch-v2.html, réglages dans js/pitch-v2/config.js) en 1080p30
#   FPS=30 ./build.sh          plus rapide, pour un aperçu
set -euo pipefail
cd "$(dirname "$0")"
WORKERS=${WORKERS:-4}
LUFS=${LUFS:--20}
FILM=${FILM:-long}
# MAIN_MB / PREV_MB : tailles visées (Mo) · PREV_H : hauteur de l'aperçu
PREV_H=1080; PREV_MB=29
if [ "$FILM" = pitch ]; then
  PAGE=pitch.html; B=build/pitch; NAME=JARVIS-pitch-2min; MAIN_MB=70; FPS=${FPS:-60}
elif [ "$FILM" = v2 ]; then
  PAGE=pitch-v2.html; B=build/v2; NAME=JARVIS-jury-v2; MAIN_MB=29; PREV_MB=9; PREV_H=720; FPS=${FPS:-30}
else
  PAGE=index.html; B=build; NAME=JARVIS-hackathon; MAIN_MB=90; FPS=${FPS:-60}
fi
mkdir -p "$B" livrables

echo "1/4 repères sonores"
node render.cjs --page "$PAGE" --cues "$B/cues.json"
if [ "$FILM" = long ]; then python3 tools/voiceover.py; fi

echo "2/4 bande-son"
python3 audio/make_audio.py "$B/cues.json" "$B/audio"
I=$(ffmpeg -hide_banner -nostats -i "$B/audio/mix.wav" -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}')
GAIN=$(python3 -c "print(round($LUFS - ($I), 2))")
echo "   mix à $I LUFS → gain $GAIN dB (cible $LUFS LUFS)"

echo "3/4 rendu vidéo ($FPS i/s)"
node render.cjs --page "$PAGE" --fps "$FPS" --workers "$WORKERS" --out "$B/video-only.mp4"

echo "4/4 assemblage"
# encodage en deux passes, taille visée calculée d'après la durée :
#   film final sous la limite GitHub de 100 Mo (v2 : < 29 Mo, envoyable tel quel), aperçu léger
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$B/video-only.mp4")
VB_MAIN=$(python3 -c "print(int($MAIN_MB*1e6*8/$DUR/1000) - 256)")
VB_PREV=$(python3 -c "print(int($PREV_MB*1048576*8/$DUR/1000) - 140)")
enc() { # $1 = débit vidéo (k) · $2 = i/s · $3 = débit audio · $4 = sortie · $5 = hauteur
  ffmpeg -v error -y -i "$B/video-only.mp4" -vf "fps=$2,scale=-2:$5:flags=lanczos" -c:v libx264 -preset slow -tune animation -b:v "$1k" \
    -pass 1 -passlogfile "$B/p2" -an -f null /dev/null
  ffmpeg -v error -y -i "$B/video-only.mp4" -i "$B/audio/mix.wav" -map 0:v -map 1:a -vf "fps=$2,scale=-2:$5:flags=lanczos" -c:v libx264 -preset slow \
    -tune animation -b:v "$1k" -pass 2 -passlogfile "$B/p2" -af "volume=${GAIN}dB" -c:a aac -b:a "$3" -ar 48000 -shortest \
    -movflags +faststart "$4"
}
enc "$VB_MAIN" "$FPS" 192k "livrables/$NAME.mp4" 1080
enc "$VB_PREV" 30 128k "livrables/$NAME-apercu.mp4" "$PREV_H"
if [ "$FILM" != long ]; then
  ffmpeg -v error -y -i "$B/audio/mix.wav" -af "volume=${GAIN}dB" "livrables/bande-son-$FILM.wav"
else
  ffmpeg -v error -y -i "$B/audio/mix.wav" -af "volume=${GAIN}dB" livrables/bande-son-complete.wav
  cp "$B/audio/music.wav" livrables/piste-musique.wav
  cp "$B/audio/sfx.wav" livrables/piste-bruitages.wav
fi
ls -lh livrables
