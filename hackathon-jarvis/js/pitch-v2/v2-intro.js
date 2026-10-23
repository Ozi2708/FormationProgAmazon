/* Film jury v2 — accroche (9:09 AM), révélation (second brain), schéma « How it works » */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, tf, vis, splitWords, revealWords, rng, ic, $, $$, scene, clamp, lerp, orb, orbTick, SOURCES, tile, cue } = J;
  const A = J.anon;
  const NAVY_BG = 'radial-gradient(1400px 900px at 50% 52%,#1E2A3A 0%,#111923 58%,#0A0F16 100%)';
  const OY = 560; // hauteur du cerveau (révélation → schéma)

  // ---------------------------------------------------------------- 0:00 accroche : 9:09, tout arrive en même temps
  const TYPES = {
    mail: ['Outlook', '#2F6FDE', 'mail'], slack: ['Slack', '#9446BF', 'hash'], cal: ['Calendar', '#E5533D', 'calendar'],
    dsp: ['Amazon DSP', '#F7930F', 'chart-column'], sim: ['SIM', '#CF3F37', 'ticket'], news: ['News DSP', '#D99A16', 'zap'], wbr: ['SharePoint', '#16947E', 'file-text'],
  };
  const NOTES = [
    ['dsp', 'Under-delivery · BFM Notoriété octobre', 'SVOD 2% delivered for 29% of the flight', '06/10'],
    ['mail', 'Brief Boursorama // campagne REBOOT 2026', "Possible de me confirmer les 15% d'added value ?", '09:12'],
    ['slack', 'Léa Huguet', 'ouais prisma il faut relancer…', '09:14'],
    ['cal', 'PSC Brainfood Session', '16:00–17:00 · 13 participants · no reply yet', 'now'],
    ['sim', 'P529520879 · No Delivery', 'Assigned to linfun · in progress', '09:15'],
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
    ['sim', 'P529341292 · PMP deal not bidding', 'Assigned to jabizaki · 07/10', '09:26'],
    ['cal', 'Total Media Pitch Reveal + Supply Updates', 'Tuesday 9:30 – 11:00', 'Tue'],
    ['mail', 'AMAZON // SPF // Gestes Barrières Oct 2026', 'On garde un œil dessus', '09:29'],
    ['slack', 'France Martin', 'Le rapport ciblage ado / parents Prime ?', '09:30'],
    ['mail', 'Brief SPF GB // Azerion', 'La catégorie Gouvernement ne peut pas être changée', '09:31'],
    ['dsp', 'GAE SPF · Mois sans tabac', 'M6 at 12%, FTV at 10%: under-delivering', '06/10'],
    ['news', 'VOC tracker · new DSP UI', 'Worldwide rollout on 30/11', 'Nov'],
    ['cal', '1:1 Val / Steph', 'Thursday 10:00', 'Thu'],
    ['mail', 'Data Amazon Garage - XPENG', "I'm adding Wicky, the account manager on XPENG", '09:36'],
    ['sim', 'Ad group 582576323137355621', 'TWIG: 50% of bids filtered', '09:37'],
    ['wbr', 'EU PSC Team meeting deck', 'Finalize and rehearse with Diane', '9 d'],
    ['mail', 'Amazon x 20th Century Studios : Englouti', 'Je check si ça prend bien demain', '09:40'],
    ['slack', 'Raphaël', 'Tu peux regarder le pacing Sage ?', '09:41'],
    ['news', 'EU PSC Updates in 5 sentences', 'Waypoint / Express Lane for troubleshooting', '24/08'],
    ['cal', 'Ads Tech Talk: Keeping Your Pipelines Green', '21:00 · 51 participants', 'Wed'],
    ['dsp', 'ENI Plénitude · 0% delivered', 'Creatives blocked by IAS', '07/10'],
    ['mail', 'RMC-BFM x Amazon - Déjeuner', 'Tu aurais le temps pour une invitation à déjeuner ?', '09:47'],
    ['slack', '#ads-dsp-support', 'New thread in #waypoint-escalations', '09:48'],
    ['sim', 'P507521674 · BabyBio Prime line', 'Reopened · waiting on Raph', '09:52'],
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
    #sc-hook .seed{position:absolute;left:960px;top:${OY}px;width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:50%;background:radial-gradient(circle,#FFE2B0 0%,#FF9900 18%,rgba(255,140,0,.35) 38%,rgba(255,140,0,0) 70%)}
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
        tf(c.el, { x: lerp(c.x, -300, imp), y: c.y * (1 - imp), z: lerp(z, -600, imp), rz: c.rz * (1 - e * 0.6), s: 1 - 0.7 * imp, o: E.outC(k) * (1 - imp), b: 8 * imp });
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

  // ---------------------------------------------------------------- 0:08 révélation : J.A.R.V.I.S., ton second cerveau
  scene({
    id: 'reveal', t0: TL.reveal[0], t1: TL.reveal[1], cls: 'dark',
    css: `
    #sc-reveal{background:${NAVY_BG}}
    #sc-reveal .rv-c{position:absolute;left:960px;top:${OY}px}
    #sc-reveal .flash{position:absolute;inset:0;background:radial-gradient(circle at 50% ${OY}px,rgba(255,226,180,.95),rgba(255,140,40,.35) 30%,rgba(0,0,0,0) 65%);opacity:0}
    #sc-reveal .rv-title{position:absolute;left:0;right:0;top:300px;text-align:center;font-weight:700;font-size:176px;line-height:1;color:#fff;letter-spacing:.14em;padding-left:.14em}
    #sc-reveal .rv-sm{position:absolute;left:620px;top:494px;width:760px;filter:drop-shadow(0 0 16px rgba(255,153,0,.85)) drop-shadow(0 0 50px rgba(255,120,0,.4))}
    #sc-reveal .rv-l1{position:absolute;left:0;right:0;top:716px;text-align:center;font-weight:700;font-size:72px;letter-spacing:-.04em;color:#fff}
    #sc-reveal .rv-l2{position:absolute;left:0;right:0;top:812px;text-align:center;font-size:44px;font-weight:500;color:#C9D1DB;letter-spacing:-.02em}
    #sc-reveal .rv-l2 b{color:#FFB547;font-weight:650}
    #sc-reveal .rv-pill{position:absolute;left:0;right:0;top:912px;display:flex;justify-content:center;align-items:center;gap:26px}
    #sc-reveal .rv-pill i{width:1px;height:34px;background:rgba(255,255,255,.25)}
    #sc-reveal .rv-pill span{display:inline-flex;align-items:center;gap:10px;height:48px;padding:0 22px;border-radius:999px;border:1px solid rgba(255,255,255,.18);font:500 24px Plex,monospace;letter-spacing:.14em;text-transform:uppercase;color:#E6E9ED;background:rgba(255,255,255,.04)}
    #sc-reveal .rv-floor{position:absolute;left:260px;right:260px;top:${OY + 80}px;height:520px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,130,40,.3),rgba(255,130,40,0));filter:blur(30px)}`,
    build(el, s) {
      el.innerHTML = `<div class="rv-floor"></div><div class="rv-c">${orb(210)}</div><div class="flash"></div>
        <div class="rv-title">J.A.R.V.I.S.</div><div class="rv-sm">${BRAND.smile(760)}</div>
        <div class="rv-l1">Your second brain.</div>
        <div class="rv-l2">It <b>reads</b>, <b>remembers</b>, and <b>acts</b>.</div>
        <div class="rv-pill">${BRAND.logo(150)}<i></i><span>${ic('sparkles', 18)} Powered by Kiro</span></div>`;
      s.orb = $('.orb', el); s.flash = $('.flash', el); s.title = $('.rv-title', el); s.l1 = $('.rv-l1', el); s.l2 = $('.rv-l2', el); s.pill = $('.rv-pill', el);
      s.w1 = splitWords(s.l1); s.rvsm = $('.rv-sm', el); s.floor = $('.rv-floor', el);
      cue('flash', s.t0 + 0.5); cue('smile', s.t0 + 1.3); cue('trans', s.t0 + 5.0, { v: 1.5 });
    },
    update(lt, dur, s, t) {
      const pulse = orbTick(s.orb, t, { glow: 0.9 + 0.5 * Math.exp(-Math.max(0, lt - 0.5) * 3) });
      const kick = lt > 0.5 ? Math.exp(-(lt - 0.5) * 4) : 0;
      const grow = 0.35 + 0.65 * P(lt, 0, 0.55, E.outQi) + 0.25 * kick;
      const toTop = P(lt, 0.7, 1.1, E.outQi), back = P(lt, 5.0, 1.1, E.ioC);
      tf(s.orb, { s: grow * pulse * lerp(lerp(1, 0.36, toTop), 1, back), y: -350 * toTop * (1 - back) });
      s.flash.style.opacity = (P(lt, 0.3, 0.2, E.inQ) * (1 - P(lt, 0.5, 0.9, E.outC))).toFixed(3);
      s.floor.style.opacity = (0.4 + 0.6 * back).toFixed(3);
      const ti = P(lt, 0.55, 1.3, E.outQi), tOut = P(lt, 4.9, 0.6, E.inC);
      s.title.style.letterSpacing = `${(0.14 + 0.5 * (1 - ti)).toFixed(4)}em`;
      tf(s.title, { o: P(lt, 0.55, 0.7) * (1 - tOut), b: 24 * (1 - ti) + 12 * tOut, s: 1.06 - 0.06 * ti, y: -90 * tOut });
      s.rvsm.style.clipPath = `inset(-30% ${(100 - 100 * P(lt, 1.3, 0.9, E.outQu)).toFixed(2)}% -30% 0)`;
      tf(s.rvsm, { y: -90 * tOut, o: 1 - tOut, b: 10 * tOut });
      revealWords(s.w1, lt, 2.0, { st: 0.1, dy: 40 });
      tf(s.l1, { y: -90 * tOut, o: 1 - tOut, b: 10 * tOut });
      vis(s.l2, lt, 2.6, 5.6, { dy: 24, blur: 10, dout: 0.6, dyo: -90 });
      vis(s.pill, lt, 3.2, 5.6, { dy: 20, blur: 8, dout: 0.6, dyo: -90 });
    },
  });

  // ---------------------------------------------------------------- 0:14 How it works : Sources → Connectors → Memory → Agents → You approve
  const COLS = [230, 590, 960, 1330, 1700];
  const HEAD = ['Sources', 'Connectors', 'Memory', 'Agents', 'You approve'];
  const SRC_Y = i => 330 + i * 92;
  const AG = [['sun', 'Briefing'], ['trending-up', 'Pacing'], ['pen-line', 'Drafting'], ['calendar-check', 'Meeting prep'], ['presentation', 'Decks']];
  const AG_Y = i => 360 + i * 100;
  const MEM = [['pen-line', 'Your style'], ['users', 'Your clients'], ['clock', 'Your history']];
  const GX0 = 446, GX1 = 734, AX0 = 1186, AX1 = 1474, VX = 1546;
  const bz = (p, u) => { const v = 1 - u; return v * v * v * p[0] + 3 * v * v * u * p[1] + 3 * v * u * u * p[2] + u * u * u * p[3]; };
  scene({
    id: 'how', t0: TL.how[0], t1: TL.how[1], cls: 'dark',
    css: `
    #sc-how{background:${NAVY_BG}}
    #sc-how .hw{position:absolute;inset:0;transform-origin:960px ${OY}px}
    #sc-how svg.hln{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
    #sc-how .kk{position:absolute;left:96px;top:56px;font:600 28px Plex,monospace;letter-spacing:.24em;text-transform:uppercase;color:#FF9900}
    #sc-how .hh{position:absolute;top:148px;width:340px;margin-left:-170px;text-align:center}
    #sc-how .hh .n{font:600 20px Plex,monospace;letter-spacing:.3em;color:#FF9900}
    #sc-how .hh .t{margin-top:10px;font-weight:700;font-size:40px;letter-spacing:-.03em;color:#fff;white-space:nowrap}
    #sc-how .src{position:absolute;left:96px;height:64px;margin-top:-32px;display:flex;align-items:center;gap:18px}
    #sc-how .src .tile{position:relative;margin:0}
    #sc-how .src .tile-name{display:none}
    #sc-how .src b{font-size:28px;font-weight:600;color:#E9ECF0;letter-spacing:-.01em;white-space:nowrap}
    #sc-how .grp{position:absolute;left:${GX0}px;top:404px;width:${GX1 - GX0}px;height:318px;border-radius:24px;border:1.5px dashed rgba(255,170,90,.4);background:rgba(255,255,255,.03)}
    #sc-how .cn{position:absolute;left:${GX0 + 18}px;width:${GX1 - GX0 - 36}px;height:126px;padding:20px 18px;border-radius:18px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14)}
    #sc-how .cn .ci{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:#2B3A4D;color:#FFB547;flex:none}
    #sc-how .cn .cr{display:flex;align-items:center;gap:14px;margin-bottom:8px}
    #sc-how .cn b{display:block;font-size:30px;font-weight:650;color:#fff;letter-spacing:-.01em;white-space:nowrap}
    #sc-how .cn span{font-size:28px;color:#AEB8C4;white-space:nowrap}
    #sc-how .ow{position:absolute;left:960px;top:${OY}px}
    #sc-how .mem{position:absolute;left:760px;width:400px;text-align:center}
    #sc-how .mem div{display:inline-flex;gap:10px;align-items:center;height:48px;padding:0 20px;border-radius:999px;background:rgba(255,153,0,.12);border:1.5px solid rgba(255,153,0,.45);color:#fff;font-size:28px;font-weight:600;white-space:nowrap}
    #sc-how .mem .ic{color:#FFB547}
    #sc-how .ag{position:absolute;left:${AX0}px;width:${AX1 - AX0}px;height:66px;margin-top:-33px;display:flex;align-items:center;gap:14px;padding:0 18px 0 11px;border-radius:18px;
      background:rgba(255,255,255,.06);border:1.5px solid rgba(255,153,0,.38);color:#fff;font-size:28px;font-weight:600;letter-spacing:-.01em;white-space:nowrap}
    #sc-how .ag .oi{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(160deg,#FFB547,#F57C00);color:#fff;flex:none}
    #sc-how .ap{position:absolute;left:${VX}px;top:${OY - 110}px;width:300px;height:220px;padding:26px 24px;border-radius:24px;background:linear-gradient(160deg,rgba(93,211,158,.16),rgba(93,211,158,.05));border:1.5px solid rgba(93,211,158,.55)}
    #sc-how .ap .ai{width:54px;height:54px;border-radius:15px;display:grid;place-items:center;background:#1F8A5B;color:#fff;margin-bottom:16px}
    #sc-how .ap b{display:block;font-size:30px;font-weight:700;color:#fff;line-height:1.2;letter-spacing:-.02em}
    #sc-how .pt{position:absolute;left:0;top:0;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:#FFD08A;box-shadow:0 0 12px 4px rgba(255,150,50,.75)}
    #sc-how .floor{position:absolute;left:660px;width:600px;top:${OY - 180}px;height:360px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,130,40,.22),rgba(255,130,40,0));filter:blur(20px)}
    #sc-how .wipe{position:absolute;inset:0;background:radial-gradient(1500px 1000px at 72% 46%,#FFFFFF 0%,#F7F4EF 42%,#ECE6DC 100%);clip-path:circle(0px at 960px ${OY}px)}`,
    build(el, s) {
      el.innerHTML = `<div class="hw"><div class="floor"></div><svg class="hln"></svg><div class="kk">How it works</div>
        ${HEAD.map((h, i) => `<div class="hh" style="left:${COLS[i]}px"><div class="n">0${i + 1}</div><div class="t">${h}</div></div>`).join('')}
        ${SOURCES.map((src, i) => `<div class="src" style="top:${SRC_Y(i)}px">${tile(Object.assign({}, src, { name: src.name === 'SIM tickets' ? 'SIM' : src.name === 'Documents' ? 'Docs' : src.name }), 60)}<b>${src.name === 'SIM tickets' ? 'SIM' : src.name === 'Documents' ? 'Docs' : src.name}</b></div>`).join('')}
        <div class="grp"></div>
        <div class="cn c1" style="top:424px"><div class="cr"><div class="ci">${ic('refresh-cw', 22)}</div><b>Scheduled sync</b></div><span>every 15 minutes</span></div>
        <div class="cn c2" style="top:576px"><div class="cr"><div class="ci">${ic('cpu', 22)}</div><b>Kiro CLI</b></div><span>in the background</span></div>
        <div class="pts"></div><div class="ow">${orb(210)}</div>
        ${MEM.map((m, i) => `<div class="mem" style="top:${690 + i * 62}px"><div>${ic(m[0], 22)}${m[1]}</div></div>`).join('')}
        ${AG.map((a, i) => `<div class="ag" style="top:${AG_Y(i)}px"><div class="oi">${ic(a[0], 22)}</div>${a[1]}</div>`).join('')}
        <div class="ap"><div class="ai">${ic('shield-check', 28)}</div><b>Nothing is sent<br>without you.</b></div></div><div class="wipe"></div>`;
      s.hw = $('.hw', el); s.kk = $('.kk', el); s.hh = $$('.hh', el); s.src = $$('.src', el); s.grp = $('.grp', el); s.cn = $$('.cn', el);
      s.orb = $('.ow .orb', el); s.mem = $$('.mem', el); s.ag = $$('.ag', el); s.ap = $('.ap', el); s.wipe = $('.wipe', el); s.floor = $('.floor', el);
      const svg = $('svg.hln', el), pts = $('.pts', el);
      const mk = (x, y, stroke, n) => {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', `M${x[0]},${y[0]} C${x[1]},${y[1]} ${x[2]},${y[2]} ${x[3]},${y[3]}`);
        p.setAttribute('fill', 'none'); p.setAttribute('stroke', stroke); p.setAttribute('stroke-width', '2'); svg.appendChild(p);
        const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        return { p, len, x, y, ps: Array.from({ length: n }, () => { const d = J.h('<div class="pt"></div>'); pts.appendChild(d); return d; }) };
      };
      // sources → connecteurs → cerveau → agents → validation
      s.l1 = SOURCES.map((_, i) => mk([360, 410, 400, GX0], [SRC_Y(i), SRC_Y(i), 563, 563], 'rgba(255,170,90,.36)', 2));
      s.l2 = [mk([GX1, 790, 820, 855], [563, 563, OY, OY], 'rgba(255,170,90,.6)', 4)];
      s.l3 = AG.map((_, i) => mk([1065, 1120, 1130, AX0], [OY, OY, AG_Y(i), AG_Y(i)], 'rgba(255,170,90,.5)', 2));
      s.l4 = AG.map((_, i) => mk([AX1, 1510, 1500, VX], [AG_Y(i), AG_Y(i), OY, OY], 'rgba(93,211,158,.45)', 1));
      SOURCES.forEach((_, i) => cue('pop', s.t0 + 0.35 + i * 0.1, { v: 0.35 }));
      cue('pop', s.t0 + 1.45, { v: 0.5 }); cue('pop', s.t0 + 1.6, { v: 0.5 }); cue('data', s.t0 + 1.2, { d: 7.2 });
      cue('hit', s.t0 + 2.3, { v: 0.4 }); MEM.forEach((_, i) => cue('tick', s.t0 + 2.4 + i * 0.15, { v: 0.5 }));
      AG.forEach((_, i) => cue('pop', s.t0 + 3.2 + i * 0.15, { v: 0.45 }));
      cue('lock', s.t0 + 4.4); cue('success', s.t0 + 4.6, { v: 0.5 }); cue('open', s.t0 + 8.8);
    },
    update(lt, dur, s, t) {
      vis(s.kk, lt, 0.1, Infinity, { dy: 12, blur: 6 });
      s.hh.forEach((h, i) => vis(h, lt, [0.2, 1.2, 2.0, 3.0, 4.2][i], Infinity, { dy: 20, blur: 8 }));
      s.src.forEach((el, i) => vis(el, lt, 0.35 + i * 0.1, Infinity, { dx: -40, dy: 0, blur: 8, din: 0.7 }));
      vis(s.grp, lt, 1.25, Infinity, { dy: 0, ds: -0.04, blur: 6 });
      s.cn.forEach((el, i) => vis(el, lt, 1.45 + i * 0.15, Infinity, { dy: 18, blur: 8 }));
      const flow = (arr, draw, start, sp, out) => arr.forEach((o, i) => {
        const d = P(lt, draw + i * 0.06, 0.6, E.ioC);
        o.p.style.strokeDashoffset = (o.len * (1 - d)).toFixed(1);
        o.ps.forEach((pt, j) => {
          if (lt < start) { pt.style.opacity = 0; return; }
          const ph = ((lt - start) * sp + j / o.ps.length + i * 0.13) % 1;
          const u = out ? E.outQ(ph) : E.inQ(ph);
          pt.style.transform = `translate(${bz(o.x, u).toFixed(1)}px,${bz(o.y, u).toFixed(1)}px)`;
          pt.style.opacity = (Math.sin(Math.PI * ph) * P(lt, start, 0.5)).toFixed(3);
        });
      });
      flow(s.l1, 0.8, 1.2, 0.55, false);
      flow(s.l2, 1.9, 2.2, 0.6, false);
      flow(s.l3, 3.1, 3.6, 0.5, true);
      flow(s.l4, 4.3, 4.8, 0.5, false);
      const kick = lt > 2.3 ? Math.exp(-(lt - 2.3) * 3) : 0;
      const pulse = orbTick(s.orb, t, { glow: 0.9 + 0.7 * kick + 0.3 * P(lt, 2.3, 2) });
      tf(s.orb, { s: pulse * (1 + 0.12 * kick) });
      s.floor.style.opacity = (0.6 + 0.4 * P(lt, 2.3, 1.5)).toFixed(3);
      s.mem.forEach((el, i) => vis(el, lt, 2.4 + i * 0.15, Infinity, { dy: 14, blur: 6 }));
      s.ag.forEach((el, i) => {
        const a = 3.2 + i * 0.15;
        vis(el, lt, a, Infinity, { dx: 30, dy: 0, blur: 8, ds: -0.06, din: 0.6, ein: E.outB });
        const g = P(lt, a, 0.3) * (1 - P(lt, a + 0.3, 0.9));
        el.style.boxShadow = g > 0.01 ? `0 0 0 ${(4 * g).toFixed(1)}px rgba(255,153,0,.25), 0 0 ${(40 * g).toFixed(0)}px rgba(255,153,0,${(0.35 * g).toFixed(2)})` : 'none';
      });
      vis(s.ap, lt, 4.4, Infinity, { dy: 0, dx: 30, ds: -0.08, blur: 8, ein: E.outB, din: 0.7 });
      // sortie : le schéma recule, l'application s'ouvre depuis le cerveau
      const q = P(lt, 8.6, 1.2, E.inQ);
      tf(s.hw, { s: 1 - 0.06 * q, b: 6 * q });
      const R = 2300 * E.ioC(P(lt, 8.8, 1.2, E.lin));
      s.wipe.style.clipPath = `circle(${R.toFixed(1)}px at 960px ${OY}px)`;
    },
  });
})();
