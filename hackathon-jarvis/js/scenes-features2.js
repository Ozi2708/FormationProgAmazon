/* Chapitres 03, 04 et 05 — clients, veille DSP, production */
(function () {
  'use strict';
  const { E, P, tf, vis, count, type, rng, ic, $, $$, clamp, lerp, feature, chapter, cursor, moveCursor, cue, rel } = J;
  const pop = (el, lt, a, o = {}) => vis(el, lt, a, o.b ?? Infinity, Object.assign({ dy: 18, blur: 8, din: 0.7 }, o));

  // =================================================================== 03 · KNOW YOUR CLIENTS
  chapter('c3', TL.c3, '03', 'Know your <span class="hl">clients.</span>');

  // ------------------------------------------------ portefeuille trié par urgence
  // [logo, couleur, nom, agence, activité, score, couleur score, campagne, chips, place finale]
  const CLIENTS = [
    ['BB', '#E7A4B5', 'BabyBio', 'Amnet', '1 thread awaits your reply', '', '', '', [['or', '1 to reply']], 7],
    ['B', '#4A5568', 'BFM', 'Amnet', '1 thread awaits your reply · 2 campaigns to recover · 1 task overdue', 73, 'r', '2026-09 - BFM - NOTORIETE OCTOBRE AMAZON', [['or', '1 to reply'], ['red', '1 task overdue']], 0],
    ['C', '#111111', 'Columbia', 'dentsu · iProspect', '5 active threads this week · risk flagged', '', '', '', [], 6],
    ['DS', '#55657A', 'Disney Studios', 'In House', '1 thread awaits your reply · campaign to watch', 75, 'r', 'Studios-20th Century_Whalefall_FR_In House', [['or', '1 to reply'], ['line', '3 campaigns live']], 1],
    ['E', '#2563EB', 'ENI', 'Amnet', '1 active thread this week · campaign to watch', 73, 'r', '2026-10 - FR - Eni - PLENITUDE - Multi-device', [['line', '1 campaign live']], 4],
    ['S', '#D33A2C', 'Groupe SEB', 'iProspect · Carat · dentsu', 'campaign to watch (One Shopper) · risk flagged', 38, 'a', 'Beverage · CoffeeCrush · FullAuto', [['line', '84 campaigns live']], 8],
    ['H', '#FFFFFF', 'Heroiks / Molecule Science', 'Heroiks · Molecule Science', '4 active threads this week · campaign to watch', 71, 'r', 'Nickel_Automne_Chrome_Pvads_4e', [['line', '2 campaigns live']], 3],
    ['S', '#3730A3', 'Sage', 'Amnet', 'campaign to watch', 58, 'a', '2026-10 - Sage - VOL - Multi-device - AVOD', [['line', '2 campaigns live']], 5],
    ['SP', '#0F766E', 'Santé publique France (GAE)', 'dentsu · Amnet', '3 active threads · 2 campaigns to recover · risk flagged', 60, 'r', '2026-10-01-Changer-VOL-SPF-MoisSansTabac', [['line', '14 campaigns · 2 to recover']], 2],
  ];
  const CRH = 72;
  const slotY = f => (f < 4 ? 46 + f * CRH : 46 + 4 * CRH + 56 + (f - 4) * CRH);
  feature('portfolio', TL.portfolio, {
    kicker: '03 · Know your clients', head: 'Your portfolio,<br><span class="hl">ranked by urgency.</span>',
    sub: 'Replies owed, campaigns to recover, overdue tasks: what needs you now comes first.',
    css: `
    #sc-portfolio .cl{position:absolute;left:0;top:120px;width:1010px;height:840px;padding:26px 28px;overflow:hidden}
    #sc-portfolio .cl-h{display:flex;align-items:baseline;gap:14px}
    #sc-portfolio .cl-s{color:var(--mut);font-size:15px}
    #sc-portfolio .sort{position:absolute;right:28px;top:28px;display:inline-flex;gap:8px;align-items:center;height:36px;padding:0 14px;border-radius:999px;background:var(--ink);color:#fff;font-size:14px;font-weight:600}
    #sc-portfolio .cl-b{position:relative;margin-top:20px}
    #sc-portfolio .gh{position:absolute;left:0;right:0;height:36px;display:flex;align-items:center;gap:10px;font-size:16px;border-bottom:1px solid var(--line2)}
    #sc-portfolio .gh b{font-weight:700}
    #sc-portfolio .gh span{color:var(--mut)}
    #sc-portfolio .gh em{font-style:normal;color:var(--mut);font-size:14px}
    #sc-portfolio .cr{position:absolute;left:0;right:0;top:0;height:${CRH}px;display:flex;align-items:center;gap:16px;border-bottom:1px solid var(--line2);background:#fff}
    #sc-portfolio .cr .sq{width:44px;height:44px;font-size:15px}
    #sc-portfolio .cn{width:220px;flex:none}
    #sc-portfolio .cn b{display:block;font-size:17px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #sc-portfolio .cn span{font-size:13.5px;color:var(--mut)}
    #sc-portfolio .ca{flex:1;min-width:0}
    #sc-portfolio .ca div{font-size:14.5px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #sc-portfolio .ca p{display:flex;gap:8px;align-items:center;font-size:13px;color:var(--mut);margin-top:5px;white-space:nowrap;overflow:hidden}
    #sc-portfolio .ca .badge{height:22px;min-width:30px;font-size:12.5px}
    #sc-portfolio .ca .badge.a{background:#B5761A}
    #sc-portfolio .cc{display:flex;gap:8px;flex:none}
    `,
  }, {
    html: `<div class="card cl">
      <div class="cl-h"><span class="htitle" style="font-size:32px">Clients</span><span class="cl-s">31 clients · 4 to look at now</span></div>
      <span class="sort">${ic('sparkles', 15)}Sorted by urgency</span>
      <div class="cl-b">
        <div class="gh g1" style="top:0"><i class="dot" style="background:var(--red)"></i><b>Look at now</b><span>4</span><em>a reply owed, a campaign to recover or a task overdue</em></div>
        <div class="gh g2" style="top:${46 + 4 * CRH + 10}px"><i class="dot" style="background:var(--or)"></i><b>Active</b><span>11</span><em>activity this week, nothing urgent</em></div>
        ${CLIENTS.map(c => `<div class="cr"><div class="sq" style="background:${c[1]};${c[1] === '#FFFFFF' ? 'color:#111;border:1.5px solid #ddd' : ''}">${c[0]}</div>
          <div class="cn"><b>${c[2]}</b><span>${c[3]}</span></div>
          <div class="ca"><div>${c[4]}</div>${c[5] ? `<p><span class="badge ${c[6]}">${c[5]}</span>${c[7]}</p>` : ''}</div>
          <div class="cc">${c[8].map(ch => `<span class="chip ${ch[0]}">${ch[0] === 'or' ? ic('mail', 13) : ''}${ch[1]}</span>`).join('')}</div></div>`).join('')}
      </div></div>`,
    build(root, s) {
      s.rows = $$('.cr', root).map((el, i) => ({ el, i, fin: CLIENTS[i][9] }));
      s.g = [$('.g1', root), $('.g2', root)]; s.sort = $('.sort', root);
      CLIENTS.forEach((_, i) => cue('tick', s.t0 + 0.5 + i * 0.06, { v: 0.3 }));
      cue('click', s.t0 + 1.45); cue('swish', s.t0 + 1.7, { v: 0.6 });
    },
    update(lt, dur, root, s) {
      vis(s.sort, lt, 1.4, Infinity, { dy: 10, ds: -0.2, din: 0.5, ein: E.outB });
      const k = P(lt, 1.7, 1.0, E.ioC);
      s.rows.forEach(r => {
        const a = P(lt, 0.5 + r.i * 0.06, 0.6, E.outQi);
        const y = lerp(r.i * CRH, slotY(r.fin), k) + 14 * (1 - a);
        const urgent = r.fin < 4;
        tf(r.el, { y, o: a * (urgent ? 1 : lerp(1, 0.55, k)), x: urgent ? 0 : 0 });
        r.el.style.zIndex = urgent ? 2 : 1;
      });
      s.g.forEach((g, i) => pop(g, lt, 2.5 + i * 0.12, { dy: 8 }));
    },
  });

  // ------------------------------------------------ fiche client
  const SPEND = [120, 180, 90, 210, 160, 240, 200, 170, 260, 220, 190, 280, 240, 310, 260, 300, 350, 420, 380, 520, 690, 840, 1020, 1380, 1650, 1920, 2180, 2420, 2731, 2600];
  feature('sheet', TL.sheet, {
    kicker: '03 · Know your clients', head: 'One client.<br><span class="hl">One screen.</span>',
    sub: 'Risk, next step, latest emails, live DSP campaigns and their curves.',
    css: `
    #sc-sheet .sh{position:absolute;left:0;top:96px;width:1010px;padding:26px 28px}
    #sc-sheet .sh-h{display:flex;gap:16px;align-items:center}
    #sc-sheet .sh-s{color:var(--mut);font-size:15px;margin-top:2px}
    #sc-sheet .sh-c{display:flex;gap:8px;margin-left:auto}
    #sc-sheet .risk{display:flex;gap:12px;align-items:center;margin-top:18px;padding:14px 18px;border-radius:14px;background:#FDF0EE;border:1.5px solid #F2B8B0;font-size:16px;color:var(--ink2)}
    #sc-sheet .risk b{color:var(--red)}
    #sc-sheet .risk .dot{width:14px;height:14px;background:var(--red)}
    #sc-sheet .nx{display:flex;gap:14px;margin-top:12px;padding:14px 18px;border-radius:14px;background:#F7F5F1;font-size:15.5px;line-height:1.5;color:var(--ink)}
    #sc-sheet .nx .ic{color:var(--or);margin-top:3px}
    #sc-sheet .nx .lbl{margin-bottom:4px}
    #sc-sheet .row{display:grid;grid-template-columns:1.05fr 1fr;gap:14px;margin-top:14px}
    #sc-sheet .cp,#sc-sheet .ch{padding:16px 18px}
    #sc-sheet .cp-h{display:flex;gap:10px;align-items:center;font-weight:700;font-size:15.5px}
    #sc-sheet .cp-b{display:flex;align-items:center;gap:12px;margin:14px 0 12px;font-size:14px;color:var(--mut)}
    #sc-sheet .pb{position:relative;flex:1;height:9px;border-radius:9px;background:#F0D6CF}
    #sc-sheet .pb i{position:absolute;left:0;top:0;bottom:0;border-radius:9px;background:var(--red)}
    #sc-sheet .pb b{position:absolute;top:-5px;bottom:-5px;width:3px;background:var(--or);left:29%}
    #sc-sheet .kg{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    #sc-sheet .kk{border:1px solid var(--line2);border-radius:12px;padding:10px 12px}
    #sc-sheet .kv{font-family:InterTight;font-weight:700;font-size:26px;margin-top:4px;font-variant-numeric:tabular-nums}
    #sc-sheet .ks{font-size:12.5px;color:var(--mut);margin-top:2px}
    #sc-sheet .kv.r{color:var(--red)}
    #sc-sheet .up{color:var(--grn);font-weight:650}
    #sc-sheet svg{display:block;width:100%;height:200px;overflow:visible;margin-top:10px}
    #sc-sheet .ml{display:flex;gap:12px;align-items:center;margin-top:14px;padding:12px 16px;font-size:15px}
    #sc-sheet .ml b{font-weight:650}
    #sc-sheet .ml em{font-style:normal;color:var(--mut);font-size:13.5px}
    `,
  }, {
    html: `<div class="card sh">
      <div class="sh-h s0"><div class="sq" style="background:#4A5568;width:58px;height:58px;font-size:22px">B</div><div><div class="htitle" style="font-size:40px">BFM</div><div class="sh-s">Client · Amnet · Banque Française Mutualiste</div></div>
        <div class="sh-c"><span class="chip line">1 thread waits for you</span><span class="chip line">2 campaigns to recover</span><span class="chip red">1 task overdue</span></div></div>
      <div class="risk s1"><i class="dot"></i><div><b>Risk</b> · ~€51,000 at risk: pace far too low on SVOD and CUTV, no thread with the agency yet.</div></div>
      <div class="nx s2">${ic('arrow-right', 18)}<div><div class="lbl">next step</div>Follow tickets P529341292 and P529520879, chase Amnet and the publishers on SVOD and CUTV: max bid vs floor, targeting, PMP creatives. <b>39 flight days left</b> (ends 15/11).</div></div>
      <div class="row">
        <div class="flat cp s3"><div class="cp-h">DSP campaigns · FR - BFM<span class="chip red mono" style="height:22px;font-size:11px">under-delivery</span></div>
          <div class="cp-b"><div class="pb"><i></i><b></b></div><span><b style="color:var(--red)">14%</b> delivered · 29% of time</span></div>
          <div class="kg"><div class="kk"><div class="lbl">spent</div><div class="kv">€<span class="k1">0</span>k</div><div class="ks">of €137k</div></div>
            <div class="kk"><div class="lbl">pace 7 d</div><div class="kv">€<span class="k2">0</span></div><div class="ks">/day · €2,940 required</div></div>
            <div class="kk"><div class="lbl">week</div><div class="kv">€<span class="k3">0</span>k</div><div class="ks"><span class="up">▲ +285%</span> vs prior 7 d</div></div>
            <div class="kk"><div class="lbl">at risk</div><div class="kv r">€<span class="k4">0</span></div><div class="ks">ends 15/11</div></div></div></div>
        <div class="flat ch s4"><div class="lbl">spend per day · 30 d · line: 7-day average</div>
          <svg viewBox="0 0 440 200"><rect x="${440 - 7 * 14.6}" y="0" width="${7 * 14.6}" height="186" fill="#FFF4EC"/>
            <text x="4" y="14" style="font:500 12px Plex,monospace;fill:#9AA0A6">€2,731</text><line x1="0" y1="20" x2="440" y2="20" stroke="#EFEBE5" stroke-dasharray="4 4"/>
            ${SPEND.map((v, i) => `<rect class="bar" x="${i * 14.6 + 2}" y="0" width="10.6" height="0" rx="2" fill="${i >= 23 ? '#9AA3AD' : '#C9CED4'}" data-v="${v}"/>`).join('')}
            <path class="avg" fill="none" stroke="#D23B2E" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><line x1="0" y1="186" x2="440" y2="186" stroke="#D9D4CC"/></svg></div>
      </div>
      <div class="flat ml s5">${ic('mail', 18)}<b>RMC-BFM x Amazon - Déjeuner</b><em>Andre Dutard · waiting on you · 27 working days</em><span style="flex:1"></span><span class="btn" style="height:34px;font-size:13.5px">${ic('zap', 14)}Kiro reply</span></div>
    </div>`,
    build(root, s) {
      s.sec = [0, 1, 2, 3, 4, 5].map(i => $('.s' + i, root)); s.kv = ['.k1', '.k2', '.k3', '.k4'].map(q => $(q, root)); s.pb = $('.pb i', root);
      s.bars = $$('.bar', root); s.avg = $('.avg', root);
      const pts = SPEND.map((v, i) => { const a = SPEND.slice(Math.max(0, i - 6), i + 1); const m = a.reduce((x, y) => x + y, 0) / a.length; return [i * 14.6 + 7.3, 186 - m / 2731 * 166]; });
      s.avg.setAttribute('d', 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L'));
      cue('pop', s.t0 + 0.75, { v: 0.5 }); cue('alert', s.t0 + 0.8, { v: 0.4 }); cue('count', s.t0 + 1.7, { d: 1.4 }); cue('rise', s.t0 + 2.0, { d: 1.6 });
    },
    update(lt, dur, root, s) {
      [0.35, 0.75, 1.05, 1.4, 1.6, 2.2].forEach((a, i) => pop(s.sec[i], lt, a));
      count(s.kv[0], lt, 1.7, 1.3, 0, 19.3, { dec: 1 }); count(s.kv[1], lt, 1.75, 1.3, 0, 2186); count(s.kv[2], lt, 1.8, 1.3, 0, 15.3, { dec: 1 }); count(s.kv[3], lt, 1.85, 1.4, 0, 50847);
      s.pb.style.width = (14 * P(lt, 1.7, 1.2, E.outQu)).toFixed(2) + '%';
      s.bars.forEach((b, i) => { const k = P(lt, 2.0 + i * 0.045, 0.6, E.outQu); const hh = +b.dataset.v / 2731 * 166 * k; b.setAttribute('y', (186 - hh).toFixed(1)); b.setAttribute('height', hh.toFixed(1)); });
      if (!s.len) { s.len = s.avg.getTotalLength(); s.avg.style.strokeDasharray = s.len; }
      s.avg.style.strokeDashoffset = (s.len * (1 - P(lt, 3.3, 1.2, E.ioC))).toFixed(1);
      // rythme du risque
      const r = lt > 1.0 ? 0.5 + 0.5 * Math.sin((lt - 1.0) * 3.2) : 0;
      s.sec[1].style.boxShadow = `0 0 0 ${(5 * r).toFixed(1)}px rgba(200,55,44,${(0.1 * r).toFixed(3)})`;
    },
  });

  // =================================================================== 04 · STAY AHEAD
  chapter('c4', TL.c4, '04', 'Stay <span class="hl">ahead.</span>');

  const NEWS = [
    ['process', 'Program Lighthouse: PSC-T owns troubleshooting tickets', 'Time-to-resolution program: tickets stay with PSC-T, clearer escalation criteria. FR in scope.', 'Follow the escalation criteria and aim for first-contact resolution'],
    ['process', 'VOC tracker on the new DSP UI · rollout 30/11', '18 issues identified in 4 categories. FR frictions go through a Salesforce CLF.', 'Report my issues on the new DSP UI via a CLF before 30/11'],
    ['available', 'Streaming TV Plus without Twitch', 'New STV+ bundle (Prime Video, Fire TV Channels, APD) via deals, with an L8 Finance exception.', 'Check FR availability and the L8 exception before proposing'],
    ['process', 'EU PSC Updates in 5 sentences', 'Waypoint / Express Lane for troubleshooting, SOP for Prime Big Deal Days.', 'Follow the Prime Big Deal Days SOP and report trader VOC'],
  ];
  feature('news', TL.news, {
    kicker: '04 · Stay ahead', head: '739 updates.<br><span class="hl">One recap.</span>',
    sub: 'DSP news centralized and summarized, with what needs your action on top. Slack included.',
    css: `
    #sc-news .head .w:first-child{font-variant-numeric:tabular-nums}
    #sc-news .kp{position:absolute;left:0;top:96px;width:1010px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
    #sc-news .kpi{display:flex;gap:12px;align-items:center;padding:16px 14px}
    #sc-news .kpi .ki{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex:none}
    #sc-news .kpi b{display:block;font-family:InterTight;font-size:30px;line-height:1}
    #sc-news .kpi span{font-size:12.5px;color:var(--mut);line-height:1.2;display:block;margin-top:4px}
    #sc-news .rc{position:absolute;left:0;top:214px;width:1010px;padding:20px 24px}
    #sc-news .rc-h{display:flex;gap:12px;align-items:baseline}
    #sc-news .rc-t{display:flex;gap:12px;align-items:center;margin-top:12px}
    #sc-news .rc-t b{font-size:17px}
    #sc-news .rc-t em{font-style:normal;color:var(--mut);font-size:14px}
    #sc-news .rc-t .sp{flex:1}
    #sc-news .rc-p{font-size:15px;color:var(--ink2);margin-top:6px;max-width:690px;line-height:1.5}
    #sc-news .fd{position:absolute;left:0;top:432px;width:1010px;height:600px;overflow:hidden;-webkit-mask-image:linear-gradient(#000 82%,transparent)}
    #sc-news .nw{position:absolute;left:0;right:0;top:0;display:flex;gap:18px;padding:18px 20px}
    #sc-news .nw .tg{width:118px;flex:none}
    #sc-news .nw .bd{flex:1;min-width:0}
    #sc-news .nw .tt{font-weight:700;font-size:17px}
    #sc-news .nw .ds{font-size:14.5px;color:var(--mut);margin-top:5px;line-height:1.45}
    #sc-news .nw .ac{width:250px;flex:none;border-radius:12px;background:var(--orbg);border-left:3px solid var(--or);padding:10px 12px;font-size:14px;font-weight:600;color:var(--ink);line-height:1.35}
    #sc-news .nw .ac .lbl{color:var(--or);margin-bottom:4px;font-size:11px}
    #sc-news .slack{position:absolute;left:760px;top:350px;width:270px;padding:14px 16px;display:flex;gap:12px;align-items:center;z-index:5}
    #sc-news .slack .lg{width:46px;height:46px;border-radius:12px;background:#4A154B;color:#fff;display:grid;place-items:center;flex:none}
    #sc-news .slack b{font-size:16px;display:flex;gap:6px;align-items:center}
    #sc-news .slack span{font-size:12.5px;color:var(--mut)}
    `,
  }, {
    html: `<div class="kp">${[['zap', '#1F8A5B', '#E3F3EA', 8, 'available this month'], ['refresh-cw', '#B5761A', '#FBF0DC', 20, 'process changes this month'], ['x', '#C8372C', '#FCEBE8', 24, 'deprecations'], ['flag', '#C8372C', '#FCEBE8', 6, 'incidents ongoing'], ['circle-check', '#F2661B', '#FFF0E6', 335, 'actions on my side']]
        .map(k => `<div class="card kpi"><div class="ki" style="background:${k[2]};color:${k[1]}">${ic(k[0], 19)}</div><div><b data-v="${k[3]}">0</b><span>${k[4]}</span></div></div>`).join('')}</div>
      <div class="card rc"><div class="rc-h"><span class="htitle" style="font-size:20px">Thursday recap</span><span class="lbl" style="letter-spacing:.04em;text-transform:none">every Thursday at 07:45, ready for the PSC FR meeting</span></div>
        <div class="rc-t"><b>News DSP · week of 30/09 to 07/10</b><em>25 news · ready 07/10 15:55</em><span class="sp"></span><span class="btn ink" style="height:36px;font-size:14px">${ic('presentation', 15)}Make the deck</span><span class="btn" style="height:36px;font-size:14px">${ic('file', 15)}Document</span></div>
        <div class="rc-p">The AST-PSC split on 16/10 makes us sole owners of our accounts, and Waypoint is mandatory for every delivery escalation since 01/10.</div></div>
      <div class="fd">${NEWS.map(n => `<div class="card nw"><div class="tg"><span class="chip ${n[0] === 'process' ? 'amb' : 'grn'} mono" style="height:24px;font-size:11px">${n[0]}</span></div><div class="bd"><div class="tt">${n[1]}</div><div class="ds">${n[2]}</div></div><div class="ac"><div class="lbl">action for me</div>${n[3]}</div></div>`).join('')}
</div>
      <div class="card slack"><div class="lg">${ic('hash', 24)}</div><div><b>Slack ${ic('circle-check', 16, 'color:var(--grn)')}</b><span>connected · #psc-fr · #ads-dsp-support</span></div></div>`,
    build(root, s) {
      s.kpis = $$('.kpi', root); s.rc = $('.rc', root); s.items = $$('.nw', root); s.slack = $('.slack', root); s.acs = $$('.nw .ac', root);
      s.n739 = s.hw[0];
      s.kpis.forEach((_, i) => cue('tick', s.t0 + 0.5 + i * 0.08, { v: 0.35 }));
      cue('count', s.t0 + 0.14, { d: 1.4 }); cue('pop', s.t0 + 1.2);
      [2.2, 2.9, 3.6, 4.3].forEach(a => cue('swoosh-up', s.t0 + a, { v: 0.35 }));
      cue('ping', s.t0 + 5.6, { v: 0.8 });
    },
    update(lt, dur, root, s) {
      count(s.n739, lt, 0.14, 1.5, 0, 739);
      s.kpis.forEach((k, i) => { pop(k, lt, 0.5 + i * 0.08); const b = $('b', k); count(b, lt, 0.5 + i * 0.08, 1.1, 0, +b.dataset.v); });
      pop(s.rc, lt, 1.2);
      const scroll = 150 * P(lt, 7.2, 2.6, E.ioC);
      let y = 0;
      s.items.forEach((it, i) => {
        if (!it._h) it._h = it.offsetHeight || 120;
        const a = 2.2 + i * 0.7;
        const k = P(lt, a, 0.8, E.outQi);
        tf(it, { y: y + 60 * (1 - k) - scroll, o: P(lt, a, 0.5), b: 8 * (1 - k) });
        y += it._h + 12;
        const g = P(lt, a + 0.5, 0.5);
        s.acs[i].style.boxShadow = `0 0 0 ${(4 * g * (1 - P(lt, a + 1.2, 0.8))).toFixed(1)}px rgba(242,102,27,.25)`;
      });
      const sk = P(lt, 5.5, 0.8, E.outB);
      tf(s.slack, { x: 140 * (1 - sk), o: P(lt, 5.5, 0.4), b: 10 * (1 - P(lt, 5.5, 0.6)) });
    },
  });

  // =================================================================== 05 · CREATE IN SECONDS
  chapter('c5', TL.c5, '05', 'Create in <span class="hl">seconds.</span>');

  // ------------------------------------------------ une phrase, un deck
  const PROMPT = "Make the PowerPoint for Thursday's PSC team meeting.";
  const SLIDES = [
    ['title', 'Weekly PSC FR', 'October 8, 2026'], ['list', 'Agenda'], ['pacing', 'Pacing overview'], ['hot', 'Hot spots'],
    ['news', 'News DSP'], ['win', 'Wins of the week'], ['wbr', 'WBR highlights'], ['next', 'Next steps'],
  ];
  function slideHTML(sl) {
    const [k, t, sub] = sl;
    const lines = n => Array.from({ length: n }, (_, i) => `<i style="width:${88 - i * 12}%"></i>`).join('');
    let body = '';
    if (k === 'title') return `<div class="sl dark"><div class="sl-brand">amazon ads</div><div class="sl-big">${t}</div><div class="sl-sub">${sub}</div><div class="sl-bar"></div></div>`;
    if (k === 'list') body = `<div class="sl-lines">${lines(4)}</div>`;
    if (k === 'pacing') body = `<div class="sl-stk"><i style="width:12%;background:#D23B2E"></i><i style="width:38%;background:#D18E1C"></i><i style="width:50%;background:#2E9E6A"></i></div><div class="sl-sc">${[[10, 70], [22, 62], [35, 50], [50, 38], [64, 26], [80, 14], [28, 84], [36, 80]].map(([x, y], i) => `<b style="left:${x}%;top:${y}%;background:${i > 5 ? '#D23B2E' : '#2E9E6A'}"></b>`).join('')}</div>`;
    if (k === 'hot') body = `<div class="sl-rows">${['BFM · SVOD', 'Disney · Whalefall', 'GAE · SPF M6'].map(r => `<div><b></b>${r}</div>`).join('')}</div>`;
    if (k === 'news') body = `<div class="sl-lines">${lines(3)}</div><div class="sl-tags"><span>process</span><span>available</span></div>`;
    if (k === 'win') body = `<div class="sl-num">+2</div><div class="sl-lines">${lines(2)}</div>`;
    if (k === 'wbr') body = `<div class="sl-two"><div></div><div></div></div>`;
    if (k === 'next') body = `<div class="sl-chk">${[1, 2, 3].map(() => `<div><b></b><i></i></div>`).join('')}</div>`;
    return `<div class="sl"><div class="sl-t">${t}</div>${body}<div class="sl-ft">amazon ads</div></div>`;
  }
  const SW = 232, SH = 131, SG = 18;
  feature('deck', TL.deck, {
    kicker: '05 · Create in seconds', head: 'One sentence.<br><span class="hl">One deck.</span>',
    sub: 'Recaps, email drafts, ticket comments, PowerPoint decks: just ask.',
    css: `
    #sc-deck .pr{position:absolute;left:0;top:250px;width:1000px;height:86px;border-radius:999px;background:var(--navy);display:flex;align-items:center;gap:16px;padding:0 14px 0 28px;color:#fff;box-shadow:0 30px 80px -20px rgba(35,47,62,.5)}
    #sc-deck .pr .ic{color:#FFB547}
    #sc-deck .pr-t{flex:1;font-size:24px;letter-spacing:-.01em;white-space:nowrap;overflow:hidden}
    #sc-deck .pr-t .ph{color:#7D8A99}
    #sc-deck .pr-go{width:60px;height:60px;border-radius:50%;background:var(--or);display:grid;place-items:center}
    #sc-deck .pr-go .ic{color:#fff}
    #sc-deck .stt{position:absolute;left:28px;top:362px;display:flex;gap:10px;align-items:center;font-size:16px;color:var(--mut)}
    #sc-deck .stt b{color:var(--ink);font-weight:650}
    #sc-deck .spin{width:18px;height:18px;border-radius:50%;border:2.5px solid #E2DDD5;border-top-color:var(--or)}
    #sc-deck .ok{color:var(--grn);display:none}
    #sc-deck .sl{position:absolute;left:0;top:0;width:${SW}px;height:${SH}px;border-radius:10px;background:#fff;border:1px solid var(--line);box-shadow:0 20px 50px -14px rgba(35,47,62,.3);padding:12px 14px;overflow:hidden}
    #sc-deck .sl.dark{background:linear-gradient(140deg,#232F3E,#131A23);color:#fff;border-color:#232F3E}
    #sc-deck .sl-brand{font-weight:800;font-size:11px;letter-spacing:-.03em;color:#fff}
    #sc-deck .sl-big{font-family:InterTight;font-weight:700;font-size:22px;margin-top:22px;letter-spacing:-.02em}
    #sc-deck .sl-sub{font-size:11px;color:#AEB8C4;margin-top:2px}
    #sc-deck .sl-bar{position:absolute;left:14px;bottom:14px;width:46px;height:4px;border-radius:4px;background:#FF9900}
    #sc-deck .sl-t{font-family:InterTight;font-weight:700;font-size:14px;color:var(--ink)}
    #sc-deck .sl-ft{position:absolute;left:14px;bottom:8px;font-weight:800;font-size:8px;color:#C4C9CF}
    #sc-deck .sl-lines{margin-top:10px;display:flex;flex-direction:column;gap:7px}
    #sc-deck .sl-lines i{display:block;height:5px;border-radius:5px;background:#E6E2DB}
    #sc-deck .sl-stk{display:flex;gap:2px;height:7px;margin-top:9px;border-radius:5px;overflow:hidden}
    #sc-deck .sl-stk i{display:block;height:100%}
    #sc-deck .sl-sc{position:relative;height:56px;margin-top:8px;border-left:1px solid #E6E2DB;border-bottom:1px solid #E6E2DB}
    #sc-deck .sl-sc b{position:absolute;width:7px;height:7px;border-radius:50%}
    #sc-deck .sl-rows{margin-top:8px;font-size:10.5px;font-weight:600;color:var(--ink2);display:flex;flex-direction:column;gap:6px}
    #sc-deck .sl-rows b{display:inline-block;width:8px;height:8px;border-radius:50%;background:#D23B2E;margin-right:6px}
    #sc-deck .sl-tags{display:flex;gap:6px;margin-top:9px}
    #sc-deck .sl-tags span{font:500 8px Plex,monospace;text-transform:uppercase;padding:3px 6px;border-radius:9px;background:#FBF0DC;color:#B5761A}
    #sc-deck .sl-tags span+span{background:#E3F3EA;color:#1F8A5B}
    #sc-deck .sl-num{font-family:InterTight;font-weight:700;font-size:30px;color:#1F8A5B;margin-top:2px}
    #sc-deck .sl-two{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
    #sc-deck .sl-two div{height:60px;border-radius:7px;background:#F6F4F0;border-top:3px solid #F2661B}
    #sc-deck .sl-two div+div{border-top-color:#1F8A5B}
    #sc-deck .sl-chk{margin-top:10px;display:flex;flex-direction:column;gap:9px}
    #sc-deck .sl-chk div{display:flex;gap:7px;align-items:center}
    #sc-deck .sl-chk b{width:9px;height:9px;border-radius:2px;border:1.5px solid #9AA0A6}
    #sc-deck .sl-chk i{flex:1;height:5px;border-radius:5px;background:#E6E2DB}
    #sc-deck .file{position:absolute;left:0;top:${420 + 2 * SH + SG + 40}px;display:flex;gap:12px;align-items:center;padding:12px 18px 12px 12px}
    #sc-deck .file .fi{width:44px;height:44px;border-radius:10px;background:#C43E1C;color:#fff;display:grid;place-items:center;font:700 13px InterV}
    #sc-deck .file b{display:block;font-size:16px}
    #sc-deck .file span{font-size:13px;color:var(--mut)}
    #sc-deck .file .chip{margin-left:16px}
    `,
  }, {
    html: `<div class="pr">${ic('sparkles', 26)}<div class="pr-t"></div><div class="pr-go">${ic('arrow-right', 26)}</div></div>
      <div class="stt"><span class="spin"></span><span class="ok">${ic('circle-check', 18)}</span><span class="st-tx">agent Kiro is drafting · Amazon Ads design system</span></div>
      <div class="sls">${SLIDES.map(slideHTML).join('')}</div>
      <div class="card file"><div class="fi">PPTX</div><div><b>Weekly PSC FR · 8 October.pptx</b><span>8 slides · 72 KB · agent Kiro · saved to Documents</span></div><span class="chip grn">${ic('check', 13)}ready</span></div>`,
    build(root, s) {
      s.pt = $('.pr-t', root); s.go = $('.pr-go', root); s.stt = $('.stt', root); s.spin = $('.spin', root); s.ok = $('.ok', root); s.stx = $('.st-tx', root);
      s.sl = $$('.sl', root); s.file = $('.file', root);
      cue('type', s.t0 + 0.6, { d: PROMPT.length / 36 }); cue('click', s.t0 + 2.2); cue('whoosh', s.t0 + 2.3, { v: 0.5 });
      SLIDES.forEach((_, i) => cue('card', s.t0 + 2.75 + i * 0.12, { v: 0.5 }));
      cue('success', s.t0 + 4.3);
    },
    update(lt, dur, root, s) {
      if (lt < 0.6) J.setHTML(s.pt, '<span class="ph">Ask Kiro anything…</span>');
      else type(s.pt, PROMPT, lt, 0.6, 36, { caret: lt < 2.2 });
      const press = lt > 2.1 && lt < 2.4 ? 1 - 0.12 * Math.sin((lt - 2.1) / 0.3 * Math.PI) : 1;
      tf(s.go, { s: press });
      pop(s.stt, lt, 2.4, { dy: 8 });
      const done = lt > 4.3;
      s.spin.style.display = done ? 'none' : ''; s.ok.style.display = done ? '' : 'none';
      s.spin.style.transform = `rotate(${lt * 400}deg)`;
      s.stx.innerHTML = done ? '<b>8 slides ready</b> · Amazon Ads design system · 72 KB' : 'agent Kiro is drafting · Amazon Ads design system';
      s.sl.forEach((el, i) => {
        const a = 2.75 + i * 0.12, k = P(lt, a, 0.9, E.outX);
        const tx = (i % 4) * (SW + SG), ty = 420 + Math.floor(i / 4) * (SH + SG);
        const sx = 820, sy = 270;
        tf(el, { x: lerp(sx, tx, k), y: lerp(sy, ty, k), s: lerp(0.3, 1, k), rz: (1 - k) * (i % 2 ? 14 : -14), o: P(lt, a, 0.25) });
      });
      vis(s.file, lt, 4.4, Infinity, { dy: 26, blur: 10 });
    },
  });

  // ------------------------------------------------ préparé la veille
  const DOCS = [
    ['brain', 'Meeting AST-PSC Dentsu // Jos-Valentin', 'preparation', 'requested 6 d ago', 'writing'],
    ['calendar', '2026 H2 FR PSC Meeting + PAM', 'Preparation', '07/10 17:33', 'eve', 'meeting 08/10 11:00'],
    ['file-text', 'News DSP · week of 30/09 to 07/10', 'Document', '07/10 15:55', ''],
    ['file-text', 'Weekly PSC FR · October 8, 2026', 'Document', '07/10 15:08', 'deck'],
    ['file-text', 'Ticket comment P529341292', 'Ticket comment', '07/10 15:01', 'bfm'],
    ['file-text', 'Mail draft: ENI Plénitude creatives rejected (IAS pixel)', 'Document', '07/10 14:16', 'eni'],
    ['calendar', 'Nintendo test 3P', 'Preparation', '06/10 17:32', 'eve', 'meeting 07/10 16:00'],
  ];
  feature('prep', TL.prep, {
    kicker: '05 · Create in seconds', head: 'Prepared<br><span class="hl">the night before.</span>',
    sub: 'Meeting preps are waiting before you need them. Without asking.',
    css: `
    #sc-prep .dc{position:absolute;left:0;top:120px;width:1010px;padding:24px 26px 10px}
    #sc-prep .dc-h{display:flex;align-items:baseline;gap:14px;margin-bottom:10px}
    #sc-prep .dc-h span:last-of-type{color:var(--mut);font-size:15px}
    #sc-prep .dr{display:flex;gap:16px;align-items:center;padding:15px 0;border-top:1px solid var(--line2)}
    #sc-prep .dr .di{width:42px;height:42px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;flex:none}
    #sc-prep .dr .di.b{background:#2F55D4}
    #sc-prep .dr .di.g{background:#9AA0A6}
    #sc-prep .dr .db{flex:1;min-width:0}
    #sc-prep .dr .dt{font-weight:700;font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #sc-prep .dr .dm{display:flex;gap:10px;align-items:center;margin-top:6px;font-size:13.5px;color:var(--mut);flex-wrap:nowrap;white-space:nowrap}
    #sc-prep .dr .dm .chip{height:24px;font-size:12.5px}
    #sc-prep .eve{background:#FFF0E6;color:#C8510F;font-weight:650;border-radius:999px;padding:3px 10px;display:inline-flex;gap:6px;align-items:center}
    #sc-prep .wr{color:var(--or);font-weight:650;font-size:14px;display:inline-flex;gap:6px;align-items:center}
    #sc-prep .rd{display:flex;gap:10px;align-items:center}
    #sc-prep .rd .btn{height:34px;font-size:13.5px}
    `,
  }, {
    html: `<div class="card dc"><div class="dc-h"><span class="htitle" style="font-size:30px">Documents</span><span>47 produced by Kiro · 8 decks · 1 in progress</span></div>
      ${DOCS.map(d => `<div class="dr ${d[4]}"><div class="di ${d[0] === 'file-text' ? 'b' : d[4] === 'writing' ? 'g' : ''}">${ic(d[0], 19)}</div><div class="db"><div class="dt">${d[1]}</div>
        <div class="dm"><span class="chip line">${d[2]}</span><span>${d[3]}</span>${d[4] === 'eve' ? `<span class="eve">${ic('clock', 13)}prepared the day before, unprompted</span><span>· ${d[5]}</span>` : ''}${d[4] === 'deck' ? `<span class="chip grn">${ic('presentation', 13)}deck · 8 slides</span><span class="chip grn">agent Kiro</span>` : ''}${d[4] === 'bfm' ? '<span><i class="dot" style="background:var(--grn);width:7px;height:7px"></i> BFM · October awareness (Amnet)</span>' : ''}${d[4] === 'eni' ? '<span><i class="dot" style="background:#A0522D;width:7px;height:7px"></i> ENI Plénitude (Amnet)</span>' : ''}</div></div>
        ${d[4] === 'writing' ? `<span class="wr">${ic('brain', 15)}Kiro is writing<b class="dots">…</b></span>` : `<div class="rd"><span class="btn">${ic('file', 14)}Read</span></div>`}</div>`).join('')}</div>`,
    build(root, s) {
      s.rows = $$('.dr', root); s.eves = $$('.eve', root); s.dots = $('.dots', root);
      DOCS.forEach((_, i) => cue('tick', s.t0 + 0.5 + i * 0.1, { v: 0.35 }));
      cue('sparkle', s.t0 + 2.0); cue('sparkle', s.t0 + 2.8, { v: 0.6 });
    },
    update(lt, dur, root, s) {
      s.rows.forEach((r, i) => pop(r, lt, 0.5 + i * 0.1));
      s.eves.forEach((e, i) => {
        const a = 2.0 + i * 0.8, k = P(lt, a, 0.5, E.outB);
        tf(e, { s: 1 + 0.12 * Math.sin(clamp((lt - a) / 0.6) * Math.PI) });
        e.style.boxShadow = lt > a ? `0 0 0 ${(5 * (1 - clamp((lt - a) / 1.2))).toFixed(1)}px rgba(242,102,27,.25)` : 'none';
        void k;
      });
      s.dots.textContent = ['.', '..', '...'][Math.floor(lt * 3) % 3];
    },
  });

  // ------------------------------------------------ WBR
  const WBR = [
    ['context', 'valdemo@ manages BFM\'s October awareness campaign through Amnet: a €136,891 video flight, Sep 21 to Nov 15, across Connected TV SVOD, BVOD CUTV, IPTV and AVOD PMP deals. On the Oct 4 export, SVOD was 2% delivered for 25% of the flight and CUTV 8%.'],
    ['impact', '€54,564 of the €136,891 flight is at risk: €41,876 on Connected TV SVOD and €12,688 on BVOD CUTV. At the current pace both lines land far below budget by Nov 15, while IPTV and AVOD pace ahead.'],
    ['so what', 'The root cause is not identified yet, so there is no confirmed fix timeline. With 41 days of flight left, the €54,564 is still recoverable if the escalation resolves quickly.'],
    ['next steps', 'PSC-T to triage No Delivery tickets P529341292 and P529520879. valdemo@ to relaunch Amnet and the sales houses: max bid vs floor, targeting, creatives. Set the dead Equativ CUTV line to €1 so the algorithm reallocates.'],
  ];
  feature('wbr', TL.wbr, {
    kicker: '05 · Create in seconds', head: 'Your WBR<br><span class="hl">writes itself.</span>',
    sub: 'Highlights and lowlights, drafted from what actually happened this week.',
    css: `
    #sc-wbr .wb{position:absolute;left:0;top:110px;width:1010px;padding:24px 26px}
    #sc-wbr .wb-h{display:flex;align-items:center;gap:14px}
    #sc-wbr .wb-h .sp{flex:1}
    #sc-wbr .wb-e{margin-top:16px;padding:18px 20px}
    #sc-wbr .wb-t{display:flex;align-items:center;gap:12px}
    #sc-wbr .wb-t b{font-size:18px;font-weight:700}
    #sc-wbr .wb-t .sp{flex:1}
    #sc-wbr .wb-c{font-size:13.5px;color:var(--mut)}
    #sc-wbr .wb-g{display:grid;grid-template-columns:1fr 1fr;gap:16px 26px;margin-top:16px}
    #sc-wbr .wb-s .lbl{display:flex;justify-content:space-between;padding-bottom:7px;border-bottom:1px solid var(--line2);margin-bottom:8px}
    #sc-wbr .wb-s .lbl span{color:var(--mut);letter-spacing:.04em;text-transform:none;font-family:InterV;font-size:13px}
    #sc-wbr .wb-x{font-size:14.5px;line-height:1.5;color:var(--ink2);height:158px}
    #sc-wbr .wb-b{display:flex;gap:10px;align-items:center;margin-top:12px;padding-top:14px;border-top:1px solid var(--line2)}
    #sc-wbr .cp.done{background:var(--grn);border-color:var(--grn)}
    #sc-wbr .toast{position:absolute;left:300px;top:930px;display:flex;gap:10px;align-items:center;height:48px;padding:0 20px;border-radius:999px;background:var(--ink);color:#fff;font-size:15.5px;font-weight:600;box-shadow:0 20px 50px rgba(0,0,0,.25)}
    #sc-wbr .toast .ic{color:#5DD39E}
    `,
  }, {
    html: `<div class="card wb"><div class="wb-h"><span class="htitle" style="font-size:28px">WBR of the week</span><span class="lbl" style="letter-spacing:.04em;text-transform:none">highlights & lowlights drafted by the agent, ready to paste</span><span class="sp"></span><span class="chip line">${ic('calendar', 14)}2026-W41</span></div>
      <div class="flat wb-e"><div class="wb-t"><span class="chip red mono">LW</span><b>BFM (Amnet) October Awareness Under-Delivery, €54,564 At Risk</b><span class="sp"></span><span class="chip or">to submit</span><span class="wb-c">Confidence Medium</span></div>
        <div class="wb-g">${WBR.map(w => `<div class="wb-s"><div class="lbl">${w[0]}<span>Copy</span></div><div class="wb-x"></div></div>`).join('')}</div>
        <div class="wb-b"><span class="btn orange cp">${ic('copy', 15)}<em style="font-style:normal">Copy row for Excel</em></span><span class="btn">Copy the 4 sections</span><span class="btn">Edit</span><span class="btn ink">Mark submitted</span></div></div></div>
      <div class="toast">${ic('circle-check', 18)}Row copied · paste it into the WBR tracker</div>`,
    build(root, s) {
      s.x = $$('.wb-x', root); s.cp = $('.cp', root); s.cpt = $('.cp em', root); s.toast = $('.toast', root); s.cur = cursor(root);
      cue('type', s.t0 + 0.9, { d: 3.6, fast: 1 }); cue('click', s.t0 + 5.55); cue('success', s.t0 + 5.75);
    },
    update(lt, dur, root, s) {
      if (!s.m) s.m = rel(s.cp, root);
      WBR.forEach((w, i) => type(s.x[i], w[1], lt, 0.9 + i * 0.45, 165, { caret: lt < 0.9 + i * 0.45 + w[1].length / 165 }));
      moveCursor(s.cur, lt, [[4.7, 760, 980], [5.4, s.m.x + 60, s.m.cy + 4]], [5.55], { hide: 7.4 });
      const done = lt > 5.6;
      s.cp.classList.toggle('done', done); s.cpt.textContent = done ? 'Copied' : 'Copy row for Excel';
      vis(s.toast, lt, 5.75, Infinity, { dy: 30, blur: 8, din: 0.6, ein: E.outB });
    },
  });
})();
