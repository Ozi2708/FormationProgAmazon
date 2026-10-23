/* Film jury v2 — outils communs : valeurs de la config, anonymisation, caméra */
(function () {
  'use strict';
  const C = window.CONFIG;
  const { E, P, clamp, lerp } = J;

  J.isSet = v => v != null && v !== '' && v !== 'TODO';
  J.fmtInt = n => new Intl.NumberFormat('en-US').format(Math.round(n));

  // ---------- anonymisation : noms de la config remplacés dans les textes (statiques et tapés) ----------
  const RX = C.NAMES.map(([a, b]) => [new RegExp(`(^|[^\\p{L}\\p{N}])${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^\\p{L}\\p{N}])`, 'gu'), b]);
  J.anon = s => (C.ANONYMIZE && typeof s === 'string' ? RX.reduce((t, [r, b]) => t.replace(r, (m, pre) => pre + b), s) : s);
  J.anonSegs = segs => segs.map(x => Object.assign({}, x, { t: J.anon(x.t) }));
  function anonTree(el) {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) { const v = J.anon(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  }
  // chaque scène est anonymisée juste après sa construction
  if (C.ANONYMIZE) {
    const scene = J.scene;
    J.scene = def => { const b = def.build; def.build = (el, s) => { b(el, s); anonTree(el); }; scene(def); };
  }

  // ---------- caméra : place le point (fx, fy) de l'interface au centre de la vue, à l'échelle s ----------
  // keys : [[t, s, fx, fy], ...] ; entre deux clés, mouvement doux
  J.camAt = (keys, lt) => {
    let k = keys[0];
    if (lt <= keys[0][0]) return { s: k[1], x: k[2], y: k[3] };
    for (let i = 1; i < keys.length; i++) {
      const a = keys[i - 1], b = keys[i];
      if (lt < b[0]) {
        // la clé b commence à bouger 0,9 s avant son instant (ou dès la clé a si elles sont proches)
        const d = Math.min(b[4] ?? 0.9, b[0] - a[0]);
        const u = E.ioC(clamp((lt - (b[0] - d)) / d));
        return { s: lerp(a[1], b[1], u), x: lerp(a[2], b[2], u), y: lerp(a[3], b[3], u) };
      }
    }
    k = keys[keys.length - 1];
    return { s: k[1], x: k[2], y: k[3] };
  };
  J.camApply = (el, c, vw, vh) => {
    el.style.transform = `translate(${(vw / 2 - c.x * c.s).toFixed(2)}px,${(vh / 2 - c.y * c.s).toFixed(2)}px) scale(${c.s.toFixed(4)})`;
  };
})();
