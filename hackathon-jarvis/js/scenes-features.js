/* Chapitres 01 et 02 — démarrer la journée, piloter les campagnes */
(function () {
  'use strict';
  const { E, P, tf, vis, count, type, rng, ic, $, $$, clamp, lerp, feature, chapter, cursor, moveCursor, cue, rel, setHTML, orb, orbTick } = J;

  // petite apparition « pop » d'un élément d'interface
  const pop = (el, lt, a, o = {}) => vis(el, lt, a, o.b ?? Infinity, Object.assign({ dy: 18, blur: 8, din: 0.7 }, o));

  // =================================================================== 01 · START YOUR DAY
  chapter('c1', TL.c1, '01', 'Start your <span class="hl">day.</span>');

  // ------------------------------------------------ briefing
  const BRIEF = [
    [{ t: 'Since yesterday: ' }, { t: 'nothing heavy in the mail', c: 'b' }, { t: ', six messages, mostly acknowledgements.' }],
    [{ t: 'ENI Plénitude is unblocked', c: 'b' }, { t: ': IAS workaround sent to Amnet, creatives still have to pass the audit.' }],
    [{ t: 'One hot spot left: ' }, { t: 'BFM', c: 'b r' }, { t: ', still no delivery on SVOD and CUTV, two tickets in progress.' }],
  ];
  feature('brief', TL.brief, {
    kicker: '01 · Start your day', head: 'Your day,<br><span class="hl">in 30 seconds.</span>',
    sub: 'Mail, calendar and campaigns, distilled into one briefing every morning.',
    css: `
    #sc-brief .bw{position:absolute;left:0;top:190px;width:1010px;padding:30px 32px 32px}
    #sc-brief .b-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}
    #sc-brief .b-g{font-size:40px}
    #sc-brief .b-d{color:var(--mut);font-size:17px;margin-top:6px}
    #sc-brief .b-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}
    #sc-brief .b-kpi{display:flex;gap:14px;align-items:center;padding:18px 18px}
    #sc-brief .b-ki{width:44px;height:44px;border-radius:11px;background:#F3F0EB;color:#5D646C;display:grid;place-items:center;flex:none}
    #sc-brief .b-ki.r{background:var(--redbg);color:var(--red)}
    #sc-brief .b-kn{font-family:InterTight;font-weight:700;font-size:36px;line-height:1}
    #sc-brief .b-kl{font-size:14px;color:var(--mut);margin-top:4px;line-height:1.25}
    #sc-brief .b-br{padding:22px 24px 14px}
    #sc-brief .b-bh{display:flex;align-items:center;gap:14px;margin-bottom:12px}
    #sc-brief .b-bi{width:44px;height:44px;border-radius:11px;background:var(--ink);color:#fff;display:grid;place-items:center}
    #sc-brief .b-li{display:flex;gap:12px;font-size:19px;line-height:1.5;color:var(--ink2);padding:10px 0;border-top:1px solid var(--line2);min-height:50px}
    #sc-brief .b-li>b{color:var(--mut2);width:20px;flex:none}
    #sc-brief .b-li .b{font-weight:650;color:var(--ink)}
    #sc-brief .b-li .r{color:var(--red)}
    `,
  }, {
    html: `<div class="card bw">
      <div class="b-top"><div><div class="htitle b-g">Good morning, Valentin</div><div class="b-d">Wednesday, October 7, 2026</div></div><span class="btn">${ic('refresh-cw', 16)}Sync</span></div>
      <div class="b-kpis">${[['calendar', 3, 'meetings today', ''], ['circle-check', 2, 'to do today · 1 overdue', 'r'], ['inbox', 0, 'to handle right away', ''], ['zap', 6, 'possible follow-ups', '']]
        .map(k => `<div class="flat b-kpi" data-v="${k[1]}"><div class="b-ki ${k[3]}">${ic(k[0], 21)}</div><div><div class="b-kn">0</div><div class="b-kl">${k[2]}</div></div></div>`).join('')}</div>
      <div class="flat b-br"><div class="b-bh"><div class="b-bi">${ic('brain', 21)}</div><span class="htitle" style="font-size:22px">Today's essentials</span><span class="lbl">automatic briefing · 08:30</span></div>
        ${BRIEF.map((_, i) => `<div class="b-li"><b>${i + 1}.</b><span class="b-tx"></span></div>`).join('')}</div>
    </div>`,
    build(root, s) {
      s.kp = $$('.b-kpi', root); s.br = $('.b-br', root); s.tx = $$('.b-tx', root); s.li = $$('.b-li', root);
      [0.6, 0.7, 0.8, 0.9].forEach(a => cue('pop', s.t0 + a, { v: 0.5 }));
      [1.55, 2.95, 4.4].forEach((a, i) => cue('type', s.t0 + a, { d: BRIEF[i].reduce((n, x) => n + x.t.length, 0) / 62 }));
    },
    update(lt, dur, root, s) {
      s.kp.forEach((k, i) => { pop(k, lt, 0.6 + i * 0.1); count($('.b-kn', k), lt, 0.6 + i * 0.1, 1.0, 0, +k.dataset.v); });
      pop(s.br, lt, 1.0);
      [1.55, 2.95, 4.4].forEach((a, i) => type(s.tx[i], BRIEF[i], lt, a, 62, { caret: i === 2 || lt < [2.95, 4.4, 99][i] }));
    },
  });

  // ------------------------------------------------ boîte triée
  const MAILS = [
    ['AT', '#6B4FBB', 'Brief Boursorama // campagne REBOOT 2026 // AMAZON', 'Alecsandra Tackjian', '16:53', 'Camille, je rajoute un zéro sur le budget Twitch : 59 750 €…', 0],
    ['N', '#8A8F96', 'Weekly digest · Ads Learning Console', 'Notification', '07:00', '5 new courses recommended for you this week', -1],
    ['LC', '#5B6B7F', 'Amazon x 20th Century Studios : Englouti', 'Lorane Chatelain', '15:39', "Je viens d'ajouter des intérêts pour ouvrir l'audience, je check demain…", 4],
    ['N', '#8A8F96', 'Your Slack summary', 'Notification', '06:30', '12 unread messages in 4 channels', -1],
    ['JG', '#2F6FDE', 'changement de format import Hashed audience CSV ?', 'Julie Gernelle', '16:44', 'As-tu identifié la personne pour nous mettre en contact ?', 1],
    ['C', '#2E8B57', 'Nintendo / update', 'Ccroizat', '16:04', "Je n'avais pas annulé le point de cet après-midi. Désolée pour cela…", 3],
    ['N', '#8A8F96', '[Newsletter] Programmatic Weekly', 'newsletter', '06:00', 'This week in ad tech: CTV, retail media and more', -1],
    ['LH', '#B5523B', 'Brief SPF GB // Azerion', 'Lea Huguet', '16:37', 'La catégorie Gouvernement ne peut pas vraiment être changée…', 2],
  ];
  const ROW_H = 74;
  feature('inbox', TL.inbox, {
    kicker: '01 · Start your day', head: 'An inbox<br><span class="hl">already sorted.</span>',
    sub: 'What concerns you comes first. The noise steps aside.',
    css: `
    #sc-inbox .ib{position:absolute;left:0;top:150px;width:1010px;height:800px;padding:28px 30px;overflow:hidden}
    #sc-inbox .ib-s{color:var(--mut);font-size:16px;margin-top:6px}
    #sc-inbox .ib-bar{display:flex;gap:14px;align-items:center;margin:22px 0 18px}
    #sc-inbox .seg{position:relative;display:flex;gap:2px;padding:4px;border:1px solid var(--line);border-radius:12px;background:#fff}
    #sc-inbox .seg span{position:relative;z-index:1;height:36px;padding:0 14px;display:grid;place-items:center;font-size:15px;font-weight:550;color:#3D444B;border-radius:9px}
    #sc-inbox .seg span.on{color:#fff}
    #sc-inbox .seg-pill{position:absolute;top:4px;height:36px;border-radius:9px;background:var(--navy)}
    #sc-inbox .ib-n{margin-left:auto;font:500 13px Plex,monospace;color:var(--mut);background:#F3F0EB;padding:6px 12px;border-radius:999px}
    #sc-inbox .ib-day{font-weight:650;font-size:16px;padding-bottom:10px;border-bottom:1px solid var(--line2)}
    #sc-inbox .ib-day span{color:var(--mut);font-weight:500;margin-left:6px}
    #sc-inbox .ib-rows{position:relative;height:600px}
    #sc-inbox .ib-r{position:absolute;left:0;right:0;height:${ROW_H}px;display:flex;gap:16px;align-items:center;border-bottom:1px solid var(--line2);background:#fff}
    #sc-inbox .ib-r .av{width:42px;height:42px}
    #sc-inbox .ib-c{flex:1;min-width:0}
    #sc-inbox .ib-t{font-weight:650;font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #sc-inbox .ib-m{font-size:13.5px;color:var(--mut);margin-top:2px}
    #sc-inbox .ib-p{font-size:14.5px;color:#4B525A;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #sc-inbox .ib-tag{flex:none}
    `,
  }, {
    html: `<div class="card ib">
      <div class="htitle" style="font-size:34px">Inbox</div><div class="ib-s">Every email in the vault, received and sent</div>
      <div class="ib-bar"><div class="seg s1"><i class="seg-pill"></i><span>For me</span><span>Received</span><span>Sent</span><span>All</span><span>Noise</span></div>
        <div class="seg"><span>24 h</span><span class="on" style="background:var(--navy)">7 d</span><span>30 d</span></div><div class="ib-n">90 messages</div></div>
      <div class="ib-day">Today<span>20</span></div>
      <div class="ib-rows">${MAILS.map(m => `<div class="ib-r"><div class="av" style="background:${m[1]}">${m[0]}</div><div class="ib-c"><div class="ib-t">${J.esc(m[2])}</div><div class="ib-m">${m[3]} · 07/10 ${m[4]}</div><div class="ib-p">${J.esc(m[5])}</div></div><div class="ib-tag">${m[6] < 0 ? '<span class="chip gray mono">noise</span>' : '<span class="chip or mono">for you</span>'}</div></div>`).join('')}</div>
    </div>`,
    build(root, s) {
      s.rows = $$('.ib-r', root).map((el, i) => ({ el, tag: $('.ib-tag', el), fin: MAILS[i][6], init: i }));
      s.card = $('.ib', root); s.seg = $('.s1', root); s.pill = $('.s1 .seg-pill', root); s.tabs = $$('.s1 span', root); s.n = $('.ib-n', root);
      MAILS.forEach((_, i) => cue('tick', s.t0 + 0.5 + i * 0.07, { v: 0.35 }));
      cue('click', s.t0 + 2.0); cue('swish', s.t0 + 2.35, { v: 0.6 });
    },
    update(lt, dur, root, s) {
      if (!s.m) s.m = s.tabs.map(t => ({ x: t.offsetLeft, w: t.offsetWidth }));
      const k = P(lt, 2.0, 0.45, E.ioC);
      const a = s.m[3], b = s.m[0];
      s.pill.style.left = lerp(a.x, b.x, k) + 'px'; s.pill.style.width = lerp(a.w, b.w, k) + 'px';
      s.tabs.forEach((t, i) => t.classList.toggle('on', i === (k > 0.5 ? 0 : 3)));
      s.n.textContent = lt > 2.45 ? '7 for you · 13 noise' : '90 messages';
      s.card.style.height = lerp(800, 630, P(lt, 2.7, 0.8, E.ioC)).toFixed(1) + 'px';
      const sortK = P(lt, 2.55, 0.85, E.ioC);
      s.rows.forEach((r, i) => {
        const appear = P(lt, 0.5 + i * 0.07, 0.6, E.outQi);
        const y0 = r.init * ROW_H;
        if (r.fin < 0) {
          const out = P(lt, 2.3, 0.6, E.inQ);
          tf(r.el, { x: 140 * out, y: y0 + 14 * (1 - appear), o: appear * (1 - out), b: 6 * out });
          r.tag.style.opacity = P(lt, 2.1, 0.25);
        } else {
          tf(r.el, { y: lerp(y0, r.fin * ROW_H, sortK) + 14 * (1 - appear), o: appear });
          tf(r.tag, { s: 0.6 + 0.4 * P(lt, 3.2 + r.fin * 0.07, 0.4, E.outB), o: P(lt, 3.2 + r.fin * 0.07, 0.3) });
        }
      });
    },
  });

  // ------------------------------------------------ relances
  const DRAFT = 'Hi Annemarie,\n\nJust circling back on my question from last week: can you push the new LIs in AdOS with the same setup? Happy to jump on a quick call if easier.\n\nThanks!\nValentin';
  feature('follow', TL.follow, {
    kicker: '01 · Start your day', head: 'No thread<br><span class="hl">goes cold.</span>',
    sub: "Every reply you're waiting on resurfaces, with a follow-up one click away.",
    css: `
    #sc-follow .fu{position:absolute;left:0;top:140px;width:1010px;padding:26px 28px 10px}
    #sc-follow .fu-h{display:flex;align-items:baseline;gap:14px;margin-bottom:16px}
    #sc-follow .fu-c{color:var(--mut);font-size:15px}
    #sc-follow .fu-it{padding:18px 0;border-top:1px solid var(--line2)}
    #sc-follow .fu-r1{display:flex;align-items:center;gap:14px}
    #sc-follow .fu-t{font-weight:700;font-size:19px;flex:1}
    #sc-follow .fu-r2{display:flex;align-items:center;gap:12px;margin:8px 0 0 54px;font-size:14.5px;color:var(--ink2);flex-wrap:wrap}
    #sc-follow .fu-late{color:var(--red);font-weight:650;display:inline-block}
    #sc-follow .fu-m{color:var(--mut)}
    #sc-follow .fu-q{margin:14px 0 0 54px;background:#F6F4F0;border-radius:12px;padding:14px 16px;font-size:16px;line-height:1.5;color:var(--ink2)}
    #sc-follow .fu-q .lbl{margin-bottom:6px;color:var(--mut)}
    #sc-follow .fu-a{display:flex;gap:10px;margin:14px 0 0 54px;align-items:center}
    #sc-follow .fu-a .sp{flex:1}
    #sc-follow .kiro{position:relative}
    #sc-follow .kiro.on{background:var(--or);border-color:var(--or);color:#fff}
    #sc-follow .dr{position:absolute;left:360px;top:540px;width:650px;padding:20px 24px 18px}
    #sc-follow .dr-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    #sc-follow .dr-app{display:flex;gap:8px;align-items:center;font-weight:650;color:#2F6FDE}
    #sc-follow .dr-f{font-size:14.5px;color:var(--ink2);padding:7px 0;border-bottom:1px solid var(--line2)}
    #sc-follow .dr-f span{display:inline-block;width:70px;color:var(--mut)}
    #sc-follow .dr-b{font-size:16px;line-height:1.5;color:var(--ink);padding-top:12px;min-height:190px}
    #sc-follow .dr-foot{display:flex;gap:8px;align-items:center;font-size:13.5px;color:var(--or);font-weight:600}
    `,
  }, {
    html: `<div class="card fu">
      <div class="fu-h"><span class="htitle" style="font-size:28px">To follow up</span><span class="fu-c">6 threads where you're waiting on a reply</span></div>
      <div class="fu-it i0">
        <div class="fu-r1"><div class="av" style="background:#6C4AB6">A</div><div class="fu-t">Amazon // Amnet - Gracieux T3</div><span class="chip red mono">urgent</span></div>
        <div class="fu-r2"><b>Adrcolas, Annemarie Kalinka (Amnetgroup)</b><span class="chip line">waiting on them</span><span class="fu-late">your last word: 5 working days ago</span><span class="fu-m">· 11 messages</span></div>
        <div class="fu-q"><div class="lbl">your question</div>Can you push new LIs quickly in AdOS with the same setup? Did you test the "contact us" in parallel?</div>
        <div class="fu-a"><span class="btn ink kiro">${ic('zap', 16)}Kiro follow-up</span><span class="btn">${ic('mail', 16)}Open</span><span class="sp"></span><span class="btn">${ic('circle-check', 16)}Done</span></div>
      </div>
      <div class="fu-it i1"><div class="fu-r1"><div class="av" style="background:#2F5E9E">BT</div><div class="fu-t">Data Amazon Garage - XPENG</div><span class="chip or mono">today</span></div>
        <div class="fu-r2"><b>Barbara T., Martin Desnoyers (Amnetgroup)</b><span class="chip line">waiting on them</span><span class="fu-late">your last word: 3 working days ago</span></div></div>
      <div class="fu-it i2"><div class="fu-r1"><div class="av" style="background:#3A3FB0">D</div><div class="fu-t">GSEB - DSP inventaire de diffusion offsite</div><span class="chip gray mono">this week</span></div>
        <div class="fu-r2"><b>Didarbau, Enzo Barillon (Iprospect)</b><span class="chip line">waiting on them</span><span class="fu-late">your last word: 8 working days ago</span></div></div>
    </div>
    <div class="card dr"><div class="dr-top"><span class="dr-app">${ic('mail', 17)}Outlook · Drafts</span><span class="chip amb mono">draft · not sent</span></div>
      <div class="dr-f"><span>To</span>Annemarie Kalinka; Adrcolas</div><div class="dr-f"><span>Subject</span>RE: Amazon // Amnet - Gracieux T3</div>
      <div class="dr-b"></div><div class="dr-foot">${ic('sparkles', 15)}Written by Kiro, in your voice</div></div>`,
    build(root, s) {
      s.items = $$('.fu-it', root); s.late = $('.i0 .fu-late', root); s.kiro = $('.kiro', root);
      s.dr = $('.dr', root); s.body = $('.dr-b', root); s.cur = cursor(root);
      cue('pulse', s.t0 + 1.25, { v: 0.6 }); cue('click', s.t0 + 2.75); cue('swoosh-up', s.t0 + 3.0); cue('type', s.t0 + 3.35, { d: DRAFT.length / 95 });
    },
    update(lt, dur, root, s) {
      if (!s.m) s.m = rel(s.kiro, root);
      s.items.forEach((el, i) => pop(el, lt, 0.45 + i * 0.12));
      const pk = P(lt, 1.25, 0.8, E.lin);
      tf(s.late, { s: 1 + 0.08 * Math.sin(pk * Math.PI) });
      s.late.style.textShadow = pk > 0 && pk < 1 ? `0 0 ${(14 * Math.sin(pk * Math.PI)).toFixed(1)}px rgba(200,55,44,.55)` : 'none';
      moveCursor(s.cur, lt, [[1.7, 820, 760], [2.6, s.m.cx + 10, s.m.cy + 6]], [2.75], { hide: 4.2 });
      s.kiro.classList.toggle('on', lt > 2.8);
      vis(s.dr, lt, 3.0, Infinity, { dy: 90, blur: 16, ds: 0.03, din: 0.9, ein: E.outX });
      type(s.body, DRAFT, lt, 3.35, 95);
    },
  });

  // ------------------------------------------------ dans ta voix, nourri par tes données
  const VOICE = [
    { t: 'Hello Annemarie,', c: 'hs' }, { t: 'style', c: 'tag t-st', k: 'st' }, { t: '\n\nQuick update on BFM: the SVOD line is at ' },
    { t: '2.3% delivered', c: 'hs' }, { t: 'DSP', c: 'tag t-dsp', k: 0 }, { t: ' for 29% of the flight, so about ' },
    { t: '€41.7k is at risk', c: 'hs' }, { t: 'DSP', c: 'tag t-dsp', k: 0 }, { t: ' before 15/11.\n\n' },
    { t: 'Ticket P529341292', c: 'hs' }, { t: 'SIM', c: 'tag t-sim', k: 1 }, { t: ' is open with PSC-T, as discussed in our last ' },
    { t: 'exchange', c: 'hs' }, { t: 'thread', c: 'tag t-th', k: 2 }, { t: '. On your side, could you check ' },
    { t: 'the max bid against the deal floor', c: 'hs' }, { t: 'SOP', c: 'tag t-sop', k: 3 }, { t: ' and confirm the PMP creatives are live?\n\n' },
    { t: 'Thanks!\nValentin', c: 'hs' }, { t: 'style', c: 'tag t-st', k: 'st' },
  ];
  const VCPS = 78, VT0 = 2.6;
  const STYLE = [['opening', '"Hello Annemarie," · "Salut" with close contacts'], ['tone', 'Direct, warm, numbers first'],
    ['language', 'Matches the thread: French or English'], ['always', 'A next step, with an owner and a date'], ['sign-off', '"Thanks!" · Valentin']];
  const GROUND = [['chart-column', '#F7930F', 'DSP export 06/10', 'SVOD 2.3% delivered · €41.7k at risk'], ['ticket', '#CF3F37', 'SIM P529341292', 'In progress · PSC-T'],
    ['mail', '#2F6FDE', 'Thread history', '11 messages with Amnet'], ['file-text', '#16947E', 'Waypoint SOP', 'Escalation checklist']];
  feature('voice', TL.voice, {
    kicker: '01 · Start your day', head: 'Your voice.<br><span class="hl">Your data.</span>',
    sub: 'Replies drafted the way you write, grounded in live results, tickets and docs.',
    css: `
    #sc-voice .sty{position:absolute;left:0;top:110px;width:460px;padding:22px 22px 12px}
    #sc-voice .sty-h{display:flex;gap:12px;align-items:center;margin-bottom:10px}
    #sc-voice .sty-i{width:42px;height:42px;border-radius:11px;background:var(--ink);color:#fff;display:grid;place-items:center;flex:none}
    #sc-voice .sty-t{font-weight:700;font-size:18px}
    #sc-voice .sty-s{font:500 12.5px Plex,monospace;color:var(--mut);margin-top:2px}
    #sc-voice .sty-r{display:flex;gap:12px;align-items:baseline;padding:10px 0;border-top:1px solid var(--line2);font-size:14.5px;line-height:1.35}
    #sc-voice .sty-r .lbl{width:78px;flex:none}
    #sc-voice .sty-r b{font-weight:600;color:var(--ink2);flex:1}
    #sc-voice .sty-r .ok{color:var(--grn);flex:none}
    #sc-voice .gr{position:absolute;left:0;top:560px;width:460px;padding:18px 22px 10px}
    #sc-voice .gr-r{display:flex;gap:12px;align-items:center;padding:9px 8px;border-radius:12px;margin:0 -8px}
    #sc-voice .gr-i{width:36px;height:36px;border-radius:9px;display:grid;place-items:center;color:#fff;flex:none}
    #sc-voice .gr-r b{display:block;font-size:15px}
    #sc-voice .gr-r span{font-size:13px;color:var(--mut)}
    #sc-voice .dr{position:absolute;left:486px;top:150px;width:546px;padding:20px 24px 18px}
    #sc-voice .dr-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
    #sc-voice .dr-app{display:flex;gap:8px;align-items:center;font-weight:650;color:#2F6FDE}
    #sc-voice .dr-f{font-size:14px;color:var(--ink2);padding:7px 0;border-bottom:1px solid var(--line2)}
    #sc-voice .dr-f span{display:inline-block;width:66px;color:var(--mut)}
    #sc-voice .dr-b{font-size:16px;line-height:1.62;color:var(--ink);padding-top:12px;height:430px}
    #sc-voice .hs{background:linear-gradient(transparent 60%,rgba(255,153,0,.30) 60%)}
    #sc-voice .tag{display:inline-block;font:600 10.5px/1 Plex,monospace;letter-spacing:.08em;text-transform:uppercase;padding:4px 6px;border-radius:5px;margin:0 2px 0 5px;vertical-align:2px;color:#fff}
    #sc-voice .t-st{background:var(--ink)}#sc-voice .t-dsp{background:#F7930F}#sc-voice .t-sim{background:#CF3F37}#sc-voice .t-th{background:#2F6FDE}#sc-voice .t-sop{background:#16947E}
    #sc-voice .dr-foot{display:flex;gap:8px;align-items:center;font-size:13.5px;color:var(--or);font-weight:600;margin-top:6px}
    `,
  }, {
    html: `<div class="card sty"><div class="sty-h"><div class="sty-i">${ic('pen-line', 20)}</div><div><div class="sty-t">Your writing style</div><div class="sty-s">style.md · learned from your sent emails</div></div></div>
        ${STYLE.map(r => `<div class="sty-r"><span class="lbl">${r[0]}</span><b>${r[1]}</b><span class="ok">${ic('check', 16)}</span></div>`).join('')}</div>
      <div class="card gr"><div class="lbl" style="margin-bottom:8px">grounded in</div>${GROUND.map(g => `<div class="gr-r"><div class="gr-i" style="background:${g[1]}">${ic(g[0], 18)}</div><div><b>${g[2]}</b><span>${g[3]}</span></div></div>`).join('')}</div>
      <div class="card dr"><div class="dr-top"><span class="dr-app">${ic('mail', 17)}Outlook · Drafts</span><span class="chip amb mono">draft · not sent</span></div>
        <div class="dr-f"><span>To</span>Annemarie Kalinka (Amnetgroup)</div><div class="dr-f"><span>Subject</span>RE: BFM · SVOD delivery</div>
        <div class="dr-b"></div><div class="dr-foot">${ic('sparkles', 15)}Drafted by Kiro, in your voice</div></div>`,
    build(root, s) {
      s.sty = $('.sty', root); s.rows = $$('.sty-r', root); s.gr = $('.gr', root); s.grs = $$('.gr-r', root); s.dr = $('.dr', root); s.body = $('.dr-b', root);
      // instant où chaque étiquette de source finit de s'écrire
      let n = 0; s.hits = [];
      for (const seg of VOICE) { n += seg.t.length; if (seg.k !== undefined) s.hits.push({ k: seg.k, t: VT0 + n / VCPS }); }
      STYLE.forEach((_, i) => cue('tick', s.t0 + 0.75 + i * 0.18, { v: 0.4 }));
      GROUND.forEach((_, i) => cue('pop', s.t0 + 1.55 + i * 0.14, { v: 0.35 }));
      cue('type', s.t0 + VT0, { d: n / VCPS });
      s.hits.forEach(h => cue('tick', s.t0 + h.t, { v: 0.5 }));
    },
    update(lt, dur, root, s) {
      pop(s.sty, lt, 0.35); s.rows.forEach((r, i) => pop(r, lt, 0.75 + i * 0.18, { dy: 10 }));
      pop(s.gr, lt, 1.35); s.grs.forEach((r, i) => pop(r, lt, 1.55 + i * 0.14, { dy: 10 }));
      pop(s.dr, lt, 2.15);
      type(s.body, VOICE, lt, VT0, VCPS);
      // la source citée s'allume quand son étiquette apparaît
      const glow = [0, 0, 0, 0], sg = [0];
      for (const h of s.hits) { const d = lt - h.t; if (d >= 0 && d < 1.2) { const g = Math.sin(clamp(d / 1.2) * Math.PI); if (h.k === 'st') sg[0] = Math.max(sg[0], g); else glow[h.k] = Math.max(glow[h.k], g); } }
      s.grs.forEach((r, i) => { r.style.background = `rgba(255,153,0,${(0.16 * glow[i]).toFixed(3)})`; r.style.boxShadow = glow[i] > 0.01 ? `0 0 0 ${(2 * glow[i]).toFixed(1)}px rgba(255,153,0,.55)` : 'none'; });
      s.sty.style.boxShadow = `0 34px 90px -26px rgba(35,47,62,.26), 0 0 0 ${(3 * sg[0]).toFixed(1)}px rgba(255,153,0,${(0.6 * sg[0]).toFixed(2)})`;
    },
  });

  // ------------------------------------------------ une note, et J.A.R.V.I.S. réécrit
  const NOTE = "dis-lui qu'on passe la ligne CUTV Equativ à 1 € et qu'on relance Equativ demain matin";
  const POLISHED = "We'll also set the Equativ CUTV line to €1 so the algorithm can reallocate its budget, and I'll follow up with Equativ tomorrow morning.";
  feature('rewrite', TL.rewrite, {
    kicker: '01 · Start your day', head: 'Add a note.<br><span class="hl">It rewrites.</span>',
    sub: 'Jot it down in your own words, French or English. J.A.R.V.I.S. turns it into a clean paragraph, in your voice.',
    css: `
    #sc-rewrite .rw{position:absolute;left:30px;top:120px;width:980px;padding:22px 28px 22px}
    #sc-rewrite .rw-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
    #sc-rewrite .rw-app{display:flex;gap:8px;align-items:center;font-weight:650;color:#2F6FDE}
    #sc-rewrite .rw-f{font-size:14.5px;color:var(--ink2);padding:7px 0;border-bottom:1px solid var(--line2)}
    #sc-rewrite .rw-f span{display:inline-block;width:72px;color:var(--mut)}
    #sc-rewrite .rw-b{font-size:17px;line-height:1.6;color:var(--ink);padding:14px 0 6px}
    #sc-rewrite .rw-b p{margin-bottom:14px}
    #sc-rewrite .slot{overflow:hidden;height:0}
    #sc-rewrite .ins{border-radius:8px;margin:0 -8px 14px;padding:2px 8px}
    #sc-rewrite .note{display:flex;gap:12px;align-items:center;margin-top:8px;height:62px;padding:0 10px 0 18px;border-radius:16px;border:1.5px solid #F2C79A;background:#FFF9F2}
    #sc-rewrite .note .ic{color:var(--or)}
    #sc-rewrite .nt{flex:1;font-size:17px;color:var(--ink2);white-space:nowrap;overflow:hidden}
    #sc-rewrite .nt .ph{color:var(--mut2)}
    #sc-rewrite .go{width:44px;height:44px;border-radius:50%;background:var(--or);color:#fff;display:grid;place-items:center}
    #sc-rewrite .bub{position:absolute;left:0;top:0;border-radius:12px;padding:10px 14px;font-size:17px;line-height:1.6;z-index:10}
    #sc-rewrite .bub div{position:absolute;left:14px;right:14px;top:10px}
    #sc-rewrite .b-raw{color:#7A4A12;font-style:italic}
    #sc-rewrite .rw-c{position:absolute;left:30px;top:812px;display:flex;gap:10px}
    `,
  }, {
    html: `<div class="card rw"><div class="rw-top"><span class="rw-app">${ic('mail', 17)}Outlook · Drafts</span><span class="chip amb mono">draft · not sent</span></div>
        <div class="rw-f"><span>To</span>Annemarie Kalinka (Amnetgroup)</div><div class="rw-f"><span>Subject</span>RE: BFM · SVOD delivery</div>
        <div class="rw-b"><p>Hello Annemarie,</p><p>Quick update on BFM: the SVOD line is at 2.3% delivered for 29% of the flight, so about €41.7k is at risk before 15/11.</p>
          <p>Ticket P529341292 is open with PSC-T. On your side, could you check the max bid against the deal floor and confirm the PMP creatives are live?</p>
          <div class="slot"><p class="ins">${POLISHED}</p></div><p>Thanks!<br>Valentin</p></div>
        <div class="note">${ic('pen-line', 20)}<div class="nt"></div><span class="go">${ic('arrow-right', 22)}</span></div></div>
      <div class="bub"><div class="b-raw">${NOTE}</div><div class="b-pol">${POLISHED}</div></div>
      <div class="rw-c"><span class="chip or">${ic('sparkles', 14)}Rewritten in your style</span><span class="chip line">French → English</span><span class="chip grn">${ic('check', 13)}ready to send, by you</span></div>`,
    build(root, s) {
      s.nt = $('.nt', root); s.go = $('.go', root); s.slot = $('.slot', root); s.ins = $('.ins', root); s.note = $('.note', root); s.bub = $('.bub', root);
      s.raw = $('.b-raw', root); s.pol = $('.b-pol', root); s.chips = $$('.rw-c .chip', root);
      cue('type', s.t0 + 0.9, { d: NOTE.length / 40 }); cue('click', s.t0 + 3.25); cue('swoosh-up', s.t0 + 3.4, { v: 0.6 }); cue('sparkle', s.t0 + 4.2); cue('success', s.t0 + 5.0, { v: 0.6 });
    },
    update(lt, dur, root, s) {
      if (!s.m) {
        const b = rel(s.slot, root), n = rel(s.note, root);
        s.m = { sx: b.x, sy: b.y, w: b.w, h: s.ins.offsetHeight + 14, nx: n.x + 50, ny: n.y + 4 };
        s.bub.style.width = s.m.w + 16 + 'px';
        s.bub.style.height = s.m.h + 6 + 'px';
      }
      if (lt < 0.9) J.setHTML(s.nt, '<span class="ph">Add a note for Kiro…</span>');
      else if (lt < 3.3) type(s.nt, NOTE, lt, 0.9, 40);
      else J.setHTML(s.nt, '<span class="ph">Add a note for Kiro…</span>');
      tf(s.go, { s: lt > 3.15 && lt < 3.45 ? 1 - 0.12 * Math.sin((lt - 3.15) / 0.3 * Math.PI) : 1 });
      // la note brute monte dans le mail et se transforme
      const k = P(lt, 3.35, 1.3, E.ioC);
      const land = P(lt, 4.6, 0.35);
      const open = P(lt, 3.9, 0.7, E.ioC);
      s.slot.style.height = (s.m.h * open).toFixed(1) + 'px';
      const bx = lerp(s.m.nx, s.m.sx - 8, k), by = lerp(s.m.ny, s.m.sy - 4, k);
      tf(s.bub, { x: bx, y: by, o: lt < 3.35 ? 0 : 1 - land, s: 1 });
      s.bub.style.background = `rgba(255,${lerp(243, 240, k).toFixed(0)},${lerp(214, 225, k).toFixed(0)},${(0.95 - 0.5 * k).toFixed(3)})`;
      s.bub.style.boxShadow = `0 ${(18 * (1 - k)).toFixed(1)}px 40px rgba(35,47,62,${(0.25 * Math.sin(k * Math.PI)).toFixed(3)})`;
      tf(s.raw, { o: 1 - P(lt, 3.6, 0.6), b: 8 * P(lt, 3.6, 0.6) });
      tf(s.pol, { o: P(lt, 3.9, 0.6), b: 8 * (1 - P(lt, 3.9, 0.6)) });
      s.ins.style.opacity = land.toFixed(3);
      s.ins.style.background = `rgba(255,153,0,${(0.2 * land * (1 - P(lt, 5.2, 2.2))).toFixed(3)})`;
      s.chips.forEach((c, i) => vis(c, lt, 5.0 + i * 0.15, Infinity, { dy: 12, ds: -0.15, din: 0.6, ein: E.outB }));
    },
  });

  // ------------------------------------------------ agenda
  const DAYS = [['Wed', 7, []], ['Thu', 8, []], ['Fri', 9, ['Unai OoO', 'Valentin OOO']], ['Mon', 12, ['Matthieu OOO']], ['Tue', 13, []]];
  const EVT = [ // jour, début, fin, titre, style, demi (0 plein, 1 gauche, 2 droite)
    [0, 10, 10.5, 'Prepare team meeting owner', 'mut', 0], [0, 16, 17, 'PSC Brainfood Session', 'inv', 1], [0, 16, 17, 'Canceled: Nintendo…', 'can', 2],
    [1, 10, 10.5, '1:1 Val / Steph', '', 0], [1, 11, 12, '2026 H2 FR PSC Meeting', 'key', 1], [1, 11, 12, 'Booked for "2026…', '', 2], [1, 17.5, 18, '2026 AdTech Spotlight', '', 0], [1, 18.2, 18.8, 'PSC Fireside Chat with Sophie', '', 0],
    [2, 10, 10.5, 'Weekly - Dentsu GAE x Amazon Ads', '', 0], [2, 11, 12, 'EU PSC WBR', '', 0],
    [3, 11.5, 12, 'Catch-up Rayan (AMZ) Hebdo', '', 0], [3, 14, 14.5, 'Weekly connect Gseb internal', '', 0], [3, 15.5, 16, 'Weekly GAE', '', 1], [3, 15.5, 16, 'APW - GAE Pod', '', 2], [3, 16.5, 17, 'DENTSU Weekly ADM AM PSC', '', 0],
    [4, 9.5, 11, 'Total Media Pitch Reveal + Supply Updates', '', 0], [4, 11, 12, 'Inventory Hub, Deal Builder & Supply Desk', '', 0], [4, 12.5, 14.5, 'Dej Amazon // Dre…', '', 1], [4, 14, 15, 'Measurement GTM…', '', 2], [4, 15.5, 16, 'Basic Deal Troubleshooting', '', 0],
  ];
  const HR = 40, H0 = 9, COLW = 182;
  feature('agenda', TL.agenda, {
    kicker: '01 · Start your day', head: 'Every meeting,<br><span class="hl">on your radar.</span>',
    sub: 'Unanswered invites flagged. Each meeting linked to its client.',
    css: `
    #sc-agenda .ag{position:absolute;left:0;top:150px;width:1010px;padding:24px 26px}
    #sc-agenda .ag-h{display:flex;align-items:baseline;gap:12px;margin-bottom:14px}
    #sc-agenda .ag-h span:last-child{color:var(--mut);font-size:14px}
    #sc-agenda .ag-days{display:flex;margin-left:52px;height:74px}
    #sc-agenda .ag-day{width:${COLW}px;text-align:center}
    #sc-agenda .ag-day small{display:block;font-size:13px;color:var(--mut)}
    #sc-agenda .ag-day b{font-family:InterTight;font-size:24px}
    #sc-agenda .ag-day.today b{color:var(--or)}
    #sc-agenda .ooo{display:flex;gap:4px;justify-content:center;margin-top:4px}
    #sc-agenda .ooo span{font-size:11px;font-weight:650;color:var(--or);background:var(--orbg);border-radius:999px;padding:3px 7px;white-space:nowrap}
    #sc-agenda .ag-body{position:relative;height:${10 * HR + 4}px;margin-left:52px;border-top:1px solid var(--line2)}
    #sc-agenda .hl-row{position:absolute;left:-52px;right:0;height:1px;background:var(--line2)}
    #sc-agenda .hl-row span{position:absolute;left:0;top:-8px;font:500 11.5px Plex,monospace;color:var(--mut2)}
    #sc-agenda .vl{position:absolute;top:0;bottom:0;width:1px;background:var(--line2)}
    #sc-agenda .ev{position:absolute;border-radius:6px;background:#F6F4F0;border-left:3px solid var(--navy);padding:4px 7px;font-size:12px;font-weight:650;color:var(--ink);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;line-height:1.3}
    #sc-agenda .ev.mut{color:var(--mut);border-left-color:#C9C4BC}
    #sc-agenda .ev.can{color:var(--mut2);text-decoration:line-through;border-left-color:#D9D4CC}
    #sc-agenda .ev.inv{background:#FFF5EC;border:1.5px dashed var(--or);border-left:3px solid var(--or)}
    #sc-agenda .ev.key{box-shadow:0 0 0 0 rgba(242,102,27,0)}
    #sc-agenda .now{position:absolute;left:0;width:${COLW}px;height:2px;background:var(--or)}
    #sc-agenda .now::before{content:"";position:absolute;left:-4px;top:-3px;width:8px;height:8px;border-radius:50%;background:var(--or)}
    #sc-agenda .ag-inv{margin-top:14px;border-top:1px solid var(--line2);padding-top:12px}
    #sc-agenda .inv-h{display:flex;gap:10px;align-items:baseline;margin-bottom:6px}
    #sc-agenda .inv-r{display:flex;align-items:center;gap:12px;padding:8px 0;font-size:15px}
    #sc-agenda .inv-r .ic{color:var(--mut)}
    #sc-agenda .inv-r b{font-weight:600}
    #sc-agenda .inv-r em{font-style:normal;color:var(--mut);font-size:13.5px}
    #sc-agenda .prep{position:absolute;left:560px;top:70px;width:440px;padding:18px 20px}
    #sc-agenda .pr-h{display:flex;gap:12px;align-items:center}
    #sc-agenda .pr-i{width:42px;height:42px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;flex:none}
    #sc-agenda .pr-t{font-weight:700;font-size:16.5px}
    #sc-agenda .pr-s{font-size:13.5px;color:var(--mut);margin-top:2px}
    #sc-agenda .pr-c{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
    #sc-agenda svg.lk{position:absolute;left:0;top:0;width:1040px;height:1080px;overflow:visible;pointer-events:none}
    `,
  }, {
    html: `<div class="card ag">
      <div class="ag-h"><span class="htitle" style="font-size:28px">Week</span><span>24 meetings · next 7 days</span></div>
      <div class="ag-days">${DAYS.map((d, i) => `<div class="ag-day${i === 0 ? ' today' : ''}"><small>${d[0]}</small><b>${d[1]}</b>${d[2].length ? `<div class="ooo">${d[2].map(o => `<span>${o}</span>`).join('')}</div>` : ''}</div>`).join('')}</div>
      <div class="ag-body">
        ${Array.from({ length: 11 }, (_, i) => `<div class="hl-row" style="top:${i * HR}px"><span>${String(H0 + i).padStart(2, '0')}:00</span></div>`).join('')}
        ${[1, 2, 3, 4].map(i => `<div class="vl" style="left:${i * COLW}px"></div>`).join('')}
        ${EVT.map(e => { const half = e[5]; const w = half ? COLW / 2 - 6 : COLW - 8; const x = e[0] * COLW + 4 + (half === 2 ? COLW / 2 - 2 : 0);
          return `<div class="ev ${e[4]}" style="left:${x}px;top:${(e[1] - H0) * HR + 2}px;width:${w}px;height:${Math.max((e[2] - e[1]) * HR - 4, 18)}px">${J.esc(e[3])}</div>`; }).join('')}
        <div class="now" style="top:${(18.9 - H0) * HR}px"></div>
      </div>
      <div class="ag-inv"><div class="inv-h"><span class="htitle" style="font-size:18px">Invitations without reply</span><span class="chip red" style="height:24px">15</span></div>
        <div class="inv-r">${ic('calendar', 18)}<b>PSC Brainfood Session - Ads Moderation Agent</b><em>16:00–17:00 · 13 participants</em><span class="chip or mono" style="height:24px">to confirm</span></div>
        <div class="inv-r">${ic('calendar', 18)}<b>Ads Tech Talk: Keeping Your Pipelines Green</b><em>21:00–22:00 · 51 participants</em><span class="chip or mono" style="height:24px">to confirm</span></div></div>
    </div>
    `,
    build(root, s) {
      s.evs = $$('.ev', root); s.key = $('.ev.key', root); s.inv = $$('.inv-r', root); s.invh = $('.inv-h', root);
      s.now = $('.now', root);
      s.order = s.evs.map((e, i) => i).sort((a, b) => EVT[a][0] - EVT[b][0] || EVT[a][1] - EVT[b][1]);
      s.order.forEach((ei, k) => cue('tick', s.t0 + 0.55 + k * 0.045, { v: 0.25 }));
      cue('pop', s.t0 + 2.5); cue('pulse', s.t0 + 3.5, { v: 0.7 });
    },
    update(lt, dur, root, s) {
      s.order.forEach((ei, k) => { const e = s.evs[ei]; const a = 0.55 + k * 0.045; tf(e, { s: 0.85 + 0.15 * P(lt, a, 0.5, E.outB), o: P(lt, a, 0.3) }); });
      s.now.style.opacity = P(lt, 1.6, 0.4);
      pop(s.invh, lt, 2.4); s.inv.forEach((r, i) => pop(r, lt, 2.55 + i * 0.15));
      const hk = P(lt, 3.5, 0.5, E.outB);
      if (lt > 3.5) { s.key.style.boxShadow = `0 0 0 ${(3 * hk).toFixed(1)}px rgba(242,102,27,.9), 0 8px 24px rgba(242,102,27,${(0.35 * hk).toFixed(2)})`; s.key.style.zIndex = 5; }
      else s.key.style.boxShadow = 'none';
      tf(s.key, { s: 1 + 0.08 * hk, o: P(lt, 0.6, 0.3) });
    },
  });

  // ------------------------------------------------ réunions : préparées la veille par un agent dédié
  const PREP = [
    ['users', "who's in the room", 'PSC France team · PAM · organizer: PSC lead', ''],
    ['refresh-cw', 'since last time', 'AST-PSC switch confirmed: one owner per account, last shared day 16/10', ''],
    ['chart-column', 'numbers to know', '40 live campaigns · 5 to catch up · 2 SIM tickets open on BFM', ''],
    ['message-square', 'talking points', 'Accounts to hand over before 16/10 · C-SAT signals from Ad Services', ''],
    ['triangle-alert', 'watch out', 'BFM: ~€51k at risk, no agency thread yet', 'r'],
    ['target', 'your ask', 'Agree on an owner for the Equativ escalation', ''],
  ];
  feature('meeting', TL.meeting, {
    kicker: '01 · Start your day', head: 'Walk in<br><span class="hl">ready.</span>',
    sub: 'A dedicated agent prepares every meeting the day before: context, numbers, talking points.',
    css: `
    #sc-meeting .tl{position:absolute;left:0;top:170px;width:1010px;height:128px;padding:0 34px}
    #sc-meeting .tn{position:absolute;top:30px;display:flex;gap:14px;align-items:center}
    #sc-meeting .tn .ti{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;color:#fff;flex:none}
    #sc-meeting .tn b{display:block;font-family:InterTight;font-size:22px}
    #sc-meeting .tn span{font-size:14px;color:var(--mut)}
    #sc-meeting .n1{left:34px}#sc-meeting .n2{right:34px;flex-direction:row-reverse;text-align:right}
    #sc-meeting .tr{position:absolute;left:330px;right:380px;top:62px;height:3px;border-radius:3px;background:#ECE7E0}
    #sc-meeting .tr i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:linear-gradient(90deg,#FF9900,#F26B1D);transform-origin:0 50%}
    #sc-meeting .tr b{position:absolute;top:-7px;width:17px;height:17px;margin-left:-8px;border-radius:50%;background:#FF9900;box-shadow:0 0 0 6px rgba(255,153,0,.2),0 0 18px rgba(255,153,0,.7)}
    #sc-meeting .tr em{position:absolute;left:50%;top:-36px;transform:translateX(-50%);font:600 13px Plex,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--amz-d);white-space:nowrap}
    #sc-meeting .pd{position:absolute;left:0;top:328px;width:1010px;padding:24px 28px 18px}
    #sc-meeting .pd-h{display:flex;align-items:center;gap:14px;margin-bottom:6px}
    #sc-meeting .pd-h .sp{flex:1}
    #sc-meeting .pd-t{font-weight:700;font-size:22px}
    #sc-meeting .pd-s{font-size:14px;color:var(--mut);margin-bottom:12px}
    #sc-meeting .pg{display:grid;grid-template-columns:1fr 1fr;gap:0 28px}
    #sc-meeting .ps{display:flex;gap:14px;padding:14px 0;border-top:1px solid var(--line2)}
    #sc-meeting .ps .pi{width:36px;height:36px;border-radius:10px;background:#F3F0EB;color:#4D555D;display:grid;place-items:center;flex:none}
    #sc-meeting .ps.r .pi{background:var(--redbg);color:var(--red)}
    #sc-meeting .ps .lbl{margin-bottom:5px}
    #sc-meeting .ps p{font-size:15.5px;line-height:1.45;color:var(--ink);font-weight:550}
    #sc-meeting .ps.r p{color:var(--red)}
    `,
  }, {
    html: `<div class="card tl">
        <div class="tn n1"><div class="ti" style="background:var(--ink)">${ic('brain', 24)}</div><div><b>Wed · 17:33</b><span>Prep agent runs, on its own</span></div></div>
        <div class="tr"><i></i><b></b><em>prepared 17 h ahead</em></div>
        <div class="tn n2"><div class="ti" style="background:#E5533D">${ic('calendar', 24)}</div><div><b>Thu · 11:00</b><span>2026 H2 FR PSC Meeting + PAM</span></div></div></div>
      <div class="card pd"><div class="pd-h"><span class="pd-t">Meeting prep · 2026 H2 FR PSC Meeting + PAM</span><span class="sp"></span><span class="chip or">${ic('brain', 14)}prep agent</span><span class="chip gray">${ic('clock', 13)}ready the day before</span></div>
        <div class="pd-s">Built from your emails, the campaign data and the last meeting notes. Nobody asked for it.</div>
        <div class="pg">${PREP.map(p => `<div class="ps ${p[3]}"><div class="pi">${ic(p[0], 18)}</div><div><div class="lbl">${p[1]}</div><p>${p[2]}</p></div></div>`).join('')}</div></div>`,
    build(root, s) {
      s.n1 = $('.n1', root); s.n2 = $('.n2', root); s.fill = $('.tr i', root); s.dot = $('.tr b', root); s.em = $('.tr em', root);
      s.pd = $('.pd', root); s.ps = $$('.ps', root);
      cue('pop', s.t0 + 0.6, { v: 0.4 }); cue('rise', s.t0 + 0.9, { d: 1.4 }); cue('pop', s.t0 + 2.3, { v: 0.5 });
      PREP.forEach((_, i) => cue('tick', s.t0 + 2.8 + i * 0.32, { v: 0.45 }));
      cue('success', s.t0 + 5.0, { v: 0.5 });
    },
    update(lt, dur, root, s) {
      pop(s.n1, lt, 0.45); pop(s.n2, lt, 0.6);
      const k = P(lt, 0.9, 1.4, E.ioC);
      s.fill.style.transform = `scaleX(${k.toFixed(4)})`;
      s.dot.style.left = (100 * k).toFixed(2) + '%';
      s.dot.style.opacity = P(lt, 0.85, 0.2).toFixed(3);
      vis(s.em, lt, 1.6, Infinity, { dy: 8, blur: 4 });
      vis(s.pd, lt, 2.2, Infinity, { dy: 40, blur: 12, din: 0.9, ein: E.outX });
      s.ps.forEach((p, i) => pop(p, lt, 2.8 + i * 0.32, { dy: 14 }));
    },
  });

  // =================================================================== 02 · RUN YOUR CAMPAIGNS
  chapter('c2', TL.c2, '02', 'Run your <span class="hl">campaigns.</span>');

  // ------------------------------------------------ données DSP natives
  const DSP_ROWS = [
    ['FR - BFM · SVOD PVA PD', '2.3%', '29%', '×9.4', 'r'], ['FR - BFM · BVOD CUTV', '11%', '29%', '×1.6', 'r'], ['GAE SPF · M6 Mois sans tabac', '8.2%', '12.5%', '×1.7', 'a'],
    ['Disney · Whalefall FR', '12%', '25%', '×2.1', 'r'], ['ENI · Plénitude multi-device', '0%', '2%', 'blocked', 'a'], ['Sage · VOL AVOD', '51%', '49%', '×1.0', 'g'],
    ['Orpi · Vol National Rentrée', '18%', '22%', '×1.3', 'a'], ['Groupe SEB · CoffeeCrush', '63%', '61%', '×1.0', 'g'], ['Heroiks · Nickel Automne', '40%', '38%', '×1.0', 'g'],
    ['Columbia · UK orders', '72%', '70%', '×1.0', 'g'], ['Qonto · Ogury H2', '44%', '45%', '×1.0', 'g'], ['Boursorama · REBOOT 2026', '9%', '10%', '×1.1', 'g'],
  ];
  const DRH = 52;
  feature('data', TL.data, {
    kicker: '02 · Run your campaigns', head: 'Amazon DSP data.<br><span class="hl">Built in.</span>',
    sub: 'Every export feeds the brain, so delivery issues surface before the client sees them.',
    css: `
    #sc-data .dx{position:absolute;left:0;top:230px;width:650px;padding:22px 0 0;overflow:hidden}
    #sc-data .dx-h{display:flex;align-items:center;gap:10px;padding:0 24px 14px}
    #sc-data .dx-h b{font-weight:700;font-size:18px}
    #sc-data .dx-h .lbl{margin-left:auto;letter-spacing:.06em}
    #sc-data .dx-cols,#sc-data .dx-r{display:grid;grid-template-columns:1fr 78px 70px 92px;align-items:center;padding:0 24px;gap:8px}
    #sc-data .dx-cols{font:500 12px Plex,monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--mut2);height:34px;background:#F7F5F1;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2)}
    #sc-data .dx-v{position:relative;height:${DRH * 7}px;overflow:hidden;-webkit-mask-image:linear-gradient(#000 80%,transparent)}
    #sc-data .dx-r{height:${DRH}px;border-bottom:1px solid var(--line2);font:500 14.5px Plex,monospace;color:var(--ink2)}
    #sc-data .dx-r span:first-child{font-family:InterV;font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #sc-data .dx-r .pc{justify-self:end}
    #sc-data .dx-r.r span:first-child{color:var(--red)}
    #sc-data .flow{position:absolute;left:0;top:0;width:1040px;height:1080px;pointer-events:none}
    #sc-data .fp{position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#FF9A3C;box-shadow:0 0 14px 3px rgba(255,130,40,.6)}
    #sc-data .orbw{position:absolute;left:860px;top:540px}
    #sc-data .o-l{position:absolute;left:860px;top:660px;transform:translateX(-50%);text-align:center;white-space:nowrap}
    #sc-data .o-l b{display:block;font-weight:700;font-size:20px}
    #sc-data .o-l span{font:500 13px Plex,monospace;color:var(--mut);letter-spacing:.06em}
    `,
  }, {
    html: `<div class="card dx"><div class="dx-h">${ic('sheet', 20)}<b>Amazon DSP export</b><span class="lbl">06/10 · 40 campaigns · 33 advertisers</span></div>
      <div class="dx-cols"><span>Advertiser · line</span><span>Deliv.</span><span>Time</span><span style="justify-self:end">Pace</span></div>
      <div class="dx-v"><div class="dx-l">${DSP_ROWS.concat(DSP_ROWS).map(r => `<div class="dx-r ${r[4]}"><span>${r[0]}</span><span>${r[1]}</span><span>${r[2]}</span><span class="pc chip ${{ r: 'red', a: 'amb', g: 'grn' }[r[4]]}" style="height:26px;font-family:Plex">${r[3]}</span></div>`).join('')}</div></div></div>
      <div class="flow"></div><div class="orbw">${orb(150)}</div><div class="o-l"><b>Kiro brain</b><span>42 passes · synced 13 min ago</span></div>`,
    build(root, s) {
      s.list = $('.dx-l', root); s.orb = $('.orb', root); s.ol = $('.o-l', root);
      const flow = $('.flow', root), r = rng(3);
      s.parts = Array.from({ length: 16 }, (_, i) => { const p = J.h('<div class="fp"></div>'); flow.appendChild(p); return { el: p, y0: 330 + r() * 420, ph: r(), sp: 0.55 + r() * 0.3 }; });
      cue('data', s.t0 + 0.9, { d: 4.2 });
    },
    update(lt, dur, root, s, t) {
      s.list.style.transform = `translateY(${-((lt * 34) % (DSP_ROWS.length * DRH)).toFixed(1)}px)`;
      const on = P(lt, 0.9, 0.6);
      s.parts.forEach(p => {
        const ph = (lt * p.sp + p.ph) % 1, u = E.inQ(ph);
        const x = lerp(650, 860, u), y = lerp(p.y0, 540, E.ioC(ph)) - Math.sin(ph * Math.PI) * 40;
        p.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${(1 - 0.5 * u).toFixed(3)})`;
        p.el.style.opacity = (on * Math.sin(ph * Math.PI)).toFixed(3);
      });
      const pulse = orbTick(s.orb, t, { glow: 0.7 + 0.5 * on });
      tf(s.orb, { s: pulse * (0.6 + 0.4 * P(lt, 0.5, 1.0, E.outB)), o: P(lt, 0.4, 0.5) });
      pop(s.ol, lt, 1.0);
    },
  });

  // ------------------------------------------------ carte du pacing
  const PX = x => 64 + x / 100 * 862, PY = y => 470 - y / 100 * 440;
  function pacingDots() {
    const r = rng(11), d = [];
    for (let i = 0; i < 20; i++) { const x = 3 + i * 4.6 + r() * 2.5; d.push({ x, y: Math.min(99, x * (0.96 + r() * 0.1)), c: 'g', r: 6 + r() * 4 }); }
    for (let i = 0; i < 15; i++) { const x = 9 + r() * 62; d.push({ x, y: x * (0.62 + r() * 0.18), c: 'a', r: 6 + r() * 4 }); }
    d.push({ x: 29, y: 2.3, c: 'r', r: 12, tk: 1, lab: 'FR · BFM · Connected TV SVOD', lx: 34, ly: 4 });
    d.push({ x: 29, y: 11, c: 'r', r: 9, tk: 1 });
    d.push({ x: 24, y: 12.5, c: 'r', r: 10, lab: 'Disney Studios · Whalefall', lx: -214, ly: 60 });
    d.push({ x: 19, y: 8, c: 'r', r: 9, lab: 'GAE · Santé publique France', lx: -226, ly: 20 });
    d.push({ x: 36, y: 20, c: 'r', r: 8 });
    return d;
  }
  const DOTS = pacingDots();
  const COL = { g: '#2E9E6A', a: '#D18E1C', r: '#D23B2E' };
  feature('pacing', TL.pacing, {
    kicker: '02 · Run your campaigns', head: 'See under-delivery<br><span class="hl">before your client does.</span>',
    sub: 'The pacing map: catch up, watch, or on pace. At a glance.',
    css: `
    #sc-pacing .head{font-size:74px}
    #sc-pacing .pc{position:absolute;left:0;top:150px;width:1010px;padding:24px 26px 18px}
    #sc-pacing .pc-bar{display:flex;gap:4px;height:10px;border-radius:9px;overflow:hidden;margin-bottom:14px}
    #sc-pacing .pc-bar i{display:block;height:100%;transform-origin:0 50%}
    #sc-pacing .pc-lg{display:flex;gap:22px;align-items:center;font-size:15px;color:var(--ink2);margin-bottom:22px}
    #sc-pacing .pc-lg span{display:inline-flex;gap:8px;align-items:center}
    #sc-pacing .pc-lg b{font-family:InterTight;font-size:18px}
    #sc-pacing .pc-lg .sep{width:1px;height:18px;background:var(--line)}
    #sc-pacing .pc-t{display:flex;align-items:baseline;gap:14px;margin-bottom:6px}
    #sc-pacing svg{display:block;width:958px;height:520px;overflow:visible}
    #sc-pacing svg text{font-family:Plex,monospace;font-size:13px;fill:#9AA0A6}
    #sc-pacing svg .lab{font-family:InterV;font-weight:650;font-size:15px;fill:#14181D}
    `,
  }, {
    html: `<div class="card pc">
      <div class="pc-bar"><i style="width:12.5%;background:${COL.r}"></i><i style="width:37.5%;background:${COL.a}"></i><i style="width:50%;background:${COL.g}"></i></div>
      <div class="pc-lg"><span><i class="dot" style="background:${COL.r}"></i><b class="n1">0</b> to catch up</span><span><i class="dot" style="background:${COL.a}"></i><b class="n2">0</b> to watch</span><span><i class="dot" style="background:${COL.g}"></i><b class="n3">0</b> on pace</span><span class="sep"></span><span>${ic('file', 16)}<b>4</b> tickets open</span><span>${ic('mail', 16)}<b>11</b> threads waiting on you</span></div>
      <div class="pc-t"><span class="htitle" style="font-size:22px">Pacing map</span><span class="lbl" style="letter-spacing:.04em;text-transform:none">one dot per campaign · below the diagonal: behind · dashed ring: ticket open</span></div>
      <svg viewBox="0 0 958 520">
        <defs><clipPath id="pcclip"><rect x="64" y="30" width="862" height="440"/></clipPath></defs>
        <g class="grid">${[0, 25, 50, 75, 100].map(v => `<line x1="${PX(v)}" y1="30" x2="${PX(v)}" y2="470" stroke="#EFEBE5"/><line x1="64" y1="${PY(v)}" x2="926" y2="${PY(v)}" stroke="#EFEBE5"/><text x="${PX(v)}" y="496" text-anchor="middle">${v}%</text><text x="52" y="${PY(v) + 4}" text-anchor="end">${v}</text>`).join('')}
          <text x="${PX(50)}" y="518" text-anchor="middle">time elapsed</text></g>
        <polygon class="band" clip-path="url(#pcclip)" points="${PX(0)},${PY(7)} ${PX(93)},${PY(100)} ${PX(100)},${PY(100)} ${PX(100)},${PY(86)} ${PX(0)},${PY(-4)}" fill="rgba(46,158,106,.10)"/>
        <line class="diag" x1="${PX(0)}" y1="${PY(0)}" x2="${PX(100)}" y2="${PY(100)}" stroke="#9AA0A6" stroke-width="1.6" stroke-dasharray="7 7"/>
        <text class="t-on" x="${PX(96)}" y="${PY(100) - 8}" text-anchor="end" style="font-size:15px;fill:#5F676F">on pace</text>
        <text class="t-be" x="${PX(92)}" y="${PY(28)}" text-anchor="end" style="font-size:15px;fill:${COL.r}">behind ↓</text>
        <g class="dots">${DOTS.map(d => `<g transform="translate(${PX(d.x)},${PY(d.y)})"><circle class="pl" r="${d.r}" fill="none" stroke="${COL[d.c]}" stroke-width="2" opacity="0"/>${d.tk ? `<circle class="tk" r="${d.r + 7}" fill="none" stroke="#F2661B" stroke-width="2.2" stroke-dasharray="4 4"/>` : ''}<circle class="cd" r="${d.r}" fill="${COL[d.c]}" fill-opacity="${d.c === 'g' ? 0.75 : 0.92}"/></g>`).join('')}</g>
        <g class="labs">${DOTS.filter(d => d.lab).map(d => `<g transform="translate(${PX(d.x)},${PY(d.y)})"><line x1="0" y1="0" x2="${d.lx < 0 ? d.lx + d.lab.length * 8.2 + 6 : d.lx - 6}" y2="${-d.ly - 11}" stroke="#14181D" stroke-width="1"/><text class="lab" x="${d.lx}" y="${-d.ly - 6}">${d.lab}</text></g>`).join('')}</g>
      </svg></div>`,
    build(root, s) {
      s.segs = $$('.pc-bar i', root); s.n = ['.n1', '.n2', '.n3'].map(q => $(q, root));
      s.dots = $$('.dots > g', root).map((g, i) => ({ g, d: DOTS[i], c: $('.cd', g), pl: $('.pl', g), tk: $('.tk', g) }));
      s.labs = $$('.labs > g', root); s.band = $('.band', root); s.diag = $('.diag', root); s.ton = $('.t-on', root); s.tbe = $('.t-be', root);
      s.dots.forEach(o => { o.a = 1.2 + o.d.x / 100 * 1.6 + (o.d.c === 'r' ? 0.4 : 0); });
      [...new Set(s.dots.map(o => Math.round(o.a * 12) / 12))].forEach(a => cue('tick', s.t0 + a, { v: 0.22 }));
      cue('alert', s.t0 + 2.9, { v: 0.6 }); cue('pop', s.t0 + 3.3);
    },
    update(lt, dur, root, s) {
      s.segs.forEach((g, i) => { g.style.transform = `scaleX(${P(lt, 0.55 + i * 0.25, 0.7, E.outQu).toFixed(4)})`; });
      [[5, 0.55], [15, 0.8], [20, 1.05]].forEach(([v, a], i) => count(s.n[i], lt, a, 0.9, 0, v));
      s.diag.style.strokeDashoffset = 0;
      s.diag.style.opacity = P(lt, 0.8, 0.5); s.band.style.opacity = P(lt, 1.0, 0.6);
      s.ton.style.opacity = P(lt, 1.4, 0.4); s.tbe.style.opacity = P(lt, 2.8, 0.4);
      s.dots.forEach(o => {
        const k = P(lt, o.a, 0.7, E.spring);
        o.c.setAttribute('transform', `scale(${Math.max(0, k).toFixed(3)})`);
        if (o.d.c === 'r' && lt > 2.9) {
          const ph = ((lt - 2.9) / 1.5) % 1;
          o.pl.setAttribute('r', (o.d.r + 22 * E.outC(ph)).toFixed(1)); o.pl.setAttribute('opacity', (0.8 * (1 - ph)).toFixed(3));
        }
        if (o.tk) { o.tk.setAttribute('transform', `rotate(${(lt * 40).toFixed(1)}) scale(${Math.max(0, P(lt, 3.1, 0.5, E.outB)).toFixed(3)})`); }
      });
      s.labs.forEach((g, i) => { g.style.opacity = P(lt, 3.3 + i * 0.18, 0.5); });
    },
  });

  // ------------------------------------------------ des chiffres aux actions
  feature('actions', TL.actions, {
    kicker: '02 · Run your campaigns', head: 'Numbers become<br><span class="hl">actions.</span>',
    sub: 'Delivered share, money at risk, end date: an under-delivery becomes a costed task.',
    css: `
    #sc-actions .hs{position:absolute;left:0;top:130px;width:1010px;padding:24px 26px}
    #sc-actions .hs-h{display:flex;gap:14px;align-items:center}
    #sc-actions .hs-t{font-weight:700;font-size:20px}
    #sc-actions .hs-s{font-size:14px;color:var(--mut);margin-top:3px}
    #sc-actions .hs-h .chip{margin-left:auto}
    #sc-actions .hs-m{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:14px;margin:20px 0 16px}
    #sc-actions .hs-k{padding:18px 20px;border-radius:14px;background:#F7F5F1}
    #sc-actions .hs-n{font-family:InterTight;font-weight:700;font-size:58px;letter-spacing:-.03em;line-height:1.05;margin-top:6px;font-variant-numeric:tabular-nums}
    #sc-actions .hs-n.r{color:var(--red)}
    #sc-actions .hs-c{font-size:14.5px;color:var(--mut);margin-top:6px}
    #sc-actions .hs-c b{color:var(--ink)}
    #sc-actions .hs-bar{position:relative;height:9px;border-radius:9px;background:#F0D6CF;margin-top:12px}
    #sc-actions .hs-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:9px;background:var(--red)}
    #sc-actions .hs-bar b{position:absolute;top:-6px;bottom:-6px;width:3px;border-radius:2px;background:var(--or);left:29%}
    #sc-actions .hs-tk{display:flex;gap:8px;flex-wrap:wrap}
    #sc-actions .hs-tk .chip.or{border:1.5px solid #F6B48C;background:#fff}
    #sc-actions svg.ln{position:absolute;left:0;top:0;width:1040px;height:1080px;overflow:visible}
    #sc-actions .tk{position:absolute;left:0;top:640px;width:1010px;padding:22px 26px;border:2px solid #F7C3A4}
    #sc-actions .tk-r{display:flex;gap:14px;align-items:flex-start}
    #sc-actions .tk-cb{width:24px;height:24px;border-radius:6px;border:2px solid #C9C4BC;flex:none;margin-top:3px}
    #sc-actions .tk-t{font-weight:700;font-size:20px;line-height:1.35}
    #sc-actions .tk-m{display:flex;gap:16px;align-items:center;margin:12px 0 0 74px;font-size:14.5px;color:var(--mut)}
    #sc-actions .tk-m span{display:inline-flex;gap:6px;align-items:center}
    #sc-actions .tk-n{margin:12px 0 0 74px;font-size:15px;color:var(--ink2)}
    #sc-actions .tk-n b{color:var(--red)}
    #sc-actions .tk-d{margin:12px 0 0 74px;padding-top:12px;border-top:1px solid var(--line2);font-size:15px;display:flex;gap:14px;align-items:center}
    #sc-actions .auto{position:absolute;right:30px;top:600px;display:flex;gap:8px;align-items:center;height:36px;padding:0 16px;border-radius:999px;background:var(--ink);color:#fff;font-size:14.5px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.2)}
    #sc-actions .auto .ic{color:#FFB547}
    `,
  }, {
    html: `<div class="card hs">
      <div class="hs-h"><span class="badge" style="height:30px;font-size:16px">73</span><div><div class="hs-t">FR - Banque Française Mutualiste (BFM)</div><div class="hs-s">2026-09 - BFM - NOTORIÉTÉ OCTOBRE AMAZON · Connected TV SVOD</div></div><span class="chip red mono">catch up</span></div>
      <div class="hs-m">
        <div class="hs-k"><div class="lbl">delivered</div><div class="hs-n r"><span class="v1">0</span>%</div><div class="hs-bar"><i class="hb"></i><b></b></div><div class="hs-c">for <b>29%</b> of the flight time</div></div>
        <div class="hs-k"><div class="lbl">pace needed</div><div class="hs-n">×<span class="v2">0</span></div><div class="hs-c">124 €/day → <b>1,167 €/day</b></div></div>
        <div class="hs-k"><div class="lbl">at risk</div><div class="hs-n r">€<span class="v3">0</span></div><div class="hs-c">ends <b>15/11</b> · 40 days left</div></div>
      </div>
      <div class="hs-tk"><span class="chip or">${ic('file', 14)}ticket P529341292 · in progress</span><span class="chip or">${ic('file', 14)}ticket P529520879 · in progress</span><span class="chip gray">creatives</span><span class="chip gray">bid requests</span><span class="chip gray">forward rate</span></div>
    </div>
    <svg class="ln"><path d="M505,560 L505,628" fill="none" stroke="#F2661B" stroke-width="3" stroke-linecap="round"/><path class="ah" d="M494,618 L505,632 L516,618" fill="none" stroke="#F2661B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div class="auto">${ic('sparkles', 16)}Task created from the DSP export</div>
    <div class="card tk">
      <div class="tk-r"><span class="tk-cb"></span><span style="color:var(--red);margin-top:2px">${ic('flag', 22, 'fill:currentColor')}</span><div class="tk-t">BFM: chase Amnet and the publishers on Connected TV SVOD and BVOD CUTV, follow both No Delivery tickets</div></div>
      <div class="tk-m"><span class="chip red mono">urgent</span><span>${ic('calendar', 15)}tomorrow</span><span><i class="dot" style="background:var(--grn)"></i>BFM · October awareness (Amnet)</span></div>
      <div class="tk-n"><b>2.3% delivered</b> for 29% of the time · <b>€41,708 at risk</b> · ends 15/11</div>
      <div class="tk-d"><span class="lbl">to do</span>Check the frequency cap on LI 576846537869584392</div>
    </div>`,
    build(root, s) {
      s.v = ['.v1', '.v2', '.v3'].map(q => $(q, root)); s.hb = $('.hb', root); s.ks = $$('.hs-k', root); s.chips = $$('.hs-tk .chip', root);
      s.ln = $('svg.ln path', root); s.ah = $('svg.ln .ah', root); s.tk = $('.tk', root); s.auto = $('.auto', root);
      s.tkParts = [$('.tk-m', root), $('.tk-n', root), $('.tk-d', root)];
      cue('count', s.t0 + 0.9, { d: 1.4 }); cue('hit', s.t0 + 3.95, { v: 0.55 }); cue('pop', s.t0 + 4.7); cue('sparkle', s.t0 + 5.3);
    },
    update(lt, dur, root, s) {
      s.ks.forEach((k, i) => pop(k, lt, 0.7 + i * 0.12));
      count(s.v[0], lt, 0.9, 1.4, 0, 2.3, { dec: 1 }); count(s.v[1], lt, 1.0, 1.4, 1, 9.4, { dec: 1 }); count(s.v[2], lt, 1.1, 1.5, 0, 41708);
      s.hb.style.width = (2.3 * P(lt, 0.9, 1.2, E.outQu)).toFixed(2) + '%';
      s.chips.forEach((c, i) => pop(c, lt, 1.9 + i * 0.08, { dy: 10 }));
      const d = P(lt, 3.5, 0.4, E.ioC);
      s.ln.style.strokeDasharray = '70'; s.ln.style.strokeDashoffset = (70 * (1 - d)).toFixed(1); s.ah.style.opacity = P(lt, 3.8, 0.15);
      vis(s.tk, lt, 3.75, Infinity, { dy: -50, blur: 14, ds: -0.04, din: 0.8, ein: E.outB });
      s.tkParts.forEach((p, i) => pop(p, lt, 4.5 + i * 0.15, { dy: 10 }));
      vis(s.auto, lt, 5.2, Infinity, { dy: 14, ds: -0.2, ein: E.outB, din: 0.6 });
      // pulsation du drapeau « urgent »
      const g = lt > 6.2 ? 0.5 + 0.5 * Math.sin((lt - 6.2) * 4) : 0;
      s.tk.style.boxShadow = `0 34px 90px -26px rgba(35,47,62,.26), 0 0 0 ${(6 * g).toFixed(1)}px rgba(242,102,27,${(0.12 * g).toFixed(3)})`;
    },
  });

  // ------------------------------------------------ troubleshooting guidé
  const STEPS = ['TWIG investigation', 'Context submitted', '24 h window', 'TWIG re-run', 'Escalation context', 'Review', 'SIM ticket'];
  const RECS = [
    'Reduce the product category targeting on the deal to 1 subcategory (max 3): stops 50% of the bid filtering.',
    'Fix the video outstream position targeting to match the available inventory: restores bid eligibility.',
  ];
  feature('trouble', TL.trouble, {
    kicker: '02 · Run your campaigns', head: 'Troubleshooting,<br><span class="hl">guided.</span>',
    sub: 'TWIG, Waypoint, the 24-hour window and every SIM ticket, step by step.',
    css: `
    #sc-trouble .tr{position:absolute;left:0;top:140px;width:1010px;padding:26px 28px}
    #sc-trouble .tr-h{display:flex;justify-content:space-between;align-items:flex-start}
    #sc-trouble .tr-ch{display:flex;gap:10px;align-items:center;margin:14px 0 6px}
    #sc-trouble .tr-id{font-size:13px;color:var(--mut)}
    #sc-trouble .tr-adv{font-size:14px;color:var(--mut);line-height:1.5}
    #sc-trouble .st{position:relative;height:96px;margin:22px 64px 6px}
    #sc-trouble .st-ln{position:absolute;left:0;right:0;top:9px;height:2px;background:#E4DFD7}
    #sc-trouble .st-fill{position:absolute;left:0;top:9px;height:2px;background:var(--ink);transform-origin:0 50%}
    #sc-trouble .st-n{position:absolute;top:0;width:20px;height:20px;margin-left:-10px;border-radius:50%;border:2px solid #CFC9C0;background:#fff}
    #sc-trouble .st-n.done{background:var(--ink);border-color:var(--ink)}
    #sc-trouble .st-n.cur{background:var(--or);border-color:var(--or)}
    #sc-trouble .st-halo{position:absolute;top:-10px;width:40px;height:40px;margin-left:-20px;border-radius:50%;border:2px solid var(--or)}
    #sc-trouble .st-l{position:absolute;top:32px;width:118px;margin-left:-59px;text-align:center;font:500 11px/1.35 Plex,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--mut2)}
    #sc-trouble .st-l.on{color:var(--ink);font-weight:600}
    #sc-trouble .cd{display:flex;gap:10px;align-items:center;font-size:17px;color:var(--ink2);padding:10px 0 18px}
    #sc-trouble .cd b{font-family:Plex,monospace;font-weight:600;color:var(--or);font-size:18px}
    #sc-trouble .cols{display:grid;grid-template-columns:1.6fr 1fr;gap:28px;border-top:1px solid var(--line2);padding-top:18px}
    #sc-trouble ul{margin:10px 0 14px 18px;font-size:15.5px;line-height:1.5;color:var(--ink2)}
    #sc-trouble li{margin-bottom:8px;min-height:46px}
    #sc-trouble .deal{font:500 13px Plex,monospace;background:#F3F0EB;border-radius:8px;padding:6px 10px;display:inline-block;margin-top:8px}
    #sc-trouble .sim{font-size:15px;color:var(--mut);margin:10px 0}
    #sc-trouble .sim-in{display:flex;gap:8px}
    #sc-trouble .sim-in span:first-child{flex:1;height:40px;border:1px solid var(--line);border-radius:10px;display:flex;align-items:center;padding:0 12px;font:500 14px Plex,monospace;color:var(--mut2)}
    #sc-trouble .act{display:flex;gap:10px;align-items:center;border-top:1px solid var(--line2);padding-top:18px;margin-top:6px}
    #sc-trouble .wp{margin-left:auto;display:inline-flex;gap:8px;align-items:center;height:38px;padding:0 16px;border-radius:999px;background:var(--grnbg);color:var(--grn);font-weight:650;font-size:15px}
    `,
  }, {
    html: `<div class="card tr">
      <div class="tr-h"><div><div class="lbl" style="margin-bottom:8px">not attached · ENTITY169SDCA9DCMP0</div><div class="htitle" style="font-size:30px">Ad group 582576323137355621</div></div><span class="btn orange">${ic('plus', 16)}New case</span></div>
      <div class="tr-ch"><span class="chip gray">Not urgent</span><span class="chip amb">Line not yet in the exports</span><span class="mono tr-id">wp-eu-muy82zgn4q4dqgdm7wf</span></div>
      <div class="tr-adv">Advertisers on this entity: GAE - Santé publique France, GAE - SIG, GAE - DRHAT, Ministère de la transition écologique…</div>
      <div class="st"><div class="st-ln"></div><div class="st-fill"></div>${STEPS.map((l, i) => `<div class="st-n" style="left:${(i / 6) * 100}%"></div><div class="st-l" style="left:${(i / 6) * 100}%">${l}</div>`).join('')}<div class="st-halo" style="left:${(2 / 6) * 100}%"></div></div>
      <div class="cd">${ic('clock', 19)}Re-run possible in <b class="cdv">21:46:12</b><span style="color:var(--mut)">· window ends 08/10 at 16:54 (Paris)</span></div>
      <div class="cols"><div><div class="lbl">TWIG recommendations</div><ul><li class="r0"></li><li class="r1"></li></ul><div class="lbl">deal</div><span class="deal">aW1wcm92ZSBkaWdpdGFs</span></div>
        <div><div class="lbl">SIM ticket</div><div class="sim">No SIM ticket yet.</div><div class="sim-in"><span>Ticket SIM (D…)</span><span class="btn">Attach</span></div>
          <div class="lbl" style="margin-top:16px">links</div><div style="margin-top:8px;font-size:15px;display:flex;gap:8px;align-items:center;text-decoration:underline">${ic('external-link', 15)}DSP line</div></div></div>
      <div class="act"><span class="btn ink">TWIG re-run</span><span class="btn">Escalate</span><span class="btn">Resolved</span><span class="wp">${ic('shield-check', 17)}Waypoint path ready</span></div>
    </div>`,
    build(root, s) {
      s.nodes = $$('.st-n', root); s.labs = $$('.st-l', root); s.fill = $('.st-fill', root); s.halo = $('.st-halo', root);
      s.cdv = $('.cdv', root); s.recs = [$('.r0', root), $('.r1', root)]; s.wp = $('.wp', root);
      [0.9, 1.5, 2.1].forEach(a => cue('tick', s.t0 + a, { v: 0.5 })); cue('type', s.t0 + 2.9, { d: 2.0 }); cue('sparkle', s.t0 + 5.3);
    },
    update(lt, dur, root, s) {
      const prog = P(lt, 0.8, 1.6, E.ioC) * 2;
      s.fill.style.width = (prog / 6 * 100).toFixed(2) + '%';
      s.nodes.forEach((n, i) => { n.className = 'st-n' + (i < Math.floor(prog + 0.02) ? ' done' : i === 2 && prog >= 1.98 ? ' cur' : ''); });
      s.labs.forEach((l, i) => l.classList.toggle('on', i <= Math.floor(prog + 0.02)));
      const hp = lt > 2.4 ? ((lt - 2.4) / 1.4) % 1 : -1;
      tf(s.halo, { s: hp < 0 ? 0 : 0.6 + 0.9 * E.outC(hp), o: hp < 0 ? 0 : 1 - hp });
      const left = 21 * 3600 + 46 * 60 + 12 - Math.floor(Math.max(0, lt - 2.4));
      s.cdv.textContent = [Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60].map(v => String(v).padStart(2, '0')).join(':');
      type(s.recs[0], RECS[0], lt, 2.9, 110, { caret: lt < 3.9 }); type(s.recs[1], RECS[1], lt, 3.9, 110);
      vis(s.wp, lt, 5.3, Infinity, { dy: 10, ds: -0.25, ein: E.outB, din: 0.6 });
    },
  });
})();
