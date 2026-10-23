/* Pitch 2:00 — acte 3 : le temps gagné, la confiance, la suite, la signature */
(function () {
  'use strict';
  const { E, P, tf, vis, count, rng, ic, $, $$, clamp, lerp, scene, cursor, moveCursor, cue, rel, orb, orbTick, SOURCES, tile, splitWords, revealWords } = J;
  const pop = (el, lt, a, o = {}) => vis(el, lt, a, o.b ?? Infinity, Object.assign({ dy: 18, blur: 8, din: 0.7 }, o));
  const NAVY_BG = 'radial-gradient(1400px 900px at 50% 52%,#1E2A3A 0%,#111923 58%,#0A0F16 100%)';
  const hm = m => (m % 60 ? `${Math.floor(m / 60)} h ${m % 60}` : `${m / 60} h`);

  // ---------------------------------------------------------------- 8 heures par semaine
  const G = Object.values(J.GAINS);
  const TOT = G.reduce((n, g) => n + g.week, 0);
  const RX = 1000, RW = 780, RY = i => 286 + i * 96, STY = 840;
  scene({
    id: 'total', t0: TL.total[0], t1: TL.total[1], cls: 'dark', fin: 0.6,
    css: `
    #sc-total{background:${NAVY_BG}}
    #sc-total .tk{position:absolute;left:140px;top:250px;font:600 18px Plex,monospace;letter-spacing:.24em;text-transform:uppercase;color:#FF9900}
    #sc-total .tn{position:absolute;left:128px;top:276px;display:flex;align-items:baseline;font-family:InterTight;font-weight:700;letter-spacing:-.06em;line-height:1}
    #sc-total .tn .v{font-size:330px;font-variant-numeric:tabular-nums}
    #sc-total .tn em{font-style:normal;font-size:150px;margin-left:12px;letter-spacing:-.03em}
    #sc-total .tl{position:absolute;left:140px;top:640px;font-weight:700;font-size:70px;letter-spacing:-.045em;color:#fff}
    #sc-total .td{position:absolute;left:140px;top:742px;font-size:34px;color:#98A1AC;letter-spacing:-.015em}
    #sc-total .td b{color:#fff;font-weight:650}
    #sc-total .rw{position:absolute;left:${RX}px;width:${RW}px;display:flex;justify-content:space-between;align-items:baseline;font-size:24px;color:#E9ECF0;font-weight:550}
    #sc-total .rw b{font:600 22px Plex,monospace;color:#FFB547}
    #sc-total .rw em{font-style:normal;color:#8C96A2;font-size:18px;margin-left:10px}
    #sc-total .tr{position:absolute;left:${RX}px;width:${RW}px;height:12px;border-radius:12px;background:rgba(255,255,255,.08)}
    #sc-total .sg{position:absolute;left:0;top:0;height:12px;border-radius:12px;background:linear-gradient(90deg,#FFB547,#FF9900)}
    #sc-total .sg:nth-of-type(even){background:linear-gradient(90deg,#FF8A1F,#F26B1D)}
    #sc-total .sl{position:absolute;left:${RX}px;top:${STY + 30}px;width:${RW}px;display:flex;justify-content:space-between;font:600 20px Plex,monospace;letter-spacing:.12em;text-transform:uppercase;color:#C9D1DB}
    #sc-total .sl b{color:#FF9900}`,
    build(el, s) {
      el.innerHTML = `<div class="tk">Time back · per PSC · estimated</div>
        <div class="tn"><span class="v grad">0</span><em class="grad">h</em></div>
        <div class="tl">back, <span class="hl">every week.</span></div>
        <div class="td">That's <b>one working day</b>, every week.</div>
        ${G.map((g, i) => `<div class="rw" style="top:${RY(i)}px"><span>${g.task}<em>${g.before} → ${g.after}</em></span><b>${hm(g.week)}</b></div><div class="tr" style="top:${RY(i) + 44}px"></div>`).join('')}
        <div class="sgs">${G.map(() => '<div class="sg"></div>').join('')}</div>
        <div class="sl"><span>= ${TOT / 60} hours a week</span><b>≈ 1 working day</b></div>`;
      s.tk = $('.tk', el); s.v = $('.tn .v', el); s.tn = $('.tn', el); s.tl = $('.tl', el); s.tlw = splitWords(s.tl); s.td = $('.td', el);
      s.rw = $$('.rw', el); s.tr = $$('.tr', el); s.sg = $$('.sg', el); s.sl = $('.sl', el);
      cue('darken', s.t0 + 0.2); cue('count', s.t0 + 0.4, { d: 1.8 }); cue('hit', s.t0 + 2.2, { v: 0.5 });
      G.forEach((_, i) => cue('pop', s.t0 + 0.9 + i * 0.22, { v: 0.4 }));
      cue('whoosh', s.t0 + 3.5, { v: 0.6 }); cue('hit', s.t0 + 4.4, { v: 0.6 }); cue('success', s.t0 + 4.5, { v: 0.6 });
    },
    update(lt, dur, s) {
      vis(s.tk, lt, 0.2, Infinity, { dy: 12, blur: 6 });
      vis(s.tn, lt, 0.3, Infinity, { dy: 40, blur: 20, ds: 0.08, din: 1.0 });
      count(s.v, lt, 0.4, 1.8, 0, TOT / 60);
      revealWords(s.tlw, lt, 1.9, { st: 0.1, dy: 40 });
      vis(s.td, lt, 2.6, Infinity, { dy: 16, blur: 8 });
      // le détail, puis les cinq gains se rangent bout à bout : une journée
      const merge = P(lt, 3.5, 1.0, E.ioC);
      let acc = 0;
      G.forEach((g, i) => {
        const a = 0.9 + i * 0.22;
        vis(s.rw[i], lt, a, Infinity, { dx: 30, dy: 0, blur: 8, op: 1 - 0.55 * merge });
        tf(s.tr[i], { o: P(lt, a, 0.4) * (1 - merge) });
        const w0 = RW * g.week / 120 * P(lt, a + 0.2, 0.7, E.outQu), w1 = RW * g.week / TOT;
        const x = lerp(RX, RX + RW * acc / TOT, merge), y = lerp(RY(i) + 44, STY, merge);
        s.sg[i].style.left = x.toFixed(1) + 'px'; s.sg[i].style.top = y.toFixed(1) + 'px';
        s.sg[i].style.width = Math.max(0, lerp(w0, w1 - 3, merge)).toFixed(1) + 'px';
        s.sg[i].style.opacity = P(lt, a + 0.2, 0.2).toFixed(3);
        acc += g.week;
      });
      vis(s.sl, lt, 4.4, Infinity, { dy: 12, blur: 6 });
      const q = P(lt, dur - 0.5, 0.5, E.inC);
      s.el.style.opacity = Math.min(P(lt, 0, 0.6), 1 - q).toFixed(4);
    },
  });

  // ---------------------------------------------------------------- confiance + apprentissage
  const INS = [['mail', '#2F6FDE', 'Every email', 'you send'], ['file-text', '#16947E', 'Every document', 'you create'], ['chart-column', '#F7930F', 'Every campaign', 'result']];
  const LO = { x: 1640, y: 600 }, IY = i => 470 + i * 120;
  scene({
    id: 'trust', t0: TL.trust[0], t1: TL.trust[1], cls: 'dark',
    css: `
    #sc-trust{background:${NAVY_BG}}
    #sc-trust .hb{position:absolute;top:130px}
    #sc-trust .hb .kicker{margin-bottom:22px}
    #sc-trust .hb .head{font-size:74px}
    #sc-trust .dv{position:absolute;left:960px;top:140px;width:1px;height:800px;background:linear-gradient(transparent,rgba(255,255,255,.18) 20%,rgba(255,255,255,.18) 80%,transparent);transform-origin:50% 0}
    #sc-trust .ol{position:absolute;left:120px;top:440px;width:740px;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 50px 120px -30px rgba(0,0,0,.8)}
    #sc-trust .ol-bar{height:44px;background:#EEF1F5;display:flex;align-items:center;gap:8px;padding:0 18px;border-bottom:1px solid #DDE2E8}
    #sc-trust .ol-bar i{width:12px;height:12px;border-radius:50%}
    #sc-trust .ol-bar span{margin-left:12px;font-weight:650;font-size:15px;color:#2F6FDE;display:flex;gap:8px;align-items:center}
    #sc-trust .ol-m{padding:18px 24px 22px}
    #sc-trust .ol-a{display:flex;gap:12px;align-items:center;padding-bottom:14px;border-bottom:1px solid #EEF0F3}
    #sc-trust .send{display:inline-flex;gap:8px;align-items:center;height:42px;padding:0 20px;border-radius:9px;background:#2F6FDE;color:#fff;font-weight:650;font-size:16px}
    #sc-trust .by{margin-left:auto;display:inline-flex;gap:7px;align-items:center;font-size:14.5px;color:var(--or);font-weight:600}
    #sc-trust .ol-f{font-size:16px;color:#2B3138;padding:9px 0;border-bottom:1px solid #EEF0F3}
    #sc-trust .ol-f span{display:inline-block;width:80px;color:#6C7279}
    #sc-trust .ol-t{font-size:17.5px;line-height:1.6;color:#14181D;padding-top:14px}
    #sc-trust .lock{position:absolute;left:500px;top:386px;display:flex;gap:10px;align-items:center;height:56px;padding:0 24px;border-radius:999px;background:rgba(20,24,29,.95);border:1px solid rgba(255,255,255,.2);color:#fff;font-weight:650;font-size:19px;box-shadow:0 20px 60px rgba(0,0,0,.5);z-index:5}
    #sc-trust .lock .ic{color:#5DD39E}
    #sc-trust .sent{position:absolute;left:330px;top:770px;display:flex;gap:10px;align-items:center;height:52px;padding:0 22px;border-radius:999px;background:#fff;color:#14181D;font-weight:650;font-size:17px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
    #sc-trust .sent .ic{color:var(--grn)}
    #sc-trust .in{position:absolute;left:1040px;width:280px;display:flex;gap:14px;align-items:center;margin-top:-28px}
    #sc-trust .in .ii{width:56px;height:56px;border-radius:15px;display:grid;place-items:center;color:#fff;flex:none;box-shadow:0 12px 30px rgba(0,0,0,.35)}
    #sc-trust .in b{display:block;font-size:21px;color:#fff;font-weight:650}
    #sc-trust .in span{font-size:16px;color:#98A1AC}
    #sc-trust .ow{position:absolute;left:${LO.x}px;top:${LO.y}px}
    #sc-trust svg.lp{position:absolute;left:${LO.x - 170}px;top:${LO.y - 170}px;width:340px;height:340px;overflow:visible}
    #sc-trust .pk{position:absolute;left:0;top:0;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:7px;display:grid;place-items:center;color:#fff}
    #sc-trust .days{position:absolute;left:1040px;top:880px;width:760px}
    #sc-trust .days .bar{position:relative;height:3px;border-radius:3px;background:rgba(255,255,255,.12);margin:0 80px}
    #sc-trust .days .bar i{position:absolute;left:0;top:0;bottom:0;width:100%;border-radius:3px;background:linear-gradient(90deg,#FF9900,#FFC266);transform-origin:0 50%}
    #sc-trust .days .bar b{position:absolute;top:-6px;width:15px;height:15px;margin-left:-7px;border-radius:50%;background:#FFC266;box-shadow:0 0 14px rgba(255,153,0,.8)}
    #sc-trust .days span{position:absolute;top:-9px;font:500 15px Plex,monospace;letter-spacing:.12em;text-transform:uppercase;color:#8C96A2}
    #sc-trust .days .d1{left:0}#sc-trust .days .d2{right:0}`,
    build(el, s) {
      const r196 = 150;
      el.innerHTML = `<div class="hb h1" style="left:120px"><div class="kicker"><i></i>Trust</div><div class="head">You stay<br><span class="hl">in control.</span></div></div>
        <div class="ol"><div class="ol-bar"><i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i><span>${ic('mail', 16)}Outlook · Drafts</span></div>
          <div class="ol-m"><div class="ol-a"><span class="send">${ic('send', 16)}Send</span><span class="chip amb mono st">draft</span><span class="by">${ic('sparkles', 15)}Drafted by Kiro · in your voice</span></div>
            <div class="ol-f"><span>To</span>Annemarie Kalinka (Amnetgroup)</div><div class="ol-f"><span>Subject</span>RE: BFM · SVOD delivery</div>
            <div class="ol-t">Hello Annemarie,<br>Quick update on BFM: SVOD is at 2.3% delivered for 29% of the flight…</div></div></div>
        <div class="lock">${ic('shield-check', 22)}Never sent automatically</div>
        <div class="sent">${ic('circle-check', 20)}Sent by you · 10:42</div>
        <div class="dv"></div>
        <div class="hb h2" style="left:1040px"><div class="kicker"><i></i>Always learning</div><div class="head">Sharper<br><span class="hl">every day.</span></div></div>
        <svg class="lp" viewBox="-170 -170 340 340"><circle r="${r196}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="2"/>
          <g class="arc"><path d="M ${r196} 0 A ${r196} ${r196} 0 1 1 ${(r196 * Math.cos(5.6)).toFixed(1)} ${(r196 * Math.sin(5.6)).toFixed(1)}" fill="none" stroke="#FF9900" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 10"/></g></svg>
        <div class="ow">${orb(170)}</div>
        ${INS.map((n, i) => `<div class="in" style="top:${IY(i)}px"><div class="ii" style="background:${n[1]}">${ic(n[0], 26)}</div><div><b>${n[2]}</b><span>${n[3]}</span></div></div>`).join('')}
        <div class="pks"></div>
        <div class="days"><span class="d1">day 1</span><span class="d2">day 90</span><div class="bar"><i></i><b></b></div></div>`;
      s.h1 = $('.h1', el); s.h2 = $('.h2', el); s.w1 = splitWords($('.h1 .head', el)); s.w2 = splitWords($('.h2 .head', el));
      s.k1 = $('.h1 .kicker', el); s.k2 = $('.h2 .kicker', el);
      s.ol = $('.ol', el); s.lock = $('.lock', el); s.send = $('.send', el); s.st = $('.st', el); s.sent = $('.sent', el); s.cur = cursor(el);
      s.dv = $('.dv', el); s.arc = $('.lp .arc', el); s.lp = $('.lp', el); s.orb = $('.ow .orb', el); s.ins = $$('.in', el);
      s.bar = $('.days .bar i', el); s.dot = $('.days .bar b', el); s.days = $('.days', el);
      const pks = $('.pks', el), r = rng(9);
      s.pk = [];
      INS.forEach((n, si) => { for (let j = 0; j < 4; j++) { const d = J.h(`<div class="pk" style="background:${n[1]}">${ic(n[0], 14)}</div>`); pks.appendChild(d); s.pk.push({ el: d, y0: IY(si), ph: j / 4 + r() * 0.08, sp: 0.5 + r() * 0.08 }); } });
      cue('darken', s.t0 + 0.1, { v: 0.6 }); cue('lock', s.t0 + 1.2); cue('click', s.t0 + 2.9); cue('success', s.t0 + 3.1, { v: 0.6 });
      INS.forEach((_, i) => cue('pop', s.t0 + 3.9 + i * 0.2, { v: 0.4 }));
      cue('data', s.t0 + 4.5, { d: 3.4 }); cue('sparkle', s.t0 + 6.4);
    },
    update(lt, dur, s, t) {
      // gauche : rien ne part sans toi
      vis(s.k1, lt, 0.1, Infinity, { dy: 14, blur: 6 }); revealWords(s.w1, lt, 0.2);
      vis(s.ol, lt, 0.5, Infinity, { dy: 50, blur: 14, din: 0.9, ein: E.outX });
      vis(s.lock, lt, 1.2, Infinity, { dy: 16, ds: -0.25, din: 0.6, ein: E.outB });
      if (!s.m) s.m = rel(s.send, s.el);
      moveCursor(s.cur, lt, [[1.8, 640, 900], [2.7, s.m.cx + 8, s.m.cy + 6]], [2.9], { hide: 4.2 });
      const sent = lt > 3.0;
      s.st.className = 'chip mono st ' + (sent ? 'grn' : 'amb'); s.st.textContent = sent ? 'sent by you' : 'draft';
      vis(s.sent, lt, 3.1, Infinity, { dy: 24, blur: 8, din: 0.6, ein: E.outB });
      // droite : il apprend de tout ce que tu fais
      tf(s.dv, { sy: P(lt, 3.4, 0.8, E.outQu), o: P(lt, 3.4, 0.3) });
      vis(s.k2, lt, 3.6, Infinity, { dy: 14, blur: 6 }); revealWords(s.w2, lt, 3.7);
      s.ins.forEach((el, i) => vis(el, lt, 3.9 + i * 0.2, Infinity, { dx: -30, dy: 0, blur: 8 }));
      const on = P(lt, 4.5, 0.6);
      let kick = 0;
      for (const p of s.pk) {
        if (lt < 4.5) { p.el.style.opacity = 0; continue; }
        const ph = ((lt - 4.5) * p.sp + p.ph) % 1;
        const u = E.inQ(ph), v = 1 - u, x0 = 1330, y0 = p.y0, cx = 1460, cy = (p.y0 + LO.y) / 2;
        p.el.style.transform = `translate(${(v * v * x0 + 2 * v * u * cx + u * u * LO.x).toFixed(1)}px,${(v * v * y0 + 2 * v * u * cy + u * u * LO.y).toFixed(1)}px) scale(${(1 - 0.6 * u).toFixed(3)})`;
        p.el.style.opacity = (on * Math.min(1, ph * 6) * (1 - P(ph, 0.85, 0.15, E.lin))).toFixed(3);
        if (ph > 0.9) kick = Math.max(kick, 1 - (ph - 0.9) / 0.1);
      }
      const growth = P(lt, 4.4, 3.6, E.ioC);
      const pulse = orbTick(s.orb, t, { glow: 0.7 + 0.8 * growth + 0.3 * kick });
      tf(s.orb, { s: pulse * (0.7 + 0.3 * P(lt, 3.8, 0.9, E.outB)) * (1 + 0.16 * growth + 0.04 * kick), o: P(lt, 3.8, 0.5) });
      s.arc.setAttribute('transform', `rotate(${(lt * 40).toFixed(2)})`);
      s.lp.style.opacity = P(lt, 4.0, 0.8).toFixed(3);
      vis(s.days, lt, 4.4, Infinity, { dy: 14, blur: 6 });
      s.bar.style.transform = `scaleX(${growth.toFixed(4)})`;
      s.dot.style.left = (100 * growth).toFixed(2) + '%';
    },
  });

  // ---------------------------------------------------------------- la suite : Salesforce, puis des cerveaux reliés
  const SF = { name: 'Salesforce', icon: 'cloud', c: '#0B9EDB' };
  const NC = { x: 1330, y: 540 };
  const RING = SOURCES.concat([SF]);
  const TEAM = ['PSC EU', 'Sales', 'Account managers', 'Ad Ops', 'Leadership'];
  scene({
    id: 'next', t0: TL.next[0], t1: TL.next[1], cls: 'dark',
    css: `
    #sc-next{background:${NAVY_BG}}
    #sc-next .copy{left:140px;width:620px}
    #sc-next .head{font-size:96px}
    #sc-next svg.ln{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
    #sc-next .ow{position:absolute;left:${NC.x}px;top:${NC.y}px}
    #sc-next .tile-name{font-size:16px}
    #sc-next .nx{position:absolute;font:600 13px Plex,monospace;letter-spacing:.14em;color:#fff;background:var(--or);border-radius:999px;padding:6px 11px}
    #sc-next .tm{position:absolute;left:0;top:0}
    #sc-next .tl{position:absolute;transform:translateX(-50%);white-space:nowrap;font:500 15px Plex,monospace;letter-spacing:.1em;text-transform:uppercase;color:#B6BEC8}`,
    build(el, s) {
      el.innerHTML = `<div class="copy"><div class="kicker"><i></i>What's next</div><div class="head">Next:<br><span class="hl">Salesforce.</span></div>
        <div class="sub">Then connected brains, sharing what they know, so the whole team moves together.</div></div>
        <svg class="ln"></svg><div class="tiles"></div><div class="team"></div><div class="ow">${orb(150)}</div>`;
      s.k = $('.kicker', el); s.hw = splitWords($('.head', el)); s.sub = $('.sub', el); s.orb = $('.ow .orb', el);
      const svg = $('svg.ln', el), tiles = $('.tiles', el), team = $('.team', el);
      const line = (x1, y1, x2, y2, c, w, dash) => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'line'); p.setAttribute('x1', x1); p.setAttribute('y1', y1); p.setAttribute('x2', x2); p.setAttribute('y2', y2); p.setAttribute('stroke', c); p.setAttribute('stroke-width', w); if (dash) p.setAttribute('stroke-dasharray', dash); svg.appendChild(p); return p; };
      s.tiles = RING.map((src, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / RING.length;
        const x = NC.x + Math.cos(a) * 250, y = NC.y + Math.sin(a) * 230;
        const t = J.h(tile(src, 74)); t.style.left = x + 'px'; t.style.top = y + 'px'; tiles.appendChild(t);
        const isSF = src === SF;
        return { el: t, x, y, isSF, i, ln: line(x, y, NC.x, NC.y, isSF ? 'rgba(80,190,240,.75)' : 'rgba(255,170,90,.35)', isSF ? 2.5 : 2, isSF ? '7 7' : '') };
      });
      const sf = s.tiles.find(o => o.isSF);
      s.nx = J.h('<div class="nx">NEXT</div>'); s.nx.style.left = sf.x + 30 + 'px'; s.nx.style.top = sf.y - 66 + 'px'; el.appendChild(s.nx);
      s.team = TEAM.map((name, i) => {
        const a = -Math.PI / 2 + Math.PI / 5 + i * 2 * Math.PI / TEAM.length;
        const x = NC.x + Math.cos(a) * 470, y = NC.y + Math.sin(a) * 400;
        const w = J.h(`<div class="tm" style="left:${x}px;top:${y}px">${orb(66)}</div>`); team.appendChild(w);
        const l = J.h(`<div class="tl" style="left:${x}px;top:${y + 50}px">${name}</div>`); team.appendChild(l);
        return { w, o: $('.orb', w), l, i, ln: line(NC.x, NC.y, x, y, 'rgba(255,170,90,.4)', 1.6, '3 6') };
      });
      cue('whoosh', s.t0 + 0.7, { v: 0.6 }); cue('hit', s.t0 + 1.2, { v: 0.4 }); cue('pop', s.t0 + 1.6);
      TEAM.forEach((_, i) => cue('node', s.t0 + 2.3 + i * 0.12, { v: 0.45, n: i }));
    },
    update(lt, dur, s, t) {
      vis(s.k, lt, 0.05, Infinity, { dy: 14, blur: 6 }); revealWords(s.hw, lt, 0.15); vis(s.sub, lt, 2.0, Infinity, { dy: 18, blur: 8 });
      const pulse = orbTick(s.orb, t, { glow: 0.9 + 0.4 * P(lt, 2.3, 1) });
      tf(s.orb, { s: pulse * (0.6 + 0.4 * P(lt, 0.1, 0.8, E.outB)), o: P(lt, 0.1, 0.4) });
      const net = P(lt, 2.2, 1.0, E.ioC);
      s.tiles.forEach(o => {
        const a = o.isSF ? 0.7 : 0.15 + o.i * 0.06;
        const k = P(lt, a, o.isSF ? 0.8 : 0.6, o.isSF ? E.outB : E.outQi);
        tf(o.el, { x: o.isSF ? 300 * (1 - P(lt, a, 0.8, E.outX)) : 0, y: o.isSF ? 0 : 20 * (1 - k), s: (0.7 + 0.3 * k) * (1 - 0.25 * net), o: P(lt, a, 0.35) * (1 - 0.55 * net * (o.isSF ? 0 : 1)) });
        o.ln.style.opacity = (P(lt, o.isSF ? 1.2 : 0.5, 0.5) * (1 - 0.6 * net)).toFixed(3);
      });
      vis(s.nx, lt, 1.6, Infinity, { dy: 8, ds: -0.4, din: 0.5, ein: E.outB });
      s.team.forEach(n => {
        const a = 2.3 + n.i * 0.12;
        tf(n.o, { s: orbTick(n.o, t + n.i * 0.7) * P(lt, a, 0.7, E.outB), o: P(lt, a, 0.3) });
        n.l.style.opacity = P(lt, a + 0.3, 0.4).toFixed(3);
        n.ln.style.opacity = P(lt, a, 0.5).toFixed(3);
      });
    },
  });

  // ---------------------------------------------------------------- signature
  scene({
    id: 'outro', t0: TL.outro[0], t1: TL.outro[1], cls: 'black',
    css: `
    #sc-outro .l{position:absolute;left:0;right:0;text-align:center;font-weight:700;font-size:150px;letter-spacing:-.055em;line-height:1.05;color:#fff}
    #sc-outro .l1{top:330px}#sc-outro .l2{top:500px}
    #sc-outro .lo{position:absolute;left:960px;top:270px}
    #sc-outro .tt{position:absolute;left:0;right:0;top:370px;text-align:center;font-weight:700;font-size:150px;letter-spacing:.14em;padding-left:.14em;color:#fff;line-height:1}
    #sc-outro .sm{position:absolute;left:670px;top:540px;width:640px;filter:drop-shadow(0 0 14px rgba(255,153,0,.85)) drop-shadow(0 0 44px rgba(255,120,0,.4))}
    #sc-outro .by{position:absolute;left:0;right:0;top:780px;display:flex;justify-content:center;align-items:center;gap:18px}
    #sc-outro .by span{font:500 20px Plex,monospace;letter-spacing:.24em;text-transform:uppercase;color:#8C96A2}
    #sc-outro .cr{position:absolute;left:0;right:0;top:900px;text-align:center;font:500 18px Plex,monospace;letter-spacing:.2em;text-transform:uppercase;color:#6F7985}
    #sc-outro .bk{position:absolute;inset:0;background:#000;opacity:0}`,
    build(el, s) {
      el.innerHTML = `<div class="l l1">Stop searching.</div><div class="l l2"><span class="hl">Start consulting.</span></div>
        <div class="lo">${orb(100)}</div><div class="tt">J.A.R.V.I.S.</div><div class="sm">${BRAND.smile(640)}</div>
        <div class="by"><span>by</span>${BRAND.logo(230)}</div><div class="cr">Built by Valentin &amp; Diane · PSC France</div><div class="bk"></div>`;
      s.l1 = $('.l1', el); s.l2 = $('.l2', el); s.w1 = splitWords(s.l1); s.w2 = splitWords(s.l2);
      s.orb = $('.orb', el); s.tt = $('.tt', el); s.sm = $('.sm', el); s.by = $('.by', el); s.cr = $('.cr', el); s.bk = $('.bk', el);
      cue('hit', s.t0 + 0.25, { v: 0.5 }); cue('hit', s.t0 + 1.0, { v: 0.7 }); cue('final', s.t0 + 2.6); cue('smile', s.t0 + 3.15);
    },
    update(lt, dur, s, t) {
      revealWords(s.w1, lt, 0.25, { st: 0.12, dy: 60 });
      revealWords(s.w2, lt, 1.0, { st: 0.12, dy: 60 });
      const q = P(lt, 2.2, 0.5, E.inC);
      tf(s.l1, { y: -50 * q, o: 1 - q, b: 14 * q }); tf(s.l2, { y: -50 * q, o: 1 - q, b: 14 * q });
      const pulse = orbTick(s.orb, t);
      tf(s.orb, { s: pulse * P(lt, 2.6, 0.9, E.outB), o: P(lt, 2.6, 0.4) });
      const ti = P(lt, 2.7, 1.4, E.outQi);
      s.tt.style.letterSpacing = `${(0.14 + 0.4 * (1 - ti)).toFixed(4)}em`;
      tf(s.tt, { o: P(lt, 2.7, 0.8), b: 20 * (1 - ti) });
      const d = P(lt, 3.15, 0.9, E.outQu);
      s.sm.style.clipPath = `inset(-30% ${(100 - 100 * d).toFixed(2)}% -30% 0)`;
      vis(s.by, lt, 3.9, Infinity, { dy: 14, blur: 8 });
      vis(s.cr, lt, 4.6, Infinity, { dy: 10, blur: 6 });
      s.bk.style.opacity = P(lt, dur - 1.6, 1.6, E.ioC).toFixed(3);
    },
  });

  // ---------------------------------------------------------------- repères de la musique (lus par audio/make_audio.py)
  const M = (k, d = 0) => +(TL[k][0] + d).toFixed(3);
  window.MARKS = {
    storm: M('storm'), freeze: M('storm', 4.6), avalanche: M('flood'), build: M('flood', 3.3), reveal: M('reveal'), flash: M('reveal', 0.75),
    groove: M('how', 0.2), drums: M('brief'), bass: M('pacing'), trust: M('trust'), vision: M('next'), outro: M('outro'), final: M('outro', 2.6),
    levels: [[0, 0.35], [M('storm'), 0.5], [M('storm', 4.5), 1.0], [M('storm', 4.65), 0.0], [M('storm', 5.4), 0.35], [M('flood', 3.3), 0.5],
      [M('reveal', 0.65), 1.0], [M('how'), 0.7], [M('brief'), 0.8], [M('pacing'), 0.85], [M('deck'), 0.92], [M('total'), 1.0],
      [M('trust'), 0.6], [M('next'), 0.75], [M('outro'), 1.0]],
  };
})();
