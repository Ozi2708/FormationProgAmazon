#!/usr/bin/env python3
"""Bande-son du film J.A.R.V.I.S. — entièrement synthétisée (aucun échantillon, aucun droit).

Lit build/cues.json (exporté par `node render.cjs --cues build/cues.json`) et écrit :
  build/audio/music.wav  nappe musicale
  build/audio/sfx.wav    bruitages calés sur l'image
  build/audio/mix.wav    les deux, mixés sous la voix (≈ -21 LUFS)

Usage : python3 audio/make_audio.py [build/cues.json] [build/audio]
"""
import json
import os
import sys

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
rng = np.random.default_rng(7)

CUES = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'build', 'cues.json')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), '..', 'build', 'audio')
data = json.load(open(CUES))
DUR = float(data['duration'])
TL = data['tl']
N = int((DUR + 0.5) * SR)


# ---------------------------------------------------------------- outils
def tt(d):
    return np.arange(int(d * SR)) / SR


def note(name_or_midi):
    return 440.0 * 2 ** ((name_or_midi - 69) / 12)


def sos(kind, f, order=2):
    nyq = SR / 2
    if kind == 'bp':
        return signal.butter(order, [max(20, f[0]) / nyq, min(f[1], nyq * 0.95) / nyq], 'bandpass', output='sos')
    return signal.butter(order, min(f, nyq * 0.95) / nyq, kind, output='sos')


def filt(x, kind, f, order=2):
    return signal.sosfilt(sos(kind, f, order), x, axis=-1)


def sweep(x, f0, f1, q=1.2, curve=None, block=256):
    """Passe-bande dont la fréquence centrale glisse de f0 à f1 (par blocs)."""
    out = np.zeros_like(x)
    n = len(x)
    zi = None
    for i in range(0, n, block):
        u = i / max(1, n - 1)
        u = curve(u) if curve else u
        fc = f0 * (f1 / f0) ** u if f0 > 0 and f1 > 0 else f0 + (f1 - f0) * u
        bw = fc / q
        s = sos('bp', (fc - bw / 2, fc + bw / 2), 1)
        if zi is None or zi.shape[0] != s.shape[0]:
            zi = signal.sosfilt_zi(s) * 0
        out[i:i + block], zi = signal.sosfilt(s, x[i:i + block], zi=zi)
    return out


def pan2(x, p):
    """Mono → stéréo, panoramique à puissance constante (p ∈ [-1, 1])."""
    a = (p + 1) * np.pi / 4
    return np.vstack([x * np.cos(a), x * np.sin(a)])


def place(buf, x, t, gain=1.0, p=0.0):
    if x.ndim == 1:
        x = pan2(x, p)
    i = int(round(t * SR))
    if i >= buf.shape[1] or i + x.shape[1] <= 0:
        return
    j0 = max(0, -i)
    j1 = min(x.shape[1], buf.shape[1] - i)
    buf[:, i + j0:i + j1] += gain * x[:, j0:j1]


def expd(n_or_t, k):
    t = n_or_t if isinstance(n_or_t, np.ndarray) else tt(n_or_t)
    return np.exp(-t * k)


def fade(x, a=0.005, r=0.02):
    n = x.shape[-1]
    e = np.ones(n)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return x * e


def ir(dur=2.6, k=2.6, pre=0.012, bright=6000, seed=1):
    r = np.random.default_rng(seed)
    t = tt(dur)
    e = np.exp(-t * k)
    L = filt(r.standard_normal(len(t)) * e, 'low', bright)
    R = filt(r.standard_normal(len(t)) * e, 'low', bright)
    pad = np.zeros(int(pre * SR))
    h = np.vstack([np.concatenate([pad, L]), np.concatenate([pad, R])])
    return h / np.sqrt((h ** 2).sum() / 2)


def reverb(x, h):
    mono = x.mean(axis=0) if x.ndim == 2 else x
    y = np.vstack([signal.oaconvolve(mono, h[0])[:len(mono)], signal.oaconvolve(mono, h[1])[:len(mono)]])
    return y


# ---------------------------------------------------------------- instruments
def saw(f, d, det=0.0):
    t = tt(d)
    return signal.sawtooth(2 * np.pi * f * (2 ** (det / 1200)) * t + rng.uniform(0, 6.28))


