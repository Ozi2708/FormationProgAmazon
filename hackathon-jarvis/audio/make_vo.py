#!/usr/bin/env python3
"""Voix off française synthétisée, posée sur la bande-son du film.

Lit build/vo-fr.json (produit par `python3 tools/voiceover.py fr`) : une phrase par entrée, avec son instant de départ.
Chaque phrase est synthétisée séparément puis posée à son instant ; si elle déborde sur la suivante,
elle est légèrement accélérée (jusqu'à x1,12) et signalée. La musique et les bruitages sont abaissés
sous la voix (« ducking »), puis le tout est mixé à -16 LUFS.

Moteurs (variable VO_ENGINE) :
  elevenlabs  ELEVENLABS_API_KEY requis · ELEVEN_VOICE_ID (voix française de la bibliothèque) · modèle eleven_multilingual_v2
  polly       identifiants AWS de l'environnement · POLLY_VOICE (Remi par défaut, ou Lea) · moteur neural
  piper       hors ligne, pour vérifier le minutage seulement (PIPER_MODEL = chemin du .onnx)

Usage : VO_ENGINE=elevenlabs python3 audio/make_vo.py [build/vo-fr.json] [build/audio/mix.wav] [build/vo-fr]
"""
import json
import os
import subprocess
import sys
import urllib.request

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LINES = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'build', 'vo-fr.json')
BED = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'build', 'audio', 'mix.wav')
OUT = sys.argv[3] if len(sys.argv) > 3 else os.path.join(ROOT, 'build', 'vo-fr')
ENGINE = os.environ.get('VO_ENGINE', 'elevenlabs')


def run(cmd, data=None):
    return subprocess.run(cmd, input=data, check=True, capture_output=True)


def to_wav(src, dst):
    """Tout format → WAV mono 48 kHz, voix nettoyée (passe-haut) et normalisée à -18 LUFS."""
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', str(SR),
         '-af', 'highpass=f=70,loudnorm=I=-18:TP=-2:LRA=7', dst])


# ---------------------------------------------------------------- moteurs
def tts_elevenlabs(text, prev, nxt, path):
    key = os.environ['ELEVENLABS_API_KEY']
    voice = os.environ.get('ELEVEN_VOICE_ID', 'onwK4e9ZLuTAKqWW03F9')
    body = json.dumps({
        'text': text, 'model_id': os.environ.get('ELEVEN_MODEL', 'eleven_multilingual_v2'),
        'previous_text': prev, 'next_text': nxt,
        'voice_settings': {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.35, 'use_speaker_boost': True},
    }).encode()
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128', data=body,
                                 headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    with urllib.request.urlopen(req, timeout=120) as r:
        open(path + '.mp3', 'wb').write(r.read())
    to_wav(path + '.mp3', path)


def tts_polly(text, prev, nxt, path):
    import boto3
    polly = boto3.client('polly', region_name=os.environ.get('AWS_REGION', 'eu-west-1'))
    ssml = f'<speak><prosody rate="{os.environ.get("POLLY_RATE", "104%")}">{text}</prosody></speak>'
    r = polly.synthesize_speech(Text=ssml, TextType='ssml', OutputFormat='mp3', SampleRate='24000',
                                VoiceId=os.environ.get('POLLY_VOICE', 'Remi'), Engine=os.environ.get('POLLY_ENGINE', 'neural'), LanguageCode='fr-FR')
    open(path + '.mp3', 'wb').write(r['AudioStream'].read())
    to_wav(path + '.mp3', path)


def tts_piper(text, prev, nxt, path):
    run([sys.executable, '-m', 'piper', '-m', os.environ['PIPER_MODEL'], '-f', path + '.raw.wav'], text.encode())
    to_wav(path + '.raw.wav', path)


ENGINES = {'elevenlabs': tts_elevenlabs, 'polly': tts_polly, 'piper': tts_piper}


def read(path):
    sr, x = wavfile.read(path)
    x = x.astype(np.float64) / 32768.0
    return x if x.ndim == 1 else x.mean(axis=1)


