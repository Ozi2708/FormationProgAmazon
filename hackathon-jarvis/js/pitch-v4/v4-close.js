/* Film d'intro v4 — plans 9 à 12 : impact, monde entier, plus juste chaque jour, relais vers la démo
   + compteur commun et repères de la musique */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, tf, vis, splitWords, revealWords, ic, $, $$, scene, clamp, lerp, cue } = J;
  const K = J.K4, SH = J.SH;
  const FTE_TEAM = C.NB_PSC_TEAM * C.HOURS_SAVED_PER_WEEK / C.WORK_HOURS_PER_WEEK;
  const FTE_EU = C.NB_PSC_EU * C.HOURS_SAVED_PER_WEEK / C.WORK_HOURS_PER_WEEK;
  const HOURS = C.NB_PSC_EU * C.HOURS_SAVED_PER_WEEK * C.WEEKS_PER_YEAR;
  window.IMPACT = { FTE_TEAM, FTE_EU, HOURS };
  const fmt = n => new Intl.NumberFormat('en-US').format(n);
  const PERSON = '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.2" fill="currentColor"/><path d="M3.5 21c.6-4.6 4.1-7.4 8.5-7.4s7.9 2.8 8.5 7.4z" fill="currentColor"/></svg>';

  // ---------------------------------------------------------------- plan 9 · 1:06 impact
  const ROW = Array.from({ length: C.NB_PSC_TEAM }, (_, i) => ({ x: 960 + (i - (C.NB_PSC_TEAM - 1) / 2) * 92, y: 470 }));
  const GRID = Array.from({ length: C.NB_PSC_EU }, (_, i) => ({ x: 960 + ((i % 10) - 4.5) * 62, y: 312 + Math.floor(i / 10) * 52, c: i % 10, r: Math.floor(i / 10) }));
  // 16 personnes « rendues » : deux colonnes entières, allumées en vague
  const LIT_EU = new Set(GRID.map((g, i) => [g, i]).filter(([g]) => g.c < 2).map(([, i]) => i));
  const G2 = 4.0;
  scene({
    id: 'impact', t0: SH.impact[0], t1: SH.impact[1], cls: 'v4', fin: 0,
    css: `
    #sc-impact .hd{left:0;right:0;top:110px;text-align:center;font-size:120px}
    #sc-impact .es{left:0;right:0;top:250px;text-align:center;font-size:30px}
    #sc-impact .pp{position:absolute;left:0;top:0;width:70px;height:70px;margin:-35px 0 0 -35px;border-radius:50%;display:grid;place-items:center;background:#222B37;color:#5C6675}
    #sc-impact .pp svg{width:62%;height:62%}
    #sc-impact .pp.on{background:${K.or};color:${K.ink};box-shadow:0 0 26px rgba(255,98,0,.55)}
    #sc-impact .pp.g{width:44px;height:44px;margin:-22px 0 0 -22px}
    #sc-impact .l2{left:0;right:0;top:580px;text-align:center;font-size:72px}
    #sc-impact .l3{left:0;right:0;top:830px;text-align:center;font-size:64px}
    #sc-impact .fn{left:0;right:0;top:1000px;text-align:center;font-size:24px}`,
    build(el, s) {
      el.innerHTML = `<div class="v4h hd">8h back, <span class="o">every week.</span></div><div class="v4s es">estimated, per PSC</div>
        ${ROW.map(() => `<div class="pp r">${PERSON}</div>`).join('')}${GRID.map(() => `<div class="pp g">${PERSON}</div>`).join('')}
        <div class="v4h l2">A team of ${C.NB_PSC_TEAM} = <span class="o">${FTE_TEAM} FTE</span></div>
        <div class="v4h l3">${C.NB_PSC_EU} PSCs = <span class="o">${FTE_EU} FTE</span> · ${fmt(HOURS)} hours a year</div>
        <div class="v4s fn">Estimated: ${C.HOURS_SAVED_PER_WEEK} h per PSC per week, ${C.WEEKS_PER_YEAR} working weeks.</div>`;
      s.hd = splitWords($('.hd', el)); s.es = $('.es', el); s.pr = $$('.pp.r', el); s.pg = $$('.pp.g', el); s.l2 = $('.l2', el); s.l3 = $('.l3', el); s.fn = $('.fn', el);
      cue('darken', s.t0); cue('hit', s.t0 + 0.2, { v: 0.6 });
      [2.4, 2.7, 3.0].forEach(a => cue('ping', s.t0 + a, { v: 0.5 }));
      cue('whoosh', s.t0 + G2 - 0.2, { v: 0.5 }); cue('data', s.t0 + G2 + 0.2, { d: 1.2 }); cue('hit', s.t0 + G2 + 1.4, { v: 0.6 });
    },
    update(lt, dur, s) {
      revealWords(s.hd, lt, 0.1, { st: 0.12, dy: 50, d: 0.7 });
      vis(s.es, lt, 0.8, Infinity, { dy: 10, blur: 4 });
      // une équipe de 15 : 3 personnes s'allument une à une
      const q1 = P(lt, G2 - 0.3, 0.4, E.inC);
      s.pr.forEach((p, i) => {
        const a = 2.0 + i * 0.025, on = i < 3 && lt >= 2.4 + i * 0.3;
        p.classList.toggle('on', on);
        tf(p, { x: ROW[i].x, y: ROW[i].y, s: P(lt, a, 0.4, E.outB) * (1 - 0.3 * q1), o: P(lt, a, 0.2) * (1 - q1) });
      });
      vis(s.l2, lt, 2.5, G2 - 0.1, { dy: 20, blur: 8 });
      // 80 PSC : 16 s'allument en vague
      s.pg.forEach((p, i) => {
        const g = GRID[i], a = G2 + (g.c + g.r) * 0.03, on = LIT_EU.has(i) && lt >= G2 + 1.2 + g.r * 0.05;
        p.classList.toggle('on', on);
        tf(p, { x: g.x, y: g.y, s: P(lt, a, 0.4, E.outB), o: P(lt, a, 0.2) });
      });
      vis(s.l3, lt, G2 + 1.3, Infinity, { dy: 20, blur: 8 });
      vis(s.fn, lt, G2 + 2.0, Infinity, { dy: 8, blur: 4 });
    },
  });

  // ---------------------------------------------------------------- plan 10 · 1:14 monde entier
  // carte en points : contours simplifiés des continents (longitude, latitude), projection équirectangulaire
  const LAND = {
    NA: [[[-165, 65], [-150, 71], [-120, 72], [-90, 75], [-75, 68], [-62, 60], [-55, 52], [-66, 45], [-75, 38], [-81, 31], [-80, 25], [-97, 26], [-97, 19], [-90, 16], [-83, 9], [-78, 8],
      [-92, 15], [-105, 20], [-112, 30], [-117, 33], [-124, 40], [-125, 48], [-135, 58], [-150, 60], [-165, 60]],
      [[-55, 82], [-25, 82], [-20, 70], [-45, 60], [-55, 68]],
      [[-80, 10], [-62, 11], [-50, 0], [-35, -6], [-40, -22], [-48, -28], [-58, -38], [-65, -55], [-73, -50], [-72, -30], [-70, -18], [-81, -5]]],
    EMEA: [[[-10, 36], [0, 43], [-5, 48], [5, 52], [8, 57], [5, 62], [15, 70], [30, 71], [42, 67], [55, 60], [55, 45], [40, 42], [28, 41], [20, 40], [12, 44], [15, 38], [5, 43], [0, 38]],
      [[-6, 50], [2, 51], [0, 58], [-6, 58]],
      [[-17, 21], [-10, 30], [-5, 36], [10, 37], [32, 31], [35, 28], [43, 12], [51, 12], [40, -5], [40, -15], [35, -25], [20, -35], [15, -28], [12, -5], [8, 4], [-8, 4], [-17, 14]],
      [[35, 32], [36, 36], [45, 40], [55, 37], [58, 25], [52, 17], [44, 12], [38, 20]]],
    APAC: [[[58, 25], [60, 45], [55, 60], [60, 70], [80, 73], [110, 77], [140, 72], [180, 68], [170, 60], [155, 58], [140, 50], [140, 40], [122, 38], [122, 30], [110, 20], [105, 10],
      [100, 13], [98, 8], [92, 22], [80, 15], [77, 8], [72, 20], [66, 25]],
      [[130, 31], [142, 36], [145, 44], [140, 41], [132, 34]],
      [[95, 5], [120, -2], [140, -5], [140, -9], [115, -8], [105, -6]],
      [[113, -22], [122, -17], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [140, -38], [132, -32], [115, -34]]],
  };
  const MAPW = 1300, MX = 310, MY = 180, LAT0 = 80;
  const px = (lon, lat) => [MX + (lon + 180) / 360 * MAPW, MY + (LAT0 - lat) / 360 * MAPW];
  const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
  const DOTS = [];
  for (let lat = 78; lat > -58; lat -= 3.2) for (let lon = -178; lon < 180; lon += 3.2) {
    for (const [reg, polys] of Object.entries(LAND)) if (polys.some(pl => inside([lon, lat], pl))) { DOTS.push({ reg, p: px(lon, lat) }); break; }
  }
  const HUB = { NA: px(-98, 42), EMEA: px(8, 47), APAC: px(112, 28) }, REG = ['NA', 'EMEA', 'APAC'];
  const RL = [0.6, 1.1, 1.6], BADGE = 4.0;
  scene({
    id: 'world', t0: SH.world[0], t1: SH.world[1], cls: 'v4', fin: 0,
    css: `
    #sc-world .l1{left:0;right:0;top:70px;text-align:center;font-size:72px}
    #sc-world svg.mp{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
    #sc-world .l2{left:0;right:0;top:720px;text-align:center;font-size:40px;color:#fff}
    #sc-world .bg2{position:absolute;left:0;right:0;top:810px;display:flex;justify-content:center;gap:18px}
    #sc-world .bg2 span{height:62px;min-width:120px;border-radius:31px;display:grid;place-items:center;font:800 30px InterTight;letter-spacing:.02em;padding:0 26px}
    #sc-world .bg2 .f{background:${K.or};color:${K.ink}}
    #sc-world .bg2 .e{border:2.5px solid ${K.or};color:${K.or}}
    #sc-world .cp{left:0;right:0;top:905px;text-align:center;font-size:30px}`,
    build(el, s) {
      el.innerHTML = `<div class="v4h l1"><span class="o">Worldwide</span> from day one.</div>
        <svg class="mp">${DOTS.map(d => `<circle class="${d.reg}" cx="${d.p[0].toFixed(1)}" cy="${d.p[1].toFixed(1)}" r="3.6" fill="#3A4553"/>`).join('')}
          <path class="arc" d="M${HUB.NA[0]},${HUB.NA[1]} Q${(HUB.NA[0] + HUB.EMEA[0]) / 2},${HUB.NA[1] - 170} ${HUB.EMEA[0]},${HUB.EMEA[1]}" fill="none" stroke="${K.or}" stroke-width="2.5" stroke-dasharray="7 7"/>
          <path class="arc" d="M${HUB.EMEA[0]},${HUB.EMEA[1]} Q${(HUB.EMEA[0] + HUB.APAC[0]) / 2},${HUB.EMEA[1] - 170} ${HUB.APAC[0]},${HUB.APAC[1]}" fill="none" stroke="${K.or}" stroke-width="2.5" stroke-dasharray="7 7"/>
          ${REG.map(r => `<circle class="hub" cx="${HUB[r][0]}" cy="${HUB[r][1]}" r="9" fill="${K.or}"/>`).join('')}</svg>
        <div class="v4s l2">Built by a team across <span class="o">NA · EMEA · APAC</span>.</div>
        <div class="bg2"><span class="f">PSC</span><span class="f">AST</span><span class="e">AM</span><span class="e">AE</span></div>
        <div class="v4s cp">RACI-aware: ready for PSC and AST, adaptable to AM and AE.</div>`;
      s.l1 = splitWords($('.l1', el)); s.reg = REG.map(r => $$(`circle.${r}`, el)); s.arcs = $$('.arc', el); s.hub = $$('.hub', el);
      s.l2 = $('.l2', el); s.bg = $$('.bg2 span', el); s.cp = $('.cp', el); s.all = $$('svg.mp circle', el);
      s.alen = s.arcs.map(a => a.getTotalLength());
      RL.forEach(a => cue('ping', s.t0 + a, { v: 0.6 })); cue('whoosh', s.t0 + 2.0, { v: 0.4 });
      s.bg.forEach((_, i) => cue('pop', s.t0 + BADGE + i * 0.15, { v: 0.5 }));
    },
    update(lt, dur, s) {
      revealWords(s.l1, lt, 0.1, { st: 0.1, dy: 40, d: 0.6 });
      const o = P(lt, 0, 0.4);
      s.all.forEach(c => { c.style.opacity = o; });
      REG.forEach((r, i) => {
        const k = P(lt, RL[i], 0.3);
        const col = k > 0.5 ? K.or : '#3A4553';
        s.reg[i].forEach(c => { if (c._c !== col) { c.setAttribute('fill', col); c._c = col; } });
        tf(s.hub[i], { o: k });
      });
      s.arcs.forEach((a, i) => { a.style.strokeDashoffset = 0; a.style.clipPath = ''; a.style.opacity = P(lt, 1.9 + i * 0.4, 0.4).toFixed(3); });
      vis(s.l2, lt, 2.2, Infinity, { dy: 16, blur: 6 });
      s.bg.forEach((b, i) => vis(b, lt, BADGE + i * 0.15, Infinity, { dx: 40, dy: 0, blur: 6, din: 0.5 }));
      vis(s.cp, lt, BADGE + 0.6, Infinity, { dy: 10, blur: 4 });
    },
  });

  // ---------------------------------------------------------------- plan 11 · 1:20 plus juste chaque jour
  const ICONS = [['mail', -1, -0.6], ['file-text', 1, -0.5], ['chart-column', -1, 0.6], ['circle-check', 1, 0.55], ['mail', 0, -1], ['pen-line', 0, 1]];
  const ARR = i => 0.5 + i * 0.5;
  scene({
    id: 'sharper', t0: SH.sharper[0], t1: SH.sharper[1], cls: 'v4', fin: 0,
    css: `
    #sc-sharper .lk{position:absolute;left:0;right:0;top:300px;display:flex;justify-content:center;align-items:center;gap:30px}
    #sc-sharper .lk b{font-family:InterTight;font-weight:800;font-size:110px;letter-spacing:-.01em;color:#fff}
    #sc-sharper .fl{position:absolute;left:0;top:0;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:16px;background:#222B37;border:1.5px solid rgba(163,170,181,.35);display:grid;place-items:center;color:${K.or}}
    #sc-sharper .hd{left:0;right:0;top:560px;text-align:center;font-size:96px}
    #sc-sharper .cp{left:0;right:0;top:700px;text-align:center;font-size:32px}`,
    build(el, s) {
      el.innerHTML = `<div class="lk">${J.jarvisLogo(130)}<b>JARVIS</b></div>${ICONS.map(i => `<div class="fl">${ic(i[0], 30)}</div>`).join('')}
        <div class="v4h hd">Sharper every day.</div><div class="v4s cp">It learns from every email, correction and campaign result.</div>`;
      s.lk = $('.lk', el); s.fl = $$('.fl', el); s.hd = splitWords($('.hd', el)); s.cp = $('.cp', el);
      ICONS.forEach((_, i) => cue('absorb', s.t0 + ARR(i), { v: 0.5 }));
    },
    update(lt, dur, s) {
      let kick = 0;
      s.fl.forEach((f, i) => {
        const a = ARR(i), k = P(lt, a - 0.6, 0.6, E.inQ), [, dx, dy] = ICONS[i];
        tf(f, { x: lerp(960 + dx * 860, 960, k), y: lerp(365 + dy * 330, 365, k), s: 1 - 0.7 * k, o: P(lt, a - 0.7, 0.2) * (1 - P(lt, a - 0.05, 0.1)) });
        if (lt >= a) kick = Math.max(kick, Math.exp(-(lt - a) * 7));
      });
      tf(s.lk, { s: (0.9 + 0.1 * P(lt, 0, 0.4, E.outB)) * (1 + 0.04 * kick), o: P(lt, 0, 0.3) });
      revealWords(s.hd, lt, 1.2, { st: 0.1, dy: 40, d: 0.6 });
      vis(s.cp, lt, 1.8, Infinity, { dy: 10, blur: 4 });
    },
  });

  // ---------------------------------------------------------------- plan 12 · 1:24 relais : l'écran d'accueil s'ouvre
  const IR = 2.6; // ouverture de l'iris
  scene({
    id: 'handoff', t0: SH.handoff[0], t1: SH.handoff[1], cls: 'v4', fin: 0,
    css: `
    #sc-handoff .home{position:absolute;inset:0;background:#F4F2EE}
    #sc-handoff .home .ui{transform:scale(.96)}
    #sc-handoff .l{left:0;right:0;text-align:center;font-size:140px}
    #sc-handoff .l1{top:330px}#sc-handoff .l2{top:500px}
    #sc-handoff .lv{left:0;right:0;top:430px;text-align:center;font-size:150px;z-index:5;text-shadow:0 10px 60px rgba(0,0,0,.6)}
    #sc-handoff .dim{position:absolute;inset:0;background:rgba(22,29,38,.72)}`,
    build(el, s) {
      el.innerHTML = `<div class="home"><div class="ui">${J.shell()}<div class="pg">${J.pageToday(J.HOME)}</div></div></div><div class="dim"></div>
        <div class="v4h l l1">Stop searching.</div><div class="v4h l l2"><span class="o">Start consulting.</span></div>
        <div class="v4h lv">Let's see it live.</div>`;
      s.home = $('.home', el); s.dim = $('.dim', el); s.l1 = splitWords($('.l1', el)); s.l2 = splitWords($('.l2', el)); s.L1 = $('.l1', el); s.L2 = $('.l2', el);
      s.lv = $('.lv', el); s.wl = splitWords(s.lv); s.ui = $('.home .ui', el);
      cue('hit', s.t0 + 0.05, { v: 0.5 }); cue('hit', s.t0 + 1.0, { v: 0.7 }); cue('final', s.t0 + IR); cue('open', s.t0 + IR, { v: 1.2 });
    },
    update(lt, dur, s) {
      J.placeToday(s.ui);
      revealWords(s.l1, lt, 0.0, { st: 0.12, dy: 50, d: 0.6 });
      revealWords(s.l2, lt, 1.0, { st: 0.12, dy: 50, d: 0.6 });
      const q = P(lt, IR - 0.4, 0.4, E.inC);
      tf(s.L1, { o: 1 - q, y: -40 * q, b: 10 * q }); tf(s.L2, { o: 1 - q, y: -40 * q, b: 10 * q });
      // l'iris s'ouvre sur l'écran d'accueil ; la dernière image est l'écran seul, comme la première de la démo
      const R = 2300 * P(lt, IR, 1.6, E.ioC);
      s.home.style.clipPath = `circle(${R.toFixed(1)}px at 960px 540px)`;
      s.dim.style.opacity = (P(lt, IR, 0.3) * (1 - P(lt, 4.6, 0.8))).toFixed(3);
      s.dim.style.clipPath = s.home.style.clipPath;
      revealWords(s.wl, lt, IR + 0.1, { st: 0.1, dy: 50, d: 0.6 });
      tf(s.lv, { o: 1 - P(lt, 4.6, 0.6, E.inC) });
    },
  });

  J.v4Counter();

  // ---------------------------------------------------------------- repères de la musique (lus par audio/make_audio.py) — 120 BPM
  window.MARKS = {
    bpm: C.BPM,
    storm: 0.3, freeze: 9.5, avalanche: 9.55, build: 9.6, reveal: 10.0, flash: 10.5,
    groove: SH.how[0], drums: SH.briefing[0], bass: SH.pacing[0], trust: SH.sharper[0], vision: SH.sharper[0] + 2.0, outro: SH.handoff[0], final: SH.handoff[0] + IR,
    levels: [[0, 0.4], [0.3, 0.55], [9.4, 1.0], [9.55, 0.0], [10.45, 0.2], [10.5, 1.0], [SH.how[0], 0.7], [SH.briefing[0], 0.8], [SH.pacing[0], 0.85],
      [SH.montage[0], 0.95], [SH.impact[0], 1.0], [SH.world[0], 0.95], [SH.sharper[0], 0.65], [SH.handoff[0], 0.9], [89.0, 0.35], [90.0, 0.12]],
  };
})();
