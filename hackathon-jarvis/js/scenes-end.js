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

  // ------------------------------------------------ un cerveau qui apprend
  const LEARN = ["I'm done with the BFM deck", 'File XPENG under Amnet', 'Reply to Matthias', 'Prepare my 2 pm meeting', 'Where am I with Disney?', 'Do my briefing'];
  const OC = { x: 560, y: 500 };
  feature('learn', TL.learn, {
    cls: 'dark', kicker: 'Trust', head: 'It learns<br><span class="hl">how you work.</span>',
    sub: 'Every correction makes it sharper. Synced every 15 minutes.',
    css: `
    #sc-learn .lc{position:absolute;left:0;top:0;width:1040px;height:1080px}
    #sc-learn .ow{position:absolute;left:${OC.x}px;top:${OC.y}px}
    #sc-learn svg.ring{position:absolute;left:${OC.x - 230}px;top:${OC.y - 230}px;width:460px;height:460px;overflow:visible}
    #sc-learn .cm{position:absolute;left:0;top:0;white-space:nowrap;height:46px;padding:0 18px;border-radius:999px;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:#EEF1F4;font:500 17px Plex,monospace}
    #sc-learn .cm .ic{color:#FFB547}
    #sc-learn .cnt{position:absolute;left:${OC.x}px;top:${OC.y + 262}px;transform:translateX(-50%);text-align:center;white-space:nowrap}
    #sc-learn .cnt b{display:block;font-weight:700;font-size:56px;letter-spacing:-.03em;color:#fff;line-height:1}
    #sc-learn .cnt span{font:500 15px Plex,monospace;letter-spacing:.14em;text-transform:uppercase;color:#8C96A2}
    #sc-learn .sy{position:absolute;left:${OC.x}px;top:${OC.y - 300}px;transform:translateX(-50%);display:flex;gap:10px;align-items:center;font:500 15px Plex,monospace;color:#B6BEC8;white-space:nowrap;letter-spacing:.06em}
    #sc-learn .sy .ic{color:#5DD39E}
    #sc-learn .stats{position:absolute;left:${OC.x}px;top:${OC.y + 370}px;transform:translateX(-50%);font:500 14px Plex,monospace;color:#6F7985;white-space:nowrap;letter-spacing:.08em}
    `,
  }, {
    html: `<div class="lc"><svg class="ring" viewBox="0 0 460 460"><circle cx="230" cy="230" r="215" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="3"/><circle class="arc" cx="230" cy="230" r="215" fill="none" stroke="#FF9A3C" stroke-width="3.5" stroke-linecap="round" transform="rotate(-90 230 230)"/></svg>
      <div class="ow">${orb(210)}</div>
      ${LEARN.map(l => `<div class="cm">${ic('sparkles', 16)}${l}</div>`).join('')}
      <div class="sy">${ic('refresh-cw', 15)}<span class="syt">sync every 15 min · next in 14:59</span></div>
      <div class="cnt"><b class="cv">3</b><span>corrections learned</span></div>
      <div class="stats">16,125 emails · 28 events · 570 documents · 42 passes</div></div>`,
    build(root, s) {
      s.orb = $('.orb', root); s.arc = $('.arc', root); s.cms = $$('.cm', root); s.cv = $('.cv', root); s.syt = $('.syt', root);
      s.sy = $('.sy', root); s.cnt = $('.cnt', root); s.stats = $('.stats', root);
      const r = rng(5);
      s.fl = s.cms.map((el, i) => ({ el, a: 0.9 + i * 0.62, x0: -40 + r() * 80, y0: 220 + i * 105 + r() * 30 }));
      s.fl.forEach(f => cue('absorb', s.t0 + f.a + 1.05, { v: 0.5 }));
      cue('success', s.t0 + 5.3, { v: 0.5 });
    },
    update(lt, dur, root, s, t) {
      const L = 2 * Math.PI * 215;
      s.arc.style.strokeDasharray = `${L}`;
      s.arc.style.strokeDashoffset = (L * (1 - P(lt, 0.3, 5.0, E.ioC))).toFixed(1);
      let kick = 0, n = 3;
      s.fl.forEach(f => {
        const k = clamp((lt - f.a) / 1.1);
        const x = lerp(f.x0, OC.x, E.inQ(k)), y = lerp(f.y0, OC.y, E.ioC(k));
        tf(f.el, { x: x - (1 - k) * 0, y: y - 23, s: 1 - 0.75 * E.inQ(k), o: P(lt, f.a, 0.3) * (1 - P(lt, f.a + 0.85, 0.25)) });
        f.el.style.marginLeft = `${(-f.el.offsetWidth / 2 * E.inQ(k)).toFixed(1)}px`;
        const since = lt - (f.a + 1.05);
        if (since > 0) { n++; kick = Math.max(kick, Math.exp(-since * 5)); }
      });
      if (s.cv.textContent !== String(n)) s.cv.textContent = n;
      const pulse = orbTick(s.orb, t, { glow: 0.8 + 0.6 * kick });
      tf(s.orb, { s: pulse * (1 + 0.12 * kick) * (0.6 + 0.4 * P(lt, 0.2, 1.0, E.outB)), o: P(lt, 0.2, 0.5) });
      pop(s.cnt, lt, 0.8); pop(s.sy, lt, 0.6); pop(s.stats, lt, 1.2);
      const synced = lt > 5.3;
      s.syt.textContent = synced ? 'synced just now · 131 s' : `sync every 15 min · next in 14:${String(59 - Math.floor(Math.max(0, lt - 0.6))).padStart(2, '0')}`;
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

  // ------------------------------------------------ fin
  scene({
    id: 'outro', t0: TL.outro[0], t1: TL.outro[1], cls: 'black',
    css: `
    #sc-outro .l{position:absolute;left:0;right:0;text-align:center;font-weight:700;font-size:150px;letter-spacing:-.055em;line-height:1.05;color:#fff}
    #sc-outro .l1{top:330px}#sc-outro .l2{top:500px}
    #sc-outro .lo{position:absolute;left:960px;top:360px}
    #sc-outro .tt{position:absolute;left:0;right:0;top:470px;text-align:center;font-weight:700;font-size:150px;letter-spacing:.16em;padding-left:.16em;color:#fff;line-height:1}
    #sc-outro .tg{position:absolute;left:0;right:0;top:668px;text-align:center;font:500 20px Plex,monospace;letter-spacing:.2em;text-transform:uppercase;color:#7F8995}
    #sc-outro .bk{position:absolute;inset:0;background:#000;opacity:0}
    `,
    build(el, s) {
      el.innerHTML = `<div class="l l1">Stop searching.</div><div class="l l2"><span class="hl">Start consulting.</span></div>
        <div class="lo">${orb(120)}</div><div class="tt">J.A.R.V.I.S.</div><div class="tg">Built with Kiro · Amazon Ads · Programmatic Solutions</div><div class="bk"></div>`;
      s.l1 = $('.l1', el); s.l2 = $('.l2', el); s.w1 = splitWords(s.l1); s.w2 = splitWords(s.l2);
      s.orb = $('.orb', el); s.tt = $('.tt', el); s.tg = $('.tg', el); s.bk = $('.bk', el);
      cue('hit', s.t0 + 0.25, { v: 0.5 }); cue('hit', s.t0 + 1.05, { v: 0.7 }); cue('final', s.t0 + 2.75);
    },
    update(lt, dur, s, t) {
      revealWords(s.w1, lt, 0.25, { st: 0.12, dy: 60 });
      revealWords(s.w2, lt, 1.05, { st: 0.12, dy: 60 });
      const q = P(lt, 2.35, 0.5, E.inC);
      tf(s.l1, { y: -50 * q, o: 1 - q, b: 14 * q }); tf(s.l2, { y: -50 * q, o: 1 - q, b: 14 * q });
      const pulse = orbTick(s.orb, t);
      tf(s.orb, { s: pulse * P(lt, 2.75, 0.9, E.outB), o: P(lt, 2.75, 0.4) });
      const ti = P(lt, 2.85, 1.4, E.outQi);
      s.tt.style.letterSpacing = `${(0.16 + 0.4 * (1 - ti)).toFixed(4)}em`;
      tf(s.tt, { o: P(lt, 2.85, 0.8), b: 20 * (1 - ti) });
      vis(s.tg, lt, 3.45, Infinity, { dy: 14, blur: 8 });
      s.bk.style.opacity = P(lt, dur - 0.7, 0.7, E.inQ).toFixed(3);
    },
  });
})();
