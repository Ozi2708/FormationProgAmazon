/* JARVIS — film d'intro v4 (0:00 à 1:30, musique seule) : découpage, textes à l'écran et chiffres.
   Source : kit du film d'intro (01_storyboard.md, 02_on_screen_copy.md). Textes en anglais, repris tels quels.
   Les gains de temps sont des estimations et sont affichés comme tels. */
window.CONFIG = {
  // 12 plans, en secondes (30 i/s : 1 s = 30 images), coupes franches
  SHOTS: {
    overload: [0, 6], fatigue: [6, 10], reveal: [10, 16], how: [16, 28.5], briefing: [28.5, 39.5], pacing: [39.5, 50.5],
    voice: [50.5, 61.5], montage: [61.5, 65], impact: [65, 73], world: [73, 78.5], sharper: [78.5, 84], handoff: [84, 90],
  },
  BPM: 120,
  // bande-son fournie (le .wav voisin, non versionné, est pris s'il existe) ; les bruitages se posent dessus
  MUSIC_FILE: 'audio/jarvis_intro_soundtrack_90s.mp3',

  // compteur « Time back this week · estimated » (minutes) : [début, fin du comptage, valeur atteinte]
  COUNTER: [[34.5, 38.5, 120], [48.0, 49.5, 210], [56.5, 58.0, 330], [62.3, 63.0, 390], [63.3, 64.0, 480]],

  // impact : du temps rendu aux clients ; heures/an = 80 × 8 × 46
  NB_PSC_EU: 80,
  HOURS_SAVED_PER_WEEK: 8,
  WEEKS_PER_YEAR: 46,

  // valeurs relevées sur les captures de la plateforme (Poltronesofa SVOD, rapport DSP du 28/10)
  PACING: { delivered: 27, pace: 4.0, atRisk: 4027 },
};
// le moteur et les composants lisent un découpage : un seul bloc de 90 s (les plans sont placés par CONFIG.SHOTS)
window.FILM_SEQ = [['film', 90.4]];
