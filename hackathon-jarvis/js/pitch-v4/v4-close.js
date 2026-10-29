/* Film d'intro v4 — plans 9 à 12 : impact, monde entier, plus juste chaque jour, relais vers la démo
   + compteur commun et repères de la musique */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, tf, vis, splitWords, revealWords, ic, $, $$, scene, clamp, lerp, cue, count, rng } = J;
  const K = J.K4, SH = J.SH;
  const HOURS = C.NB_PSC_EU * C.HOURS_SAVED_PER_WEEK * C.WEEKS_PER_YEAR;
  window.IMPACT = { HOURS };
  const fmt = n => new Intl.NumberFormat('en-US').format(n);
  const PERSON = '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.2" fill="currentColor"/><path d="M3.5 21c.6-4.6 4.1-7.4 8.5-7.4s7.9 2.8 8.5 7.4z" fill="currentColor"/></svg>';

  // ---------------------------------------------------------------- plan 9 · 1:06 impact : une journée par semaine rendue à nos clients
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], DW = 250, DX = i => 960 + (i - 2) * (DW + 24);
  const FRI = 1.9;
  scene({
    id: 'impact', t0: SH.impact[0], t1: SH.impact[1], cls: 'v4', fin: 0,
    css: `
    #sc-impact .hd{left:0;right:0;top:100px;text-align:center;font-size:110px}
    #sc-impact .es{left:0;right:0;top:232px;text-align:center;font-size:28px}
    #sc-impact .dy{position:absolute;top:310px;width:${DW}px;height:140px;margin-left:-${DW / 2}px;border-radius:18px;background:#222B37;border:1.5px solid rgba(163,170,181,.2);padding:18px 22px}
    #sc-impact .dy b{display:block;font-family:InterTight;font-weight:800;font-size:40px;letter-spacing:-.02em;color:#fff}
    #sc-impact .dy span{display:flex;align-items:center;gap:8px;margin-top:12px;font:600 22px InterV;color:${K.cob};white-space:nowrap}
    #sc-impact .dy.on{background:${K.or};border-color:${K.or};box-shadow:0 0 60px rgba(255,98,0,.45)}
    #sc-impact .dy.on b,#sc-impact .dy.on span{color:${K.ink}}
    #sc-impact .l1{left:0;right:0;top:500px;text-align:center;font-size:52px}
    #sc-impact .pl{position:absolute;left:0;right:0;top:600px;display:flex;justify-content:center;gap:18px}
    #sc-impact .pl span{height:58px;border-radius:29px;padding:0 24px;display:flex;align-items:center;gap:10px;border:1.5px solid rgba(255,98,0,.55);background:rgba(255,98,0,.1);font:650 26px InterV;color:#fff}
    #sc-impact .pl .ic{color:${K.or}}
    #sc-impact .hr{left:0;right:0;top:705px;text-align:center;font-size:40px;color:#fff}
    #sc-impact .hr b{font-family:InterTight;font-weight:800;font-size:60px;letter-spacing:-.03em;color:#fff;font-variant-numeric:tabular-nums}
    #sc-impact .ob{left:0;right:0;top:810px;text-align:center;font-size:88px}
    #sc-impact .fn{left:0;right:0;top:1010px;text-align:center;font-size:22px}`,
    build(el, s) {
      el.innerHTML = `<div class="v4h hd">8h back, <span class="o">every week.</span></div><div class="v4s es">estimated, per PSC</div>
        ${DAYS.map((d, i) => `<div class="dy" style="left:${DX(i)}px"><b>${d}</b><span class="a">${ic('layers', 20)}In the tools</span><span class="b" style="display:none">${ic('users', 20)}With our clients</span></div>`).join('')}
        <div class="v4h l1">One day a week, <span class="o">back with our clients.</span></div>
        <div class="pl"><span>${ic('users', 24)}Client meetings</span><span>${ic('search', 24)}Deep dives</span><span>${ic('target', 24)}Proactive recommendations</span></div>
        <div class="v4s hr"><b class="hy">0</b> hours a year across ${C.NB_PSC_EU} PSCs, for our clients</div>
        <div class="v4h ob">Even more <span class="o">customer obsessed.</span></div>
        <div class="v4s fn">Estimated: ${C.HOURS_SAVED_PER_WEEK} h per PSC per week, ${C.WEEKS_PER_YEAR} working weeks.</div>`;
      s.hd = splitWords($('.hd', el)); s.es = $('.es', el); s.dy = $$('.dy', el); s.l1 = $('.l1', el); s.pl = $$('.pl span', el);
      s.hr = $('.hr', el); s.hy = $('.hy', el); s.ob = splitWords($('.ob', el)); s.fn = $('.fn', el);
      s.fa = $('.dy:last-of-type .a', el); s.fb2 = s.dy[4].querySelector('.b'); s.fa = s.dy[4].querySelector('.a');
      cue('darken', s.t0); cue('hit', s.t0 + 0.2, { v: 0.6 });
      DAYS.forEach((_, i) => cue('tick', s.t0 + 1.1 + i * 0.1, { v: 0.6 }));
      cue('hit', s.t0 + FRI, { v: 0.55 }); cue('success', s.t0 + FRI + 0.1, { v: 0.5 });
      s.pl.forEach((_, i) => cue('pop', s.t0 + 3.6 + i * 0.18, { v: 0.5 }));
      cue('count', s.t0 + 4.6, { d: 1.2 }); cue('hit', s.t0 + 5.9, { v: 0.6 });
    },
    update(lt, dur, s) {
      revealWords(s.hd, lt, 0.1, { st: 0.12, dy: 50, d: 0.7 });
      vis(s.es, lt, 0.7, Infinity, { dy: 10, blur: 4 });
      // la semaine : le vendredi passe de « dans les outils » à « avec nos clients »
      s.dy.forEach((d, i) => vis(d, lt, 1.1 + i * 0.1, Infinity, { dy: 30, blur: 6, din: 0.6 }));
      const on = lt >= FRI;
      s.dy[4].classList.toggle('on', on);
      s.fa.style.display = on ? 'none' : ''; s.fb2.style.display = on ? '' : 'none';
      const kick = on ? Math.exp(-(lt - FRI) * 4) : 0;
      tf(s.dy[4], { s: 1 + 0.08 * kick, o: P(lt, 1.5, 0.3) });
      vis(s.l1, lt, FRI + 0.3, Infinity, { dy: 20, blur: 8 });
      s.pl.forEach((p, i) => vis(p, lt, 3.6 + i * 0.18, Infinity, { dy: 16, ds: -0.15, ein: E.outB, blur: 4, din: 0.5 }));
      vis(s.hr, lt, 4.5, Infinity, { dy: 14, blur: 6 });
      count(s.hy, lt, 4.6, 1.2, 0, HOURS);
      revealWords(s.ob, lt, 5.9, { st: 0.12, dy: 40, d: 0.6 });
      vis(s.fn, lt, 1.0, Infinity, { dy: 8, blur: 4 });
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
  const RL = [0.5, 1.0, 1.5], BADGE = 3.0;
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

  // ---------------------------------------------------------------- plan 11 · 1:18 plus juste chaque jour : le logo JARVIS monte en puissance
  const INS = [['mail', '#2F6FDE', 'Every email you send'], ['file-text', '#16947E', 'Every document you create'], ['chart-column', K.or, 'Every campaign result'], ['circle-check', '#5D6B7C', 'Every correction you make']];
  const RC = { x: 1500, y: 540 }, IY = i => 400 + i * 112;
  const SEGR = 168, NSEG = 12, SEGL = 2 * Math.PI * SEGR / NSEG;
  scene({
    id: 'sharper', t0: SH.sharper[0], t1: SH.sharper[1], cls: 'v4', fin: 0,
    css: `
    #sc-sharper .kk{left:120px;top:110px}
    #sc-sharper .hd{left:120px;top:150px;font-size:110px}
    #sc-sharper .cp{left:124px;top:290px;font-size:28px}
    #sc-sharper .in{position:absolute;left:120px;display:flex;gap:18px;align-items:center;margin-top:-30px}
    #sc-sharper .in .ii{width:60px;height:60px;border-radius:16px;display:grid;place-items:center;color:#fff;flex:none;box-shadow:0 12px 30px rgba(0,0,0,.35)}
    #sc-sharper .in b{font-size:34px;color:#fff;font-weight:650;letter-spacing:-.02em;white-space:nowrap}
    #sc-sharper .glow{position:absolute;left:${RC.x - 450}px;top:${RC.y - 450}px;width:900px;height:900px;border-radius:50%;
      background:radial-gradient(closest-side,rgba(255,170,90,.75),rgba(255,98,0,.35) 30%,rgba(255,98,0,.08) 60%,rgba(255,98,0,0))}
    #sc-sharper svg.rx{position:absolute;left:${RC.x - 260}px;top:${RC.y - 260}px;width:520px;height:520px;overflow:visible}
    #sc-sharper .core{position:absolute;left:${RC.x - 100}px;top:${RC.y - 100}px;width:200px;height:200px}
    #sc-sharper .pk{position:absolute;left:0;top:0;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:7px;display:grid;place-items:center;color:#fff}
    #sc-sharper .days{position:absolute;left:120px;top:930px;width:1680px}
    #sc-sharper .days .bar{position:relative;height:4px;border-radius:3px;background:rgba(255,255,255,.12);margin:0 200px}
    #sc-sharper .days .bar i{position:absolute;left:0;top:0;bottom:0;width:100%;border-radius:3px;background:linear-gradient(90deg,${K.or},#FFB066);transform-origin:0 50%}
    #sc-sharper .days .bar b{position:absolute;top:-7px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:#FFB066;box-shadow:0 0 14px rgba(255,98,0,.8)}
    #sc-sharper .days span{position:absolute;top:-16px;font:600 28px Plex,monospace;letter-spacing:.12em;text-transform:uppercase;color:#C9D1DB}
    #sc-sharper .days .d1{left:0}#sc-sharper .days .d2{right:0}`,
    build(el, s) {
      el.innerHTML = `<div class="v4k kk">Always learning</div><div class="v4h hd">Sharper <span class="o">every day.</span></div>
        <div class="v4s cp">It learns from every email, correction and campaign result.</div>
        ${INS.map((n, i) => `<div class="in" style="top:${IY(i)}px"><div class="ii" style="background:${n[1]}">${ic(n[0], 28)}</div><b>${n[2]}</b></div>`).join('')}
        <div class="glow"></div>
        <svg class="rx" viewBox="-260 -260 520 520">
          <g class="r1"><circle r="238" fill="none" stroke="${K.or}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/></g>
          <circle r="212" fill="none" stroke="rgba(255,176,102,.35)" stroke-width="1.5"/>
          <g class="r2"><circle class="seg" r="${SEGR}" fill="none" stroke="${K.or}" stroke-width="24" stroke-dasharray="${(SEGL - 9).toFixed(2)} 9"/></g>
          <circle class="ring" r="128" fill="none" stroke="#FFD1A6" stroke-width="3"/></svg>
        <div class="core">${J.jarvisLogo(200)}</div>
        <div class="pks"></div><div class="days"><span class="d1">day 1</span><span class="d2">day 90</span><div class="bar"><i></i><b></b></div></div>`;
      s.kk = $('.kk', el); s.hd = splitWords($('.hd', el)); s.cp = $('.cp', el); s.ins = $$('.in', el);
      s.glow = $('.glow', el); s.r1 = $('.r1', el); s.r2 = $('.r2', el); s.seg = $('.seg', el); s.ring = $('.ring', el); s.rx = $('svg.rx', el); s.core = $('.core', el);
      s.bar = $('.days .bar i', el); s.dot = $('.days .bar b', el); s.days = $('.days', el);
      const pks = $('.pks', el), rr = rng(9);
      s.pk = [];
      INS.forEach((n, si) => { for (let j = 0; j < 3; j++) { const d = J.h(`<div class="pk" style="background:${n[1]}">${ic(n[0], 15)}</div>`); pks.appendChild(d); s.pk.push({ el: d, y0: IY(si), ph: j / 3 + rr() * 0.08, sp: 0.75 + rr() * 0.1 }); } });
      INS.forEach((_, i) => cue('pop', s.t0 + 0.5 + i * 0.15, { v: 0.4 })); cue('data', s.t0 + 0.9, { d: 4.0 }); cue('riser', s.t0 + 1.0, { d: 4.0 }); cue('sparkle', s.t0 + 4.4);
    },
    update(lt, dur, s, t) {
      vis(s.kk, lt, 0.05, Infinity, { dy: 14, blur: 6 }); revealWords(s.hd, lt, 0.12, { st: 0.08, dy: 40 });
      vis(s.cp, lt, 0.7, Infinity, { dy: 10, blur: 4 });
      s.ins.forEach((el, i) => vis(el, lt, 0.5 + i * 0.15, Infinity, { dx: -30, dy: 0, blur: 8 }));
      // chaque donnée apprise nourrit le réacteur
      let kick = 0;
      for (const p of s.pk) {
        if (lt < 0.9) { p.el.style.opacity = 0; continue; }
        const ph = ((lt - 0.9) * p.sp + p.ph) % 1;
        const u = E.inQ(ph), v = 1 - u, x0 = 720, y0 = p.y0, cx = 1100, cy = (p.y0 + RC.y) / 2;
        p.el.style.transform = `translate(${(v * v * x0 + 2 * v * u * cx + u * u * RC.x).toFixed(1)}px,${(v * v * y0 + 2 * v * u * cy + u * u * RC.y).toFixed(1)}px) scale(${(1 - 0.6 * u).toFixed(3)})`;
        p.el.style.opacity = (P(lt, 0.9, 0.4) * Math.min(1, ph * 6) * (1 - P(ph, 0.85, 0.15, E.lin))).toFixed(3);
        if (ph > 0.9) kick = Math.max(kick, 1 - (ph - 0.9) / 0.1);
      }
      // la puissance monte : halo, anneaux qui accélèrent, segments qui s'allument
      const g = P(lt, 0.6, 4.4, E.ioC);
      const flick = 0.04 * Math.sin(t * 23) + 0.03 * Math.sin(t * 37);
      tf(s.glow, { o: Math.min(1, 0.25 + 0.75 * g + 0.15 * kick + flick), s: 0.6 + 0.6 * g + 0.05 * kick });
      s.r1.setAttribute('transform', `rotate(${(lt * (25 + 140 * g)).toFixed(2)})`);
      s.r2.setAttribute('transform', `rotate(${(-lt * (15 + 90 * g)).toFixed(2)})`);
      s.seg.setAttribute('stroke-opacity', (0.25 + 0.75 * g).toFixed(3));
      s.ring.setAttribute('stroke-opacity', (0.3 + 0.7 * g + 0.2 * kick).toFixed(3));
      s.rx.style.filter = `drop-shadow(0 0 ${(6 + 30 * g).toFixed(1)}px rgba(255,120,30,${(0.4 + 0.5 * g).toFixed(2)}))`;
      tf(s.rx, { o: P(lt, 0.2, 0.5), s: 0.85 + 0.15 * P(lt, 0.2, 0.8, E.outB) });
      tf(s.core, { s: (0.8 + 0.2 * P(lt, 0.2, 0.6, E.outB)) * (1 + 0.05 * kick + 0.06 * g), o: P(lt, 0.2, 0.3) });
      s.core.style.filter = `drop-shadow(0 0 ${(10 + 40 * g).toFixed(1)}px rgba(255,140,40,${(0.5 + 0.5 * g).toFixed(2)}))`;
      vis(s.days, lt, 0.8, Infinity, { dy: 14, blur: 6 });
      s.bar.style.transform = `scaleX(${g.toFixed(4)})`;
      s.dot.style.left = (100 * g).toFixed(2) + '%';
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
