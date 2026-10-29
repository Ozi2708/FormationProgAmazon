# J.A.R.V.I.S. — film de présentation (hackathon)

Film de motion design de **3:43**, en anglais, 1920×1080 à 60 i/s, aux couleurs Amazon Ads, qui présente
J.A.R.V.I.S. comme **une seule plateforme** : le problème (trop d'informations pour tout voir), la révélation,
la carte des modules reliés au même cerveau, cinq chapitres de fonctionnalités vus *dans la même fenêtre*
(la barre latérale suit la navigation), le récapitulatif « All of this. One platform. », la confiance,
la boucle d'apprentissage et la vision. La voix off se pose par-dessus ; la bande-son (musique + bruitages)
est déjà mixée assez bas pour la laisser passer.

## Film d'intro v4 (1:30) — `pitch-v4.html`

Les 90 premières secondes de la vidéo du hackathon (4:59 au total ; la démo de 3:29 qui suit n'est pas ici).
Il dit à quoi sert JARVIS, pourquoi c'est différent, pour qui, combien de temps il rend, comment il marche et sur quoi il s'appuie.
Construit d'après le kit du film d'intro (`01_storyboard.md`, `02_on_screen_copy.md`) : 12 plans, textes repris tels quels, musique seule à 120 BPM.

| Temps | Plan |
|---|---|
| 0:00 | La matinée qui déborde : 9:09 → 9:58, « 90 emails. 6 meetings. 36 campaigns. Before 10 AM. » |
| 0:06 | La fatigue des outils : les onglets d'IA se multiplient, « Switching between them costs it. » |
| 0:10 | Révélation : point orange, halo doux, logo JARVIS, J.A.R.V.I.S. + smile, « Built on Aki · Powered by Claude » |
| 0:16 | How it works animé : sources → synchro toutes les 15 min → JARVIS (Claude, règles, mémoire) → agents → « Nothing is sent without you. » |
| 0:26 | « 90 emails. 3 lines. » : le flux se replie en briefing → 2h00 |
| 0:37 | « Under-delivery? Caught first. » : capture Campaigns animée, 27 % / x4.0 / EUR 4,027, tâche créée → 3h30 |
| 0:48 | « Your voice. Your data. » : notes → brouillon sourcé, « Never sent automatically » → « Sent by you » → 5h30 |
| 0:59 | « Walk in ready. » (6h30) puis « Setup errors? Caught before launch. » (8h00, about one working day) |
| 1:06 | « 8h back, every week. » : le vendredi rendu à nos clients (rendez-vous, deep dives, recommandations) · 29,440 h/an · « Even more customer obsessed. » |
| 1:14 | « Worldwide from day one. » NA · EMEA · APAC, rôles PSC · AST · AM · AE |
| 1:18 | « Sharper every day. » : chaque e-mail, document, résultat et correction nourrit le logo JARVIS, qui monte en puissance comme un réacteur |
| 1:24 | « Stop searching. Start consulting. » → « Let's see it live. » : l'iris s'ouvre sur l'écran d'accueil |

- Découpage, compteur et chiffres : `js/pitch-v4/config.js`. Plans : `v4-open.js` (1-4), `v4-proof.js` (5-8), `v4-close.js` (9-12, compteur, musique).
- Les captures de la plateforme sont les recréations de la v3 (`js/pitch-v3/`), animées ; aucun nom de personne ni adresse e-mail.
- `FILM=v4 ./build.sh` fabrique `livrables/JARVIS-intro-v4.mp4` (1080p30, 90,0 s, < 29 Mo), non versionné ;
  `node tools/check-v4.cjs` vérifie la durée, le compteur, l'impact et l'absence de `TODO` ou d'e-mail.

## Film jury v3 (1:27) — `pitch-v3.html`

Même rôle que la v2 (juste avant la démo live), refait sur la **nouvelle plateforme JARVIS** : son interface est recréée à l'identique
(barre latérale, briefing de 08:00, tableau Sev 1/2/3, toasts, pages) avec le logo officiel du kit, et filmée par une caméra.

| Temps | Scène |
|---|---|
| 0:00–0:08 | 9:09 AM, les notifications s'empilent : « 90 emails. 14 meetings. 12 campaigns. Before 10 AM. » |
| 0:08–0:14 | Le logo JARVIS se dessine : « Your day, read and ranked. » ; il glisse à sa place dans la barre latérale |
| 0:14–0:21 | Briefing de 08:00 : « 4 things need you. » → compteur 2h00 |
| 0:21–0:30 | Tableau Sev 1/2/3 : une tâche cochée (« Done… Undo »), Interbev glissé de Sev 3 à Sev 1 (« JARVIS had it at Sev 3… »), le Top 5 se réordonne |
| 0:30–0:41 | Tâche Poltronesofa : ce que JARVIS attend de vous, chiffres du DSP, brouillon dans la voix de Val (90/100) → 4h00 |
| 0:41–0:46 | Campaigns : carte du pacing, 56 campagnes, 4 à rattraper → 5h30 |
| 0:46–0:51 | Troubleshooting : un export glissé, « 5 errors to fix before launch » |
| 0:51–0:56 | Agenda : la préparation de la réunion de 09:45 → 6h30 |
| 0:56–1:00 | WBR Poltronesofa déjà écrit → 8h00 |
| 1:00–1:09 | « What JARVIS learned about Val » : sa voix, une leçon apprise (« Lesson confirmed ») |
| 1:09–1:19 | « 8h back, every week » → 15 PSC = 3 FTE → 80 PSC = 16 FTE · 29,440 h/an |
| 1:19–1:27 | « Stop searching. Start consulting. » → logo JARVIS → « Let's see it live. » |

- Les chiffres (accroche, gains de temps, PSC, heures, semaines) sont dans `js/pitch-v3/config.js`.
- Annonceurs et agences sont ceux de la plateforme ; **les personnes portent des noms fictifs** et aucune adresse e-mail n'apparaît.
- `FILM=v3 ./build.sh` fabrique `livrables/JARVIS-jury-v3.mp4` (1080p30, < 29 Mo) et `JARVIS-jury-v3-apercu.mp4` (720p),
  non versionnés (le dépôt est public). `node tools/check-v3.cjs` vérifie la durée, le compteur, l'impact et l'absence de `TODO` ou d'e-mail.
- Fichiers : `js/pitch-v3/v3-ui.js` (logo, styles de la plateforme, coquille), `v3-pages.js` (contenu des pages),
  `v3-intro.js` (accroche, révélation), `v3-app.js` (la scène dans la plateforme : repères, caméra, légendes, toasts),
  `v3-end.js` (impact, fin, repères de la musique). Script détaillé : `SCRIPT-JURY-V3.md`.

## Film jury v2 (90 s) — `pitch-v2.html`

Diffusé juste avant la démo live : il accroche, explique ce que la démo ne montre pas (le problème, l'architecture, l'impact à l'échelle)
et passe le relais au live.

| Temps | Scène |
|---|---|
| 0:00–0:08 | 9:09 AM, les notifications s'empilent : « 90 emails. 14 meetings. 12 campaigns. Before 10 AM. » |
| 0:08–0:14 | J.A.R.V.I.S. — « Your second brain. It reads, remembers, and acts. » |
| 0:14–0:24 | How it works : Sources → Connectors → Memory → Agents → You approve |
| 0:24–0:36 | « 90 emails. 3 lines. » (briefing) → compteur 2h00 |
| 0:36–0:48 | « Under-delivery? Caught first. » (pacing → KPI → tâche) → 3h30 |
| 0:48–1:00 | « Your voice. Your data. » + « Never sent automatically » / « Sent by you » → 5h30 |
| 1:00–1:08 | Montage : réunion préparée la veille (→ 6h30), deck + WBR (→ 8h00) |
| 1:08–1:18 | « 8h back, every week » → 15 PSC = 3 FTE → 80 PSC = 16 FTE · 29,440 h/an (+ citation pilote si renseignée) |
| 1:18–1:23 | « Sharper every day. » |
| 1:23–1:30 | « Stop searching. Start consulting. » → « Let's see it live. » sur l'écran d'accueil |

- **Tous les chiffres et réglages** sont dans `js/pitch-v2/config.js` : comptes de l'accroche, gains de temps, nombre de PSC,
  heures de travail, semaines par an, citation pilote, `ANONYMIZE` (remplace les noms de clients, agences et personnes partout),
  `TARGET_DURATION` (90, ou 120 : les trois moments forts passent à 18 s et « Next: Salesforce » revient).
  Une valeur `TODO` n'est jamais affichée : l'élément est omis.
- Les écrans de l'application sont les recréations de la v1, inchangées, filmées par une caméra (zooms, recadrages) pour que le texte
  qui compte fasse au moins 28 px à l'écran.
- `FILM=v2 ./build.sh` fabrique `livrables/JARVIS-jury-v2.mp4` (1080p30, < 29 Mo) et `JARVIS-jury-v2-apercu.mp4` (720p) ;
  ces deux fichiers ne sont pas versionnés (le dépôt est public).
- `node tools/check-v2.cjs` vérifie la durée, les paliers du compteur, les chiffres d'impact, l'absence de `TODO` à l'écran
  et liste les textes qui restent sous 28 px.

## Version pitch 2:00 (`pitch.html`)

Une version courte, pensée pour être comprise d'un coup d'œil pendant un pitch en direct :

1. **Le problème** (0:00–0:17) : 9:00, la tempête de notifications, l'horloge file jusqu'à 11:48, « No one can read it all ».
2. **Le produit** (0:17–0:33) : J.A.R.V.I.S., *the AI co-pilot of the PSC*, puis le schéma en trois temps :
   *Reads everything* (les sources) → *Knows what matters* (le cerveau) → *Does the work* (les résultats). « One brain. One platform. »
3. **Ce qu'il fait** (0:33–1:31) : cinq moments montrés en grand dans la même fenêtre (briefing, pacing → tâche chiffrée,
   mail dans ta voix + note réécrite, réunion préparée la veille, deck + WBR), puis la grille « One platform. All of it. ».
   À chaque moment, une puce « avant → après » et un compteur de temps gagné qui monte jusqu'à 8 h par semaine.
4. **Pourquoi** (1:31–2:00) : 8 h rendues chaque semaine, la confiance (rien ne part tout seul), l'apprentissage, la suite, la signature.

La trame de ce que tu peux dire en direct, minutée, est dans [`PITCH-2MIN.md`](PITCH-2MIN.md) (`pitch-2min.srt` pour répéter dans VLC).

**Temps gagné : ce sont des estimations à valider.** Elles sont réunies dans `GAINS`, en tête de `js/pitch/p-app.js` :

| Moment | Avant → avec J.A.R.V.I.S. | Par semaine | Hypothèse |
|---|---|---|---|
| Briefing du matin | 30 min → 5 min par jour | 2 h | 25 min × 5 jours |
| Suivi du pacing | 20 min → 2 min par jour | 1 h 30 | 18 min × 5 jours |
| Mail client | 15 min → 3 min par mail | 2 h | 12 min × 10 mails |
| Prépa de réunion | 20 min → 0 par réunion | 1 h | 20 min × 3 réunions |
| Deck + WBR | 1 h 45 → 15 min par semaine | 1 h 30 | deck 1 h → 10 min, WBR 45 → 5 min |

Change les valeurs dans `GAINS` (champ `week` en minutes) : les puces, le compteur et l'écran « 8 h » suivent.
`FILM=pitch ./build.sh` refabrique la vidéo ; `pitch.html` s'ouvre dans Chrome comme `index.html`.

## Livrables (`livrables/`)

| Fichier | Contenu |
|---|---|
| `JARVIS-hackathon.mp4` | le film en qualité finale (1080p, 60 i/s, < 100 Mo) avec sa bande-son, prêt à recevoir la voix off |
| `JARVIS-hackathon-apercu.mp4` | copie légère (1080p, 30 i/s, < 30 Mo) pour la partager facilement |
| `bande-son-complete.wav` | la bande-son seule (musique + bruitages, -20 LUFS) |
| `piste-musique.wav` / `piste-bruitages.wav` | les deux pistes séparées, pour remixer autour de la voix |
| `JARVIS-pitch-EN.mp4` | le film long avec une voix off anglaise de synthèse, en mode pitch (script : `SCRIPT-PITCH-EN.md`) |
| `JARVIS-pitch-2min.mp4` | **la version pitch de 2:00** (1080p, 60 i/s), avec sa bande-son, sans voix |
| `JARVIS-pitch-2min-apercu.mp4` | sa copie légère (30 i/s, < 30 Mo) |

Seuls les MP4 en qualité finale sont versionnés ; les aperçus et les WAV sont recréés par `./build.sh` et `./tools/voiced.sh`.

### Versions avec voix off de synthèse

`./tools/voiced.sh en` (ou `fr`) génère la voix phrase par phrase, vérifie que chaque phrase tient dans sa scène,
abaisse la musique sous la voix et remplace la piste son du film déjà fabriqué (pas de nouveau rendu).
Le moteur se choisit avec `VO_ENGINE` : `piper` (hors ligne), `polly` (Amazon Polly) ou `elevenlabs` (clé `ELEVENLABS_API_KEY`).
Les textes sont dans `tools/voiceover.py` (`LINES_ENP` pour l'anglais, `LINES_FR` pour le français).

Voix anglaise actuelle : Piper `en-us-ryan-high`, entraînée sur RyanSpeech (licence CC BY-NC-SA 4.0 : usage non commercial, avec attribution).

Le script de voix off, minuté, est dans [`SCRIPT-VOIX-OFF.md`](SCRIPT-VOIX-OFF.md) ;
`voix-off.srt` contient le même texte en sous-titres pour répéter dans VLC. Les deux sont générés par
`tools/voiceover.py` à partir du minutage réel des scènes : modifie le texte dans ce script, pas dans les fichiers produits.

## Voir et modifier le film

Le film est une page HTML animée : **ouvre `index.html` dans Chrome**. La lecture démarre
toute seule ; `espace` met en pause, `←` `→` avancent ou reculent d'une seconde (`maj` : 5 s),
et `index.html#t=82` démarre directement à 1:22.

- **Textes et interfaces** : une scène par bloc dans `js/scenes-intro.js` (logo, ouverture, tempête,
  avalanche, révélation), `js/scenes-features.js` (chapitres 01-02), `js/scenes-features2.js`
  (chapitres 03-05) et `js/scenes-end.js` (confiance, apprentissage, vision, fin).
- **Plateforme** : la fenêtre de l'application (`WIN`, `shellHTML()` dans `js/components.js`) reste à l'écran
  du plan « platform » au plan « allinone » ; chaque fonctionnalité affiche son contenu dans sa zone de contenu
  et `NAV_OF` dit quelle rubrique de la barre latérale s'allume pour chaque scène.
- **Minutage** : l'enchaînement des scènes et leur durée sont dans `SEQ`, en tête de `js/components.js`.
  Les scènes voisines se chevauchent de 0,4 s pour le fondu ; le reste (son, script) suit automatiquement.
- **Marque** : le logo Amazon Ads et le smile, vectorisés depuis `assets/img/amazon-ads-blanc.png`, sont dans `js/brand.js`.
- **Bande-son** : `audio/make_audio.py` synthétise tout (aucun échantillon, aucun droit à payer).
  Les bruitages sont placés d'après les repères que chaque scène déclare avec `cue(...)`.

## Refabriquer la vidéo

Prérequis : Node.js avec Playwright (Chromium), ffmpeg, Python 3 avec numpy et scipy.

```bash
./build.sh            # film complet à 60 i/s (≈ 10 min sur 4 cœurs)
FILM=pitch ./build.sh # version pitch 2:00 (≈ 6 min)
FILM=v3 ./build.sh    # film jury v3, 1:27 en 1080p30 (nouvelle plateforme)
FILM=v2 ./build.sh    # film jury v2, 90 s en 1080p30 (≈ 4 min)
FPS=30 ./build.sh     # plus rapide, pour vérifier
node render.cjs --stills 31,82.5,150   # quelques images fixes dans build/stills
node render.cjs --page pitch.html --stills 29.5,49.6 --outdir build/pitch/stills
```

`build.sh` enchaîne : export des repères sonores → synthèse de la bande-son → rendu image par
image dans Chromium → assemblage avec ffmpeg dans `livrables/`.