def pad_note(f, d, att=1.2, rel=1.8, cutoff=1400):
    """Nappe : 3 dents de scie désaccordées par canal, filtrées, enveloppe lente."""
    total = d + rel
    L = saw(f, total, -7) + saw(f, total, 5) + 0.3 * saw(f / 2, total, 2)
    R = saw(f, total, 7) + saw(f, total, -4) + 0.3 * saw(f / 2, total, -2)
    x = np.vstack([L, R])
    x = filt(x, 'low', cutoff, 2)
    n = x.shape[1]
    e = np.ones(n)
    na = int(att * SR)
    e[:na] = (np.linspace(0, 1, na)) ** 2
    nd = int(d * SR)
    e[nd:] = np.linspace(1, 0, n - nd) ** 1.5
    return x * e * 0.12


def sine_note(f, d, k=3.0):
    t = tt(d)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * k)


def pluck(f, d=0.9, bright=1.6, k=5.0):
    t = tt(d)
    idx = bright * np.exp(-t * 9)
    x = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * 2 * f * t)) * np.exp(-t * k)
    return fade(x, 0.002, 0.05)


def bell(f, d=1.2, ratio=3.5, idx=2.2, k=4.0):
    t = tt(d)
    x = np.sin(2 * np.pi * f * t + idx * np.exp(-t * 6) * np.sin(2 * np.pi * f * ratio * t)) * np.exp(-t * k)
    return fade(x, 0.001, 0.05)


def kick(d=0.5, f0=110, f1=44, k=7.5):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * k)
    x[:int(0.004 * SR)] += filt(rng.standard_normal(int(0.004 * SR)), 'high', 1500) * 0.3
    return fade(x, 0.0005, 0.03)


def hat(d=0.06, k=55, f=7000):
    t = tt(d)
    return fade(filt(rng.standard_normal(len(t)), 'high', f) * np.exp(-t * k), 0.0005, 0.01)


def noise(d):
    return rng.standard_normal(int(d * SR))


def whoosh(d=0.8, f0=300, f1=2600, peak=0.55, q=1.0, p0=-0.5, p1=0.5):
    x = noise(d)
    u = np.linspace(0, 1, len(x))
    env = np.where(u < peak, (u / peak) ** 2, ((1 - u) / (1 - peak)) ** 1.6)
    y = sweep(x, f0, f1, q, curve=lambda v: np.sin(v * np.pi / 2)) * env
    a = (np.linspace(p0, p1, len(x)) + 1) * np.pi / 4
    return fade(np.vstack([y * np.cos(a), y * np.sin(a)]), 0.01, 0.05)


def riser(d=3.0, f0=180, f1=5000):
    x = noise(d)
    u = np.linspace(0, 1, len(x))
    y = sweep(x, f0, f1, 1.6) * (u ** 2.2)
    ton = filt(saw(110, d) + saw(110 * 1.005, d), 'low', 900) * 0.12
    t = tt(d)
    gl = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (u * 2)) / SR) * 0.15
    return fade((y + ton * u ** 2 + gl * u ** 3), 0.05, 0.02)


def boom(d=2.6, f0=62, f1=30):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t * 3)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    x += filt(noise(d), 'low', 180) * np.exp(-t * 7) * 0.5
    return fade(x, 0.002, 0.2)


def click(f=2400):
    t = tt(0.03)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 260)
    x += filt(noise(0.03), 'high', 3000) * np.exp(-t * 500) * 0.5
    return fade(x, 0.0003, 0.005)


def tick(f=3200):
    t = tt(0.025)
    return fade(np.sin(2 * np.pi * f * t) * np.exp(-t * 320), 0.0003, 0.004)


def pop(f0=820, f1=380):
    t = tt(0.12)
    f = f1 + (f0 - f1) * np.exp(-t * 45)
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 32), 0.0005, 0.02)


def layer(*parts):
    """Superpose des signaux mono : layer((x, décalage_s, gain), ...)."""
    n = max(len(x) + int(o * SR) for x, o, g in parts)
    out = np.zeros(n)
    for x, o, g in parts:
        i = int(o * SR)
        out[i:i + len(x)] += g * x
    return out


def add(*xs):
    """Somme de signaux mono de longueurs différentes."""
    out = np.zeros(max(len(x) for x in xs))
    for x in xs:
        out[:len(x)] += x
    return out


