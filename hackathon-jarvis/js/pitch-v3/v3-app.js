/* Film jury v3 — une seule scène dans la plateforme : briefing de 08:00, tableau Sev 1/2/3 (cocher, glisser),
   tâche ouverte avec brouillon, puis Campaigns, Troubleshooting, Agenda, WBR et ce que JARVIS a appris.
   Légendes en bas à gauche, toasts de la plateforme en bas à droite, temps gagné en haut à droite. */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, tf, vis, splitWords, revealWords, type, ic, $, $$, scene, clamp, lerp, cue, cursor, moveCursor, setHTML } = J;

  // ---------------------------------------------------------------- repères de la scène (s, depuis son début)
  const K = {
    kick: 1.0, h1: 1.4, para: 2.3, chips: 3.3, scroll: 6.3, deal: 6.8,
    chk: 9.2, lift: 11.2, drop: 12.8, top5: 13.9, open: 15.6,
    mdl: 15.8, type: 20.2, score: 24.2, copy: 25.0, close: 26.2,
    camp: 26.6, trbl: 31.6, file: 31.9, agnd: 36.6, prep: 37.6, wbr: 41.8, sett: 46.2, teach: 49.4, teachClick: 51.3,
  };
  const SCROLL = 226;
  const GAIN_T = { brief: 4.6, draft: 24.3, pacing: 28.8, meeting: 38.6, wbr: 43.2 };
  const GAINS = C.GAINS.map(g => Object.assign({ t: GAIN_T[g.id] }, g));
  const CAPS = [
    [0.5, 3.9, '08:00. JARVIS has read your mail, Slack and the DSP report.'],
    [4.1, 7.0, 'Your day, ranked: <span class="o">4 things need you.</span>'],
    [7.2, 10.6, 'Every to-do, sorted by <span class="o">severity.</span>'],
    [10.8, 15.4, 'You move it. <span class="o">JARVIS learns from it.</span>'],
    [16.4, 19.9, 'What to do, and why. <span class="o">With the numbers.</span>'],
    [20.1, 26.3, 'The reply is drafted. <span class="o">In your voice.</span>'],
    [26.9, 31.4, `${56} live campaigns, <span class="o">checked every morning.</span>`],
    [31.9, 36.4, 'Setup errors, <span class="o">caught before launch.</span>'],
    [36.9, 41.5, 'Every meeting, <span class="o">prepared.</span>'],
    [42.0, 46.0, 'Your WBR, <span class="o">already written.</span>'],
    [46.5, 50.6, 'Every evening, it learns <span class="o">how you work.</span>'],
    [50.8, 54.8, 'Nothing is sent <span class="o">without you.</span>'],
  ];
  const TOASTS = [
    [9.6, 14.4, 'Done: Confirm the Dentsu X AdX seat 8513581120 and close D556070834', 'Kept in Done today, you can reopen it', true],
    [13.0, 16.2, 'Moved to Sev 1: Catch up Interbev Amour Bœuf: CUTV TF1 deal and IPTV Comcast drop', 'JARVIS had it at Sev 3. It takes it back only if things get worse.', true],
    [51.6, 55.0, 'Lesson confirmed', 'Saved. The next briefing applies it', false],
  ];
  // pages : [début, élément de la barre latérale]
  const PAGES = [['today', 0, 'today'], ['campaigns', K.camp, 'campaigns'], ['trouble', K.trbl, 'trouble'], ['agenda', K.agnd, 'agenda'], ['wbr', K.wbr, 'clients'], ['settings', K.sett, 'settings']];
  // caméra : [instant, échelle, x, y (point de l'interface au centre), durée du mouvement]
  const CAM = [
    [0, 0.96, 1000, 562.5], [2.3, 1.7, 812, 330, 1.7],
    [7.3, 1.18, 1059, 590, 1.3], [9.0, 1.4, 932, 560, 1.0], [14.1, 1.38, 1300, 700, 1.0], [15.3, 1.18, 1059, 590, 0.8],
    [16.3, 0.96, 1000, 562.5, 0.6], [17.7, 1.6, 700, 410, 1.2], [20.5, 1.58, 1290, 470, 1.0], [24.3, 1.58, 1290, 640, 0.9],
    [26.7, 0.96, 1000, 562.5, 0.5], [28.0, 1.15, 1020, 575, 1.2], [31.6, 1.15, 1020, 575], [32.4, 1.24, 1010, 600, 0.8],
    [36.6, 1.24, 1010, 600], [37.1, 0.96, 1000, 562.5, 0.5], [38.7, 1.4, 1314, 520, 1.0],
    [41.8, 1.4, 1314, 520], [42.4, 1.2, 1010, 560, 0.7], [46.2, 1.2, 1010, 560], [47.1, 1.4, 1314, 700, 0.9],
    [49.4, 1.55, 760, 540, 1.1], [53.6, 1.3, 1000, 600, 1.2],
  ];
  // la vue ne sort jamais de l'interface
  const camAt = lt => {
    const c = J.camAt(CAM, lt);
    if (c.s >= 0.96) {
      const hw = 960 / c.s, hh = 540 / c.s;
      c.x = clamp(c.x, hw, 2000 - hw); c.y = clamp(c.y, hh, 1125 - hh);
    }
    return c;
  };
  const hm = m0 => { const m = Math.round(m0); return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`; };

  scene({
    id: 'app', t0: TL.app[0], t1: TL.app[1], fin: 0.5,
    css: J.UI_CSS + `
    #sc-app{background:#0D131B}
    #sc-app .cam{position:absolute;left:0;top:0;width:2000px;height:1125px;transform-origin:0 0}
    #sc-app .cursor{transform-origin:0 0;z-index:60}
    #sc-app .ui .cd .mv{opacity:0}
    #sc-app .ui .col .drop{top:63px;left:13px;right:13px;opacity:0}
    #sc-app .ui .wb{transform-box:fill-box;transform-origin:50% 100%}
    #sc-app .fchip{position:absolute;left:0;top:0;display:flex;gap:10px;align-items:center;height:44px;padding:0 16px;border-radius:9px;background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.2);font-size:15px;font-weight:600}
    #sc-app .fchip i{width:26px;height:30px;border-radius:4px;background:#1F7A3D;color:#fff;display:grid;place-items:center;font:700 10px InterV;font-style:normal}
    #sc-app .pdim{position:absolute;inset:0;background:rgba(20,26,34,.45)}
    #sc-app .cap{position:absolute;left:56px;bottom:54px;max-width:1110px;display:flex;gap:20px;align-items:center;background:rgba(19,25,33,.96);border-radius:16px;padding:20px 32px 22px 22px;
      box-shadow:0 24px 60px rgba(0,0,0,.35);color:#fff;font-family:InterTight;font-weight:800;font-size:44px;line-height:1.16;letter-spacing:-.03em}
    #sc-app .cap .o{color:#FFAD33}
    #sc-app .cap .jlogo{flex:none}
    #sc-app .tst{position:absolute;right:56px;bottom:54px;width:600px;transform-origin:100% 100%}
    #sc-app .tst .jtoast{position:absolute;right:0;bottom:0;width:600px}
    #sc-app .hud{position:absolute;right:56px;top:40px;width:350px;background:rgba(19,25,33,.96);border-radius:16px;padding:16px 22px 18px;color:#fff;box-shadow:0 24px 60px rgba(0,0,0,.35)}
    #sc-app .hud .k{font:600 16px Plex,monospace;letter-spacing:.16em;text-transform:uppercase;color:#FF9900}
    #sc-app .hud .v{font-family:InterTight;font-weight:800;font-size:60px;letter-spacing:-.04em;line-height:1.02;margin-top:6px;font-variant-numeric:tabular-nums}
    #sc-app .hud .g{font-weight:650;font-size:24px;color:#7EE2A0;height:30px;white-space:nowrap}`,
    build(el, s) {
      el.innerHTML = `<div class="cam"><div class="ui">${J.shell()}
          <div class="pg" data-p="today">${J.pageToday()}</div>
          <div class="pg" data-p="campaigns">${J.pageCampaigns(s.dots = J.mapDots())}</div>
          <div class="pg" data-p="trouble">${J.pageTrouble()}<div class="fchip"><i>XLS</i>Maison_Lumiere_Q4_setup.xlsx</div></div>
          <div class="pg" data-p="agenda">${J.pageAgenda()}</div>
          <div class="pg" data-p="wbr">${J.pageWbr()}</div>
          <div class="pg" data-p="settings">${J.pageSettings()}</div>
          <div class="pdim"></div>${J.prepPanel()}
          <div class="mw">${J.modal()}</div></div></div>
        <div class="tst">${TOASTS.map(x => J.toast(x[2], x[3], x[4])).join('')}</div>
        <div class="cap">${J.jarvisLogo(46)}<span class="ct"></span></div>
        <div class="hud"><div class="k">Time back · this week</div><div class="v">0h00</div><div class="g"></div></div>`;
      const ui = s.ui = $('.ui', el); s.cam = $('.cam', el);
      s.pg = {}; $$('.pg', ui).forEach(p => { s.pg[p.dataset.p] = p; });
      s.nav = {}; $$('.sb .it', ui).forEach(n => { s.nav[n.dataset.id] = n; });
      // Today
      const td = s.pg.today;
      s.tdi = $('.pgi', td); s.kk = $('.kk', td); s.h1 = $('.h1', td); s.h1w = splitWords(s.h1); s.para = $('.para', td); s.paraw = splitWords(s.para);
      s.chips = $$('.chips .chp', td); s.brd = $('.brd', td); s.cols = $$('.col', td); s.cn = s.cols.map(c => $('.n', c));
      s.empty = $('.c1 .empty', td); s.drop = $('.c1 .drop', td); s.pb = $('.pb i', td); s.clr = $('.clr b', td);
      s.cd = {}; $$('.cards .cd', td).forEach(c => { s.cd[c.dataset.k] = c; });
      s.nm = $('.nm', td); s.lt = $('.lt', td); s.t5 = $('.t5', td);
      s.rows = {}; $$('.t5 .rw', td).forEach(r => { s.rows[r.dataset.k] = { el: r, no: $('.no', r) }; });
      // fenêtre de la tâche
      s.mw = $('.mw', ui); s.mdl = $('.mdl', ui); s.dim = $('.dim', ui); s.bdy = $('.mdl .bdy', ui); s.sc = $('.mdl .sc', ui); s.cp = $('.mdl .cp span', ui);
      s.ex = $('.mdl .ex', ui); s.tiles = $$('.mdl .tiles div', ui);
      // Campaigns
      s.dt = $$('.dt', s.pg.campaigns); s.band = $('.band', s.pg.campaigns); s.lgd = $$('.lgd .btn2', s.pg.campaigns);
      // Troubleshooting
      const tr = s.pg.trouble;
      s.fchip = $('.fchip', tr); s.dz = $('.dz', tr); s.bn = $('.bn', tr); s.tl = $$('.tl', tr); s.tr = $$('.tr', tr);
      // Agenda
      s.m0 = $('.m0', s.pg.agenda); s.prep = $('.prep', ui); s.pdim = $('.pdim', ui); s.pq = $$('.pq', s.prep);
      // WBR
      const wb = s.pg.wbr;
      s.wt = $$('.wt', wb); s.wl = $$('.wl', wb); s.wbar = $$('.wb', wb); s.wp = $$('.wp', wb); s.bwd = $('.bwd', wb);
      // Settings
      const st = s.pg.settings;
      s.ta = $('.ta', st); s.tch = $('.tch', st); s.li = $('.li', st); s.vr = $$('.vr', st);
      // surcouches
      s.capEl = $('.cap', el); s.ct = $('.ct', el); s.tst = $$('.tst .jtoast', el); s.hud = $('.hud', el); s.hv = $('.hud .v', el); s.hg = $('.hud .g', el);
      s.cur = [cursor(ui), cursor(ui), cursor(ui), cursor(ui)];

      // repères sonores
      const T0 = s.t0, c = (k, t, o) => cue(k, T0 + t, o);
      c('pop', 0.6, { v: 0.4 }); c('type', K.h1, { d: 0.6, fast: 1 }); c('hit', K.h1 + 0.5, { v: 0.4 });
      s.chips.forEach((_, i) => c('pop', K.chips + i * 0.15, { v: 0.4 }));
      c('whoosh', K.scroll, { v: 0.4 });
      for (let i = 0; i < 9; i++) c('card', K.deal + 0.2 + i * 0.12, { v: 0.5 });
      c('click', K.chk); c('success', K.chk + 0.2, { v: 0.4 }); c('swish', K.chk + 0.5, { v: 0.5 }); c('pop', 9.6, { v: 0.4 });
      c('click', K.lift); c('swish', K.lift + 0.3, { v: 0.6 }); c('click', K.drop); c('hit', K.drop + 0.05, { v: 0.35 }); c('pop', 13.0, { v: 0.4 });
      c('swish', K.top5, { v: 0.5 }); c('tick', K.top5 + 0.4);
      c('click', K.open); c('open', K.mdl, { v: 0.8 });
      c('type', K.type, { d: (J.DRAFT.length / 115) }); c('success', K.score, { v: 0.5 }); c('click', K.copy);
      c('whoosh', K.close, { v: 0.5 }); c('nav', K.camp);
      s.dots.forEach((d, i) => { if (i % 4 === 0) c('tick', K.camp + 0.4 + 1.4 * d.t, { v: 0.4 }); });
      c('alert', K.camp + 1.8, { v: 0.6 });
      c('nav', K.trbl); c('swish', K.file); c('hit', K.file + 0.7, { v: 0.35 }); c('alert', K.file + 1.0, { v: 0.7 });
      J.TROWS.forEach((_, i) => c('tick', K.file + 1.5 + i * 0.12, { v: 0.6 }));
      c('nav', K.agnd); c('click', K.prep - 0.2); c('swish', K.prep, { v: 0.6 }); c('data', K.prep + 0.6, { d: 1.6 });
      c('nav', K.wbr); s.wt.forEach((_, i) => c('pop', K.wbr + 0.2 + i * 0.08, { v: 0.35 })); c('data', K.wbr + 0.7, { d: 1.4 });
      c('nav', K.sett); c('data', K.sett + 0.6, { d: 1.6 }); c('type', K.teach, { d: J.LESSON.length / 34 }); c('click', K.teachClick); c('success', K.teachClick + 0.2, { v: 0.5 });
      GAINS.forEach(g => { c('rise', g.t - 0.3, { d: 0.3, v: 0.4 }); c('ping', g.t, { v: 0.6 }); });
    },
    update(lt, dur, s) {
      const cam = camAt(lt);
      // ---------- pages et barre latérale
      let cur = PAGES[0];
      for (const p of PAGES) if (lt >= p[1]) cur = p;
      PAGES.forEach((p, i) => {
        const next = PAGES[i + 1], a = p[1] === 0 ? -1 : p[1], b = next ? next[1] : 1e9;
        const o = (a < 0 ? 1 : P(lt, a, 0.35)) * (1 - P(lt, b, 0.35));
        s.pg[p[0]].style.opacity = o.toFixed(3);
        s.pg[p[0]].style.visibility = o > 0.002 ? 'visible' : 'hidden';
      });
      Object.entries(s.nav).forEach(([k, n]) => n.classList.toggle('on', k === cur[2]));

      if (!s.L) s.L = layout(s);
      today(lt, s);
      modal(lt, s);
      campaigns(lt, s);
      trouble(lt, s);
      agenda(lt, s);
      wbr(lt, s);
      settings(lt, s);
      cursors(lt, s, cam);

      // ---------- caméra
      J.camApply(s.cam, cam, 1920, 1080);

      // ---------- légendes
      let cap = null;
      for (const c of CAPS) if (lt >= c[0] - 0.2 && lt < c[1]) cap = c;
      if (cap) {
        setHTML(s.ct, cap[2]);
        const i = P(lt, cap[0], 0.45, E.outQi), q = P(lt, cap[1] - 0.3, 0.3, E.inC);
        tf(s.capEl, { y: 30 * (1 - i) + 10 * q, o: E.outC(P(lt, cap[0], 0.35)) * (1 - q), b: 8 * (1 - i) + 6 * q });
      } else tf(s.capEl, { o: 0 });

      // ---------- toasts de la plateforme (le plus récent en bas)
      let off = 0;
      const act = TOASTS.map((x, i) => [x, i]).filter(([x]) => lt >= x[0] && lt < x[1]).sort((a, b) => b[0][0] - a[0][0]);
      s.tst.forEach((t, i) => { if (!act.find(a => a[1] === i)) tf(t, { o: 0 }); });
      for (const [x, i] of act) {
        const t = s.tst[i], k = P(lt, x[0], 0.4, E.outQi), q = P(lt, x[1] - 0.35, 0.35, E.inC);
        tf(t, { y: -off + 24 * (1 - k), o: E.outC(P(lt, x[0], 0.3)) * (1 - q), s: 1.12 });
        off += (t.offsetHeight * 1.12 + 12) * k;
      }

      // ---------- temps gagné
      let m = 0, last = null;
      for (const g of GAINS) { if (lt >= g.t) last = g; m += g.week * P(lt, g.t, 0.8, E.outQu); }
      s.hv.textContent = hm(m);
      vis(s.hud, lt, GAINS[0].t - 0.6, Infinity, { dy: -20, blur: 8 });
      if (last && lt < last.t + 2.4) { setHTML(s.hg, `+${hm(last.week)} · ${last.task}`); tf(s.hg, { o: P(lt, last.t, 0.3) * (1 - P(lt, last.t + 2.0, 0.4)), x: 14 * (1 - P(lt, last.t, 0.4, E.outQi)) }); }
      else tf(s.hg, { o: 0 });
    },
  });
  window.COUNTER_STEPS = GAINS.reduce((a, g) => { const v = (a.length ? a[a.length - 1].m : 0) + g.week; a.push({ t: +(TL.app[0] + g.t + 1.0).toFixed(2), value: hm(v), m: v }); return a; }, []);

  // ---------------------------------------------------------------- tableau : positions des cartes dans chaque état
  const BX = () => 246 + J.BOARD.x, BY = scroll => 68 + J.BOARD.y - scroll;
  function layout(s) {
    const B = J.BOARD, h = {};
    Object.entries(s.cd).forEach(([k, el]) => { h[k] = el.offsetHeight; });
    const X = B.cols.map(x => x + 13);
    const place = cols => {
      const o = {}, ch = [];
      cols.forEach((list, ci) => { let y = B.stackTop; list.forEach(k => { o[k] = { x: X[ci], y }; y += h[k] + B.gap; }); ch.push(y - B.gap - B.stackTop); });
      return { o, ch };
    };
    const S0 = place([[], ['polt', 'dentsu', 'bfm', 'deal'], ['midas', 'inter', 'gae1', 'gae2', 'qonto']]);
    const S1 = place([[], ['polt', 'bfm', 'deal', 'done'], ['midas', 'inter', 'gae1', 'gae2', 'qonto']]);
    const S2 = place([[], ['polt', 'bfm', 'deal', 'done'], ['midas', 'gae1', 'gae2', 'qonto']]);
    const S3 = place([['inter'], ['polt', 'bfm', 'deal', 'done'], ['midas', 'gae1', 'gae2', 'qonto']]);
    // une carte absente d'un état garde sa place précédente
    const fill = (a, b) => { Object.keys(s.cd).forEach(k => { if (!b.o[k]) b.o[k] = a.o[k]; }); };
    S0.o.done = S1.o.done; fill(S0, S1); fill(S1, S2); fill(S2, S3);
    const g = { x: 120, y: 44 }; // point saisi dans la carte glissée
    return { h, S: [S0, S1, S2, S3], grab: g,
      dragFrom: { x: BX() + S0.o.inter.x + g.x, y: BY(SCROLL) + S0.o.inter.y + g.y },
      dragTo: { x: BX() + X[0] + g.x, y: BY(SCROLL) + B.stackTop + g.y },
      chk: { x: BX() + S0.o.dentsu.x + 327 - 25.5, y: BY(SCROLL) + S0.o.dentsu.y + 24.5 },
      open: { x: BX() + S0.o.polt.x + 40, y: BY(SCROLL) + S0.o.polt.y + h.polt - 19 } };
  }

  // ---------------------------------------------------------------- Today
  function today(lt, s) {
    const L = s.L;
    vis(s.kk, lt, K.kick, Infinity, { dy: 14, blur: 6 });
    revealWords(s.h1w, lt, K.h1, { st: 0.09, dy: 40 });
    revealWords(s.paraw, lt, K.para, { st: 0.018, dy: 16, blur: 6, d: 0.6 });
    s.chips.forEach((c, i) => vis(c, lt, K.chips + i * 0.15, Infinity, { dy: 10, ds: -0.2, din: 0.5, ein: E.outB, blur: 4 }));
    const sc = SCROLL * P(lt, K.scroll, 1.0, E.ioC);
    s.tdi.style.transform = `translate(0,${(-sc).toFixed(1)}px)`;
    // le tableau : les cartes arrivent dans leur colonne
    const p1 = P(lt, K.chk + 0.5, 0.45, E.ioC), p2 = P(lt, K.lift + 0.2, 0.4, E.ioC), p3 = P(lt, K.drop, 0.4, E.ioC);
    const [S0, S1, S2, S3] = L.S;
    const at = k => ({
      x: S0.o[k].x + (S1.o[k].x - S0.o[k].x) * p1 + (S2.o[k].x - S1.o[k].x) * p2 + (S3.o[k].x - S2.o[k].x) * p3,
      y: S0.o[k].y + (S1.o[k].y - S0.o[k].y) * p1 + (S2.o[k].y - S1.o[k].y) * p2 + (S3.o[k].y - S2.o[k].y) * p3,
    });
    const order = ['polt', 'midas', 'dentsu', 'inter', 'bfm', 'gae1', 'deal', 'gae2', 'qonto'];
    order.forEach((k, i) => {
      const el = s.cd[k], a = K.deal + 0.2 + i * 0.12, e = P(lt, a, 0.6, E.outQi);
      let { x, y } = at(k), rz = 0, sc2 = 1, o = E.outC(P(lt, a, 0.4));
      if (k === 'dentsu') { o *= 1 - P(lt, K.chk + 0.45, 0.3); sc2 = 1 - 0.05 * P(lt, K.chk + 0.45, 0.3); }
      if (k === 'inter' && lt >= K.lift) {
        // la carte suit le curseur, puis se pose en Sev 1
        const cp = cursorAt(lt, s);
        const g = L.grab, bx = BX(), by = BY(SCROLL);
        const dx = cp.x - bx - g.x, dy = cp.y - by - g.y;
        const land = P(lt, K.drop, 0.35, E.outQi);
        x = lerp(dx, S3.o.inter.x, lt >= K.drop ? land : 0); y = lerp(dy, S3.o.inter.y, lt >= K.drop ? land : 0);
        const lift = P(lt, K.lift, 0.2) * (1 - land);
        rz = -2.5 * lift; sc2 = 1 + 0.03 * lift;
        el.style.boxShadow = lift > 0.01 ? `0 ${(18 * lift).toFixed(0)}px ${(40 * lift).toFixed(0)}px rgba(20,24,30,${(0.25 * lift).toFixed(2)})` : '';
        el.style.zIndex = 5;
        el.classList.toggle('r1', lt >= K.drop + 0.1);
      }
      tf(el, { x, y: y - 24 * (1 - e), rz, s: sc2, o });
    });
    // tâche cochée : la case se remplit, la carte passe en « Done »
    const cb = $('.cb', s.cd.dentsu), on = lt >= K.chk + 0.05;
    cb.style.background = on ? '#2DB84C' : '#fff'; cb.style.borderColor = on ? '#2DB84C' : '#B9BEC4';
    if (cb._on !== on) { cb.innerHTML = on ? ic('check', 14) : ''; cb._on = on; }
    const dn = at('done');
    tf(s.cd.done, { x: dn.x, y: dn.y, o: P(lt, K.chk + 0.7, 0.4) });
    $('.mv', s.cd.inter).style.opacity = P(lt, K.drop + 0.2, 0.3).toFixed(3);
    // colonnes
    const B = J.BOARD, ch = i => S0.ch[i] + (S1.ch[i] - S0.ch[i]) * p1 + (S2.ch[i] - S1.ch[i]) * p2 + (S3.ch[i] - S2.ch[i]) * p3;
    s.cols[0].style.height = (63 + Math.max(62, ch(0)) + 13).toFixed(1) + 'px';
    s.cols[1].style.height = (63 + ch(1) + 13).toFixed(1) + 'px';
    s.cols[2].style.height = '1320px';
    const nTxt = [lt >= K.drop ? '1' : '0', lt >= K.chk + 0.5 ? '3' : '4', lt >= K.lift ? '11' : '12'];
    s.cn.forEach((n, i) => { if (n.textContent !== nTxt[i]) n.textContent = nTxt[i]; });
    s.empty.style.opacity = (1 - P(lt, K.lift, 0.2)).toFixed(3);
    const dz = P(lt, K.lift, 0.25) * (1 - P(lt, K.drop - 0.05, 0.15)), hot = P(lt, K.drop - 0.6, 0.2);
    s.drop.style.opacity = dz.toFixed(3);
    s.drop.style.borderColor = hot > 0.5 ? '#C40F2E' : '#9AA0A6';
    s.drop.style.background = `rgba(255,255,255,${(0.4 + 0.4 * hot).toFixed(2)})`;
    const done = lt >= K.chk + 0.1 ? 1 : 0;
    s.pb.style.width = (100 * done / 18).toFixed(2) + '%';
    if (s.clr.textContent !== String(done)) s.clr.textContent = String(done);
    // colonne de droite et top 5 : Interbev passe en tête
    [s.nm, s.lt, s.t5].forEach((b, i) => vis(b, lt, 0.4 + i * 0.12, Infinity, { dy: 20, blur: 6 }));
    const O0 = ['polt', 'shis', 'bfm', 'midas', 'disney'], O1 = ['inter', 'polt', 'shis', 'bfm', 'midas'];
    const pr = P(lt, K.top5, 0.8, E.ioC);
    Object.entries(s.rows).forEach(([k, r]) => {
      const i0 = O0.indexOf(k), i1 = O1.indexOf(k);
      const y0 = i0 < 0 ? -66 : i0 * 66, y1 = i1 < 0 ? 5 * 66 : i1 * 66;
      const o = (i0 < 0 ? pr : 1) * (i1 < 0 ? 1 - pr : 1);
      tf(r.el, { y: lerp(y0, y1, pr), x: i0 < 0 ? -30 * (1 - pr) : 0, o });
      const no = String((pr < 0.5 ? i0 : i1) + 1);
      if (r.no.textContent !== no) r.no.textContent = no;
      r.el.style.zIndex = k === 'inter' ? 2 : 1;
    });
  }

  // ---------------------------------------------------------------- fenêtre de la tâche
  function modal(lt, s) {
    const o = P(lt, K.mdl, 0.35) * (1 - P(lt, K.close, 0.35));
    s.mw.style.opacity = o.toFixed(3); s.mw.style.visibility = o > 0.002 ? 'visible' : 'hidden';
    if (o <= 0.002) return;
    tf(s.mdl, { s: 0.97 + 0.03 * P(lt, K.mdl, 0.4, E.outQi), y: 20 * (1 - P(lt, K.mdl, 0.4, E.outQi)) });
    vis(s.ex, lt, K.mdl + 0.5, Infinity, { dy: 16, blur: 6 });
    s.tiles.forEach((t, i) => vis(t, lt, K.mdl + 0.8 + i * 0.07, Infinity, { dy: 12, blur: 4 }));
    type(s.bdy, J.DRAFT, lt, K.type, 115, { hold: 0.6 });
    vis(s.sc, lt, K.score, Infinity, { dy: 10, ds: -0.15, ein: E.outB, din: 0.5, blur: 4 });
    const cp = lt >= K.copy + 0.05 ? 'Copied' : 'Copy';
    if (s.cp.textContent !== cp) s.cp.textContent = cp;
  }

  // ---------------------------------------------------------------- Campaigns : les points du pacing apparaissent
  function campaigns(lt, s) {
    if (lt < K.camp - 0.1 || lt > K.trbl + 0.5) return;
    const a = K.camp + 0.3;
    s.band.style.opacity = P(lt, a, 0.5).toFixed(3);
    s.lgd.forEach((l, i) => vis(l, lt, a + 1.6 + i * 0.08, Infinity, { dy: 8, blur: 4 }));
    const X = t => J.MAP.px + t * J.MAP.pw, Y = v => J.MAP.py + (1 - v) * J.MAP.ph;
    s.dots.forEach((d, i) => {
      const g = s.dt[i], k = P(lt, a + 0.1 + 1.4 * d.t + (d.c === 'g' ? 0 : 0.35), 0.45, E.outB);
      g.setAttribute('transform', `translate(${X(d.t).toFixed(1)},${Y(d.v).toFixed(1)}) scale(${Math.max(0.001, k).toFixed(3)})`);
      const lb = g.querySelector('.lb'); if (lb) lb.style.opacity = P(lt, a + 1.9, 0.4).toFixed(3);
      if (d.c === 'r') {
        const ring = g.firstElementChild, ph = lt > a + 1.8 ? ((lt - a - 1.8) * 0.9 + i * 0.27) % 1 : 0;
        ring.setAttribute('r', (d.r + 22 * ph).toFixed(1)); ring.setAttribute('opacity', (lt > a + 1.8 ? 0.8 * (1 - ph) : 0).toFixed(3));
      }
    });
  }

  // ---------------------------------------------------------------- Troubleshooting : un export glissé, 5 erreurs trouvées
  function trouble(lt, s) {
    if (lt < K.trbl - 0.1 || lt > K.agnd + 0.5) return;
    const f = P(lt, K.file, 0.7, E.ioC);
    tf(s.fchip, { x: lerp(1150, 640, f), y: lerp(-60, 186, f), rz: -4 * (1 - f), o: P(lt, K.file, 0.2) * (1 - P(lt, K.file + 0.75, 0.25)) });
    const fl = P(lt, K.file + 0.65, 0.15) * (1 - P(lt, K.file + 0.9, 0.5));
    s.dz.style.borderColor = fl > 0.1 ? '#F26B0F' : '#9AA0A6';
    s.dz.style.background = `rgba(${lerp(239, 255, fl).toFixed(0)},${lerp(236, 236, fl).toFixed(0)},${lerp(230, 220, fl).toFixed(0)},1)`;
    vis(s.bn, lt, K.file + 1.0, Infinity, { dy: 14, blur: 6, ds: -0.02 });
    s.tl.forEach((t, i) => vis(t, lt, K.file + 1.2 + i * 0.08, Infinity, { dy: 12, blur: 4 }));
    s.tr.forEach((t, i) => vis(t, lt, K.file + 1.5 + i * 0.12, Infinity, { dx: -20, dy: 0, blur: 4 }));
  }

  // ---------------------------------------------------------------- Agenda : la préparation de la réunion s'ouvre
  function agenda(lt, s) {
    const k = P(lt, K.prep, 0.6, E.outQi), q = P(lt, K.wbr, 0.35);
    s.prep.style.visibility = lt >= K.prep && lt < K.wbr + 0.4 ? 'visible' : 'hidden';
    tf(s.prep, { x: 720 * (1 - k), o: 1 - q });
    s.pdim.style.opacity = (k * (1 - q)).toFixed(3);
    s.pdim.style.visibility = k * (1 - q) > 0.002 ? 'visible' : 'hidden';
    s.pq.forEach((el, i) => vis(el, lt, K.prep + 0.6 + i * 0.12, Infinity, { dy: 10, blur: 4, din: 0.6 }));
  }

  // ---------------------------------------------------------------- WBR
  function wbr(lt, s) {
    if (lt < K.wbr - 0.1 || lt > K.sett + 0.5) return;
    s.wt.forEach((t, i) => vis(t, lt, K.wbr + 0.2 + i * 0.08, Infinity, { dy: 12, blur: 4 }));
    s.wl.forEach((t, i) => vis(t, lt, K.wbr + 0.7 + i * 0.15, Infinity, { dx: -16, dy: 0, blur: 4 }));
    s.wbar.forEach((b, i) => { b.style.transform = `scaleY(${P(lt, K.wbr + 1.2 + i * 0.06, 0.6, E.outQi).toFixed(3)})`; });
    s.wp.forEach((t, i) => vis(t, lt, K.wbr + 1.6 + i * 0.15, Infinity, { dy: 10, blur: 4 }));
  }

  // ---------------------------------------------------------------- Settings : la voix de Val, une leçon apprise
  function settings(lt, s) {
    if (lt < K.sett - 0.1) return;
    s.vr.forEach((t, i) => vis(t, lt, K.sett + 0.6 + i * 0.1, Infinity, { dx: -12, dy: 0, blur: 4 }));
    const reset = lt >= K.teachClick + 0.25;
    if (lt >= K.teach && !reset) {
      s.ta.style.color = '#15191E';
      type(s.ta, J.LESSON, lt, K.teach, 34, { hold: 1.5 });
    } else {
      s.ta.style.color = '#9AA0A6';
      setHTML(s.ta, 'For example: "Never book client calls on Friday afternoon"');
    }
    const full = lt >= K.teach + J.LESSON.length / 34 && !reset;
    s.tch.style.opacity = full ? '1' : '.5';
    const li = reset ? '29' : '28';
    if (s.li.textContent !== li) s.li.textContent = li;
  }

  // ---------------------------------------------------------------- curseurs (coordonnées de l'interface)
  function paths(s) {
    const L = s.L, R = el => J.rel(el, s.ui);
    return [
      { path: [[8.5, 960, 860], [9.0, L.chk.x, L.chk.y], [10.4, L.chk.x, L.chk.y], [11.0, L.dragFrom.x, L.dragFrom.y], [K.lift + 0.15, L.dragFrom.x, L.dragFrom.y],
        [12.5, L.dragTo.x, L.dragTo.y], [13.4, L.dragTo.x + 30, L.dragTo.y + 60], [15.2, L.open.x, L.open.y]], clicks: [K.chk, K.lift, K.drop, K.open], hide: 15.9 },
      { path: [[24.1, 1300, 760], [24.8, R(s.cp.parentElement).x + 30, R(s.cp.parentElement).y + 16]], clicks: [K.copy], hide: 25.8 },
      { path: [[36.9, 1150, 700], [37.35, R(s.m0).x + 120, R(s.m0).y + 40]], clicks: [K.prep - 0.2], hide: 37.9 },
      { path: [[50.6, 900, 760], [51.2, R(s.tch).x + 28, R(s.tch).y + 16]], clicks: [K.teachClick], hide: 52.0 },
    ];
  }
  function cursorAt(lt, s) {
    const p = (s.P || (s.P = paths(s)))[0].path;
    let x = p[0][1], y = p[0][2];
    for (let i = 1; i < p.length; i++) {
      const [t0, x0, y0] = p[i - 1], [t1, x1, y1] = p[i];
      if (lt >= t0) { const k = E.ioC(clamp((lt - t0) / (t1 - t0))); x = lerp(x0, x1, k); y = lerp(y0, y1, k); }
    }
    return { x, y };
  }
  function cursors(lt, s, cam) {
    const ps = s.P || (s.P = paths(s));
    ps.forEach((p, i) => {
      moveCursor(s.cur[i], lt, p.path, p.clicks, { hide: p.hide });
      s.cur[i].style.transform += ` scale(${(1.15 / cam.s).toFixed(3)})`;
    });
  }
})();
