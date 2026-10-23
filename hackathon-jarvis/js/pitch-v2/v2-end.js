/* Film jury v2 — impact à l'échelle, apprentissage, (Salesforce en 120 s), relais vers la démo */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, tf, vis, count, rng, ic, $, $$, clamp, lerp, scene, cue, orb, orbTick, SOURCES, tile, splitWords, revealWords } = J;
  const NAVY_BG = 'radial-gradient(1400px 900px at 50% 52%,#1E2A3A 0%,#111923 58%,#0A0F16 100%)';
  const fte = n => n * C.HOURS_SAVED_PER_WEEK / C.WORK_HOURS_PER_WEEK;
  const fmtFte = n => (Math.round(n * 10) / 10).toString();
  const FTE_FR = fte(C.NB_PSC_FR), FTE_EU = fte(C.NB_PSC_EU);
  const HOURS_YEAR = C.NB_PSC_EU * C.HOURS_SAVED_PER_WEEK * C.WEEKS_PER_YEAR;
  window.IMPACT = { FTE_FR, FTE_EU, HOURS_YEAR };
  const QUOTE = J.isSet(C.PILOT_QUOTE);

  // ---------------------------------------------------------------- 1:08 impact : 8 h par PSC, puis à l'échelle de la France et de l'Europe
  const GRID = { cx: 1390, cy: 560 };
  const layout = (n, cols, cell) => {
    const rows = Math.ceil(n / cols), w = (cols - 1) * cell, h = (rows - 1) * cell;
    return Array.from({ length: n }, (_, i) => ({ x: GRID.cx - w / 2 + (i % cols) * cell, y: GRID.cy - h / 2 + Math.floor(i / cols) * cell, col: i % cols, row: Math.floor(i / cols) }));
  };
  // les personnes « rendues » remplissent des colonnes entières (1 colonne sur 5 = 20 %)
  const lit = (pos, k) => { const order = pos.map((p, i) => i).sort((a, b) => pos[a].col - pos[b].col || pos[a].row - pos[b].row); return new Set(order.slice(0, k)); };
  const PFR = layout(C.NB_PSC_FR, 5, 104), PEU = layout(C.NB_PSC_EU, 10, 70);
  const LFR = lit(PFR, Math.round(FTE_FR)), LEU = lit(PEU, Math.round(FTE_EU));
  const PERSON = '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.2" fill="currentColor"/><path d="M3.5 21c.6-4.6 4.1-7.4 8.5-7.4s7.9 2.8 8.5 7.4z" fill="currentColor"/></svg>';
  const P2 = 3.2, P3 = 6.6, PQ = 10.2;
  scene({
    id: 'impact', t0: TL.impact[0], t1: TL.impact[1], cls: 'dark', fin: 0.6,
    css: `
    #sc-impact{background:${NAVY_BG}}
    #sc-impact .b8{position:absolute;left:140px;top:250px;transform-origin:0 0}
    #sc-impact .b8 .k{font:600 28px Plex,monospace;letter-spacing:.24em;text-transform:uppercase;color:#FF9900}
    #sc-impact .b8 .r{display:flex;align-items:baseline;gap:30px;margin-top:6px}
    #sc-impact .b8 .n{font-family:InterTight;font-weight:700;font-size:300px;letter-spacing:-.06em;line-height:.95}
    #sc-impact .b8 .t{font-weight:700;font-size:84px;letter-spacing:-.045em;color:#fff;line-height:1.05}
    #sc-impact .b8 .d{margin-top:22px;font-size:48px;color:#C9D1DB;letter-spacing:-.02em}
    #sc-impact .b8 .d b{color:#fff;font-weight:700}
    #sc-impact .sc{position:absolute;left:140px;top:380px;width:900px}
    #sc-impact .sc .a{font-weight:700;font-size:64px;letter-spacing:-.04em;color:#fff}
    #sc-impact .sc .b{margin-top:10px;font-family:InterTight;font-weight:700;font-size:116px;letter-spacing:-.05em;line-height:1}
    #sc-impact .sc .c{margin-top:24px;font-family:InterTight;font-weight:700;font-size:64px;letter-spacing:-.03em;color:#fff}
    #sc-impact .sc .c em{font-style:normal;font-family:InterV;font-weight:500;font-size:40px;color:#C9D1DB;margin-left:12px;letter-spacing:-.01em}
    #sc-impact .pp{position:absolute;left:0;top:0;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.08);color:#7E8A97}
    #sc-impact .pp svg{width:62%;height:62%}
    #sc-impact .pp.on{background:linear-gradient(160deg,#FFB547,#F57C00);color:#fff;box-shadow:0 0 24px rgba(255,153,0,.55)}
    #sc-impact .pp.eu{width:46px;height:46px;margin:-23px 0 0 -23px}
    #sc-impact .gl{position:absolute;left:${GRID.cx - 400}px;width:800px;text-align:center;top:880px;white-space:nowrap;font:500 28px InterV;color:#98A1AC}
    #sc-impact .gl b{color:#FFB547;font-weight:700}
    #sc-impact .qt{position:absolute;left:240px;right:240px;top:330px;text-align:center}
    #sc-impact .qt p{font-size:56px;font-weight:600;line-height:1.25;letter-spacing:-.02em;color:#fff}
    #sc-impact .qt span{display:block;margin-top:36px;font-size:30px;color:#FFB547}`,
    build(el, s) {
      el.innerHTML = `<div class="b8"><div class="k">Time back · per PSC</div>
          <div class="r"><span class="n grad">${C.HOURS_SAVED_PER_WEEK}h</span><span class="t">back,<br><span class="hl">every week.</span></span></div>
          <div class="d"><b>One working day.</b> Every week.</div></div>
        <div class="sc s1"><div class="a">${C.NB_PSC_FR} PSCs in France</div><div class="b grad">→ ${fmtFte(FTE_FR)} FTE back</div></div>
        <div class="sc s2"><div class="a">${C.NB_PSC_EU} PSCs across Europe</div><div class="b grad">→ ${fmtFte(FTE_EU)} FTE back</div><div class="c"><span class="hy">0</span><em>hours / year</em></div></div>
        <div class="ppf">${PFR.map((_, i) => `<div class="pp${LFR.has(i) ? ' hi' : ''}">${PERSON}</div>`).join('')}</div>
        <div class="ppe">${PEU.map((_, i) => `<div class="pp eu${LEU.has(i) ? ' hi' : ''}">${PERSON}</div>`).join('')}</div>
        <div class="gl g1">1 PSC in 5 · <b>${C.HOURS_SAVED_PER_WEEK} h</b> of every <b>${C.WORK_HOURS_PER_WEEK} h</b> week back</div>
        ${QUOTE ? `<div class="qt"><p>“${J.esc(C.PILOT_QUOTE)}”</p>${J.isSet(C.PILOT_QUOTE_AUTHOR) ? `<span>${J.esc(C.PILOT_QUOTE_AUTHOR)}</span>` : ''}</div>` : ''}`;
      s.b8 = $('.b8', el); s.tw = splitWords($('.b8 .t', el)); s.n8 = $('.b8 .n', el); s.d8 = $('.b8 .d', el);
      s.s1 = $('.s1', el); s.s2 = $('.s2', el); s.hy = $('.hy', el); s.ff = $$('.ppf .pp', el); s.fe = $$('.ppe .pp', el); s.gl = $('.gl', el); s.qt = $('.qt', el);
      cue('darken', s.t0 + 0.1); cue('hit', s.t0 + 0.3, { v: 0.6 }); cue('success', s.t0 + 1.3, { v: 0.5 });
      cue('whoosh', s.t0 + P2 - 0.1, { v: 0.5 }); PFR.forEach((_, i) => cue('tick', s.t0 + P2 + 0.2 + i * 0.04, { v: 0.3 }));
      cue('hit', s.t0 + P2 + 1.2, { v: 0.55 });
      cue('whoosh', s.t0 + P3 - 0.1, { v: 0.5 }); cue('data', s.t0 + P3 + 0.2, { d: 1.4 }); cue('hit', s.t0 + P3 + 1.4, { v: 0.6 }); cue('count', s.t0 + P3 + 1.6, { d: 1.4 });
      if (QUOTE) { cue('whoosh', s.t0 + PQ - 0.1, { v: 0.4 }); cue('success', s.t0 + PQ + 0.3, { v: 0.4 }); }
    },
    update(lt, dur, s, t) {
      s.el.style.opacity = Math.min(P(lt, 0, 0.6), 1 - P(lt, dur - 0.5, 0.5, E.inC)).toFixed(4);
      // 8 h par semaine, puis ce bloc devient un rappel en haut à gauche
      const up = P(lt, P2 - 0.2, 0.8, E.ioC);
      vis(s.n8, lt, 0.2, Infinity, { dy: 40, blur: 20, ds: 0.1, din: 0.9 });
      revealWords(s.tw, lt, 0.5, { st: 0.1, dy: 40 });
      vis(s.d8, lt, 1.2, Infinity, { dy: 14, blur: 8, op: 1 - up });
      tf(s.b8, { x: -40 * up, y: -200 * up, s: 1 - 0.55 * up, o: QUOTE ? 1 - P(lt, PQ - 0.3, 0.4) : 1 });
      // France
      const q1 = P(lt, P3 - 0.3, 0.4, E.inC);
      vis(s.s1, lt, P2 + 0.1, Infinity, { dy: 30, blur: 10, op: 1 - q1 });
      PFR.forEach((p, i) => {
        const a = P2 + 0.2 + i * 0.04, k = P(lt, a, 0.5, E.outB);
        const on = LFR.has(i) && lt > P2 + 1.2;
        s.ff[i].classList.toggle('on', on);
        tf(s.ff[i], { x: p.x, y: p.y, s: k * (on ? 1 + 0.12 * Math.exp(-(lt - P2 - 1.2) * 4) : 1) * (1 - 0.3 * q1), o: P(lt, a, 0.3) * (1 - q1) });
      });
      // Europe
      vis(s.s2, lt, P3 + 0.1, Infinity, { dy: 30, blur: 10, op: QUOTE ? 1 - P(lt, PQ - 0.3, 0.4) : 1 });
      count(s.hy, lt, P3 + 1.6, 1.4, 0, HOURS_YEAR);
      const q2 = QUOTE ? P(lt, PQ - 0.3, 0.4) : 0;
      PEU.forEach((p, i) => {
        const a = P3 + 0.2 + (p.col + p.row) * 0.035, k = P(lt, a, 0.5, E.outB);
        const on = LEU.has(i) && lt > P3 + 1.4;
        s.fe[i].classList.toggle('on', on);
        tf(s.fe[i], { x: p.x, y: p.y, s: k, o: P(lt, a, 0.3) * (1 - q2) });
      });
      vis(s.gl, lt, P2 + 1.5, Infinity, { dy: 10, blur: 6, op: 1 - q2 });
      if (s.qt) vis(s.qt, lt, PQ, Infinity, { dy: 24, blur: 10 });
    },
  });

  // ---------------------------------------------------------------- 1:18 apprentissage : plus juste chaque jour
  const INS = [['mail', '#2F6FDE', 'Every email you send'], ['file-text', '#16947E', 'Every document you create'], ['chart-column', '#F7930F', 'Every campaign result'], ['circle-check', '#5D6B7C', 'Every correction you make']];
  const LO = { x: 1640, y: 560 }, IY = i => 380 + i * 112;
  scene({
    id: 'learning', t0: TL.learning[0], t1: TL.learning[1], cls: 'dark',
    css: `
    #sc-learning{background:${NAVY_BG}}
    #sc-learning .hb{position:absolute;left:140px;top:150px}
    #sc-learning .hb .kicker{margin-bottom:24px;font-size:28px}
    #sc-learning .hb .head{font-size:110px}
    #sc-learning .in{position:absolute;left:140px;display:flex;gap:18px;align-items:center;margin-top:-30px}
    #sc-learning .in .ii{width:60px;height:60px;border-radius:16px;display:grid;place-items:center;color:#fff;flex:none;box-shadow:0 12px 30px rgba(0,0,0,.35)}
    #sc-learning .in b{font-size:34px;color:#fff;font-weight:650;letter-spacing:-.02em;white-space:nowrap}
    #sc-learning .ow{position:absolute;left:${LO.x}px;top:${LO.y}px}
    #sc-learning svg.lp{position:absolute;left:${LO.x - 190}px;top:${LO.y - 190}px;width:380px;height:380px;overflow:visible}
    #sc-learning .pk{position:absolute;left:0;top:0;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:7px;display:grid;place-items:center;color:#fff}
    #sc-learning .days{position:absolute;left:140px;top:900px;width:1640px}
    #sc-learning .days .bar{position:relative;height:4px;border-radius:3px;background:rgba(255,255,255,.12);margin:0 110px}
    #sc-learning .days .bar i{position:absolute;left:0;top:0;bottom:0;width:100%;border-radius:3px;background:linear-gradient(90deg,#FF9900,#FFC266);transform-origin:0 50%}
    #sc-learning .days .bar b{position:absolute;top:-7px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:#FFC266;box-shadow:0 0 14px rgba(255,153,0,.8)}
    #sc-learning .days span{position:absolute;top:-16px;font:600 28px Plex,monospace;letter-spacing:.12em;text-transform:uppercase;color:#C9D1DB}
    #sc-learning .days .d1{left:0}#sc-learning .days .d2{right:0}`,
    build(el, s) {
      const r = 170;
      el.innerHTML = `<div class="hb"><div class="kicker"><i></i>Always learning</div><div class="head">Sharper <span class="hl">every day.</span></div></div>
        <svg class="lp" viewBox="-190 -190 380 380"><circle r="${r}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="2"/>
          <g class="arc"><path d="M ${r} 0 A ${r} ${r} 0 1 1 ${(r * Math.cos(5.6)).toFixed(1)} ${(r * Math.sin(5.6)).toFixed(1)}" fill="none" stroke="#FF9900" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 10"/></g></svg>
        <div class="ow">${orb(200)}</div>
        ${INS.map((n, i) => `<div class="in" style="top:${IY(i)}px"><div class="ii" style="background:${n[1]}">${ic(n[0], 28)}</div><b>${n[2]}</b></div>`).join('')}
        <div class="pks"></div><div class="days"><span class="d1">day 1</span><span class="d2">day 90</span><div class="bar"><i></i><b></b></div></div>`;
      s.k = $('.hb .kicker', el); s.hw = splitWords($('.hb .head', el)); s.orb = $('.ow .orb', el); s.arc = $('.lp .arc', el); s.lp = $('.lp', el);
      s.ins = $$('.in', el); s.bar = $('.days .bar i', el); s.dot = $('.days .bar b', el); s.days = $('.days', el);
      const pks = $('.pks', el), rr = rng(9);
      s.pk = [];
      INS.forEach((n, si) => { for (let j = 0; j < 3; j++) { const d = J.h(`<div class="pk" style="background:${n[1]}">${ic(n[0], 15)}</div>`); pks.appendChild(d); s.pk.push({ el: d, y0: IY(si), ph: j / 3 + rr() * 0.08, sp: 0.6 + rr() * 0.08 }); } });
      INS.forEach((_, i) => cue('pop', s.t0 + 0.5 + i * 0.15, { v: 0.4 })); cue('data', s.t0 + 0.9, { d: 3.6 }); cue('sparkle', s.t0 + 3.0);
    },
    update(lt, dur, s, t) {
      vis(s.k, lt, 0.05, Infinity, { dy: 14, blur: 6 }); revealWords(s.hw, lt, 0.12, { st: 0.08 });
      s.ins.forEach((el, i) => vis(el, lt, 0.5 + i * 0.15, Infinity, { dx: -30, dy: 0, blur: 8 }));
      let kick = 0;
      for (const p of s.pk) {
        if (lt < 0.9) { p.el.style.opacity = 0; continue; }
        const ph = ((lt - 0.9) * p.sp + p.ph) % 1;
        const u = E.inQ(ph), v = 1 - u, x0 = 830, y0 = p.y0, cx = 1200, cy = (p.y0 + LO.y) / 2;
        p.el.style.transform = `translate(${(v * v * x0 + 2 * v * u * cx + u * u * LO.x).toFixed(1)}px,${(v * v * y0 + 2 * v * u * cy + u * u * LO.y).toFixed(1)}px) scale(${(1 - 0.6 * u).toFixed(3)})`;
        p.el.style.opacity = (P(lt, 0.9, 0.4) * Math.min(1, ph * 6) * (1 - P(ph, 0.85, 0.15, E.lin))).toFixed(3);
        if (ph > 0.9) kick = Math.max(kick, 1 - (ph - 0.9) / 0.1);
      }
      const growth = P(lt, 0.8, 4.0, E.ioC);
      tf(s.orb, { s: orbTick(s.orb, t, { glow: 0.7 + 0.8 * growth + 0.3 * kick }) * (0.75 + 0.25 * P(lt, 0.2, 0.8, E.outB)) * (1 + 0.16 * growth + 0.04 * kick), o: P(lt, 0.2, 0.5) });
      s.arc.setAttribute('transform', `rotate(${(lt * 40).toFixed(2)})`);
      s.lp.style.opacity = P(lt, 0.4, 0.6).toFixed(3);
      vis(s.days, lt, 0.8, Infinity, { dy: 14, blur: 6 });
      s.bar.style.transform = `scaleX(${growth.toFixed(4)})`;
      s.dot.style.left = (100 * growth).toFixed(2) + '%';
    },
  });

  // ---------------------------------------------------------------- (version 120 s) la suite : Salesforce
  if (TL.next) {
    const SF = { name: 'Salesforce', icon: 'cloud', c: '#0B9EDB' };
    const NC = { x: 1330, y: 560 }, RING = SOURCES.concat([SF]);
    scene({
      id: 'next', t0: TL.next[0], t1: TL.next[1], cls: 'dark',
      css: `#sc-next{background:${NAVY_BG}}
      #sc-next .copy{left:140px;width:620px}
      #sc-next .head{font-size:100px}
      #sc-next .kicker{font-size:28px}
      #sc-next .sub{font-size:32px}
      #sc-next svg.ln{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
      #sc-next .ow{position:absolute;left:${NC.x}px;top:${NC.y}px}
      #sc-next .tile-name{font-size:20px}
      #sc-next .nx{position:absolute;font:600 18px Plex,monospace;letter-spacing:.14em;color:#fff;background:var(--or);border-radius:999px;padding:6px 12px}`,
      build(el, s) {
        el.innerHTML = `<div class="copy"><div class="kicker"><i></i>What's next</div><div class="head">Next: <span class="hl">Salesforce.</span></div>
          <div class="sub">Sales and targets, right next to delivery.</div></div><svg class="ln"></svg><div class="tiles"></div><div class="ow">${orb(160)}</div>`;
        s.k = $('.kicker', el); s.hw = splitWords($('.head', el)); s.sub = $('.sub', el); s.orb = $('.ow .orb', el);
        const svg = $('svg.ln', el), tiles = $('.tiles', el);
        s.tiles = RING.map((src, i) => {
          const a = -Math.PI / 2 + i * 2 * Math.PI / RING.length, x = NC.x + Math.cos(a) * 300, y = NC.y + Math.sin(a) * 270;
          const tt = J.h(tile(src, 84)); tt.style.left = x + 'px'; tt.style.top = y + 'px'; tiles.appendChild(tt);
          const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          ln.setAttribute('x1', x); ln.setAttribute('y1', y); ln.setAttribute('x2', NC.x); ln.setAttribute('y2', NC.y);
          ln.setAttribute('stroke', src === SF ? 'rgba(80,190,240,.75)' : 'rgba(255,170,90,.35)'); ln.setAttribute('stroke-width', '2'); if (src === SF) ln.setAttribute('stroke-dasharray', '7 7');
          svg.appendChild(ln);
          return { el: tt, ln, isSF: src === SF, i };
        });
        const sf = s.tiles.find(o => o.isSF);
        s.nx = J.h('<div class="nx">NEXT</div>'); s.nx.style.left = (parseFloat(sf.el.style.left) + 34) + 'px'; s.nx.style.top = (parseFloat(sf.el.style.top) - 76) + 'px'; el.appendChild(s.nx);
        cue('whoosh', s.t0 + 0.9, { v: 0.6 }); cue('hit', s.t0 + 1.4, { v: 0.4 });
      },
      update(lt, dur, s, t) {
        vis(s.k, lt, 0.05, Infinity, { dy: 14, blur: 6 }); revealWords(s.hw, lt, 0.15); vis(s.sub, lt, 0.8, Infinity, { dy: 18, blur: 8 });
        tf(s.orb, { s: orbTick(s.orb, t) * (0.6 + 0.4 * P(lt, 0.1, 0.8, E.outB)), o: P(lt, 0.1, 0.4) });
        s.tiles.forEach(o => {
          const a = o.isSF ? 0.9 : 0.2 + o.i * 0.06;
          tf(o.el, { x: o.isSF ? 300 * (1 - P(lt, a, 0.8, E.outX)) : 0, s: 0.7 + 0.3 * P(lt, a, 0.6, E.outB), o: P(lt, a, 0.35) });
          o.ln.style.opacity = P(lt, o.isSF ? 1.4 : 0.6, 0.5).toFixed(3);
        });
        vis(s.nx, lt, 1.6, Infinity, { dy: 8, ds: -0.4, din: 0.5, ein: E.outB });
      },
    });
  }

  // ---------------------------------------------------------------- 1:23 relais : place à la démo
  scene({
    id: 'outro', t0: TL.outro[0], t1: TL.outro[1], cls: 'black',
    css: `
    #sc-outro .bg{position:absolute;left:160px;top:-40px;transform-origin:50% 40%}
    #sc-outro .ov{position:absolute;inset:0;background:radial-gradient(1400px 900px at 50% 50%,rgba(16,24,34,.86),rgba(8,12,18,.94))}
    #sc-outro .l{position:absolute;left:0;right:0;text-align:center;font-weight:700;font-size:150px;letter-spacing:-.055em;line-height:1.05;color:#fff}
    #sc-outro .l1{top:330px}#sc-outro .l2{top:500px}
    #sc-outro .lo{position:absolute;left:960px;top:236px}
    #sc-outro .nm{position:absolute;left:0;right:0;top:296px;text-align:center;font-weight:700;font-size:64px;letter-spacing:.2em;padding-left:.2em;color:#fff}
    #sc-outro .sm{position:absolute;left:810px;top:376px;width:300px;filter:drop-shadow(0 0 12px rgba(255,153,0,.85))}
    #sc-outro .lv{position:absolute;left:0;right:0;top:500px;text-align:center;font-weight:700;font-size:160px;letter-spacing:-.055em;line-height:1;color:#fff;text-shadow:0 10px 60px rgba(0,0,0,.5)}
    #sc-outro .by{position:absolute;left:0;right:0;top:820px;display:flex;justify-content:center;align-items:center;gap:20px}
    #sc-outro .by span{font:500 24px Plex,monospace;letter-spacing:.24em;text-transform:uppercase;color:#C9D1DB}
    #sc-outro .cr{position:absolute;left:0;right:0;top:920px;text-align:center;font:500 28px InterV;letter-spacing:.02em;color:#C9D1DB}`,
    build(el, s) {
      el.innerHTML = `<div class="bg">${J.appMock()}</div><div class="ov"></div>
        <div class="l l1">Stop searching.</div><div class="l l2"><span class="hl">Start consulting.</span></div>
        <div class="lo">${orb(64)}</div><div class="nm">J.A.R.V.I.S.</div><div class="sm">${BRAND.smile(300)}</div>
        <div class="lv">Let's see it <span class="hl">live.</span></div>
        <div class="by"><span>by</span>${BRAND.logo(230)}</div><div class="cr">Built by Valentin &amp; Diane · PSC France</div>`;
      s.bg = $('.bg', el); s.ov = $('.ov', el); s.l1 = $('.l1', el); s.l2 = $('.l2', el); s.w1 = splitWords(s.l1); s.w2 = splitWords(s.l2);
      s.orb = $('.lo .orb', el); s.nm = $('.nm', el); s.sm = $('.sm', el); s.lv = $('.lv', el); s.wl = splitWords(s.lv); s.by = $('.by', el); s.cr = $('.cr', el);
      cue('hit', s.t0 + 0.25, { v: 0.5 }); cue('hit', s.t0 + 0.95, { v: 0.7 }); cue('final', s.t0 + 2.7); cue('smile', s.t0 + 3.0);
    },
    update(lt, dur, s, t) {
      // l'écran d'accueil de la plateforme, en fond, se dévoile pour passer la main à la démo
      const rv = P(lt, 4.6, 2.4, E.ioC);
      tf(s.bg, { s: 1.2 + 0.04 * P(lt, 0, dur, E.lin), b: 6 - 4 * rv });
      s.ov.style.opacity = (1 - 0.2 * rv).toFixed(3);
      revealWords(s.w1, lt, 0.25, { st: 0.12, dy: 60 });
      revealWords(s.w2, lt, 0.95, { st: 0.12, dy: 60 });
      const q = P(lt, 2.2, 0.45, E.inC);
      tf(s.l1, { y: -50 * q, o: 1 - q, b: 14 * q }); tf(s.l2, { y: -50 * q, o: 1 - q, b: 14 * q });
      tf(s.orb, { s: orbTick(s.orb, t) * P(lt, 2.6, 0.8, E.outB), o: P(lt, 2.6, 0.4) });
      vis(s.nm, lt, 2.7, Infinity, { dy: 16, blur: 12 });
      s.sm.style.clipPath = `inset(-30% ${(100 - 100 * P(lt, 3.0, 0.7, E.outQu)).toFixed(2)}% -30% 0)`;
      revealWords(s.wl, lt, 2.9, { st: 0.1, dy: 60 });
      vis(s.by, lt, 3.7, Infinity, { dy: 14, blur: 8 });
      vis(s.cr, lt, 4.2, Infinity, { dy: 10, blur: 6 });
    },
  });

  // ---------------------------------------------------------------- repères de la musique (lus par audio/make_audio.py)
  const M = (k, d = 0) => +(TL[k][0] + d).toFixed(3);
  const F = M('hook', 5.9);
  window.MARKS = {
    storm: M('hook', 0.3), freeze: F, avalanche: +(F + 0.2).toFixed(3), build: +(F + 1.0).toFixed(3), reveal: M('reveal'), flash: M('reveal', 0.5),
    groove: M('how', 0.2), drums: M('brief'), bass: M('pacing'), trust: M('learning'), vision: TL.next ? M('next') : M('outro'), outro: M('outro'), final: M('outro', 2.7),
    levels: [[0, 0.45], [M('hook', 0.3), 0.55], [F - 0.1, 1.0], [F + 0.05, 0.0], [F + 0.6, 0.4], [M('reveal', 0.4), 1.0], [M('how'), 0.7], [M('brief'), 0.8],
      [M('pacing'), 0.85], [M('meeting'), 0.95], [M('impact'), 1.0], [M('learning'), 0.6]].concat(TL.next ? [[M('next'), 0.75]] : []).concat([[M('outro'), 1.0]]),
  };
})();