def ping(f):
    return layer((bell(f, 0.9, 2.0, 1.2, 5.5), 0, 1.0), (bell(f * 1.5, 0.8, 2.0, 1.0, 6.5), 0.075, 0.55))


def keys(d):
    out = np.zeros(int((d + 0.1) * SR))
    t = 0.0
    while t < d:
        n = int(0.018 * SR)
        k = filt(noise(0.018), 'bp', (1300, 4200)) * np.exp(-tt(0.018) * 260) * rng.uniform(0.45, 1.0)
        k += sine_note(rng.uniform(170, 230), 0.018, 200) * 0.25
        i = int(t * SR)
        out[i:i + n] += k[:len(out) - i]
        t += rng.uniform(0.045, 0.09) if rng.random() > 0.08 else rng.uniform(0.12, 0.2)
    return out


def chime(fs=(659.25, 987.77)):
    x = np.zeros(int(1.4 * SR))
    for i, f in enumerate(fs):
        b = bell(f, 1.2, 3.0, 1.0, 4.5)
        j = int(i * 0.09 * SR)
        x[j:j + len(b)] += b[:len(x) - j]
    return x


def sparkle(n=7, d=0.5):
    x = np.zeros(int((d + 0.4) * SR))
    for _ in range(n):
        f = rng.uniform(2500, 6000)
        g = np.sin(2 * np.pi * f * tt(0.12)) * np.hanning(int(0.12 * SR))
        j = int(rng.uniform(0, d) * SR)
        x[j:j + len(g)] += g * rng.uniform(0.3, 1.0)
    return x


# ---------------------------------------------------------------- bruitages
SFX = np.zeros((2, N))
SEND = np.zeros((2, N))  # envoi vers la réverbération


def fx(x, t, g=1.0, p=0.0, rv=0.25):
    place(SFX, x, t, g, p)
    if rv:
        place(SEND, x, t, g * rv, p)


def count_ticks(t0, d, n=20):
    for i in range(1, n):
        u = -np.log2(1 - i / n) / 10
        if u > 1:
            break
        fx(tick(2800 + i * 25), t0 + d * u, 0.11, rng.uniform(-0.2, 0.2), 0.05)


