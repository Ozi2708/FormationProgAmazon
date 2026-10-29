/* Film jury v3 — impact à l'échelle, relais vers la démo, repères de la musique */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, tf, vis, count, $, $$, scene, cue, splitWords, revealWords } = J;
  const NAVY_BG = 'radial-gradient(1400px 900px at 50% 52%,#1E2A3A 0%,#111923 58%,#0A0F16 100%)';
  const fte = n => n * C.HOURS_SAVED_PER_WEEK / C.WORK_HOURS_PER_WEEK;
  const fmtFte = n => (Math.round(n * 10) / 10).toString();
  const FTE_FR = fte(C.NB_PSC_FR), FTE_EU = fte(C.NB_PSC_EU);
  const HOURS_YEAR = C.NB_PSC_EU * C.HOURS_SAVED_PER_WEEK * C.WEEKS_PER_YEAR;
  window.IMPACT = { FTE_FR, FTE_EU, HOURS_YEAR };
  const QUOTE = false;

  // ---------------------------------------------------------------- 1:09 impact : 8 h par PSC, puis à l'échelle de la France et de l'Europe
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

  // ---------------------------------------------------------------- 1:19 relais : place à la démo
  // le bloc logo + nom reprend celui de la barre latérale, agrandi 4 fois
  scene({
    id: 'outro', t0: TL.outro[0], t1: TL.outro[1], cls: 'black',
    css: `
    #sc-outro .bg{position:absolute;left:0;top:0;transform-origin:50% 50%}
    #sc-outro .bg .ui{transform:scale(.96)}
    #sc-outro .ov{position:absolute;inset:0;background:radial-gradient(1400px 900px at 50% 50%,rgba(16,24,34,.88),rgba(8,12,18,.95))}
    #sc-outro .l{position:absolute;left:0;right:0;text-align:center;font-family:InterTight;font-weight:800;font-size:150px;letter-spacing:-.05em;line-height:1.05;color:#fff}
    #sc-outro .l1{top:330px}#sc-outro .l2{top:500px}
    #sc-outro .lk{position:absolute;left:0;right:0;top:250px;display:flex;justify-content:center;align-items:center;gap:44px}
    #sc-outro .lk b{display:block;font-family:InterTight;font-weight:800;font-size:88px;letter-spacing:-.01em;color:#fff;line-height:1}
    #sc-outro .lk .amz-logo{margin-top:16px}
    #sc-outro .lv{position:absolute;left:0;right:0;top:530px;text-align:center;font-family:InterTight;font-weight:800;font-size:150px;letter-spacing:-.05em;line-height:1;color:#fff;text-shadow:0 10px 60px rgba(0,0,0,.5)}
    #sc-outro .cr{position:absolute;left:0;right:0;top:800px;text-align:center;font:500 30px InterV;letter-spacing:.02em;color:#C9D1DB}`,
    build(el, s) {
      el.innerHTML = `<div class="bg"><div class="ui">${J.shell()}<div class="pg">${J.pageCampaigns(J.mapDots())}</div></div></div><div class="ov"></div>
        <div class="l l1">Stop searching.</div><div class="l l2"><span class="hl">Start consulting.</span></div>
        <div class="lk"><div class="lw">${J.jarvisLogo(160)}</div><div class="tx"><b>JARVIS</b>${BRAND.logo(280)}</div></div>
        <div class="lv">Let's see it <span class="hl">live.</span></div>
        <div class="cr">Built by Valentin &amp; Diane · PSC France</div>`;
      s.bg = $('.bg', el); s.ov = $('.ov', el); s.l1 = $('.l1', el); s.l2 = $('.l2', el); s.w1 = splitWords(s.l1); s.w2 = splitWords(s.l2);
      s.lw = $('.lw', el); s.tx = $('.lk .tx', el); s.lv = $('.lv', el); s.wl = splitWords(s.lv); s.cr = $('.cr', el);
      s.v = $('.lw .jl-v', el); s.vlen = s.v.getTotalLength(); s.v.style.strokeDasharray = s.vlen; s.tip = $('.lw .jl-tip', el);
      cue('hit', s.t0 + 0.25, { v: 0.5 }); cue('hit', s.t0 + 0.95, { v: 0.7 }); cue('final', s.t0 + 2.7); cue('smile', s.t0 + 2.9);
    },
    update(lt, dur, s) {
      // la plateforme, en fond, se dévoile pour passer la main à la démo
      const rv = P(lt, 4.8, 2.4, E.ioC);
      tf(s.bg, { s: 1.15 + 0.04 * P(lt, 0, dur, E.lin), b: 6 - 4 * rv });
      s.ov.style.opacity = (1 - 0.2 * rv).toFixed(3);
      revealWords(s.w1, lt, 0.25, { st: 0.12, dy: 60 });
      revealWords(s.w2, lt, 0.95, { st: 0.12, dy: 60 });
      const q = P(lt, 2.2, 0.45, E.inC);
      tf(s.l1, { y: -50 * q, o: 1 - q, b: 14 * q }); tf(s.l2, { y: -50 * q, o: 1 - q, b: 14 * q });
      tf(s.lw, { s: 0.4 + 0.6 * P(lt, 2.6, 0.7, E.outB), o: P(lt, 2.6, 0.3) });
      s.v.style.strokeDashoffset = (s.vlen * (1 - P(lt, 2.85, 0.7, E.ioC))).toFixed(1);
      tf(s.tip, { o: P(lt, 3.5, 0.25) });
      vis(s.tx, lt, 3.0, Infinity, { dx: -30, dy: 0, blur: 10 });
      revealWords(s.wl, lt, 3.3, { st: 0.1, dy: 60 });
      vis(s.cr, lt, 4.3, Infinity, { dy: 10, blur: 6 });
    },
  });

  // ---------------------------------------------------------------- repères de la musique (lus par audio/make_audio.py)
  const M = (k, d = 0) => +(TL[k][0] + d).toFixed(3);
  const F = M('hook', 5.9), A = M('app');
  window.MARKS = {
    storm: M('hook', 0.3), freeze: F, avalanche: +(F + 0.2).toFixed(3), build: +(F + 1.0).toFixed(3), reveal: M('reveal'), flash: M('reveal', 0.5),
    groove: M('app', 0.2), drums: +(A + 6.6).toFixed(3), bass: +(A + 15.8).toFixed(3), trust: +(A + 46.2).toFixed(3), vision: M('outro'), outro: M('outro'), final: M('outro', 2.7),
    levels: [[0, 0.45], [M('hook', 0.3), 0.55], [F - 0.1, 1.0], [F + 0.05, 0.0], [F + 0.6, 0.4], [M('reveal', 0.4), 1.0], [A, 0.7], [A + 6.6, 0.8],
      [A + 15.8, 0.85], [A + 26.6, 0.95], [A + 46.2, 0.75], [M('impact'), 1.0], [M('outro'), 1.0]],
  };
})();
