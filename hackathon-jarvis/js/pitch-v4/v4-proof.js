/* Film d'intro v4 — plans 5 à 8 : ce que JARVIS fait, sur des captures animées de la plateforme
   5 · 90 emails, 3 lines   6 · Under-delivery? Caught first.   7 · Your voice. Your data.   8 · Walk in ready / Not yours? Routed. */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, tf, vis, splitWords, revealWords, type, rng, ic, $, $$, scene, clamp, lerp, cue, cursor, moveCursor } = J;
  const K = J.K4, SH = J.SH, T = J.T;

  // ---------------------------------------------------------------- plan 5 · 0:26 90 emails, 3 lines
  const SUBJ = ['Re: delivery update', 'Fwd: Q4 plan', 'Pacing question', 'Invoice copy Q3', 'Creatives approved?', 'Deal ID not bidding', 'Re: added value',
    'Weekly sync notes', 'New line items', 'Can you check…', 'Brief v2', 'Re: frequency cap', 'Budget shift', 'Report for Friday', 'Re: Re: setup'];
  const LINES = [
    [`3 things need you. <span style="color:${K.or}">1 can't wait.</span>`, "3 things need you. 1 can't wait."],
    ['6 campaigns behind pace, 1 draft ready.', '6 campaigns behind pace, 1 draft ready.'],
    ['1 request is not yours: routed to its owner.', '1 request is not yours: routed to its owner.'],
  ];
  const ACC = 3.0; // l'accordéon se referme
  scene({
    id: 'briefing', t0: SH.briefing[0], t1: SH.briefing[1], cls: 'v4', fin: 0,
    css: `
    #sc-briefing .hd{left:120px;top:110px;font-size:96px}
    #sc-briefing .gc{position:absolute;left:124px;top:250px}
    #sc-briefing .st{position:absolute;left:120px;top:360px;width:640px;height:620px;overflow:hidden;
      -webkit-mask-image:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent)}
    #sc-briefing .rl{position:absolute;left:0;top:0;width:100%}
    #sc-briefing .rw{height:58px;margin-bottom:8px;border-radius:12px;background:#222B37;display:flex;align-items:center;gap:16px;padding:0 18px;transform-origin:50% 50%}
    #sc-briefing .rw .ic{color:${K.cob}}
    #sc-briefing .rw b{width:110px;height:12px;border-radius:6px;background:#3A4553;flex:none}
    #sc-briefing .rw span{font:500 21px InterV;color:#D5DAE0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #sc-briefing .n90{position:absolute;left:120px;top:990px;font:600 20px Plex,monospace;letter-spacing:.14em;color:${K.cob}}
    #sc-briefing .bc{left:860px;top:380px;width:940px;height:420px;padding:34px 40px}
    #sc-briefing .bc .k{font-size:15px;font-weight:700;letter-spacing:.14em;color:#4A5057}
    #sc-briefing .bc .t{margin-top:8px;font-family:InterTight;font-weight:800;font-size:30px;letter-spacing:-.02em;color:#4A5057;display:flex;align-items:center;gap:10px}
    #sc-briefing .bc .t .ic{color:${K.or}}
    #sc-briefing .bc .l{margin-top:26px;font-family:InterTight;font-weight:800;letter-spacing:-.035em;color:#15191E;min-height:50px}
    #sc-briefing .bc .l0{font-size:52px}
    #sc-briefing .bc .l1,#sc-briefing .bc .l2{font-size:36px;font-weight:700;letter-spacing:-.02em}
    #sc-briefing .bc .l .num{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:${K.ink};color:#fff;font:700 18px InterV;margin-right:14px;vertical-align:4px}`,
    build(el, s) {
      const rows = Array.from({ length: 90 }, (_, i) => `<div class="rw">${ic('mail', 22)}<b></b><span>${SUBJ[i % SUBJ.length]}</span></div>`).join('');
      el.innerHTML = `<div class="v4h hd">90 emails. <span class="o">3 lines.</span></div><div class="gc">${J.gainChip('30 min → 5 min a day')}</div>
        <div class="st"><div class="rl">${rows}</div></div><div class="n90">90 UNREAD · SINCE 08:00</div>
        <div class="v4card bc"><div class="k">THURSDAY 29 OCT · BRIEFING OF 18:05</div><div class="t">${ic('sparkles', 26)}Briefing</div>
          ${LINES.map((l, i) => `<div class="l l${i}">${i ? `<span class="num">${i}</span>` : ''}<span class="tx"></span></div>`).join('')}</div>`;
      s.hd = splitWords($('.hd', el)); s.gc = $('.gc .v4chip', el); s.rl = $('.rl', el); s.rows = $$('.rw', el); s.n90 = $('.n90', el); s.st = $('.st', el);
      s.bc = $('.bc', el); s.tx = $$('.bc .tx', el);
      cue('data', s.t0 + 0.2, { d: ACC }); cue('absorb', s.t0 + ACC + 0.6, { v: 0.8 }); cue('open', s.t0 + ACC + 0.7, { v: 0.6 });
      LINES.forEach((l, i) => cue('type', s.t0 + 4.0 + i * 1.3, { d: l[1].length / 32 }));
      cue('pop', s.t0 + 7.6, { v: 0.5 });
    },
    update(lt, dur, s) {
      revealWords(s.hd, lt, 0.2, { st: 0.12, dy: 40, d: 0.6 });
      vis(s.gc, lt, 7.6, Infinity, { dy: 14, ds: -0.1, ein: E.outB, blur: 4 });
      // le flux d'e-mails défile vite, puis se referme en accordéon vers la carte
      const acc = P(lt, ACC, 0.8, E.inQ);
      s.rl.style.transform = `translateY(${(-((lt * 1150) % (66 * 60)) - 60).toFixed(1)}px)`;
      tf(s.st, { x: 520 * acc, sy: 1 - 0.95 * acc, sx: 1 - 0.5 * acc, o: 1 - P(lt, ACC + 0.5, 0.3) });
      s.st.style.transformOrigin = '100% 50%';
      vis(s.n90, lt, 0.4, ACC + 0.4, { dy: 10, blur: 4 });
      const o = P(lt, ACC + 0.6, 0.4, E.outB);
      tf(s.bc, { s: 0.85 + 0.15 * o, o: P(lt, ACC + 0.6, 0.25), x: -40 * (1 - o) });
      LINES.forEach((l, i) => {
        // la ligne s'écrit avec un curseur ; une fois finie, elle reprend sa mise en forme
        const a = 4.0 + i * 1.3, done = lt >= a + l[1].length / 32 + 0.4;
        if (done) J.setHTML(s.tx[i], l[0]); else type(s.tx[i], l[1], lt, a, 32);
      });
    },
  });

  // ---------------------------------------------------------------- plan 6 · 0:37 Under-delivery? Caught first. (capture : Campaigns)
  const FR = { x: 120, y: 290, w: 1150, h: 647 };
  const DOT = { x: 246 + J.MAP.x + J.MAP.px + 0.6 * J.MAP.pw, y: 68 + J.MAP.y + J.MAP.py + (1 - 0.275) * J.MAP.ph }; // Poltronesofa dans l'interface
  const CAM6 = [[0, FR.w / 2000, 1000, 562.5], [2.0, FR.w / 2000 * 1.06, 1000, 562.5, 2.0], [3.6, FR.w / 2000 * 1.8, DOT.x + 120, DOT.y - 40, 1.5]];
  const KPI = [['27%', 'delivered', 27, '%', ''], ['x4.0', 'pace needed', 4.0, '', 'x'], ['EUR 4,027', 'at risk', 4027, '', 'EUR ']];
  scene({
    id: 'pacing', t0: SH.pacing[0], t1: SH.pacing[1], cls: 'v4', fin: 0,
    css: `
    #sc-pacing .hd{left:120px;top:96px;font-size:84px}
    #sc-pacing .gc{position:absolute;left:124px;top:200px}
    #sc-pacing .fr{left:${FR.x}px;top:${FR.y}px;width:${FR.w}px;height:${FR.h}px}
    #sc-pacing .ui{transform-origin:0 0}
    #sc-pacing .kp{position:absolute;left:1330px;width:470px;height:132px;border-radius:16px;background:#1F2833;border:1.5px solid rgba(163,170,181,.25);padding:18px 26px}
    #sc-pacing .kp b{display:block;font-family:InterTight;font-weight:800;font-size:62px;letter-spacing:-.04em;line-height:1;color:#fff;font-variant-numeric:tabular-nums}
    #sc-pacing .kp span{display:block;margin-top:10px;font:500 26px InterV;color:${K.cob}}
    #sc-pacing .kp.rk{border-color:${K.red};box-shadow:inset 6px 0 0 ${K.red}}
    #sc-pacing .mb{position:absolute;left:1330px;top:790px;width:470px;height:150px;display:flex;gap:10px}
    #sc-pacing .mb div{flex:1;border-radius:12px;padding:10px 12px;font:700 17px InterV;color:#15191E}
    #sc-pacing .tc{position:absolute;left:1478px;top:830px;width:154px;height:96px;border-radius:9px;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.35);padding:10px 12px;color:#15191E}
    #sc-pacing .tc b{display:block;font:800 15px InterTight;letter-spacing:-.01em;line-height:1.2}
    #sc-pacing .tc .ok{position:absolute;right:8px;bottom:8px;width:28px;height:28px;border-radius:50%;background:#2DB84C;color:#fff;display:grid;place-items:center}
    #sc-pacing .tl{position:absolute;left:1330px;top:752px;font:600 24px InterV;color:#fff;display:flex;gap:10px;align-items:center}
    #sc-pacing .tl .ic{color:#2DB84C}`,
    build(el, s) {
      s.dots = J.mapDots();
      el.innerHTML = `<div class="v4h hd">Under-delivery? <span class="o">Caught first.</span></div><div class="gc">${J.gainChip('20 min → 2 min a day')}</div>
        <div class="v4frame fr"><div class="ui">${J.shell()}<div class="pg">${J.pageCampaigns(s.dots)}</div>
          <svg style="position:absolute;left:0;top:0;width:2000px;height:1125px;overflow:visible"><rect class="box" x="${DOT.x - 26}" y="${DOT.y - 26}" width="330" height="52" rx="10" fill="none" stroke="${K.or}" stroke-width="4"/></svg></div></div>
        ${KPI.map((k, i) => `<div class="kp${i === 2 ? ' rk' : ''}" style="top:${290 + i * 152}px"><b>${k[0]}</b><span>${k[1]}</span></div>`).join('')}
        <div class="tl">${ic('circle-check', 26)}Task created</div>
        <div class="mb"><div style="background:${T.s1}">Sev 1</div><div style="background:${T.s2}">Sev 2</div><div style="background:${T.s3}">Sev 3</div></div>
        <div class="tc"><b>Catch up Poltronesofa SVOD</b><span style="font-size:12px;color:${T.red};font-weight:650">EUR 4,027 at risk</span><div class="ok">${ic('check', 16)}</div></div>`;
      s.hd = splitWords($('.hd', el)); s.gc = $('.gc .v4chip', el); s.fr = $('.fr', el); s.ui = $('.fr .ui', el); s.dt = $$('.dt', el);
      s.box = $('.box', el); s.blen = 2 * (330 + 52); s.box.style.strokeDasharray = s.blen;
      s.kp = $$('.kp', el); s.kb = s.kp.map(k => $('b', k)); s.mb = $('.mb', el); s.tc = $('.tc', el); s.ok = $('.tc .ok', el); s.tl = $('.tl', el);
      cue('whoosh', s.t0 + 0.0, { v: 0.5 }); cue('data', s.t0 + 0.6, { d: 1.4 }); cue('swish', s.t0 + 2.2, { v: 0.5 }); cue('alert', s.t0 + 3.5, { v: 0.7 });
      [4.0, 4.6, 5.2].forEach((a, i) => { cue('pop', s.t0 + a, { v: 0.5 }); cue('count', s.t0 + a, { d: 0.8 }); });
      cue('card', s.t0 + 8.0); cue('success', s.t0 + 8.5, { v: 0.6 });
    },
    update(lt, dur, s) {
      revealWords(s.hd, lt, 0.2, { st: 0.1, dy: 40, d: 0.6 });
      vis(s.gc, lt, 6.0, Infinity, { dy: 14, ds: -0.1, ein: E.outB, blur: 4 });
      // la capture monte dans son cadre, léger zoom, puis plongée sur la ligne en retard
      const up = P(lt, 0, 0.6, E.outQi);
      tf(s.fr, { y: 80 * (1 - up), o: P(lt, 0, 0.3) });
      J.camApply(s.ui, J.camAt(CAM6, lt), FR.w, FR.h);
      const X = t => J.MAP.px + t * J.MAP.pw, Y = v => J.MAP.py + (1 - v) * J.MAP.ph;
      s.dots.forEach((d, i) => {
        const k = P(lt, 0.5 + 1.1 * d.t + (d.c === 'g' ? 0 : 0.2), 0.4, E.outB);
        s.dt[i].setAttribute('transform', `translate(${X(d.t).toFixed(1)},${Y(d.v).toFixed(1)}) scale(${Math.max(0.001, k).toFixed(3)})`);
        const lb = s.dt[i].querySelector('.lb'); if (lb) lb.style.opacity = P(lt, 1.8, 0.4).toFixed(3);
        if (d.c === 'r') {
          const ring = s.dt[i].firstElementChild, ph = lt > 2 ? ((lt - 2) * 0.9 + i * 0.27) % 1 : 0;
          ring.setAttribute('r', (d.r + 22 * ph).toFixed(1)); ring.setAttribute('opacity', (lt > 2 ? 0.8 * (1 - ph) : 0).toFixed(3));
        }
      });
      s.box.style.strokeDashoffset = (s.blen * (1 - P(lt, 3.5, 0.6, E.ioC))).toFixed(1);
      // trois chiffres, relevés sur la capture
      KPI.forEach((k, i) => {
        const a = 4.0 + i * 0.6;
        vis(s.kp[i], lt, a, Infinity, { dx: 30, dy: 0, ds: -0.05, ein: E.outB, blur: 6, din: 0.6 });
        const v = k[2] * P(lt, a, 0.8, E.outX);
        const txt = i === 1 ? `x${v.toFixed(1)}` : i === 0 ? `${Math.round(v)}%` : `EUR ${J.fmtInt ? J.fmtInt(v) : new Intl.NumberFormat('en-US').format(Math.round(v))}`;
        if (s.kb[i].textContent !== txt) s.kb[i].textContent = txt;
      });
      // une tâche est créée et tombe dans le tableau
      vis(s.mb, lt, 7.4, Infinity, { dy: 16, blur: 4 });
      const dk = P(lt, 8.0, 0.5, E.outB);
      tf(s.tc, { y: -120 * (1 - dk), o: P(lt, 8.0, 0.2), rz: -6 * (1 - dk) });
      tf(s.ok, { s: P(lt, 8.5, 0.35, E.outB) });
      vis(s.tl, lt, 8.5, Infinity, { dy: 10, blur: 4 });
    },
  });

  // ---------------------------------------------------------------- plan 7 · 0:48 Your voice. Your data.
  const NOTES = ['pacing low on top advertiser', 'check freq cap', 'ask trader for update'];
  const PARAS = [
    ['Hi team,', null],
    ['The Poltronesofa SVOD line is at 27% delivered for 60% of the flight.', 'DSP report'],
    ['The frequency cap is set to 1 a day on 5 lines.', 'SIM ticket'],
    ['Could you raise it to 3 a day and lift the max CPM by Friday?', 'Thread'],
    ['This follows our catch-up playbook. Thanks!', 'SOP'],
  ];
  const DC = { x: 760, y: 230, w: 1040, h: 700 };
  const TY = 2.0, PIL = 3.8, GUARD = 7.0, SEND = 8.6;
  scene({
    id: 'voice', t0: SH.voice[0], t1: SH.voice[1], cls: 'v4', fin: 0,
    css: `
    #sc-voice .hd{left:120px;top:96px;font-size:84px}
    #sc-voice .gc{position:absolute;left:124px;top:200px}
    #sc-voice .nt{position:absolute;left:120px;width:560px;height:76px;border-radius:14px;background:#222B37;border:1.5px dashed rgba(163,170,181,.4);
      display:flex;align-items:center;gap:14px;padding:0 20px;font:500 28px Plex,monospace;color:#E6E9ED;white-space:nowrap}
    #sc-voice .nt .ic{color:${K.or}}
    #sc-voice .dc{left:${DC.x}px;top:${DC.y}px;width:${DC.w}px;height:${DC.h}px;padding:28px 34px;overflow:hidden}
    #sc-voice .dc .bar{display:flex;align-items:center;gap:10px;font:600 17px InterV;color:#4A5057}
    #sc-voice .dc .bar b{font-family:InterTight;font-weight:800;font-size:28px;letter-spacing:-.03em;color:#15191E;margin-right:10px}
    #sc-voice .dc .bar .chp{height:28px;border-radius:14px;padding:0 12px;font-size:15px}
    #sc-voice .dc .to{margin-top:16px;padding:12px 0;border-top:1px solid #E4E0D9;border-bottom:1px solid #E4E0D9;font:500 20px InterV;color:#3A4047}
    #sc-voice .dc .p{margin-top:18px;font:500 27px/1.42 InterV;color:#15191E;min-height:38px}
    #sc-voice .dc .pl{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;margin-left:10px;border-radius:15px;background:#FFE7D6;color:#B23F00;font:650 16px InterV;vertical-align:4px}
    #sc-voice .gd{position:absolute;right:34px;top:26px;height:42px;border-radius:21px;padding:0 18px;display:flex;align-items:center;gap:8px;font:650 18px InterV}
    #sc-voice .gd.a{border:2px solid #5D6B7C;color:#3A4553;background:#fff}
    #sc-voice .gd.b{background:${K.or};color:${K.ink};border:2px solid ${K.or}}
    #sc-voice .sd{position:absolute;right:34px;bottom:28px;height:54px;border-radius:10px;padding:0 28px;display:flex;align-items:center;gap:10px;background:${K.ink};color:#fff;font:700 22px InterV}`,
    build(el, s) {
      el.innerHTML = `<div class="v4h hd">Your voice. <span class="o">Your data.</span></div><div class="gc">${J.gainChip('15 min → 3 min per email')}</div>
        ${NOTES.map((n, i) => `<div class="nt" style="top:${330 + i * 108}px">${ic('pen-line', 24)}${n}</div>`).join('')}
        <div class="v4card dc"><div class="bar"><b>Write</b><span class="chp n">Email</span><span class="chp n">Client or agency</span><span class="chp n">English</span></div>
          <div class="to">To: the trader · Subject: Poltronesofa SVOD, catch-up plan</div>
          ${PARAS.map(p => `<div class="p"><span class="tx"></span>${p[1] ? `<span class="pl">${ic('link', 14)}${p[1]}</span>` : ''}</div>`).join('')}
          <div class="gd a">${ic('lock', 18)}Never sent automatically</div><div class="gd b">${ic('check', 18)}Sent by you</div>
          <div class="sd">${ic('send', 20)}Send</div></div>`;
      s.hd = splitWords($('.hd', el)); s.gc = $('.gc .v4chip', el); s.nt = $$('.nt', el); s.dc = $('.dc', el); s.tx = $$('.dc .tx', el); s.pl = $$('.dc .pl', el);
      s.ga = $('.gd.a', el); s.gb = $('.gd.b', el); s.sd = $('.sd', el);
      s.cur = cursor(el);
      NOTES.forEach((_, i) => cue('pop', s.t0 + 0.3 + i * 0.3, { v: 0.4 }));
      cue('absorb', s.t0 + 1.9, { v: 0.7 }); cue('type', s.t0 + TY, { d: 1.8, fast: 1 });
      PARAS.forEach((p, i) => { if (p[1]) cue('tick', s.t0 + PIL + (i - 1) * 0.5, { v: 0.8 }); });
      cue('lock', s.t0 + GUARD); cue('click', s.t0 + SEND); cue('success', s.t0 + SEND + 0.1, { v: 0.6 });
    },
    update(lt, dur, s) {
      revealWords(s.hd, lt, 0.2, { st: 0.1, dy: 40, d: 0.6 });
      vis(s.gc, lt, 5.0, Infinity, { dy: 14, ds: -0.1, ein: E.outB, blur: 4 });
      vis(s.dc, lt, 0.6, Infinity, { dx: 40, dy: 0, blur: 8 });
      // les notes brutes partent dans le brouillon
      s.nt.forEach((n, i) => {
        const a = 0.3 + i * 0.3, f = P(lt, 1.4 + i * 0.12, 0.6, E.inQ);
        tf(n, { x: 760 * f, y: (-60 + i * 30) * f, s: 1 - 0.5 * f, o: P(lt, a, 0.3) * (1 - P(lt, 1.8 + i * 0.12, 0.25)), b: 6 * f });
        if (lt < a) n.style.visibility = 'hidden';
      });
      // le texte s'écrit paragraphe par paragraphe, puis chaque fait reçoit sa source
      let at = TY;
      PARAS.forEach((p, i) => {
        type(s.tx[i], p[0], lt, at, 60, { caret: lt < TY + 2.2 });
        at += p[0].length / 60 * 0.55;
      });
      s.pl.forEach((pl, i) => tf(pl, { s: P(lt, PIL + i * 0.5, 0.35, E.outB), o: P(lt, PIL + i * 0.5, 0.15) }));
      // garde-fou, puis c'est vous qui envoyez
      const sent = P(lt, SEND + 0.1, 0.3);
      tf(s.ga, { o: P(lt, GUARD, 0.3) * (1 - sent), s: 0.8 + 0.2 * P(lt, GUARD, 0.35, E.outB) });
      tf(s.gb, { o: sent, s: 0.8 + 0.2 * P(lt, SEND + 0.1, 0.35, E.outB) });
      const press = lt > SEND - 0.05 && lt < SEND + 0.15 ? 0.94 : 1;
      tf(s.sd, { s: press, o: P(lt, 1.0, 0.3) });
      s.sd.style.background = lt >= SEND ? K.or : K.ink; s.sd.style.color = lt >= SEND ? K.ink : '#fff';
      moveCursor(s.cur, lt, [[7.6, 1500, 760], [8.4, DC.x + DC.w - 110, DC.y + DC.h - 52]], [SEND], { hide: 10.4 });
    },
  });

  // ---------------------------------------------------------------- plan 8 · 0:59 montage : réunion préparée, demande routée
  const MB = 3.5; // second micro-plan
  const F8 = { x: 285, y: 260, w: 1350, h: 760 };
  scene({
    id: 'montage', t0: SH.montage[0], t1: SH.montage[1], cls: 'v4', fin: 0,
    css: `
    #sc-montage .ha{left:120px;top:110px;font-size:96px}
    #sc-montage .hb{left:120px;top:118px;font-size:78px}
    #sc-montage .cal{position:absolute;left:180px;top:330px;width:560px;height:600px;border-radius:16px;background:#1F2833;border:1.5px solid rgba(163,170,181,.25);padding:20px 24px}
    #sc-montage .cal .hh{font:600 22px InterV;color:${K.cob}}
    #sc-montage .cal .sl{position:absolute;left:24px;right:24px;height:1px;background:rgba(163,170,181,.18)}
    #sc-montage .cal .sl span{position:absolute;left:0;top:-26px;font:500 18px Plex,monospace;color:#6A7482}
    #sc-montage .blk{position:absolute;left:110px;right:24px;top:200px;height:120px;border-radius:10px;background:#2D6CDF;color:#fff;padding:16px 18px;font:700 26px InterV}
    #sc-montage .blk span{display:block;font:500 20px InterV;opacity:.85;margin-top:6px}
    #sc-montage .flip{position:absolute;left:840px;top:330px;width:900px;height:600px;perspective:1600px}
    #sc-montage .fc{position:absolute;inset:0;border-radius:16px;backface-visibility:hidden;padding:34px 40px}
    #sc-montage .fa{background:#2D6CDF;color:#fff;display:grid;place-items:center;font-family:InterTight;font-weight:800;font-size:56px;letter-spacing:-.03em}
    #sc-montage .fb{background:#F4F2EE;color:#15191E;transform:rotateY(180deg)}
    #sc-montage .fb .k{display:flex;align-items:center;gap:10px;font:700 18px InterV;letter-spacing:.12em;color:${K.or}}
    #sc-montage .fb .t{margin-top:10px;font-family:InterTight;font-weight:800;font-size:44px;letter-spacing:-.03em}
    #sc-montage .fb .r{margin-top:30px;display:flex;gap:18px;align-items:flex-start}
    #sc-montage .fb .r i{width:52px;height:52px;border-radius:14px;background:#FFE7D6;color:#B23F00;display:grid;place-items:center;flex:none}
    #sc-montage .fb .r b{display:block;font:750 28px InterV}
    #sc-montage .fb .r span{display:block;font:500 23px InterV;color:#4A5057;margin-top:4px}
    #sc-montage .av{position:absolute;top:470px;width:220px;margin-left:-110px;text-align:center}
    #sc-montage .av i{width:150px;height:150px;border-radius:50%;margin:0 auto;display:grid;place-items:center;background:#222B37;border:3px solid rgba(163,170,181,.4);color:#E6E9ED}
    #sc-montage .av.ow i{border-color:${K.or}}
    #sc-montage .av b{display:block;margin-top:16px;font:700 30px InterV}
    #sc-montage .av span{display:block;margin-top:4px;font:500 22px InterV;color:${K.cob}}
    #sc-montage .rq,#sc-montage .rp{position:absolute;left:0;top:0;width:480px;border-radius:14px;background:#F4F2EE;color:#15191E;padding:18px 22px;box-shadow:0 24px 60px rgba(0,0,0,.45)}
    #sc-montage .rq b,#sc-montage .rp b{display:block;font:750 25px InterV;margin-top:8px}
    #sc-montage .rp{background:#FFF4EC}
    #sc-montage .fr8{left:${F8.x}px;top:${F8.y}px;width:${F8.w}px;height:${F8.h}px}
    #sc-montage .fchip{position:absolute;left:0;top:0;display:flex;gap:10px;align-items:center;height:44px;padding:0 16px;border-radius:9px;background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.2);font-size:15px;font-weight:600}
    #sc-montage .fchip i{width:26px;height:30px;border-radius:4px;background:#1F7A3D;color:#fff;display:grid;place-items:center;font:700 10px InterV;font-style:normal}
    #sc-montage .arw{position:absolute;left:640px;top:540px;width:640px;height:4px;border-radius:2px;background:linear-gradient(90deg,rgba(255,98,0,0),${K.or});transform-origin:0 50%}`,
    build(el, s) {
      el.innerHTML = `<div class="ma"><div class="v4h ha">Walk in ready.</div>
          <div class="cal"><div class="hh">Thursday · your calendar</div>${['09:00', '10:00', '11:00', '12:00'].map((h, i) => `<div class="sl" style="top:${130 + i * 130}px"><span>${h}</span></div>`).join('')}
            <div class="blk">Client call, 10:00<span>Quarterly review · 45 min</span></div></div>
          <div class="flip"><div class="fc fa">${ic('calendar-check', 64)}&nbsp;Client call, 10:00</div>
            <div class="fc fb"><div class="k">${ic('sparkles', 18)}PREP READY</div><div class="t">Client call, 10:00</div>
              <div class="r"><i>${ic('users', 26)}</i><div><b>Who's who</b><span>Client lead, agency trader, account manager</span></div></div>
              <div class="r"><i>${ic('inbox', 26)}</i><div><b>Open requests</b><span>Deal floor check · Q4 recap deck</span></div></div>
              <div class="r"><i>${ic('clock', 26)}</i><div><b>Past engagements</b><span>Last review 12 Sep · 3 follow-ups closed</span></div></div></div></div></div>
        <div class="mbb"><div class="v4h hb">Setup errors? <span class="o">Caught before launch.</span></div>
          <div class="v4frame fr8"><div class="ui">${J.shell()}<div class="pg">${J.pageTrouble()}<div class="fchip"><i>XLS</i>Q4_campaign_setup.xlsx</div></div></div></div></div>`;
      s.ma = $('.ma', el); s.mbb = $('.mbb', el); s.ha = splitWords($('.ha', el)); s.hb = splitWords($('.hb', el));
      s.cal = $('.cal', el); s.blk = $('.blk', el); s.flip = $('.flip', el); s.fa = $('.fa', el); s.fb = $('.fb', el); s.rows = $$('.fb .r', el);
      s.fr8 = $('.fr8', el); s.ui8 = $('.fr8 .ui', el); s.fchip = $('.fchip', el); s.dz = $('.fr8 .dz', el); s.bn = $('.fr8 .bn', el);
      s.tl = $$('.fr8 .tl', el); s.tr = $$('.fr8 .tr', el);
      cue('pop', s.t0 + 0.4, { v: 0.5 }); cue('whoosh', s.t0 + 1.0, { v: 0.5 }); s.rows.forEach((_, i) => cue('tick', s.t0 + 1.7 + i * 0.25, { v: 0.7 }));
      cue('hit', s.t0 + MB, { v: 0.4 }); cue('swish', s.t0 + MB + 0.3, { v: 0.6 }); cue('alert', s.t0 + MB + 1.1, { v: 0.7 }); J.TROWS.forEach((_, i) => cue('tick', s.t0 + MB + 1.5 + i * 0.1, { v: 0.6 }));
    },
    update(lt, dur, s) {
      // micro-plan A : le rendez-vous se retourne, la préparation est prête
      const a = lt < MB;
      s.ma.style.display = a ? '' : 'none'; s.mbb.style.display = a ? 'none' : '';
      if (a) {
        revealWords(s.ha, lt, 0.1, { st: 0.1, dy: 40, d: 0.6 });
        vis(s.cal, lt, 0.1, Infinity, { dy: 30, blur: 6 });
        tf(s.blk, { s: 0.9 + 0.1 * P(lt, 0.4, 0.4, E.outB), o: P(lt, 0.4, 0.2) });
        tf(s.flip, { o: P(lt, 0.5, 0.3), x: 40 * (1 - P(lt, 0.5, 0.4, E.outQi)) });
        const f = 180 * P(lt, 1.0, 0.6, E.ioC);
        s.fa.style.transform = `rotateY(${f.toFixed(1)}deg)`; s.fb.style.transform = `rotateY(${(f - 180).toFixed(1)}deg)`;
        s.rows.forEach((r, i) => vis(r, lt, 1.7 + i * 0.25, Infinity, { dx: -20, dy: 0, blur: 4, din: 0.5 }));
        return;
      }
      // micro-plan B : un export de setup tombe dans Troubleshooting, les erreurs sortent avant le lancement
      const l = lt - MB;
      revealWords(s.hb, l, 0.0, { st: 0.1, dy: 40, d: 0.6 });
      tf(s.fr8, { y: 60 * (1 - P(l, 0, 0.5, E.outQi)), o: P(l, 0, 0.25) });
      J.camApply(s.ui8, { s: F8.w / 2000 * 1.22, x: 1010, y: 610 }, F8.w, F8.h);
      const f = P(l, 0.25, 0.6, E.ioC);
      tf(s.fchip, { x: lerp(1150, 640, f), y: lerp(-60, 186, f), rz: -4 * (1 - f), o: P(l, 0.25, 0.15) * (1 - P(l, 0.9, 0.2)) });
      s.dz.style.borderColor = l > 0.85 && l < 1.4 ? '#F26B0F' : '#9AA0A6';
      vis(s.bn, l, 1.0, Infinity, { dy: 14, blur: 6 });
      s.tl.forEach((t, i) => vis(t, l, 1.2 + i * 0.06, Infinity, { dy: 12, blur: 4 }));
      s.tr.forEach((t, i) => vis(t, l, 1.5 + i * 0.1, Infinity, { dx: -20, dy: 0, blur: 4 }));
    },
  });
})();