def cue_sound(c):
    k, t, v = c['type'], c['t'], c.get('v', 1.0)
    p = rng.uniform(-0.25, 0.25)
    if k == 'tick':
        fx(tick(rng.uniform(2600, 3600)), t, 0.16 * v, p, 0.1)
    elif k == 'pop':
        fx(pop(rng.uniform(700, 900), 360), t, 0.35 * v, p, 0.2)
    elif k == 'card':
        fx(whoosh(0.28, 1200, 5000, 0.6, 1.4, -0.3, 0.3)[0], t - 0.1, 0.18 * v, p, 0.1)
        fx(pop(1100, 600), t + 0.12, 0.18 * v, p, 0.15)
    elif k == 'type':
        x = keys(c['d'])
        fx(x, t, 0.13 if c.get('fast') else 0.16, 0.1, 0.06)
    elif k == 'click':
        fx(click(), t, 0.42, 0.15, 0.12)
    elif k in ('swish', 'swoosh-up'):
        w = whoosh(0.42, 500 if k == 'swish' else 350, 4200, 0.55, 1.3, -0.4, 0.4)
        place(SFX, w, t - 0.15, 0.22 * v)
        place(SEND, w, t - 0.15, 0.05 * v)
    elif k == 'whoosh':
        w = whoosh(0.75, 250, 3500, 0.6, 1.0, -0.6, 0.6)
        place(SFX, w, t - 0.3, 0.32 * v)
        place(SEND, w, t - 0.3, 0.08 * v)
    elif k == 'absorb':
        d = 0.42
        x = sweep(noise(d), 400, 3000, 1.5) * np.linspace(0, 1, int(d * SR)) ** 2.5
        fx(x, t - d, 0.22 * v, -0.3, 0.2)
        fx(pop(600, 260), t, 0.35 * v, 0.1, 0.3)
    elif k == 'node':
        scale = [74, 76, 78, 81, 83, 86]
        fx(pluck(note(scale[c.get('n', 0) % 6]), 1.0, 1.2, 4.0), t, 0.2 * v, -0.6 + 0.24 * c.get('n', 0), 0.5)
    elif k == 'hit':
        x = add(kick(0.8, 120, 40, 5.0) * 0.8, filt(noise(0.4), 'low', 2200) * expd(0.4, 14) * 0.35)
        fx(x, t, 0.55 * v, 0, 0.45)
    elif k == 'success':
        fx(chime(), t, 0.22 * v, 0.1, 0.5)
    elif k == 'sparkle':
        fx(sparkle(), t, 0.1 * v, p, 0.9)
    elif k == 'count':
        count_ticks(t, c['d'])
    elif k == 'alert':
        x = layer((bell(note(64), 0.9, 1.0, 0.6, 5), 0, 1.0), (bell(note(60), 0.9, 1.0, 0.6, 5), 0.16, 1.0))
        fx(x, t, 0.2 * v, 0, 0.35)
    elif k == 'pulse':
        for i in range(2):
            fx(sine_note(520, 0.12, 30), t + i * 0.22, 0.18 * v, 0, 0.2)
    elif k == 'data':
        d = c['d']
        n = int(d / 0.07)
        for i in range(n):
            fx(tick(rng.uniform(1500, 3400)), t + i * 0.07 + rng.uniform(0, 0.03), 0.06 * np.sin(np.pi * i / n), rng.uniform(-0.6, 0.6), 0.2)
    elif k == 'rise':
        d = c['d']
        u = np.linspace(0, 1, int(d * SR))
        x = np.sin(2 * np.pi * np.cumsum(330 * 2 ** (u * 1.2)) / SR) * np.sin(np.pi * u) ** 2
        fx(x, t, 0.05, 0.2, 0.4)
    elif k == 'ping':
        fx(ping(note(81)), t, 0.25 * v, 0.4, 0.35)
    elif k == 'lock':
        fx(click(1800), t, 0.35, 0.2, 0.1)
        fx(click(1300), t + 0.07, 0.3, 0.2, 0.1)
        fx(sine_note(160, 0.25, 14), t + 0.05, 0.3, 0.2, 0.2)
    elif k == 'swell':
        pass  # porté par la musique
    elif k == 'final':
        fx(boom(3.0, 70, 32), t, 0.55, 0, 0.3)
        fx(sparkle(12, 1.2), t + 0.1, 0.14, 0, 1.0)
        fx(chime((587.33, 880.0, 1174.66)), t + 0.15, 0.2, 0, 0.8)
    elif k == 'logo':
        fx(whoosh(1.0, 300, 3800, 0.7, 1.0, -0.4, 0.4)[0], t - 0.5, 0.2, 0, 0.3)
        fx(chime((1174.66, 1760.0)), t + 0.1, 0.16, 0.1, 0.9)
        fx(sparkle(8, 0.7), t + 0.15, 0.08, 0, 1.0)
    elif k == 'freeze':
        fx(boom(2.8, 70, 30), t, 0.42, 0, 0.5)
        fx(filt(noise(0.25), 'low', 800) * expd(0.25, 18), t, 0.4, 0, 0.6)
    elif k == 'zoomout':
        d = c['d']
        w = whoosh(d, 3200, 260, 0.3, 0.8, -0.2, 0.2)
        place(SFX, w, t, 0.22); place(SEND, w, t, 0.12)
        u = np.linspace(0, 1, int(d * SR))
        gl = np.sin(2 * np.pi * np.cumsum(880 * 2 ** (-u * 2.5)) / SR) * np.sin(np.pi * u) ** 2
        fx(gl, t, 0.035, 0, 0.8)
    elif k == 'implode':
        d = c['d']
        x = sweep(noise(d), 300, 4500, 1.4) * np.linspace(0, 1, int(d * SR)) ** 2.6
        fx(x, t, 0.32, 0, 0.4)
        fx(kick(0.6, 120, 45, 6), t + d, 0.3, 0, 0.5)
    elif k == 'smile':
        w = whoosh(0.7, 600, 5200, 0.55, 1.2, -0.5, 0.5)
        place(SFX, w, t - 0.1, 0.2); place(SEND, w, t - 0.1, 0.08)
        fx(sparkle(9, 0.8), t + 0.3, 0.1, 0, 1.0)


