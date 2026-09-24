# Le Programmatique — site vitrine

Support de formation Amazon Ads transformé en site web navigable.
Préparé pour une présentation à **France** (Amazon Ads), août 2026.

## Ouvrir le site

Double-cliquez sur `index.html`. Tout fonctionne en local, sans serveur ni
installation : HTML, CSS et JavaScript natifs, aucune dépendance à installer.

Les polices (Inter + IBM Plex Mono) sont chargées depuis Google Fonts. Sans
connexion, le site bascule automatiquement sur les polices système — la mise en
page reste identique.

## Version anglaise — FR / EN

Le site existe en français (racine) et en anglais (dossier `en/`), avec les mêmes
noms de fichier : `index.html` ↔ `en/index.html`, etc. Le sélecteur **FR | EN** de
la barre du haut (ou le bouton en bas du menu mobile) bascule vers la page jumelle
en gardant la section en cours (`#enchere`, `#couts`…). Le format de session et le
mode présentation sont partagés entre les deux langues.

- **Textes des pages** : dans les fichiers `.html` de chaque langue. Une
  modification de contenu est à reporter dans les deux versions.
- **Textes générés par les scripts** (simulateurs, quiz, glossaire, recherche) :
  `assets/js/` choisit la langue d'après `<html lang>`. Les libellés courts passent
  par `T('français', 'English')`, les jeux de données ont leur double anglais —
  `QUESTIONS_EN` et `GLOSSARY_EN` dans `modules.js`, `INDEX_EN` dans `core.js`.
- En anglais, les montants s'écrivent `€8.40` et les pourcentages `12%`.
- Restent volontairement en français : les noms propres (sites, lieux) et la
  bannière de démonstration du simulateur, qui est une vraie campagne française.

## Mode présentation — un module par écran

Bouton 🖵 dans la barre du haut, ou touche **P**. Chaque section devient une
diapositive plein écran, sans défilement interne.

- **Navigation** : `→` `↓` `Espace` pour avancer, `←` `↑` pour reculer,
  `Échap` pour sortir. Une barre en bas affiche `4 / 14` et le titre courant.
- **Cadrage** : chaque diapositive est ancrée en haut, juste sous la barre de
  navigation — même position de titre d'un écran à l'autre, comme dans un deck.
  Seul le hero reste centré : c'est une page de garde.
- **Découpage automatique** : une section trop dense est coupée en plusieurs
  diapositives — les blocs de fin partent sur un écran « suite ». Les modules
  interactifs sont déplacés, pas recréés : le simulateur continue de tourner.
