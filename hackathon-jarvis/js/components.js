/* Découpage temporel (secondes) + composants réutilisés par les scènes */
(function () {
  'use strict';
  const { E, P, tf, vis, splitWords, revealWords, ic, $, scene, clamp } = J;

  // Chaque scène : [début, fin]. Les scènes voisines se chevauchent de 0,4 s (fondu).
  window.TL = {
    open: [0, 4.6], storm: [4.2, 16.4], stats: [16.0, 25.2], reveal: [24.8, 39.6],
    c1: [39.2, 41.2], brief: [40.8, 48.6], inbox: [48.2, 54.4], follow: [54.0, 60.8], agenda: [60.4, 66.8],
    c2: [66.4, 68.4], data: [68.0, 73.6], pacing: [73.2, 82.6], actions: [82.2, 91.4], trouble: [91.0, 99.4],
    c3: [99.0, 101.0], portfolio: [100.6, 107.2], sheet: [106.8, 116.6],
    c4: [116.2, 118.2], news: [117.8, 129.6],
    c5: [129.2, 131.2], deck: [130.8, 137.8], prep: [137.4, 143.6], wbr: [143.2, 151.6],
    control: [151.2, 158.0], learn: [157.6, 164.4],
    sfdc: [164.0, 169.4], network: [169.0, 174.6], outro: [174.2, 179.0],
  };

  // ---------- sphère ----------
  const orb = (d, extra = '') =>
    `<div class="orb" style="--d:${d}px;${extra}"><div class="orb-glow"></div><div class="orb-ring"></div><div class="orb-core"></div><div class="orb-swirl"></div><div class="orb-shine"></div></div>`;
  function orbTick(el, t, o = {}) {
    const [glow, ring, , swirl] = el.children;
    ring.style.transform = `rotate(${(t * 38).toFixed(2)}deg)`;
    swirl.style.transform = `rotate(${(-t * 62).toFixed(2)}deg)`;
    glow.style.opacity = ((o.glow ?? 1) * (0.82 + 0.18 * Math.sin(t * 1.9))).toFixed(3);
    return 1 + 0.022 * Math.sin(t * 2.3);
  }

  // ---------- sources de données ----------
  const SOURCES = [
    { name: 'Outlook', icon: 'mail', c: '#2F6FDE' },
    { name: 'Slack', icon: 'hash', c: '#9446BF' },
    { name: 'Calendar', icon: 'calendar', c: '#E5533D' },
    { name: 'Amazon DSP', icon: 'chart-column', c: '#F7930F' },
    { name: 'SIM tickets', icon: 'ticket', c: '#CF3F37' },
    { name: 'Documents', icon: 'file-text', c: '#16947E' },
  ];
  const tile = (s, size = 116) =>
    `<div class="tile" style="--c:${s.c};--ts:${size}px"><div class="tile-box">${ic(s.icon, Math.round(size * 0.42))}</div><div class="tile-name">${s.name}</div></div>`;

  // ---------- scène « fonctionnalité » : titre à gauche, interface à droite ----------
  function feature(id, span, o, ui) {
    scene({
      id, t0: span[0], t1: span[1], cls: o.cls || 'light', css: o.css,
      build(el, s) {
        el.innerHTML = `<div class="copy">${o.kicker ? `<div class="kicker"><i></i>${o.kicker}</div>` : ''}<div class="head">${o.head}</div>${o.sub ? `<div class="sub">${o.sub}</div>` : ''}</div><div class="uiw"><div class="uiz" style="transform:scale(${o.zoom ?? 1.06})">${ui.html}</div></div>`;
        s.copy = $('.copy', el); s.k = $('.kicker', el); s.hw = splitWords($('.head', el)); s.sub = $('.sub', el); s.ui = $('.uiw', el); s.uiz = $('.uiz', el);
        el.style.perspective = '2400px';
        if (ui.build) ui.build(s.uiz, s);
      },
      update(lt, dur, s, t) {
        if (s.k) vis(s.k, lt, 0.05, Infinity, { dy: 16, blur: 6 });
        revealWords(s.hw, lt, 0.14);
        if (s.sub) vis(s.sub, lt, 0.6, Infinity, { dy: 22, blur: 8 });
        vis(s.copy, lt, -1, dur, { dy: 0, blur: 0, dyo: -24, bo: 10, dout: 0.5 });
        const drift = (lt / dur) * (o.drift ?? 14);
        vis(s.ui, lt, o.uiAt ?? 0.2, dur, { dy: 80, blur: 18, ds: 0.04, rx: o.rx ?? 8, din: 1.25, ein: E.outX, y: -drift, dout: 0.5, dyo: -30, bo: 12 });
        ui.update(lt, dur, s.uiz, s, t);
      },
    });
  }

  // ---------- intertitre de chapitre ----------
  function chapter(id, span, num, title) {
    scene({
      id, t0: span[0], t1: span[1], cls: 'light',
      build(el, s) {
        el.innerHTML = `<div class="chap"><div class="chap-n"><i></i>${num}<i></i></div><div class="chap-t">${title}</div></div>`;
        s.n = $('.chap-n', el); s.tt = $('.chap-t', el); s.w = splitWords(s.tt);
      },
      update(lt, dur, s) {
        vis(s.n, lt, 0.05, dur, { dy: 18, blur: 6 });
        revealWords(s.w, lt, 0.15, { st: 0.09, dy: 60 });
        const q = P(lt, dur - 0.55, 0.55, E.inC);
        tf(s.tt, { y: -34 * q, s: 1 + 0.03 * P(lt, 0, dur, E.lin), o: 1 - q, b: 12 * q });
      },
    });
  }

  // ---------- maquette complète de l'application (plan « héros ») ----------
  const NAV = [
    ['sun', 'Today', '3'], ['inbox', 'To handle', ''], ['mail', 'Inbox', '7'], ['circle-check', 'Tasks', '3', 1],
    ['calendar', 'Agenda', '24'], ['user', 'Clients', '4'], ['folder', 'Projects', '8'], ['file', 'Documents', '1'],
    ['trending-up', 'Campaigns', '5', 1], ['wrench', 'Troubleshooting', ''], ['zap', 'News DSP', '495', 1], ['flag', 'Impact', '4', 1], ['brain', 'Brain', '15'],
  ];
  function sidebar() {
    return `<div class="am-side">
      <div class="am-logo"><b>amazon ads</b><span>|</span><em>J.A.R.V.I.S.</em></div>
      <div class="am-nav">${NAV.map((n, i) => `<div class="am-it${i === 0 ? ' on' : ''}">${ic(n[0], 19)}<span>${n[1]}</span><b class="${n[3] ? 'o' : ''}">${n[2]}</b></div>`).join('')}</div>
      <div class="am-foot">
        <div>${ic('brain', 14)}<span>Daily briefing</span><b>08:30</b></div>
        <div>${ic('refresh-cw', 14)}<span>Update the brain</span><b>11 msg</b></div>
        <div>${ic('clock', 14)}<span class="o">Briefing</span><b>Thu 08:30</b></div>
        <div><i class="dot" style="background:#3BB273;width:8px;height:8px"></i><span>Synced 2 min ago</span><b>sync</b></div>
      </div>
    </div>`;
  }
  function appMock() {
    return `<div class="am">
      ${sidebar()}
      <div class="am-main">
        <div class="am-top">
          <div><div class="htitle" style="font-size:34px">Good morning, Valentin</div><div class="am-date">Wednesday, October 7, 2026</div></div>
          <div class="am-btns"><span class="btn">${ic('refresh-cw', 16)}Sync</span><span class="btn">${ic('hash', 16)}Capture</span><span class="btn">${ic('brain', 16)}Kiro doc</span><span class="btn">${ic('plus', 16)}Task</span></div>
        </div>
        <div class="am-kpis">
          ${[['calendar', '3', 'meetings today', ''], ['circle-check', '2', 'to do today · 1 overdue', 'r'], ['inbox', '0', 'to handle right away', ''], ['zap', '6', 'possible follow-ups', '']]
            .map(k => `<div class="flat am-kpi"><div class="am-kic ${k[3]}">${ic(k[0], 20)}</div><div><div class="am-kn">${k[1]}</div><div class="am-kl">${k[2]}</div></div></div>`).join('')}
        </div>
        <div class="flat am-brief">
          <div class="am-bi">${ic('brain', 20)}</div>
          <div style="flex:1">
            <div class="am-bh"><span class="htitle" style="font-size:18px">Today's essentials</span><span class="lbl">automatic briefing · 07/10 08:30</span></div>
            <ol>
              <li>Since yesterday: nothing heavy in the mail, six messages, mostly acknowledgements.</li>
              <li>ENI Plénitude is unblocked: IAS workaround sent to Amnet, creatives still to pass the audit.</li>
              <li>One hot spot left: BFM, still no delivery on SVOD and CUTV, two tickets in progress.</li>
            </ol>
          </div>
          <div class="am-bb"><span class="btn" style="height:34px;font-size:13px">${ic('file', 14)}Full briefing</span><span class="btn orange" style="height:34px;font-size:13px">${ic('refresh-cw', 14)}Update (12)</span></div>
        </div>
        <div class="am-cols">
          <div class="flat am-todo">
            <div class="am-ch"><span class="htitle" style="font-size:18px">To do today</span><span class="lbl" style="letter-spacing:.04em;text-transform:none">1 action · sorted by priority</span></div>
            <div class="am-task">
              <div class="am-tt">BFM: chase Amnet and the publishers on SVOD and CUTV, follow both No Delivery tickets</div>
              <div class="am-tm"><span class="chip red mono" style="height:22px;font-size:11px">urgent</span><span>${ic('calendar', 13)} tomorrow</span><span><i class="dot" style="background:var(--grn);width:7px;height:7px"></i> BFM · October awareness (Amnet)</span></div>
              <div class="am-tp"><span class="lbl">campaign</span><div class="am-bar"><i style="width:2.3%"></i><b style="left:29%"></b></div><span class="am-red">2.3% delivered</span><span style="color:var(--mut)">for 29% of the time</span></div>
            </div>
          </div>
          <div class="flat am-meet">
            <div class="am-ch"><span class="htitle" style="font-size:18px">Meetings</span><span class="lbl" style="letter-spacing:.04em;text-transform:none">2 to keep in mind</span></div>
            <div class="am-m"><b>16:00</b><div><div class="am-mt">PSC Brainfood: Ads Moderation Agent</div><div class="am-ms">New Ads Agent features: on your Q4 AI readiness radar.</div></div></div>
            <div class="am-m"><b>16:00</b><div><div class="am-mt">Nintendo test 3P (Constance)</div><div class="am-ms">Confirmed at 16:04: overlaps the Brainfood, pick one.</div></div></div>
          </div>
        </div>
      </div>
    </div>`;
  }

  const CSS = `
  .chap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .chap-n{font:500 22px Plex,monospace;letter-spacing:.32em;color:var(--or);margin-bottom:30px;display:flex;align-items:center;gap:22px}
  .chap-n i{width:46px;height:2px;background:currentColor;opacity:.6}
  .chap-t{font-weight:700;font-size:156px;letter-spacing:-.052em;line-height:1;color:var(--ink)}
  .uiz{position:absolute;left:0;top:0;width:1040px;height:1080px;transform-origin:0 50%}
  .tile{position:absolute;width:var(--ts);margin:calc(var(--ts)/-2) 0 0 calc(var(--ts)/-2);text-align:center}
  .tile-box{width:var(--ts);height:var(--ts);border-radius:27%;display:grid;place-items:center;color:#fff;
    background:linear-gradient(160deg,color-mix(in srgb,var(--c) 78%,#fff) 0%,var(--c) 55%,color-mix(in srgb,var(--c) 80%,#000) 100%);
    box-shadow:0 24px 60px -10px color-mix(in srgb,var(--c) 45%,transparent),0 10px 30px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.35)}
  .tile-name{position:absolute;left:50%;transform:translateX(-50%);margin-top:16px;font-size:20px;font-weight:600;color:#E9ECF0;white-space:nowrap;letter-spacing:-.01em}

  .am{width:1600px;height:930px;border-radius:22px;overflow:hidden;display:flex;background:var(--bg);box-shadow:0 60px 160px -30px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08)}
  .am-side{width:250px;background:var(--navy);color:#C9D1DB;display:flex;flex-direction:column;padding:22px 12px 16px;flex:none}
  .am-logo{display:flex;align-items:baseline;gap:9px;padding:0 10px 22px;color:#fff}
  .am-logo b{font-weight:800;font-size:21px;letter-spacing:-.04em}
  .am-logo span{color:#58667A}
  .am-logo em{font:500 12px Plex,monospace;letter-spacing:.14em;font-style:normal;color:#AEB8C4}
  .am-it{display:flex;align-items:center;gap:13px;height:39px;padding:0 12px;border-radius:9px;font-size:15.5px;font-weight:500;color:#D4DAE2;position:relative}
  .am-it svg{color:#AEB8C4}
  .am-it span{flex:1}
  .am-it b{font:500 12.5px Plex,monospace;color:#8F9BA9}
  .am-it b.o{color:var(--or)}
  .am-it.on{background:#121A23;color:#fff}
  .am-it.on::before{content:"";position:absolute;left:0;top:7px;bottom:7px;width:3px;border-radius:3px;background:var(--or)}
  .am-it.on svg{color:var(--or)}
  .am-foot{margin-top:auto;border-top:1px solid #34404F;padding-top:12px;display:flex;flex-direction:column;gap:11px}
  .am-foot div{display:flex;align-items:center;gap:9px;font-size:12.5px;padding:0 10px}
  .am-foot span{flex:1}.am-foot .o{color:var(--or)}
  .am-foot b{font:500 11.5px Plex,monospace;color:#8F9BA9}
  .am-main{flex:1;padding:30px 36px;display:flex;flex-direction:column;gap:18px;min-width:0}
  .am-top{display:flex;justify-content:space-between;align-items:flex-start}
  .am-date{color:var(--mut);font-size:15px;margin-top:6px}
  .am-btns{display:flex;gap:10px}.am-btns .btn{height:38px;font-size:14px}
  .am-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .am-kpi{display:flex;gap:14px;align-items:center;padding:18px 20px}
  .am-kic{width:40px;height:40px;border-radius:10px;background:#F3F0EB;display:grid;place-items:center;color:#5D646C}
  .am-kic.r{background:var(--redbg);color:var(--red)}
  .am-kn{font-family:InterTight;font-weight:700;font-size:30px;line-height:1}
  .am-kl{font-size:13px;color:var(--mut);margin-top:5px}
  .am-brief{display:flex;gap:18px;padding:20px 22px;align-items:flex-start}
  .am-bi{width:42px;height:42px;border-radius:10px;background:var(--ink);color:#fff;display:grid;place-items:center;flex:none}
  .am-bh{display:flex;gap:14px;align-items:baseline;margin-bottom:10px}
  .am-brief ol{padding-left:22px;font-size:15px;line-height:1.75;color:var(--ink2)}
  .am-brief li::marker{color:var(--mut);font-weight:700}
  .am-bb{display:flex;flex-direction:column;gap:8px;align-items:flex-end}
  .am-cols{display:grid;grid-template-columns:1.25fr 1fr;gap:18px;flex:1;min-height:0}
  .am-todo,.am-meet{padding:20px 22px}
  .am-ch{display:flex;gap:12px;align-items:baseline;margin-bottom:16px}
  .am-tt{font-weight:600;font-size:15.5px;line-height:1.4}
  .am-tm{display:flex;gap:14px;align-items:center;margin-top:8px;font-size:13px;color:var(--mut)}
  .am-tm span{display:inline-flex;align-items:center;gap:6px}
  .am-tp{display:flex;align-items:center;gap:12px;margin-top:14px;font-size:13px;border-top:1px solid var(--line2);padding-top:12px}
  .am-bar{position:relative;width:110px;height:7px;border-radius:9px;background:#F1D9D3}
  .am-bar i{position:absolute;left:0;top:0;bottom:0;background:var(--red);border-radius:9px}
  .am-bar b{position:absolute;top:-4px;bottom:-4px;width:2px;background:var(--or)}
  .am-red{color:var(--red);font-weight:700}
  .am-m{display:flex;gap:18px;padding:12px 0;border-top:1px solid var(--line2)}
  .am-m>b{font-family:InterTight;font-size:16px}
  .am-mt{font-weight:600;font-size:15px}
  .am-ms{font-size:13px;color:var(--mut);margin-top:5px;line-height:1.45}
  `;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  Object.assign(window.J, { orb, orbTick, SOURCES, tile, feature, chapter, appMock, sidebar });
})();
