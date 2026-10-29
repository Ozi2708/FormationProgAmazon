/* JARVIS — film jury v3 (nouvelle plateforme) : TOUS les chiffres et réglages du film sont ici.
   Les personnes (contacts agence, collègues) portent des noms fictifs ; annonceurs et agences sont ceux de la plateforme. */
window.CONFIG = {
  // accroche : « 90 emails. 14 meetings. 12 campaigns. Before 10 AM. »
  EMAILS_COUNT: 90,
  MEETINGS_COUNT: 14,
  CAMPAIGNS_COUNT: 12,

  // ce que le briefing de 08:00 a lu (page Clients de la plateforme)
  READ_EMAILS: 41,
  READ_SLACK: 17,

  // impact à l'échelle : FTE = NB_PSC × HOURS_SAVED_PER_WEEK / WORK_HOURS_PER_WEEK ; heures/an = NB_PSC × HOURS_SAVED_PER_WEEK × WEEKS_PER_YEAR
  NB_PSC_FR: 15,
  NB_PSC_EU: 80,
  HOURS_SAVED_PER_WEEK: 8,
  WORK_HOURS_PER_WEEK: 40,
  WEEKS_PER_YEAR: 46,

  // gains de temps (minutes par semaine), dans l'ordre du film : la somme doit faire HOURS_SAVED_PER_WEEK
  GAINS: [
    { id: 'brief', task: 'Morning catch-up', week: 120 },
    { id: 'draft', task: 'Client emails', week: 120 },
    { id: 'pacing', task: 'Pacing checks', week: 90 },
    { id: 'meeting', task: 'Meeting prep', week: 60 },
    { id: 'wbr', task: 'WBR + decks', week: 90 },
  ],
};

// ---------------------------------------------------------------- découpage du film (s) — scènes voisines superposées 0,4 s
(function () {
  const C = window.CONFIG;
  window.FILM_SEQ = [['hook', 8.4], ['reveal', 6.4], ['app', 55.0], ['impact', 10.4], ['outro', 8.0]];
  const sum = C.GAINS.reduce((n, g) => n + g.week, 0);
  if (sum !== C.HOURS_SAVED_PER_WEEK * 60) console.error(`CONFIG: les gains font ${sum / 60} h, HOURS_SAVED_PER_WEEK = ${C.HOURS_SAVED_PER_WEEK}`);
})();
