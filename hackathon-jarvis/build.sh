#!/usr/bin/env bash
# Fabrique le film complet : repères sonores → bande-son → rendu vidéo → assemblage.
#   ./build.sh               (60 i/s, 4 processus)
#   FPS=30 ./build.sh        (plus rapide, pour un aperçu)
set -euo pipefail
cd "$(dirname "$0")"
FPS=${FPS:-60}
WORKERS=${WORKERS:-4}
LUFS=${LUFS:--20}
mkdir -p build livrables

echo "1/4 repères sonores + script de voix off"
node render.cjs --cues build/cues.json
python3 tools/voiceover.py

echo "2/4 bande-son"
python3 audio/make_audio.py build/cues.json build/audio
I=$(ffmpeg -hide_banner -nostats -i build/audio/mix.wav -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}')
GAIN=$(python3 -c "print(round($LUFS - ($I), 2))")
echo "   mix à $I LUFS → gain $GAIN dB (cible $LUFS LUFS)"

echo "3/4 rendu vidéo ($FPS i/s)"
node render.cjs --fps "$FPS" --workers "$WORKERS" --out build/video-only.mp4

echo "4/4 assemblage"
# encodage en deux passes, taille visée calculée d'après la durée :
#   film final ≈ 90 Mo (sous la limite GitHub de 100 Mo), aperçu < 29 Mio (envoi facile)
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 build/video-only.mp4)
VB_MAIN=$(python3 -c "print(int(90e6*8/$DUR/1000) - 256)")
VB_PREV=$(python3 -c "print(int(29*1048576*8/$DUR/1000) - 140)")
enc() { # $1 = débit vidéo (k) · $2 = i/s · $3 = débit audio · $4 = sortie
  ffmpeg -v error -y -i build/video-only.mp4 -vf "fps=$2" -c:v libx264 -preset slow -tune animation -b:v "$1k" \
    -pass 1 -passlogfile build/p2 -an -f null /dev/null
  ffmpeg -v error -y -i build/video-only.mp4 -i build/audio/mix.wav -map 0:v -map 1:a -vf "fps=$2" -c:v libx264 -preset slow \
    -tune animation -b:v "$1k" -pass 2 -passlogfile build/p2 -af "volume=${GAIN}dB" -c:a aac -b:a "$3" -ar 48000 -shortest \
    -movflags +faststart "$4"
}
enc "$VB_MAIN" "$FPS" 256k livrables/JARVIS-hackathon.mp4
enc "$VB_PREV" 30 128k livrables/JARVIS-hackathon-apercu.mp4
ffmpeg -v error -y -i build/audio/mix.wav -af "volume=${GAIN}dB" livrables/bande-son-complete.wav
cp build/audio/music.wav livrables/piste-musique.wav
cp build/audio/sfx.wav livrables/piste-bruitages.wav
ls -lh livrables
