# J.A.R.V.I.S. — film de présentation (hackathon)

Film de motion design de **2:59**, en anglais, 1920×1080 à 60 i/s, qui présente J.A.R.V.I.S. :
le problème (l'information éparpillée), la révélation, puis cinq chapitres de fonctionnalités,
la confiance et la vision. La voix off se pose par-dessus ; la bande-son (musique + bruitages)
est déjà mixée assez bas pour la laisser passer.

## Livrables (`livrables/`)

| Fichier | Contenu |
|---|---|
| `JARVIS-hackathon.mp4` | le film en qualité finale (1080p, 60 i/s, 68 Mo) avec sa bande-son, prêt à recevoir la voix off |
| `JARVIS-hackathon-apercu.mp4` | copie légère (1080p, 30 i/s, < 30 Mo) pour la partager facilement |
| `bande-son-complete.wav` | la bande-son seule (musique + bruitages, -20 LUFS) |
| `piste-musique.wav` / `piste-bruitages.wav` | les deux pistes séparées, pour remixer autour de la voix |

Seul `JARVIS-hackathon.mp4` est versionné ; l'aperçu et les WAV sont recréés par `./build.sh`.

Le script de voix off, minuté, est dans [`SCRIPT-VOIX-OFF.md`](SCRIPT-VOIX-OFF.md) ;
`voix-off.srt` contient le même texte en sous-titres pour répéter dans VLC.

## Voir et modifier le film

Le film est une page HTML animée : **ouvre `index.html` dans Chrome**. La lecture démarre
toute seule ; `espace` met en pause, `←` `→` avancent ou reculent d'une seconde (`maj` : 5 s),
et `index.html#t=82` démarre directement à 1:22.

- **Textes et interfaces** : une scène par bloc dans `js/scenes-intro.js` (ouverture, tempête,
  chiffres, révélation), `js/scenes-features.js` (chapitres 01-02), `js/scenes-features2.js`
  (chapitres 03-05) et `js/scenes-end.js` (confiance, vision, fin).
- **Minutage** : toutes les scènes sont listées avec leur début et leur fin dans `TL`, en tête de
  `js/components.js`. Les scènes voisines se chevauchent de 0,4 s pour le fondu.
- **Bande-son** : `audio/make_audio.py` synthétise tout (aucun échantillon, aucun droit à payer).
  Les bruitages sont placés d'après les repères que chaque scène déclare avec `cue(...)`.

## Refabriquer la vidéo

Prérequis : Node.js avec Playwright (Chromium), ffmpeg, Python 3 avec numpy et scipy.

```bash
./build.sh            # film complet à 60 i/s (≈ 12 min sur 4 cœurs)
FPS=30 ./build.sh     # plus rapide, pour vérifier
node render.cjs --stills 31,82.5,150   # quelques images fixes dans build/stills
```

`build.sh` enchaîne : export des repères sonores → synthèse de la bande-son → rendu image par
image dans Chromium → assemblage avec ffmpeg dans `livrables/`.
