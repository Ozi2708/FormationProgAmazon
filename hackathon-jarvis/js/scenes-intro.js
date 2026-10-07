/* Acte 1 — logo, ouverture, tempête de notifications, avalanche, révélation de J.A.R.V.I.S. */
(function () {
  'use strict';
  const { E, P, tf, vis, splitWords, revealWords, rng, ic, $, $$, scene, clamp, lerp, orb, orbTick, SOURCES, tile, appMock, cue } = J;
  const BP = BRAND.paths;

  // ---------------------------------------------------------------- 0. Logo Amazon Ads
  scene({
    id: 'logo', t0: TL.logo[0], t1: TL.logo[1], cls: 'black', fin: 0,
    css: `
    #sc-logo .lw{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
    #sc-logo .lg{position:relative;width:600px;height:${Math.round(600 * BRAND.LOGO_RATIO)}px}
    #sc-logo .lg svg{position:absolute;left:0;top:0;width:600px;overflow:visible}
    #sc-logo .ls{filter:drop-shadow(0 0 18px rgba(255,153,0,.55))}
    #sc-logo .lsub{margin-top:46px;font:500 19px Plex,monospace;letter-spacing:.32em;text-transform:uppercase;color:#8D98A6}
    `,
    build(el, s) {
      el.innerHTML = `<div class="lw"><div class="lg"><svg class="lt" viewBox="${BP.LOGO_VB}"><path d="${BP.LOGO_TEXT}" fill="#fff" fill-rule="evenodd"/></svg>
        <svg class="ls" viewBox="${BP.LOGO_VB}"><path d="${BP.LOGO_SMILE}" fill="#FF9900"/></svg></div><div class="lsub">Programmatic Solutions · France</div></div>`;
      s.lt = $('.lt', el); s.ls = $('.ls', el); s.sub = $('.lsub', el); s.lw = $('.lw', el);
      cue('logo', s.t0 + 0.75);
    },
    update(lt, dur, s) {
      vis(s.lt, lt, 0.15, Infinity, { dy: 18, blur: 16, din: 1.0 });
      const d = P(lt, 0.7, 0.8, E.outQu);
      s.ls.style.clipPath = `inset(-30% ${(100 - 100 * d).toFixed(2)}% -30% 0)`;
      vis(s.sub, lt, 1.1, Infinity, { dy: 12, blur: 6 });
      const q = P(lt, dur - 0.75, 0.75, E.inC);
      tf(s.lw, { s: 1 + 0.06 * P(lt, 0, dur, E.lin) + 0.1 * q, o: 1 - q, b: 12 * q });
    },
  });

  // ---------------------------------------------------------------- 1. Ouverture
  scene({
    id: 'open', t0: TL.open[0], t1: TL.open[1], cls: 'black',
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
      el.innerHTML = `<div class="o-wrap"><div class="o-k">A Programmatic Solutions Consultant's day</div>
        <div class="o-time"><span>8:</span><span class="o-mm"><span class="m1">59</span><span class="m2">00</span></span><span class="o-ap">AM</span><div class="o-badge">1</div></div></div>`;
      s.k = $('.o-k', el); s.time = $('.o-time', el); s.mm = $('.o-mm', el); s.h = $('.o-time > span', el);
      s.badge = $('.o-badge', el); s.wrap = $('.o-wrap', el);
    },
    update(lt, dur, s) {
      vis(s.k, lt, 0.25, Infinity, { dy: 14, blur: 6 });
      vis(s.time, lt, 0.45, Infinity, { dy: 50, blur: 24, ds: 0.06, din: 1.3 });
      const roll = P(lt, 1.55, 0.5, E.ioQ);
      s.mm.firstElementChild.style.transform = `translateY(${-104 * roll}%)`;
      s.mm.lastElementChild.style.transform = `translateY(${-104 * roll}%)`;
      s.h.textContent = roll > 0.5 ? '9:' : '8:';
      const steps = [[2.15, 1], [2.55, 4], [2.9, 12], [3.2, 27], [3.45, 48], [3.68, 73], [3.9, 99]];
      let n = 0, last = -9;
      for (const [tt, v] of steps) if (lt >= tt) { n = v; last = tt; }
      s.badge.textContent = n >= 99 ? '99+' : n;
      const pop = lt - last;
      const ps = n ? 1 + 0.28 * Math.exp(-pop * 9) * Math.cos(pop * 18) : 0;
      tf(s.badge, { s: n ? ps * P(lt, 2.15, 0.25, E.outB) : 0, o: n ? 1 : 0 });
      const q = P(lt, 3.95, 0.65, E.inC);
      tf(s.wrap, { s: 1 + 0.5 * q, o: 1 - q, b: 16 * q });
    },
  });

  // ---------------------------------------------------------------- 2. Tempête
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
  const NC_CSS = id => `
    ${id} .nc{position:absolute;left:50%;top:50%;width:450px;height:104px;margin:-52px 0 0 -225px;padding:16px 18px;border-radius:22px;
      background:rgba(244,245,247,.95);box-shadow:0 30px 70px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.4) inset;display:flex;gap:14px;color:#15181C;overflow:hidden}
    ${id} .nc::after{content:"";position:absolute;inset:0;background:#0A0F16;opacity:var(--dim,0);border-radius:inherit}
    ${id} .nc-ic{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;flex:none;color:#fff}
    ${id} .nc-b{min-width:0;flex:1}
    ${id} .nc-src{font-size:13px;color:#7A828C;display:flex;justify-content:space-between;font-weight:500}
    ${id} .nc-t{font-size:17.5px;font-weight:650;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em}
    ${id} .nc-p{font-size:15px;color:#555D66;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`;
  const ncHTML = n => { const [src, c, icon] = TYPES[n[0]];
    return `<div class="nc"><div class="nc-ic" style="background:${c}">${ic(icon, 22)}</div><div class="nc-b"><div class="nc-src"><span>${src}</span><span>${n[3]}</span></div><div class="nc-t">${J.esc(n[1])}</div><div class="nc-p">${J.esc(n[2])}</div></div></div>`; };
  const NAVY_BG = 'radial-gradient(1400px 900px at 50% 52%,#1E2A3A 0%,#111923 58%,#0A0F16 100%)';
  const FOCUS = 7.1;

  scene({
    id: 'storm', t0: TL.storm[0], t1: TL.storm[1], cls: 'dark',
    css: `#sc-storm{background:${NAVY_BG}}
    #sc-storm .st-cam{position:absolute;inset:0;perspective:1000px;perspective-origin:50% 50%}` + NC_CSS('#sc-storm'),
    build(el, s) {
      const r = rng(7);
      const LIST = NOTES.concat(NOTES.slice().reverse().slice(0, 28));
      const N = LIST.length;
      s.cards = LIST.map((n, i) => {
        const card = J.h(ncHTML(n));
        let x = (r() * 2 - 1) * 820, y = (r() * 2 - 1) * 440, z = -r() * 1300 - 40;
        if (i === 0) { x = 0; y = 0; z = -150; }
        const ts = i === 0 ? 0.25 : 0.6 + 6.0 * Math.pow(i / N, 0.55);
        if (ts - 0.0 < FOCUS) window.STORM_SPAWNS.push(TL.storm[0] + ts);
        return { el: card, x, y, z, rz: (r() * 2 - 1) * 5, ts, i };
      });
      el.innerHTML = `<div class="st-cam"></div>`;
      s.cam = $('.st-cam', el);
      [...s.cards].sort((a, b) => a.z - b.z).forEach(c => s.cam.appendChild(c.el));
      s.cards[0].el.style.zIndex = 50;
      cue('freeze', s.t0 + FOCUS);
    },
    update(lt, dur, s) {
      const push = 380 * P(lt, 0, FOCUS + 0.2, E.inQ);
      const foc = P(lt, FOCUS, 1.1, E.ioC);
      for (const c of s.cards) {
        const k = clamp((lt - c.ts) / 0.95);
        if (k <= 0) { c.el.style.visibility = 'hidden'; continue; }
        const e = E.outX(k);
        let z = c.z - 900 * (1 - e) + push + (lt - c.ts) * 26;
        if (c.i === 0) {
          // la carte du départ revient au centre, à plat : elle ouvre l'avalanche
          z = lerp(z, 0, foc);
          c.el.style.setProperty('--dim', '0');
          tf(c.el, { z, rz: c.rz * (1 - e * 0.6) * (1 - foc), o: E.outC(k) });
          continue;
        }
        const depth = clamp(1 + z / 1700);
        c.el.style.setProperty('--dim', (0.62 * (1 - depth)).toFixed(3));
        tf(c.el, { x: c.x * (1 + 0.25 * foc), y: c.y * (1 + 0.25 * foc), z: z + 200 * foc, rz: c.rz * (1 - e * 0.6), o: E.outC(k) * (1 - foc), b: 10 * foc });
      }
    },
  });

  // ---------------------------------------------------------------- 3. Avalanche : une carte parmi des milliers
  const TW = 200, TH = 46, GX = 210, GY = 56, S0 = 2.25, SMIN = 0.068;
  const TCOL = ['#2F6FDE', '#9446BF', '#E5533D', '#FF9900', '#CF3F37', '#D99A16', '#16947E'];
  const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const HALO = { x: 1190, y: 700, r: 92 };
  scene({
    id: 'avalanche', t0: TL.avalanche[0], t1: TL.avalanche[1], cls: 'dark',
    css: `#sc-avalanche{background:${NAVY_BG}}
    #sc-avalanche canvas{position:absolute;left:0;top:0;width:1920px;height:1080px}
    #sc-avalanche .veil{position:absolute;inset:0;background:radial-gradient(1100px 600px at 50% 46%,rgba(10,15,22,.72),rgba(10,15,22,.25))}
    #sc-avalanche .spot{position:absolute;inset:0}
    #sc-avalanche .ring{position:absolute;left:${HALO.x - HALO.r}px;top:${HALO.y - HALO.r}px;width:${HALO.r * 2}px;height:${HALO.r * 2}px;border-radius:50%;border:2.5px solid #FF9900;box-shadow:0 0 30px rgba(255,153,0,.6),inset 0 0 20px rgba(255,153,0,.35)}
    #sc-avalanche .rl{position:absolute;left:${HALO.x + HALO.r + 26}px;top:${HALO.y - 12}px;font:600 17px Plex,monospace;letter-spacing:.2em;text-transform:uppercase;color:#FFB547;white-space:nowrap}
    #sc-avalanche .rl::before{content:"";position:absolute;left:-26px;top:11px;width:18px;height:2px;background:#FFB547}
    #sc-avalanche .tx{position:absolute;left:0;right:0;text-align:center;font-weight:700;font-size:104px;letter-spacing:-.05em;line-height:1.05;color:#fff;text-shadow:0 6px 40px rgba(0,0,0,.6)}
    #sc-avalanche .t1{top:440px}#sc-avalanche .t2{top:330px}
    #sc-avalanche .seed{position:absolute;left:960px;top:540px;width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:50%;background:radial-gradient(circle,#FFE2B0 0%,#FF9900 18%,rgba(255,140,0,.35) 38%,rgba(255,140,0,0) 70%)}
    ` + NC_CSS('#sc-avalanche'),
    build(el, s) {
      el.innerHTML = `<canvas width="1920" height="1080"></canvas><div class="veil"></div><div class="spot"></div><div class="ring"></div><div class="rl">What you can read today</div>
        ${ncHTML(NOTES[0])}<div class="tx t1">Everything you need is in there.</div><div class="tx t2">No one can see it all.</div><div class="seed"></div>`;
      s.cv = $('canvas', el); s.ctx = s.cv.getContext('2d');
      const rr = rng(21);
      s.streaks = Array.from({ length: 170 }, () => { const a = rr() * Math.PI * 2, r = 650 + rr() * 650; return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.62, a: 10.0 + rr() * 1.6, d: 0.7 + rr() * 0.6, w: 1.2 + rr() * 2.2 }; });
      s.veil = $('.veil', el); s.spot = $('.spot', el); s.ring = $('.ring', el); s.rl = $('.rl', el); s.card = $('.nc', el); s.seed = $('.seed', el);
      s.tx1 = $(".t1", el); s.tx2 = $('.t2', el); s.w1 = splitWords(s.tx1); s.w2 = splitWords(s.tx2);
      cue('zoomout', s.t0 + 0.8, { d: 6.2 }); cue('hit', s.t0 + 7.2, { v: 0.45 }); cue('implode', s.t0 + 10.2, { d: 2.0 });
    },
    update(lt, dur, s) {
      const zk = E.ioC(P(lt, 0.8, 6.2, E.lin));
      const sc = S0 * Math.exp(Math.log(SMIN / S0) * zk) * (1 - 0.04 * P(lt, 7, 5, E.lin));
      const imp = P(lt, 10.2, 1.9, E.inQ);
      const reveal = P(lt, 0.7, 1.6);
      const drift = (lt - 2) * P(lt, 2, 4, E.inQ);
      const ctx = s.ctx;
      ctx.clearRect(0, 0, 1920, 1080);
      const px = GX * sc, py = GY * sc, tw = TW * sc, th = TH * sc;
      const i0 = Math.floor(-960 / px) - 1, i1 = Math.ceil(960 / px) + 1;
      for (let i = i0; i <= i1; i++) {
        const sp = i === 0 ? 0 : (hash(i, 7) * 2 - 1) * 1.6;
        const off = drift * sp;
        const fo = off - Math.floor(off);
        const j0 = Math.floor(-540 / py) - 2, j1 = Math.ceil(540 / py) + 2;
        for (let j = j0; j <= j1; j++) {
          const wj = j + Math.floor(off);
          if (i === 0 && wj === 0 && tw > 150) continue;
          let x = 960 + i * px - tw / 2, y = 540 + (j - fo) * py - th / 2;
          let w = tw, hh = th, m = 1;
          if (imp > 0) {
            // les bords s'effacent d'abord, le reste est aspiré vers le centre
            const dx = x + w / 2 - 960, dy = y + hh / 2 - 540;
            const dd = 0.6 * Math.max(Math.abs(dx) / 960, Math.abs(dy) / 540) + 0.4 * Math.hypot(dx / 960, dy / 540);
            m = clamp(1 - imp * (0.25 + 3.2 * dd));
            const pull = 0.45 * imp * imp;
            x = 960 + dx * (1 - pull) - w / 2; y = 540 + dy * (1 - pull) - hh / 2;
          }
          if (x > 1920 || x + w < 0 || y > 1080 || y + hh < 0) continue;
          const hv = hash(i, wj), col = TCOL[Math.floor(hv * 7)];
          const isC = i === 0 && wj === 0;
          const a = (isC ? 1 : reveal) * m * (0.55 + 0.45 * hash(wj, i));
          if (a <= 0.01) continue;
          ctx.globalAlpha = a;
          if (w >= 30) {
            ctx.fillStyle = '#EEF1F4';
            if (w >= 90) { const r = Math.min(10, hh * 0.22); ctx.beginPath(); ctx.roundRect(x, y, w, hh, r); ctx.fill(); }
            else ctx.fillRect(x, y, w, hh);
            ctx.fillStyle = col;
            const q = hh * 0.46;
            ctx.fillRect(x + hh * 0.18, y + (hh - q) / 2, q, q);
            ctx.fillStyle = '#B9C0C8';
            ctx.fillRect(x + hh * 0.18 + q + hh * 0.2, y + hh * 0.3, (w - hh) * (0.45 + 0.4 * hv), Math.max(1, hh * 0.12));
            if (w >= 90) ctx.fillRect(x + hh * 0.18 + q + hh * 0.2, y + hh * 0.58, (w - hh) * (0.3 + 0.4 * hash(wj, i + 3)), Math.max(1, hh * 0.1));
          } else {
            ctx.fillStyle = '#D9DEE4';
            ctx.fillRect(x, y, w, hh);
            ctx.fillStyle = col;
            ctx.fillRect(x, y, Math.max(1, w * 0.28), hh);
          }
        }
      }
      ctx.globalAlpha = 1;
      // traînées de données aspirées vers le cerveau
      if (lt > 9.9) {
        ctx.globalCompositeOperation = 'lighter';
        for (const st of s.streaks) {
          const k = clamp((lt - st.a) / st.d);
          if (k <= 0 || k >= 1) continue;
          const u = E.inQ(k), u2 = E.inQ(Math.max(0, k - 0.12));
          const x1 = 960 + st.x * (1 - u), y1 = 540 + st.y * (1 - u), x2 = 960 + st.x * (1 - u2), y2 = 540 + st.y * (1 - u2);
          const g = ctx.createLinearGradient(x2, y2, x1, y1);
          g.addColorStop(0, 'rgba(255,153,0,0)'); g.addColorStop(1, `rgba(255,214,150,${(0.9 * Math.sin(Math.PI * k)).toFixed(3)})`);
          ctx.strokeStyle = g; ctx.lineWidth = st.w; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x1, y1); ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      // carte centrale (DOM, nette) tant qu'elle est grande
      const cs = sc / S0;
      tf(s.card, { s: cs, o: P(tw, 110, 60, E.lin) * (1 - imp) });
      // voile + textes
      s.veil.style.opacity = (0.55 * P(lt, 2.2, 0.8) * (1 - P(lt, 10.0, 0.6))).toFixed(3);
      revealWords(s.w1, lt, 2.6, { st: 0.08, dy: 50 });
      const q1 = P(lt, 6.1, 0.5, E.inC); tf(s.tx1, { y: -40 * q1, o: 1 - q1, b: 10 * q1 });
      revealWords(s.w2, lt, 7.25, { st: 0.1, dy: 50 });
      const q2 = P(lt, 9.9, 0.5, E.inC); tf(s.tx2, { y: -40 * q2, o: 1 - q2, b: 10 * q2 });
      // halo « ce que tu peux lire aujourd'hui »
      const hk = P(lt, 6.6, 0.8, E.outQu) * (1 - P(lt, 9.9, 0.5));
      const R = HALO.r * (0.6 + 0.4 * hk);
      s.spot.style.background = `radial-gradient(circle at ${HALO.x}px ${HALO.y}px, rgba(10,15,22,0) ${R.toFixed(1)}px, rgba(10,15,22,${(0.78 * hk).toFixed(3)}) ${(R + 26).toFixed(1)}px)`;
      tf(s.ring, { s: 0.6 + 0.4 * hk, o: hk });
      vis(s.rl, lt, 7.0, 10.3, { dx: -16, dy: 0, blur: 6, dout: 0.5 });
      // implosion vers le futur cerveau
      tf(s.seed, { s: P(lt, 10.9, 1.5, E.outQu) * (1 + 0.1 * Math.sin(lt * 6)), o: P(lt, 10.9, 0.6) });
    },
  });
  // ---------------------------------------------------------------- 4. Révélation
  const TILE_POS = [[-600, 0], [-300, -265], [300, -265], [600, 0], [300, 265], [-300, 265]];
  scene({
    id: 'reveal', t0: TL.reveal[0], t1: TL.reveal[1], cls: 'dark',
    css: `
    #sc-reveal{background:${NAVY_BG};perspective:1800px;perspective-origin:50% 40%}
    #sc-reveal .rv-c{position:absolute;left:960px;top:540px}
    #sc-reveal svg.rv-lines{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
    #sc-reveal .pt{position:absolute;left:0;top:0;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:#FFD08A;box-shadow:0 0 12px 4px rgba(255,150,50,.75)}
    #sc-reveal .flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(255,226,180,.95),rgba(255,140,40,.35) 30%,rgba(0,0,0,0) 65%);opacity:0}
    #sc-reveal .rv-title{position:absolute;left:0;right:0;top:300px;text-align:center;font-weight:700;font-size:180px;line-height:1;color:#fff;letter-spacing:.14em;padding-left:.14em}
    #sc-reveal .rv-sm{position:absolute;left:610px;top:500px;width:780px;filter:drop-shadow(0 0 16px rgba(255,153,0,.85)) drop-shadow(0 0 50px rgba(255,120,0,.4))}
    #sc-reveal .rv-sub{position:absolute;left:0;right:0;top:752px;text-align:center;font-size:38px;color:#A6AFBA;letter-spacing:-.015em}
    #sc-reveal .rv-pill{position:absolute;left:0;right:0;top:838px;display:flex;justify-content:center;align-items:center;gap:26px}
    #sc-reveal .rv-pill i{width:1px;height:34px;background:rgba(255,255,255,.25)}
    #sc-reveal .rv-pill span{display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 22px;border-radius:999px;border:1px solid rgba(255,255,255,.18);font:500 17px Plex,monospace;letter-spacing:.16em;text-transform:uppercase;color:#E6E9ED;background:rgba(255,255,255,.04)}
    #sc-reveal .rv-app{position:absolute;left:160px;top:75px;transform-origin:52% 26%}
    #sc-reveal .rv-floor{position:absolute;left:260px;right:260px;top:620px;height:520px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,130,40,.38),rgba(255,130,40,0));filter:blur(30px)}
    `,
    build(el, s) {
      el.innerHTML = `<div class="rv-floor"></div><svg class="rv-lines"></svg><div class="rv-tiles"></div><div class="rv-pts"></div>
        <div class="rv-c">${orb(210)}</div><div class="flash"></div>
        <div class="rv-title">J.A.R.V.I.S.</div><div class="rv-sm">${BRAND.smile(780)}</div><div class="rv-sub">One AI brain for the Programmatic Solutions Consultant.</div>
        <div class="rv-pill">${BRAND.logo(150)}<i></i><span>${ic('sparkles', 18)} Powered by Kiro</span></div>
        <div class="rv-app">${appMock()}</div>`;
      s.orb = $('.orb', el); s.flash = $('.flash', el); s.title = $('.rv-title', el); s.sub = $('.rv-sub', el); s.pill = $('.rv-pill', el);
      s.app = $('.rv-app', el); s.floor = $('.rv-floor', el); s.rvsm = $('.rv-sm', el);
      cue('smile', s.t0 + 7.0);
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
      const shrink = lerp(1, 0.42 / 1.18, toTop);
      const orbOut = P(lt, 10.4, 0.7, E.inC);
      tf(s.orb, { s: grow * pulse * shrink, y: -340 * toTop - 60 * orbOut, o: P(lt, 0.2, 0.8) * (1 - orbOut) });
      // le smile se dessine sous le nom, comme une signature
      const dw = P(lt, 7.0, 0.95, E.outQu);
      const smOut = P(lt, 10.35, 0.7, E.inC);
      s.rvsm.style.clipPath = `inset(-30% ${(100 - 100 * dw).toFixed(2)}% -30% 0)`;
      tf(s.rvsm, { y: -90 * smOut, o: 1 - smOut, b: 10 * smOut });
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