- **Mise à l'échelle** : ce qui dépasse encore est réduit juste assez pour
  tenir. Le module le plus dense (le simulateur d'enchère) descend à 74 % sur
  un écran 1600 × 900 ; tout le reste tient entre 80 % et 100 %.
- Le choix est mémorisé, comme le format de session.

En présentation, la sous-navigation, le bandeau de format et les animations
d'apparition sont masqués : le contenu est là dès que la diapositive arrive.

## Format de la session — 45 min / 1 h / 90 min

Première étape sur l'accueil : on choisit le créneau dont on dispose. Le site
s'articule alors différemment — les sections secondaires se masquent pour tenir
le timing, et l'essentiel reste au centre.

| | Essentiel | Standard | Complet |
|---|---|---|---|
| Durée | 45 min | 1 h | 90 min |
| Quiz | 5 min · 5 questions | 6 min · 8 questions | 9 min · 10 questions |
| 1 · Fondamentaux | 15 min · 5 sections | 24 min · 10 sections | 36 min · 11 sections |
| 2 · La campagne | 10 min · 4 sections | 12 min · 6 sections | 18 min · 6 sections |
| 3 · Le marché | 8 min · 3 sections | 9 min · 5 sections | 14 min · 7 sections |
| 4 · Sur le terrain | 7 min · 2 sections | 9 min · 5 sections | 13 min · 6 sections |
| **Total** | **14 sections · 4 simulateurs** | **26 sections · 8 simulateurs** | **30 sections · 11 simulateurs** |

Ce que chaque format laisse tomber :

- **45 min** garde le socle — définition, écosystème, enchère, first price, les
  six avantages, objectifs, data, paramétrage, mesure, cookies, position Amazon,
  inventaire Amazon, le cas déroulé et les objections.
- **1 h** ajoute le ciblage, le gré à gré, les deals, le paysage des DSP, les
  formats, l'optimisation, les alternatives au cookie, la CTV, les
  interlocuteurs, la structure de coûts et les erreurs de setup.
- **90 min** ajoute les approfondissements : chaîne d'achat (SPO), audio, DOOH
  et modèles d'achat.

Comment ça se pilote :

- **Accueil** — le bloc « Étape 1 », juste sous le hero.
- **Partout** — la puce `Format · 90 min` dans la barre du haut ouvre la modale.
- **En tête de chaque chapitre** — un bandeau rappelle le format actif, indique
  combien de sections sont masquées, et propose **« Afficher tout le plan »**
  pour revenir au parcours complet en un clic.

Le choix est mémorisé dans le navigateur (`localStorage`) et s'applique à toutes
les pages : sections, sous-navigation, liens de pied de page, nombre de questions
du quiz et résultats de la recherche `⌘K`. Aucun contenu n'est supprimé — il est
seulement masqué.

## Les pages

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil : hero animé, chiffres marché, parcours des chapitres |
| `quiz.html` | Quiz d'entrée — 10 questions, correction et explication immédiates |
| `fondamentaux.html` | Chapitre 1 — définition, écosystème, enchère, prix, deals, SPO, DSP |
| `campagne.html` | Chapitre 2 — objectifs, data, inventaire, paramétrage, optimisation, mesure |
| `marche.html` | Chapitre 3 — cookies, alternatives, position Amazon, audio, CTV, DOOH |
| `terrain.html` | Chapitre 4 — interlocuteurs, modèles d'achat, cas déroulé, coûts, objections, erreurs + chapitre 5 (synthèse) |
| `glossaire.html` | 27 termes, recherche et filtre par lettre |

## Les modules interactifs (à manipuler pendant la présentation)

- **Simulateur d'enchère RTB** — `fondamentaux.html#enchere`
  Le cycle complet en 7 étapes, en 120 ms (ou au ralenti ×18) :
  1. la page se charge dans une fenêtre de navigateur, un espace se libère ;
  2. le SSP envoie le bid request aux six DSP (paquets animés) ;
  3. chaque DSP filtre — les exclus affichent leur motif (capping atteint,
     audience non ciblée, inventaire non autorisé, budget épuisé…) ;
  4. les DSP éligibles calculent leur CPM maximum ;
  5. les enchères remontent au SSP ;
  6. le SSP retient la meilleure offre ;
  7. la création s'affiche dans l'emplacement et l'impression est comptée.
  Amazon DSP concourt toujours et gagne ou perd selon le tirage — les deux
  narratifs sont utiles en formation.

  **Trois modes**, au choix dans l'en-tête du module :
  - *Temps réel* — les 120 ms réelles, pour montrer la vitesse ;
  - *Ralenti ×50* — le déroulé lisible, lancé automatiquement à l'arrivée ;
  - *Pas à pas* — **pour présenter**. Un clic = une étape. Le bouton `←`
    revient en arrière, et cliquer directement sur une étape de la liste y
    saute. Chaque étape affiche sous le module la phrase à dire à l'oral.
    L'état est entièrement réversible : revenir à l'étape 2 « dé-sert » la
    création et remet les DSP en attente.
- **First price / second price** — `fondamentaux.html#prix`
  Curseur de CPM maximum ; le prix payé se recalcule dans les deux modèles.
- **Media based / audience based** — `fondamentaux.html#ciblage`
  Bascule qui transforme une grille d'emplacements en nuage d'individus.
- **Priorité d'accès à l'inventaire** — `fondamentaux.html#priorite`
  Quatre niveaux (PG, PD, PA, Open) avec leurs CPM. On désactive un niveau
  d'un clic pour voir qui sert l'impression. Le PG l'emporte à 12 € alors que
  l'enchère ouverte proposait 16,40 € : **la priorité prime sur le prix**.
- **Cascade contre header bidding** — même section
  Un **prix plancher commun** aux deux méthodes, matérialisé comme une barrière :
  chaque enchère progresse vers le seuil, s'y arrête (rouge, « Rejetée ») ou le
  franchit (« Éligible »). Mêmes offres, même plancher des deux côtés.
  En cascade, on interroge dans l'ordre et on s'arrête à la première éligible —
  les meilleures ne sont jamais interrogées. En header bidding, tout est évalué
  d'un bloc puis la meilleure éligible l'emporte. États : *Sous le plancher,
  Rejetée, Éligible, Gagnante, Non interrogée*. Le tirage garantit que le header
  bidding rapporte davantage à l'éditeur, avec l'écart chiffré.
- **Ciblage media / audience** — `fondamentaux.html#ciblage`
  Cas « 35 ans et plus, fan de football » sur 12 sites nommés (L'Équipe,
  RMC Sport, Eurosport, TF1, M6, France.tv, Le Monde, Le Figaro, 20 Minutes,
  Twitch, Allociné, Marmiton). Chaque point est un internaute. En media based
  on achète 3 sites sport : 63 % d'impressions sur la cible, 56 % de la cible
  atteinte. En audience based on achète les individus : 100 % sur la cible,
  91 % atteints, 12 sites touchés — le reste échappe au signal.
- **Chaîne d'achat (SPO)** — `fondamentaux.html#spo`
  Un graphe en « lacet » : la DSP à gauche, **une seule impression** à droite, et
  seize chemins entre les deux, à travers trois étages — SSP/exchanges,
  revendeurs, SSP de l'éditeur. Chaque nœud porte sa commission, chaque chemin est
  coloré par son coût total (vert court, orange moyen, rouge cascade de
  revendeurs). Survoler un chemin le détaille. « Appliquer le SPO » ne garde que
  le plus rentable, qui se dessine à l'écran : working media de **79 % à 93 %**.
- **Checklist de go live** — `campagne.html#parametrage`
  Six points à cocher, jauge de préparation qui passe au vert à 100 %.
- **Déclencheurs DOOH** — `marche.html#dooh`
  Météo, trafic, heure, stock, événement local : la création affichée change.
- **Cas déroulé** — `terrain.html#cas`
  Timeline pilotée au scroll + arbitrage budgétaire de la semaine 2.
- **Structure de coûts** — `terrain.html#couts`
  Barre 100 € et donut interactif (70 / 12 / 10 / 8).
- **Objections** — `terrain.html#objections`
  Cinq cartes à retourner : objection au recto, réponse au verso.

## Raccourcis

- `⌘K` / `Ctrl+K` ou `/` — palette de recherche, depuis n'importe quelle page
- `↑` `↓` puis `↵` — naviguer et ouvrir dans la palette
- `Échap` — fermer

## Logos et créations

Tous les logos sont **redessinés en SVG inline** : ils héritent de la couleur du
thème, restent nets à toutes les tailles et ne dépendent d'aucun fichier externe.

| Logo | Où | Couleur |
|---|---|---|
| Sourire Amazon | nav, pied de page, ligne « Amazon DSP » du simulateur, carte DSP | `#FF9900` |
| Lockup « amazon ads » | bas de chaque pied de page | blanc + `#FF9900` |
| DV360 (triangle play) | simulateur, carte DSP | `#34A853` |
| The Trade Desk (marque circulaire) | simulateur, carte DSP | `#00AEEF` |
| Hawk (cercle + oiseau) | simulateur, carte DSP | `#23B6A0` |

La **bannière display** servie à la fin du simulateur est une recréation en CSS
de la campagne de sobriété énergétique (`.crea-nrj` dans `modules.css`) : format
300 × 250, bloc Gouvernement, accroche, ligne surlignée, signature et URL. Pour
la remplacer par une autre créa, il suffit d'éditer ce bloc dans
`fondamentaux.html` — ou d'y mettre une `<img>` si vous préférez un visuel réel.

Si vous voulez utiliser les fichiers d'origine plutôt que mes redessins,
déposez-les dans `assets/img/` et remplacez le `<svg>` concerné par une
`<img src="assets/img/…" alt="">` — les classes `.dsp__logo` et `.dsprow__logo`
gèrent déjà le cadrage.

## Design system

- Squid Ink `#232F3E`, Amazon Orange `#FF9900`, Smile `#FEBD69`
- Typo : `Amazon Ember` si installée sur le poste, sinon `Inter` (le substitut
  libre le plus proche), `IBM Plex Mono` pour les chiffres
- Thème sombre, animations désactivées si le système demande
  « réduire les animations » (`prefers-reduced-motion`)

## Sources des chiffres marché

Observatoire de l'e-pub SRI / UDECAM réalisé par Oliver Wyman (35ᵉ et 36ᵉ
éditions) : 12,4 Md€ de recettes digitales en France en 2025 (+11 %), +12 % au
premier semestre 2026, display à 19 % du mix et 2,32 Md€.

