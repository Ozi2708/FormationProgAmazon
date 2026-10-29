/* Film d'intro v4 — plans 1 à 4 : la matinée qui déborde, la fatigue des outils, la révélation, comment ça marche */
(function () {
  'use strict';
  const { E, P, tf, vis, splitWords, revealWords, rng, ic, $, $$, scene, clamp, lerp, cue } = J;
  const K = J.K4, SH = J.SH;

  // ---------------------------------------------------------------- plan 1 · 0:00 matinée qui déborde
  const TYPES = { mail: ['mail', '#4C8DF6', 'Mail'], chat: ['message-square', '#9B6CF0', 'Chat'], cal: ['calendar', '#F2665B', 'Calendar'],
    dsp: ['chart-column', K.or, 'DSP'], sim: ['ticket', '#E2B53A', 'Ticket'] };
  const LABELS = [['mail', 'Re: delivery update'], ['chat', '@you can you check…'], ['cal', 'Client QBR in 15 min'], ['dsp', 'Order behind pace'], ['sim', 'SIM updated'],
    ['mail', 'Re: Q4 brief, added value?'], ['chat', '@you deck for tomorrow?'], ['dsp', 'Line item 0% delivered'], ['cal', 'Weekly agency sync'], ['mail', 'Fwd: creatives blocked'],
    ['sim', 'Ticket reopened'], ['chat', '@you pacing on the top advertiser?'], ['mail', 'Re: invoice copy Q3'], ['dsp', 'Budget at risk'], ['cal', 'WBR entries due Thu']];
  const PILES = [[380, 250], [380, 690], [1540, 250], [1540, 690], [960, 170], [700, 820], [1220, 820]];
  const WORDS = '90 emails. 6 meetings. 36 campaigns. <span class="o">Before 10 AM.</span>';
  const W0 = 2.0, WST = 0.42;
  window.STORM_SPAWNS = [];
  scene({
    id: 'overload', t0: SH.overload[0], t1: SH.overload[1], cls: 'v4', fin: 0,
    css: J.V4_CSS + J.UI_CSS + `
    #sc-overload .clk{position:absolute;left:0;right:0;top:330px;text-align:center;font-family:InterTight;font-weight:800;font-size:220px;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums;color:#fff;z-index:50;text-shadow:0 20px 80px rgba(0,0,0,.6)}
    #sc-overload .clk em{font-style:normal;font-size:60px;color:${K.cob};margin-left:14px;letter-spacing:0}
    #sc-overload .nc{position:absolute;left:0;top:0;width:340px;height:76px;margin:-38px 0 0 -170px;border-radius:16px;background:rgba(240,242,245,.96);
      box-shadow:0 24px 60px rgba(0,0,0,.45);display:flex;align-items:center;gap:14px;padding:0 16px;color:#15191E}
    #sc-overload .nc i{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;color:#fff;flex:none}
    #sc-overload .nc b{display:block;font-size:13px;font-weight:600;color:#6A717A}
    #sc-overload .nc span{display:block;font-size:18px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:250px}
    #sc-overload .hw{position:absolute;left:0;right:0;top:860px;text-align:center;font-size:72px;z-index:60;text-shadow:0 10px 50px rgba(0,0,0,.7)}
    #sc-overload .veil{position:absolute;left:0;right:0;bottom:0;height:360px;background:linear-gradient(180deg,rgba(22,29,38,0),rgba(22,29,38,.92) 55%);z-index:55}`,
    build(el, s) {
      const r = rng(11), N = 40;
      s.cards = Array.from({ length: N }, (_, i) => {
        const [type, label] = LABELS[i % LABELS.length], [icon, col, name] = TYPES[type];
        const d = J.h(`<div class="nc"><i style="background:${col}">${ic(icon, 22)}</i><div><b>${name}</b><span>${label}</span></div></div>`);
        el.appendChild(d);
        const pile = PILES[i % PILES.length];
        const x = pile[0] + (r() * 2 - 1) * 110, y = pile[1] + (r() * 2 - 1) * 70;
        // il arrive par le bord le plus proche
        const ex = x < 700 ? -300 : x > 1220 ? 2220 : x + (r() - 0.5) * 400, ey = x >= 700 && x <= 1220 ? (y < 540 ? -140 : 1220) : y + (r() - 0.5) * 300;
        // cadence qui s'emballe : 1 par temps, puis 2, puis 4
        const ts = 0.33 + 4.7 * Math.pow(i / N, 0.62);
        window.STORM_SPAWNS.push(ts);
        return { el: d, x, y, ex, ey, rz: (r() * 2 - 1) * 9, ts, z: i };
      });
      el.insertAdjacentHTML('beforeend', `<div class="clk"><span class="cv">9:09</span><em>AM</em></div><div class="veil"></div><div class="v4h hw">${WORDS}</div>`);
      s.cv = $('.cv', el); s.hw = splitWords($('.hw', el)); s.veil = $('.veil', el);
      for (let a = 0.0, k = 0; a < 5.0; k++) { cue('clocktick', a, { n: k, v: 0.7 }); a += 0.5 - 0.32 * a / 5; }
      s.hw.forEach((_, i) => cue('hit', W0 + i * WST, { v: i >= 6 ? 0.55 : 0.28 }));
    },
    update(lt, dur, s) {
      for (const c of s.cards) {
        const k = clamp((lt - c.ts) / 0.55);
        if (k <= 0) { c.el.style.visibility = 'hidden'; continue; }
        const e = E.outQu(k);
        tf(c.el, { x: lerp(c.ex, c.x, e), y: lerp(c.ey, c.y, e), rz: c.rz * e, o: 1 });
        c.el.style.zIndex = c.z;
      }
      const m = 9 + Math.round(49 * E.inQ(P(lt, 0, 5.0, E.lin)));
      const txt = `9:${String(m).padStart(2, '0')}`;
      if (s.cv._t !== txt) { s.cv.textContent = txt; s.cv._t = txt; }
      s.veil.style.opacity = P(lt, W0 - 0.3, 0.4).toFixed(3);
      revealWords(s.hw, lt, W0, { st: WST, dy: 40, d: 0.5 });
    },
  });

  // ---------------------------------------------------------------- plan 2 · 0:06 la fatigue des outils
  const TABS = ['AI assistant', 'Copilot', 'Agent', 'Bot', 'Dashboard', 'Chat', 'Insights', 'Notes AI', 'Summarizer', 'Agent v2', 'Helper', 'Tracker'];
  const STEPS = [[0.0, 1], [0.5, 2], [1.0, 4], [1.5, 8], [2.0, 12]];
  const BARW = 1700;
  const tabCount = lt => { let n = 0; for (const [a, c] of STEPS) if (lt >= a) n = c; return n; };
  const tabW = n => Math.min(300, BARW / Math.max(1, n));
  scene({
    id: 'fatigue', t0: SH.fatigue[0], t1: SH.fatigue[1], cls: 'v4', fin: 0,
    css: `
    #sc-fatigue .br{position:absolute;left:110px;top:150px;width:${BARW}px;height:64px;border-radius:14px 14px 0 0;background:#0E1319;box-shadow:0 20px 60px rgba(0,0,0,.4)}
    #sc-fatigue .br::after{content:"";position:absolute;left:0;right:0;top:64px;height:200px;background:linear-gradient(180deg,#232C38,rgba(35,44,56,0));border-radius:0 0 14px 14px}
    #sc-fatigue .tab{position:absolute;top:10px;height:54px;border-radius:12px 12px 0 0;background:#2A3442;display:flex;align-items:center;gap:10px;padding:0 14px;overflow:hidden;
      font:600 22px InterV;color:#E6E9ED;white-space:nowrap;border-right:1px solid #161D26}
    #sc-fatigue .tab .ic{color:${K.or};flex:none}
    #sc-fatigue .tab span{overflow:hidden;text-overflow:ellipsis}
    #sc-fatigue .tab.on{background:#3A4656}
    #sc-fatigue .ln{position:absolute;left:0;right:0;text-align:center;font-size:72px}`,
    build(el, s) {
      el.innerHTML = `<div class="br">${TABS.map(t => `<div class="tab">${ic('sparkles', 20)}<span>${t}</span></div>`).join('')}</div>
        <div class="v4h ln l1" style="top:420px">A new AI tool every week.</div>
        <div class="v4h ln l2" style="top:530px">Each one saves time.</div>
        <div class="v4h ln l3" style="top:640px"><span class="o">Switching between them costs it.</span></div>`;
      s.tabs = $$('.tab', el); s.l = $$('.ln', el).map(x => splitWords(x));
      STEPS.forEach(([a]) => cue('pop', s.t0 + a, { v: 0.6 }));
      [0.3, 1.4, 2.5].forEach(a => cue('hit', s.t0 + a, { v: 0.35 }));
      cue('freeze', s.t0 + 3.5);
    },
    update(lt, dur, s) {
      const L = Math.min(lt, 3.5); // tout se fige à 9,5 s
      // la largeur des onglets suit le nombre d'onglets ouverts
      let w = tabW(1);
      for (let i = 1; i < STEPS.length; i++) w = lerp(w, tabW(STEPS[i][1]), P(L, STEPS[i][0], 0.3, E.outQu));
      const n = tabCount(L);
      s.tabs.forEach((t, i) => {
        const born = STEPS.find(st => st[1] > i);
        const a = born ? born[0] : 0, k = P(L, a, 0.3, E.outB);
        t.style.width = (w - 2).toFixed(1) + 'px';
        t.style.left = (i * w).toFixed(1) + 'px';
        t.classList.toggle('on', i === n - 1);
        tf(t, { y: 30 * (1 - k), o: i < n ? P(L, a, 0.15) : 0 });
      });
      [0.3, 1.4, 2.5].forEach((a, i) => revealWords(s.l[i], L, a, { st: 0.07, dy: 34, d: 0.6 }));
    },
  });

  // ---------------------------------------------------------------- plan 3 · 0:10 révélation
  const RY = 230; // centre du logo
  scene({
    id: 'reveal', t0: SH.reveal[0], t1: SH.reveal[1], cls: 'v4', fin: 0,
    css: `
    #sc-reveal .bits{position:absolute;inset:0}
    #sc-reveal .bit{position:absolute;left:0;top:0;border-radius:10px;background:#2A3442;border:1px solid rgba(255,255,255,.1)}
    #sc-reveal .dot{position:absolute;left:940px;top:${RY - 20}px;width:40px;height:40px;border-radius:50%;background:${K.or};box-shadow:0 0 40px ${K.or}}
    #sc-reveal .flash{position:absolute;inset:0;background:${K.or};opacity:0;z-index:20}
    #sc-reveal .lg{position:absolute;left:885px;top:${RY - 75}px}
    #sc-reveal .wm{position:absolute;left:0;right:0;top:${RY + 105}px;text-align:center;font-size:180px;letter-spacing:.08em;padding-left:.08em;line-height:1}
    #sc-reveal .sm{position:absolute;left:700px;top:${RY + 290}px;width:520px}
    #sc-reveal .s1{left:0;right:0;top:${RY + 450}px;text-align:center;font-size:48px;color:#fff;font-weight:600}
    #sc-reveal .s2{left:0;right:0;top:${RY + 520}px;text-align:center;font-size:40px}
    #sc-reveal .ad{position:absolute;left:850px;top:880px}
    #sc-reveal .cr{left:0;right:0;top:960px;text-align:center;font-size:24px;letter-spacing:.02em}`,
    build(el, s) {
      const r = rng(5);
      s.bits = Array.from({ length: 26 }, (_, i) => {
        const w = i < 12 ? 150 : 300, h = i < 12 ? 50 : 70, x = 110 + r() * 1650, y = i < 12 ? 165 : 100 + r() * 880;
        const d = J.h(`<div class="bit" style="width:${w}px;height:${h}px"></div>`); return { el: d, x, y, w, h };
      });
      el.innerHTML = `<div class="bits"></div><div class="dot"></div>
        <div class="lg">${J.jarvisLogo(150)}</div>
        <div class="v4h wm">J.A.R.V.I.S.</div><div class="sm">${BRAND.smile(520)}</div>
        <div class="v4s s1">One entry point. Your second brain.</div>
        <div class="v4s s2">It reads, remembers, and acts.</div>
        <div class="ad">${BRAND.logo(220)}</div><div class="v4s cr">Built on Aki · Powered by Claude</div><div class="flash"></div>`;
      const bits = $('.bits', el); s.bits.forEach(b => bits.appendChild(b.el));
      s.dot = $('.dot', el); s.flash = $('.flash', el); s.lg = $('.lg', el); s.wm = $('.wm', el); s.sm = $('.sm', el);
      s.s1 = $('.s1', el); s.s2 = $('.s2', el); s.ad = $('.ad', el); s.cr = $('.cr', el);
      s.v = $('.jl-v', el); s.vlen = s.v.getTotalLength(); s.v.style.strokeDasharray = s.vlen; s.tip = $('.jl-tip', el);
      cue('implode', s.t0, { d: 0.5 }); cue('flash', s.t0 + 0.5); cue('smile', s.t0 + 1.5); cue('pop', s.t0 + 0.75, { v: 0.6 });
      cue('whoosh', s.t0 + 2.5, { v: 0.4 }); cue('hit', s.t0 + 4.0, { v: 0.35 });
    },
    update(lt, dur, s) {
      // tout est aspiré en un point orange, flash, puis le nom
      const k = P(lt, 0, 0.5, E.inQ);
      s.bits.forEach(b => tf(b.el, { x: lerp(b.x, 960 - b.w / 2, k), y: lerp(b.y, RY - b.h / 2, k), s: 1 - k, o: 1 - P(lt, 0.4, 0.1) }));
      tf(s.dot, { s: P(lt, 0.15, 0.3, E.outB) * (1 - P(lt, 0.5, 0.05)), o: P(lt, 0.15, 0.1) });
      s.flash.style.opacity = lt >= 0.5 && lt < 0.7 ? '1' : '0';
      const g = P(lt, 0.7, 0.6, E.outB);
      tf(s.lg, { s: 0.3 + 0.7 * g, o: P(lt, 0.7, 0.2) });
      s.v.style.strokeDashoffset = (s.vlen * (1 - P(lt, 0.8, 0.7, E.ioC))).toFixed(1);
      tf(s.tip, { o: P(lt, 1.4, 0.2) });
      const wi = P(lt, 0.7, 0.8, E.outQi);
      s.wm.style.letterSpacing = `${(0.08 + 0.3 * (1 - wi)).toFixed(3)}em`;
      tf(s.wm, { o: P(lt, 0.7, 0.5), b: 16 * (1 - wi) });
      s.sm.style.clipPath = `inset(-30% ${(100 - 100 * P(lt, 1.5, 0.6, E.outQu)).toFixed(2)}% -30% 0)`;
      vis(s.s1, lt, 2.5, Infinity, { dy: 20, blur: 8 });
      vis(s.s2, lt, 3.5, Infinity, { dy: 20, blur: 8 });
      vis(s.ad, lt, 4.0, Infinity, { dy: 14, blur: 6 });
      vis(s.cr, lt, 4.3, Infinity, { dy: 10, blur: 6 });
    },
  });

  // ---------------------------------------------------------------- plan 4 · 0:16 comment ça marche
  const COLS = [
    ['link', 'Connect', 'Outlook · Slack · Calendar · Amazon DSP · SIM · Docs'],
    ['brain', 'Understand', 'Claude reads, extracts, summarises'],
    ['gauge', 'Prioritise', 'Rules score urgency x business impact'],
    ['layers', 'Prepare', 'Agents: briefing, pacing, troubleshooting, drafting, meeting prep, routing'],
    ['shield-check', 'You approve', 'Nothing is sent without you.'],
  ];
  const CX = [230, 595, 960, 1325, 1690], IY = 420, LIT = i => 0.4 + i * 1.9;
  scene({
    id: 'how', t0: SH.how[0], t1: SH.how[1], cls: 'v4', fin: 0,
    css: `
    #sc-how .kk{left:0;right:0;top:120px;text-align:center}
    #sc-how svg.ln{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
    #sc-how .ci{position:absolute;top:${IY - 60}px;width:120px;height:120px;margin-left:-60px;border-radius:50%;display:grid;place-items:center;
      border:2px solid rgba(163,170,181,.45);background:${K.ink};color:${K.cob}}
    #sc-how .ci.on{background:${K.or};border-color:${K.or};color:${K.ink};box-shadow:0 0 50px rgba(255,98,0,.45)}
    #sc-how .tt{position:absolute;top:${IY + 90}px;width:340px;margin-left:-170px;text-align:center;font-size:46px}
    #sc-how .cp{position:absolute;top:${IY + 160}px;width:320px;margin-left:-160px;text-align:center;font-size:27px;line-height:1.35}
    #sc-how .bd{position:absolute;left:${CX[0] - 130}px;top:${IY - 128}px;width:260px;height:40px;border-radius:20px;border:1.5px solid ${K.or};
      display:flex;justify-content:center;align-items:center;gap:8px;font:600 18px Plex,monospace;letter-spacing:.04em;color:${K.or}}
    #sc-how .pd{position:absolute;left:0;right:0;top:860px;text-align:center;font-size:56px}
    #sc-how .tv{position:absolute;left:0;top:${IY}px;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:${K.or};box-shadow:0 0 24px 6px rgba(255,98,0,.6)}`,
    build(el, s) {
      el.innerHTML = `<div class="v4k kk">How it works</div><svg class="ln">
          ${CX.slice(0, 4).map((x, i) => `<line x1="${x + 70}" y1="${IY}" x2="${CX[i + 1] - 78}" y2="${IY}" stroke="${K.cob}" stroke-opacity=".55" stroke-width="2"/>
            <path d="M${CX[i + 1] - 88},${IY - 8} L${CX[i + 1] - 76},${IY} L${CX[i + 1] - 88},${IY + 8}" fill="none" stroke="${K.cob}" stroke-opacity=".55" stroke-width="2"/>`).join('')}</svg>
        ${COLS.map((c, i) => `<div class="ci" style="left:${CX[i]}px">${ic(c[0], 52)}</div>
          <div class="v4h tt" style="left:${CX[i]}px">${c[1]}</div><div class="v4s cp" style="left:${CX[i]}px">${c[2]}</div>`).join('')}
        <div class="bd">${ic('refresh-cw', 16)}Synced every 15 min</div><div class="tv"></div>
        <div class="v4h pd">Nothing is sent <span class="o">without you.</span></div>`;
      s.kk = $('.kk', el); s.ci = $$('.ci', el); s.tt = $$('.tt', el); s.cp = $$('.cp', el); s.bd = $('.bd', el); s.tv = $('.tv', el); s.pd = $('.pd', el);
      s.pw = splitWords(s.pd);
      COLS.forEach((_, i) => { cue('node', s.t0 + LIT(i), { n: i }); cue('swish', s.t0 + LIT(i) - 0.5, { v: 0.4 }); });
      cue('lock', s.t0 + LIT(4) + 0.1); cue('success', s.t0 + LIT(4) + 0.3, { v: 0.6 });
    },
    update(lt, dur, s) {
      vis(s.kk, lt, 0.05, Infinity, { dy: 12, blur: 6 });
      COLS.forEach((_, i) => {
        const a = LIT(i), on = lt >= a;
        vis(s.ci[i], lt, 0.1 + i * 0.06, Infinity, { dy: 0, ds: -0.3, din: 0.5, ein: E.outB, blur: 4 });
        s.ci[i].classList.toggle('on', on);
        const kick = on ? Math.exp(-(lt - a) * 5) : 0;
        tf(s.ci[i], { s: 1 + 0.15 * kick, o: P(lt, 0.1 + i * 0.06, 0.3) });
        s.tt[i].style.color = on ? '#fff' : '#566070';
        tf(s.tt[i], { o: P(lt, 0.2 + i * 0.06, 0.3) });
        vis(s.cp[i], lt, a + 0.1, Infinity, { dy: 14, blur: 6, din: 0.5 });
      });
      // le point orange voyage d'une colonne à l'autre
      let x = CX[0];
      for (let i = 1; i < 5; i++) x = lerp(x, CX[i], P(lt, LIT(i) - 0.9, 0.9, E.ioC));
      tf(s.tv, { x, o: P(lt, 0.3, 0.2) * (1 - P(lt, LIT(4) + 0.2, 0.3)) });
      const pulse = 0.5 + 0.5 * Math.sin(lt * 5);
      vis(s.bd, lt, LIT(0) + 0.3, Infinity, { dy: 10, blur: 4 });
      s.bd.style.boxShadow = `0 0 ${(10 + 18 * pulse).toFixed(0)}px rgba(255,98,0,${(0.2 + 0.3 * pulse).toFixed(2)})`;
      revealWords(s.pw, lt, LIT(4) + 0.2, { st: 0.08, dy: 30, d: 0.6 });
    },
  });
})();
