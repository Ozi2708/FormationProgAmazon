/* Film jury v3 — contenu des pages de la plateforme (Today, Campaigns, Troubleshooting, Agenda, WBR, Settings)
   Coordonnées des pages : origine en haut à gauche de la zone de contenu (x 246, y 68 de l'interface). */
(function () {
  'use strict';
  const { ic, esc, T } = J;

  // ---------------------------------------------------------------- Today : briefing de 08:00 + tableau + colonne de droite
  J.BOARD = { x: 34, y: 225, w: 1117, h: 1400, cols: [15, 382, 749], stackTop: 120, gap: 9 };
  J.CARDS = {
    polt: { k: 'polt', icon: 'area-chart', src: 'Poltronesofa', t: 'Catch up Poltronesofa SVOD: it ends today', due: 'Due in 4h', tags: [['g', 'Draft ready'], ['r', '4K € at risk']] },
    dentsu: { k: 'dentsu', icon: 'mail', src: 'Dentsu X - FR · D556070834', t: 'Confirm the Dentsu X AdX seat 8513581120 and close D556070834', due: '14d late' },
    bfm: { k: 'bfm', icon: 'mail', pre: 'FR', src: 'Banque Française Mutualiste (BFM)', t: 'Confirm the BFM fix and let P529341292 be resolved', due: '12d late' },
    deal: { k: 'deal', icon: 'mail', src: 'Deal Builder · FR', t: 'Check the discounted rates in Deal Builder for your entities', due: '2d late' },
    midas: { k: 'midas', icon: 'mail', src: 'MIDAS', t: "Check Claire's MIDAS set-up and send the CRM upload guide", due: 'Due in 1h', tags: [['g', 'Draft ready'], ['k', 'Not yours']] },
    inter: { k: 'inter', icon: 'area-chart', pre: 'FR', src: 'Interbev', t: 'Catch up Interbev Amour Bœuf: CUTV TF1 deal and IPTV Comcast drop', due: 'Due Sun 15 Nov', dueK: 1, tags: [['r', '22.9K € at risk'], ['n mv', 'Moved by you']] },
    gae1: { k: 'gae1', icon: 'area-chart', pre: 'GAE', src: 'Ministère de la transition écologique', t: 'Ask the publisher for a catch-up plan on DentsuAudience PG before 31/10', due: 'Due Sat 31 Oct', dueK: 1, tags: [['r', '3.6K € at risk']] },
    gae2: { k: 'gae2', icon: 'area-chart', pre: 'GAE', src: 'SANTE PUBLIQUE FRANCE', t: 'Check the pace of Santé publique France Gestes Barrières with the publisher', due: 'Due Thu 5 Nov', dueK: 1, tags: [['r', '5.2K € at risk']] },
    qonto: { k: 'qonto', icon: 'hash', src: 'Qonto · 366 (Dentsu)', t: "Read 366's answer on the deal bug and decide the next step", due: 'Due today', own: 'Your input', tags: [['k', 'Not yours']] },
  };
  J.TOP5 = {
    inter: ['Interbev <small>FR</small>', '1 task · 1 order behind', 1, '22.9K €'],
    polt: ['Poltronesofa', '1 task · 2 orders behind', 2, '7K €'],
    shis: ['Shiseido', '1 order behind', 2, ''],
    bfm: ['Banque Française Mutualiste', '1 task', 2, ''],
    midas: ['MIDAS', '1 task', 2, ''],
    disney: ['FR_Disney Studios', '1 order behind', 2, '21.6K €'],
  };
  J.pageToday = (o = {}) => {
    const B = J.BOARD;
    return `<div class="pgi">
      <div class="ab0 kk" style="left:33px;top:29px">${o.kicker || 'Friday 30 Oct · Briefing of 08:00'}</div>
      <div class="ab0 hd h1" style="left:31px;top:47px;font-size:50px;line-height:1.1;white-space:nowrap">${o.h1 || '4 things need you.'}</div>
      <div class="ab0 lead para" style="left:33px;top:110px;width:1060px;font-size:17px">${o.para || 'Claire (Dentsu) waits for your MIDAS check before the 09:45 weekly, and Poltronesofa SVOD ends today at 46% projected, about 4,000 € at risk: both drafts are ready. Six campaign to-dos are behind pace in the DSP report.'}</div>
      <div class="ab0 chips" style="left:33px;top:176px;display:flex;gap:10px">
        ${(o.chips || ['2 drafts ready', '6 about campaigns behind pace', '2 not yours']).map((c, i) => `<span class="chp ${'grn'[i] ? ['g', 'r', 'n'][i] : 'n'}" style="height:31px;border-radius:16px;padding:0 13px;font-size:14px">${c}</span>`).join('')}</div>
      <div class="brd" style="left:${B.x}px;top:${B.y}px;width:${B.w}px;height:${B.h}px">
        <div class="bh"><span class="hd">Your board</span><div class="pb"><i style="width:0%"></i></div><span class="clr"><b>0</b> of 18 cleared today</span></div>
        <span class="btn2 add">${ic('plus', 14)}Add a task</span>
        <div class="col c1" style="left:${B.cols[0]}px"><div class="ch"><div class="a"><i style="background:${T.red}"></i><b>Sev 1</b>Critical</div><div class="s">do it now</div><div class="n">0</div></div>
          <div class="empty">Nothing critical. Breathe.</div><div class="drop">Drop here: Sev 1</div></div>
        <div class="col c2" style="left:${B.cols[1]}px"><div class="ch"><div class="a"><i style="background:${T.or}"></i><b>Sev 2</b>High</div><div class="s">today</div><div class="n">4</div></div></div>
        <div class="col c3" style="left:${B.cols[2]}px"><div class="ch"><div class="a"><i style="background:#8A949E"></i><b>Sev 3</b>Can wait</div><div class="s">this week, or for your information</div><div class="n">12</div></div></div>
        <div class="cards">${Object.values(J.CARDS).map(c => J.card(c)).join('')}${J.doneCard('Confirm the Dentsu X AdX seat 8513581120 and close D556070834', 'done')}</div>
      </div>
      <div class="nm" style="left:1175px;top:177px;width:332px">
        <div class="k">NEXT MEETING · IN 1 H 31</div>
        <div class="r"><span class="hd">09:45</span><div><b>Weekly - Dentsu GAE x Amazon Ads</b><span>Sophie Laurent · 15 min</span></div></div>
        <p>Get a catch-up plan, owner and date, for each GAE campaign behind.</p>
        <ul><li>GAE - Ministère de la transition écologique · DentsuAudience (PG): catch up, 79% delivered at 85% of time, ends 31/10.</li>
          <li>GAE - DICOM · PrendreSoinV1 (PG): watch, 9% delivered at 11% of time, ends 22/11.</li>
          <li>GAE - SANTE PUBLIQUE FRANCE · Gestes Barrières: catch up, 68% delivered at 75% of time, ends 05/11.</li></ul>
        <span class="btn2" style="margin-top:12px">Open prep</span></div>
      <div class="lt" style="left:1175px;top:610px;width:332px"><div class="k">LATER TODAY</div>
        <div class="row"><b>10:00</b><div><b>Meeting AST-PSC Dentsu</b><span>Paul</span></div></div>
        <div class="row"><b>11:00</b><div><b>EU PSC WBR</b><span>Laura Diaz</span></div></div>
        <div class="row"><b>15:00</b><div><b>SME APD</b><span>Thomas Weber</span></div></div></div>
      <div class="t5" style="left:1175px;top:867px;width:332px"><div class="k">TOP 5 ADVERTISERS TO ACT ON</div>
        <div class="rows">${Object.entries(J.TOP5).map(([k, r]) => `<div class="rw s${r[2]}" data-k="${k}"><span class="no">1</span><div class="nm2"><b>${r[0]}</b><span>${r[1]}</span></div><div class="amt"><span class="sv s${r[2]}">Sev ${r[2]}</span>${r[3]}</div></div>`).join('')}</div>
        <div class="ft2">Most severe first, then most urgent.</div></div>
    </div>`;
  };

  // ---------------------------------------------------------------- fenêtre d'une tâche : Poltronesofa SVOD
  J.DRAFT = "Hello Karim,\n\nTu vas bien ?\n\nLa partie SVOD finit aujourd'hui à 27 % de livraison pour 60 % du temps : au rythme actuel, on termine à 46 %, soit environ 4 000 € non livrés.\n\nJe te propose de prolonger le flight de 6 jours, jusqu'au 05/11. Le deal suit les dates du line item, je m'occupe de l'aligner.\nDe notre côté, on monte le CPM max et on allège le daypart dès ce matin.\n\nTu me confirmes la prolongation avant 12 h ?\n\nA dispo";
  J.modal = () => `<div class="dim"></div><div class="mdl"><div class="top"></div>
    <div class="hdr"><div class="crumb"><span class="sv s2">Sev 2</span>High · Poltronesofa · iProspect · ${ic('area-chart', 13)}DSP report</div>
      <div class="mt2 hd">Catch up Poltronesofa SVOD: it ends today</div>
      <div class="chs"><span class="chp r">${ic('clock', 13)}due in 4h</span><span class="chp n">You own it</span><span class="chp r">4K € at risk</span><span class="chp g">${ic('check', 13)}Draft ready</span></div>
      <div class="mv">Move to <i>1</i><i class="on">2</i><i>3</i></div><div class="dn2">${ic('check', 14)}&nbsp;Done</div></div>
    <div class="lc"><div class="ex"><div class="k">WHAT JARVIS EXPECTS FROM YOU</div>
        <div class="big">27% delivered at 60% of time with 2 days left: the projection is 46%, 4,027 € at risk (DSP export of 28/10).</div>
        <div class="sm">You are the one to act. The reply is drafted on the right.</div>
        <div class="cx"><div class="k">THE CONTEXT</div><ul>
          <li>Me: raise the max CPM, widen the audience or lighten the dayparting.</li>
          <li>Agency: extend the flight by 6 days; the deal follows the line item dates (PG 7 days minimum).</li>
          <li>Probable cause, low confidence: bid below the deal floor. Run TWIG on 28/10 to confirm.</li></ul></div>
        <div class="why"><span class="sv s2">Sev 2</span><span><b>High.</b> €4K at risk (amount in the thread), due in 4h (stated), a client is asking, campaign behind.</span></div></div>
      <div class="tiles"><div>Delivered<b>27% at 60% of time</b></div><div>Projection<b>46%</b></div><div>At risk<b>4,027 €</b></div>
        <div>Ends<b>30/10 (2 days)</b></div><div style="grid-column:span 2">Objective<b>needs 2,688 € a day until 30/10, x4.0 the current rate</b></div></div></div>
    <div class="dr"><div class="k">${ic('pen-line', 13)} DRAFT REPLY</div>
      <div class="to"><b>Email</b> · to Karim Benali (iProspect)</div>
      <div class="sj">RE: Poltronesofa Amazon Prime W44</div>
      <div class="bdy"></div>
      <div class="rw2"><div class="q">${ic('sparkles', 16)}How should JARVIS rewrite it? More formal, it goes to a client<span class="btn2">Rewrite with AI</span></div>
        <div class="o"><span>More formal</span><span>Less formal</span><span>For a client</span><span>Warmer</span><span>Shorter</span><span>Firmer</span></div></div>
      <div class="sc"><span class="pill"><b>90</b> /100 Prêt à envoyer</span><span>6 remarques</span></div>
      <div class="bt"><span class="btn2 or cp">${ic('copy', 14)}<span>Copy</span></span><span class="btn2">${ic('mail', 14)}Open in Outlook</span></div></div>
  </div>`;

  // ---------------------------------------------------------------- Campaigns : carte du pacing (56 campagnes)
  const MAP = { x: 34, y: 234, w: 1473, h: 595, px: 78, pw: 1357, py: 79, ph: 404 };
  J.MAP = MAP;
  const RED = [[0.358, 0.285, 22, 'FR - Interbev · 2026-10 - Interbev…', 'r'], [0.6, 0.275, 13, 'Poltronesofa · SD~20261026_ED~2026…', 'r'],
    [0.75, 0.676, 15, 'GAE - SANTE PUBLIQUE FRANCE · 2026…', 'l'], [0.85, 0.79, 15, 'GAE - Ministère de la transition …', 'r']];
  const YEL = [[0.344, 0.36, 16, 'FR - Sage · 2026-10 - Sage - VOL…', 'l'], [0.06, 0.05, 18, 'Qonto · PRIME', 'l'], [0.108, 0.087, 18, 'GAE - DICOM - MINISTERE DE LA SANT…', 'r'],
    [0.31, 0.01, 11, 'FR - Ministère de la Transition Ec…', 'r'], [0.045, 0.035, 12], [0.12, 0.072, 12]];
  const BLU = [[0.344, 0.82, 9], [0.214, 0.22, 17], [0.108, 0.135, 12], [0.11, 0.155, 9]];
  J.mapDots = () => {
    const r = J.rng(31), dots = [];
    for (let i = 0; i < 41; i++) {
      const t = 0.04 + 0.95 * Math.pow(r(), 0.8), d = (r() * 2 - 1) * 0.075 + (r() > 0.85 ? (r() * 2 - 1) * 0.1 : 0);
      dots.push({ t, v: Math.min(1, Math.max(0, t + d)), r: 7 + r() * 10, c: 'g' });
    }
    RED.forEach(d => dots.push({ t: d[0], v: d[1], r: d[2], c: 'r', lb: d[3], side: d[4] }));
    YEL.forEach(d => dots.push({ t: d[0], v: d[1], r: d[2], c: 'y', lb: d[3], side: d[4] }));
    BLU.forEach(d => dots.push({ t: d[0], v: d[1], r: d[2], c: 'b' }));
    dots.push({ t: 0.25, v: 0.45, r: 9, c: 'h' });
    return dots;
  };
  J.pageCampaigns = dots => {
    const X = t => MAP.px + t * MAP.pw, Y = v => MAP.py + (1 - v) * MAP.ph;
    const band = `M${X(0)},${Y(0.1)} L${X(1)},${Y(1.1)} L${X(1)},${Y(0.9)} L${X(0.1)},${Y(0)} L${X(0)},${Y(0)} Z`;
    return `<div class="pgi">
      <div class="ab0 kk" style="left:33px;top:30px;letter-spacing:.04em;text-transform:none">Amazon Ads · Campaign health · DSP report</div>
      <div class="ab0 ttl" style="left:33px;top:50px">Campaigns</div>
      <div class="ab0 lead" style="left:33px;top:100px;width:780px">56 live campaigns in your perimeter from the DSP report, data to Wed 28 Oct, most urgent first. Colours follow your DSP reference: on pace and watch are not problems, ahead is information.</div>
      <div class="ab0" style="left:33px;top:183px;display:flex;gap:10px;align-items:center">
        <span class="btn2" style="width:238px;color:#5E656C">${ic('search', 14)}Search campaigns, advertisers</span>
        <span class="btn2" style="padding:0 4px;gap:0"><span class="chp k" style="height:26px;border-radius:5px;font-size:13px">My perimeter 56</span><span style="padding:0 10px;font-weight:400">One Shopper 106</span><span style="padding:0 10px;font-weight:400">Ended under 7</span></span>
        <span class="btn2" style="width:372px;justify-content:space-between;font-weight:400">All advertisers${ic('chevron-down', 14)}</span>
        <span class="btn2" style="width:196px;justify-content:space-between;font-weight:400">All deal types${ic('chevron-down', 14)}</span></div>
      <div class="box mapc" style="position:absolute;left:${MAP.x}px;top:${MAP.y}px;width:${MAP.w}px;height:${MAP.h}px">
        <div class="ab0 hd" style="left:21px;top:22px;font-size:18px;letter-spacing:-.025em">Pacing map · data to Wed 28 Oct</div>
        <div class="ab0 lgd" style="right:21px;top:17px;display:flex;gap:8px">
          ${[['#E23B4E', '4', 'to catch up'], ['#E6C229', '6', 'to watch'], ['#3B8DE6', '4', 'ahead (info)'], ['#9AA0A6', '41', 'on pace'], ['#fff', '1', 'starting']].map(l =>
            `<span class="btn2" style="height:30px;font-weight:400;font-size:13.5px"><i style="width:8px;height:8px;border-radius:50%;background:${l[0]};border:1px solid ${l[0] === '#fff' ? '#9AA0A6' : l[0]}"></i><b>${l[1]}</b>${l[2]}</span>`).join('')}</div>
        <svg class="ab0" style="left:0;top:0;width:${MAP.w}px;height:${MAP.h}px;overflow:visible">
          ${[0, 0.25, 0.5, 0.75, 1].map(v => `<line x1="${X(0)}" x2="${X(1)}" y1="${Y(v)}" y2="${Y(v)}" stroke="#ECE9E4"/><text x="${X(0) - 10}" y="${Y(v) + 4}" text-anchor="end" font-size="12" fill="#5E656C">${v * 100}%</text>`).join('')}
          ${[0.25, 0.5, 0.75, 1].map(t => `<line x1="${X(t)}" x2="${X(t)}" y1="${Y(1)}" y2="${Y(0)}" stroke="#ECE9E4"/>`).join('')}
          ${[0, 0.25, 0.5, 0.75, 1].map(t => `<text x="${X(t)}" y="${Y(0) + 20}" text-anchor="middle" font-size="12" fill="#5E656C">${t * 100}%</text>`).join('')}
          <text x="${X(0.5)}" y="${Y(0) + 40}" text-anchor="middle" font-size="12.5" fill="#3A4047">Time elapsed</text>
          <text transform="translate(${X(0) - 46},${Y(0.5)}) rotate(-90)" text-anchor="middle" font-size="12.5" fill="#3A4047">Budget spent</text>
          <path class="band" d="${band}" fill="#EEEAE3"/>
          <line class="diag" x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" stroke="#9AA0A6" stroke-dasharray="5 5"/>
          <text x="${X(0) + 12}" y="${Y(1) + 16}" font-size="12.5" fill="#3A4047">On pace ±10 pts</text>
          <text x="${X(1) - 6}" y="${Y(0) - 10}" text-anchor="end" font-size="12.5" fill="#3A4047">Behind ↓</text>
          ${dots.map(d => `<g class="dt" transform="translate(${X(d.t).toFixed(1)},${Y(d.v).toFixed(1)})"><circle class="ring" r="${d.r}" fill="none" stroke="#E23B4E" stroke-width="2" opacity="0"/>
            <circle r="${d.r}" fill="${{ g: '#9AA0A6', r: '#F2385A', y: '#F2D232', b: '#3B9BEA', h: '#fff' }[d.c]}" stroke="${d.c === 'h' ? '#9AA0A6' : '#fff'}" stroke-width="${d.c === 'h' ? 1.5 : 1.2}"/>
            ${d.lb ? `<text x="${d.side === 'l' ? -d.r - 8 : d.r + 8}" y="4" text-anchor="${d.side === 'l' ? 'end' : 'start'}" font-size="13" fill="#15191E" class="lb">${esc(d.lb)}</text>` : ''}</g>`).join('')}
        </svg></div>
    </div>`;
  };

  // ---------------------------------------------------------------- Troubleshooting : contrôle d'un export de setup
  J.TROWS = [
    ['f', 'Order FR_MaisonLumiere_Q4_Awareness', 'The active line items can spend €100,000 of the €120,000 order budget (83%)', 'Raise the line budgets by €20,000, or turn on Automate budget allocation.'],
    ['f', 'Line item FR_ML_Q4_Display_Retargeting', 'Ends on 28/12/2026, after the order (21/12/2026)', 'The line stops with the order: align the dates or extend the order.'],
    ['f', 'Line item FR_ML_Q4_Display_Prospecting_InMarket - Copy', 'No creative attached', 'Attach the creatives: a line item without one does not serve.'],
    ['f', 'Line item FR_ML_Q4_Display_Prospecting_InMarket - Copy', 'The name says FR, the geo targeting says DE', 'Check the geo targeting or the name against the media plan.'],
    ['f', 'Line item FR_ML_Q4_STV_Awareness', 'Starts on 20/10/2026, before the order (03/11/2026)', 'A line item cannot deliver outside its order: align the dates.'],
    ['c', 'Order FR_MaisonLumiere_Q4_Awareness', 'No frequency cap on the order or on any of its line items', 'Set a cap at the order or line item level: uncapped lines over-serve the same users.'],
    ['c', 'Line item FR_ML_Q4_Display_Retargeting', 'Maximum average CPM of 0.45: very low, the line may win almost nothing', 'Check the value (a decimal point in the wrong place?).'],
  ];
  J.pageTrouble = () => `<div class="pgi">
      <div class="ab0 kk" style="left:33px;top:30px;letter-spacing:.04em;text-transform:none">Amazon Ads · Troubleshooting · Setup check</div>
      <div class="ab0 ttl" style="left:33px;top:50px">Troubleshooting</div>
      <div class="ab0 lead" style="left:33px;top:100px;width:780px">Drop the bulk export of a campaign setup: JARVIS lists the errors to fix before launch and writes the overview of the campaign.</div>
      <div class="ab0" style="left:1324px;top:108px"><span class="btn2" style="padding:0 4px;gap:0"><span style="padding:0 10px;font-weight:400;color:#5E656C">SIM tickets</span><span class="chp k" style="height:26px;border-radius:5px;font-size:13px">Setup check</span></span></div>
      <div class="ab0 dz" style="left:33px;top:162px;width:1474px;height:75px;border:1.5px dashed #9AA0A6;border-radius:9px;background:#EFECE6;display:flex;align-items:center;gap:16px;padding:0 18px">
        ${ic('upload', 20)}<div style="flex:1"><b style="font-size:15px">Drop the bulk export of a campaign setup</b><div style="font-size:13px;color:#4A5057;margin-top:3px">Amazon DSP, Campaigns page: Download and upload, then Export settings (.xlsx), or a CSV of one tab. Read here, never sent or saved.</div></div>
        <span class="btn2">Choose a file</span></div>
      <div class="ab0 bn" style="left:33px;top:254px;width:1474px;height:75px;background:#fff;border:1.5px solid #F09AA6;border-left:6px solid ${T.red};border-radius:9px;display:flex;align-items:center;gap:16px;padding:0 18px">
        <span style="color:${T.red}">${ic('triangle-alert', 22)}</span><div style="flex:1"><b style="font-size:17px">5 errors to fix before launch</b><div style="font-size:13px;color:#4A5057;margin-top:3px">Sample export (fictional client)</div></div>
        <span class="btn2">${ic('mail', 14)}Copy for the trader</span></div>
      ${[['Orders', '2', 'Maison Lumière'], ['Line items', '6', '4 display · 2 video'], ['Flight', '03/11 to 31/12', '59 days'], ['Budget', '€180,000', '€3,051 a day'], ['To fix / to check', '5 / 4', '3 notes']].map((k, i) =>
        `<div class="ab0 box tl" style="left:${33 + i * 297}px;top:346px;width:284px;height:93px;padding:15px 16px"><div style="font-size:13px;color:#4A5057">${k[0]}</div><div class="hd" style="font-size:24px;margin-top:6px;${i === 4 ? `color:${T.red}` : ''}">${k[1]}</div><div style="font-size:13px;color:#4A5057;margin-top:4px">${k[2]}</div></div>`).join('')}
      <div class="ab0 box" style="left:33px;top:456px;width:1474px;height:600px;overflow:hidden">
        <div class="hd" style="position:absolute;left:21px;top:20px;font-size:18px;letter-spacing:-.025em">What JARVIS found</div>
        ${J.TROWS.map((r, i) => `<div class="ab0 tr" style="left:0;right:0;top:${60 + i * 66}px;height:66px;border-top:1px solid #ECE9E4;display:flex;gap:14px;padding:9px 8px">
          <span class="chp ${r[0] === 'f' ? 'r' : 'o'}" style="font:600 11px Plex,monospace;letter-spacing:.12em;height:22px;margin-top:2px;${r[0] === 'f' ? 'width:126px' : 'width:46px'};justify-content:center">${r[0] === 'f' ? 'FIX BEFORE LAUNCH' : 'CHECK'}</span>
          <div><div style="font-size:13px;color:#4A5057">${r[1]}</div><b style="display:block;font-size:15px;margin-top:2px">${r[2]}</b><div style="font-size:13px;color:#2E343A;margin-top:2px">${r[3]}</div></div></div>`).join('')}
      </div></div>`;

  // ---------------------------------------------------------------- Agenda + préparation de réunion
  J.pageAgenda = () => `<div class="pgi">
      <div class="ab0 kk" style="left:33px;top:30px;letter-spacing:.04em;text-transform:none">My Book of Business · Agenda</div>
      <div class="ab0 ttl" style="left:33px;top:50px">Agenda</div>
      <div class="ab0 lead" style="left:33px;top:100px;width:780px">The meetings of your week that need you, with what JARVIS prepared. Click one to open its prep.</div>
      <div class="ab0" style="left:33px;top:162px;display:flex;gap:8px;align-items:center"><span class="btn2">Previous week</span><span class="btn2" style="color:#9AA0A6">This week</span><span class="btn2">Next week</span><b class="hd" style="font-size:18px;margin-left:10px">Mon 26 Oct to Fri 30 Oct</b></div>
      ${['Mon 26 Oct', 'Tue 27 Oct', 'Wed 28 Oct', 'Thu 29 Oct', 'Fri 30 Oct'].map((d, i) => `<div class="ab0 box" style="left:${33 + i * 297}px;top:205px;width:286px;height:500px;${i === 4 ? `border:1.5px solid #14181D;border-top:4px solid ${T.or}` : ''}">
        <div style="padding:12px 12px 10px;border-bottom:1px solid ${T.line}"><b class="hd" style="font-size:15px">${d}</b><div style="font-size:13px;color:#5E656C;margin-top:3px">${i === 4 ? '4 meetings · 2 h 15 busy' : '0 meetings · 0 min busy'}</div></div>
        ${i < 4 ? '<div style="padding:12px;font-size:13.5px;color:#3A4047">Nothing that needs you.</div>' : [
          ['09:45 to 10:00', 'Weekly - Dentsu GAE x Amazon Ads', 'Get a catch-up plan, owner and date, for each GAE campaign behind.'],
          ['10:00 to 10:30', 'Meeting AST-PSC Dentsu', 'If Paul asks about MIDAS: the Performance+ line item is set.'],
          ['11:00 to 12:00', 'EU PSC WBR', 'Bring or file the 2 missing WBR entries.'],
          ['15:00 to 15:30', 'SME APD', '']].map((m, j) => `<div class="mtg${j === 0 ? ' m0' : ''}" style="margin:8px;border:1px solid ${T.line};border-left:4px solid #3B8DE6;border-radius:6px;padding:8px 10px;font-size:12.5px;background:#fff">
            <div style="color:#5E656C">${m[0]}</div><b style="display:block;font-size:13.5px;margin-top:2px">${m[1]}</b>${m[2] ? `<div style="margin-top:3px;color:#3A4047">${m[2]}</div><span class="chp" style="margin-top:6px;background:#E6F0FB;color:#2B6CB0;border:1px solid #9CC3EC;height:18px;font-size:10.5px;letter-spacing:.06em">✦ PREP</span>` : ''}</div>`).join('')}</div>`).join('')}
    </div>`;
  J.prepPanel = () => `<div class="prep" style="position:absolute;left:1293px;top:0;width:707px;height:1125px;background:#F7F5F1;box-shadow:-20px 0 60px rgba(0,0,0,.18);padding:24px 25px">
      <div style="display:flex;gap:10px;align-items:center"><span class="kk" style="letter-spacing:.05em;text-transform:none">Meeting prep</span><span class="chp n" style="border:1px solid #9AA0A6;background:#fff;border-radius:11px">Accepted</span></div>
      <div class="hd" style="font-size:23px;margin-top:14px">Weekly - Dentsu GAE x Amazon Ads</div>
      <div style="font-size:14px;color:#3A4047;margin-top:6px">Fri 30 Oct · 09:45 to 10:00</div><div style="font-size:14px;margin-top:6px">With Sophie Laurent</div>
      <span class="btn2" style="margin-top:12px">Copy the prep</span>
      <div class="box" style="margin-top:20px;padding:18px 20px;border-radius:14px">
        <b class="hd pq" style="font-size:15px;display:flex;gap:8px;align-items:center">${ic('sparkles', 15)}Prepared by JARVIS</b>
        <div class="pq" style="margin-top:14px;background:#EEF4FB;border-left:3px solid #3B8DE6;padding:10px 14px;font-size:15px;font-weight:600">Get a catch-up plan, owner and date, for each GAE campaign behind.</div>
        <div class="pq kk" style="margin-top:16px;letter-spacing:.05em;text-transform:none">Open points</div>
        <ul style="margin:8px 0 0 20px;font-size:14px;line-height:1.5">
          <li class="pq">GAE - Ministère de la transition écologique · DentsuAudience (PG): catch up, 79% delivered at 85% of time, projection 91%, ends 31/10.</li>
          <li class="pq">GAE - DICOM · PrendreSoinV1 (PG): watch, 9% delivered at 11% of time, projection 80%, ends 22/11.</li>
          <li class="pq">GAE - SANTE PUBLIQUE FRANCE · Gestes Barrières: catch up, 68% delivered at 75% of time, projection 87%, ends 05/11.</li></ul>
        <div class="pq kk" style="margin-top:14px;letter-spacing:.05em;text-transform:none">To ask</div>
        <ul style="margin:8px 0 0 20px;font-size:14px;line-height:1.5"><li class="pq">Sophie: can the TF1 and M6 publishers send a catch-up plan for DentsuAudience before 31/10?</li>
          <li class="pq">Can the Gestes Barrières flight move by 5 days?</li></ul>
        <div class="pq kk" style="margin-top:14px;letter-spacing:.05em;text-transform:none">To bring</div>
        <ul style="margin:8px 0 0 20px;font-size:14px;line-height:1.5"><li class="pq">Campaigns page of JARVIS (DSP export of 28/10)</li></ul></div></div>`;

  // ---------------------------------------------------------------- WBR d'un client (Poltronesofa)
  J.WBR_BARS = [0, 0, 0, 0, 0, 0.72, 1];
  J.pageWbr = () => `<div class="pgi">
      <div class="ab0" style="left:33px;top:30px;font-size:14px;display:flex;gap:6px;align-items:center">${ic('chevron-right', 13)}<u>Poltronesofa</u></div>
      <div class="ab0 kk" style="left:33px;top:55px;letter-spacing:.05em;text-transform:none">Client · iProspect · Weekly business review</div>
      <div class="ab0" style="left:33px;top:78px;display:flex;gap:12px;align-items:center"><span style="width:42px;height:42px;border:1px solid ${T.line};border-radius:8px;background:#fff;display:grid;place-items:center;color:#D6303A">${ic('pen-line', 22)}</span><span class="ttl">Poltronesofa: WBR</span></div>
      <div class="ab0 lead" style="left:33px;top:138px;width:780px">22/10/2026 to 28/10/2026, against 15/10 to 21/10. Amazon DSP data to 28/10, the exchanges and meetings the briefing read, the SIM tickets on this client.</div>
      <div class="ab0" style="left:1308px;top:56px"><span class="btn2" style="padding:0 4px;gap:0"><span class="chp k" style="height:26px;border-radius:5px;font-size:13px">WBR · 7 days</span><span style="padding:0 10px;font-weight:400;color:#5E656C">MBR · month</span></span></div>
      <div class="ab0" style="left:1346px;top:101px"><span class="btn2 or bwd">${ic('presentation', 14)}Build the WBR deck</span></div>
      ${[['€11,235', 'spent over the 7 days', '▲ 166% vs €4,220'], ['546 K', 'impressions', '▲ 121% vs 247 K'], ['0.00%', 'CTR · 0 clicks', 'vs 0.00%'], ['2', 'live campaigns', '1 behind, €4,027 at risk'], ['€541,570', 'booked 2026', '€473,138 spent · 87%']].map((k, i) =>
        `<div class="ab0 box wt" style="left:${33 + i * 297}px;top:194px;width:284px;height:99px;padding:14px 16px;${i === 3 ? `border:1.5px solid ${T.red}` : ''}"><div class="hd" style="font-size:24px;${i === 3 ? `color:${T.red}` : ''}">${k[0]}</div><div style="font-size:13px;color:#4A5057;margin-top:5px">${k[1]}</div><div style="font-size:13px;margin-top:3px;${i < 2 ? `color:${T.grn}` : 'color:#2E343A'}">${k[2]}</div></div>`).join('')}
      <div class="ab0 box" style="left:33px;top:312px;width:1474px;height:225px;padding:20px 21px">
        <div><b class="hd" style="font-size:18px">In short</b><span style="font-size:13.5px;color:#4A5057;margin-left:10px">what JARVIS reads in the figures</span></div>
        <ul style="margin:14px 0 0 20px;font-size:15px;line-height:1.66">
          <li class="wl">€11,235 spent over the week (+166% on the week before), on 2 campaigns.</li>
          <li class="wl">Top campaign: SD~20261026 ED~20261106 MK~FR BR~PES CH~SVOD C…, 82% of the spend.</li>
          <li class="wl">546 K impressions, CTR 0.00%, VTR 98%.</li>
          <li class="wl">2 live campaigns, 1 behind: €4,027 at risk at the current rate.</li>
          <li class="wl">1 exchange read by JARVIS (1 received, 0 sent).</li></ul></div>
      <div class="ab0 box" style="left:33px;top:557px;width:872px;height:310px;padding:20px 21px">
        <div><b class="hd" style="font-size:18px">Spend a day</b><span style="font-size:13.5px;color:#4A5057;margin-left:10px">EUR, this week vs the week before</span></div>
        <svg class="ab0" style="left:0;top:0;width:872px;height:310px">
          ${[0, 1, 2].map(i => `<line x1="80" x2="840" y1="${255 - i * 75}" y2="${255 - i * 75}" stroke="#ECE9E4"/>`).join('')}
          <polyline points="110,175 220,235 330,255 440,255 550,255 660,255 770,255" fill="none" stroke="${T.or}" stroke-width="2" stroke-dasharray="5 4"/>
          ${J.WBR_BARS.map((v, i) => `<rect class="wb" x="${92 + i * 110}" y="${255 - v * 150}" width="36" height="${v * 150}" fill="#14181D"/><text x="${110 + i * 110}" y="278" text-anchor="middle" font-size="12" fill="#5E656C">${22 + i}/10</text>`).join('')}
        </svg></div>
      <div class="ab0 box" style="left:925px;top:557px;width:582px;height:310px;padding:20px 21px">
        <b class="hd" style="font-size:18px">Points to watch and next steps</b>
        ${[['r', 'Behind', '27% delivered at 60% of the time, €4,027 at risk. Raise the max CPM, widen the audience or lighten the dayparting.'], ['o', 'Ends soon', 'Ends on 03/11/2026, 46% delivered: prepare the report and what comes next.'], ['n', 'To do', 'Catch up Poltronesofa SVOD: it ends today']].map(p =>
          `<div class="wp" style="display:flex;gap:12px;margin-top:16px;font-size:14px;line-height:1.45"><span class="chp ${p[0]}" style="min-width:76px;justify-content:center;border-radius:11px">${p[1]}</span><span>${p[2]}</span></div>`).join('')}</div>
    </div>`;

  // ---------------------------------------------------------------- Settings : ce que JARVIS a appris
  J.LESSON = 'With Publicis, always cc the AM when billing comes up.';
  J.pageSettings = () => `<div class="pgi">
      <div class="ab0 kk" style="left:33px;top:30px;letter-spacing:.05em;text-transform:none">Settings</div>
      <div class="ab0 ttl" style="left:33px;top:50px">What JARVIS learned about Val</div>
      <div class="ab0 lead" style="left:33px;top:100px;width:780px">Every evening JARVIS reads what you sent, the drafts you changed, your meetings, your Slack replies and the documents you write or give it, and keeps what it will reuse. Every briefing applies it.</div>
      <div class="ab0" style="left:33px;top:205px"><span class="btn2" style="padding:0 4px;gap:0"><span style="padding:0 10px;font-weight:400;color:#5E656C">General</span><span class="chp k" style="height:26px;border-radius:5px;font-size:13px">What JARVIS learned (16 to review)</span></span></div>
      <div class="ab0 box" style="left:33px;top:260px;width:1474px;height:83px;display:flex">
        ${[['Lessons in use', '28', 'li'], ['To review', '16'], ['Documents read', '46'], ['Message examples', '5'], ['Drafts used', '20%'], ['Last learning pass', 'Thu 29 Oct']].map(k =>
          `<div style="flex:1;padding:16px 13px;border-right:1px solid ${T.line}"><div style="font-size:13px;color:#4A5057">${k[0]}</div><b class="hd ${k[2] || ''}" style="display:block;font-size:16px;margin-top:8px">${k[1]}</b></div>`).join('')}
        <div style="flex:2.3;padding:16px 13px"><div style="font-size:13px;color:#4A5057">Impact · last 7 days</div><div style="display:flex;gap:40px;margin-top:8px"><span><b class="hd" style="font-size:16px">2</b> <span style="font-size:12.5px">drafts used</span></span><span><b class="hd" style="font-size:16px">3</b> <span style="font-size:12.5px">to-dos closed</span></span></div></div></div>
      <div class="ab0 box" style="left:33px;top:366px;width:846px;height:203px;padding:22px 21px">
        <div><b class="hd" style="font-size:18px">Teach JARVIS</b><span style="font-size:13.5px;color:#4A5057;margin-left:10px">Your words become a confirmed lesson at once</span></div>
        <div class="ta" style="margin-top:14px;height:86px;border:1.5px solid #9AA0A6;border-radius:8px;padding:12px 13px;font-size:15px;color:#9AA0A6">For example: "Never book client calls on Friday afternoon"</div>
        <div style="display:flex;align-items:center;margin-top:12px"><span class="btn2" style="font-weight:400">About: JARVIS guesses ${ic('chevron-down', 14)}</span><span style="margin-left:auto;font-size:13.5px;color:#4A5057">Ctrl Enter</span><span class="btn2 or tch" style="margin-left:12px;opacity:.5">Teach</span></div></div>
      <div class="ab0 box" style="left:33px;top:590px;width:846px;height:470px;padding:22px 21px 0">
        <div><b class="hd" style="font-size:18px">To review</b><span style="font-size:13.5px;color:#4A5057;margin-left:10px">Seen in your work, not proven yet: confirm to apply it now</span></div>
        ${["When asked for a slot, offer two options in one line, a free half-day first then a precise range.", 'A deal cannot be attached to an order created after the deal\'s start date: edit the deal dates so they fit the order.',
          'When a PG or PMP deal does not deliver, first check whether the DSP receives any bid request on the deal.', 'A deal is the base of delivery: a line item can narrow it, but never widen it to inventory outside the deal.'].map((l, i) =>
          `<div style="display:flex;gap:14px;align-items:center;border-top:1px solid #ECE9E4;margin:${i ? 0 : 14}px -21px 0;padding:14px 21px;font-size:14.5px;line-height:1.4"><span style="flex:1">${l}</span><span class="chp n" style="border-radius:11px">To review</span>${i % 2 ? '<span class="chp n" style="border-radius:11px;background:#fff;border:1px solid #D2CEC7">PSC playbook</span>' : ''}</div>`).join('')}</div>
      <div class="ab0 box vc" style="left:902px;top:366px;width:605px;height:694px;padding:22px 21px">
        <div><b class="hd" style="font-size:18px">Your voice</b><span class="chp n" style="margin-left:8px;border-radius:5px">78 emails</span></div>
        <div style="font-size:13.5px;line-height:1.45;color:#3A4047;margin-top:12px">Learned from the emails you sent 25/09 to 29/10, applied to every text JARVIS writes for you: the Amazonian rules decide what it says, your voice how it sounds.</div>
        <div style="margin-top:12px;display:flex;gap:6px"><span class="chp k" style="height:26px;font-size:13px;border-radius:13px;padding:0 11px">French 58</span><span class="chp n" style="height:26px;font-size:13px;border-radius:13px;padding:0 11px;background:#fff;border:1px solid #D2CEC7">English 20</span></div>
        ${[['Greeting', 'Hello &lt;first name&gt;, (52 %) · &lt;first name&gt;, (12 %)'], ['Check-in', '47 %: La fooorme ? · Tu vas bien ? · Au top j\'espère que toi aussi !'], ['Tu or vous', 'tu with one person (90 %), tu with a group'],
          ['Sign-off', 'A dispo (74 %) · Bonne journée (26 %) · Merci (9 %)'], ['Length', '61 words, 80 % under 134 · sentences of 14 words'], ['Tone', 'emoji in 66 % · ! in 66 % · laughter in 19 %'], ['Your words', 'au niveau · par contre · en place · en effet · je vois · il faudra']].map(r =>
          `<div class="vr" style="display:flex;gap:16px;margin-top:13px;font-size:14px;line-height:1.4"><span style="width:110px;flex:none;color:#4A5057">${r[0]}</span><span>${r[1]}</span></div>`).join('')}
        <ul style="margin:16px 0 0 18px;font-size:14px;line-height:1.48">
          <li class="vr">Explains a problem the way a helpful tech friend would: the cause in plain words first, then the one thing he asks.</li>
          <li class="vr">Mixes English words into French naturally, as a trader does: 'Tell me !', 'free', 'setup', 'call'.</li>
          <li class="vr">One idea per line, no long paragraphs; lists a choice or missing inputs as a short numbered list.</li></ul></div>
    </div>`;
})();