def lufs(path):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    vals = [l.split()[1] for l in out.splitlines() if l.strip().startswith('I:')]
    return float(vals[-1])


def main():
    os.makedirs(OUT, exist_ok=True)
    lines = json.load(open(LINES))
    sr, bed = wavfile.read(BED)
    bed = bed.astype(np.float64) / 32768.0
    n = bed.shape[0]
    voice = np.zeros(n)
    report = []
    for i, ln in enumerate(lines):
        clip = os.path.join(OUT, f'{i:02d}.wav')
        if not os.path.exists(clip) or os.environ.get('VO_FORCE'):
            prev = lines[i - 1]['text'] if i else ''
            nxt = lines[i + 1]['text'] if i + 1 < len(lines) else ''
            ENGINES[ENGINE](ln['text'], prev, nxt, clip)
        x = read(clip)
        # on retire les silences de début et de fin
        nz = np.where(np.abs(x) > 0.01)[0]
        x = x[max(0, nz[0] - 480):nz[-1] + 2400] if len(nz) else x
        end_limit = (lines[i + 1]['t'] - 0.15) if i + 1 < len(lines) else n / SR - 0.3
        room = end_limit - ln['t']
        dur = len(x) / SR
        speed = 1.0
        if dur > room:
            speed = min(1.12, dur / room)
            tmp = clip.replace('.wav', '.fast.wav')
            wavfile.write(tmp, SR, (x * 32767).astype(np.int16))
            run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'atempo={speed:.4f}', tmp + '.wav'])
            x = read(tmp + '.wav')
            dur = len(x) / SR
        i0 = int(ln['t'] * SR)
        seg = x[:max(0, min(len(x), n - i0))]
        voice[i0:i0 + len(seg)] += seg
        report.append((ln['t'], dur, room, speed, dur > room + 0.05))
    # ---------------------------------------------- ducking : la bande-son s'efface sous la voix
    env = np.abs(voice)
    win = int(0.03 * SR)
    env = np.convolve(env, np.ones(win) / win, mode='same')
    active = (env > 0.004).astype(np.float64)
    # enveloppe lissée (~0,25 s) : la bande-son descend avant la voix et remonte doucement après
    b, a = signal.butter(1, 1 / (0.25 * SR) * 2, output='ba')
    smooth = signal.filtfilt(b, a, active)
    smooth = np.clip(smooth, 0, 1)
    duck_db = float(os.environ.get('VO_DUCK_DB', 8.0))
    gain = 10 ** (-duck_db * smooth / 20)
    bed_d = bed * gain[:, None]
    # ---------------------------------------------- niveaux : voix à -16 LUFS, bande-son dessous
    vpath = os.path.join(OUT, 'voice.wav')
    wavfile.write(vpath, SR, (np.clip(voice, -1, 1) * 32767).astype(np.int16))
    vg = 10 ** ((-16.0 - lufs(vpath)) / 20)
    voice *= vg
    bpath = os.path.join(OUT, 'bed.wav')
    wavfile.write(bpath, SR, (np.clip(bed_d, -1, 1) * 32767).astype(np.int16))
    bg = 10 ** ((-22.5 - lufs(bpath)) / 20)
    mix = bed_d * bg + voice[:, None] * np.array([1.0, 1.0])
    peak = np.max(np.abs(mix))
    if peak > 0.89:
        mix = np.tanh(mix / peak * 1.4) / np.tanh(1.4) * 0.89
    wavfile.write(os.path.join(OUT, 'mix-fr.wav'), SR, (mix * 32767).astype(np.int16))
    wavfile.write(vpath, SR, (np.clip(voice, -1, 1) * 32767).astype(np.int16))
    print(f'engine={ENGINE} · mix → {os.path.join(OUT, "mix-fr.wav")}')
    for t, d, room, sp, over in report:
        flag = '  DÉBORDE' if over else ('  accéléré x%.2f' % sp if sp > 1.0 else '')
        print(f'  {t:7.2f}s  {d:5.2f}s / {room:5.2f}s{flag}')


if __name__ == '__main__':
    main()
