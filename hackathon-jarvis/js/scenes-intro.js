/* Acte 1 — ouverture, tempête de notifications, chiffres, révélation de J.A.R.V.I.S. */
(function () {
  'use strict';
  const { E, P, tf, vis, splitWords, revealWords, count, rng, ic, $, $$, scene, clamp, lerp, orb, orbTick, SOURCES, tile, appMock } = J;

  // ---------------------------------------------------------------- 0. Ouverture
  scene({
    id: 'open', t0: TL.open[0], t1: TL.open[1], cls: 'black', fin: 0,
    css: `
    #sc-open .o-wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
    #sc-open .o-k{font:500 19px Plex,monospace;letter-spacing:.3em;text-transform:uppercase;color:#7E8894;margin-bottom:34px}
    #sc-open .o-time{position:relative;font-weight:700;font-size:210px;letter-spacing:-.055em;line-height:1;color:#fff;display:flex;align-items:baseline}
    #sc-open .o-mm{display:inline-block;height:1.04em;overflow:hidden;vertical-align:top;position:relative}
    #sc-open .o-mm span{display:block;line-height:1.04}
    #sc-open .o-ap{font-size:.42em;letter-spacing:-.02em;margin-left:.22em;color:#6E7783;font-weight:600}
    #sc-open .o-badge{position:absolute;right:-70px;top:-26px;min-width:96px;height:96px;padding:0 22px;border-radius:60px;background:linear-gradient(160deg,#FF6B4A,#E5301E);
      color:#fff;font-size:46px;font-weight:700;letter-spacing:-.03em;display:grid;place-items:center;box-shadow:0 18px 50px rgba(229,48,30,.45)}
    `,
    build(el, s) {
      el.innerHTML = `<div class="o-wrap"><div class="o-k">Amazon Ads · Programmatic Solutions</div>
        <div class="o-time"><span>8:</span><span class="o-mm"><span class="m1">59</span><span class="m2">00</span></span><span class="o-ap">AM</span><div class="o-badge">1</div></div></div>`;
      s.k = $('.o-k', el); s.time = $('.o-time', el); s.mm = $('.o-mm', el); s.h = $('.o-time > span', el);
      s.badge = $('.o-badge', el); s.wrap = $('.o-wrap', el);
    },
    update(lt, dur, s) {
      vis(s.k, lt, 0.25, Infinity, { dy: 14, blur: 6 });
      vis(s.time, lt, 0.45, Infinity, { dy: 50, blur: 24, ds: 0.06, din: 1.3 });
      // 8:59 → 9:00
      const roll = P(lt, 1.55, 0.5, E.ioQ);
      s.mm.firstElementChild.style.transform = `translateY(${-104 * roll}%)`;
      s.mm.lastElementChild.style.transform = `translateY(${-104 * roll}%)`;
      s.h.textContent = roll > 0.5 ? '9:' : '8:';
      // pastille de notifications qui s'emballe
      const steps = [[2.15, 1], [2.55, 4], [2.9, 12], [3.2, 27], [3.45, 48], [3.68, 73], [3.9, 99]];
      let n = 0, last = -9;
      for (const [tt, v] of steps) if (lt >= tt) { n = v; last = tt; }
      s.badge.textContent = n >= 99 ? '99+' : n;
      const pop = lt - last;
      const ps = n ? 1 + 0.28 * Math.exp(-pop * 9) * Math.cos(pop * 18) : 0;
      tf(s.badge, { s: n ? ps * P(lt, 2.15, 0.25, E.outB) : 0, o: n ? 1 : 0 });
      // sortie : on fonce dans la tempête
      const q = P(lt, 3.95, 0.65, E.inC);
      tf(s.wrap, { s: 1 + 0.5 * q, o: 1 - q, b: 16 * q });
    },
  });

  // ---------------------------------------------------------------- 1. Tempête
  const TYPES = {
    mail: ['Outlook', '#2F6FDE', 'mail'], slack: ['Slack', '#9446BF', 'hash'], cal: ['Calendar', '#E5533D', 'calendar'],
    dsp: ['Amazon DSP', '#F7930F', 'chart-column'], sim: ['SIM', '#CF3F37', 'ticket'], news: ['News DSP', '#D99A16', 'zap'], wbr: ['SharePoint', '#16947E', 'file-text'],
  };
  const NOTES = [
    ['dsp', 'Under-delivery · BFM Notoriété octobre', 'SVOD 2% delivered for 29% of the flight', '06/10'],
    ['mail', 'Brief Boursorama // campagne REBOOT 2026', "Possible de me confirmer les 15% d'added value ?", '16:53'],
    ['slack', 'Léa Huguet', 'ouais prisma il faut relancer…', '17:56'],
    ['cal', 'PSC Brainfood Session', '16:00–17:00 · 13 participants · no reply yet', 'now'],
    ['sim', 'P529520879 · No Delivery', 'Assigned to linfun · in progress', '16:22'],
    ['news', 'Program Lighthouse', 'PSC-T now owns troubleshooting tickets', 'Dec'],
    ['mail', 'Amazon DSP: Columbia Order Under delivery', 'Thanks for flagging this and for the proposed…', '10:16'],
    ['mail', 'GSEB - DSP inventaire de diffusion offsite', 'Le choix des SSP envoyé par les équipes…', '11:08'],
    ['cal', 'Weekly - Dentsu GAE x Amazon Ads', 'Friday 10:00 · Teams', 'Fri'],
    ['wbr', 'WBR W41 · entries due Thursday', 'Highlights / Lowlights tracker', 'Thu'],
    ['slack', '#psc-fr', "Quelqu'un a le deck Nintendo ?", '15:02'],
    ['mail', 'Nintendo / update', "Je n'avais pas annulé le point de cet après-midi", '16:04'],
    ['dsp', 'Disney Studios · Whalefall', '12% delivered for 25% of the time', '07/10'],
    ['mail', 'Hashed audience CSV: new format?', 'As-tu identifié la personne pour nous mettre en contact ?', '16:44'],
    ['news', 'Streaming TV Plus without Twitch', 'New STV+ bundle · L8 Finance exception', '05/10'],
    ['sim', 'P529341292 · PMP deal not bidding', 'Assigned to jabizaki · 07/10', '11:36'],
    ['cal', 'Total Media Pitch Reveal + Supply Updates', 'Tuesday 9:30 – 11:00', 'Tue'],
    ['mail', 'AMAZON // SPF // Gestes Barrières Oct 2026', 'On garde un œil dessus', '15:10'],
    ['slack', 'France Martin', 'Le rapport ciblage ado / parents Prime ?', '16:50'],
    ['mail', 'Brief SPF GB // Azerion', 'La catégorie Gouvernement ne peut pas être changée', '16:37'],
    ['dsp', 'GAE SPF · Mois sans tabac', 'M6 at 12%, FTV at 10%: under-delivering', '06/10'],
    ['news', 'VOC tracker · new DSP UI', 'Worldwide rollout on 30/11', 'Nov'],
    ['cal', '1:1 Val / Steph', 'Thursday 10:00', 'Thu'],
    ['mail', 'Data Amazon Garage - XPENG', "I'm adding Wicky, the account manager on XPENG", 'Fri'],
    ['sim', 'Ad group 582576323137355621', 'TWIG: 50% of bids filtered', '16:54'],
    ['wbr', 'EU PSC Team meeting deck', 'Finalize and rehearse with Diane', '9 d'],
    ['mail', 'Amazon x 20th Century Studios : Englouti', 'Je check si ça prend bien demain', '15:39'],
    ['slack', 'Raphaël', 'Tu peux regarder le pacing Sage ?', '14:12'],
    ['news', 'EU PSC Updates in 5 sentences', 'Waypoint / Express Lane for troubleshooting', '24/08'],
    ['cal', 'Ads Tech Talk: Keeping Your Pipelines Green', '21:00 · 51 participants', 'Wed'],
    ['dsp', 'ENI Plénitude · 0% delivered', 'Creatives blocked by IAS', '07/10'],
    ['mail', 'RMC-BFM x Amazon - Déjeuner', 'Tu aurais le temps pour une invitation à déjeuner ?', '27 d'],
    ['slack', '#ads-dsp-support', 'New thread in #waypoint-escalations', '17:02'],
    ['mail', 'Brief Boursorama // campagne REBOOT 2026', 'Je rajoute un zéro sur le budget Twitch', '16:53'],
    ['sim', 'P507521674 · BabyBio Prime line', 'Reopened · waiting on Raph', '09:12'],
    ['wbr', 'Top Offenders EU PSC · W38', 'Tracker entry due 22/09, 13:00 CEST', '24 d'],
  ];
  window.STORM_SPAWNS = [];

  scene({
    id: 'storm', t0: TL.storm[0], t1: TL.storm[1], cls: 'dark',
    css: `
    #sc-storm{background:radial-gradient(1400px 900px at 50% 55%,#151a22 0%,#07090c 60%,#000 100%)}
    #sc-storm .st-wrap{position:absolute;inset:0}
    #sc-storm .st-cam{position:absolute;inset:0;perspective:1000px;perspective-origin:50% 50%}
    #sc-storm .nc{position:absolute;left:50%;top:50%;width:450px;height:104px;margin:-52px 0 0 -225px;padding:16px 18px;border-radius:22px;
      background:rgba(244,245,247,.94);box-shadow:0 30px 70px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.4) inset;display:flex;gap:14px;color:#15181C;overflow:hidden}
    #sc-storm .nc::after{content:"";position:absolute;inset:0;background:#05070a;opacity:var(--dim,0);border-radius:inherit}
    #sc-storm .nc-ic{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;flex:none;color:#fff}
    #sc-storm .nc-b{min-width:0;flex:1}
    #sc-storm .nc-src{font-size:13px;color:#7A828C;display:flex;justify-content:space-between;font-weight:500}
    #sc-storm .nc-t{font-size:17.5px;font-weight:650;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em}
    #sc-storm .nc-p{font-size:15px;color:#555D66;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #sc-storm .st-dim{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(0,0,0,.55),rgba(0,0,0,.85))}
    #sc-storm .st-txt{position:absolute;left:0;right:0;top:50%;margin-top:-60px;text-align:center;font-weight:700;font-size:108px;letter-spacing:-.05em;line-height:1.05;color:#fff}
    `,
    build(el, s) {
      const r = rng(7);
      const LIST = NOTES.concat(NOTES.slice().reverse().slice(0, 28));
      const N = LIST.length;
      s.cards = LIST.map((n, i) => {
        const [src, c, icon] = TYPES[n[0]];
        const card = J.h(`<div class="nc"><div class="nc-ic" style="background:${c}">${ic(icon, 22)}</div><div class="nc-b"><div class="nc-src"><span>${src}</span><span>${n[3]}</span></div><div class="nc-t">${J.esc(n[1])}</div><div class="nc-p">${J.esc(n[2])}</div></div></div>`);
        // position : une grille déformée pour couvrir l'écran sans trop de recouvrement
        let x = (r() * 2 - 1) * 820, y = (r() * 2 - 1) * 440, z = -r() * 1300 - 40;
        if (i === 0) { x = 0; y = 0; z = -150; }
        const ts = i === 0 ? 0.25 : 0.6 + 6.3 * Math.pow(i / N, 0.55);
        window.STORM_SPAWNS.push(TL.storm[0] + ts);
        return { el: card, x, y, z, rz: (r() * 2 - 1) * 5, ts, out: 0.6 + r() * 0.8 };
      });
      el.innerHTML = `<div class="st-wrap"><div class="st-cam"></div></div><div class="st-dim"></div><div class="st-txt t1">Every answer already exists.</div><div class="st-txt t2">It's just <span class="hl">scattered.</span></div>`;
      s.cam = $('.st-cam', el); s.wrap = $('.st-wrap', el); s.dim = $('.st-dim', el);
      // les cartes les plus lointaines d'abord (ordre de dessin)
      [...s.cards].sort((a, b) => a.z - b.z).forEach(c => s.cam.appendChild(c.el));
      s.tx1 = $(".t1", el); s.tx2 = $(".t2", el); s.w1 = splitWords(s.tx1); s.w2 = splitWords(s.tx2);
    },
    update(lt, dur, s) {
      const push = 380 * P(lt, 0, 7.6, E.inQ);
      const scatter = P(lt, 9.6, 2.0, E.inQ);
      for (const c of s.cards) {
        const k = clamp((lt - c.ts) / 0.95);
        if (k <= 0) { c.el.style.visibility = 'hidden'; continue; }
        const e = E.outX(k);
        const sx = 1 + 1.5 * scatter * c.out;
        const z = c.z - 900 * (1 - e) + push + (lt - c.ts) * 26 + 700 * scatter * c.out;
        const depth = clamp(1 + z / 1700);
        c.el.style.setProperty('--dim', (0.62 * (1 - depth)).toFixed(3));
        tf(c.el, { x: c.x * sx, y: c.y * sx, z, rz: c.rz * (1 - e * 0.6), o: E.outC(k) * (1 - scatter), s: 1 });
      }
      // gel + assombrissement, puis les deux phrases
      const fr = P(lt, 7.1, 0.8, E.ioC);
      s.dim.style.opacity = (0.9 * fr).toFixed(3);
      s.wrap.style.filter = fr > 0.01 ? `blur(${(10 * fr).toFixed(2)}px)` : 'none';
      revealWords(s.w1, lt, 7.45, { st: 0.09, dy: 50 });
      const q1 = P(lt, 9.35, 0.45, E.inC);
      tf(s.tx1, { y: -40 * q1, o: 1 - q1, b: 10 * q1 });
      revealWords(s.w2, lt, 9.75, { st: 0.12, dy: 50 });
      const q2 = P(lt, dur - 0.7, 0.6, E.inC);
      tf(s.tx2, { y: -30 * q2, o: 1 - q2, b: 10 * q2 });
    },
  });

  // ---------------------------------------------------------------- 2. Les chiffres
  scene({
    id: 'stats', t0: TL.stats[0], t1: TL.stats[1], cls: 'black',
    css: `
    #sc-stats .col{position:absolute;top:330px;width:520px;margin-left:-260px;text-align:center}
    #sc-stats .n{font-weight:700;font-size:150px;letter-spacing:-.055em;line-height:1;color:#fff;font-variant-numeric:tabular-nums}
    #sc-stats .l{margin-top:22px;font-size:28px;color:#8C96A2;letter-spacing:-.01em}
    #sc-stats .one{position:absolute;left:0;right:0;top:600px;text-align:center;font-weight:700;font-size:150px;letter-spacing:-.055em;line-height:1.05;color:#fff}
    `,
    build(el, s) {
      const cols = [[420, 16125, 'emails in the vault'], [960, 739, 'DSP updates to track'], [1500, 40, 'live campaigns']];
      el.innerHTML = cols.map(c => `<div class="col" style="left:${c[0]}px"><div class="n">0</div><div class="l">${c[2]}</div></div>`).join('') +
        `<div class="one">One <span class="hl">consultant.</span></div>`;
      s.cols = $$('.col', el).map((e, i) => ({ el: e, n: $('.n', e), l: $('.l', e), v: cols[i][1] }));
      s.one = $('.one', el); s.ow = splitWords(s.one);
    },
    update(lt, dur, s) {
      const dimK = P(lt, 4.9, 0.9, E.ioC);
      s.cols.forEach((c, i) => {
        const a = 0.35 + i * 1.5;
        vis(c.n, lt, a, Infinity, { dy: 50, blur: 20, ds: 0.08, din: 1.1 });
        vis(c.l, lt, a + 0.35, Infinity, { dy: 20, blur: 8 });
        count(c.n, lt, a, 1.35, 0, c.v);
        tf(c.el, { y: -120 * dimK, s: 1 - 0.18 * dimK, o: 1 - 0.62 * dimK });
      });
      revealWords(s.ow, lt, 5.2, { st: 0.14, dy: 70, d: 1.1 });
      const q = P(lt, dur - 0.65, 0.65, E.inC);
      s.el.style.filter = q > 0.01 ? `blur(${(12 * q).toFixed(2)}px)` : 'none';
      tf(s.one, { o: 1 - q, s: 1 + 0.04 * q });
    },
  });

  // ---------------------------------------------------------------- 3. Révélation
  const TILE_POS = [[-600, 0], [-300, -265], [300, -265], [600, 0], [300, 265], [-300, 265]];
  scene({
    id: 'reveal', t0: TL.reveal[0], t1: TL.reveal[1], cls: 'dark',
    css: `
    #sc-reveal{background:radial-gradient(1200px 800px at 50% 50%,#141018 0%,#060608 62%,#000 100%);perspective:1800px;perspective-origin:50% 40%}
    #sc-reveal .rv-c{position:absolute;left:960px;top:540px}
    #sc-reveal svg.rv-lines{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
    #sc-reveal .pt{position:absolute;left:0;top:0;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:#FFD08A;box-shadow:0 0 12px 4px rgba(255,150,50,.75)}
    #sc-reveal .flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(255,226,180,.95),rgba(255,140,40,.35) 30%,rgba(0,0,0,0) 65%);opacity:0}
    #sc-reveal .rv-title{position:absolute;left:0;right:0;top:420px;text-align:center;font-weight:700;font-size:200px;line-height:1;color:#fff;letter-spacing:.14em;padding-left:.14em}
    #sc-reveal .rv-sub{position:absolute;left:0;right:0;top:672px;text-align:center;font-size:38px;color:#A6AFBA;letter-spacing:-.015em}
    #sc-reveal .rv-pill{position:absolute;left:50%;top:762px;transform:translateX(-50%);display:flex;justify-content:center}
    #sc-reveal .rv-pill span{display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 22px;border-radius:999px;border:1px solid rgba(255,255,255,.18);font:500 17px Plex,monospace;letter-spacing:.16em;text-transform:uppercase;color:#E6E9ED;background:rgba(255,255,255,.04)}
    #sc-reveal .rv-app{position:absolute;left:160px;top:75px;transform-origin:52% 26%}
    #sc-reveal .rv-floor{position:absolute;left:260px;right:260px;top:620px;height:520px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,130,40,.38),rgba(255,130,40,0));filter:blur(30px)}
    `,
    build(el, s) {
      el.innerHTML = `<div class="rv-floor"></div><svg class="rv-lines"></svg><div class="rv-tiles"></div><div class="rv-pts"></div>
        <div class="rv-c">${orb(210)}</div><div class="flash"></div>
        <div class="rv-title">J.A.R.V.I.S.</div><div class="rv-sub">One AI brain for the Programmatic Solutions Consultant.</div>
        <div class="rv-pill"><span>${ic('sparkles', 18)} Powered by Kiro</span></div>
        <div class="rv-app">${appMock()}</div>`;
      s.orb = $('.orb', el); s.flash = $('.flash', el); s.title = $('.rv-title', el); s.sub = $('.rv-sub', el); s.pill = $('.rv-pill', el);
      s.app = $('.rv-app', el); s.floor = $('.rv-floor', el);
      const svg = $('.rv-lines', el), tiles = $('.rv-tiles', el), pts = $('.rv-pts', el);
      s.tiles = SOURCES.map((src, i) => {
        const t = J.h(tile(src, 112));
        t.style.left = 960 + TILE_POS[i][0] + 'px'; t.style.top = 540 + TILE_POS[i][1] + 'px';
        tiles.appendChild(t);
        // courbe légère de la tuile vers le centre
        const [x0, y0] = [960 + TILE_POS[i][0], 540 + TILE_POS[i][1]];
        const mx = (x0 + 960) / 2 - TILE_POS[i][1] * 0.18, my = (y0 + 540) / 2 + TILE_POS[i][0] * 0.18;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${x0},${y0} Q${mx},${my} 960,540`);
        path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'rgba(255,170,90,.42)'); path.setAttribute('stroke-width', '2');
        svg.appendChild(path);
        const len = path.getTotalLength();
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        const ps = [0, 1, 2].map(() => { const p = J.h('<div class="pt"></div>'); pts.appendChild(p); return p; });
        return { el: t, path, len, ps, x0, y0, mx, my };
      });
    },
    update(lt, dur, s, t) {
      // phase A : sources → cerveau
      const collapse = P(lt, 5.55, 0.75, E.inQ);
      s.tiles.forEach((tl, i) => {
        const a = 0.55 + i * 0.2;
        const k = P(lt, a, 0.9, E.outQi);
        const cx = lerp(0, -TILE_POS[i][0], collapse), cy = lerp(0, -TILE_POS[i][1], collapse);
        tf(tl.el, { x: cx, y: cy + 40 * (1 - k), s: (0.7 + 0.3 * k) * (1 - 0.75 * collapse), o: P(lt, a, 0.5) * (1 - collapse), b: 14 * (1 - k) + 6 * collapse });
        const d = P(lt, 2.0 + i * 0.12, 0.9, E.ioC);
        tl.path.style.strokeDashoffset = (tl.len * (1 - d)).toFixed(1);
        tl.path.style.opacity = (1 - collapse).toFixed(3);
        tl.ps.forEach((p, j) => {
          const live = lt > 2.6 && collapse < 1;
          if (!live) { p.style.opacity = 0; return; }
          const ph = ((lt - 2.6) * 0.55 + j / 3 + i * 0.11) % 1;
          const u = E.inQ(ph), v = 1 - u;
          const x = v * v * tl.x0 + 2 * v * u * tl.mx + u * u * 960, y = v * v * tl.y0 + 2 * v * u * tl.my + u * u * 540;
          p.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
          p.style.opacity = (Math.sin(Math.PI * ph) * P(lt, 2.6, 0.6) * (1 - collapse)).toFixed(3);
        });
      });
      // sphère
      const pulse = orbTick(s.orb, t, { glow: 0.6 + 0.6 * P(lt, 2.5, 3.2) });
      const kick = Math.exp(-Math.max(0, lt - 6.25) * 4) * (lt > 6.25 ? 1 : 0);
      const grow = 0.45 + 0.55 * P(lt, 0.2, 1.4, E.outQi) + 0.18 * P(lt, 2.5, 3.5, E.ioC) + 0.25 * kick;
      const toTop = P(lt, 6.6, 1.2, E.outQi);
      const shrink = lerp(1, 0.46 / 1.18, toTop);
      const orbOut = P(lt, 10.4, 0.7, E.inC);
      tf(s.orb, { s: grow * pulse * shrink, y: -262 * toTop - 60 * orbOut, o: P(lt, 0.2, 0.8) * (1 - orbOut) });
      s.flash.style.opacity = (P(lt, 5.95, 0.3, E.inQ) * (1 - P(lt, 6.3, 1.0, E.outC))).toFixed(3);
      // phase B : le nom
      const ti = P(lt, 6.55, 1.6, E.outQi);
      const tOut = P(lt, 10.35, 0.7, E.inC);
      s.title.style.letterSpacing = `${(0.14 + 0.5 * (1 - ti)).toFixed(4)}em`;
      tf(s.title, { o: P(lt, 6.55, 0.9) * (1 - tOut), b: 24 * (1 - ti) + 12 * tOut, s: 1.06 - 0.06 * ti, y: -90 * tOut });
      vis(s.sub, lt, 7.6, 11.05, { dy: 24, blur: 10, dout: 0.7, dyo: -90 });
      vis(s.pill, lt, 8.25, 11.05, { dy: 20, blur: 8, dout: 0.7, dyo: -90 });
      // phase C : l'application se lève
      const rise = P(lt, 10.7, 1.9, E.outQi);
      const zoom = P(lt, 13.25, 1.55, E.inQ);
      const appScale = lerp(0.74, 0.8, P(lt, 10.7, 2.7, E.outC)) + 1.4 * zoom;
      tf(s.app, { y: 760 * (1 - rise), rx: 42 * (1 - rise) + 3 * (1 - zoom) * rise, s: appScale, o: P(lt, 10.7, 0.6) });
      s.app.style.visibility = lt < 10.6 ? 'hidden' : 'visible';
      s.floor.style.opacity = (P(lt, 10.9, 1.2) * (1 - zoom)).toFixed(3);
    },
  });
})();
