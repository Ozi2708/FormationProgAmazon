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
    #sc-reveal .flash{position:absolute;inset:0;background:radial-gradient(900px 700px at 960px ${RY}px,rgba(255,150,70,.55),rgba(255,98,0,.16) 40%,rgba(255,98,0,0) 75%);opacity:0;z-index:0}
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
      el.innerHTML = `<div class="flash"></div><div class="bits"></div><div class="dot"></div>
        <div class="lg">${J.jarvisLogo(150)}</div>
        <div class="v4h wm">J.A.R.V.I.S.</div><div class="sm">${BRAND.smile(520)}</div>
        <div class="v4s s1">One entry point. Your second brain.</div>
        <div class="v4s s2">It reads, remembers, and acts.</div>
        <div class="ad">${BRAND.logo(220)}</div><div class="v4s cr">Built on Aki · Powered by Claude</div>`;
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
      s.flash.style.opacity = (P(lt, 0.3, 0.35, E.outC) * (1 - 0.65 * P(lt, 0.7, 1.6, E.ioC))).toFixed(3);
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

  // ---------------------------------------------------------------- plan 4 · 0:16 comment ça marche : les flux, du branchement à votre validation
  const SRC = J.SOURCES.map(x => Object.assign({}, x, { name: x.name === 'SIM tickets' ? 'SIM' : x.name === 'Documents' ? 'Docs' : x.name }));
  const COLX = [230, 590, 960, 1330, 1700];
  const HEAD = ['Connect', 'Sync', 'Understand', 'Prepare', 'You approve'];
  const OY4 = 560, SRC_Y = i => 330 + i * 92;
  const AG = [['sun', 'Briefing'], ['trending-up', 'Pacing'], ['wrench', 'Troubleshooting'], ['pen-line', 'Drafting'], ['calendar-check', 'Meeting prep'], ['send', 'Routing']];
  const AG_Y = i => 330 + i * 92;
  const MEM = [['sparkles', 'Claude reads, extracts, summarises'], ['gauge', 'Rules rank urgency x impact'], ['brain', 'Memory: your style, your clients']];
  const GX0 = 446, GX1 = 734, AX0 = 1176, AX1 = 1494, VX = 1556;
  const bz = (p, u) => { const v = 1 - u; return v * v * v * p[0] + 3 * v * v * u * p[1] + 3 * v * u * u * p[2] + u * u * u * p[3]; };
  scene({
    id: 'how', t0: SH.how[0], t1: SH.how[1], cls: 'v4', fin: 0,
    css: `
    #sc-how svg.hln{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
    #sc-how .kk{left:96px;top:56px}
    #sc-how .hh{position:absolute;top:140px;width:340px;margin-left:-170px;text-align:center}
    #sc-how .hh .n{font:600 20px Plex,monospace;letter-spacing:.3em;color:${K.or}}
    #sc-how .hh .t{margin-top:10px;font-family:InterTight;font-weight:800;font-size:40px;letter-spacing:-.03em;color:#fff;white-space:nowrap}
    #sc-how .src{position:absolute;left:96px;height:64px;margin-top:-32px;display:flex;align-items:center;gap:18px}
    #sc-how .src .tile{position:relative;margin:0}
    #sc-how .src .tile-name{display:none}
    #sc-how .src b{font-size:28px;font-weight:600;color:#E9ECF0;letter-spacing:-.01em;white-space:nowrap}
    #sc-how .grp{position:absolute;left:${GX0}px;top:404px;width:${GX1 - GX0}px;height:318px;border-radius:24px;border:1.5px dashed rgba(255,140,60,.4);background:rgba(255,255,255,.03)}
    #sc-how .cn{position:absolute;left:${GX0 + 18}px;width:${GX1 - GX0 - 36}px;height:126px;padding:20px 18px;border-radius:18px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14)}
    #sc-how .cn .ci{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:#2B3A4D;color:${K.or};flex:none}
    #sc-how .cn .cr{display:flex;align-items:center;gap:14px;margin-bottom:8px}
    #sc-how .cn b{display:block;font-size:30px;font-weight:650;color:#fff;white-space:nowrap}
    #sc-how .cn span{font-size:28px;color:${K.cob};white-space:nowrap}
    #sc-how .core{position:absolute;left:${960 - 95}px;top:${OY4 - 95}px;width:190px;height:190px}
    #sc-how .halo{position:absolute;left:${960 - 260}px;top:${OY4 - 260}px;width:520px;height:520px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,110,20,.42),rgba(255,98,0,.12) 55%,rgba(255,98,0,0))}
    #sc-how .mem{position:absolute;left:760px;width:400px;text-align:center}
    #sc-how .mem div{display:inline-flex;gap:10px;align-items:center;height:46px;padding:0 18px;border-radius:999px;background:rgba(255,98,0,.12);border:1.5px solid rgba(255,98,0,.45);color:#fff;font-size:22px;font-weight:600;white-space:nowrap}
    #sc-how .mem .ic{color:${K.or}}
    #sc-how .ag{position:absolute;left:${AX0}px;width:${AX1 - AX0}px;height:66px;margin-top:-33px;display:flex;align-items:center;gap:14px;padding:0 18px 0 11px;border-radius:18px;
      background:rgba(255,255,255,.06);border:1.5px solid rgba(255,98,0,.38);color:#fff;font-size:27px;font-weight:600;white-space:nowrap}
    #sc-how .ag .oi{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(160deg,#FF9A3D,${K.or});color:#fff;flex:none}
    #sc-how .ap{position:absolute;left:${VX}px;top:${OY4 - 110}px;width:300px;height:220px;padding:26px 24px;border-radius:24px;background:linear-gradient(160deg,rgba(93,211,158,.16),rgba(93,211,158,.05));border:1.5px solid rgba(93,211,158,.55)}
    #sc-how .ap .ai{width:54px;height:54px;border-radius:15px;display:grid;place-items:center;background:#1F8A5B;color:#fff;margin-bottom:16px}
    #sc-how .ap b{display:block;font-size:30px;font-weight:700;color:#fff;line-height:1.2;letter-spacing:-.02em}
    #sc-how .pt{position:absolute;left:0;top:0;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:#FFC08A;box-shadow:0 0 12px 4px rgba(255,110,30,.75)}`,
    build(el, s) {
      el.innerHTML = `<div class="halo"></div><svg class="hln"></svg><div class="v4k kk">How it works</div>
        ${HEAD.map((h, i) => `<div class="hh" style="left:${COLX[i]}px"><div class="n">0${i + 1}</div><div class="t">${h}</div></div>`).join('')}
        ${SRC.map((src, i) => `<div class="src" style="top:${SRC_Y(i)}px">${J.tile(src, 60)}<b>${src.name}</b></div>`).join('')}
        <div class="grp"></div>
        <div class="cn" style="top:424px"><div class="cr"><div class="ci">${ic('refresh-cw', 22)}</div><b>Synced</b></div><span>every 15 minutes</span></div>
        <div class="cn" style="top:576px"><div class="cr"><div class="ci">${ic('cpu', 22)}</div><b>Built on Aki</b></div><span>in the background</span></div>
        <div class="pts"></div><div class="core">${J.jarvisLogo(190)}</div>
        ${MEM.map((m, i) => `<div class="mem" style="top:${700 + i * 58}px"><div>${ic(m[0], 20)}${m[1]}</div></div>`).join('')}
        ${AG.map((a, i) => `<div class="ag" style="top:${AG_Y(i)}px"><div class="oi">${ic(a[0], 22)}</div>${a[1]}</div>`).join('')}
        <div class="ap"><div class="ai">${ic('shield-check', 28)}</div><b>Nothing is sent<br><span class="o">without you.</span></b></div>`;
      s.kk = $('.kk', el); s.hh = $$('.hh', el); s.src = $$('.src', el); s.grp = $('.grp', el); s.cn = $$('.cn', el);
      s.core = $('.core', el); s.halo = $('.halo', el); s.mem = $$('.mem', el); s.ag = $$('.ag', el); s.ap = $('.ap', el);
      const svg = $('svg.hln', el), pts = $('.pts', el);
      const mk = (x, y, stroke, n) => {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', `M${x[0]},${y[0]} C${x[1]},${y[1]} ${x[2]},${y[2]} ${x[3]},${y[3]}`);
        p.setAttribute('fill', 'none'); p.setAttribute('stroke', stroke); p.setAttribute('stroke-width', '2'); svg.appendChild(p);
        const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        return { p, len, x, y, ps: Array.from({ length: n }, () => { const d = J.h('<div class="pt"></div>'); pts.appendChild(d); return d; }) };
      };
      s.l1 = SRC.map((_, i) => mk([360, 410, 400, GX0], [SRC_Y(i), SRC_Y(i), 563, 563], 'rgba(255,140,60,.36)', 2));
      s.l2 = [mk([GX1, 790, 820, 865], [563, 563, OY4, OY4], 'rgba(255,140,60,.6)', 4)];
      s.l3 = AG.map((_, i) => mk([1055, 1110, 1120, AX0], [OY4, OY4, AG_Y(i), AG_Y(i)], 'rgba(255,140,60,.5)', 2));
      s.l4 = AG.map((_, i) => mk([AX1, 1520, 1520, VX], [AG_Y(i), AG_Y(i), OY4, OY4], 'rgba(93,211,158,.45)', 1));
      SRC.forEach((_, i) => cue('pop', s.t0 + 0.35 + i * 0.1, { v: 0.35 }));
      cue('pop', s.t0 + 1.45, { v: 0.5 }); cue('pop', s.t0 + 1.6, { v: 0.5 }); cue('data', s.t0 + 1.2, { d: 7.6 });
      cue('hit', s.t0 + 2.3, { v: 0.4 }); MEM.forEach((_, i) => cue('tick', s.t0 + 2.4 + i * 0.2, { v: 0.5 }));
      AG.forEach((_, i) => cue('pop', s.t0 + 3.4 + i * 0.15, { v: 0.45 }));
      cue('lock', s.t0 + 4.8); cue('success', s.t0 + 5.0, { v: 0.5 });
    },
    update(lt, dur, s, t) {
      vis(s.kk, lt, 0.1, Infinity, { dy: 12, blur: 6 });
      s.hh.forEach((h, i) => vis(h, lt, [0.2, 1.2, 2.0, 3.2, 4.6][i], Infinity, { dy: 20, blur: 8 }));
      s.src.forEach((el, i) => vis(el, lt, 0.35 + i * 0.1, Infinity, { dx: -40, dy: 0, blur: 8, din: 0.7 }));
      vis(s.grp, lt, 1.25, Infinity, { dy: 0, ds: -0.04, blur: 6 });
      s.cn.forEach((el, i) => vis(el, lt, 1.45 + i * 0.15, Infinity, { dy: 18, blur: 8 }));
      const flow = (arr, draw, start, sp, out) => arr.forEach((o, i) => {
        const d = P(lt, draw + i * 0.06, 0.6, E.ioC);
        o.p.style.strokeDashoffset = (o.len * (1 - d)).toFixed(1);
        o.ps.forEach((pt, j) => {
          if (lt < start) { pt.style.opacity = 0; return; }
          const ph = ((lt - start) * sp + j / o.ps.length + i * 0.13) % 1;
          const u = out ? E.outQ(ph) : E.inQ(ph);
          pt.style.transform = `translate(${bz(o.x, u).toFixed(1)}px,${bz(o.y, u).toFixed(1)}px)`;
          pt.style.opacity = (Math.sin(Math.PI * ph) * P(lt, start, 0.5)).toFixed(3);
        });
      });
      flow(s.l1, 0.8, 1.2, 0.55, false);
      flow(s.l2, 1.9, 2.2, 0.6, false);
      flow(s.l3, 3.3, 3.8, 0.5, true);
      flow(s.l4, 4.7, 5.2, 0.5, false);
      // le logo JARVIS au centre : il s'allume quand les données arrivent
      const kick = lt > 2.3 ? Math.exp(-(lt - 2.3) * 3) : 0;
      tf(s.core, { s: (0.6 + 0.4 * P(lt, 1.9, 0.6, E.outB)) * (1 + 0.1 * kick + 0.02 * Math.sin(t * 3)), o: P(lt, 1.9, 0.3) });
      tf(s.halo, { o: P(lt, 2.0, 0.8) * (0.75 + 0.25 * Math.sin(t * 2.2)) + 0.3 * kick, s: 0.85 + 0.15 * P(lt, 2.0, 1.5) });
      s.mem.forEach((el, i) => vis(el, lt, 2.4 + i * 0.2, Infinity, { dy: 14, blur: 6 }));
      s.ag.forEach((el, i) => {
        const a = 3.4 + i * 0.15;
        vis(el, lt, a, Infinity, { dx: 30, dy: 0, blur: 8, ds: -0.06, din: 0.6, ein: E.outB });
        const g = P(lt, a, 0.3) * (1 - P(lt, a + 0.3, 0.9));
        el.style.boxShadow = g > 0.01 ? `0 0 0 ${(4 * g).toFixed(1)}px rgba(255,98,0,.25), 0 0 ${(40 * g).toFixed(0)}px rgba(255,98,0,${(0.35 * g).toFixed(2)})` : 'none';
      });
      vis(s.ap, lt, 4.8, Infinity, { dy: 0, dx: 30, ds: -0.08, blur: 8, ein: E.outB, din: 0.7 });
    },
  });
})();
