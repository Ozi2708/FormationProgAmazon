#!/usr/bin/env bash
# Version « pitch » avec voix off synthétisée, posée sur le film déjà fabriqué par ./build.sh.
#   ./tools/voiced.sh en      voix anglaise (Piper en-us-ryan-high par défaut)
#   ./tools/voiced.sh fr      voix française
# Moteur au choix : VO_ENGINE=piper|polly|elevenlabs (voir audio/make_vo.py).
# La vidéo n'est pas réencodée : on reprend celle de livrables/ et on remplace seulement la piste son.
set -euo pipefail
cd "$(dirname "$0")/.."
L=${1:-en}
U=$(echo "$L" | tr a-z A-Z)
node render.cjs --cues build/cues.json >/dev/null
if [ "$L" = fr ]; then python3 tools/voiceover.py fr; export VO_LANG=${VO_LANG:-fr-FR}
else python3 tools/voiceover.py en-pitch; export VO_LANG=${VO_LANG:-en-US}; fi
J=build/vo-$L.json
python3 audio/make_vo.py "$J" build/audio/mix.wav "build/vo-$L"
for v in "" "-apercu"; do
  ab=$([ -z "$v" ] && echo 256k || echo 128k)
  ffmpeg -v error -y -i "livrables/JARVIS-hackathon$v.mp4" -i "build/vo-$L/mix-vo.wav" -map 0:v -map 1:a -c:v copy \
    -c:a aac -b:a "$ab" -ar 48000 -shortest -movflags +faststart "livrables/JARVIS-pitch-$U$v.mp4"
done
cp "build/vo-$L/voice.wav" "livrables/voix-off-$L.wav"
ls -lh livrables/JARVIS-pitch-$U*.mp4