def intro_sounds():
    o = TL['open'][0]
    # horloge
    for k in range(8):
        ts = o + 0.3 + k * 0.5
        if ts < o + 3.9:
            fx(click(1700 if k % 2 else 2100), ts, 0.07, 0, 0.05)
    fx(click(1200), o + 1.55, 0.25, 0, 0.2)
    fx(click(900), o + 1.78, 0.2, 0, 0.2)
    # la pastille s'emballe
    for i, ts in enumerate([2.15, 2.55, 2.9, 3.2, 3.45, 3.68, 3.9]):
        fx(ping(note(79 + (i % 3) * 2)), o + ts, 0.14 + i * 0.02, rng.uniform(-0.3, 0.3), 0.3)
    fx(whoosh(0.9, 200, 4000, 0.75, 0.9, 0, 0), o + 3.6, 0.32, 0, 0.1)
    # tempête : une notification par carte
    for ts in data['storm']:
        f = note(int(rng.choice([76, 79, 81, 83, 84, 86, 88])))
        depth = rng.uniform(0.35, 1.0)
        fx(ping(f), ts, 0.07 + 0.06 * depth, rng.uniform(-0.85, 0.85), 0.35)
    # avalanche : une texture de données qui s'étend avec le zoom arrière
    av = TL['avalanche'][0]
    for i in range(60):
        ts = av + 1.0 + (i / 60) ** 0.8 * 8.5
        fx(tick(rng.uniform(2200, 5200)), ts, 0.03 + 0.03 * rng.random(), rng.uniform(-0.9, 0.9), 0.4)
    # révélation
    rv = TL['reveal'][0]
    for i in range(6):
        fx(pop(900 - i * 40, 420), rv + 0.55 + i * 0.2, 0.22, [-0.8, -0.4, 0.4, 0.8, 0.4, -0.4][i], 0.35)
    fx(sparkle(14, 3.0), rv + 2.6, 0.06, 0, 1.0)
    fx(riser(3.6), rv + 2.65, 0.32, 0, 0.3)
    fx(whoosh(0.7, 300, 3000, 0.8, 1.0, 0, 0), rv + 5.6, 0.3, 0, 0.2)
    fx(boom(3.5, 75, 30), rv + 6.25, 0.5, 0, 0.5)
    fx(kick(1.0, 150, 36, 3.5), rv + 6.25, 0.5, 0, 0.6)
    fx(filt(noise(1.5), 'high', 3000) * expd(1.5, 3.5), rv + 6.25, 0.12, 0, 1.2)
    fx(whoosh(1.4, 150, 1800, 0.7, 0.8, 0, 0), rv + 10.4, 0.35, 0, 0.2)   # l'application se lève
    fx(whoosh(1.3, 300, 5000, 0.85, 0.9, 0, 0), rv + 13.0, 0.3, 0, 0.15)  # zoom
    # intertitres : impact + le smile qui se dessine
    for c in ('c1', 'c2', 'c3', 'c4', 'c5'):
        a = TL[c][0]
        fx(add(kick(0.7, 100, 40, 6) * 0.7, filt(noise(0.6), 'high', 4000) * expd(0.6, 7) * 0.12), a + 0.15, 0.32, 0, 0.5)
        fx(whoosh(0.8, 300, 3000, 0.7, 1.0, -0.3, 0.3), a - 0.35, 0.18, 0, 0.1)
        w = whoosh(0.6, 900, 5200, 0.5, 1.4, -0.4, 0.4)
        place(SFX, w, a + 0.45, 0.1); place(SEND, w, a + 0.45, 0.04)
    # transitions entre scènes
    skip = ('logo', 'open', 'storm', 'avalanche', 'reveal', 'outro')
    for k, (a, b) in TL.items():
        if k in skip or k.startswith('c'):
            continue
        fx(whoosh(0.6, 400, 2800, 0.6, 1.1, -0.5, 0.5), a - 0.2, 0.1, 0, 0.05)
    # passage au sombre (confiance)
    fx(whoosh(1.2, 3000, 250, 0.4, 0.9, 0.4, -0.4), TL['control'][0] - 0.4, 0.25, 0, 0.3)


# ---------------------------------------------------------------- musique
MUS = np.zeros((2, N))
MSEND = np.zeros((2, N))
BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
# accords (midi) : Dmaj9, Bm9, Gmaj9, A6sus
CHORDS = [[50, 57, 61, 64, 66], [47, 54, 57, 61, 62], [43, 50, 54, 57, 59], [45, 52, 57, 59, 62]]
ARP = [[62, 66, 69, 73, 76, 73, 69, 66], [59, 62, 66, 69, 73, 69, 66, 62], [55, 59, 62, 66, 69, 66, 62, 59], [57, 61, 64, 66, 69, 66, 64, 61]]


