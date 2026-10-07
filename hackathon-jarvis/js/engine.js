/* J.A.R.V.I.S. — film hackathon
   Mini moteur d'animation déterministe : tout l'écran est une fonction du temps t.
   - en aperçu (index.html ouvert dans un navigateur) : lecture temps réel + barre de lecture
   - en rendu (render.cjs, ?render) : window.__seek(t) image par image */
(function () {
  'use strict';

  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  const E = {
    lin: t => t,
    inQ: t => t * t,
    outQ: t => 1 - (1 - t) * (1 - t),
    inC: t => t * t * t,
    outC: t => 1 - Math.pow(1 - t, 3),
    ioC: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outQu: t => 1 - Math.pow(1 - t, 4),
    outQi: t => 1 - Math.pow(1 - t, 5),
    ioQ: t => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
    outX: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inX: t => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
    ioX: t => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2),
    outB: t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    spring: t => (t >= 1 ? 1 : 1 - Math.exp(-6.5 * t) * Math.cos(11 * t)),
  };

  // progression 0..1 entre `a` et `a + d`
  const P = (t, a, d, ease = E.outC) => ease(clamp((t - a) / d));

  function tf(el, o) {
    const s = el.style;
    let tr = '';
    if (o.x || o.y || o.z) tr += `translate3d(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px,${(o.z || 0).toFixed(2)}px) `;
    if (o.rx) tr += `rotateX(${o.rx.toFixed(3)}deg) `;
    if (o.ry) tr += `rotateY(${o.ry.toFixed(3)}deg) `;
    if (o.rz) tr += `rotate(${o.rz.toFixed(3)}deg) `;
    if (o.s !== undefined && o.s !== 1) tr += `scale(${o.s.toFixed(4)}) `;
    if (o.sx !== undefined || o.sy !== undefined) tr += `scale(${(o.sx ?? 1).toFixed(4)},${(o.sy ?? 1).toFixed(4)}) `;
    s.transform = tr || 'none';
    if (o.o !== undefined) {
      s.opacity = clamp(o.o).toFixed(4);
      s.visibility = o.o <= 0.002 ? 'hidden' : 'visible';
    }
    if (o.b !== undefined) s.filter = o.b > 0.06 ? `blur(${o.b.toFixed(2)}px)` : 'none';
  }

  // apparition (montée + flou + fondu) à `a`, disparition finissant à `b`
  function vis(el, lt, a, b = Infinity, o = {}) {
    const din = o.din ?? 0.9, dout = o.dout ?? 0.45;
    const i = clamp((lt - a) / din), q = clamp((lt - (b - dout)) / dout);
    const ei = (o.ein || E.outQi)(i), eo = E.inC(q);
    const op = E.outC(i) * (1 - eo) * (o.op ?? 1);
    tf(el, {
      x: (o.dx ?? 0) * (1 - ei) + (o.dxo ?? 0) * eo,
      y: (o.dy ?? 36) * (1 - ei) + (o.dyo ?? -14) * eo + (o.y ?? 0),
      s: 1 + (o.ds ?? 0) * (1 - ei) + (o.dso ?? 0) * eo,
      rx: (o.rx ?? 0) * (1 - ei),
      o: op,
      b: (o.blur ?? 14) * (1 - ei) + (o.bo ?? 8) * eo,
    });
    return op;
  }

  function splitWords(root) {
    const words = [];
    const walk = node => {
      for (const ch of [...node.childNodes]) {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const part of ch.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(' '));
            else { const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = part; frag.appendChild(sp); words.push(sp); }
          }
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
      }
    };
    walk(root);
    return words;
  }

  function revealWords(words, lt, a, o = {}) {
    const st = o.st ?? 0.065, d = o.d ?? 0.95;
    words.forEach((w, i) => {
      const k = clamp((lt - a - i * st) / d);
      const e = E.outQi(k);
      tf(w, { y: (o.dy ?? 44) * (1 - e), o: E.outC(k), b: (o.blur ?? 12) * (1 - e) });
    });
  }

  const nf = {};
  function fmt(n, dec = 0) {
    const k = dec;
    nf[k] = nf[k] || new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    return nf[k].format(n);
  }
  function count(el, lt, a, d, from, to, o = {}) {
    const k = P(lt, a, d, o.ease || E.outX);
    const v = lerp(from, to, k);
    const txt = (o.pre || '') + fmt(o.dec ? v : Math.round(v), o.dec || 0) + (o.suf || '');
    if (el._t !== txt) { el.textContent = txt; el._t = txt; }
    return k;
  }

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function setHTML(el, html) { if (el._h !== html) { el.innerHTML = html; el._h = html; } }

  // machine à écrire ; segments = chaîne ou [{t, c}] (c = classe CSS)
  function type(el, segs, lt, a, cps = 45, o = {}) {
    if (typeof segs === 'string') segs = [{ t: segs }];
    const total = segs.reduce((n, s) => n + s.t.length, 0);
    let n = Math.floor(clamp((lt - a) * cps, 0, total));
    let html = '';
    for (const s of segs) {
      if (n <= 0) break;
      const part = s.t.slice(0, n); n -= part.length;
      const h = esc(part).replace(/\n/g, '<br>');
      html += s.c ? `<span class="${s.c}">${h}</span>` : h;
    }
    const done = (lt - a) * cps >= total;
    const tail = lt - a - total / cps;
    const caret = o.caret !== false && lt >= a && (!done || (tail < (o.hold ?? 0.9) && Math.floor(tail * 2.4) % 2 === 0));
    setHTML(el, html + (caret ? '<span class="caret"></span>' : ''));
    return clamp((lt - a) * cps / total);
  }

  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  const ic = (name, size = 18, extra = '') =>
    `<svg class="ic" viewBox="0 0 24 24" style="width:${size}px;height:${size}px;${extra}">${(window.ICONS || {})[name] || ''}</svg>`;

  function h(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // curseur souris + clic
  const CURSOR_SVG = `<svg viewBox="0 0 28 28" width="34" height="34"><path d="M6 3.5 L6 23 L11.2 18.3 L14.6 25.6 L18 24.1 L14.7 16.9 L21.6 16.6 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  function cursor(parent) {
    const c = h(`<div class="cursor"><div class="ripple"></div>${CURSOR_SVG}</div>`);
    parent.appendChild(c);
    return c;
  }
  // path : [[t, x, y], ...] ; clicks : [t, ...]
  function moveCursor(c, lt, path, clicks = [], o = {}) {
    let x = path[0][1], y = path[0][2];
    for (let i = 1; i < path.length; i++) {
      const [t0, x0, y0] = path[i - 1], [t1, x1, y1] = path[i];
      if (lt >= t0) { const k = E.ioC(clamp((lt - t0) / (t1 - t0))); x = lerp(x0, x1, k); y = lerp(y0, y1, k); }
    }
    let s = 1, rip = 0;
    for (const ct of clicks) {
      const d = lt - ct;
      if (d > -0.12 && d < 0.18) s = Math.min(s, 1 - 0.18 * Math.sin(clamp((d + 0.12) / 0.3) * Math.PI));
      if (d >= 0 && d < 0.7) rip = d / 0.7;
    }
    const op = Math.min(P(lt, path[0][0] - 0.3, 0.3), 1 - P(lt, o.hide ?? 1e9, 0.3));
    tf(c, { x, y, o: op });
    c.firstElementChild.nextElementSibling.style.transform = `scale(${s})`;
    const r = c.firstElementChild;
    r.style.opacity = rip > 0 ? (1 - rip) * 0.55 : 0;
    r.style.transform = `translate(-50%,-50%) scale(${0.2 + rip * 1.6})`;
  }

  // ---------- repères sonores (lus par audio/make_audio.py) ----------
  const CUES = [];
  const cue = (type, t, o = {}) => CUES.push(Object.assign({ type, t: +t.toFixed(3) }, o));
  window.__cues = CUES;

  // position d'un élément dans un ancêtre positionné (hors transformations)
  function rel(el, root) {
    let x = 0, y = 0, e = el;
    while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2 };
  }

  // ---------- scènes ----------
  const SCENES = [];
  let DURATION = 0;
  function scene(def) { SCENES.push(def); DURATION = Math.max(DURATION, def.t1); }

  const styleTag = document.createElement('style');
  function buildAll() {
    const stage = document.getElementById('stage');
    let css = '';
    for (const s of SCENES) {
      s.el = document.createElement('div');
      s.el.className = 'scene ' + (s.cls || '');
      s.el.id = 'sc-' + s.id;
      s.el.style.display = 'none';
      stage.appendChild(s.el);
      if (s.css) css += s.css + '\n';
      s.build(s.el, s);
    }
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
  }

  let current = -1;
  function seek(t) {
    current = t;
    for (const s of SCENES) {
      const on = t >= s.t0 && t < s.t1;
      if (on) {
        if (s.el.style.display === 'none') s.el.style.display = '';
        // la scène entrante apparaît en fondu par-dessus la sortante (pas de creux au noir)
        const fin = s.fin ?? 0.4;
        s.el.style.opacity = fin ? clamp((t - s.t0) / fin).toFixed(4) : '1';
        s.update(t - s.t0, s.t1 - s.t0, s, t);
      } else if (s.el.style.display !== 'none') s.el.style.display = 'none';
    }
  }

  // ---------- aperçu ----------
  function initPreview() {
    document.body.classList.add('preview');
    const stage = document.getElementById('stage');
    const bar = h(`<div id="bar">
        <button id="pp">❚❚</button>
        <input id="scrub" type="range" min="0" max="${DURATION}" step="0.01" value="0">
        <span id="tc">0:00.0</span>
        <span class="hint">espace : lecture/pause · ← → : ±1 s · maj+← → : ±5 s</span>
      </div>`);
    document.body.appendChild(bar);
    const scrub = $('#scrub'), tc = $('#tc'), pp = $('#pp');
    const fit = () => {
      const sc = Math.min(window.innerWidth / 1920, (window.innerHeight - 56) / 1080);
      stage.style.transform = `translate(${(window.innerWidth - 1920 * sc) / 2}px,${(window.innerHeight - 56 - 1080 * sc) / 2}px) scale(${sc})`;
    };
    window.addEventListener('resize', fit); fit();
    let playing = true, base = parseFloat((location.hash.match(/t=([\d.]+)/) || [])[1] || 0), t0 = performance.now();
    const now = () => (playing ? base + (performance.now() - t0) / 1000 : base);
    const jump = t => { base = clamp(t, 0, DURATION - 0.001); t0 = performance.now(); };
    const tcs = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
    pp.onclick = () => { base = now(); t0 = performance.now(); playing = !playing; pp.textContent = playing ? '❚❚' : '▶'; };
    scrub.oninput = () => jump(parseFloat(scrub.value));
    window.addEventListener('keydown', e => {
      if (e.code === 'Space') { e.preventDefault(); pp.onclick(); }
      if (e.code === 'ArrowRight') jump(now() + (e.shiftKey ? 5 : 1));
      if (e.code === 'ArrowLeft') jump(now() - (e.shiftKey ? 5 : 1));
    });
    const loop = () => {
      let t = now();
      if (t >= DURATION) { jump(0); t = 0; }
      seek(t); scrub.value = t; tc.textContent = `${tcs(t)} / ${tcs(DURATION)}`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  window.J = { clamp, lerp, E, P, tf, vis, splitWords, revealWords, fmt, count, type, esc, setHTML, rng, ic, h, $, $$, cursor, moveCursor, scene, cue, rel };

  window.__ready = (async () => {
    await new Promise(r => (document.readyState === 'complete' ? r() : window.addEventListener('load', r)));
    buildAll();
    await Promise.all(['400 20px InterV', '600 20px InterV', '700 80px InterV', '700 30px InterTight',
      '400 16px Plex', '500 16px Plex', '600 16px Plex'].map(f => document.fonts.load(f)));
    await document.fonts.ready;
    window.__duration = DURATION;
    window.__seek = seek;
    if (/[?&]render/.test(location.search)) seek(0);
    else initPreview();
    return DURATION;
  })();
})();
