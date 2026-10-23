/* J.A.R.V.I.S. — film jury v2 : TOUS les chiffres et réglages du film sont ici.
   Une valeur 'TODO' n'est jamais affichée à l'écran : l'élément correspondant est simplement omis. */
window.CONFIG = {
  // durée visée : 90 (version jury) ou 120 (les 3 moments forts passent à 18 s et « Next: Salesforce » revient)
  TARGET_DURATION: 90,

  // accroche : « 90 emails. 14 meetings. 12 campaigns. Before 10 AM. »
  EMAILS_COUNT: 90,        // = « 90 messages » de la Boîte (Pour moi · 7 j) ; repris dans le titre « 90 emails. 3 lines. »
  MEETINGS_COUNT: 14,
  CAMPAIGNS_COUNT: 12,

  // impact à l'échelle : FTE = NB_PSC × HOURS_SAVED_PER_WEEK / WORK_HOURS_PER_WEEK ; heures/an = NB_PSC × HOURS_SAVED_PER_WEEK × WEEKS_PER_YEAR
  NB_PSC_FR: 15,
  NB_PSC_EU: 80,
  HOURS_SAVED_PER_WEEK: 8,
  WORK_HOURS_PER_WEEK: 40,
  WEEKS_PER_YEAR: 46,

  // citation d'un utilisateur pilote (optionnelle) : affichée 3 s dans la scène Impact, le film passe à 93 s
  PILOT_QUOTE: 'TODO',
  PILOT_QUOTE_AUTHOR: 'TODO',

  // comment chaque source est branchée (inconnu à ce jour) : non affiché tant que TODO.
  // Le schéma ne montre que les composants visibles dans la plateforme : synchronisation planifiée toutes les 15 min, Kiro CLI.
  CONNECTORS: 'TODO',

  // remplace les noms de clients, agences et personnes dans tous les textes du film
  ANONYMIZE: false,

  // gains de temps (minutes par semaine) : la somme doit faire HOURS_SAVED_PER_WEEK
  GAINS: {
    brief: { task: 'Morning catch-up', per: 'every day', before: '30 min', after: '5 min', week: 120 },
    pacing: { task: 'Pacing checks', per: 'every day', before: '20 min', after: '2 min', week: 90 },
    voice: { task: 'Client email', per: 'each one', before: '15 min', after: '3 min', week: 120 },
    meeting: { task: 'Meeting prep', per: 'each meeting', before: '20 min', after: '0 min', week: 60 },
    deck: { task: 'Weekly deck + WBR', per: 'every week', before: '1h45', after: '15 min', week: 90 },
  },

  // noms remplacés quand ANONYMIZE = true (du plus long au plus court)
  NAMES: [
    ['Banque Française Mutualiste', 'Client Bank'], ['Santé publique France', 'Public Health Client'], ['SANTE PUBLIQUE FRANCE', 'PUBLIC HEALTH CLIENT'],
    ['20th Century Studios', 'Film Studio'], ['Disney Studios', 'Studio Client'], ['Molecule Science', 'Client H'], ['Groupe SEB', 'Client S'],
    ['Annemarie Kalinka', 'Agency Contact'], ['Alecsandra Tackjian', 'Agency Contact'], ['Julie Gernelle', 'Client Contact'], ['Léa Huguet', 'Colleague'],
    ['Lea Huguet', 'Colleague'], ['France Martin', 'Colleague'], ['Amnetgroup', 'Agency A'], ['Boursorama', 'Client R'], ['Whalefall', 'Film Title'],
    ['Englouti', 'Film Title'], ['Plénitude', 'Brand E'], ['Columbia', 'Client C'], ['Nintendo', 'Client N'], ['Heroiks', 'Client H'], ['iProspect', 'Agency B'],
    ['Annemarie', 'Alex'], ['Raphaël', 'Colleague'], ['Ggarzonv', 'Client Contact'], ['Ccroizat', 'Client Contact'], ['Azerion', 'Partner'],
    ['Equativ', 'SSP Partner'], ['Dentsu', 'Agency D'], ['dentsu', 'Agency D'], ['XPENG', 'Client X'], ['Qonto', 'Client Q'], ['Ogury', 'Partner'],
    ['Amnet', 'Agency A'], ['Prisma', 'Partner'], ['BabyBio', 'Client Y'], ['Orpi', 'Client O'], ['Sage', 'Client G'], ['Carat', 'Agency C'],
    ['BFM', 'Client A'], ['ENI', 'Client E'], ['GAE', 'Agency G'], ['SPF', 'Client P'], ['GSEB', 'Client S'], ['RMC', 'Client A'],
  ],
};

// ---------------------------------------------------------------- découpage du film (s) — scènes voisines superposées 0,4 s
(function () {
  const C = window.CONFIG;
  const isSet = v => v != null && v !== '' && v !== 'TODO';
  const LONG = C.TARGET_DURATION >= 120, H = LONG ? 18 : 12, Q = isSet(C.PILOT_QUOTE) ? 3 : 0;
  window.FILM_SEQ = [['hook', 8.4], ['reveal', 6.4], ['how', 10.4], ['brief', H + 0.4], ['pacing', H + 0.4], ['voice', H + 0.4],
    ['meeting', 4.4], ['deck', 4.4], ['impact', 10.4 + Q], ['learning', 5.4]].concat(LONG ? [['next', 6.4]] : []).concat([['outro', 7.0]]);
  const sum = Object.values(C.GAINS).reduce((n, g) => n + g.week, 0);
  if (sum !== C.HOURS_SAVED_PER_WEEK * 60) console.error(`CONFIG: les gains font ${sum / 60} h, HOURS_SAVED_PER_WEEK = ${C.HOURS_SAVED_PER_WEEK}`);
})();