def mus(x, t, g=1.0, p=0.0, rv=0.4):
    place(MUS, x, t, g, p)
    if rv:
        place(MSEND, x, t, g * rv, p)


S_ = TL['storm'][0]
F_ = S_ + 7.1                      # gel de la tempête
A_ = TL['avalanche'][0]
R_ = TL['reveal'][0]
FL_ = R_ + 6.25                    # flash de la révélation
G_ = R_ + 10.7                     # l'application se lève, début du groove
C_ = TL['control'][0]
V_ = TL['sfdc'][0]
O_ = TL['outro'][0]


def level(t):
    """Intensité de la musique selon le moment du film (0..1)."""
    pts = [(0, 0.35), (S_, 0.5), (F_ - 0.1, 1.0), (F_ + 0.05, 0.0), (F_ + 0.8, 0.35), (R_, 0.4), (FL_ - 0.1, 1.0), (G_, 0.75),
           (TL['c1'][0], 0.8), (TL['c2'][0], 0.85), (TL['c5'][0], 0.95), (C_, 0.6), (V_, 0.75), (O_, 1.0), (DUR, 0.0)]
    xs, ys = zip(*pts)
    return float(np.interp(t, xs, ys))


def section(t):
    if t < S_: return 'open'
    if t < F_: return 'storm'
    if t < R_: return 'calm'
    if t < FL_: return 'build'
    if t < G_: return 'bloom'
    if t < C_: return 'groove'
    if t < V_: return 'trust'
    if t < O_: return 'vision'
    return 'outro'


