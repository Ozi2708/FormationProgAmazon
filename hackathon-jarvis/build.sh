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

echo "1/4 repères sonores"
node render.cjs --cues build/cues.json

echo "2/4 bande-son"
python3 audio/make_audio.py build/cues.json build/audio
I=$(ffmpeg -hide_banner -nostats -i build/audio/mix.wav -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}')
GAIN=$(python3 -c "print(round($LUFS - ($I), 2))")
echo "   mix à $I LUFS → gain $GAIN dB (cible $LUFS LUFS)"

echo "3/4 rendu vidéo ($FPS i/s)"
node render.cjs --fps "$FPS" --workers "$WORKERS" --out build/video-only.mp4

echo "4/4 assemblage"
ffmpeg -v error -y -i build/video-only.mp4 -i build/audio/mix.wav -map 0:v -map 1:a -c:v copy \
  -af "volume=${GAIN}dB" -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart livrables/JARVIS-hackathon.mp4
# copie d'aperçu légère (< 30 Mo, 1080p 30 i/s) pour l'envoyer facilement
ffmpeg -v error -y -i build/video-only.mp4 -vf fps=30 -c:v libx264 -preset slow -tune animation -b:v 1150k \
  -pass 1 -passlogfile build/p2 -an -f null /dev/null
ffmpeg -v error -y -i build/video-only.mp4 -i build/audio/mix.wav -map 0:v -map 1:a -vf fps=30 -c:v libx264 -preset slow \
  -tune animation -b:v 1150k -pass 2 -passlogfile build/p2 -af "volume=${GAIN}dB" -c:a aac -b:a 128k -shortest \
  -movflags +faststart livrables/JARVIS-hackathon-apercu.mp4
ffmpeg -v error -y -i build/audio/mix.wav -af "volume=${GAIN}dB" livrables/bande-son-complete.wav
cp build/audio/music.wav livrables/piste-musique.wav
cp build/audio/sfx.wav livrables/piste-bruitages.wav
ls -lh livrables
