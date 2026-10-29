/* JARVIS — film d'intro v4 (0:00 à 1:30, musique seule) : découpage, textes à l'écran et chiffres.
   Source : kit du film d'intro (01_storyboard.md, 02_on_screen_copy.md). Textes en anglais, repris tels quels.
   Les gains de temps sont des estimations et sont affichés comme tels. */
window.CONFIG = {
  // 12 plans, en secondes (30 i/s : 1 s = 30 images), coupes franches
  SHOTS: {
    overload: [0, 6], fatigue: [6, 10], reveal: [10, 16], how: [16, 26], briefing: [26, 37], pacing: [37, 48],
    voice: [48, 59], montage: [59, 66], impact: [66, 74], world: [74, 78.5], sharper: [78.5, 84], handoff: [84, 90],
  },
  BPM: 120,

  // compteur « Time back this week · estimated » (minutes) : [début, fin du comptage, valeur atteinte]
  COUNTER: [[32.0, 36.0, 120], [45.5, 47.0, 210], [54.0, 55.5, 330], [60.8, 61.6, 390], [64.0, 64.8, 480]],

  // impact : du temps rendu aux clients ; heures/an = 80 × 8 × 46
  NB_PSC_EU: 80,
  HOURS_SAVED_PER_WEEK: 8,
  WEEKS_PER_YEAR: 46,

  // valeurs relevées sur les captures de la plateforme (Poltronesofa SVOD, rapport DSP du 28/10)
  PACING: { delivered: 27, pace: 4.0, atRisk: 4027 },
};
// le moteur et les composants lisent un découpage : un seul bloc de 90 s (les plans sont placés par CONFIG.SHOTS)
window.FILM_SEQ = [['film', 90.4]];
