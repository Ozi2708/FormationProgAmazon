/* Film jury v3 — accroche (9:09 AM, tout arrive en même temps) et révélation du logo JARVIS */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, tf, vis, splitWords, revealWords, rng, ic, $, $$, scene, clamp, lerp, cue } = J;
  const NAVY_BG = 'radial-gradient(1400px 900px at 50% 52%,#1E2A3A 0%,#111923 58%,#0A0F16 100%)';
  const OY = 400; // centre du logo de la révélation

  // ---------------------------------------------------------------- 0:00 accroche : 9:09, tout arrive en même temps
  const TYPES = {
    mail: ['Outlook', '#2F6FDE', 'mail'], slack: ['Slack', '#9446BF', 'hash'], cal: ['Calendar', '#E5533D', 'calendar'],
    dsp: ['Amazon DSP', '#F7930F', 'chart-column'], sim: ['SIM', '#CF3F37', 'ticket'], news: ['News DSP', '#D99A16', 'zap'], wbr: ['SharePoint', '#16947E', 'file-text'],
  };
  const NOTES = [
    ['dsp', 'Under-delivery · BFM Notoriété octobre', 'SVOD 2% delivered for 29% of the flight', '06/10'],
    ['mail', 'Brief Boursorama // campagne REBOOT 2026', "Possible de me confirmer les 15% d'added value ?", '09:12'],
    ['slack', 'Léa', 'ouais prisma il faut relancer…', '09:14'],
    ['cal', 'PSC Brainfood Session', '16:00–17:00 · 13 participants · no reply yet', 'now'],
    ['sim', 'P529520879 · No Delivery', 'Assigned · in progress', '09:15'],
    ['news', 'Program Lighthouse', 'PSC-T now owns troubleshooting tickets', 'Dec'],
    ['mail', 'Amazon DSP: Columbia Order Under delivery', 'Thanks for flagging this and for the proposed…', '09:16'],
    ['mail', 'GSEB - DSP inventaire de diffusion offsite', 'Le choix des SSP envoyé par les équipes…', '09:18'],
    ['cal', 'Weekly - Dentsu GAE x Amazon Ads', 'Friday 10:00 · Teams', 'Fri'],
    ['wbr', 'WBR W41 · entries due Thursday', 'Highlights / Lowlights tracker', 'Thu'],
    ['slack', '#psc-fr', "Quelqu'un a le deck Nintendo ?", '09:21'],
    ['mail', 'Nintendo / update', "Je n'avais pas annulé le point de cet après-midi", '09:22'],
    ['dsp', 'Disney Studios · Whalefall', '12% delivered for 25% of the time', '07/10'],
    ['mail', 'Hashed audience CSV: new format?', 'As-tu identifié la personne pour nous mettre en contact ?', '09:24'],
    ['news', 'Streaming TV Plus without Twitch', 'New STV+ bundle · L8 Finance exception', '05/10'],
    ['sim', 'P529341292 · PMP deal not bidding', 'Assigned · 07/10', '09:26'],
    ['cal', 'Total Media Pitch Reveal + Supply Updates', 'Tuesday 9:30 – 11:00', 'Tue'],
    ['mail', 'AMAZON // SPF // Gestes Barrières Oct 2026', 'On garde un œil dessus', '09:29'],
    ['slack', 'Sophie Laurent', 'Le rapport ciblage ado / parents Prime ?', '09:30'],
    ['mail', 'Brief SPF GB // Azerion', 'La catégorie Gouvernement ne peut pas être changée', '09:31'],
    ['dsp', 'GAE SPF · Mois sans tabac', 'M6 at 12%, FTV at 10%: under-delivering', '06/10'],
    ['news', 'VOC tracker · new DSP UI', 'Worldwide rollout on 30/11', 'Nov'],
    ['cal', '1:1 Val / manager', 'Thursday 10:00', 'Thu'],
    ['mail', 'Data Amazon Garage - XPENG', "I'm adding Wicky, the account manager on XPENG", '09:36'],
    ['sim', 'Ad group 582576323137355621', 'TWIG: 50% of bids filtered', '09:37'],
    ['wbr', 'EU PSC Team meeting deck', 'Finalize and rehearse', '9 d'],
    ['mail', 'Amazon x 20th Century Studios : Englouti', 'Je check si ça prend bien demain', '09:40'],
    ['slack', 'Paul', 'Tu peux regarder le pacing Sage ?', '09:41'],
    ['news', 'EU PSC Updates in 5 sentences', 'Waypoint / Express Lane for troubleshooting', '24/08'],
    ['cal', 'Ads Tech Talk: Keeping Your Pipelines Green', '21:00 · 51 participants', 'Wed'],
    ['dsp', 'ENI Plénitude · 0% delivered', 'Creatives blocked by IAS', '07/10'],
    ['mail', 'RMC-BFM x Amazon - Déjeuner', 'Tu aurais le temps pour une invitation à déjeuner ?', '09:47'],
    ['slack', '#ads-dsp-support', 'New thread in #waypoint-escalations', '09:48'],
    ['sim', 'P507521674 · BabyBio Prime line', 'Reopened · waiting on the trader', '09:52'],
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
  const NUMS = [[0.9, `${C.EMAILS_COUNT} emails.`], [1.8, `${C.MEETINGS_COUNT} meetings.`], [2.7, `${C.CAMPAIGNS_COUNT} campaigns.`], [3.8, '<span class="hl">Before 10 AM.</span>']];
  const IMP = 5.9; // les cartes sont aspirées vers le cerveau
  scene({
    id: 'hook', t0: TL.hook[0], t1: TL.hook[1], cls: 'dark', fin: 0,
    css: `#sc-hook{background:${NAVY_BG}}
    #sc-hook .st-cam{position:absolute;inset:0;perspective:1000px;perspective-origin:62% 50%}
    #sc-hook .veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,15,22,.94) 0%,rgba(10,15,22,.86) 38%,rgba(10,15,22,.2) 62%,rgba(10,15,22,0) 75%)}
    #sc-hook .clk{position:absolute;left:120px;top:96px;display:flex;align-items:center;gap:22px;z-index:200}
    #sc-hook .clk-t{display:flex;align-items:baseline;gap:12px;padding:8px 30px 12px;border-radius:999px;background:rgba(12,18,26,.96);border:1px solid rgba(255,255,255,.16);
      box-shadow:0 24px 80px rgba(0,0,0,.7);font-weight:700;font-size:64px;letter-spacing:-.04em;color:#fff;font-variant-numeric:tabular-nums;line-height:1.1}
    #sc-hook .clk-t em{font-style:normal;font-size:28px;color:#8D98A6;font-weight:600;letter-spacing:0}
    #sc-hook .nums{position:absolute;left:120px;top:300px;z-index:150}
    #sc-hook .nm{font-weight:700;font-size:118px;line-height:1.08;letter-spacing:-.05em;color:#fff;text-shadow:0 6px 40px rgba(0,0,0,.6)}
    #sc-hook .seed{position:absolute;left:742px;top:${OY}px;width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:50%;background:radial-gradient(circle,#FFE2B0 0%,#FF9900 18%,rgba(255,140,0,.35) 38%,rgba(255,140,0,0) 70%)}
    ` + NC_CSS('#sc-hook'),
    build(el, s) {
      const r = rng(7);
      const LIST = NOTES.concat(NOTES.slice().reverse().slice(0, 28));
      const N = LIST.length;
      s.cards = LIST.map((n, i) => {
        const card = J.h(ncHTML(n));
        const x = 260 + (r() * 2 - 1) * 640, y = (r() * 2 - 1) * 440, z = -r() * 1300 - 40;
        const ts = 0.15 + 4.6 * Math.pow(i / N, 0.55);
        if (ts < IMP) window.STORM_SPAWNS.push(TL.hook[0] + ts);
        return { el: card, x, y, z, rz: (r() * 2 - 1) * 5, ts, i };
      });
      el.innerHTML = `<div class="st-cam"></div><div class="veil"></div>
        <div class="clk"><div class="clk-t"><span class="clk-v">9:09</span><em>AM</em></div></div>
        <div class="nums">${NUMS.map(n => `<div class="nm">${n[1]}</div>`).join('')}</div><div class="seed"></div>`;
      s.cam = $('.st-cam', el); s.clk = $('.clk', el); s.cv = $('.clk-v', el); s.veil = $('.veil', el); s.seed = $('.seed', el);
      s.nmEl = $$('.nm', el); s.nm = s.nmEl.map(n => splitWords(n));
      [...s.cards].sort((a, b) => a.z - b.z).forEach(c => s.cam.appendChild(c.el));
      // l'horloge file : des tics de plus en plus serrés
      for (let a = 0.5, k = 0; a < 5.4; k++) { cue('clocktick', s.t0 + a, { n: k, v: 0.7 }); a += 0.42 - 0.3 * (a - 0.5) / 4.9; }
      NUMS.forEach((n, i) => cue('hit', s.t0 + n[0], { v: i === 3 ? 0.6 : 0.32 }));
      // l'implosion se termine sur le flash de la révélation
      cue('implode', s.t0 + IMP, { d: (TL.reveal[0] + 0.5) - (s.t0 + IMP) });
    },
    update(lt, dur, s) {
      const push = 380 * P(lt, 0, IMP, E.inQ);
      const imp = P(lt, IMP, 1.3, E.inQ);
      for (const c of s.cards) {
        const k = clamp((lt - c.ts) / 0.95);
        if (k <= 0) { c.el.style.visibility = 'hidden'; continue; }
        const e = E.outX(k);
        const z = c.z - 900 * (1 - e) + push + (lt - c.ts) * 40;
        const depth = clamp(1 + z / 1700);
        c.el.style.setProperty('--dim', (0.62 * (1 - depth)).toFixed(3));
        tf(c.el, { x: lerp(c.x, -487, imp), y: lerp(c.y, -224, imp), z: lerp(z, -600, imp), rz: c.rz * (1 - e * 0.6), s: 1 - 0.7 * imp, o: E.outC(k) * (1 - imp), b: 8 * imp });
      }
      const m = 9 + Math.round(49 * E.inQ(P(lt, 0.5, 4.9, E.lin)));
      const txt = `9:${String(m).padStart(2, '0')}`;
      if (s.cv._t !== txt) { s.cv.textContent = txt; s.cv._t = txt; }
      vis(s.clk, lt, 0.1, IMP + 0.3, { dy: -20, blur: 10, din: 0.6 });
      s.veil.style.opacity = (P(lt, 0.6, 0.6) * (1 - P(lt, IMP, 0.6))).toFixed(3);
      NUMS.forEach((n, i) => {
        revealWords(s.nm[i], lt, n[0], { st: 0.07, dy: 50 });
        const q = P(lt, IMP - 0.1, 0.5, E.inC);
        tf(s.nmEl[i], { y: -30 * q, o: 1 - q, b: 10 * q });
      });
      tf(s.seed, { s: P(lt, IMP + 0.5, 1.6, E.outQu) * (1 + 0.1 * Math.sin(lt * 6)), o: P(lt, IMP + 0.5, 0.6) });
    },
  });

  // ---------------------------------------------------------------- 0:08 révélation : le logo JARVIS se dessine, puis rejoint sa place dans la plateforme
  // le bloc logo + nom est la barre latérale agrandie 5 fois : en réduisant, il tombe pile sur celui de l'interface
  const LK = { x: 642, y: 300, k: 5 }, SB = { x: 24 * 0.96, y: 26 * 0.96, s: 0.96 / 5 };
  scene({
    id: 'reveal', t0: TL.reveal[0], t1: TL.reveal[1], cls: 'dark',
    css: `
    #sc-reveal{background:${NAVY_BG}}
    #sc-reveal .flash{position:absolute;inset:0;background:radial-gradient(circle at 742px ${OY}px,rgba(255,226,180,.95),rgba(255,140,40,.35) 30%,rgba(0,0,0,0) 65%);opacity:0}
    #sc-reveal .glow{position:absolute;left:${LK.x + 100 - 400}px;top:${LK.y + 110 - 400}px;width:800px;height:800px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,153,0,.26),rgba(255,153,0,0))}
    #sc-reveal .lk{position:absolute;left:${LK.x}px;top:${LK.y}px;display:flex;align-items:center;gap:55px;transform-origin:0 0}
    #sc-reveal .lk .lw{width:200px;height:200px}
    #sc-reveal .lk b{display:block;font-family:InterTight;font-weight:800;font-size:110px;letter-spacing:-.01em;color:#fff;line-height:1}
    #sc-reveal .lk .amz-logo{margin-top:20px}
    #sc-reveal .l1{position:absolute;left:0;right:0;top:620px;text-align:center;font-family:InterTight;font-weight:800;font-size:84px;letter-spacing:-.04em;color:#fff}
    #sc-reveal .l2{position:absolute;left:0;right:0;top:740px;text-align:center;font-size:40px;font-weight:500;color:#C9D1DB;letter-spacing:-.02em}
    #sc-reveal .l2 b{color:#FFB547;font-weight:650}`,
    build(el, s) {
      el.innerHTML = `<div class="glow"></div><div class="flash"></div>
        <div class="lk"><div class="lw">${J.jarvisLogo(200)}</div><div class="tx"><b>JARVIS</b>${BRAND.logo(350)}</div></div>
        <div class="l1">Your day, <span class="hl">read and ranked.</span></div>
        <div class="l2">Mail, Slack, the DSP report, your agenda: <b>ready by 08:00.</b></div>`;
      s.flash = $('.flash', el); s.glow = $('.glow', el); s.lk = $('.lk', el); s.lw = $('.lw', el); s.tx = $('.lk .tx', el);
      s.v = $('.jl-v', el); s.tip = $('.jl-tip', el); s.disc = $$('.jlogo > circle', el);
      s.vlen = s.v.getTotalLength(); s.v.style.strokeDasharray = s.vlen;
      s.l1 = $('.l1', el); s.w1 = splitWords(s.l1); s.l2 = $('.l2', el);
      cue('flash', s.t0 + 0.5); cue('smile', s.t0 + 1.0); cue('pop', s.t0 + 1.75, { v: 0.6 }); cue('hit', s.t0 + 2.0, { v: 0.4 }); cue('trans', s.t0 + 4.9, { v: 1.3 });
    },
    update(lt, dur, s) {
      s.flash.style.opacity = (P(lt, 0.3, 0.2, E.inQ) * (1 - P(lt, 0.5, 0.9, E.outC))).toFixed(3);
      // le disque apparaît, le V orange se trace, sa pointe tombe
      const g = P(lt, 0.45, 0.8, E.outB);
      tf(s.lw, { s: 0.4 + 0.6 * g, o: P(lt, 0.45, 0.3) });
      s.v.style.strokeDashoffset = (s.vlen * (1 - P(lt, 0.9, 0.8, E.ioC))).toFixed(1);
      tf(s.tip, { o: P(lt, 1.65, 0.25), y: -14 * (1 - P(lt, 1.65, 0.35, E.outB)) });
      vis(s.tx, lt, 1.7, Infinity, { dx: -40, dy: 0, blur: 12 });
      // le bloc rejoint la barre latérale de la plateforme
      const m = P(lt, 4.9, 1.35, E.ioC);
      tf(s.lk, { x: (SB.x - LK.x) * m, y: (SB.y - LK.y) * m, s: 1 + (SB.s - 1) * m });
      tf(s.glow, { o: (0.6 + 0.4 * P(lt, 0.5, 1)) * (1 - m), s: 0.8 + 0.2 * P(lt, 0.5, 1.2) });
      revealWords(s.w1, lt, 2.3, { st: 0.1, dy: 40 });
      const q = P(lt, 4.7, 0.5, E.inC);
      tf(s.l1, { y: 40 * q, o: 1 - q, b: 10 * q });
      vis(s.l2, lt, 3.0, 5.2, { dy: 20, blur: 8, dyo: 40 });
    },
  });
})();
