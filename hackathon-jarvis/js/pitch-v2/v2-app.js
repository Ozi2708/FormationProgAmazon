/* Film jury v2 — trois moments forts + montage rapide, dans la même fenêtre, caméra sur l'élément clé, compteur 2h00 → 8h00 */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, tf, vis, count, type, rng, ic, $, $$, clamp, lerp, scene, cursor, moveCursor, cue, rel, orb, orbTick, splitWords, revealWords } = J;
  const A = J.anon;
  const pop = (el, lt, a, o = {}) => vis(el, lt, a, o.b ?? Infinity, Object.assign({ dy: 18, blur: 8, din: 0.7 }, o));
  const hm = m => `${Math.floor(m / 60)}h${String(Math.round(m % 60)).padStart(2, '0')}`;
  const tok = w => `+${w % 60 ? `${Math.floor(w / 60)} h ${w % 60}` : `${w / 60} h`} / week`;

  // instant (dans la scène) où la puce « avant → après » apparaît ; le compteur monte ~1,3 s plus tard
  const GAIN_AT = { brief: 7.4, pacing: 7.0, voice: 7.9, meeting: 1.2, deck: 1.6 };

  // ---------- la fenêtre : titre en haut, application en large dessous ----------
  const F = { x: 40, y: 236, w: 1840, h: 812, rail: 112, bar: 56 };
  F.cx = F.x + F.rail; F.cy = F.y + F.bar; F.cw = F.w - F.rail; F.ch = F.h - F.bar;
  const RAIL = [['sun', 'Today'], ['mail', 'Inbox'], ['trending-up', 'Campaigns'], ['user', 'Clients'], ['calendar', 'Agenda'],
    ['file', 'Docs'], ['zap', 'News'], ['wrench', 'Fix'], ['folder', 'Projects']];
  const NAV_AT = { brief: 0, pacing: 2, voice: 1, meeting: 4, deck: 5 };
  const CTR = { x: 1400, y: 40, w: 480 }, CHIP = { x: 60, y: 176 };

  const CSS = `
  .fw{position:absolute;left:${F.x}px;top:${F.y}px;width:${F.w}px;height:${F.h}px;border-radius:26px;overflow:hidden;display:flex;flex-direction:column;background:var(--bg);
    box-shadow:0 50px 140px -30px rgba(35,47,62,.5),0 0 0 1px rgba(0,0,0,.06);transform-origin:50% 40%}
  .fw-bar{height:${F.bar}px;flex:none;display:flex;align-items:center;gap:9px;padding:0 22px;background:#EDEAE4;border-bottom:1px solid #E0DBD2}
  .fw-bar>i{width:14px;height:14px;border-radius:50%}
  .fw-path{margin-left:18px;display:flex;align-items:center;gap:10px;font:500 17px Plex,monospace;letter-spacing:.06em;color:#6C7279}
  .fw-path b{color:var(--ink);font-weight:600}.fw-path em{font-style:normal;color:#A9A49B}.fw-sec{color:var(--ink2)}
  .fw-sync{margin-left:auto;display:flex;align-items:center;gap:9px;font:500 15px Plex,monospace;color:#5D646C}
  .fw-sync .dot{background:#3BB273;width:9px;height:9px}
  .fw-me{width:34px;height:34px;border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center;font:600 15px InterV;margin-left:14px}
  .fw-body{flex:1;display:flex;min-height:0}
  .fw-rail{width:${F.rail}px;flex:none;background:var(--navy);display:flex;flex-direction:column;align-items:center;padding-top:22px}
  .fw-brain{position:relative;width:48px;height:48px;margin-bottom:16px}
  .fw-brain .orb{left:24px;top:24px}
  .fw-nav{position:relative;width:96px}
  .fw-hl{position:absolute;left:0;top:0;width:96px;height:68px;border-radius:14px;background:#121A23}
  .fw-hl::before{content:"";position:absolute;left:0;top:12px;bottom:12px;width:3px;border-radius:3px;background:var(--or)}
  .fw-it{position:relative;height:72px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#AEB8C4}
  .fw-it span{font:500 12px Plex,monospace;letter-spacing:.04em;color:#C9D1DB}
  .fw-it.lit{color:var(--or)}.fw-it.lit span{color:#fff}
  .ctr{position:absolute;left:${CTR.x}px;top:${CTR.y}px;width:${CTR.w}px}
  .ctr-l{font:600 28px InterV;letter-spacing:.08em;text-transform:uppercase;color:var(--amz-d)}
  .ctr-r{display:flex;align-items:baseline;gap:18px;margin-top:0}
  .ctr-n{font-family:InterTight;font-weight:700;font-size:90px;letter-spacing:-.04em;line-height:1;color:var(--ink);font-variant-numeric:tabular-nums}
  .ctr-d{font-weight:700;font-size:28px;color:var(--or);white-space:nowrap}
  .ctr-b{position:relative;height:10px;border-radius:10px;background:#E7E2DA;margin-top:8px;overflow:hidden}
  .ctr-b i{position:absolute;left:0;top:0;bottom:0;width:100%;border-radius:10px;background:linear-gradient(90deg,#FF9900,#F26B1D);transform-origin:0 50%;transform:scaleX(0)}
  .ctr-s{margin-top:4px;font:500 24px InterV;color:var(--mut)}
  .tok{position:absolute;left:0;top:0;height:52px;padding:0 20px;border-radius:999px;background:var(--or);color:#fff;font:700 28px InterV;display:flex;align-items:center;white-space:nowrap;box-shadow:0 12px 30px rgba(242,102,27,.45);z-index:30}
  .pc-k{position:absolute;left:60px;top:36px;font:600 28px Plex,monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--amz-d);display:flex;align-items:center;gap:14px}
  .pc-k i{width:34px;height:2px;background:currentColor;display:block}
  .pc-h{position:absolute;left:56px;top:78px;font-weight:700;font-size:84px;line-height:1.03;letter-spacing:-.045em;color:var(--ink);white-space:nowrap}
  .pc-s{position:absolute;left:60px;top:182px;font-size:30px;color:var(--mut);letter-spacing:-.012em;white-space:nowrap}
  .pc-chip{position:absolute;left:${CHIP.x}px;top:${CHIP.y}px;height:54px;display:flex;align-items:center;gap:14px;white-space:nowrap}
  .pc-chip .pc-ci{width:46px;height:46px;border-radius:13px;background:var(--orbg);color:var(--or);display:grid;place-items:center;flex:none}
  .pc-chip .pc-tn{font-weight:650;font-size:30px;color:var(--ink)}
  .pc-chip .pc-tn em{font-style:normal;font-weight:500;font-size:28px;color:var(--mut)}
  .pc-chip .pc-b4{position:relative;font-family:InterTight;font-weight:700;font-size:38px;color:#9AA0A6;margin-left:10px}
  .pc-chip .pc-b4 i{position:absolute;left:-4px;right:-4px;top:54%;height:3.5px;border-radius:3px;background:var(--red);transform-origin:0 50%}
  .pc-chip .pc-ar{color:#9AA0A6;font-size:32px;display:inline-block}
  .pc-chip .pc-af{font-family:InterTight;font-weight:700;font-size:46px;color:var(--or);display:inline-block;transform-origin:0 70%}
  .pc-ui{position:absolute;left:${F.cx}px;top:${F.cy}px;width:${F.cw}px;height:${F.ch}px;overflow:hidden;border-bottom-right-radius:26px}
  .pc-uim{position:absolute;inset:0}
  .pc-cam{position:absolute;left:0;top:0;width:1068px;height:1000px;transform-origin:0 0}
  .pc-cam .card{position:absolute}
  `;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  // =================================================================== fenêtre persistante + compteur de temps gagné
  scene({
    id: 'frame', t0: TL.brief[0], t1: TL.deck[1], cls: 'light',
    build(el, s) {
      el.innerHTML = `<div class="fw"><div class="fw-bar"><i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i>
          <span class="fw-path"><b>J.A.R.V.I.S.</b><em>›</em><span class="fw-sec">Today</span></span>
          <span class="fw-sync"><i class="dot"></i>Kiro brain · synced 2 min ago</span><span class="fw-me">V</span></div>
        <div class="fw-body"><div class="fw-rail"><div class="fw-brain">${orb(46)}</div>
          <div class="fw-nav"><div class="fw-hl"></div>${RAIL.map(r => `<div class="fw-it">${ic(r[0], 26)}<span>${r[1]}</span></div>`).join('')}</div></div><div class="fw-main"></div></div></div>
        <div class="ctr"><div class="ctr-l">Time back · every week</div><div class="ctr-r"><span class="ctr-n">0h00</span><span class="ctr-d">≈ one working day</span></div>
          <div class="ctr-b"><i></i></div><div class="ctr-s">estimated, per PSC</div></div>
        <div class="tok"></div>`;
      s.win = $('.fw', el); s.hl = $('.fw-hl', el); s.items = $$('.fw-it', el); s.sec = $('.fw-sec', el); s.brain = $('.fw-brain .orb', el);
      s.ctr = $('.ctr', el); s.n = $('.ctr-n', el); s.day = $('.ctr-d', el); s.bar = $('.ctr-b i', el); s.tok = $('.tok', el);
      s.sch = Object.entries(NAV_AT).map(([k, i]) => [TL[k][0] + 0.15, i]).sort((a, b) => a[0] - b[0]);
      s.sch.forEach(e => cue('nav', e[0], { v: 0.3 }));
      let acc = 0;
      s.gains = Object.keys(GAIN_AT).map(k => {
        const g = C.GAINS[k], t = TL[k][0] + GAIN_AT[k];
        const o = { t, from: acc, to: acc + g.week, label: tok(g.week) };
        acc += g.week;
        cue('swoosh-up', t + 0.75, { v: 0.6 }); cue('count', t + 1.3, { d: 0.7 }); cue('success', t + 2.0, { v: 0.45 });
        return o;
      });
      s.total = acc;
      window.COUNTER_STEPS = s.gains.map(g => ({ t: +(g.t + 2.0).toFixed(2), value: hm(g.to) }));
    },
    update(lt, dur, s, t) {
      const en = P(lt, 0, 0.9, E.outQi), q = P(lt, dur - 0.6, 0.6, E.inC);
      tf(s.win, { y: 40 * (1 - en) - 20 * q, s: (0.97 + 0.03 * en) * (1 - 0.03 * q), o: 1 - q, b: 8 * q });
      vis(s.ctr, lt, 0.6, dur, { dy: 16, blur: 8, dout: 0.6 });
      orbTick(s.brain, t);
      if (!s.ys) s.ys = s.items.map(it => it.offsetTop + 2);
      let cur = null, prev = null;
      for (const e of s.sch) { if (e[0] <= t) { prev = cur; cur = e; } else break; }
      const c = cur || s.sch[0];
      const k = cur ? P(t, cur[0], 0.32, E.ioC) : 1;
      const y = lerp(prev ? s.ys[prev[1]] : s.ys[c[1]], s.ys[c[1]], k);
      s.hl.style.transform = `translateY(${y.toFixed(1)}px)`;
      s.items.forEach((it, i) => it.classList.toggle('lit', Math.abs(s.ys[i] - y) < 16));
      const name = { 5: 'Documents' }[c[1]] || RAIL[c[1]][1];
      if (s.sec._t !== name) { s.sec.textContent = name; s.sec._t = name; }
      // compteur
      let val = 0, tk = null;
      for (const g of s.gains) {
        if (t >= g.t + 1.3) val = lerp(g.from, g.to, P(t, g.t + 1.3, 0.7, E.outQu));
        if (t >= g.t + 0.6 && t < g.t + 1.45) tk = g;
      }
      const txt = hm(Math.round(val / 5) * 5);
      if (s.n._t !== txt) { s.n.textContent = txt; s.n._t = txt; }
      s.bar.style.transform = `scaleX(${(val / s.total).toFixed(4)})`;
      const bump = s.gains.reduce((b, g) => Math.max(b, t > g.t + 1.3 && t < g.t + 2.4 ? Math.sin(P(t, g.t + 1.3, 1.1, E.lin) * Math.PI) : 0), 0);
      tf(s.n, { s: 1 + 0.06 * bump });
      s.n.style.color = bump > 0.02 ? `color-mix(in srgb, var(--or) ${(100 * bump).toFixed(0)}%, var(--ink))` : '';
      const last = s.gains[s.gains.length - 1];
      tf(s.day, { o: P(t, last.t + 2.0, 0.5), x: -12 * (1 - P(t, last.t + 2.0, 0.5, E.outB)) });
      if (tk) {
        if (s.tok._t !== tk.label) { s.tok.textContent = tk.label; s.tok._t = tk.label; }
        const u = P(t, tk.t + 0.6, 0.75, E.ioC);
        const x0 = CHIP.x + 560, y0 = CHIP.y + 2, x1 = CTR.x + 40, y1 = CTR.y + 70, cx = (x0 + x1) / 2, cy = -40;
        const v = 1 - u;
        tf(s.tok, { x: v * v * x0 + 2 * v * u * cx + u * u * x1, y: v * v * y0 + 2 * v * u * cy + u * u * y1, s: lerp(1, 0.7, E.inQ(u)) * (0.7 + 0.3 * P(t, tk.t + 0.6, 0.15, E.outB)), o: P(t, tk.t + 0.6, 0.12) * (1 - P(t, tk.t + 1.28, 0.15)) });
      } else tf(s.tok, { o: 0 });
    },
  });

  // =================================================================== un moment : titre en haut, interface filmée par la caméra
  function hero(id, o, ui) {
    const g = C.GAINS[id], ga = GAIN_AT[id];
    scene({
      id, t0: TL[id][0], t1: TL[id][1], cls: 'clear', css: o.css,
      build(el, s) {
        el.innerHTML = `<div class="pc-k"><i></i>${o.kicker}</div><div class="pc-h">${o.head}</div>${o.sub ? `<div class="pc-s">${o.sub}</div>` : ''}
          <div class="pc-chip"><div class="pc-ci">${ic('clock', 26)}</div><span class="pc-tn">${g.task} <em>· ${g.per}</em></span>
            <span class="pc-b4">${g.before}<i></i></span><span class="pc-ar">→</span><span class="pc-af">${g.after}</span></div>
          <div class="pc-ui"><div class="pc-uim"><div class="pc-cam">${ui.html}</div></div></div>`;
        s.kk = $('.pc-k', el); s.hw = splitWords($('.pc-h', el)); s.hd = $('.pc-h', el); s.sb = $('.pc-s', el);
        s.chip = $('.pc-chip', el); s.strike = $('.pc-b4 i', el); s.af = $('.pc-af', el); s.ar = $('.pc-ar', el);
        s.uim = $('.pc-uim', el); s.cam = $('.pc-cam', el);
        cue('pop', s.t0 + ga + 0.1, { v: 0.6 }); cue('tick', s.t0 + ga + 0.5, { v: 0.7 }); cue('trans', s.t0, { v: 1.2 });
        if (ui.build) ui.build(s.cam, s);
      },
      update(lt, dur, s, t) {
        const out = P(lt, dur - 0.5, 0.5, E.inC);
        vis(s.kk, lt, 0.05, Infinity, { dy: 14, blur: 6 });
        revealWords(s.hw, lt, 0.12, { st: 0.06 });
        tf(s.hd, { y: -16 * out, o: 1 - out, b: 8 * out });
        tf(s.kk, { o: Math.min(P(lt, 0.05, 0.6), 1 - out) });
        // la phrase d'explication laisse la place à la puce « avant → après »
        if (s.sb) vis(s.sb, lt, 0.55, ga - 0.05, { dy: 16, blur: 8, dout: 0.35, dyo: -10 });
        vis(s.chip, lt, ga, dur, { dy: 20, blur: 8, ds: -0.05, din: 0.55, ein: E.outB, dout: 0.5 });
        s.strike.style.transform = `scaleX(${P(lt, ga + 0.4, 0.3, E.outQ).toFixed(3)})`;
        tf(s.ar, { x: -10 * (1 - P(lt, ga + 0.55, 0.3)), o: P(lt, ga + 0.55, 0.3) });
        tf(s.af, { s: 0.6 + 0.4 * P(lt, ga + 0.6, 0.5, E.outB), o: P(lt, ga + 0.6, 0.25) });
        vis(s.uim, lt, o.uiAt ?? 0.12, dur, { dy: 24, blur: 10, din: 0.8, ein: E.outQu, dout: 0.45, dyo: -14, bo: 8 });
        // l'interface d'abord : elle mesure ses positions (cibles de la caméra) dès sa première image
        ui.update(lt, dur, s.cam, s, t);
        J.camApply(s.cam, J.camAt(typeof o.cam === 'function' ? o.cam(s) : o.cam, lt), F.cw, F.ch);
      },
    });
  }

  // ------------------------------------------------ HERO 1 · 90 emails → 3 lignes
  const NTY = { mail: ['Outlook', '#2F6FDE', 'mail'], slack: ['Slack', '#9446BF', 'hash'], cal: ['Calendar', '#E5533D', 'calendar'],
    dsp: ['Amazon DSP', '#F7930F', 'chart-column'], sim: ['SIM', '#CF3F37', 'ticket'], news: ['News DSP', '#D99A16', 'zap'], wbr: ['SharePoint', '#16947E', 'file-text'] };
  const ROWS = [
    ['dsp', 'Under-delivery · BFM Notoriété octobre', 'SVOD 2% delivered for 29% of the flight', '06/10'], ['mail', 'Brief Boursorama // campagne REBOOT 2026', "Possible de me confirmer les 15% d'added value ?", '09:12'],
    ['slack', 'Léa Huguet', 'ouais prisma il faut relancer…', '09:14'], ['cal', 'PSC Brainfood Session', '16:00–17:00 · 13 participants · no reply yet', 'now'],
    ['sim', 'P529520879 · No Delivery', 'Assigned to linfun · in progress', '09:15'], ['mail', 'Amazon DSP: Columbia Order Under delivery', 'Thanks for flagging this and for the proposed…', '09:16'],
    ['mail', 'GSEB - DSP inventaire de diffusion offsite', 'Le choix des SSP envoyé par les équipes…', '09:18'], ['cal', 'Weekly - Dentsu GAE x Amazon Ads', 'Friday 10:00 · Teams', 'Fri'],
    ['slack', '#psc-fr', "Quelqu'un a le deck Nintendo ?", '09:21'], ['mail', 'Nintendo / update', "Je n'avais pas annulé le point de cet après-midi", '09:22'],
    ['dsp', 'Disney Studios · Whalefall', '12% delivered for 25% of the time', '07/10'], ['mail', 'Hashed audience CSV: new format?', 'As-tu identifié la personne pour nous mettre en contact ?', '09:24'],
    ['news', 'Streaming TV Plus without Twitch', 'New STV+ bundle · L8 Finance exception', '05/10'], ['sim', 'P529341292 · PMP deal not bidding', 'Assigned to jabizaki · 07/10', '09:26'],
    ['mail', 'Brief SPF GB // Azerion', 'La catégorie Gouvernement ne peut pas être changée', '09:31'], ['dsp', 'GAE SPF · Mois sans tabac', 'M6 at 12%, FTV at 10%: under-delivering', '06/10'],
  ];
  const BRIEF = [
    [{ t: 'Since yesterday: ' }, { t: 'nothing heavy in the mail', c: 'b' }, { t: ', six messages, mostly acknowledgements.' }],
    [{ t: 'ENI Plénitude is unblocked', c: 'b' }, { t: ': IAS workaround sent to Amnet, creatives still have to pass the audit.' }],
    [{ t: 'One hot spot left: ' }, { t: 'BFM', c: 'b r' }, { t: ', still no delivery on SVOD and CUTV, two tickets in progress.' }],
  ].map(J.anonSegs);
  const BT = [3.9, 5.0, 6.2];
  hero('brief', {
    kicker: '01 · Reads everything', head: `${C.EMAILS_COUNT} emails. <span class="hl">3 lines.</span>`,
    sub: 'Mail, Slack, agenda and campaigns, distilled into one briefing every morning.', uiAt: 0.55,
    cam: [[0, 1.55, 534, 300], [3.0, 1.55, 534, 330, 0.6], [4.2, 1.55, 534, 590, 1.0]],
    css: `
    #sc-brief .bs{left:44px;top:56px;width:980px;height:800px;padding:26px 28px;overflow:hidden;transform-origin:50% 30%}
    #sc-brief .bs-h{display:flex;flex-direction:column;gap:14px;padding-bottom:16px;border-bottom:1px solid var(--line2)}
    #sc-brief .bs-c{display:flex;gap:12px;flex-wrap:wrap}
    #sc-brief .bs-c span{display:inline-flex;gap:8px;align-items:center;height:42px;padding:0 16px;border-radius:999px;background:#F3F0EB;font-size:18px;color:var(--ink2)}
    #sc-brief .bs-c b{font-family:InterTight;font-size:22px;color:var(--ink);font-variant-numeric:tabular-nums}
    #sc-brief .bs-v{position:relative;height:640px;overflow:hidden;-webkit-mask-image:linear-gradient(#000 70%,transparent)}
    #sc-brief .bs-r{display:flex;gap:16px;align-items:center;height:70px;border-bottom:1px solid var(--line2)}
    #sc-brief .bs-r .ri{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;color:#fff;flex:none}
    #sc-brief .bs-r div{flex:1;min-width:0}
    #sc-brief .bs-r b{display:block;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #sc-brief .bs-r p{font-size:15px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
    #sc-brief .bs-r em{font:500 13px Plex,monospace;color:var(--mut2);font-style:normal}
    #sc-brief .bb{left:44px;top:96px;width:980px;padding:32px 34px 30px}
    #sc-brief .bb-d{color:var(--mut);font-size:18px;margin-top:8px}
    #sc-brief .bb-k{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:26px 0 20px}
    #sc-brief .bb-kpi{display:flex;gap:14px;align-items:center;padding:18px 18px}
    #sc-brief .bb-ki{width:46px;height:46px;border-radius:12px;background:#F3F0EB;color:#5D646C;display:grid;place-items:center;flex:none}
    #sc-brief .bb-ki.r{background:var(--redbg);color:var(--red)}
    #sc-brief .bb-kn{font-family:InterTight;font-weight:700;font-size:40px;line-height:1}
    #sc-brief .bb-kl{font-size:14.5px;color:var(--mut);margin-top:4px;line-height:1.25}
    #sc-brief .bb-e{padding:22px 26px 12px}
    #sc-brief .bb-eh{display:flex;align-items:center;gap:14px;margin-bottom:10px}
    #sc-brief .bb-ei{width:46px;height:46px;border-radius:12px;background:var(--ink);color:#fff;display:grid;place-items:center}
    #sc-brief .bb-li{display:flex;gap:14px;font-size:22px;line-height:1.5;color:var(--ink2);padding:12px 0;border-top:1px solid var(--line2);min-height:84px}
    #sc-brief .bb-li>b{color:var(--mut2);width:22px;flex:none}
    #sc-brief .bb-li .b{font-weight:650;color:var(--ink)}
    #sc-brief .bb-li .r{color:var(--red)}
    #sc-brief .bb-li.hot{border-radius:12px}`,
  }, {
    html: `<div class="card bs"><div class="bs-h"><span class="htitle" style="font-size:32px">Since yesterday</span>
        <div class="bs-c"><span>${ic('mail', 18)}<b>${C.EMAILS_COUNT}</b> emails</span><span>${ic('calendar', 18)}<b>${C.MEETINGS_COUNT}</b> meetings</span><span>${ic('chart-column', 18)}<b>${C.CAMPAIGNS_COUNT}</b> campaigns</span></div></div>
        <div class="bs-v"><div class="bs-l">${ROWS.concat(ROWS).map(n => { const [src, c, icon] = NTY[n[0]]; return `<div class="bs-r"><div class="ri" style="background:${c}">${ic(icon, 20)}</div><div><b>${J.esc(n[1])}</b><p>${src} · ${J.esc(n[2])}</p></div><em>${n[3]}</em></div>`; }).join('')}</div></div></div>
      <div class="card bb"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div class="htitle" style="font-size:46px">Good morning, Valentin</div><div class="bb-d">Wednesday, October 7 · automatic briefing at 08:30</div></div><span class="btn">${ic('refresh-cw', 16)}Sync</span></div>
        <div class="bb-k">${[['calendar', 3, 'meetings today', ''], ['circle-check', 2, 'to do today · 1 overdue', 'r'], ['inbox', 0, 'to handle right away', ''], ['zap', 6, 'possible follow-ups', '']]
          .map(k => `<div class="flat bb-kpi" data-v="${k[1]}"><div class="bb-ki ${k[3]}">${ic(k[0], 22)}</div><div><div class="bb-kn">0</div><div class="bb-kl">${k[2]}</div></div></div>`).join('')}</div>
        <div class="flat bb-e"><div class="bb-eh"><div class="bb-ei">${ic('brain', 22)}</div><span class="htitle" style="font-size:24px">Today's essentials</span><span class="lbl">written by Kiro</span></div>
          ${BRIEF.map((_, i) => `<div class="bb-li"><b>${i + 1}.</b><span class="bb-tx"></span></div>`).join('')}</div></div>`,
    build(root, s) {
      s.bs = $('.bs', root); s.list = $('.bs-l', root);
      s.bb = $('.bb', root); s.kp = $$('.bb-kpi', root); s.be = $('.bb-e', root); s.tx = $$('.bb-tx', root); s.li = $$('.bb-li', root);
      cue('data', s.t0 + 0.8, { d: 1.8 }); cue('implode', s.t0 + 2.5, { d: 0.45 });
      [3.2, 3.3, 3.4, 3.5].forEach(a => cue('pop', s.t0 + a, { v: 0.45 }));
      BT.forEach((a, i) => cue('type', s.t0 + a, { d: BRIEF[i].reduce((n, x) => n + x.t.length, 0) / 80 }));
      cue('alert', s.t0 + 7.9, { v: 0.5 });
    },
    update(lt, dur, root, s) {
      s.list.style.transform = `translateY(${(-1100 * P(lt, 0.6, 2.4, E.inQ)).toFixed(1)}px)`;
      const k = P(lt, 2.5, 0.6, E.inC);
      tf(s.bs, { s: 1 - 0.12 * k, y: -30 * k, o: 1 - k, b: 14 * k });
      vis(s.bb, lt, 2.8, Infinity, { dy: 70, blur: 14, ds: 0.04, din: 0.9, ein: E.outX });
      s.kp.forEach((kp, i) => { pop(kp, lt, 3.2 + i * 0.1); count($('.bb-kn', kp), lt, 3.2 + i * 0.1, 0.9, 0, +kp.dataset.v); });
      pop(s.be, lt, 3.55);
      BT.forEach((a, i) => type(s.tx[i], BRIEF[i], lt, a, 80, { caret: i === 2 || lt < BT[i + 1] }));
      const gl = lt > 7.9 ? 0.5 + 0.5 * Math.sin((lt - 7.9) * 3.4) : 0;
      s.li[2].style.background = `rgba(200,55,44,${(0.07 * gl).toFixed(3)})`;
    },
  });

  // ------------------------------------------------ HERO 2 · la carte du pacing → la campagne en rouge → KPI → tâche
  const PX = x => 64 + x / 100 * 862, PY = y => 470 - y / 100 * 440;
  function pacingDots() {
    const r = rng(11), d = [];
    for (let i = 0; i < 20; i++) { const x = 3 + i * 4.6 + r() * 2.5; d.push({ x, y: Math.min(99, x * (0.96 + r() * 0.1)), c: 'g', r: 6 + r() * 4 }); }
    for (let i = 0; i < 15; i++) { const x = 9 + r() * 62; d.push({ x, y: x * (0.62 + r() * 0.18), c: 'a', r: 6 + r() * 4 }); }
    d.push({ x: 29, y: 2.3, c: 'r', r: 13, key: 1 });
    d.push({ x: 29, y: 11, c: 'r', r: 9 });
    d.push({ x: 24, y: 12.5, c: 'r', r: 10 });
    d.push({ x: 19, y: 8, c: 'r', r: 9 });
    d.push({ x: 36, y: 20, c: 'r', r: 8 });
    return d;
  }
  const DOTS = pacingDots();
  const COL = { g: '#2E9E6A', a: '#D18E1C', r: '#D23B2E' };
  const SVW = 930, SVH = SVW * 520 / 958;
  hero('pacing', {
    kicker: '02 · Spots problems first', head: 'Under-delivery? <span class="hl">Caught first.</span>',
    sub: 'Every DSP export read, every campaign on one pacing map.',
    cam: s => s.camKeys,
    css: `
    #sc-pacing .pm{left:44px;top:56px;width:980px;padding:26px 26px 18px}
    #sc-pacing .pm-bar{display:flex;gap:4px;height:12px;border-radius:9px;overflow:hidden;margin-bottom:16px}
    #sc-pacing .pm-bar i{display:block;height:100%;transform-origin:0 50%}
    #sc-pacing .pm-lg{display:flex;gap:26px;align-items:center;font-size:20px;color:var(--ink2);margin-bottom:16px}
    #sc-pacing .pm-lg span{display:inline-flex;gap:9px;align-items:center}
    #sc-pacing .pm-lg b{font-family:InterTight;font-size:26px}
    #sc-pacing .pm-t{display:flex;align-items:baseline;gap:14px;margin-bottom:4px}
    #sc-pacing svg{display:block;width:${SVW}px;height:${SVH.toFixed(0)}px;overflow:visible}
    #sc-pacing svg text{font-family:Plex,monospace;font-size:14px;fill:#9AA0A6}
    #sc-pacing svg .lab{font-family:InterV;font-weight:700;font-size:16px;fill:#14181D}
    #sc-pacing .tk{left:44px;top:470px;width:980px;padding:26px 30px 24px;border:2px solid #F3B9A3}
    #sc-pacing .tk-h{display:flex;gap:14px;align-items:center}
    #sc-pacing .tk-t{font-weight:700;font-size:23px}
    #sc-pacing .tk-s{font-size:15px;color:var(--mut);margin-top:3px}
    #sc-pacing .tk-h .chip{margin-left:auto}
    #sc-pacing .tk-m{display:grid;grid-template-columns:1.1fr 1fr 1.15fr;gap:14px;margin:20px 0 18px}
    #sc-pacing .tk-k{padding:16px 20px;border-radius:14px;background:#F7F5F1}
    #sc-pacing .tk-n{font-family:InterTight;font-weight:700;font-size:58px;letter-spacing:-.03em;line-height:1.05;margin-top:4px;font-variant-numeric:tabular-nums}
    #sc-pacing .tk-n.r{color:var(--red)}
    #sc-pacing .tk-c{font-size:15.5px;color:var(--mut);margin-top:4px}
    #sc-pacing .tk-c b{color:var(--ink)}
    #sc-pacing .tk-a{display:flex;gap:14px;align-items:center;padding-top:18px;border-top:1px solid var(--line2)}
    #sc-pacing .tk-cb{width:30px;height:30px;border-radius:8px;border:2px solid #C9C4BC;display:grid;place-items:center;color:#fff;flex:none}
    #sc-pacing .tk-cb.on{background:var(--grn);border-color:var(--grn)}
    #sc-pacing .tk-at{font-weight:700;font-size:20px;flex:1;line-height:1.35}
    #sc-pacing .tk-ch{display:flex;gap:8px;margin-top:12px;margin-left:44px}`,
  }, {
    html: `<div class="card pm">
        <div class="pm-bar"><i style="width:12.5%;background:${COL.r}"></i><i style="width:37.5%;background:${COL.a}"></i><i style="width:50%;background:${COL.g}"></i></div>
        <div class="pm-lg"><span><i class="dot" style="background:${COL.r};width:12px;height:12px"></i><b>5</b> to catch up</span><span><i class="dot" style="background:${COL.a};width:12px;height:12px"></i><b>15</b> to watch</span><span><i class="dot" style="background:${COL.g};width:12px;height:12px"></i><b>20</b> on pace</span></div>
        <div class="pm-t"><span class="htitle" style="font-size:24px">Pacing map</span><span class="lbl" style="letter-spacing:.04em;text-transform:none;font-size:14px">one dot per campaign · below the line: behind</span></div>
        <div class="pm-sv"><svg viewBox="0 0 958 520">
          <g>${[0, 25, 50, 75, 100].map(v => `<line x1="${PX(v)}" y1="30" x2="${PX(v)}" y2="470" stroke="#EFEBE5"/><line x1="64" y1="${PY(v)}" x2="926" y2="${PY(v)}" stroke="#EFEBE5"/><text x="${PX(v)}" y="496" text-anchor="middle">${v}%</text><text x="52" y="${PY(v) + 4}" text-anchor="end">${v}</text>`).join('')}
            <text x="${PX(50)}" y="518" text-anchor="middle">time elapsed</text></g>
          <line class="diag" x1="${PX(0)}" y1="${PY(0)}" x2="${PX(100)}" y2="${PY(100)}" stroke="#9AA0A6" stroke-width="1.6" stroke-dasharray="7 7"/>
          <text class="t-be" x="${PX(92)}" y="${PY(28)}" text-anchor="end" style="font-size:16px;fill:${COL.r}">behind ↓</text>
          <g class="dots">${DOTS.map(d => `<g transform="translate(${PX(d.x)},${PY(d.y)})"><circle class="pl" r="${d.r}" fill="none" stroke="${COL[d.c]}" stroke-width="2" opacity="0"/>${d.key ? `<circle class="tkr" r="${d.r + 8}" fill="none" stroke="#F2661B" stroke-width="2.4" stroke-dasharray="4 4"/>` : ''}<circle class="cd" r="${d.r}" fill="${COL[d.c]}" fill-opacity="${d.c === 'g' ? 0.75 : 0.92}"/></g>`).join('')}</g>
          <g class="klab" transform="translate(${PX(29)},${PY(2.3)})"><line x1="0" y1="0" x2="28" y2="-36" stroke="#14181D" stroke-width="1.2"/><text class="lab" x="34" y="-40">FR · BFM · Connected TV SVOD</text></g>
        </svg></div></div>
      <div class="card tk">
        <div class="tk-h"><span class="badge" style="height:32px;font-size:17px">73</span><div><div class="tk-t">FR - BFM · Connected TV SVOD</div><div class="tk-s">Banque Française Mutualiste · Amnet · October awareness</div></div><span class="chip red mono">catch up</span></div>
        <div class="tk-m"><div class="tk-k"><div class="lbl">delivered</div><div class="tk-n r"><span class="v1">0</span>%</div><div class="tk-c">for <b>29%</b> of the flight</div></div>
          <div class="tk-k"><div class="lbl">pace needed</div><div class="tk-n">×<span class="v2">0</span></div><div class="tk-c">to land on budget</div></div>
          <div class="tk-k"><div class="lbl">at risk</div><div class="tk-n r">€<span class="v3">0</span></div><div class="tk-c">ends <b>15/11</b></div></div></div>
        <div class="tk-a"><span class="tk-cb">${ic('check', 18)}</span><span class="tk-at">Task created: chase Amnet and the publishers on SVOD and CUTV</span><span class="chip grn">${ic('sparkles', 14)}from the DSP export</span></div>
        <div class="tk-ch"><span class="chip red mono">urgent</span><span class="chip line">${ic('calendar', 14)}tomorrow</span><span class="chip line">${ic('ticket', 14)}2 SIM tickets followed</span></div></div>`,
    build(root, s) {
      s.pm = $('.pm', root); s.segs = $$('.pm-bar i', root);
      s.dots = $$('.dots > g', root).map((g, i) => ({ g, d: DOTS[i], c: $('.cd', g), pl: $('.pl', g), tkr: $('.tkr', g) }));
      s.dots.forEach(o => { o.a = 0.6 + o.d.x / 100 * 1.4 + (o.d.c === 'r' ? 0.3 : 0); });
      s.diag = $('.diag', root); s.tbe = $('.t-be', root); s.klab = $('.klab', root);
      s.tk = $('.tk', root); s.v = ['.v1', '.v2', '.v3'].map(q => $(q, root)); s.tka = $('.tk-a', root); s.cb = $('.tk-cb', root); s.tkch = $('.tk-ch', root);
      [...new Set(s.dots.map(o => Math.round(o.a * 12) / 12))].forEach(a => cue('tick', s.t0 + a, { v: 0.22 }));
      cue('alert', s.t0 + 2.4, { v: 0.6 }); cue('whoosh', s.t0 + 3.1, { v: 0.5 }); cue('swoosh-up', s.t0 + 4.6);
      cue('count', s.t0 + 5.0, { d: 1.2 }); cue('hit', s.t0 + 6.2, { v: 0.45 }); cue('success', s.t0 + 6.3, { v: 0.5 });
      s.camKeys = [[0, 1.12, 534, 386]];
    },
    update(lt, dur, root, s) {
      if (!s.fp) {
        // position du point BFM dans l'interface : cible du zoom
        const sv = rel($('.pm-sv', s.pm), s.pm), k = SVW / 958;
        s.fp = { x: 44 + sv.x + PX(29) * k, y: 56 + sv.y + PY(2.3) * k };
        s.camKeys = [[0, 1.12, 534, 386], [2.9, 1.12, 534, 386], [4.0, 2.4, s.fp.x + 260, s.fp.y - 20, 1.0], [4.5, 2.4, s.fp.x + 260, s.fp.y - 20, 0.5],
          [5.4, 1.5, 534, 610, 0.9], [7.0, 1.5, 534, 640, 0.8]];
      }
      s.segs.forEach((g, i) => { g.style.transform = `scaleX(${P(lt, 0.3 + i * 0.2, 0.7, E.outQu).toFixed(4)})`; });
      s.diag.style.opacity = P(lt, 0.5, 0.5); s.tbe.style.opacity = P(lt, 2.2, 0.4);
      s.dots.forEach(o => {
        const k = P(lt, o.a, 0.7, E.spring);
        o.c.setAttribute('transform', `scale(${Math.max(0, k).toFixed(3)})`);
        if (o.d.c === 'r' && lt > 2.4) {
          const ph = ((lt - 2.4) / 1.4) % 1;
          o.pl.setAttribute('r', (o.d.r + 22 * E.outC(ph)).toFixed(1)); o.pl.setAttribute('opacity', (0.8 * (1 - ph)).toFixed(3));
        }
        if (o.tkr) o.tkr.setAttribute('transform', `rotate(${(lt * 40).toFixed(1)}) scale(${Math.max(0, P(lt, 2.6, 0.5, E.outB)).toFixed(3)})`);
      });
      s.klab.style.opacity = P(lt, 2.9, 0.5).toFixed(3);
      vis(s.tk, lt, 4.6, Infinity, { dy: 120, blur: 16, ds: 0.03, din: 0.9, ein: E.outX });
      count(s.v[0], lt, 5.0, 1.2, 0, 2.3, { dec: 1 }); count(s.v[1], lt, 5.05, 1.2, 1, 9.4, { dec: 1 }); count(s.v[2], lt, 5.1, 1.3, 0, 41708);
      pop(s.tka, lt, 6.1, { dy: 14 }); s.cb.classList.toggle('on', lt > 6.25);
      tf(s.cb, { s: lt > 6.25 ? 1 + 0.25 * Math.sin(P(lt, 6.25, 0.35, E.lin) * Math.PI) : 1 });
      pop(s.tkch, lt, 6.4, { dy: 10 });
    },
  });

  // ------------------------------------------------ HERO 3 · dans ta voix, nourri par tes données — et rien ne part sans toi
  const VB1 = J.anonSegs([
    { t: 'Hello Annemarie,', c: 'hs' }, { t: 'style', c: 'tag t-st', k: 'st' },
    { t: '\n\nQuick update on BFM: SVOD is at ' }, { t: '2.3% delivered', c: 'hs' }, { t: 'DSP', c: 'tag t-dsp', k: 0 },
    { t: ' for 29% of the flight, about ' }, { t: '€41.7k at risk', c: 'hs' }, { t: 'DSP', c: 'tag t-dsp', k: 0 }, { t: '.\n\n' },
    { t: 'Ticket P529341292', c: 'hs' }, { t: 'SIM', c: 'tag t-sim', k: 1 }, { t: ' is open with PSC-T, as discussed in our last ' },
    { t: 'exchange', c: 'hs' }, { t: 'thread', c: 'tag t-th', k: 2 }, { t: '. Could you check ' },
    { t: 'the max bid against the deal floor', c: 'hs' }, { t: 'SOP', c: 'tag t-sop', k: 3 }, { t: '?' },
  ]);
  const VB2 = [{ t: 'Thanks!\nValentin', c: 'hs' }, { t: 'style', c: 'tag t-st', k: 'st' }];
  const VCPS = 85, VT0 = 0.9;
  const VLEN = VB1.reduce((n, x) => n + x.t.length, 0), VT2 = VT0 + VLEN / VCPS + 0.05;
  const NOTE = A("dis-lui qu'on passe la ligne CUTV à 1 € et qu'on relance Equativ demain");
  const POLISHED = A("We'll also set the Equativ CUTV line to €1 so the algorithm can reallocate its budget, and I'll follow up with Equativ tomorrow morning.");
  const NT0 = 4.6, NCPS = 64, PRESS = NT0 + NOTE.length / NCPS + 0.1;
  const SEND = 9.6;
  const SRC = [['pen-line', 'var(--ink)', 'Your writing style', 'learned from your sent emails', 'st'], ['chart-column', '#F7930F', 'DSP export 06/10', 'SVOD 2.3% · €41.7k at risk', 0],
    ['ticket', '#CF3F37', 'SIM P529341292', 'In progress · PSC-T', 1], ['mail', '#2F6FDE', 'Thread history', '11 messages with Amnet', 2], ['file-text', '#16947E', 'Waypoint SOP', 'Escalation checklist', 3]];
  hero('voice', {
    kicker: '03 · Writes like you', head: 'Your voice. <span class="hl">Your data.</span>',
    sub: 'Drafts in your style, grounded in live results. You review, you send.',
    cam: s => s.camKeys,
    css: `
    #sc-voice .vd{left:36px;top:46px;width:690px;padding:20px 26px 20px}
    #sc-voice .vd-top{display:flex;align-items:center;gap:12px;margin-bottom:10px}
    #sc-voice .send{display:inline-flex;gap:8px;align-items:center;height:40px;padding:0 18px;border-radius:9px;background:#2F6FDE;color:#fff;font-weight:650;font-size:16px}
    #sc-voice .vd-app{display:flex;gap:8px;align-items:center;font-weight:650;font-size:17px;color:#2F6FDE}
    #sc-voice .vd-top .chip{margin-left:auto}
    #sc-voice .vd-f{font-size:16px;color:var(--ink2);padding:8px 0;border-bottom:1px solid var(--line2)}
    #sc-voice .vd-f span{display:inline-block;width:76px;color:var(--mut)}
    #sc-voice .vd-b{font-size:19px;line-height:1.62;color:var(--ink);padding-top:14px}
    #sc-voice .vb1{min-height:252px}
    #sc-voice .slot{overflow:hidden;height:0}
    #sc-voice .ins{border-radius:8px;margin:0 -8px 12px;padding:2px 8px}
    #sc-voice .vb2{min-height:62px}
    #sc-voice .hs{background:linear-gradient(transparent 60%,rgba(255,153,0,.30) 60%)}
    #sc-voice .tag{display:inline-block;font:600 11.5px/1 Plex,monospace;letter-spacing:.08em;text-transform:uppercase;padding:4px 7px;border-radius:5px;margin:0 2px 0 6px;vertical-align:3px;color:#fff}
    #sc-voice .t-st{background:var(--ink)}#sc-voice .t-dsp{background:#F7930F}#sc-voice .t-sim{background:#CF3F37}#sc-voice .t-th{background:#2F6FDE}#sc-voice .t-sop{background:#16947E}
    #sc-voice .vd-ft{display:flex;gap:8px;align-items:center;font-size:15px;color:var(--or);font-weight:600;margin:6px 0 14px}
    #sc-voice .nb{display:flex;gap:12px;align-items:center;height:66px;padding:0 10px 0 18px;border-radius:18px;border:1.5px solid #F2C79A;background:#FFF9F2}
    #sc-voice .nb .ic{color:var(--or)}
    #sc-voice .nt{flex:1;font-size:18px;color:var(--ink2);white-space:nowrap;overflow:hidden}
    #sc-voice .nt .ph{color:var(--mut2)}
    #sc-voice .go{width:46px;height:46px;border-radius:50%;background:var(--or);color:#fff;display:grid;place-items:center}
    #sc-voice .bub{position:absolute;left:0;top:0;border-radius:12px;padding:2px 8px;font-size:19px;line-height:1.62;z-index:10}
    #sc-voice .bub div{position:absolute;left:8px;right:8px;top:2px}
    #sc-voice .b-raw{color:#7A4A12;font-style:italic}
    #sc-voice .vs{position:absolute;left:752px;top:46px;width:296px}
    #sc-voice .vs .lbl{margin:0 0 10px 4px}
    #sc-voice .vs-r{display:flex;gap:12px;align-items:center;padding:11px 14px;margin-bottom:10px;border-radius:16px;background:#fff;border:1px solid var(--line)}
    #sc-voice .vs-i{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;color:#fff;flex:none}
    #sc-voice .vs-r b{display:block;font-size:16.5px}
    #sc-voice .vs-r span{font-size:13.5px;color:var(--mut)}
    #sc-voice .vc{position:absolute;left:752px;top:470px;width:296px;display:flex;flex-direction:column;gap:10px;align-items:flex-start}
    #sc-voice .vc .chip{height:38px;font-size:15.5px;padding:0 16px}
    #sc-voice .lock{position:absolute;left:752px;top:52px;display:flex;gap:10px;align-items:center;height:48px;padding:0 20px;border-radius:999px;background:rgba(20,24,29,.95);color:#fff;font-weight:650;font-size:18px;box-shadow:0 16px 40px rgba(0,0,0,.35);z-index:20}
    #sc-voice .lock .ic{color:#5DD39E}
    #sc-voice .sent{position:absolute;left:752px;top:124px;display:flex;gap:10px;align-items:center;height:46px;padding:0 20px;border-radius:999px;background:#fff;color:#14181D;font-weight:650;font-size:18px;box-shadow:0 16px 40px rgba(35,47,62,.3);border:1px solid var(--line);z-index:20}
    #sc-voice .sent .ic{color:var(--grn)}`,
  }, {
    html: `<div class="card vd"><div class="vd-top"><span class="send">${ic('send', 16)}Send</span><span class="vd-app">${ic('mail', 18)}Outlook · Drafts</span><span class="chip amb mono st">draft · not sent</span></div>
        <div class="vd-f"><span>To</span>Annemarie Kalinka (Amnetgroup)</div><div class="vd-f"><span>Subject</span>RE: BFM · SVOD delivery</div>
        <div class="vd-b"><div class="vb1"></div><div class="slot"><p class="ins">${POLISHED}</p></div><div class="vb2"></div></div>
        <div class="vd-ft">${ic('sparkles', 16)}Drafted by Kiro, in your voice</div>
        <div class="nb">${ic('pen-line', 20)}<div class="nt"></div><span class="go">${ic('arrow-right', 22)}</span></div></div>
      <div class="bub"><div class="b-raw">${NOTE}</div><div class="b-pol">${POLISHED}</div></div>
      <div class="vs"><div class="lbl">grounded in</div>${SRC.map(r => `<div class="vs-r"><div class="vs-i" style="background:${r[1]}">${ic(r[0], 20)}</div><div><b>${r[2]}</b><span>${r[3]}</span></div></div>`).join('')}</div>
      <div class="vc"><span class="chip or">${ic('sparkles', 15)}Rewritten in your style</span><span class="chip line">French → English</span></div>
      <div class="lock">${ic('shield-check', 22)}Never sent automatically</div>
      <div class="sent">${ic('circle-check', 20)}Sent by you · 10:42</div>`,
    build(root, s) {
      s.vd = $('.vd', root); s.b1 = $('.vb1', root); s.b2 = $('.vb2', root); s.slot = $('.slot', root); s.ins = $('.ins', root);
      s.nb = $('.nb', root); s.nt = $('.nt', root); s.go = $('.go', root); s.bub = $('.bub', root); s.raw = $('.b-raw', root); s.pol = $('.b-pol', root);
      s.vs = $$('.vs-r', root); s.vsl = $('.vs .lbl', root); s.vc = $$('.vc .chip', root);
      s.camKeys = [[0, 1.6, 534, 290]];
      s.lock = $('.lock', root); s.sendb = $('.send', root); s.stc = $('.st', root); s.sent = $('.sent', root); s.cur = cursor(root);
      let n = 0; s.hits = [];
      for (const seg of VB1) { n += seg.t.length; if (seg.k !== undefined) s.hits.push({ k: seg.k, t: VT0 + n / VCPS }); }
      n = 0; for (const seg of VB2) { n += seg.t.length; if (seg.k !== undefined) s.hits.push({ k: seg.k, t: VT2 + n / VCPS }); }
      SRC.forEach((_, i) => cue('pop', s.t0 + 0.5 + i * 0.12, { v: 0.35 }));
      cue('type', s.t0 + VT0, { d: VLEN / VCPS + 0.4 });
      s.hits.forEach(h => cue('tick', s.t0 + h.t, { v: 0.5 }));
      cue('type', s.t0 + NT0, { d: NOTE.length / NCPS }); cue('click', s.t0 + PRESS); cue('swoosh-up', s.t0 + PRESS + 0.15, { v: 0.6 });
      cue('sparkle', s.t0 + PRESS + 0.9); cue('lock', s.t0 + 8.7); cue('click', s.t0 + SEND); cue('success', s.t0 + SEND + 0.2, { v: 0.6 });
    },
    update(lt, dur, root, s) {
      if (!s.m) {
        const b = rel(s.slot, root), nn = rel(s.nt, root), sb = rel(s.sendb, root);
        s.m = { sx: b.x, sy: b.y, w: b.w, h: s.ins.offsetHeight + 12, nx: nn.x - 8, ny: nn.y + 4, bx: sb.cx, by: sb.cy };
        s.bub.style.width = s.m.w + 16 + 'px'; s.bub.style.height = s.m.h + 'px';
        s.camKeys = [[0, 1.6, 534, 290], [3.4, 1.6, 534, 360, 2.0], [4.6, 1.6, 534, 450, 0.7], [6.8, 1.6, 534, 400, 0.8], [8.6, 1.6, 534, s.m.sy - 8 - F.ch / 2 / 1.6, 0.9]];
      }
      const fade = 1 - 0.85 * P(lt, 8.3, 0.4);
      pop(s.vsl, lt, 0.4, { op: fade }); s.vs.forEach((r, i) => pop(r, lt, 0.5 + i * 0.12, { dx: 30, dy: 0, op: fade }));
      type(s.b1, VB1, lt, VT0, VCPS, { caret: lt < VT2 });
      type(s.b2, VB2, lt, VT2, VCPS);
      const glow = {};
      for (const h of s.hits) { const d = lt - h.t; if (d >= 0 && d < 1.1) glow[h.k] = Math.max(glow[h.k] || 0, Math.sin(clamp(d / 1.1) * Math.PI)); }
      s.vs.forEach((r, i) => { const g = glow[SRC[i][4]] || 0; r.style.boxShadow = g > 0.01 ? `0 0 0 ${(3 * g).toFixed(1)}px rgba(255,153,0,.6), 0 10px 30px rgba(255,153,0,${(0.25 * g).toFixed(2)})` : 'none'; r.style.borderColor = g > 0.01 ? '#FFB547' : ''; });
      // la note, tapée en français, monte dans le mail et devient un paragraphe propre
      if (lt < NT0) J.setHTML(s.nt, '<span class="ph">Add a note for Kiro…</span>');
      else if (lt < PRESS + 0.05) type(s.nt, NOTE, lt, NT0, NCPS);
      else J.setHTML(s.nt, lt < PRESS + 0.9 ? '' : '<span class="ph">Add a note for Kiro…</span>');
      tf(s.go, { s: lt > PRESS - 0.1 && lt < PRESS + 0.2 ? 1 - 0.14 * Math.sin((lt - PRESS + 0.1) / 0.3 * Math.PI) : 1 });
      const k = P(lt, PRESS + 0.1, 1.1, E.ioC), land = P(lt, PRESS + 1.15, 0.35), open = P(lt, PRESS + 0.5, 0.7, E.ioC);
      s.slot.style.height = (s.m.h * open).toFixed(1) + 'px';
      tf(s.bub, { x: lerp(s.m.nx, s.m.sx - 8, k), y: lerp(s.m.ny + s.m.h * open, s.m.sy - 2, k), o: lt < PRESS + 0.1 ? 0 : 1 - land });
      s.bub.style.background = `rgba(255,${lerp(243, 240, k).toFixed(0)},${lerp(214, 225, k).toFixed(0)},${(0.96 - 0.5 * k).toFixed(3)})`;
      s.bub.style.boxShadow = `0 ${(18 * (1 - k)).toFixed(1)}px 40px rgba(35,47,62,${(0.25 * Math.sin(k * Math.PI)).toFixed(3)})`;
      tf(s.raw, { o: 1 - P(lt, PRESS + 0.35, 0.5), b: 8 * P(lt, PRESS + 0.35, 0.5) });
      tf(s.pol, { o: P(lt, PRESS + 0.55, 0.5), b: 8 * (1 - P(lt, PRESS + 0.55, 0.5)) });
      s.ins.style.opacity = land.toFixed(3);
      s.ins.style.background = `rgba(255,153,0,${(0.22 * land * (1 - P(lt, PRESS + 2.2, 2.0))).toFixed(3)})`;
      s.vc.forEach((c, i) => vis(c, lt, PRESS + 1.4 + i * 0.15, Infinity, { dy: 12, ds: -0.15, din: 0.6, ein: E.outB, op: fade }));
      // confiance : rien ne part tout seul, c'est toi qui envoies
      vis(s.lock, lt, 8.7, Infinity, { dy: 14, ds: -0.25, din: 0.6, ein: E.outB });
      moveCursor(s.cur, lt, [[8.9, 360, 260], [SEND - 0.25, s.m.bx + 6, s.m.by + 4]], [SEND], { hide: 11.2 });
      const sent = lt > SEND + 0.1;
      s.stc.className = 'chip mono st ' + (sent ? 'grn' : 'amb'); s.stc.textContent = sent ? 'sent by you' : 'draft · not sent';
      vis(s.sent, lt, SEND + 0.2, Infinity, { dy: 20, blur: 8, din: 0.6, ein: E.outB });
    },
  });

  // ------------------------------------------------ MONTAGE · réunion préparée la veille
  const PREP = [
    ['users', "who's in the room", 'PSC France team · PAM · organizer: PSC lead', ''],
    ['refresh-cw', 'since last time', 'AST-PSC switch confirmed: one owner per account from 16/10', ''],
    ['chart-column', 'numbers to know', '40 live campaigns · 5 to catch up · 2 SIM tickets open on BFM', ''],
    ['message-square', 'talking points', 'Accounts to hand over before 16/10 · C-SAT signals', ''],
    ['triangle-alert', 'watch out', 'BFM: ~€51k at risk, no agency thread yet', 'r'],
    ['target', 'your ask', 'Agree on an owner for the Equativ escalation', ''],
  ];
  hero('meeting', {
    kicker: '04 · Prepares every meeting', head: 'Walk in <span class="hl">ready.</span>', uiAt: 0.05,
    cam: [[0, 1.55, 534, 300], [3.4, 1.55, 534, 430, 1.2]],
    css: `
    #sc-meeting .mt{left:44px;top:70px;width:980px;height:136px}
    #sc-meeting .tn{position:absolute;top:32px;display:flex;gap:14px;align-items:center}
    #sc-meeting .tn .ti{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;color:#fff;flex:none}
    #sc-meeting .tn b{display:block;font-family:InterTight;font-size:24px}
    #sc-meeting .tn span{font-size:15px;color:var(--mut)}
    #sc-meeting .n1{left:30px}#sc-meeting .n2{right:30px;flex-direction:row-reverse;text-align:right}
    #sc-meeting .tr{position:absolute;left:320px;right:370px;top:66px;height:4px;border-radius:3px;background:#ECE7E0}
    #sc-meeting .tr i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:linear-gradient(90deg,#FF9900,#F26B1D);transform-origin:0 50%}
    #sc-meeting .tr b{position:absolute;top:-7px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:#FF9900;box-shadow:0 0 0 6px rgba(255,153,0,.2),0 0 18px rgba(255,153,0,.7)}
    #sc-meeting .tr em{position:absolute;left:50%;top:-40px;transform:translateX(-50%);font:600 14px Plex,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--amz-d);white-space:nowrap}
    #sc-meeting .pd{left:44px;top:236px;width:980px;padding:26px 30px 18px}
    #sc-meeting .pd-h{display:flex;align-items:center;gap:12px;margin-bottom:6px}
    #sc-meeting .pd-h .sp{flex:1}
    #sc-meeting .pd-t{font-weight:700;font-size:24px}
    #sc-meeting .pd-s{font-size:16px;color:var(--mut);margin-bottom:12px}
    #sc-meeting .pg{display:grid;grid-template-columns:1fr 1fr;gap:0 30px}
    #sc-meeting .ps{display:flex;gap:14px;padding:16px 0;border-top:1px solid var(--line2)}
    #sc-meeting .ps .pi{width:42px;height:42px;border-radius:11px;background:#F3F0EB;color:#4D555D;display:grid;place-items:center;flex:none}
    #sc-meeting .ps.r .pi{background:var(--redbg);color:var(--red)}
    #sc-meeting .ps .lbl{margin-bottom:6px}
    #sc-meeting .ps p{font-size:18px;line-height:1.42;color:var(--ink);font-weight:550}
    #sc-meeting .ps.r p{color:var(--red)}`,
  }, {
    html: `<div class="card mt">
        <div class="tn n1"><div class="ti" style="background:var(--ink)">${ic('brain', 26)}</div><div><b>Wed · 17:33</b><span>Prep agent runs, on its own</span></div></div>
        <div class="tr"><i></i><b></b><em>prepared 17 h ahead</em></div>
        <div class="tn n2"><div class="ti" style="background:#E5533D">${ic('calendar', 26)}</div><div><b>Thu · 11:00</b><span>2026 H2 FR PSC Meeting + PAM</span></div></div></div>
      <div class="card pd"><div class="pd-h"><span class="pd-t">Meeting prep · 2026 H2 FR PSC Meeting</span><span class="sp"></span><span class="chip or">${ic('brain', 14)}prep agent</span><span class="chip gray">${ic('clock', 13)}ready the day before</span></div>
        <div class="pd-s">Built from your emails, the campaign data and the last meeting notes.</div>
        <div class="pg">${PREP.map(p => `<div class="ps ${p[3]}"><div class="pi">${ic(p[0], 20)}</div><div><div class="lbl">${p[1]}</div><p>${p[2]}</p></div></div>`).join('')}</div></div>`,
    build(root, s) {
      s.n1 = $('.n1', root); s.n2 = $('.n2', root); s.fill = $('.tr i', root); s.dot = $('.tr b', root); s.em = $('.tr em', root);
      s.pd = $('.pd', root); s.ps = $$('.ps', root);
      cue('rise', s.t0 + 0.35, { d: 0.8 }); cue('pop', s.t0 + 0.9, { v: 0.5 });
      PREP.forEach((_, i) => cue('tick', s.t0 + 1.2 + i * 0.15, { v: 0.4 }));
    },
    update(lt, dur, root, s) {
      pop(s.n1, lt, 0.15); pop(s.n2, lt, 0.25);
      const k = P(lt, 0.35, 0.8, E.ioC);
      s.fill.style.transform = `scaleX(${k.toFixed(4)})`;
      s.dot.style.left = (100 * k).toFixed(2) + '%';
      s.dot.style.opacity = P(lt, 0.3, 0.2).toFixed(3);
      vis(s.em, lt, 0.8, Infinity, { dy: 8, blur: 4 });
      vis(s.pd, lt, 0.9, Infinity, { dy: 50, blur: 12, din: 0.7, ein: E.outX });
      s.ps.forEach((p, i) => pop(p, lt, 1.2 + i * 0.15, { dy: 14, din: 0.5 }));
    },
  });

  // ------------------------------------------------ MONTAGE · une phrase, un deck — et le WBR
  const PROMPT = "Make the PowerPoint for Thursday's PSC team meeting.";
  const SLIDES = [['title', 'Weekly PSC FR', 'October 8, 2026'], ['list', 'Agenda'], ['pacing', 'Pacing overview'], ['hot', 'Hot spots'],
    ['news', 'News DSP'], ['win', 'Wins of the week'], ['wbr', 'WBR highlights'], ['next', 'Next steps']];
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
  const SW = 232, SH = 131, SG = 18, SY = 330;
  hero('deck', {
    kicker: '05 · Builds your deliverables', head: 'One sentence. <span class="hl">One deck.</span>', uiAt: 0.05,
    cam: [[0, 1.35, 534, 380], [3.0, 1.6, 534, 640, 0.9]],
    css: `
    #sc-deck .dp{position:absolute;left:44px;top:128px;width:980px;height:92px;border-radius:999px;background:var(--navy);display:flex;align-items:center;gap:16px;padding:0 14px 0 30px;color:#fff;box-shadow:0 30px 80px -20px rgba(35,47,62,.5)}
    #sc-deck .dp .ic{color:#FFB547}
    #sc-deck .dp-t{flex:1;font-size:26px;letter-spacing:-.01em;white-space:nowrap;overflow:hidden}
    #sc-deck .dp-t .ph{color:#7D8A99}
    #sc-deck .dp-go{width:64px;height:64px;border-radius:50%;background:var(--or);display:grid;place-items:center}
    #sc-deck .dp-go .ic{color:#fff}
    #sc-deck .stt{position:absolute;left:74px;top:250px;display:flex;gap:10px;align-items:center;font-size:18px;color:var(--mut)}
    #sc-deck .stt b{color:var(--ink);font-weight:650}
    #sc-deck .spin{width:20px;height:20px;border-radius:50%;border:2.5px solid #E2DDD5;border-top-color:var(--or)}
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
    #sc-deck .file{left:44px;top:${SY + 2 * SH + SG + 34}px;width:980px;display:flex;gap:14px;align-items:center;padding:14px 20px 14px 14px}
    #sc-deck .file .fi{width:50px;height:50px;border-radius:11px;background:#C43E1C;color:#fff;display:grid;place-items:center;font:700 13px InterV;flex:none}
    #sc-deck .file .fw2{background:#1F8A5B}
    #sc-deck .file b{display:block;font-size:18px}
    #sc-deck .file span{font-size:14.5px;color:var(--mut)}
    #sc-deck .file .chip{margin-left:auto}
    #sc-deck .wbr{top:${SY + 2 * SH + SG + 134}px}`,
  }, {
    html: `<div class="dp">${ic('sparkles', 28)}<div class="dp-t"></div><div class="dp-go">${ic('arrow-right', 28)}</div></div>
      <div class="stt"><span class="spin"></span><span class="ok">${ic('circle-check', 20)}</span><span class="st-tx">agent Kiro is drafting · Amazon Ads design system</span></div>
      <div class="sls">${SLIDES.map(slideHTML).join('')}</div>
      <div class="card file f1"><div class="fi">PPTX</div><div><b>Weekly PSC FR · 8 October.pptx</b><span>8 slides · Amazon Ads design system · saved to Documents</span></div><span class="chip grn">${ic('check', 13)}ready</span></div>
      <div class="card file wbr"><div class="fi fw2">WBR</div><div><b>WBR 2026-W41 · BFM under-delivery, €54,564 at risk</b><span>context · impact · so what · next steps, from this week's data</span></div><span class="chip grn">${ic('copy', 13)}ready to paste</span></div>`,
    build(root, s) {
      s.pt = $('.dp-t', root); s.go = $('.dp-go', root); s.stt = $('.stt', root); s.spin = $('.spin', root); s.ok = $('.ok', root); s.stx = $('.st-tx', root);
      s.sl = $$('.sl', root); s.f1 = $('.f1', root); s.wbr = $('.wbr', root);
      cue('type', s.t0 + 0.15, { d: PROMPT.length / 52 }); cue('click', s.t0 + 1.2); cue('whoosh', s.t0 + 1.3, { v: 0.5 });
      SLIDES.forEach((_, i) => cue('card', s.t0 + 1.4 + i * 0.08, { v: 0.45 }));
      cue('success', s.t0 + 2.45, { v: 0.6 }); cue('pop', s.t0 + 2.75, { v: 0.5 });
    },
    update(lt, dur, root, s) {
      if (lt < 0.15) J.setHTML(s.pt, '<span class="ph">Ask Kiro anything…</span>');
      else type(s.pt, PROMPT, lt, 0.15, 52, { caret: lt < 1.2 });
      tf(s.go, { s: lt > 1.1 && lt < 1.4 ? 1 - 0.12 * Math.sin((lt - 1.1) / 0.3 * Math.PI) : 1 });
      pop(s.stt, lt, 1.3, { dy: 8, din: 0.4 });
      const done = lt > 2.4;
      s.spin.style.display = done ? 'none' : ''; s.ok.style.display = done ? '' : 'none';
      s.spin.style.transform = `rotate(${lt * 400}deg)`;
      J.setHTML(s.stx, done ? '<b>8 slides ready</b> · Amazon Ads design system' : 'agent Kiro is drafting · Amazon Ads design system');
      s.sl.forEach((el, i) => {
        const a = 1.4 + i * 0.08, k = P(lt, a, 0.7, E.outX);
        const tx = 44 + (i % 4) * (SW + SG), ty = SY + Math.floor(i / 4) * (SH + SG);
        tf(el, { x: lerp(860, tx, k), y: lerp(150, ty, k), s: lerp(0.3, 1, k), rz: (1 - k) * (i % 2 ? 14 : -14), o: P(lt, a, 0.2) });
      });
      vis(s.f1, lt, 2.4, Infinity, { dy: 26, blur: 10, din: 0.5 });
      vis(s.wbr, lt, 2.7, Infinity, { dy: 26, blur: 10, din: 0.5 });
    },
  });
})();
