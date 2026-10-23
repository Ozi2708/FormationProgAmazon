/* Pitch 2:00 — acte 1 : logo, 9:00, tempête (l'horloge file), avalanche, révélation, « comment ça marche » */
(function () {
  'use strict';
  const { E, P, tf, vis, splitWords, revealWords, rng, ic, $, $$, scene, clamp, lerp, orb, orbTick, SOURCES, tile, cue } = J;
  const BP = BRAND.paths;
  const NAVY_BG = 'radial-gradient(1400px 900px at 50% 52%,#1E2A3A 0%,#111923 58%,#0A0F16 100%)';
  const OY = 560; // hauteur du cerveau (révélation → schéma)

  // ---------------------------------------------------------------- logo Amazon Ads
  scene({
    id: 'logo', t0: TL.logo[0], t1: TL.logo[1], cls: 'black', fin: 0,
    css: `
    #sc-logo .lw{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
    #sc-logo .lg{position:relative;width:600px;height:${Math.round(600 * BRAND.LOGO_RATIO)}px}
    #sc-logo .lg svg{position:absolute;left:0;top:0;width:600px;overflow:visible}
    #sc-logo .ls{filter:drop-shadow(0 0 18px rgba(255,153,0,.55))}
    #sc-logo .lsub{margin-top:46px;font:500 19px Plex,monospace;letter-spacing:.32em;text-transform:uppercase;color:#8D98A6}`,
    build(el, s) {
      el.innerHTML = `<div class="lw"><div class="lg"><svg class="lt" viewBox="${BP.LOGO_VB}"><path d="${BP.LOGO_TEXT}" fill="#fff" fill-rule="evenodd"/></svg>
        <svg class="ls" viewBox="${BP.LOGO_VB}"><path d="${BP.LOGO_SMILE}" fill="#FF9900"/></svg></div><div class="lsub">Programmatic Solutions · France</div></div>`;
      s.lt = $('.lt', el); s.ls = $('.ls', el); s.sub = $('.lsub', el); s.lw = $('.lw', el);
      cue('logo', s.t0 + 0.55);
    },
    update(lt, dur, s) {
      vis(s.lt, lt, 0.1, Infinity, { dy: 18, blur: 16, din: 0.9 });
      const d = P(lt, 0.5, 0.7, E.outQu);
      s.ls.style.clipPath = `inset(-30% ${(100 - 100 * d).toFixed(2)}% -30% 0)`;
      vis(s.sub, lt, 0.8, Infinity, { dy: 12, blur: 6 });
      const q = P(lt, dur - 0.65, 0.65, E.inC);
      tf(s.lw, { s: 1 + 0.06 * P(lt, 0, dur, E.lin) + 0.1 * q, o: 1 - q, b: 12 * q });
    },
  });

  // ---------------------------------------------------------------- 9:00
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
      color:#fff;font-size:46px;font-weight:700;letter-spacing:-.03em;display:grid;place-items:center;box-shadow:0 18px 50px rgba(229,48,30,.45)}`,
    build(el, s) {
      el.innerHTML = `<div class="o-wrap"><div class="o-k">A Programmatic Solutions Consultant's day</div>
        <div class="o-time"><span>8:</span><span class="o-mm"><span>59</span><span>00</span></span><span class="o-ap">AM</span><div class="o-badge">1</div></div></div>`;
      s.k = $('.o-k', el); s.time = $('.o-time', el); s.mm = $('.o-mm', el); s.h = $('.o-time > span', el);
      s.badge = $('.o-badge', el); s.wrap = $('.o-wrap', el);
      s.steps = [[1.4, 1], [1.62, 4], [1.82, 12], [2.0, 27], [2.16, 48], [2.3, 73], [2.44, 99]];
      for (let k = 0; k < 3; k++) cue('clocktick', s.t0 + 0.25 + k * 0.32, { n: k });
      cue('click', s.t0 + 0.95);
      s.steps.forEach(([a]) => cue('ping', s.t0 + a, { v: 0.6 }));
      cue('whoosh', s.t0 + 2.75, { v: 0.6 });
    },
    update(lt, dur, s) {
      vis(s.k, lt, 0.1, Infinity, { dy: 14, blur: 6 });
      vis(s.time, lt, 0.2, Infinity, { dy: 50, blur: 24, ds: 0.06, din: 1.0 });
      const roll = P(lt, 0.95, 0.42, E.ioQ);
      for (const sp of s.mm.children) sp.style.transform = `translateY(${-104 * roll}%)`;
      s.h.textContent = roll > 0.5 ? '9:' : '8:';
      let n = 0, last = -9;
      for (const [a, v] of s.steps) if (lt >= a) { n = v; last = a; }
      s.badge.textContent = n >= 99 ? '99+' : n;
      const pop = lt - last;
      const ps = n ? 1 + 0.28 * Math.exp(-pop * 9) * Math.cos(pop * 18) : 0;
      tf(s.badge, { s: n ? ps * P(lt, 1.4, 0.25, E.outB) : 0, o: n ? 1 : 0 });
      const q = P(lt, 2.5, 0.5, E.inC);
      tf(s.wrap, { s: 1 + 0.5 * q, o: 1 - q, b: 16 * q });
    },
  });

  // ---------------------------------------------------------------- tempête : l'horloge file, on rattrape encore
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
  J.NOTES = NOTES; J.NTYPES = TYPES;
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
  const FOCUS = 4.6;

  scene({
    id: 'storm', t0: TL.storm[0], t1: TL.storm[1], cls: 'dark',
    css: `#sc-storm{background:${NAVY_BG}}
    #sc-storm .st-cam{position:absolute;inset:0;perspective:1000px;perspective-origin:50% 50%}
    #sc-storm .clk{position:absolute;left:0;right:0;top:64px;display:flex;flex-direction:column;align-items:center;z-index:200}
    #sc-storm .clk-t{display:flex;align-items:baseline;gap:12px;padding:8px 34px 12px;border-radius:999px;background:rgba(12,18,26,.96);border:1px solid rgba(255,255,255,.16);
      box-shadow:0 0 0 14px rgba(10,15,22,.35),0 24px 80px rgba(0,0,0,.7);font-weight:700;font-size:72px;letter-spacing:-.04em;color:#fff;font-variant-numeric:tabular-nums;line-height:1.1}
    #sc-storm .clk-t em{font-style:normal;font-size:28px;color:#8D98A6;font-weight:600;letter-spacing:0}
    #sc-storm .clk-l{margin-top:16px;padding:8px 16px;border-radius:999px;background:rgba(12,18,26,.94);font:600 18px Plex,monospace;letter-spacing:.24em;text-transform:uppercase;color:#FFB547}` + NC_CSS('#sc-storm'),
    build(el, s) {
      const r = rng(7);
      const LIST = NOTES.concat(NOTES.slice().reverse().slice(0, 28));
      const N = LIST.length;
      s.cards = LIST.map((n, i) => {
        const card = J.h(ncHTML(n));
        let x = (r() * 2 - 1) * 820, y = (r() * 2 - 1) * 440, z = -r() * 1300 - 40;
        if (i === 0) { x = 0; y = 60; z = -150; }
        const ts = i === 0 ? 0.2 : 0.45 + 3.8 * Math.pow(i / N, 0.55);
        if (ts < FOCUS) window.STORM_SPAWNS.push(TL.storm[0] + ts);
        return { el: card, x, y, z, rz: (r() * 2 - 1) * 5, ts, i };
      });
      el.innerHTML = `<div class="st-cam"></div><div class="clk"><div class="clk-t"><span class="clk-v">9:00</span><em>AM</em></div><div class="clk-l">Still catching up…</div></div>`;
      s.cam = $('.st-cam', el); s.clk = $('.clk', el); s.cv = $('.clk-v', el); s.cl = $('.clk-l', el);
      [...s.cards].sort((a, b) => a.z - b.z).forEach(c => s.cam.appendChild(c.el));
      s.cards[0].el.style.zIndex = 50;
      // l'horloge s'emballe : des tics de plus en plus serrés
      for (let a = 0.5, k = 0; a < 4.2; k++) { cue('clocktick', s.t0 + a, { n: k, v: 0.8 }); a += 0.4 - 0.3 * (a - 0.5) / 3.7; }
      cue('freeze', s.t0 + FOCUS);
    },
    update(lt, dur, s) {
      const push = 380 * P(lt, 0, FOCUS + 0.2, E.inQ);
      const foc = P(lt, FOCUS, 1.0, E.ioC);
      for (const c of s.cards) {
        const k = clamp((lt - c.ts) / 0.95);
        if (k <= 0) { c.el.style.visibility = 'hidden'; continue; }
        const e = E.outX(k);
        let z = c.z - 900 * (1 - e) + push + (lt - c.ts) * 40;
        if (c.i === 0) {
          // la carte du départ revient au centre, à plat : elle ouvre l'avalanche
          z = lerp(z, 0, foc);
          c.el.style.setProperty('--dim', '0');
          tf(c.el, { y: c.y * (1 - foc), z, rz: c.rz * (1 - e * 0.6) * (1 - foc), o: E.outC(k) });
          continue;
        }
        const depth = clamp(1 + z / 1700);
        c.el.style.setProperty('--dim', (0.62 * (1 - depth)).toFixed(3));
        tf(c.el, { x: c.x * (1 + 0.25 * foc), y: c.y * (1 + 0.25 * foc), z: z + 200 * foc, rz: c.rz * (1 - e * 0.6), o: E.outC(k) * (1 - foc), b: 10 * foc });
      }
      // 9:00 → 11:48 : la matinée passe à trier
      const m = Math.round(168 * E.inQ(P(lt, 0.5, 3.7, E.lin)));
      const hh = 9 + Math.floor(m / 60), mm = m % 60;
      const txt = `${hh}:${String(mm).padStart(2, '0')}`;
      if (s.cv._t !== txt) { s.cv.textContent = txt; s.cv._t = txt; }
      vis(s.clk, lt, 0.15, FOCUS + 0.35, { dy: -24, blur: 10, din: 0.6 });
      vis(s.cl, lt, 1.4, Infinity, { dy: 10, blur: 6 });
    },
  });

  // ---------------------------------------------------------------- avalanche : une carte parmi des milliers
  const TW = 200, TH = 46, GX = 210, GY = 56, S0 = 2.25, SMIN = 0.068;
  const TCOL = ['#2F6FDE', '#9446BF', '#E5533D', '#FF9900', '#CF3F37', '#D99A16', '#16947E'];
  const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const HALO = { x: 1190, y: 700, r: 92 };
  scene({
    id: 'flood', t0: TL.flood[0], t1: TL.flood[1], cls: 'dark',
    css: `#sc-flood{background:${NAVY_BG}}
    #sc-flood canvas{position:absolute;left:0;top:0;width:1920px;height:1080px}
    #sc-flood .veil{position:absolute;inset:0;background:radial-gradient(1100px 600px at 50% 46%,rgba(10,15,22,.72),rgba(10,15,22,.25))}
    #sc-flood .spot{position:absolute;inset:0}
    #sc-flood .ring{position:absolute;left:${HALO.x - HALO.r}px;top:${HALO.y - HALO.r}px;width:${HALO.r * 2}px;height:${HALO.r * 2}px;border-radius:50%;border:2.5px solid #FF9900;box-shadow:0 0 30px rgba(255,153,0,.6),inset 0 0 20px rgba(255,153,0,.35)}
    #sc-flood .rl{position:absolute;left:${HALO.x + HALO.r + 26}px;top:${HALO.y - 12}px;font:600 17px Plex,monospace;letter-spacing:.2em;text-transform:uppercase;color:#FFB547;white-space:nowrap}
    #sc-flood .rl::before{content:"";position:absolute;left:-26px;top:11px;width:18px;height:2px;background:#FFB547}
    #sc-flood .tx{position:absolute;left:0;right:0;text-align:center;font-weight:700;font-size:104px;letter-spacing:-.05em;line-height:1.05;color:#fff;text-shadow:0 6px 40px rgba(0,0,0,.6)}
    #sc-flood .t1{top:440px}#sc-flood .t2{top:330px}
    #sc-flood .seed{position:absolute;left:960px;top:${OY}px;width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:50%;background:radial-gradient(circle,#FFE2B0 0%,#FF9900 18%,rgba(255,140,0,.35) 38%,rgba(255,140,0,0) 70%)}
    ` + NC_CSS('#sc-flood'),
    build(el, s) {
      el.innerHTML = `<canvas width="1920" height="1080"></canvas><div class="veil"></div><div class="spot"></div><div class="ring"></div><div class="rl">What you can read today</div>
        ${ncHTML(NOTES[0])}<div class="tx t1">Everything you need is in there.</div><div class="tx t2">No one can read it all.</div><div class="seed"></div>`;
      s.cv = $('canvas', el); s.ctx = s.cv.getContext('2d');
      const rr = rng(21);
      s.streaks = Array.from({ length: 170 }, () => { const a = rr() * Math.PI * 2, r = 650 + rr() * 650; return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.62, a: 5.0 + rr() * 1.4, d: 0.65 + rr() * 0.55, w: 1.2 + rr() * 2.2 }; });
      s.veil = $('.veil', el); s.spot = $('.spot', el); s.ring = $('.ring', el); s.rl = $('.rl', el); s.card = $('.nc', el); s.seed = $('.seed', el);
      s.tx1 = $('.t1', el); s.tx2 = $('.t2', el); s.w1 = splitWords(s.tx1); s.w2 = splitWords(s.tx2);
      cue('zoomout', s.t0 + 0.3, { d: 3.8 }); cue('tex', s.t0 + 0.5, { d: 4.4 }); cue('hit', s.t0 + 3.2, { v: 0.45 });
      // l'implosion se termine sur le flash de la révélation
      cue('implode', s.t0 + 5.1, { d: (TL.reveal[0] + 0.75) - (s.t0 + 5.1) });
    },
    update(lt, dur, s) {
      const zk = E.ioC(P(lt, 0.3, 3.8, E.lin));
      const sc = S0 * Math.exp(Math.log(SMIN / S0) * zk) * (1 - 0.04 * P(lt, 4, 3, E.lin));
      const imp = P(lt, 5.1, 1.8, E.inQ);
      const reveal = P(lt, 0.3, 1.3);
      const drift = (lt - 1.2) * P(lt, 1.2, 3, E.inQ);
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
          const w = tw, hh = th;
          let m = 1;
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
      if (lt > 4.9) {
        ctx.globalCompositeOperation = 'lighter';
        for (const st of s.streaks) {
          const k = clamp((lt - st.a) / st.d);
          if (k <= 0 || k >= 1) continue;
          const u = E.inQ(k), u2 = E.inQ(Math.max(0, k - 0.12));
          const x1 = 960 + st.x * (1 - u), y1 = OY + st.y * (1 - u), x2 = 960 + st.x * (1 - u2), y2 = OY + st.y * (1 - u2);
          const g = ctx.createLinearGradient(x2, y2, x1, y1);
          g.addColorStop(0, 'rgba(255,153,0,0)'); g.addColorStop(1, `rgba(255,214,150,${(0.9 * Math.sin(Math.PI * k)).toFixed(3)})`);
          ctx.strokeStyle = g; ctx.lineWidth = st.w; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x1, y1); ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      tf(s.card, { s: sc / S0, o: P(tw, 110, 60, E.lin) * (1 - imp) });
      s.veil.style.opacity = (0.55 * P(lt, 1.2, 0.7) * (1 - P(lt, 4.9, 0.6))).toFixed(3);
      revealWords(s.w1, lt, 1.1, { st: 0.07, dy: 50 });
      const q1 = P(lt, 2.75, 0.45, E.inC); tf(s.tx1, { y: -40 * q1, o: 1 - q1, b: 10 * q1 });
      revealWords(s.w2, lt, 3.2, { st: 0.09, dy: 50 });
      const q2 = P(lt, 4.8, 0.45, E.inC); tf(s.tx2, { y: -40 * q2, o: 1 - q2, b: 10 * q2 });
      // halo « ce que tu peux lire aujourd'hui »
      const hk = P(lt, 3.5, 0.7, E.outQu) * (1 - P(lt, 4.8, 0.45));
      const R = HALO.r * (0.6 + 0.4 * hk);
      s.spot.style.background = `radial-gradient(circle at ${HALO.x}px ${HALO.y}px, rgba(10,15,22,0) ${R.toFixed(1)}px, rgba(10,15,22,${(0.78 * hk).toFixed(3)}) ${(R + 26).toFixed(1)}px)`;
      tf(s.ring, { s: 0.6 + 0.4 * hk, o: hk });
      vis(s.rl, lt, 3.8, 5.2, { dx: -16, dy: 0, blur: 6, dout: 0.45 });
      tf(s.seed, { s: P(lt, 5.8, 1.1, E.outQu) * (1 + 0.1 * Math.sin(lt * 6)), o: P(lt, 5.8, 0.5) });
    },
  });

  // ---------------------------------------------------------------- révélation : le nom, la promesse
  scene({
    id: 'reveal', t0: TL.reveal[0], t1: TL.reveal[1], cls: 'dark',
    css: `
    #sc-reveal{background:${NAVY_BG}}
    #sc-reveal .rv-c{position:absolute;left:960px;top:${OY}px}
    #sc-reveal .flash{position:absolute;inset:0;background:radial-gradient(circle at 50% ${OY}px,rgba(255,226,180,.95),rgba(255,140,40,.35) 30%,rgba(0,0,0,0) 65%);opacity:0}
    #sc-reveal .rv-title{position:absolute;left:0;right:0;top:330px;text-align:center;font-weight:700;font-size:180px;line-height:1;color:#fff;letter-spacing:.14em;padding-left:.14em}
    #sc-reveal .rv-sm{position:absolute;left:610px;top:530px;width:780px;filter:drop-shadow(0 0 16px rgba(255,153,0,.85)) drop-shadow(0 0 50px rgba(255,120,0,.4))}
    #sc-reveal .rv-sub{position:absolute;left:0;right:0;top:782px;text-align:center;font-size:44px;font-weight:500;color:#C9D1DB;letter-spacing:-.02em}
    #sc-reveal .rv-sub b{color:#fff;font-weight:700}
    #sc-reveal .rv-pill{position:absolute;left:0;right:0;top:880px;display:flex;justify-content:center;align-items:center;gap:26px}
    #sc-reveal .rv-pill i{width:1px;height:34px;background:rgba(255,255,255,.25)}
    #sc-reveal .rv-pill span{display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 22px;border-radius:999px;border:1px solid rgba(255,255,255,.18);font:500 17px Plex,monospace;letter-spacing:.16em;text-transform:uppercase;color:#E6E9ED;background:rgba(255,255,255,.04)}
    #sc-reveal .rv-floor{position:absolute;left:260px;right:260px;top:${OY + 80}px;height:520px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,130,40,.3),rgba(255,130,40,0));filter:blur(30px)}`,
    build(el, s) {
      el.innerHTML = `<div class="rv-floor"></div><div class="rv-c">${orb(210)}</div><div class="flash"></div>
        <div class="rv-title">J.A.R.V.I.S.</div><div class="rv-sm">${BRAND.smile(780)}</div>
        <div class="rv-sub">The <b>AI co-pilot</b> of the Programmatic Solutions Consultant.</div>
        <div class="rv-pill">${BRAND.logo(150)}<i></i><span>${ic('sparkles', 18)} Powered by Kiro</span></div>`;
      s.orb = $('.orb', el); s.flash = $('.flash', el); s.title = $('.rv-title', el); s.sub = $('.rv-sub', el); s.pill = $('.rv-pill', el);
      s.rvsm = $('.rv-sm', el); s.floor = $('.rv-floor', el);
      cue('flash', s.t0 + 0.75); cue('smile', s.t0 + 1.55); cue('trans', s.t0 + 5.4, { v: 1.5 });
    },
    update(lt, dur, s, t) {
      const pulse = orbTick(s.orb, t, { glow: 0.9 + 0.5 * Math.exp(-Math.max(0, lt - 0.75) * 3) });
      const kick = lt > 0.75 ? Math.exp(-(lt - 0.75) * 4) : 0;
      const grow = 0.35 + 0.65 * P(lt, 0, 0.8, E.outQi) + 0.25 * kick;
      const toTop = P(lt, 0.95, 1.1, E.outQi), back = P(lt, 5.4, 1.2, E.ioC);
      const shrink = lerp(lerp(1, 0.36, toTop), 1, back);
      tf(s.orb, { s: grow * pulse * shrink, y: -340 * toTop * (1 - back) });
      s.flash.style.opacity = (P(lt, 0.55, 0.2, E.inQ) * (1 - P(lt, 0.75, 0.9, E.outC))).toFixed(3);
      s.floor.style.opacity = (0.4 + 0.6 * back).toFixed(3);
      const ti = P(lt, 0.8, 1.4, E.outQi), tOut = P(lt, 5.3, 0.7, E.inC);
      s.title.style.letterSpacing = `${(0.14 + 0.5 * (1 - ti)).toFixed(4)}em`;
      tf(s.title, { o: P(lt, 0.8, 0.8) * (1 - tOut), b: 24 * (1 - ti) + 12 * tOut, s: 1.06 - 0.06 * ti, y: -90 * tOut });
      const dw = P(lt, 1.55, 0.9, E.outQu);
      s.rvsm.style.clipPath = `inset(-30% ${(100 - 100 * dw).toFixed(2)}% -30% 0)`;
      tf(s.rvsm, { y: -90 * tOut, o: 1 - tOut, b: 10 * tOut });
      vis(s.sub, lt, 2.25, 6.0, { dy: 24, blur: 10, dout: 0.7, dyo: -90 });
      vis(s.pill, lt, 2.8, 6.0, { dy: 20, blur: 8, dout: 0.7, dyo: -90 });
    },
  });

  // ---------------------------------------------------------------- comment ça marche : sources → cerveau → résultats
  const OUTS = [['sun', 'Morning briefing'], ['bell', 'Alerts → tasks'], ['pen-line', 'Emails in your voice'],
    ['calendar-check', 'Meeting preps'], ['presentation', 'Decks & WBR'], ['user', 'Client 360']];
  const ROW = i => 330 + i * 92;
  const XIN = 476, XOUT = 1452;
  const bz = (p0, p1, p2, p3, u) => { const v = 1 - u; return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3; };
  scene({
    id: 'how', t0: TL.how[0], t1: TL.how[1], cls: 'dark',
    css: `
    #sc-how{background:${NAVY_BG}}
    #sc-how .hw{position:absolute;inset:0;transform-origin:960px ${OY}px}
    #sc-how svg.hln{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
    #sc-how .hh{position:absolute;top:128px;width:560px;margin-left:-280px;text-align:center}
    #sc-how .hh .n{font:600 18px Plex,monospace;letter-spacing:.3em;color:#FF9900}
    #sc-how .hh .t{margin-top:12px;font-weight:700;font-size:46px;letter-spacing:-.035em;color:#fff}
    #sc-how .src{position:absolute;left:206px;height:68px;margin-top:-34px;display:flex;align-items:center;gap:18px}
    #sc-how .src .tile{position:relative;margin:0}
    #sc-how .src .tile-name{display:none}
    #sc-how .src b{font-size:24px;font-weight:600;color:#E9ECF0;letter-spacing:-.01em}
    #sc-how .out{position:absolute;left:${XOUT}px;width:300px;height:66px;margin-top:-33px;display:flex;align-items:center;gap:14px;padding:0 18px 0 11px;border-radius:18px;
      background:rgba(255,255,255,.06);border:1.5px solid rgba(255,153,0,.38);color:#fff;font-size:21px;font-weight:600;letter-spacing:-.01em}
    #sc-how .out .oi{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(160deg,#FFB547,#F57C00);color:#fff;flex:none}
    #sc-how .ow{position:absolute;left:960px;top:${OY}px}
    #sc-how .ol{position:absolute;left:610px;width:700px;top:${OY + 134}px;text-align:center;white-space:nowrap}
    #sc-how .ol b{display:block;font-size:24px;font-weight:700;color:#fff}
    #sc-how .ol span{font:500 14px Plex,monospace;letter-spacing:.12em;text-transform:uppercase;color:#98A1AC}
    #sc-how .pt{position:absolute;left:0;top:0;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:#FFD08A;box-shadow:0 0 12px 4px rgba(255,150,50,.75)}
    #sc-how .bl{position:absolute;left:0;right:0;top:902px;text-align:center;font-weight:700;font-size:58px;letter-spacing:-.04em;color:#fff}
    #sc-how .floor{position:absolute;left:560px;width:800px;top:${OY - 200}px;height:400px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,130,40,.22),rgba(255,130,40,0));filter:blur(20px)}
    #sc-how .wipe{position:absolute;inset:0;background:radial-gradient(1500px 1000px at 72% 46%,#FFFFFF 0%,#F7F4EF 42%,#ECE6DC 100%);clip-path:circle(0px at 960px ${OY}px)}`,
    build(el, s) {
      el.innerHTML = `<div class="hw"><div class="floor"></div><svg class="hln"></svg>
        <div class="hh" style="left:342px"><div class="n">01</div><div class="t">Reads everything.</div></div>
        <div class="hh" style="left:960px"><div class="n">02</div><div class="t">Knows what matters.</div></div>
        <div class="hh" style="left:1602px"><div class="n">03</div><div class="t">Does the work.</div></div>
        ${SOURCES.map((src, i) => `<div class="src" style="top:${ROW(i)}px">${tile(src, 68)}<b>${src.name}</b></div>`).join('')}
        ${OUTS.map((o, i) => `<div class="out" style="top:${ROW(i)}px"><div class="oi">${ic(o[0], 22)}</div>${o[1]}</div>`).join('')}
        <div class="pts"></div><div class="ow">${orb(210)}</div>
        <div class="ol"><b>One AI brain</b><span>your style · your clients · your campaigns</span></div>
        <div class="bl">One brain. <span class="hl">One platform.</span></div></div><div class="wipe"></div>`;
      s.hw = $('.hw', el); s.orb = $('.orb', el); s.ol = $('.ol', el); s.hh = $$('.hh', el); s.src = $$('.src', el); s.out = $$('.out', el);
      s.bl = $('.bl', el); s.bw = splitWords(s.bl); s.wipe = $('.wipe', el); s.floor = $('.floor', el);
      const svg = $('svg.hln', el), pts = $('.pts', el);
      const mk = (d, stroke) => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', stroke); p.setAttribute('stroke-width', '2'); svg.appendChild(p); const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; return { p, len }; };
      // entrées : de chaque source vers le cerveau · sorties : du cerveau vers chaque résultat
      s.ins = SOURCES.map((_, i) => { const y = ROW(i); const c = { x: [XIN, 680, 780, 960], y: [y, y, OY, OY] };
        return Object.assign(mk(`M${XIN},${y} C680,${y} 780,${OY} 960,${OY}`, 'rgba(255,170,90,.36)'), c, { ps: [0, 1, 2].map(() => { const d = J.h('<div class="pt"></div>'); pts.appendChild(d); return d; }) }); });
      s.outs = OUTS.map((_, i) => { const y = ROW(i); const c = { x: [960, 1140, 1250, XOUT], y: [OY, OY, y, y] };
        return Object.assign(mk(`M960,${OY} C1140,${OY} 1250,${y} ${XOUT},${y}`, 'rgba(255,170,90,.5)'), c, { ps: [0, 1].map(() => { const d = J.h('<div class="pt"></div>'); pts.appendChild(d); return d; }) }); });
      SOURCES.forEach((_, i) => cue('pop', s.t0 + 0.45 + i * 0.12, { v: 0.4 }));
      cue('data', s.t0 + 1.3, { d: 5.6 }); cue('hit', s.t0 + 2.4, { v: 0.4 }); cue('sparkle', s.t0 + 2.5);
      OUTS.forEach((_, i) => cue('pop', s.t0 + 3.4 + i * 0.16, { v: 0.45 }));
      cue('success', s.t0 + 4.5, { v: 0.5 }); cue('hit', s.t0 + 5.3, { v: 0.5 }); cue('open', s.t0 + 8.25);
    },
    update(lt, dur, s, t) {
      // 01 · les sources arrivent et se branchent
      s.hh.forEach((h, i) => vis(h, lt, [0.25, 1.9, 3.1][i], Infinity, { dy: 20, blur: 8 }));
      s.src.forEach((el, i) => vis(el, lt, 0.4 + i * 0.12, Infinity, { dx: -40, dy: 0, blur: 8, din: 0.7 }));
      const flow = (arr, start, dirOut) => arr.forEach((o, i) => {
        const d = P(lt, start + i * 0.08, 0.7, E.ioC);
        o.p.style.strokeDashoffset = (o.len * (1 - d)).toFixed(1);
        o.ps.forEach((pt, j) => {
          const st = start + 0.5;
          if (lt < st) { pt.style.opacity = 0; return; }
          const ph = ((lt - st) * 0.5 + j / o.ps.length + i * 0.13) % 1;
          const u = dirOut ? E.outQ(ph) : E.inQ(ph);
          pt.style.transform = `translate(${bz(...o.x, u).toFixed(1)}px,${bz(...o.y, u).toFixed(1)}px)`;
          pt.style.opacity = (Math.sin(Math.PI * ph) * P(lt, st, 0.5)).toFixed(3);
        });
      });
      flow(s.ins, 0.8, false);
      // 02 · le cerveau s'allume
      const kick = lt > 2.4 ? Math.exp(-(lt - 2.4) * 3) : 0;
      const pulse = orbTick(s.orb, t, { glow: 0.9 + 0.7 * kick + 0.3 * P(lt, 2.4, 2) });
      tf(s.orb, { s: pulse * (1 + 0.12 * kick) });
      vis(s.ol, lt, 2.1, Infinity, { dy: 12, blur: 6 });
      s.floor.style.opacity = (0.6 + 0.4 * P(lt, 2.4, 1.5)).toFixed(3);
      // 03 · les résultats sortent
      flow(s.outs, 3.1, true);
      s.out.forEach((el, i) => {
        const a = 3.4 + i * 0.16;
        vis(el, lt, a, Infinity, { dx: 40, dy: 0, blur: 8, ds: -0.06, din: 0.6, ein: E.outB });
        const g = P(lt, a, 0.3) * (1 - P(lt, a + 0.3, 0.9));
        el.style.boxShadow = g > 0.01 ? `0 0 0 ${(4 * g).toFixed(1)}px rgba(255,153,0,.25), 0 0 ${(40 * g).toFixed(0)}px rgba(255,153,0,${(0.35 * g).toFixed(2)})` : 'none';
      });
      revealWords(s.bw, lt, 5.3, { st: 0.1, dy: 40 });
      // sortie : le schéma recule, la plateforme s'ouvre depuis le cerveau
      const q = P(lt, 7.9, 1.3, E.inQ);
      tf(s.hw, { s: 1 - 0.06 * q, b: 6 * q });
      const R = 2300 * E.ioC(P(lt, 8.25, 1.35, E.lin));
      s.wipe.style.clipPath = `circle(${R.toFixed(1)}px at 960px ${OY}px)`;
    },
  });
})();
