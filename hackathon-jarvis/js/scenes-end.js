/* Confiance, vision, fin */
(function () {
  'use strict';
  const { E, P, tf, vis, count, rng, ic, $, $$, clamp, lerp, feature, scene, cursor, moveCursor, cue, rel, orb, orbTick, SOURCES, tile, splitWords, revealWords } = J;
  const pop = (el, lt, a, o = {}) => vis(el, lt, a, o.b ?? Infinity, Object.assign({ dy: 18, blur: 8, din: 0.7 }, o));

  // ------------------------------------------------ l'humain garde la main
  feature('control', TL.control, {
    cls: 'dark', kicker: 'Trust', head: 'You stay<br><span class="hl">in control.</span>',
    sub: 'Drafts land in Outlook, written in your voice. Nothing is ever sent on its own.',
    css: `
    #sc-control .ol{position:absolute;left:20px;top:250px;width:980px;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 60px 140px -30px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.08)}
    #sc-control .ol-bar{height:46px;background:#EEF1F5;display:flex;align-items:center;gap:8px;padding:0 18px;border-bottom:1px solid #DDE2E8}
    #sc-control .ol-bar i{width:13px;height:13px;border-radius:50%}
    #sc-control .ol-bar span{margin-left:14px;font-weight:650;font-size:14.5px;color:#2F6FDE;display:flex;gap:8px;align-items:center}
    #sc-control .ol-in{display:flex;height:470px}
    #sc-control .ol-sd{width:200px;background:#F7F8FA;border-right:1px solid #E5E8EC;padding:16px 10px;display:flex;flex-direction:column;gap:4px}
    #sc-control .ol-sd div{display:flex;gap:10px;align-items:center;height:38px;padding:0 12px;border-radius:8px;font-size:15px;color:#2B3138}
    #sc-control .ol-sd div b{margin-left:auto;font-weight:600;color:#6C7279;font-size:13px}
    #sc-control .ol-sd .on{background:#E3ECFB;color:#1F55C4;font-weight:650}
    #sc-control .ol-m{flex:1;padding:20px 26px}
    #sc-control .ol-a{display:flex;gap:12px;align-items:center;padding-bottom:14px;border-bottom:1px solid #EEF0F3}
    #sc-control .send{display:inline-flex;gap:8px;align-items:center;height:40px;padding:0 20px;border-radius:8px;background:#2F6FDE;color:#fff;font-weight:650;font-size:15.5px}
    #sc-control .by{margin-left:auto;display:inline-flex;gap:7px;align-items:center;font-size:14px;color:var(--or);font-weight:600}
    #sc-control .ol-f{font-size:15px;color:#2B3138;padding:10px 0;border-bottom:1px solid #EEF0F3}
    #sc-control .ol-f span{display:inline-block;width:80px;color:#6C7279}
    #sc-control .ol-t{font-size:16.5px;line-height:1.6;color:#14181D;padding-top:16px}
    #sc-control .lock{position:absolute;left:640px;top:190px;display:flex;gap:10px;align-items:center;height:54px;padding:0 22px;border-radius:999px;background:rgba(20,24,29,.92);border:1px solid rgba(255,255,255,.18);color:#fff;font-weight:650;font-size:17px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
    #sc-control .lock .ic{color:#5DD39E}
    #sc-control .sent{position:absolute;left:330px;top:770px;display:flex;gap:10px;align-items:center;height:50px;padding:0 22px;border-radius:999px;background:#fff;color:#14181D;font-weight:650;font-size:16px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
    #sc-control .sent .ic{color:var(--grn)}
    `,
  }, {
    html: `<div class="ol"><div class="ol-bar"><i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i><span>${ic('mail', 16)}Outlook</span></div>
      <div class="ol-in"><div class="ol-sd"><div>${ic('inbox', 17)}Inbox<b>7</b></div><div class="on">${ic('pen-line', 17)}Drafts<b>3</b></div><div>${ic('send', 17)}Sent</div><div>${ic('folder', 17)}Archive</div></div>
        <div class="ol-m"><div class="ol-a"><span class="send">${ic('send', 16)}Send</span><span class="chip amb mono st">draft</span><span class="by">${ic('sparkles', 15)}Drafted by Kiro · in your voice</span></div>
          <div class="ol-f"><span>To</span>Ggarzonv</div><div class="ol-f"><span>Subject</span>RE: Amazon DSP: Columbia Order Under delivery</div>
          <div class="ol-t">Hi Gabriel,<br><br>Thanks for the update. Looking at the 06/10 export, delivery has caught up on the UK orders. I'll keep an eye on the remaining lines and come back to you on Friday with the pacing.<br><br>Best,<br>Valentin</div></div></div></div>
      <div class="lock">${ic('shield-check', 22)}Never sent automatically</div>
      <div class="sent">${ic('circle-check', 20)}Sent by you · 10:42</div>`,
    build(root, s) {
      s.lock = $('.lock', root); s.send = $('.send', root); s.st = $('.st', root); s.sent = $('.sent', root); s.cur = cursor(root);
      cue('lock', s.t0 + 1.4); cue('click', s.t0 + 3.9); cue('success', s.t0 + 4.15);
    },
    update(lt, dur, root, s) {
      if (!s.m) s.m = rel(s.send, root);
      vis(s.lock, lt, 1.4, Infinity, { dy: 16, ds: -0.25, din: 0.6, ein: E.outB });
      moveCursor(s.cur, lt, [[2.4, 760, 840], [3.6, s.m.cx + 8, s.m.cy + 6]], [3.9], { hide: 5.6 });
      const sent = lt > 4.0;
      s.st.className = 'chip mono st ' + (sent ? 'grn' : 'amb'); s.st.textContent = sent ? 'sent by you' : 'draft';
      vis(s.sent, lt, 4.15, Infinity, { dy: 26, blur: 8, din: 0.6, ein: E.outB });
    },
  });

  // ------------------------------------------------ la boucle d'apprentissage
  const OC = { x: 578, y: 520 };
  const INS = [['mail', '#2F6FDE', 'Every email', 'you send', 300], ['file-text', '#16947E', 'Every document', 'you create', 520], ['chart-column', '#F7930F', 'Every campaign', 'result', 740]];
  const OUTS = [['Sharper answers', 'sparkles', 340], ['Earlier alerts', 'bell', 520], ['Drafts closer to you', 'pen-line', 700]];
  feature('loop', TL.loop, {
    cls: 'dark', kicker: 'Always learning', head: 'Every email.<br>Every document.<br><span class="hl">Every result.</span>',
    sub: 'J.A.R.V.I.S. learns from everything you send, create and deliver. Its answers and alerts get sharper every day.',
    css: `
    #sc-loop .head{font-size:76px}
    #sc-loop .ow{position:absolute;left:${OC.x}px;top:${OC.y}px}
    #sc-loop svg.lp{position:absolute;left:${OC.x - 210}px;top:${OC.y - 210}px;width:420px;height:420px;overflow:visible}
    #sc-loop .in{position:absolute;left:0;width:250px;display:flex;gap:12px;align-items:center;margin-top:-26px}
    #sc-loop .in .ii{width:52px;height:52px;border-radius:14px;display:grid;place-items:center;color:#fff;flex:none;box-shadow:0 12px 30px rgba(0,0,0,.35)}
    #sc-loop .in b{display:block;font-size:19px;color:#fff;font-weight:650}
    #sc-loop .in span{font-size:15px;color:#98A1AC}
    #sc-loop .pk{position:absolute;left:0;top:0;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:7px;display:grid;place-items:center;color:#fff}
    #sc-loop .out{position:absolute;left:800px;margin-top:-24px;display:flex;gap:10px;align-items:center;height:48px;padding:0 18px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,153,0,.45);color:#fff;font-size:16.5px;font-weight:600;white-space:nowrap}
    #sc-loop .out .ic{color:#FFB547}
    #sc-loop .em{position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#FFD08A;box-shadow:0 0 14px 4px rgba(255,153,0,.7)}
    #sc-loop .days{position:absolute;left:200px;top:880px;width:800px}
    #sc-loop .days .bar{position:relative;height:3px;border-radius:3px;background:rgba(255,255,255,.12);margin:0 70px}
    #sc-loop .days .bar i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:linear-gradient(90deg,#FF9900,#FFC266);transform-origin:0 50%}
    #sc-loop .days .bar b{position:absolute;top:-6px;width:15px;height:15px;margin-left:-7px;border-radius:50%;background:#FFC266;box-shadow:0 0 14px rgba(255,153,0,.8)}
    #sc-loop .days span{position:absolute;top:-8px;font:500 14px Plex,monospace;letter-spacing:.12em;text-transform:uppercase;color:#8C96A2}
    #sc-loop .days .d1{left:0}#sc-loop .days .d2{right:0}
    #sc-loop .days em{display:block;text-align:center;margin-top:22px;font:500 15px Plex,monospace;letter-spacing:.16em;text-transform:uppercase;color:#C9D1DB;font-style:normal}
    `,
  }, {
    html: `<svg class="lp" viewBox="-210 -210 420 420"><circle r="196" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="2"/>
        <g class="arc"><path d="M 196 0 A 196 196 0 1 1 ${(196 * Math.cos(5.6)).toFixed(1)} ${(196 * Math.sin(5.6)).toFixed(1)}" fill="none" stroke="#FF9900" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 10"/>
        <path d="M ${(196 * Math.cos(5.6)).toFixed(1)} ${(196 * Math.sin(5.6)).toFixed(1)} l 14 -2 M ${(196 * Math.cos(5.6)).toFixed(1)} ${(196 * Math.sin(5.6)).toFixed(1)} l 2 14" stroke="#FF9900" stroke-width="3" stroke-linecap="round" transform="rotate(-38 ${(196 * Math.cos(5.6)).toFixed(1)} ${(196 * Math.sin(5.6)).toFixed(1)})"/></g></svg>
      <div class="ow">${orb(200)}</div>
      ${INS.map(n => `<div class="in" style="top:${n[4]}px"><div class="ii" style="background:${n[1]}">${ic(n[0], 24)}</div><div><b>${n[2]}</b><span>${n[3]}</span></div></div>`).join('')}
      <div class="pks"></div>
      ${OUTS.map(o => `<div class="out" style="top:${o[2]}px">${ic(o[1], 18)}${o[0]}</div>`).join('')}
      ${OUTS.map(() => '<div class="em"></div>').join('')}
      <div class="days"><span class="d1">day 1</span><span class="d2">day 90</span><div class="bar"><i></i><b></b></div><em>every day, a little sharper</em></div>`,
    build(root, s) {
      s.orb = $('.orb', root); s.arc = $('.lp .arc', root); s.ins = $$('.in', root); s.outs = $$('.out', root); s.ems = $$('.em', root);
      s.bar = $('.days .bar i', root); s.dot = $('.days .bar b', root); s.days = $('.days', root);
      const pks = $('.pks', root), r = rng(9);
      s.pk = [];
      INS.forEach((n, si) => { for (let j = 0; j < 5; j++) { const el = J.h(`<div class="pk" style="background:${n[1]}">${ic(n[0], 14)}</div>`); pks.appendChild(el); s.pk.push({ el, si, y0: n[4], ph: j / 5 + r() * 0.08, sp: 0.42 + r() * 0.08 }); } });
      INS.forEach((_, i) => cue('pop', s.t0 + 0.7 + i * 0.25, { v: 0.4 }));
      cue('data', s.t0 + 1.4, { d: 9.0 });
      OUTS.forEach((_, i) => cue('success', s.t0 + 4.3 + i * 1.3, { v: 0.45 }));
    },
    update(lt, dur, root, s, t) {
      s.ins.forEach((el, i) => vis(el, lt, 0.6 + i * 0.25, Infinity, { dx: -30, dy: 0, blur: 8 }));
      const on = P(lt, 1.4, 0.8);
      let kick = 0;
      for (const p of s.pk) {
        const ph = ((lt - 1.4) * p.sp + p.ph) % 1;
        if (lt < 1.4) { p.el.style.opacity = 0; continue; }
        const u = E.inQ(ph), v = 1 - u, x0 = 262, y0 = p.y0, cx = 430, cy = (p.y0 + OC.y) / 2;
        const x = v * v * x0 + 2 * v * u * cx + u * u * OC.x, y = v * v * y0 + 2 * v * u * cy + u * u * OC.y;
        p.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${(1 - 0.6 * u).toFixed(3)})`;
        p.el.style.opacity = (on * Math.min(1, ph * 6) * (1 - P(ph, 0.85, 0.15, E.lin))).toFixed(3);
        if (ph > 0.9) kick = Math.max(kick, 1 - (ph - 0.9) / 0.1);
      }
      const growth = P(lt, 2.0, 8.5, E.ioC);
      const pulse = orbTick(s.orb, t, { glow: 0.7 + 0.8 * growth + 0.3 * kick });
      tf(s.orb, { s: pulse * (0.75 + 0.25 * P(lt, 0.2, 1.0, E.outB)) * (1 + 0.14 * growth + 0.04 * kick), o: P(lt, 0.2, 0.5) });
      s.arc.setAttribute('transform', `rotate(${(lt * 40).toFixed(2)})`);
      s.arc.style.opacity = P(lt, 1.0, 0.8).toFixed(3);
      s.outs.forEach((o, i) => {
        const a = 4.3 + i * 1.3;
        vis(o, lt, a, Infinity, { dx: -24, dy: 0, ds: -0.1, din: 0.7, ein: E.outB });
        const k = P(lt, a - 0.55, 0.55, E.inQ), em = s.ems[i], oy = OUTS[i][2];
        em.style.transform = `translate(${lerp(OC.x + 90, 800, k).toFixed(1)}px,${lerp(OC.y, oy, k).toFixed(1)}px)`;
        em.style.opacity = (lt > a - 0.55 && lt < a + 0.05 ? 1 : 0).toString();
      });
      vis(s.days, lt, 1.6, Infinity, { dy: 14, blur: 6 });
      s.bar.style.transform = `scaleX(${growth.toFixed(4)})`;
      s.dot.style.left = (100 * growth).toFixed(2) + '%';
    },
  });

  // ------------------------------------------------ Salesforce
  const SF = { name: 'Salesforce', icon: 'cloud', c: '#0B9EDB' };
  const RING = SOURCES.slice(0, 1).concat([SF], SOURCES.slice(1));
  const RC = { x: 520, y: 540 };
  feature('sfdc', TL.sfdc, {
    cls: 'dark', kicker: "What's next", head: 'Salesforce,<br><span class="hl">plugged in.</span>',
    sub: 'Sales and targets, right next to delivery.',
    css: `
    #sc-sfdc svg.ln{position:absolute;left:0;top:0;width:1040px;height:1080px;overflow:visible}
    #sc-sfdc .ow{position:absolute;left:${RC.x}px;top:${RC.y}px}
    #sc-sfdc .pt{position:absolute;left:0;top:0;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#FFD08A;box-shadow:0 0 10px 3px rgba(255,150,50,.7)}
    #sc-sfdc .pt.sf{background:#8FDBFF;box-shadow:0 0 10px 3px rgba(11,158,219,.8)}
    #sc-sfdc .nx{position:absolute;font:600 12px Plex,monospace;letter-spacing:.14em;color:#fff;background:var(--or);border-radius:999px;padding:5px 10px}
    #sc-sfdc .tile-name{font-size:17px}
    #sc-sfdc .sfl{position:absolute;font:500 14px Plex,monospace;color:#8FDBFF;letter-spacing:.08em;white-space:nowrap;transform:translateX(-50%)}
    `,
  }, {
    html: `<svg class="ln"></svg><div class="tiles"></div><div class="pts"></div><div class="ow">${orb(160)}</div>`,
    build(root, s) {
      const svg = $('svg.ln', root), tl = $('.tiles', root), pts = $('.pts', root);
      s.orb = $('.orb', root);
      s.items = RING.map((src, i) => {
        const ang = -Math.PI / 2 + i * 2 * Math.PI / RING.length;
        const x = RC.x + Math.cos(ang) * 380, y = RC.y + Math.sin(ang) * 310;
        const el = J.h(tile(src, 86)); el.style.left = x + 'px'; el.style.top = y + 'px'; tl.appendChild(el);
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', `M${x},${y} L${RC.x},${RC.y}`); p.setAttribute('fill', 'none');
        const isSF = src === SF;
        p.setAttribute('stroke', isSF ? 'rgba(80,190,240,.75)' : 'rgba(255,170,90,.38)'); p.setAttribute('stroke-width', isSF ? '2.5' : '2');
        if (isSF) p.setAttribute('stroke-dasharray', '7 7');
        svg.appendChild(p);
        const len = Math.hypot(x - RC.x, y - RC.y);
        const ps = [0, 1].map(() => { const d = J.h(`<div class="pt${isSF ? ' sf' : ''}"></div>`); pts.appendChild(d); return d; });
        return { el, p, x, y, len, ps, isSF, i };
      });
      const sf = s.items.find(o => o.isSF);
      s.nx = J.h(`<div class="nx">NEXT</div>`); s.nx.style.left = sf.x + 34 + 'px'; s.nx.style.top = sf.y - 66 + 'px'; root.appendChild(s.nx);
      s.sfl = J.h(`<div class="sfl">sales · targets · pipeline</div>`); s.sfl.style.left = sf.x + 'px'; s.sfl.style.top = sf.y + 92 + 'px'; root.appendChild(s.sfl);
      cue('whoosh', s.t0 + 1.55, { v: 0.6 }); cue('hit', s.t0 + 2.0, { v: 0.45 }); cue('pop', s.t0 + 2.6);
    },
    update(lt, dur, root, s, t) {
      const pulse = orbTick(s.orb, t);
      tf(s.orb, { s: pulse * (0.6 + 0.4 * P(lt, 0.2, 0.9, E.outB)), o: P(lt, 0.2, 0.5) });
      s.items.forEach(o => {
        const a = o.isSF ? 1.55 : 0.3 + o.i * 0.08;
        const k = P(lt, a, o.isSF ? 0.9 : 0.7, o.isSF ? E.outB : E.outQi);
        tf(o.el, { x: o.isSF ? 260 * (1 - P(lt, a, 0.9, E.outX)) : 0, y: o.isSF ? 0 : 24 * (1 - k), s: 0.7 + 0.3 * k, o: P(lt, a, 0.4), b: 10 * (1 - P(lt, a, 0.6)) });
        const d = P(lt, o.isSF ? 2.1 : 0.7 + o.i * 0.06, 0.6, E.ioC);
        o.p.style.opacity = d.toFixed(3);
        if (!o.isSF) { o.p.style.strokeDasharray = `${o.len}`; o.p.style.strokeDashoffset = (o.len * (1 - d)).toFixed(1); }
        o.ps.forEach((pt, j) => {
          const st = o.isSF ? 2.8 : 1.2;
          if (lt < st) { pt.style.opacity = 0; return; }
          const ph = ((lt - st) * 0.6 + j / 2 + o.i * 0.13) % 1, u = E.inQ(ph);
          pt.style.transform = `translate(${lerp(o.x, RC.x, u).toFixed(1)}px,${lerp(o.y, RC.y, u).toFixed(1)}px)`;
          pt.style.opacity = (Math.sin(Math.PI * ph) * P(lt, st, 0.5)).toFixed(3);
        });
      });
      vis(s.nx, lt, 2.6, Infinity, { dy: 8, ds: -0.4, din: 0.5, ein: E.outB });
      pop(s.sfl, lt, 2.9);
    },
  });

  // ------------------------------------------------ des cerveaux reliés
  const TEAM = ['PSC France', 'PSC EU', 'Sales', 'Account managers', 'Ad Ops', 'Leadership'];
  const NC = { x: 520, y: 520 };
  feature('network', TL.network, {
    cls: 'dark', kicker: "What's next", head: 'Connected brains.<br><span class="hl">One team.</span>',
    sub: 'Brains that share what they know, so the whole team moves forward together.',
    css: `
    #sc-network svg.ln{position:absolute;left:0;top:0;width:1040px;height:1080px;overflow:visible}
    #sc-network .nd{position:absolute;left:0;top:0}
    #sc-network .nl{position:absolute;transform:translateX(-50%);white-space:nowrap;font:500 15px Plex,monospace;letter-spacing:.1em;text-transform:uppercase;color:#B6BEC8}
    #sc-network .nl.me{color:#fff;font-weight:600}
    #sc-network .pt{position:absolute;left:0;top:0;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;background:#FFE0B0;box-shadow:0 0 10px 3px rgba(255,150,50,.75)}
    `,
  }, {
    html: `<svg class="ln"></svg><div class="nodes"></div><div class="pts"></div>`,
    build(root, s) {
      const svg = $('svg.ln', root), nodes = $('.nodes', root), pts = $('.pts', root);
      const pos = [[NC.x, NC.y, 140, 'Your brain', 1]].concat(TEAM.map((n, i) => { const a = -Math.PI / 2 + i * Math.PI / 3; return [NC.x + Math.cos(a) * 390, NC.y + Math.sin(a) * 320, 84, n, 0]; }));
      s.nodes = pos.map(([x, y, d, name, me], i) => {
        const w = J.h(`<div class="nd" style="left:${x}px;top:${y}px">${orb(d)}</div>`); nodes.appendChild(w);
        const l = J.h(`<div class="nl${me ? ' me' : ''}" style="left:${x}px;top:${y + d / 2 + 20}px">${name}</div>`); nodes.appendChild(l);
        return { w, o: $('.orb', w), l, x, y, i };
      });
      const edges = [];
      for (let i = 1; i <= 6; i++) edges.push([0, i]);
      for (let i = 1; i <= 6; i++) edges.push([i, i === 6 ? 1 : i + 1]);
      s.edges = edges.map(([a, b], k) => {
        const A = s.nodes[a], B = s.nodes[b];
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        p.setAttribute('x1', A.x); p.setAttribute('y1', A.y); p.setAttribute('x2', B.x); p.setAttribute('y2', B.y);
        p.setAttribute('stroke', k < 6 ? 'rgba(255,170,90,.45)' : 'rgba(255,170,90,.22)'); p.setAttribute('stroke-width', k < 6 ? '2' : '1.5');
        svg.appendChild(p);
        const len = Math.hypot(B.x - A.x, B.y - A.y);
        const pt = J.h('<div class="pt"></div>'); pts.appendChild(pt);
        return { p, A, B, len, pt, k, dir: k % 2 ? 1 : -1 };
      });
      TEAM.forEach((_, i) => cue('node', s.t0 + 0.55 + i * 0.13, { v: 0.4, n: i }));
      cue('swell', s.t0 + 3.4, { d: 2.0 });
    },
    update(lt, dur, root, s, t) {
      const sync = lt > 3.4 ? Math.exp(-((lt - 3.4) % 1.3) * 3) * P(lt, 3.4, 0.2) : 0;
      s.nodes.forEach(n => {
        const a = n.i === 0 ? 0.2 : 0.55 + (n.i - 1) * 0.13;
        const pulse = orbTick(n.o, t + n.i * 0.7, { glow: 0.8 + 0.6 * sync });
        tf(n.o, { s: pulse * (1 + 0.1 * sync) * P(lt, a, 0.8, E.outB), o: P(lt, a, 0.4) });
        n.l.style.opacity = P(lt, a + 0.3, 0.5).toFixed(3);
      });
      s.edges.forEach(e => {
        const d = P(lt, 1.0 + e.k * 0.05, 0.6, E.ioC);
        e.p.style.strokeDasharray = `${e.len}`; e.p.style.strokeDashoffset = (e.len * (1 - d)).toFixed(1);
        if (lt < 1.7) { e.pt.style.opacity = 0; return; }
        let ph = ((lt - 1.7) * 0.45 + e.k * 0.17) % 1; if (e.dir < 0) ph = 1 - ph;
        e.pt.style.transform = `translate(${lerp(e.A.x, e.B.x, ph).toFixed(1)}px,${lerp(e.A.y, e.B.y, ph).toFixed(1)}px)`;
        e.pt.style.opacity = (Math.sin(Math.PI * ph) * P(lt, 1.7, 0.5)).toFixed(3);
      });
    },
  });

  // ------------------------------------------------ fin : signature
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
    #sc-outro .bk{position:absolute;inset:0;background:#000;opacity:0}
    `,
    build(el, s) {
      el.innerHTML = `<div class="l l1">Stop searching.</div><div class="l l2"><span class="hl">Start consulting.</span></div>
        <div class="lo">${orb(100, { nosmile: true })}</div><div class="tt">J.A.R.V.I.S.</div><div class="sm">${BRAND.smile(640)}</div>
        <div class="by"><span>by</span>${BRAND.logo(230)}</div><div class="cr">Built by Valentin &amp; Diane · PSC France</div><div class="bk"></div>`;
      s.l1 = $('.l1', el); s.l2 = $('.l2', el); s.w1 = splitWords(s.l1); s.w2 = splitWords(s.l2);
      s.orb = $('.orb', el); s.tt = $('.tt', el); s.sm = $('.sm', el); s.by = $('.by', el); s.cr = $('.cr', el); s.bk = $('.bk', el);
      cue('hit', s.t0 + 0.25, { v: 0.5 }); cue('hit', s.t0 + 1.05, { v: 0.7 }); cue('final', s.t0 + 2.75); cue('smile', s.t0 + 3.3);
    },
    update(lt, dur, s, t) {
      revealWords(s.w1, lt, 0.25, { st: 0.12, dy: 60 });
      revealWords(s.w2, lt, 1.05, { st: 0.12, dy: 60 });
      const q = P(lt, 2.35, 0.5, E.inC);
      tf(s.l1, { y: -50 * q, o: 1 - q, b: 14 * q }); tf(s.l2, { y: -50 * q, o: 1 - q, b: 14 * q });
      const pulse = orbTick(s.orb, t);
      tf(s.orb, { s: pulse * P(lt, 2.75, 0.9, E.outB), o: P(lt, 2.75, 0.4) });
      const ti = P(lt, 2.85, 1.4, E.outQi);
      s.tt.style.letterSpacing = `${(0.14 + 0.4 * (1 - ti)).toFixed(4)}em`;
      tf(s.tt, { o: P(lt, 2.85, 0.8), b: 20 * (1 - ti) });
      const d = P(lt, 3.3, 0.9, E.outQu);
      s.sm.style.clipPath = `inset(-30% ${(100 - 100 * d).toFixed(2)}% -30% 0)`;
      vis(s.by, lt, 4.1, Infinity, { dy: 14, blur: 8 });
      vis(s.cr, lt, 5.0, Infinity, { dy: 10, blur: 6 });
      s.bk.style.opacity = P(lt, dur - 1.6, 1.6, E.ioC).toFixed(3);
    },
  });
})();
