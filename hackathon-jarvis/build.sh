#!/usr/bin/env bash
# Fabrique un film : repères sonores → bande-son → rendu vidéo → assemblage.
#   ./build.sh                 film long (3:43, index.html)
#   FILM=pitch ./build.sh      version pitch (2:00, pitch.html)
#   FPS=30 ./build.sh          plus rapide, pour un aperçu
set -euo pipefail
cd "$(dirname "$0")"
FPS=${FPS:-60}
WORKERS=${WORKERS:-4}
LUFS=${LUFS:--20}
FILM=${FILM:-long}
if [ "$FILM" = pitch ]; then
  PAGE=pitch.html; B=build/pitch; NAME=JARVIS-pitch-2min; MAIN_MB=70
else
  PAGE=index.html; B=build; NAME=JARVIS-hackathon; MAIN_MB=90
fi
mkdir -p "$B" livrables

echo "1/4 repères sonores"
node render.cjs --page "$PAGE" --cues "$B/cues.json"
[ "$FILM" = pitch ] || python3 tools/voiceover.py

echo "2/4 bande-son"
python3 audio/make_audio.py "$B/cues.json" "$B/audio"
I=$(ffmpeg -hide_banner -nostats -i "$B/audio/mix.wav" -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}')
GAIN=$(python3 -c "print(round($LUFS - ($I), 2))")
echo "   mix à $I LUFS → gain $GAIN dB (cible $LUFS LUFS)"

echo "3/4 rendu vidéo ($FPS i/s)"
node render.cjs --page "$PAGE" --fps "$FPS" --workers "$WORKERS" --out "$B/video-only.mp4"

echo "4/4 assemblage"
# encodage en deux passes, taille visée calculée d'après la durée :
#   film final sous la limite GitHub de 100 Mo, aperçu < 29 Mio (envoi facile)
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$B/video-only.mp4")
VB_MAIN=$(python3 -c "print(int($MAIN_MB*1e6*8/$DUR/1000) - 256)")
VB_PREV=$(python3 -c "print(int(29*1048576*8/$DUR/1000) - 140)")
enc() { # $1 = débit vidéo (k) · $2 = i/s · $3 = débit audio · $4 = sortie
  ffmpeg -v error -y -i "$B/video-only.mp4" -vf "fps=$2" -c:v libx264 -preset slow -tune animation -b:v "$1k" \
    -pass 1 -passlogfile "$B/p2" -an -f null /dev/null
  ffmpeg -v error -y -i "$B/video-only.mp4" -i "$B/audio/mix.wav" -map 0:v -map 1:a -vf "fps=$2" -c:v libx264 -preset slow \
    -tune animation -b:v "$1k" -pass 2 -passlogfile "$B/p2" -af "volume=${GAIN}dB" -c:a aac -b:a "$3" -ar 48000 -shortest \
    -movflags +faststart "$4"
}
enc "$VB_MAIN" "$FPS" 256k "livrables/$NAME.mp4"
enc "$VB_PREV" 30 128k "livrables/$NAME-apercu.mp4"
if [ "$FILM" = pitch ]; then
  ffmpeg -v error -y -i "$B/audio/mix.wav" -af "volume=${GAIN}dB" livrables/bande-son-pitch.wav
else
  ffmpeg -v error -y -i "$B/audio/mix.wav" -af "volume=${GAIN}dB" livrables/bande-son-complete.wav
  cp "$B/audio/music.wav" livrables/piste-musique.wav
  cp "$B/audio/sfx.wav" livrables/piste-bruitages.wav
fi
ls -lh livrables
