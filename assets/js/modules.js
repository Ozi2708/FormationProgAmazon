/* ==========================================================================
   Le Programmatique — modules interactifs
   Chaque module s'auto-active s'il trouve son marqueur dans le DOM.
   ========================================================================== */
(() => {
  'use strict';
  const { $, $$, reduced, onEnter, rand, fmt, EN, T } = window.LP;
  const eur = (v) => (EN ? '€' + v.toFixed(2) : v.toFixed(2).replace('.', ',') + ' €');
  // Pourcentage : espace insécable en français, collé en anglais.
  const pc = (v) => v + (EN ? '%' : ' %');

  /* ======================================================================
     1. Simulateur d'enchère RTB — cycle complet en 7 étapes
     Page qui charge → bid request → filtrage par les DSP → enchère →
     réponse au SSP → arbitrage → affichage de la création.
     Trois modes : temps réel, ralenti, et pas à pas pour la présentation.
     ====================================================================== */
  const LOGO = {
    amazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15c4.5 3.3 12 3.3 17-1" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M17.2 10.6L22 13.5l-4.8 2.6z" fill="currentColor"/></svg>',
    dv360: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.4c0-1.1 1.2-1.7 2-1.1l10.2 6.5c.8.5.8 1.7 0 2.2L9 20.7c-.8.6-2 0-2-1.1z" fill="currentColor"/></svg>',
    ttd: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h7v11h-4V5.6H6z" fill="currentColor"/><path d="M16.4 4.9a8.7 8.7 0 11-8.9.6" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
    hawk: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M5.6 13.2c2.8-.5 4.6-2 5.7-3.9.7 1.8 2 2.7 3.9 3-1.2 2.1-3.4 3.5-6 3.5-1.4 0-2.6-.9-3.6-2.6z" fill="#0b1017"/><path d="M14.4 7.4l3.8-1.7-1.5 3.6z" fill="#0b1017"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2" opacity=".45"/></svg>',
  };

  const DSPS = [
    { n: 'Amazon DSP', c: '#ff9900', l: LOGO.amazon, us: true },
    { n: 'DV360', c: '#34a853', l: LOGO.dv360 },
    { n: 'The Trade Desk', c: '#00aeef', l: LOGO.ttd },
    { n: 'Hawk', c: '#23b6a0', l: LOGO.hawk },
    { n: 'Xandr', c: '#8b7cf6', l: LOGO.grid },
    { n: 'Equativ', c: '#f0713a', l: LOGO.grid },
  ];

  const BLOCKS = EN ? [
    'Audience not targeted',
    'Frequency cap reached',
    'Inventory not allowed',
    'Daily budget spent',
    'Brand safety: site excluded',
    'Format not supported',
  ] : [
    'Audience non ciblée',
    'Capping atteint',
    'Inventaire non autorisé',
    'Budget quotidien épuisé',
    'Brand safety : site exclu',
    'Format non supporté',
  ];

  function rtb() {
    const root = $('[data-rtb]');
    if (!root) return;

    const msEl = $('[data-rtb-ms]', root);
    const phaseEl = $('[data-rtb-phase]', root);
    const fill = $('[data-rtb-fill]', root);
    const stepEls = $$('.rtb2__step', root);
    const list = $('[data-rtb-bidders]', root);
    const flow = $('[data-rtb-flow]', root);
    const result = $('[data-rtb-result]', root);
    const slot = $('[data-rtb-slot]', root);
    const browser = $('[data-rtb-browser]', root);
    const chainTxt = $('[data-rtb-chaintxt]', root);
    const nodePub = $('[data-rtb-node="pub"]', root);
    const nodeSsp = $('[data-rtb-node="ssp"]', root);
    const runBtn = $('[data-rtb-run]', root);
    const prevBtn = $('[data-rtb-prev]', root);
    const countEl = $('[data-rtb-count]', root);

    const MARKS = [0, 12, 34, 62, 88, 104, 118];
    const PHASES = EN ? [
      'Page loading',
      'Bid request sent',
      'Campaign filtering',
      'Valuing the impression',
      'Bids received',
      'SSP decision',
      'Creative served',
    ] : [
      'Chargement de la page',
      'Appel d’offres envoyé',
      'Filtrage des campagnes',
      'Valorisation de l’impression',
      'Enchères reçues',
      'Arbitrage du SSP',
      'Création servie',
    ];
    const CHAIN = EN ? [
      'impression available',
      'bid request → 6 DSPs',
      'filtering',
      'valuation',
      'bids received',
      'best offer selected',
      'creative served',
    ] : [
      'impression disponible',
      'bid request → 6 DSP',
      'filtrage en cours',
      'valorisation',
      'enchères reçues',
      'meilleure offre retenue',
      'créa servie',
    ];
    // Ce qu'on dit à l'oral sur chaque étape.
    const HINTS = EN ? [
      'A user opens the page. An ad slot becomes available — and everything that follows has to happen before the page finishes rendering.',
      'The SSP sends the same opportunity to every connected DSP, along with the signals it has: context, device, location.',
      'Each DSP applies its own rules. Those that don’t pass don’t even respond: this is where campaign setup pays off — or costs you.',
      'The DSPs still in the running value the impression for the relevant campaign and calculate their maximum CPM.',
      'Bids flow back up to the SSP. All of this plays out in a few dozen milliseconds.',
      'The SSP picks the best valid bid. One winner, and the price paid is its own bid.',
      '',
    ] : [
      'Un internaute ouvre la page. Un espace publicitaire se libère — et tout ce qui suit doit tenir avant que la page ne s’affiche.',
      'Le SSP envoie la même opportunité à toutes les DSP connectées, accompagnée des signaux dont il dispose : contexte, appareil, géographie.',
      'Chaque DSP applique ses propres règles. Celles qui ne passent pas ne répondent même pas : c’est ici que le paramétrage de la campagne se paie.',
      'Les DSP restées en lice valorisent l’impression pour la campagne concernée, et calculent leur CPM maximum.',
      'Les enchères remontent au SSP. Tout ceci se joue en quelques dizaines de millisecondes.',
      'Le SSP retient la meilleure enchère recevable. Un seul gagnant, et le prix payé est celui de son enchère.',
      '',
    ];

    let mode = 'slow';
    let busy = false, runs = 0, timers = [];
    let state = null, step = -1;

    const speedOf = () => (mode === 'real' ? 1 : 50);

    /* ---------- Tirage d'une impression ---------- */
    const deal = () => {
      const bidders = DSPS.map((d) => ({ ...d }));
      const rivals = bidders.filter((b) => !b.us);
      rivals.forEach((b) => { b.blocked = Math.random() < 0.42; });
      const alive = rivals.filter((b) => !b.blocked);
      while (alive.length < 2) {
        const back = rivals.filter((b) => b.blocked)[0];
        if (!back) break;
        back.blocked = false;
        alive.push(back);
      }
      const reasons = [...BLOCKS].sort(() => Math.random() - 0.5);
      let ri = 0;
      bidders.forEach((b) => {
        if (b.blocked) b.reason = reasons[ri++ % reasons.length];
        else b.cpm = rand(b.us ? 4.6 : 3.2, b.us ? 12.6 : 11.4);
      });

      list.innerHTML = bidders
        .map(
          (b) => `<div class="dsprow" style="--c:${b.c}">
            <span class="dsprow__logo">${b.l}</span>
            <span class="dsprow__n">
              <span class="nm">${b.n}${b.us ? '<span class="tag">' + T('nous', 'us') + '</span>' : ''}</span>
              <span class="dsprow__s">${T('en veille', 'idle')}</span>
            </span>
            <span class="dsprow__v">—</span>
          </div>`
        )
        .join('');
      $$('.dsprow', list).forEach((el, i) => { bidders[i].el = el; });

      const eligible = bidders.filter((b) => !b.blocked);
      const best = eligible.reduce((a, b) => (b.cpm > a.cpm ? b : a));
      state = { bidders, eligible, best, max: best.cpm };
    };

    /* ---------- Paquets le long de l'épine dorsale ---------- */
    const packets = (bidders, dir, dur) => {
      if (reduced()) return;
      bidders.forEach((b, i) => {
        const p = document.createElement('span');
        p.className = 'rtb2__pkt' + (dir === 'up' ? ' up' : '');
        const target = b.el.offsetTop + b.el.offsetHeight / 2 - 5;
        p.style.top = (dir === 'up' ? target : -4) + 'px';
        flow.appendChild(p);
        const delay = i * (dur * 0.12);
        requestAnimationFrame(() => {
          p.style.transition = `top ${dur}ms cubic-bezier(.4,0,.2,1) ${delay}ms, opacity .18s ${delay}ms`;
          p.style.opacity = '1';
          p.style.top = (dir === 'up' ? -4 : target) + 'px';
        });
        timers.push(setTimeout(() => {
          p.style.opacity = '0';
          timers.push(setTimeout(() => p.remove(), 240));
        }, dur + delay + 40));
      });
    };

    const verdict = () => {
      const others = state.eligible.filter((b) => b !== state.best);
      const second = others.length ? others.reduce((a, b) => (b.cpm > a.cpm ? b : a)) : null;
      const blocked = state.bidders.filter((b) => b.blocked).length;
      if (EN) {
        return state.best.us
          ? `<span><b>Amazon DSP wins the impression</b> at a ${eur(state.best.cpm)} CPM — in first price, that is exactly the bid entered.
             ${blocked ? blocked + ' DSP' + (blocked > 1 ? 's' : '') + ' didn’t even compete (filtered out). ' : ''}${second ? 'Second-highest bid: ' + eur(second.cpm) + '.' : ''}</span>`
          : `<span><b>${state.best.n} wins the impression</b> at a ${eur(state.best.cpm)} CPM. Our bid: ${eur(state.bidders.find((b) => b.us).cpm)}.
             To win this kind of inventory, the maximum CPM on this line item needs to go up.</span>`;
      }
      return state.best.us
        ? `<span><b>Amazon DSP remporte l’impression</b> à ${eur(state.best.cpm)} de CPM — en first price, c’est exactement l’enchère saisie.
           ${blocked ? blocked + ' DSP n’ont même pas concouru (filtrage). ' : ''}${second ? 'Deuxième enchère : ' + eur(second.cpm) + '.' : ''}</span>`
        : `<span><b>${state.best.n} remporte l’impression</b> à ${eur(state.best.cpm)} de CPM. Notre enchère : ${eur(state.bidders.find((b) => b.us).cpm)}.
           Pour gagner ce type d’inventaire, il faut remonter le CPM maximum sur ce line item.</span>`;
    };

    /**
     * Rend l'état complet de l'étape i. Fonction pure de (state, i) : on
     * peut donc sauter à n'importe quelle étape, en avant comme en arrière.
     */
    const applyStep = (i, animate) => {
      if (!state) return;
      step = i;
      const ms = i >= 6 ? 120 : MARKS[i];

      msEl.textContent = ms;
      fill.style.transition = animate ? 'transform .4s cubic-bezier(.22,1,.36,1)' : 'none';
      fill.style.transform = `scaleX(${ms / 120})`;
      phaseEl.textContent = PHASES[i];
      stepEls.forEach((s, k) => {
        s.classList.toggle('is-on', k === i);
        s.classList.toggle('is-done', k < i);
      });

      browser.classList.toggle('is-loading', i < 6);
      slot.classList.toggle('is-armed', i < 6);
      slot.classList.toggle('is-served', i >= 6);
      nodePub.classList.add('is-live');
      nodeSsp.classList.toggle('is-live', i >= 1);
      chainTxt.textContent =
        i === 3 ? state.eligible.length + T(' DSP en lice', ' DSPs in the running')
        : i === 4 ? state.eligible.length + T(' enchères reçues', ' bids received')
        : CHAIN[i];

      state.bidders.forEach((b) => {
        const el = b.el;
        const s = $('.dsprow__s', el);
        const v = $('.dsprow__v', el);
        el.classList.remove('is-probe', 'is-block', 'is-bid', 'is-win', 'is-lost');
        el.style.removeProperty('--w');

        if (i === 0) { s.textContent = T('en veille', 'idle'); v.textContent = '—'; return; }
        if (i === 1) {
          el.classList.add('is-probe');
          s.textContent = T('appel d’offres reçu', 'bid request received');
          v.textContent = '—';
          return;
        }
        if (b.blocked) {
          el.classList.add('is-block');
          s.textContent = b.reason;
          v.textContent = T('ne concourt pas', 'not bidding');
          return;
        }
        if (i === 2) { s.textContent = T('campagne éligible', 'campaign eligible'); v.textContent = '—'; return; }

        el.style.setProperty('--w', (b.cpm / state.max) * 100 + '%');
        v.textContent = eur(b.cpm);
        if (i === 3) { el.classList.add('is-bid'); s.textContent = T('CPM maximum calculé', 'maximum CPM calculated'); }
        else if (i === 4) { el.classList.add('is-bid'); s.textContent = T('enchère transmise au SSP', 'bid sent to the SSP'); }
        else {
          el.classList.add(b === state.best ? 'is-win' : 'is-lost');
          s.textContent = b === state.best ? T('remporte l’impression', 'wins the impression') : T('enchère non retenue', 'bid not selected');
        }
      });

      if (i >= 6) {
        result.className = 'rtb__result mt-m is-win';
        result.innerHTML = verdict();
      } else {
        result.className = 'rtb__result mt-m';
        result.innerHTML = '<span class="muted">' + HINTS[i] + '</span>';
      }

      if (animate && i === 1) packets(state.bidders, 'down', 22 * speedOf());
      if (animate && i === 4) packets(state.eligible, 'up', 18 * speedOf());
      syncControls();
    };

    /* ---------- Contrôles ---------- */
    const syncControls = () => {
      if (mode === 'step') {
        prevBtn.hidden = step <= 0;
        runBtn.textContent =
          step < 0 ? T('Lancer une impression', 'Run an impression')
          : step >= 6 ? T('Nouvelle impression', 'New impression')
          : T('Étape suivante', 'Next step');
        countEl.textContent = step < 0 ? T('prêt', 'ready') : T('étape ', 'step ') + (step + 1) + ' / 7';
      } else {
        prevBtn.hidden = true;
        runBtn.textContent = T('Lancer une impression', 'Run an impression');
        countEl.textContent = runs + (EN
          ? (runs === 1 ? ' auction run' : ' auctions run')
          : (runs > 1 ? ' enchères jouées' : ' enchère jouée'));
      }
    };

    const clear = () => {
      timers.forEach(clearTimeout);
      timers = [];
      $$('.rtb2__pkt', flow).forEach((p) => p.remove());
    };

    const reset = () => {
      clear();
      busy = false;
      step = -1;
      state = null;
      stepEls.forEach((s) => s.classList.remove('is-on', 'is-done'));
      fill.style.transition = 'none';
      fill.style.transform = 'scaleX(0)';
      slot.classList.remove('is-served', 'is-armed');
      browser.classList.remove('is-loading');
      nodePub.classList.remove('is-live');
      nodeSsp.classList.remove('is-live');
      chainTxt.textContent = T('en attente', 'waiting');
      result.className = 'rtb__result mt-m';
      result.innerHTML = '<span class="muted">' + T('L’enchère se rejoue à chaque impression disponible. Lancez-en une.', 'The auction replays for every available impression. Run one.') + '</span>';
      msEl.textContent = '0';
      phaseEl.textContent = T('En attente', 'Waiting');
      list.innerHTML = '';
      runBtn.disabled = false;
      runBtn.style.opacity = '';
      syncControls();
    };

    /* ---------- Lecture automatique ---------- */
    const play = () => {
      if (busy) return;
      busy = true;
      clear();
      deal();
      runBtn.disabled = true;
      runBtn.style.opacity = '.55';

      const speed = speedOf();
      const total = 120 * speed;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / total, 1);
        msEl.textContent = Math.round(p * 120);
        if (p < 1 && busy) requestAnimationFrame(tick);
      };

      MARKS.forEach((m, i) =>
        timers.push(setTimeout(() => {
          applyStep(i, true);
          // L'horloge est pilotée en continu, pas par les étapes.
          fill.style.transition = `transform ${total - m * speed}ms linear`;
          fill.style.transform = 'scaleX(1)';
        }, m * speed))
      );
      requestAnimationFrame(tick);
      requestAnimationFrame(() => {
        fill.style.transition = `transform ${total}ms linear`;
        fill.style.transform = 'scaleX(1)';
      });

      timers.push(setTimeout(() => {
        stepEls.forEach((s) => { s.classList.remove('is-on'); s.classList.add('is-done'); });
        phaseEl.textContent = T('Terminé — 120 ms', 'Done — 120 ms');
        msEl.textContent = '120';
        busy = false;
        runBtn.disabled = false;
        runBtn.style.opacity = '';
        runs++;
        syncControls();
      }, 128 * speed));
    };

    /* ---------- Pas à pas ---------- */
    const stepForward = () => {
      if (step < 0) { clear(); deal(); applyStep(0, false); return; }
      if (step >= 6) { clear(); deal(); applyStep(0, false); runs++; return; }
      clear();
      applyStep(step + 1, true);
    };

    runBtn.addEventListener('click', () => (mode === 'step' ? stepForward() : play()));
    prevBtn.addEventListener('click', () => { if (step > 0) { clear(); applyStep(step - 1, false); } });

    // En pas à pas, la liste des étapes devient cliquable.
    stepEls.forEach((el, i) =>
      el.addEventListener('click', () => {
        if (mode !== 'step') return;
        if (!state) { deal(); }
        clear();
        applyStep(i, false);
      })
    );

    $$('[data-rtb-mode]', root).forEach((b) =>
      b.addEventListener('click', () => {
        $$('[data-rtb-mode]', root).forEach((x) => x.classList.remove('chip--on'));
        b.classList.add('chip--on');
        mode = b.dataset.rtbMode;
        root.classList.toggle('is-stepmode', mode === 'step');
        reset();
      })
    );

    reset();
    onEnter(root, () => { if (mode !== 'step') setTimeout(play, 500); }, 0.25);
  }

  /* ======================================================================
     2. First price vs second price
     ====================================================================== */
  function pricing() {
    const root = $('[data-px]');
    if (!root) return;
    const slider = $('input[type=range]', root);
    const out = $('output', root);
    const fp = $('[data-px-first]', root);
    const sp = $('[data-px-second]', root);
    const fpd = $('[data-px-first-d]', root);
    const spd = $('[data-px-second-d]', root);
    const rivalBox = $('[data-px-rivals]', root);
    const verdict = $('[data-px-verdict]', root);
    const shuffle = $('[data-px-shuffle]', root);

    let rivals = [];
    const gen = () => {
      rivals = Array.from({ length: 4 }, () => rand(3.5, 10.5)).sort((a, b) => b - a);
      draw();
    };

    const draw = () => {
      const bid = parseFloat(slider.value);
      slider.style.setProperty('--p', ((bid - slider.min) / (slider.max - slider.min)) * 100 + '%');
      out.textContent = eur(bid);

      const top = rivals[0];
      const win = bid > top;
      rivalBox.innerHTML = rivals
        .map((r, i) => `<span class="rtb__cpm px__rival${win && i === 0 ? ' is-2nd' : ''}">${eur(r)}</span>`)
        .join('');

      if (!win) {
        fp.textContent = '—';
        sp.textContent = '—';
        fpd.textContent = T('Enchère perdue', 'Auction lost');
        spd.textContent = T('Enchère perdue', 'Auction lost');
        verdict.innerHTML = EN
          ? `At ${eur(bid)}, the impression goes to a competitor at <b>${eur(top)}</b>. In both models you pay nothing — but you buy nothing either.`
          : `Avec ${eur(bid)}, l’impression part à <b>${eur(top)}</b> chez un concurrent. Dans les deux modèles, on ne paie rien — mais on n’achète rien non plus.`;
        return;
      }
      fp.textContent = eur(bid);
      sp.textContent = eur(top + 0.01);
      fpd.textContent = T('Vous payez exactement votre enchère maximale.', 'You pay exactly your maximum bid.');
      spd.textContent = EN ? `Second-highest bid (${eur(top)}) + €0.01.` : `Deuxième meilleure enchère (${eur(top)}) + 0,01 €.`;
      const delta = bid - (top + 0.01);
      verdict.innerHTML = EN
        ? `On this impression, first price costs <b>${eur(delta)}</b> more for the same outcome — that is <b>${((delta / (top + 0.01)) * 100).toFixed(0)}%</b>. That is exactly what second price used to absorb for you: hence the need to manage the maximum CPM, audience by audience.`
        : `Sur cette impression, le first price coûte <b>${eur(delta)}</b> de plus pour le même résultat — soit <b>${((delta / (top + 0.01)) * 100).toFixed(0)} %</b>. C’est exactement le montant que le second price absorbait à votre place : d’où la nécessité de piloter le CPM maximum, audience par audience.`;
    };

    slider.addEventListener('input', draw);
    if (shuffle) shuffle.addEventListener('click', gen);
    gen();
  }

  /* ======================================================================
     3. Écosystème — fiche détail au clic
     ====================================================================== */
  function eco() {
    const nodes = $$('[data-eco-node]');
    if (!nodes.length) return;
    nodes.forEach((n) =>
      n.addEventListener('click', () => {
        const on = n.classList.contains('is-active');
        nodes.forEach((x) => x.classList.remove('is-active'));
        if (!on) n.classList.add('is-active');
      })
    );
  }

  /* ======================================================================
     4. Ciblage media based / audience based
     Cas concret : 35 ans et plus, fan de football. Même univers
     d'internautes dans les deux vues — seule la façon d'acheter change.
     ====================================================================== */
  const SITES = [
    { n: 'L’Équipe', c: 'Sport', pop: 16, aff: 0.62, sport: true },
    { n: 'RMC Sport', c: 'Sport', pop: 12, aff: 0.68, sport: true },
    { n: 'Eurosport', c: 'Sport', pop: 10, aff: 0.55, sport: true },
    { n: 'TF1', c: T('Généraliste', 'General'), pop: 18, aff: 0.22 },
    { n: 'M6', c: T('Généraliste', 'General'), pop: 15, aff: 0.17 },
    { n: 'France.tv', c: T('Généraliste', 'General'), pop: 14, aff: 0.19 },
    { n: 'Le Monde', c: T('Actualité', 'News'), pop: 14, aff: 0.14 },
    { n: 'Le Figaro', c: T('Actualité', 'News'), pop: 12, aff: 0.16 },
    { n: '20 Minutes', c: T('Actualité', 'News'), pop: 15, aff: 0.15 },
    { n: 'Twitch', c: 'Live · gaming', pop: 13, aff: 0.11 },
    { n: 'Allociné', c: T('Cinéma', 'Movies'), pop: 10, aff: 0.09 },
    { n: 'Marmiton', c: T('Cuisine', 'Cooking'), pop: 11, aff: 0.05 },
  ];
  // Part de la cible non adressable : pas de consentement, pas de signal.
  const SIGNAL_LOSS = 0.15;

  function mva() {
    const root = $('[data-mva]');
    if (!root) return;
    const grid = $('[data-tgt-grid]', root);
    const caption = $('[data-tgt-caption]', root);
    const note = $('[data-tgt-note]', root);
    const btns = $$('.mva__switch button', root);
    const thumb = $('.mva__thumb', root);

    // Univers commun aux deux vues
    const sites = SITES.map((s) => ({ ...s, match: Math.round(s.pop * s.aff) }));
    const totalPop = sites.reduce((a, s) => a + s.pop, 0);
    const totalMatch = sites.reduce((a, s) => a + s.match, 0);

    grid.innerHTML = sites
      .map(
        (s, si) => `<div class="tgt__site" data-site="${si}">
          <div class="tgt__head"><span class="tgt__name">${s.n}</span><span class="tgt__cat">${s.c}</span></div>
          <span class="tgt__buy"></span>
          <div class="tgt__dots">${Array.from({ length: s.pop }, (_, i) =>
            `<i class="pdot" data-m="${i < s.match ? 1 : 0}" style="--d:${(si * 22 + i * 9)}ms"></i>`).join('')}</div>
        </div>`
      )
      .join('');

    caption.textContent = EN
      ? `${sites.length} sites · ${totalPop} users · ${totalMatch} in the target`
      : `${sites.length} sites · ${totalPop} internautes · ${totalMatch} dans la cible`;

    const setStat = (sel, label, value, detail, tone) => {
      const box = $(sel, root);
      $('span', box).textContent = label;
      $('b', box).textContent = value;
      $('em', box).textContent = detail;
      box.classList.remove('bad', 'good');
      if (tone) box.classList.add(tone);
    };

    const render = (mode) => {
      const audience = mode === 'audience';
      let bought = 0, onTarget = 0, reached = 0, touchedSites = 0;

      $$('.tgt__site', grid).forEach((card, si) => {
        const s = sites[si];
        const buySite = !audience && s.sport;
        card.classList.toggle('is-bought', buySite);
        $('.tgt__buy', card).textContent = buySite ? T('emplacement acheté', 'placement bought') : '';

        let siteHits = 0;
        $$('.pdot', card).forEach((d, i) => {
          const isMatch = d.dataset.m === '1';
          d.classList.remove('is-hit', 'is-waste', 'is-miss');
          if (audience) {
            // On achète les individus : la cible partout, sauf la part
            // que le signal ne permet pas d'adresser.
            const addressable = isMatch && i < Math.round(s.match * (1 - SIGNAL_LOSS));
            if (addressable) { d.classList.add('is-hit'); siteHits++; bought++; onTarget++; reached++; }
            else if (isMatch) d.classList.add('is-miss');
          } else if (buySite) {
            // On achète l'emplacement : tout le trafic du site.
            bought++;
            if (isMatch) { d.classList.add('is-hit'); siteHits++; onTarget++; reached++; }
            else d.classList.add('is-waste');
          } else if (isMatch) {
            d.classList.add('is-miss');
          }
        });
        if (siteHits > 0) touchedSites++;
      });

      const onPct = bought ? Math.round((onTarget / bought) * 100) : 0;
      const reachPct = Math.round((reached / totalMatch) * 100);

      if (EN && audience) {
        setStat('[data-tgt-sitestat]', 'Sites reached', touchedSites, 'wherever the target is');
        setStat('[data-tgt-onstat]', 'On-target impressions', pc(onPct), 'no wastage', 'good');
        setStat('[data-tgt-reachstat]', 'Target reached', pc(reachPct), pc(100 - reachPct) + ' not addressable, for lack of signal');
        note.innerHTML =
          `<strong>You buy people.</strong> The same people, whatever the site: ` +
          `${touchedSites} sites reached instead of 3, and zero off-target impressions. The trade-off: ` +
          `you depend on the signal — ${pc(100 - reachPct)} of the target stays out of reach, and the inventory ` +
          `reached isn’t always as premium as a negotiated placement.`;
      } else if (EN) {
        setStat('[data-tgt-sitestat]', 'Sites bought', '3', 'out of ' + sites.length + ' — the sports sites');
        setStat('[data-tgt-onstat]', 'On-target impressions', pc(onPct), pc(100 - onPct) + ' wastage', 'bad');
        setStat('[data-tgt-reachstat]', 'Target reached', pc(reachPct), 'fans outside sports sites are missed');
        note.innerHTML =
          `<strong>You buy a context.</strong> All the traffic of L'Équipe, RMC Sport and Eurosport — ` +
          `easy to negotiate, no identifier needed, and a controlled environment. But ` +
          `<strong>${pc(100 - onPct)} of impressions land off target</strong>, and football fans who ` +
          `read Le Monde or watch Twitch are never reached.`;
      } else if (audience) {
        setStat('[data-tgt-sitestat]', 'Sites touchés', touchedSites, 'partout où la cible se trouve');
        setStat('[data-tgt-onstat]', 'Impressions sur la cible', onPct + ' %', 'aucune déperdition', 'good');
        setStat('[data-tgt-reachstat]', 'Cible atteinte', reachPct + ' %', 100 - reachPct + ' % non adressables, faute de signal');
        note.innerHTML =
          `<strong>On achète des individus.</strong> Les mêmes personnes, quel que soit le site : ` +
          `${touchedSites} sites touchés au lieu de 3, et zéro impression hors cible. En contrepartie, ` +
          `on dépend du signal — ${100 - reachPct} % de la cible reste hors de portée, et l'inventaire ` +
          `atteint n'est pas toujours aussi premium qu'un emplacement négocié.`;
      } else {
        setStat('[data-tgt-sitestat]', 'Sites achetés', '3', 'sur ' + sites.length + ' — les sites sport');
        setStat('[data-tgt-onstat]', 'Impressions sur la cible', onPct + ' %', 100 - onPct + ' % de déperdition', 'bad');
        setStat('[data-tgt-reachstat]', 'Cible atteinte', reachPct + ' %', 'les fans hors sites sport sont manqués');
        note.innerHTML =
          `<strong>On achète un contexte.</strong> Tout le trafic de L'Équipe, RMC Sport et Eurosport — ` +
          `simple à négocier, aucun identifiant requis, et un environnement maîtrisé. Mais ` +
          `<strong>${100 - onPct} % des impressions partent hors cible</strong>, et les fans de football qui ` +
          `lisent Le Monde ou regardent Twitch ne sont jamais touchés.`;
      }
    };

    const set = (mode) => {
      btns.forEach((b) => b.classList.toggle('is-on', b.dataset.mode === mode));
      const on = btns.find((b) => b.dataset.mode === mode);
      if (on && thumb) {
        thumb.style.width = on.offsetWidth + 'px';
        thumb.style.transform = `translateX(${on.offsetLeft - 4}px)`;
      }
      render(mode);
    };

    btns.forEach((b) => b.addEventListener('click', () => { auto = false; set(b.dataset.mode); }));
    requestAnimationFrame(() => set('media'));
    window.addEventListener('resize', () => {
      const cur = btns.find((b) => b.classList.contains('is-on'));
      if (cur) set(cur.dataset.mode);
    });

    // Alternance automatique tant que personne n'a touché au sélecteur.
    let auto = true, mode = 'media';
    if (!reduced()) {
      setInterval(() => {
        if (!auto) return;
        mode = mode === 'media' ? 'audience' : 'media';
        set(mode);
      }, 5200);
    }
  }

  /* ======================================================================
     5. Deals — accordéon
     ====================================================================== */
  function deals() {
    $$('[data-deal]').forEach((d) => {
      const btn = $('.deal__btn', d);
      btn.addEventListener('click', () => {
        const open = d.classList.contains('is-open');
        $$('[data-deal]').forEach((x) => x.classList.remove('is-open'));
        d.classList.toggle('is-open', !open);
      });
    });
    const first = $('[data-deal]');
    if (first) first.classList.add('is-open');
  }

  /* ======================================================================
     6. Supply Path Optimisation — le graphe des chemins
     Plusieurs SSP, des exchanges, des revendeurs… et au bout une seule
     impression. Chaque intermédiaire prend sa marge : le SPO ne négocie
     pas un meilleur prix, il retire des étages.
     ====================================================================== */
  const SPO_COLS = [
    {
      x: 268, lbl: 'SSP · EXCHANGE',
      nodes: [
        { n: 'Exchange A', f: 8 }, { n: 'Exchange B', f: 9 }, { n: 'Exchange C', f: 10 },
        { n: T('SSP amont', 'Upstream SSP'), f: 9 }, { n: 'Exchange D', f: 8 },
      ],
    },
    {
      x: 502, lbl: T('REVENDEURS', 'RESELLERS'),
      nodes: [
        { n: T('Revendeur 1', 'Reseller 1'), f: 11 }, { n: T('Revendeur 2', 'Reseller 2'), f: 12 },
        { n: T('Revendeur 3', 'Reseller 3'), f: 13 }, { n: T('Revendeur 4', 'Reseller 4'), f: 14 },
      ],
    },
    {
      x: 736, lbl: T('SSP DE L’ÉDITEUR', 'PUBLISHER SSP'),
      nodes: [
        { n: T('SSP directe', 'Direct SSP'), f: 7 }, { n: T('SSP intégrée', 'Integrated SSP'), f: 9 },
        { n: T('SSP tierce', 'Third-party SSP'), f: 11 }, { n: T('SSP revendue', 'Resold SSP'), f: 14 },
      ],
    },
  ];

  function spo() {
    const root = $('[data-spo]');
    if (!root) return;
    const host = $('[data-spo-graph]', root);
    const svg = $('svg', host);
    const detail = $('[data-spo-detail]', root);
    const btn = $('[data-spo-toggle]', root);

    const W = 980, H = 360;
    const yOf = (i, n) => 46 + (i * (H - 92)) / Math.max(n - 1, 1);
    const cols = SPO_COLS.map((c) =>
      c.nodes.map((nd, i) => ({ ...nd, x: c.x, y: yOf(i, c.nodes.length) }))
    );
    const A = { x: 62, y: H / 2 };
    const B = { x: W - 62, y: H / 2 };

    // Construction des chemins : directs, avec un exchange, ou avec un
    // revendeur en plus. Toujours la même impression au bout.
    const paths = [];
    const add = (hops) => paths.push({ hops, fee: hops.reduce((a, h) => a + h.f, 0) });
    cols[2].forEach((s) => add([s]));                                   // 4 directs
    [0, 1, 2, 3, 4, 0].forEach((e, k) => add([cols[0][e], cols[2][k % 4]]));   // 6 via exchange
    [0, 1, 2, 3, 1, 2].forEach((e, k) =>
      add([cols[0][e], cols[1][k % 4], cols[2][(k + 1) % 4]])            // 6 via revendeur
    );
    const best = paths.reduce((a, p) => (p.fee < a.fee ? p : a));

    const d = (pts) => {
      let s = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const dx = (b.x - a.x) * 0.55;
        s += ` C ${(a.x + dx).toFixed(1)} ${a.y.toFixed(1)}, ${(b.x - dx).toFixed(1)} ${b.y.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      }
      return s;
    };
    const colorOf = (fee) => (fee <= 12 ? '#34d399' : fee <= 25 ? '#ff9900' : '#ff6a5e');

    let g = '';
    SPO_COLS.forEach((c) => { g += `<text class="spo3__collbl" x="${c.x}" y="22">${c.lbl}</text>`; });
    paths.forEach((p, i) => {
      p.color = colorOf(p.fee);
      g += `<path class="spo3__path${p === best ? ' is-best' : ''}" data-p="${i}"
             d="${d([A, ...p.hops, B])}" stroke="${p.color}"/>`;
    });
    cols.forEach((col) =>
      col.forEach((nd) => {
        g += `<circle class="spo3__hop" data-node="${nd.n}" cx="${nd.x}" cy="${nd.y}" r="7"/>`;
        g += `<text class="spo3__hoplbl" data-node="${nd.n}" x="${nd.x}" y="${nd.y - 13}">${nd.n} · ${pc(nd.f)}</text>`;
      })
    );
    g += `<circle class="spo3__end" cx="${A.x}" cy="${A.y}" r="26"/>
          <text class="spo3__endlbl" x="${A.x}" y="${A.y + 2}">DSP</text>
          <text class="spo3__endsub" x="${A.x}" y="${A.y + 42}">Amazon DSP</text>`;
    g += `<circle class="spo3__end spo3__end--out" cx="${B.x}" cy="${B.y}" r="26"/>
          <text class="spo3__endlbl" x="${B.x}" y="${B.y + 2}">IMP.</text>
          <text class="spo3__endsub" x="${B.x}" y="${B.y + 42}">1 impression</text>`;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = g;

    const pathEls = $$('.spo3__path', svg);
    const bestNames = best.hops.map((h) => h.n);
    $$('.spo3__hop, .spo3__hoplbl', svg).forEach((el) =>
      el.classList.toggle('is-keep', bestNames.includes(el.dataset.node))
    );

    const showDetail = (p) => {
      const chain = ['DSP', ...p.hops.map((h) => `${h.n} <b style="color:${p.color}">${pc(h.f)}</b>`), 'Impression']
        .join(' <span class="sep">→</span> ');
      detail.classList.toggle('is-best', p === best);
      detail.innerHTML =
        `<span class="lbl">${p.hops.length} ${T('intermédiaire', 'intermediar')}${p.hops.length > 1 ? T('s', 'ies') : T('', 'y')}</span>` +
        `<span>${chain}</span>` +
        `<span class="res"><span class="fees">− ${pc(p.fee)} ${T('de frais', 'fees')}</span> · <span class="wm">${pc(100 - p.fee)} working media</span></span>`;
    };

    pathEls.forEach((el, i) => {
      el.addEventListener('mouseenter', () => {
        pathEls.forEach((x) => x.classList.remove('is-on'));
        el.classList.add('is-on');
        showDetail(paths[i]);
      });
    });
    host.addEventListener('mouseleave', () => {
      pathEls.forEach((x) => x.classList.remove('is-on'));
      showDetail(root.classList.contains('is-clean') ? best : paths[paths.length - 1]);
    });

    // Moyenne de tous les chemins ouverts : la référence « avant SPO ».
    const avgAll = Math.round(paths.reduce((a, p) => a + (100 - p.fee), 0) / paths.length);

    const setState = (clean) => {
      root.classList.toggle('is-clean', clean);
      btn.textContent = clean ? T('Revoir tous les chemins', 'Show all paths again') : T('Appliquer le SPO', 'Apply SPO');

      const avg = clean ? 100 - best.fee : avgAll;
      const fees = 100 - avg;

      $('[data-spo-fees]', root).textContent = pc(fees);
      $('[data-spo-working]', root).textContent = pc(avg);
      $('[data-spo-fees-fill]', root).style.width = fees * 2.4 + '%';
      $('[data-spo-working-fill]', root).style.width = avg + '%';
      $('[data-spo-working-fill]', root).classList.toggle('is-good', clean);
      showDetail(clean ? best : paths[paths.length - 1]);

      $('[data-spo-note]', root).innerHTML = EN
        ? (clean
          ? `<strong>Only one path kept: ${best.hops.map((h) => h.n).join(' → ')}, ${pc(100 - best.fee)} working media.</strong> ` +
            `We didn’t negotiate a better price — we removed layers that added nothing. ` +
            `Same budget, ${100 - best.fee - avgAll} more points of impressions, and readable measurement because you know where every euro goes.`
          : `<strong>${paths.length} paths to the same impression, ${pc(fees)} of the budget absorbed on average.</strong> ` +
            `Exchanges, resellers, multiple SSPs: the same inventory surfaces several times and every ` +
            `intermediary takes a cut. In practice, up to 357 possible routes have been observed.`)
        : clean
        ? `<strong>Un seul chemin conservé : ${best.hops.map((h) => h.n).join(' → ')}, ${100 - best.fee} % de working media.</strong> ` +
          `On n'a pas négocié un meilleur prix — on a retiré des étages qui ne servaient à rien. ` +
          `À budget constant, ${100 - best.fee - avgAll} points d'impressions en plus, et une mesure lisible parce qu'on sait par où passe chaque euro.`
        : `<strong>${paths.length} chemins vers la même impression, ${fees} % du budget absorbé en moyenne.</strong> ` +
          `Exchanges, revendeurs, SSP multiples : le même inventaire remonte plusieurs fois et chaque ` +
          `intermédiaire prend sa marge. En pratique on relève jusqu'à 357 routes possibles.`;
    };

    btn.addEventListener('click', () => setState(!root.classList.contains('is-clean')));
    onEnter(root, () => setState(false));
  }

  /* ======================================================================
     7. Radars DSP
     ====================================================================== */
  function radars() {
    const cards = $$('[data-radar]');
    if (!cards.length) return;
    const AX = ['Reach', 'Data', 'Premium', T('Neutralité', 'Neutrality'), T('Coût', 'Cost')];
    cards.forEach((card) => {
      const svg = $('.dsp__radar', card);
      const vals = card.dataset.radar.split(',').map(Number);
      const cx = 100, cy = 90, R = 62, n = 5;
      const pt = (i, r) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2;
        return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
      };
      let g = '';
      [0.25, 0.5, 0.75, 1].forEach((k) => {
        g += `<polygon class="grid-l" points="${Array.from({ length: n }, (_, i) => pt(i, R * k).map((v) => v.toFixed(1)).join(',')).join(' ')}"/>`;
      });
      for (let i = 0; i < n; i++) {
        const [x, y] = pt(i, R);
        g += `<line class="grid-l" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
        const [lx, ly] = pt(i, R + 15);
        g += `<text class="axl" x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" text-anchor="middle">${AX[i]}</text>`;
      }
      g += `<polygon class="shape" points="${vals.map((v, i) => pt(i, (R * v) / 100).map((x) => x.toFixed(1)).join(',')).join(' ')}"/>`;
      svg.setAttribute('viewBox', '0 0 200 180');
      svg.innerHTML = g;
      onEnter(card, () => card.classList.add('is-in'), 0.3);
    });
  }

  /* ======================================================================
     8. Checklist go live
     ====================================================================== */
  function golive() {
    const root = $('[data-golive]');
    if (!root) return;
    const items = $$('.gl', root);
    const fg = $('.gauge__fg', root);
    const num = $('[data-gl-num]', root);
    const msg = $('[data-gl-msg]', root);
    const C = 439.8;

    const MSG = EN ? [
      'Nothing checked yet. Going live like this means a campaign you can neither read nor defend.',
      'Making progress. Five items still open.',
      'The setup is taking shape, but tracking remains the critical point.',
      'Solid base. Watch the deal IDs and the exclusions.',
      'Almost there. Two checks before launch.',
      'One last item to tick.',
      'Ready to launch. The campaign will be readable at wrap-up.',
    ] : [
      'Aucun point validé. Un go live dans cet état, c’est une campagne qu’on ne saura ni lire ni défendre.',
      'On avance. Cinq points restent ouverts.',
      'Le paramétrage prend forme, mais le tracking reste le point critique.',
      'Bonne base. Attention aux deal IDs et aux exclusions.',
      'Presque. Deux vérifications avant de lancer.',
      'Un dernier point à cocher.',
      'Prêt au lancement. La campagne sera lisible au bilan.',
    ];

    const update = () => {
      const ok = items.filter((i) => i.classList.contains('is-ok')).length;
      const p = ok / items.length;
      fg.style.strokeDashoffset = C * (1 - p);
      fg.classList.toggle('is-ready', p === 1);
      num.textContent = Math.round(p * 100) + '%';
      msg.textContent = MSG[ok];
      msg.classList.toggle('is-ready', p === 1);
    };

    items.forEach((i) =>
      i.addEventListener('click', () => { i.classList.toggle('is-ok'); update(); })
    );
    update();
  }

  /* ======================================================================
     9. Anneaux de data
     ====================================================================== */
  function rings() {
    const root = $('[data-rings]');
    if (!root) return;
    const circles = $$('.rings__c', root);
    const items = $$('.rings__item', root);
    const set = (k) => {
      circles.forEach((c) => c.classList.toggle('is-on', c.dataset.ring === k));
      items.forEach((i) => i.classList.toggle('is-on', i.dataset.ring === k));
    };
    items.forEach((i) => {
      i.addEventListener('mouseenter', () => set(i.dataset.ring));
      i.addEventListener('click', () => set(i.dataset.ring));
    });
    circles.forEach((c) => c.addEventListener('mouseenter', () => set(c.dataset.ring)));
    set('1');
  }

  /* ======================================================================
     10. DOOH — déclencheurs contextuels
     ====================================================================== */
  function dooh() {
    const root = $('[data-dooh]');
    if (!root) return;
    const trigs = $$('.dooh__trig', root);
    const bb = $('.billboard', root);
    const inner = $('.billboard__inner', root);
    const glow = $('.billboard__glow', root);
    const meta = $('[data-dooh-meta]', root);

    const apply = (t) => {
      bb.classList.add('is-swap');
      setTimeout(() => {
        $('.billboard__eyebrow', inner).textContent = t.dataset.eyebrow;
        $('.billboard__msg', inner).textContent = t.dataset.msg;
        $('.billboard__sub', inner).textContent = t.dataset.sub;
        glow.style.setProperty('--gc', t.dataset.glow);
        meta.textContent = t.dataset.meta;
        bb.classList.remove('is-swap');
      }, 320);
      trigs.forEach((x) => x.classList.toggle('is-on', x === t));
    };
    trigs.forEach((t) => t.addEventListener('click', () => apply(t)));
    apply(trigs[0]);

    if (!reduced()) {
      let auto = true, i = 0;
      root.addEventListener('click', () => { auto = false; });
      setInterval(() => {
        if (!auto) return;
        i = (i + 1) % trigs.length;
        apply(trigs[i]);
      }, 3800);
    }
  }

  /* ======================================================================
     11. Donut de répartition budgétaire
     ====================================================================== */
  function donut() {
    $$('[data-donut]').forEach((root) => {
      const svg = $('svg', root);
      const legend = $('.legend', root);
      const midV = $('[data-donut-v]', root);
      const midL = $('[data-donut-l]', root);
      const data = JSON.parse(root.dataset.donut);
      const R = 70, C = 2 * Math.PI * R;

      let off = 0, g = '';
      data.forEach((d, i) => {
        const len = (d.v / 100) * C;
        g += `<circle class="donut__seg" data-i="${i}" cx="90" cy="90" r="${R}" stroke="${d.c}"
              stroke-dasharray="${len - 2} ${C - len + 2}" stroke-dashoffset="${-off}"/>`;
        off += len;
      });
      svg.setAttribute('viewBox', '0 0 180 180');
      svg.innerHTML = g;

      legend.innerHTML = data
        .map((d, i) => `<button data-i="${i}" style="--c:${d.c}">
            <span class="sw"></span>
            <span><b>${d.t}</b><small>${d.d}</small></span>
            <span class="pct">${pc(d.v)}</span></button>`)
        .join('');

      const segs = $$('.donut__seg', svg);
      const btns = $$('button', legend);
      const sel = (i) => {
        const on = i !== null;
        root.querySelector('.donut').classList.toggle('has-sel', on);
        segs.forEach((s, k) => s.classList.toggle('is-on', k === i));
        btns.forEach((b, k) => b.classList.toggle('is-on', k === i));
        midV.textContent = on ? pc(data[i].v) : root.dataset.total || pc(100);
        midL.textContent = on ? data[i].t : root.dataset.label || T('du budget', 'of budget');
      };
      btns.forEach((b, i) => {
        b.addEventListener('mouseenter', () => sel(i));
        b.addEventListener('click', () => sel(i));
      });
      segs.forEach((s, i) => s.addEventListener('mouseenter', () => sel(i)));
      root.addEventListener('mouseleave', () => sel(null));
      sel(null);

      // Animation d'entrée
      onEnter(root, () => {
        segs.forEach((s, i) => {
          const len = (data[i].v / 100) * C;
          s.style.strokeDasharray = `0 ${C}`;
          setTimeout(() => {
            s.style.transition = 'stroke-dasharray .9s cubic-bezier(.22,1,.36,1)';
            s.style.strokeDasharray = `${len - 2} ${C - len + 2}`;
          }, 90 * i);
        });
      });
    });
  }

  /* ======================================================================
     12. Barre « 100 € investis »
     ====================================================================== */
  function cost100() {
    const root = $('[data-cost100]');
    if (!root) return;
    const segs = $$('.cost100__seg', root);
    onEnter(root, () => {
      root.classList.add('is-in');
      segs.forEach((s) => { s.style.width = s.dataset.w + '%'; });
    }, 0.3);
  }

  /* ======================================================================
     13. Timeline pilotée au scroll
     ====================================================================== */
  function timeline() {
    const tls = $$('[data-tl]');
    if (!tls.length) return;
    tls.forEach((tl) => {
      const prog = $('.tl__prog', tl);
      const items = $$('.tl__item', tl);
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-in'); }),
        { rootMargin: '0px 0px -35% 0px' }
      );
      items.forEach((i) => io.observe(i));
      if (!prog || reduced()) return;
      const run = () => {
        const r = tl.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (window.innerHeight * 0.62 - r.top) / r.height));
        prog.style.height = p * 100 + '%';
      };
      window.addEventListener('scroll', run, { passive: true });
      run();
    });
  }

  /* ======================================================================
     14. Barres de répartition (mix) + réallocation en vol
     ====================================================================== */
  function mix() {
    const root = $('[data-mix]');
    if (!root) return;
    const rows = $$('.mix__row', root);
    const btn = $('[data-mix-toggle]', root);
    let after = false;

    const paint = () => {
      rows.forEach((r) => {
        const v = parseFloat(after ? r.dataset.after : r.dataset.before);
        $('.mix__fill', r).style.width = v + '%';
        $('.mix__pct', r).textContent = pc(v);
      });
      if (btn) btn.textContent = after
        ? T('Revenir au plan initial', 'Back to the initial plan')
        : T('Appliquer l’arbitrage de la semaine 2', 'Apply the week-2 reallocation');
      const note = $('[data-mix-note]', root);
      if (note) {
        note.innerHTML = EN
          ? (after
            ? 'In week 2, <strong>12% of the display budget</strong> moves to CTV: better cost per new customer. Low-viewability placements are excluded at the same time.'
            : 'Starting plan: CTV drives reach, retail display captures intent, audio keeps the thread running.')
          : after
          ? 'En semaine 2, <strong>12 % du budget display</strong> basculent vers la CTV : meilleur coût par nouveau client. Les placements peu visibles sont exclus dans la foulée.'
          : 'Plan de départ : la CTV porte la couverture, le display retail capte l’intention, l’audio tient le fil rouge.';
      }
    };
    onEnter(root, paint, 0.3);
    if (btn) btn.addEventListener('click', () => { after = !after; paint(); });
  }

  /* ======================================================================
     15. Cartes retournables
     ====================================================================== */
  function flips() {
    $$('.flip').forEach((f) => {
      f.setAttribute('tabindex', '0');
      f.setAttribute('role', 'button');
      const t = () => f.classList.toggle('is-flipped');
      f.addEventListener('click', t);
      f.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); }
      });
    });
  }

  /* ======================================================================
     16. Ordre d'optimisation
     ====================================================================== */
  function opti() {
    $$('.opti__i').forEach((i) => {
      const bars = $$('.opti__bars i', i);
      bars.forEach((b, k) => b.style.setProperty('--d', k * 70 + 'ms'));
      onEnter(i, () => i.classList.add('is-in'), 0.4);
    });
  }

  /* ======================================================================
     17. Bandeau compteur d'impressions
     ====================================================================== */
  function liveBand() {
    const el = $('[data-live-imp]');
    if (!el) return;
    // ~ Ordre de grandeur : plusieurs milliards d'impressions programmatiques
    // par jour dans le monde. Le compteur repart de zéro à l'ouverture.
    let n = 0;
    const t0 = performance.now();
    const tick = (t) => {
      n = ((t - t0) / 1000) * 148000; // ~148 k impressions/seconde
      el.textContent = Math.floor(n).toLocaleString(EN ? 'en-GB' : 'fr-FR');
      requestAnimationFrame(tick);
    };
    if (reduced()) { el.textContent = T('12 800 000 000', '12,800,000,000'); return; }
    requestAnimationFrame(tick);
  }

  /* ======================================================================
     18. Navigateurs / cookies
     ====================================================================== */
  function browsers() {
    $$('.br__cookie i').forEach((c, i) => c.style.setProperty('--d', (i % 6) * 90 + 'ms'));
  }

  /* ======================================================================
     19. Funnel — largeurs animées
     ====================================================================== */
  function funnel() {
    const root = $('[data-funnel]');
    if (!root) return;
    const fns = $$('.fn', root);
    fns.forEach((f) => { f.style.width = '100%'; });
    onEnter(root, () => {
      fns.forEach((f, i) => setTimeout(() => { f.style.width = f.dataset.w; }, i * 140));
    }, 0.3);
  }

  /* ======================================================================
     20. Quiz
     ====================================================================== */
  const QUESTIONS_FR = [
    {
      q: 'Que signifie « RTB » ?',
      o: ['Real Time Branding', 'Real Time Bidding', 'Rate Tracking Base', 'Reach Targeting Benchmark'],
      a: 1,
      lvl: 1,
      e: 'Real Time Bidding. L’enchère se joue en temps réel, pendant le chargement de la page.',
    },
    {
      q: 'Combien de temps dure une enchère programmatique ?',
      o: ['Environ deux secondes', 'Environ une seconde', 'Environ 120 millisecondes', 'Cela dépend du budget de la campagne'],
      a: 2,
      lvl: 1,
      e: 'Environ 120 millisecondes. Six étapes, bouclées avant que la page ne s’affiche.',
    },
    {
      q: 'Quel acteur enchérit pour le compte de l’annonceur ?',
      o: ['Le SSP', 'L’ad exchange', 'La DSP', 'L’ad server'],
      a: 2,
      lvl: 1,
      e: 'La DSP. Elle se situe côté demande. Le SSP, lui, travaille pour l’éditeur.',
    },
    {
      q: 'En modèle first price, le gagnant paie…',
      o: ['La deuxième meilleure enchère plus un centime', 'Son enchère maximale', 'Le prix plancher de l’éditeur', 'La moyenne des enchères reçues'],
      a: 1,
      lvl: 1,
      e: 'Son enchère maximale. Chaque centime d’enchère est un centime dépensé.',
    },
    {
      q: 'Quel type de deal garantit le volume d’impressions ?',
      o: ['Open Auction', 'Private Auction', 'Preferred Deal', 'Programmatic Guaranteed'],
      a: 3,
      lvl: 2,
      e: 'Programmatic Guaranteed. C’est le seul deal qui réserve les impressions. Le Preferred Deal donne un accès prioritaire, pas un volume.',
    },
    {
      q: 'Qu’appelle-t-on data first party ?',
      o: ['Les données achetées à un fournisseur tiers', 'Les données de l’annonceur, collectées dans son environnement', 'Les données d’un partenaire média partagées gratuitement', 'Les segments socio-démo de l’éditeur'],
      a: 1,
      lvl: 1,
      e: 'Les données de l’annonceur. Collectées par lui, chez lui. La troisième proposition décrit la second party, la première la third party.',
    },
    {
      q: 'Un ciblage « audience based », c’est…',
      o: ['Acheter un emplacement sur un site à l’audience présupposée', 'Acheter des individus qualifiés par la data, quel que soit le site', 'Acheter uniquement en enchère ouverte', 'Acheter au CPM fixe garanti'],
      a: 1,
      lvl: 3,
      e: 'Des individus qualifiés par la data. La première proposition décrit le media based, la logique du média planning classique.',
    },
    {
      q: 'À quoi sert le capping ?',
      o: ['À plafonner le CPM maximum', 'À limiter le budget quotidien', 'À limiter la répétition d’exposition par personne', 'À bloquer les sites non brand safe'],
      a: 2,
      lvl: 2,
      e: 'Limiter la répétition. Il pilote la pression publicitaire, cross-publisher et cross-écrans.',
    },
    {
      q: 'Quel indicateur mesure l’écoute complète d’un spot audio ?',
      o: ['Le VTR', 'Le LTR', 'L’ODV', 'Le CTR'],
      a: 1,
      lvl: 3,
      e: 'Le LTR (listen-through rate). Le VTR est son équivalent vidéo, l’ODV celui du DOOH.',
    },
    {
      q: 'En avril 2025, Google a annoncé pour les cookies tiers dans Chrome…',
      o: ['Une suppression totale fin 2025', 'Une suppression progressive jusqu’en 2027', 'Le maintien du cookie tiers, avec choix laissé à l’utilisateur', 'Un remplacement par un identifiant unique obligatoire'],
      a: 2,
      lvl: 2,
      e: 'Le cookie tiers est maintenu : Google a renoncé à le supprimer. Mais Safari et Firefox le bloquent déjà par défaut.',
    },
  ];

  const QUESTIONS_EN = [
    {
      q: 'What does “RTB” stand for?',
      o: ['Real Time Branding', 'Real Time Bidding', 'Rate Tracking Base', 'Reach Targeting Benchmark'],
      a: 1,
      lvl: 1,
      e: 'Real Time Bidding. The auction happens in real time, while the page is loading.',
    },
    {
      q: 'How long does a programmatic auction take?',
      o: ['About two seconds', 'About one second', 'About 120 milliseconds', 'It depends on the campaign budget'],
      a: 2,
      lvl: 1,
      e: 'About 120 milliseconds. Six steps, completed before the page is displayed.',
    },
    {
      q: 'Which player bids on behalf of the advertiser?',
      o: ['The SSP', 'The ad exchange', 'The DSP', 'The ad server'],
      a: 2,
      lvl: 1,
      e: 'The DSP. It sits on the demand side. The SSP works for the publisher.',
    },
    {
      q: 'In a first-price model, the winner pays…',
      o: ['The second-highest bid plus one cent', 'Its maximum bid', 'The publisher’s floor price', 'The average of the bids received'],
      a: 1,
      lvl: 1,
      e: 'Its maximum bid. Every cent bid is a cent spent.',
    },
    {
      q: 'Which deal type guarantees impression volume?',
      o: ['Open Auction', 'Private Auction', 'Preferred Deal', 'Programmatic Guaranteed'],
      a: 3,
      lvl: 2,
      e: 'Programmatic Guaranteed. It is the only deal that reserves impressions. A Preferred Deal gives priority access, not volume.',
    },
    {
      q: 'What is first-party data?',
      o: ['Data bought from a third-party provider', 'The advertiser’s own data, collected in its own environment', 'A media partner’s data shared at no cost', 'The publisher’s socio-demographic segments'],
      a: 1,
      lvl: 1,
      e: 'The advertiser’s data. Collected by the advertiser, on its own properties. The third option describes second party, the first one third party.',
    },
    {
      q: '“Audience based” targeting means…',
      o: ['Buying a placement on a site with an assumed audience', 'Buying data-qualified individuals, whatever the site', 'Buying only in the open auction', 'Buying at a guaranteed fixed CPM'],
      a: 1,
      lvl: 3,
      e: 'Data-qualified individuals. The first option describes media based buying, the logic of traditional media planning.',
    },
    {
      q: 'What is frequency capping for?',
      o: ['Capping the maximum CPM', 'Limiting the daily budget', 'Limiting repeat exposure per person', 'Blocking non-brand-safe sites'],
      a: 2,
      lvl: 2,
      e: 'Limiting repetition. It controls ad pressure, across publishers and across screens.',
    },
    {
      q: 'Which metric measures full listens of an audio spot?',
      o: ['VTR', 'LTR', 'ODV', 'CTR'],
      a: 1,
      lvl: 3,
      e: 'LTR (listen-through rate). VTR is its video equivalent, ODV (opportunity to see) the DOOH one.',
    },
    {
      q: 'In April 2025, regarding third-party cookies in Chrome, Google announced…',
      o: ['Full removal by end of 2025', 'Gradual removal through 2027', 'Keeping third-party cookies, with the choice left to users', 'Replacement by a mandatory single identifier'],
      a: 2,
      lvl: 2,
      e: 'Third-party cookies stay: Google dropped its plan to remove them. But Safari and Firefox already block them by default.',
    },
  ];
  const QUESTIONS = EN ? QUESTIONS_EN : QUESTIONS_FR;

  function quiz() {
    const root = $('[data-quiz]');
    if (!root) return;
    const dots = $('[data-quiz-dots]', root);
    const scoreEl = $('[data-quiz-score]', root);
    const card = $('[data-quiz-card]', root);
    let i = 0, score = 0, answers = [], dotEls = [];

    // Le quiz suit le format de session : 5 questions en 45 min,
    // 8 en 1 h, les 10 en 90 min.
    let SET = [];
    const buildSet = () => {
      SET = QUESTIONS.filter((q) => q.lvl <= window.LP.rank());
      dots.innerHTML = SET.map(() => '<i></i>').join('');
      dotEls = $$('i', dots);
    };

    const paintDots = () => {
      dotEls.forEach((d, k) => {
        d.className = '';
        if (answers[k] !== undefined) d.classList.add(answers[k] ? 'ok' : 'ko');
        if (k === i) d.classList.add('is-now');
      });
      scoreEl.innerHTML = `<b>${score}</b> / ${SET.length}`;
    };

    const render = () => {
      if (i >= SET.length) return end();
      const q = SET[i];
      card.innerHTML = `
        <div class="quiz__n">Question ${i + 1} ${T('sur', 'of')} ${SET.length}</div>
        <div class="quiz__q">${q.q}</div>
        <div class="quiz__opts">
          ${q.o.map((o, k) => `<button class="qopt" data-k="${k}">
              <i>${'ABCD'[k]}</i><span>${o}</span>
              <svg class="mk" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>`).join('')}
        </div>
        <div class="quiz__exp" data-exp></div>
        <div class="quiz__foot">
          <span class="muted" style="font-size:.84rem">${T('Pas d’enjeu — l’objectif est de repérer les points à clarifier.', 'No pressure — the goal is to spot what needs clarifying.')}</span>
          <button class="btn btn--primary btn--sm" data-next hidden>
            ${i === SET.length - 1 ? T('Voir le résultat', 'See the result') : T('Question suivante', 'Next question')}
            <svg class="btn__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>`;
      paintDots();

      const opts = $$('.qopt', card);
      const exp = $('[data-exp]', card);
      const next = $('[data-next]', card);

      opts.forEach((b) =>
        b.addEventListener('click', () => {
          const k = +b.dataset.k;
          const right = k === q.a;
          answers[i] = right;
          if (right) score++;
          opts.forEach((o, ok) => {
            o.disabled = true;
            if (ok === q.a) o.classList.add('is-right');
            else if (ok === k) o.classList.add('is-wrong');
            else o.classList.add('is-mute');
          });
          exp.innerHTML = `<strong>${right ? T('Exact.', 'Correct.') : T('Réponse attendue : ', 'Expected answer: ') + 'ABCD'[q.a] + '.'}</strong> ${q.e}`;
          exp.classList.add('is-show');
          next.hidden = false;
          paintDots();
        })
      );
      next.addEventListener('click', () => { i++; render(); });
    };

    const end = () => {
      const p = score / SET.length;
      const badge = EN
        ? (p === 1 ? 'Perfect score' : p >= 0.8 ? 'Solid' : p >= 0.6 ? 'Good base' : p >= 0.4 ? 'Needs work' : 'Start over')
        : p === 1 ? 'Sans faute' : p >= 0.8 ? 'Solide' : p >= 0.6 ? 'Bonne base' : p >= 0.4 ? 'À consolider' : 'À reprendre';
      const advice = EN
        ? (p >= 0.8
          ? 'The fundamentals are there. Chapter 4, “In the field”, will be the most useful.'
          : p >= 0.5
            ? 'Go back over chapter 1: the auction, pricing models and deal types.'
            : 'Start with chapter 1, in order — everything else builds on it.')
        : p >= 0.8
          ? 'Les fondamentaux sont acquis. Le chapitre 4 « Sur le terrain » sera le plus utile.'
          : p >= 0.5
            ? 'Reprenez le chapitre 1 : enchère, modèles de prix et types de deals.'
            : 'Commencez par le chapitre 1 dans l’ordre — tout le reste en découle.';
      card.innerHTML = `
        <div class="quiz__end">
          <div class="quiz__ring">
            <svg viewBox="0 0 180 180"><circle class="bg" cx="90" cy="90" r="80"/><circle class="fg" cx="90" cy="90" r="80"/></svg>
            <div><b>${score}/${SET.length}</b><span>${T('Bonnes réponses', 'Correct answers')}</span></div>
          </div>
          <div class="quiz__badge">${badge}</div>
          <p class="lead" style="max-width:520px">${advice}</p>
          <div class="quiz__review">
            ${SET.map((q, k) => `<div class="qrev ${answers[k] ? 'ok' : 'ko'}">
                <i>${answers[k] ? '✓' : '✗'}</i>
                <div><b>${q.q}</b><span>${q.e}</span></div></div>`).join('')}
          </div>
          <div class="btn-row" style="justify-content:center">
            <button class="btn btn--ghost btn--sm" data-again>${T('Refaire le quiz', 'Retake the quiz')}</button>
            <a class="btn btn--primary btn--sm" href="fondamentaux.html">${T('Entrer dans le chapitre 1', 'Start chapter 1')}
              <svg class="btn__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
          </div>
        </div>`;
      paintDots();
      const fg = $('.fg', card);
      setTimeout(() => { fg.style.strokeDashoffset = 502 * (1 - p); }, 120);
      $('[data-again]', card).addEventListener('click', () => {
        i = 0; score = 0; answers = []; render();
      });
      if (p >= 0.8) confetti();
    };

    const restart = () => { i = 0; score = 0; answers = []; buildSet(); render(); };
    restart();
    // Changer de format en cours de route relance le quiz sur le bon jeu.
    document.addEventListener('lp:format', restart);
  }

  /* ---------- Confettis (canvas léger) ---------- */
  function confetti() {
    if (reduced()) return;
    const cv = document.createElement('canvas');
    cv.className = 'confetti';
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    ctx.scale(dpr, dpr);
    const COLORS = ['#ff9900', '#febd69', '#37c5f0', '#ffffff', '#34d399'];
    const bits = Array.from({ length: 130 }, () => ({
      x: innerWidth / 2 + rand(-140, 140),
      y: innerHeight * 0.42,
      vx: rand(-7, 7),
      vy: rand(-15, -5),
      w: rand(5, 11),
      h: rand(4, 9),
      r: rand(0, Math.PI),
      vr: rand(-0.22, 0.22),
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    let f = 0;
    const step = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      bits.forEach((b) => {
        b.vy += 0.34; b.x += b.vx; b.y += b.vy; b.r += b.vr; b.vx *= 0.995;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.r);
        ctx.fillStyle = b.c;
        ctx.globalAlpha = Math.max(0, 1 - f / 150);
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      });
      f++;
      if (f < 160) requestAnimationFrame(step);
      else cv.remove();
    };
    step();
  }

  /* ======================================================================
     21. Glossaire
     ====================================================================== */
  const GLOSSARY_FR = [
    ['Ad server', '', 'Serveur publicitaire chargé de la diffusion des créations et du comptage des impressions.'],
    ['AMC', 'Amazon Marketing Cloud', 'Clean room permettant des analyses croisées et la construction d’audiences sur mesure sans exposer de données individuelles.'],
    ['Capping', '', 'Limitation du nombre d’expositions d’une même personne à une campagne, sur une période donnée.'],
    ['CPA', 'coût par acquisition', 'Coût moyen d’une conversion.'],
    ['CPC', 'coût par clic', 'Coût moyen d’un clic.'],
    ['CPM', 'coût pour mille', 'Prix payé pour mille impressions.'],
    ['CTR', 'click-through rate', 'Taux de clic : clics rapportés aux impressions.'],
    ['CTV', 'connected TV', 'Télévision connectée : vidéo diffusée sur téléviseur via une application ou une plateforme de streaming.'],
    ['DCO', 'dynamic creative optimization', 'Personnalisation automatique de la création selon le contexte ou le profil.'],
    ['Deal ID', '', 'Identifiant contractuel d’un accord entre acheteur et éditeur, activé dans la DSP.'],
    ['DOOH', 'digital out of home', 'Affichage digital extérieur.'],
    ['DSP', 'demand-side platform', 'Plateforme d’achat côté annonceur.'],
    ['First price', '', 'Modèle d’enchère où le gagnant paie son enchère maximale.'],
    ['LTR', 'listen-through rate', 'Taux d’écoute complète d’un spot audio.'],
    ['ODV', 'opportunité de voir', 'Indicateur de contact utilisé en DOOH.'],
    ['Open Auction', '', 'Enchère ouverte à tous les acheteurs.'],
    ['Pacing', '', 'Rythme de consommation du budget sur la durée de la campagne.'],
    ['PA', 'private auction', 'Enchère privée, réservée à des acheteurs invités.'],
    ['PD', 'preferred deal', 'Accord de gré à gré à CPM fixe, donnant un accès prioritaire sans engagement de volume.'],
    ['PG', 'programmatic guaranteed', 'Accord de gré à gré à CPM fixe avec volume d’impressions garanti.'],
    ['ROAS', 'return on ad spend', 'Chiffre d’affaires généré rapporté au budget média investi.'],
    ['RTB', 'real time bidding', 'Enchère en temps réel.'],
    ['Second price', '', 'Modèle d’enchère où le gagnant paie la deuxième meilleure enchère plus un centime.'],
    ['SPO', 'supply path optimisation', 'Optimisation du chemin d’achat entre la DSP et l’éditeur.'],
    ['SSP', 'supply-side platform', 'Plateforme de vente côté éditeur.'],
    ['VTR', 'view-through rate', 'Taux de visionnage complet d’une vidéo.'],
    ['Working media', '', 'Part du budget qui finance réellement l’achat d’impressions.'],
  ];

  const GLOSSARY_EN = [
    ['Ad server', '', 'Server that delivers creatives and counts impressions.'],
    ['AMC', 'Amazon Marketing Cloud', 'Clean room for cross-dataset analysis and custom audience building without exposing individual-level data.'],
    ['Capping', 'frequency capping', 'Limit on how many times the same person sees a campaign over a given period.'],
    ['CPA', 'cost per acquisition', 'Average cost of one conversion.'],
    ['CPC', 'cost per click', 'Average cost of one click.'],
    ['CPM', 'cost per mille', 'Price paid for a thousand impressions.'],
    ['CTR', 'click-through rate', 'Clicks divided by impressions.'],
    ['CTV', 'connected TV', 'Video delivered on a TV set through an app or a streaming platform.'],
    ['DCO', 'dynamic creative optimization', 'Automatic tailoring of the creative to the context or profile.'],
    ['Deal ID', '', 'Contract identifier for an agreement between buyer and publisher, activated in the DSP.'],
    ['DOOH', 'digital out of home', 'Digital outdoor advertising.'],
    ['DSP', 'demand-side platform', 'Buying platform on the advertiser side.'],
    ['First price', '', 'Auction model where the winner pays its maximum bid.'],
    ['LTR', 'listen-through rate', 'Share of audio spots listened to in full.'],
    ['ODV', 'opportunity to see', 'Contact metric used in DOOH (French: opportunité de voir).'],
    ['Open Auction', '', 'Auction open to all buyers.'],
    ['Pacing', '', 'How fast the budget is spent over the campaign flight.'],
    ['PA', 'private auction', 'Auction restricted to invited buyers.'],
    ['PD', 'preferred deal', 'Direct, fixed-CPM agreement giving priority access with no volume commitment.'],
    ['PG', 'programmatic guaranteed', 'Direct, fixed-CPM agreement with a guaranteed number of impressions.'],
    ['ROAS', 'return on ad spend', 'Revenue generated divided by media spend.'],
    ['RTB', 'real time bidding', 'Real-time auction.'],
    ['Second price', '', 'Auction model where the winner pays the second-highest bid plus one cent.'],
    ['SPO', 'supply path optimisation', 'Optimising the buying path between the DSP and the publisher.'],
    ['SSP', 'supply-side platform', 'Selling platform on the publisher side.'],
    ['VTR', 'view-through rate', 'Share of videos watched to completion.'],
    ['Working media', '', 'Share of the budget that actually pays for impressions.'],
  ];
  const GLOSSARY = EN ? GLOSSARY_EN : GLOSSARY_FR;

  function glossary() {
    const root = $('[data-gloss]');
    if (!root) return;
    const grid = $('[data-gloss-grid]', root);
    const input = $('[data-gloss-search]', root);
    const alpha = $('[data-gloss-alpha]', root);
    const count = $('[data-gloss-count]', root);
    let letter = null;

    const norm = (s) =>
      s.normalize('NFD').replace(new RegExp('[\\u0300-\\u036f]', 'g'), '').replace(/[’']/g, "'").toLowerCase();

    const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const present = new Set(GLOSSARY.map((g) => g[0][0].toUpperCase()));
    alpha.innerHTML =
      `<button data-l="" class="is-on">${T('Tous', 'All')}</button>` +
      LETTERS.map((l) => `<button data-l="${l}"${present.has(l) ? '' : ' disabled'}>${l}</button>`).join('');

    const hi = (txt, q) => {
      if (!q) return txt;
      const idx = norm(txt).indexOf(norm(q));
      if (idx < 0) return txt;
      return txt.slice(0, idx) + '<mark>' + txt.slice(idx, idx + q.length) + '</mark>' + txt.slice(idx + q.length);
    };

    const render = () => {
      const q = input.value.trim();
      const nq = norm(q);
      const list = GLOSSARY.filter((g) => {
        const okL = !letter || g[0][0].toUpperCase() === letter;
        const okQ = !nq || norm(g[0] + ' ' + g[1] + ' ' + g[2]).includes(nq);
        return okL && okQ;
      });
      count.textContent = list.length + (EN
        ? (list.length === 1 ? ' term' : ' terms')
        : (list.length > 1 ? ' termes' : ' terme'));
      grid.innerHTML = list.length
        ? list.map((g, i) => `<div class="gl-term" style="animation-delay:${Math.min(i * 24, 400)}ms">
              <div class="gl-term__t"><b>${hi(g[0], q)}</b>${g[1] ? `<span>${hi(g[1], q)}</span>` : ''}</div>
              <p>${hi(g[2], q)}</p></div>`).join('')
        : '<div class="gl-empty">' + T('Aucun terme ne correspond. Essayez « enchère », « CPM » ou « deal ».', 'No matching term. Try “auction”, “CPM” or “deal”.') + '</div>';
    };

    input.addEventListener('input', render);
    alpha.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || b.disabled) return;
      letter = b.dataset.l || null;
      $$('button', alpha).forEach((x) => x.classList.toggle('is-on', x === b));
      render();
    });
    render();
  }

  /* ======================================================================
     Boot
     ====================================================================== */

  /* ======================================================================
     22. Priorité d'accès à l'inventaire
     La priorité de livraison de l'ad server prime sur le montant de
     l'enchère : on coupe les niveaux un par un pour le montrer.
     ====================================================================== */
  const PRIO = [
    { n: 'Programmatic Guaranteed', cpm: 12.0, fixe: true },
    { n: 'Preferred Deal', cpm: 9.5, fixe: true },
    { n: 'Private Auction', cpm: 14.2, fixe: false },
    { n: 'Open Auction', cpm: 16.4, fixe: false },
  ];

  function prio() {
    const root = $('[data-prio]');
    if (!root) return;
    const rows = $$('[data-prio-row]', root);
    const verdict = $('[data-prio-verdict]', root);
    const active = PRIO.map(() => true);

    const paint = () => {
      const winner = active.indexOf(true);
      rows.forEach((el, i) => {
        el.classList.toggle('is-off', !active[i]);
        el.classList.toggle('is-win', i === winner);
        el.classList.toggle('is-skip', active[i] && i !== winner);
        const st = $('.prio__state', el);
        st.textContent = !active[i]
          ? T('désactivé', 'disabled')
          : i === winner
            ? T('sert l’impression', 'serves the impression')
            : i < winner ? '—' : T('jamais atteint', 'never reached');
      });

      if (winner === -1) {
        verdict.innerHTML = EN
          ? '<strong>No eligible demand left.</strong> The publisher serves its own house ad, or leaves the slot empty. This is called a <em>passback</em>.'
          :
          '<strong>Plus aucune demande éligible.</strong> L’éditeur sert son propre habillage, ou laisse l’emplacement vide. C’est ce qu’on appelle un <em>passback</em>.';
        return;
      }
      const w = PRIO[winner];
      const higher = PRIO.filter((p, i) => active[i] && i > winner);
      const best = higher.length ? Math.max(...higher.map((p) => p.cpm)) : 0;
      if (EN) {
        verdict.innerHTML = best > w.cpm
          ? `<strong>${w.n} serves the impression at ${eur(w.cpm)}</strong> — even though a lower tier offered ${eur(best)}. ` +
            `The ad server works down the ladder in order: it only compares prices within the same tier. ` +
            `That is the whole point of negotiating a PG or PD on scarce inventory.`
          : `<strong>${w.n} serves the impression at ${eur(w.cpm)}</strong> — it is the highest-priority tier still active, ` +
            `and no lower tier offers more.`;
      } else if (best > w.cpm) {
        verdict.innerHTML =
          `<strong>${w.n} sert l’impression à ${eur(w.cpm)}</strong> — alors qu’un niveau plus bas proposait ${eur(best)}. ` +
          `L’ad server descend l’échelle dans l’ordre : il ne compare les prix qu’à l’intérieur d’un même niveau. ` +
          `C’est tout l’intérêt de négocier un PG ou un PD sur un inventaire rare.`;
      } else {
        verdict.innerHTML =
          `<strong>${w.n} sert l’impression à ${eur(w.cpm)}</strong> — c’est le niveau le mieux placé encore actif, ` +
          `et aucun niveau inférieur ne propose davantage.`;
      }
    };

    rows.forEach((el, i) =>
      $('.prio__sw', el).addEventListener('click', () => { active[i] = !active[i]; paint(); })
    );
    const reset = $('[data-prio-reset]', root);
    if (reset) reset.addEventListener('click', () => { active.fill(true); paint(); });
    paint();
  }

  /* ======================================================================
     23. Cascade contre header bidding
     Un plancher commun aux deux méthodes. Il filtre les enchères ; c'est
     ensuite la façon de mettre en concurrence qui désigne le gagnant.
     ====================================================================== */
  const SSPS = ['Xandr', 'Magnite', 'PubMatic', 'Equativ', 'Index Exchange'];
  const ST = EN ? {
    under: 'Below the floor',
    reject: 'Rejected',
    elig: 'Eligible',
    win: 'Winner',
    skip: 'Not called',
  } : {
    under: 'Sous le plancher',
    reject: 'Rejetée',
    elig: 'Éligible',
    win: 'Gagnante',
    skip: 'Non interrogée',
  };

  function headerBidding() {
    const root = $('[data-hb]');
    if (!root) return;
    const cascadeBox = $('[data-hb-calls-cascade]', root);
    const hbBox = $('[data-hb-calls-hb]', root);
    const verdict = $('[data-hb-verdict]', root);
    const floorEl = $('[data-hb-floor]', root);
    const deltaEl = $('[data-hb-delta]', root);
    const runBtn = $('[data-hb-run]', root);
    let timers = [];

    /**
     * Tire cinq offres et un plancher, puis garantit que la cascade ne
     * tombe pas d'emblée sur la meilleure : c'est tout l'intérêt de la
     * démonstration, le header bidding doit rapporter davantage.
     */
    const deal = () => {
      // Plancher placé entre la 3e et la 4e meilleure offre : trois éligibles,
      // deux rejetées. On retire les tirages où l'écart entre la meilleure
      // éligible et la plus faible est trop mince pour être démonstratif.
      let elig = [], rej = [], floor = 0;
      for (let t = 0; t < 80; t++) {
        const cpms = Array.from({ length: 5 }, () => Math.round(rand(3.2, 9.6) * 100) / 100);
        const desc = [...cpms].sort((a, b) => b - a);
        floor = Math.round(rand(desc[3] + 0.06, desc[2] - 0.06) * 100) / 100;
        elig = desc.filter((c) => c >= floor);
        rej = desc.filter((c) => c < floor);
        if (elig.length === 3 && rej.length === 2 && elig[0] - elig[2] >= 1) break;
      }

      // Ordre d'appel didactique : deux rejets d'abord, puis la plus faible
      // des éligibles — c'est elle que la cascade retient, alors que la
      // meilleure attend plus loin sans jamais être interrogée.
      const seq = [rej[0], rej[1], elig[2], ...(Math.random() < 0.5 ? [elig[0], elig[1]] : [elig[1], elig[0]])];
      const names = [...SSPS].sort(() => Math.random() - 0.5);
      const bids = seq.map((cpm, i) => ({ n: names[i], cpm }));
      const best = bids.reduce((a, b) => (b.cpm > a.cpm ? b : a));
      return { bids, floor, best, first: bids.findIndex((b) => b.cpm >= floor) };
    };

    const row = (b, floor, scale) => `
      <div class="hb__call">
        <span class="hb__who"><b>${b.n}</b><em></em></span>
        <span class="hb__v">${eur(b.cpm)}</span>
        <span class="hb__st"></span>
        <span class="hb__gauge">
          <i class="hb__fill" data-w="${Math.min(100, (b.cpm / scale) * 100).toFixed(1)}"></i>
          <i class="hb__bar-floor" style="left:${((floor / scale) * 100).toFixed(1)}%"></i>
        </span>
      </div>`;

    /** Applique un état à une ligne : la barrière se joue ici. */
    const setRow = (el, state, bid, floor, winTxt) => {
      el.classList.remove('is-reject', 'is-elig', 'is-win', 'is-skip');
      const fill = $('.hb__fill', el);
      const st = $('.hb__st', el);
      const em = $('.hb__who em', el);
      el.classList.add('is-on');

      if (state === 'skip') {
        el.classList.add('is-skip');
        st.textContent = ST.skip;
        em.textContent = T('l’impression est déjà vendue', 'the impression is already sold');
        fill.style.width = '0%';
        $('.hb__v', el).textContent = '—';
        return;
      }
      // L'offre progresse vers la barrière : elle s'arrête dessous, ou la franchit.
      fill.style.width = fill.dataset.w + '%';
      if (state === 'reject') {
        el.classList.add('is-reject');
        st.textContent = ST.reject;
        em.textContent = EN ? `${ST.under} — ${eur(floor - bid.cpm)} short` : `${ST.under} — il manque ${eur(floor - bid.cpm)}`;
      } else if (state === 'elig') {
        el.classList.add('is-elig');
        st.textContent = ST.elig;
        em.textContent = EN ? `clears the floor by ${eur(bid.cpm - floor)}` : `franchit le plancher de ${eur(bid.cpm - floor)}`;
      } else if (state === 'win') {
        el.classList.add('is-win');
        st.textContent = ST.win;
        em.textContent = winTxt || T('meilleure offre éligible', 'best eligible bid');
      }
    };

    const play = () => {
      timers.forEach(clearTimeout);
      timers = [];
      const { bids, floor, best, first } = deal();
      const scale = Math.max(...bids.map((b) => b.cpm)) * 1.12;

      floorEl.textContent = eur(floor);
      cascadeBox.innerHTML = bids.map((b) => row(b, floor, scale)).join('');
      hbBox.innerHTML = bids.map((b) => row(b, floor, scale)).join('');
      const cRows = $$('.hb__call', cascadeBox);
      const hRows = $$('.hb__call', hbBox);

      $('[data-hb-lat-cascade]', root).textContent = '—';
      $('[data-hb-cpm-cascade]', root).textContent = '—';
      $('[data-hb-lat-hb]', root).textContent = '—';
      $('[data-hb-cpm-hb]', root).textContent = '—';
      $('[data-hb-col="hb"]', root).classList.remove('is-best');
      deltaEl.hidden = true;
      verdict.innerHTML =
        '<span class="muted">' + T('Mêmes offres, même plancher. Seule la mise en concurrence change.', 'Same bids, same floor. Only the way they compete changes.') + '</span>';

      const STEP = 520;

      // --- Cascade : on interroge dans l'ordre, on s'arrête au premier éligible.
      bids.forEach((b, i) => {
        timers.push(setTimeout(() => {
          if (i < first) setRow(cRows[i], 'reject', b, floor);
          else if (i === first) setRow(cRows[i], 'win', b, floor, T('première offre éligible — on s’arrête là', 'first eligible bid — we stop here'));
          else setRow(cRows[i], 'skip', b, floor);
        }, 300 + i * STEP));
      });

      const cLat = (first + 1) * 40;
      timers.push(setTimeout(() => {
        $('[data-hb-lat-cascade]', root).textContent = cLat + ' ms';
        $('[data-hb-cpm-cascade]', root).textContent = eur(bids[first].cpm);
      }, 300 + (first + 1) * STEP));

      // --- Header bidding : tout arrive d'un bloc, on filtre, puis on choisit.
      const t0 = 300 + bids.length * STEP;
      timers.push(setTimeout(() => {
        bids.forEach((b, i) =>
          setRow(hRows[i], b.cpm >= floor ? 'elig' : 'reject', b, floor)
        );
        $('[data-hb-lat-hb]', root).textContent = '70 ms';
      }, t0));

      timers.push(setTimeout(() => {
        const wi = bids.indexOf(best);
        setRow(hRows[wi], 'win', best, floor);
        $('[data-hb-cpm-hb]', root).textContent = eur(best.cpm);
        $('[data-hb-col="hb"]', root).classList.add('is-best');
        const gain = best.cpm - bids[first].cpm;
        deltaEl.hidden = false;
        deltaEl.innerHTML = EN
          ? `<b>+ ${eur(gain)}</b> CPM for the publisher, on the same impression.`
          : `<b>+ ${eur(gain)}</b> de CPM pour l’éditeur, sur la même impression.`;
        verdict.innerHTML = EN
          ? 'The floor filters the bids. The way bids compete then decides which eligible bid wins the impression.'
          : 'Le plancher filtre les enchères. La méthode de mise en concurrence détermine ensuite ' +
          'quelle offre éligible remporte l’impression.';
      }, t0 + 900));
    };

    runBtn.addEventListener('click', play);
    onEnter(root, () => setTimeout(play, 400), 0.25);
  }

  // Chaque module est isolé : une erreur dans l'un ne doit pas empêcher
  // les suivants de s'initialiser.
  const start = () => {
    [rtb, pricing, eco, mva, deals, spo, radars, golive, rings, dooh,
     donut, cost100, timeline, mix, flips, opti, liveBand, browsers,
     funnel, quiz, glossary, prio, headerBidding].forEach((fn) => {
      try { fn(); } catch (err) { console.error('[module] ' + fn.name, err); }
    });
  };
  document.addEventListener('lp:ready', start);
})();