Les chiffres du cas déroulé (chapitre 4.3) sont **illustratifs** et ne doivent
pas être présentés comme une référence client.

## Structure

```
site-le-programmatique/
├─ index.html … terrain.html      pages (français)
├─ en/index.html … en/terrain.html  pages (anglais)
└─ assets/
   ├─ css/base.css                design system, layout, navigation
   ├─ css/modules.css             composants des modules interactifs
   ├─ js/core.js                  nav, scroll, parallaxe, compteurs, palette
   └─ js/modules.js               simulateurs, quiz, glossaire
```

Le contenu textuel se modifie directement dans les fichiers `.html`.
Les données du quiz et du glossaire se modifient dans `assets/js/modules.js`
(constantes `QUESTIONS` et `GLOSSARY`), l'index de recherche dans
`assets/js/core.js` (constante `INDEX`).

### Changer le découpage des formats

Chaque section porte un attribut `data-level` :

- `core` → visible dans les trois formats
- `standard` → visible en 1 h et 90 min
- `full` → visible en 90 min seulement

Pour déplacer une section d'un format à l'autre, il suffit de changer son
`data-level` **et celui de son lien dans la sous-navigation** (même valeur, sur
la même page). Les questions du quiz suivent la même logique via leur clé `lvl`
(`1`, `2` ou `3`) dans `modules.js`, et les entrées de recherche via leur clé `l`
dans `core.js`.

Les durées affichées ne sont pas calculées : elles vivent dans les attributs
`data-txt-e` / `data-txt-s` / `data-txt-c` (accueil et hero de chapitre) et dans
les cartes de la modale. Si vous modifiez le découpage, pensez à les réajuster.