def music():
    # drone grave jusqu'au groove
    d = G_
    t = tt(d)
    dr = (0.6 * np.sin(2 * np.pi * note(38) * t) + 0.6 * np.sin(2 * np.pi * note(50) * t + 0.3) + 0.25 * np.sin(2 * np.pi * note(57) * t)) * 0.07
    dr *= np.interp(t, [0, 2, F_, F_ + 0.15, A_ + 1.5, FL_ - 0.3, FL_, d], [0, 1, 1.25, 0, 0.6, 0.8, 0, 0])
    air = filt(noise(d), 'bp', (300, 1400)) * 0.012 * np.interp(t, [0, 3, F_, F_ + 0.15, A_ + 2, d], [0.3, 0.6, 1.6, 0, 0.5, 0.4])
    mus(np.vstack([dr + air, dr + air * 0.9]), 0, 1.0, 0, 0.3)
    # tempête : battements qui accélèrent + grappe dissonante qui s'ouvre
    tb = S_ + 0.3
    while tb < F_ - 0.1:
        u = (tb - S_) / 7.0
        mus(kick(0.5, 70, 38, 8), tb, 0.35 + 0.35 * u, 0, 0.1)
        tb += 0.9 - 0.62 * u
    cl = sum(pad_note(note(m), F_ - S_ - 0.2, 5.5, 0.15, 900) for m in [50, 51, 57, 58, 62])
    cl = filt(cl, 'low', 2600)
    mus(cl, S_ + 0.2, 0.5, 0, 0.5)
    mus(riser(F_ - S_ - 0.2, 120, 3000), S_ + 0.2, 0.12, 0, 0.3)
    # avalanche : Bm9 suspendu, vaste
    for m in [47, 54, 61, 62, 66, 73]:
        mus(pad_note(note(m), R_ + 1.0 - A_, 2.5, 3.0, 1000), A_ + 0.2, 0.3, 0, 0.7)
    # montée vers la révélation : arpège qui s'éclaire
    rv = R_
    k = 0
    ta = rv + 1.0
    while ta < rv + 6.2:
        u = (ta - rv - 1.0) / 5.2
        m = ARP[2 if ta < rv + 3.6 else 3][k % 8]
        mus(pluck(note(m), 0.7, 0.8 + 1.4 * u, 6), ta, 0.05 + 0.1 * u, (k % 2) * 0.5 - 0.25, 0.6)
        ta += BEAT / 2 if u < 0.6 else BEAT / 4
        k += 1
    # éclosion : Dmaj9 large
    for m in [38, 50, 57, 61, 64, 66, 69, 73]:
        mus(pad_note(note(m), 4.6, 0.05, 2.5, 2200), FL_, 0.32, 0, 0.7)
    # groove, jusqu'à l'accord final
    fin = O_ + 2.75
    bar = 0
    tb = G_
    while tb < fin - 0.3:
        sec = section(tb + 0.01)
        ch = bar % 4
        lv = level(tb)
        bright = {'groove': 1500, 'trust': 1100, 'vision': 2200, 'outro': 2400}.get(sec, 1400)
        dur_bar = min(BAR + 0.05, fin - tb)
        for m in CHORDS[ch]:
            mus(pad_note(note(m), dur_bar, 0.6, 1.4, bright), tb, 0.42 * lv, 0, 0.55)
        drums = sec in ('groove', 'vision') and tb >= TL['c1'][0] - 0.2
        bass = sec in ('groove', 'vision') and tb >= TL['c2'][0] - 0.2
        hats = (sec == 'groove' and tb >= TL['c2'][0] - 0.2) or sec == 'vision'
        for b in range(4):
            tq = tb + b * BEAT
            if tq >= fin - 0.2:
                break
            if drums and b in (0, 2):
                mus(kick(0.45, 95, 42, 9), tq, 0.32 * lv, 0, 0.05)
            if bass and b in (0, 2, 3):
                f = note(CHORDS[ch][0] - 12 + (12 if b == 3 else 0))
                bx = filt(saw(f, 0.5) * expd(0.5, 4), 'low', 420) * 0.5 + sine_note(f, 0.5, 4) * 0.6
                mus(fade(bx, 0.005, 0.05), tq, 0.22 * lv, 0, 0.05)
            n8 = 4 if sec == 'vision' else 2
            for h in range(n8):
                if hats:
                    mus(hat(0.05, 60, 7500), tq + h * BEAT / n8, (0.05 if h % 2 else 0.035) * lv, 0.3, 0.1)
        step = BEAT / 2 if sec in ('groove', 'vision') else BEAT
        nsteps = int(round(BAR / step))
        for i in range(nsteps):
            if tb + i * step >= fin - 0.2:
                break
            m = ARP[ch][(i * (8 // nsteps if nsteps < 8 else 1)) % 8] + (12 if sec == 'vision' and i % 4 == 3 else 0)
            mus(pluck(note(m), 0.6, 1.1, 7), tb + i * step, 0.055 * lv, -0.35 if i % 2 else 0.35, 0.55)
        bar += 1
        tb += BAR
    # montée finale (vision → fin)
    mus(riser(4.6, 200, 4500), O_ - 4.4, 0.16, 0, 0.3)
    # accord final, long, qui s'éteint avec l'image
    for m in [38, 50, 57, 61, 64, 66, 69, 74]:
        mus(pad_note(note(m), 3.8, 0.03, 2.6, 2600), fin, 0.55, 0, 0.85)


# ---------------------------------------------------------------- rendu
def main():
    os.makedirs(OUT, exist_ok=True)
    intro_sounds()
    for c in data['cues']:
        cue_sound(c)
    music()
    h1 = ir(2.8, 2.2, 0.02, 5000, 1)
    h2 = ir(1.6, 3.5, 0.01, 7000, 2)
    music_mix = MUS + 0.55 * reverb(MSEND, h1)
    sfx_mix = SFX + 0.45 * reverb(SEND, h2)
    # sécurité DC / infra-graves
    music_mix = filt(music_mix, 'high', 50)
    sfx_mix = filt(sfx_mix, 'high', 35)
    # fondu final
    tail = np.interp(np.arange(N) / SR, [0, DUR - 2.4, DUR], [1, 1, 0]) ** 1.5
    music_mix *= tail
    sfx_mix *= tail
    mix = 0.8 * music_mix + 1.0 * sfx_mix
    # limiteur doux puis normalisation
    peak = np.max(np.abs(mix))
    mix = np.tanh(mix / peak * 1.6) / np.tanh(1.6) * 0.7

    def write(name, x, g=1.0):
        y = np.clip(x * g, -1, 1)
        wavfile.write(os.path.join(OUT, name), SR, (y.T * 32767).astype(np.int16))

    write('mix.wav', mix)
    s = 0.7 / max(1e-9, np.max(np.abs(music_mix)))
    write('music.wav', music_mix, s)
    s = 0.7 / max(1e-9, np.max(np.abs(sfx_mix)))
    write('sfx.wav', sfx_mix, s)
    print('audio →', OUT)


if __name__ == '__main__':
    main()
