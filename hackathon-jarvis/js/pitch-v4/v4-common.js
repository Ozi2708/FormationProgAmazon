/* Film d'intro v4 — styles et outils communs : palette du kit, titres, pastille de gain, cadre de capture,
   tableau Today posé (écran d'accueil), compteur « Time back this week · estimated » */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, tf, vis, ic, $, $$, scene, clamp, lerp, cue, setHTML } = J;

  // palette du kit : Squid Ink, Smile Orange, Cobalt, rouge des risques
  const K = J.K4 = { ink: '#161D26', or: '#FF6200', cob: '#A3AAB5', red: '#FF4061' };
  J.SH = C.SHOTS;
  J.BG4 = `radial-gradient(1500px 1000px at 50% 45%,#1F2834 0%,${K.ink} 55%,#0F141B 100%)`;

  J.V4_CSS = `
  .v4{background:${J.BG4};color:#fff}
  .v4 .o{color:${K.or}}
  .v4 .cb{color:${K.cob}}
  .v4h{position:absolute;font-family:InterTight,InterV,sans-serif;font-weight:800;letter-spacing:-.04em;line-height:1.05;color:#fff}
  .v4s{position:absolute;font-family:InterV,sans-serif;font-weight:500;letter-spacing:-.015em;color:${K.cob}}
  .v4k{position:absolute;font:600 22px Plex,monospace;letter-spacing:.22em;text-transform:uppercase;color:${K.or}}
  .v4chip{position:absolute;display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 24px 0 18px;border-radius:28px;
    border:1.5px solid rgba(163,170,181,.4);background:rgba(255,255,255,.05);font:650 28px InterV;color:#fff;white-space:nowrap}
  .v4chip .ic{color:${K.or}}
  .v4chip em{font-style:normal;font-weight:500;font-size:20px;color:${K.cob};margin-left:4px}
  .v4frame{position:absolute;border-radius:16px;overflow:hidden;background:#F4F2EE;box-shadow:0 40px 110px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.1)}
  .v4frame .ui{transform-origin:0 0}
  .v4card{position:absolute;border-radius:16px;background:#F4F2EE;color:#15191E;box-shadow:0 30px 80px rgba(0,0,0,.45)}
  `;

  J.gainChip = txt => `<div class="v4chip">${ic('clock', 26)}${txt}<em>estimated</em></div>`;

  // cadre de capture : l'interface (2000 × 1125) réduite à la largeur du cadre, cadrée par une caméra
  J.frameCam = (ui, c, w, h) => J.camApply(ui, c, w, h);

  // ---------- tableau de l'écran Today posé dans un état fixe (Interbev en Sev 1, comme l'écran d'accueil)
  J.placeToday = root => {
    if (root._placed) return;
    root._placed = true;
    const B = J.BOARD, cd = {};
    $$('.cards .cd', root).forEach(c => { cd[c.dataset.k] = c; });
    const X = B.cols.map(x => x + 13);
    const cols = [['inter'], ['polt', 'dentsu', 'bfm', 'deal'], ['midas', 'gae1', 'gae2', 'qonto']];
    const colEl = $$('.col', root);
    cols.forEach((list, ci) => {
      let y = B.stackTop;
      list.forEach(k => { tf(cd[k], { x: X[ci], y }); y += cd[k].offsetHeight + B.gap; });
      if (ci < 2) colEl[ci].style.height = (63 + y - B.gap - B.stackTop + 13) + 'px';
    });
    colEl[2].style.height = '1320px';
    cd.done.style.visibility = 'hidden';
    cd.inter.classList.add('r1');
    const mv = $('.mv', cd.inter); if (mv) mv.style.opacity = 1;
    const ce = $('.c1 .empty', root); if (ce) ce.style.opacity = 0;
    const dr = $('.c1 .drop', root); if (dr) dr.style.opacity = 0;
    $$('.col .n', root).forEach((n, i) => { n.textContent = ['1', '4', '11'][i]; });
    const order = ['inter', 'polt', 'shis', 'bfm', 'midas'];
    $$('.t5 .rw', root).forEach(r => {
      const i = order.indexOf(r.dataset.k);
      tf(r, { y: i < 0 ? 0 : i * 66, o: i < 0 ? 0 : 1 });
      $('.no', r).textContent = String(i + 1);
    });
  };

  // écran d'accueil tel qu'il apparaît le jeudi soir (briefing de 18:05)
  J.HOME = {
    kicker: 'Thursday 29 Oct · Briefing of 18:05',
    h1: `3 things need you. <span style="color:${J.T.red}">1 can't wait.</span>`,
    para: 'Quiet window: the team check starts now and the demo video must be uploaded by 02:00 tonight. The MIDAS check and the CRM upload guide can wait until tomorrow morning.',
    chips: ['1 draft ready', '6 about campaigns behind pace', '1 not yours'],
  };

  // ---------- compteur commun aux plans 5 à 8
  const hm = m0 => { const m = Math.round(m0); return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`; };
  J.hm = hm;
  J.counterAt = t => {
    let m = 0, prev = 0;
    for (const [a, b, v] of C.COUNTER) { m = lerp(prev, v, P(t, a, b - a, E.ioC)); if (t < b) break; prev = v; }
    return m;
  };
  J.v4Counter = () => scene({
    id: 'counter', t0: J.SH.briefing[0], t1: J.SH.montage[1], fin: 0,
    css: `
    #sc-counter{pointer-events:none}
    #sc-counter .ct{position:absolute;right:60px;top:48px;width:430px;padding:16px 24px 18px;border-radius:18px;background:rgba(15,20,27,.92);
      border:1.5px solid rgba(163,170,181,.28);box-shadow:0 20px 60px rgba(0,0,0,.4);text-align:right}
    #sc-counter .k{font:600 15px Plex,monospace;letter-spacing:.16em;text-transform:uppercase;color:${K.cob}}
    #sc-counter .k b{color:${K.or};font-weight:600}
    #sc-counter .v{font-family:InterTight;font-weight:800;font-size:76px;letter-spacing:-.04em;line-height:1.02;margin-top:4px;color:#fff;font-variant-numeric:tabular-nums}
    #sc-counter .c{font:600 24px InterV;color:${K.or};height:30px;white-space:nowrap}`,
    build(el, s) {
      el.innerHTML = `<div class="ct"><div class="k">Time back this week · <b>estimated</b></div><div class="v">0h00</div><div class="c">about one working day</div></div>`;
      s.ct = $('.ct', el); s.v = $('.v', el); s.c = $('.c', el);
      C.COUNTER.forEach(([a, b]) => { cue('rise', a - 0.2, { d: 0.3, v: 0.4 }); cue('count', a, { d: b - a }); cue('ping', b, { v: 0.6 }); });
      cue('success', C.COUNTER[C.COUNTER.length - 1][1] + 0.2, { v: 0.6 });
    },
    update(lt, dur, s, t) {
      // il apparaît avec la première estimation et quitte l'écran avec le plan 8
      const o = P(t, C.COUNTER[0][0] - 0.4, 0.4) * (1 - P(t, J.SH.montage[1] - 0.35, 0.3));
      tf(s.ct, { o, y: -16 * (1 - P(t, C.COUNTER[0][0] - 0.4, 0.5, E.outQi)) });
      const txt = hm(J.counterAt(t));
      if (s.v.textContent !== txt) s.v.textContent = txt;
      // une étape franchie : le chiffre bat ; à 8h00 il passe à l'orange
      let kick = 0;
      for (const [, b] of C.COUNTER) if (t >= b) kick = Math.max(kick, Math.exp(-(t - b) * 5));
      const tf8 = C.COUNTER[C.COUNTER.length - 1][1] + 0.2, full = P(t, tf8, 0.4);
      s.v.style.color = full > 0.5 ? K.or : '#fff';
      tf(s.v, { s: 1 + 0.08 * kick + 0.06 * full * Math.abs(Math.sin((t - tf8) * 4)) });
      s.v.style.transformOrigin = '100% 50%';
      tf(s.c, { o: full, y: 8 * (1 - full) });
      s.ct.style.borderColor = full > 0.5 ? 'rgba(255,98,0,.7)' : 'rgba(163,170,181,.28)';
    },
  });
})();
