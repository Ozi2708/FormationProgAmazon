#!/usr/bin/env node
/* Vérifications automatiques du film jury v2 (pitch-v2.html) :
   - durée, paliers du compteur de temps gagné, chiffres d'impact
   - aucun « TODO » affiché
   - textes visibles dont la plus grande taille à l'écran reste sous 28 px (caméra comprise), scène par scène
   Usage : node tools/check-v2.cjs                                                                 */
const path = require('path');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }

(async () => {
  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.log('ERREUR page :', e.message));
  await page.goto('file://' + path.join(__dirname, '..', 'pitch-v2.html') + '?render');
  const dur = await page.evaluate(() => window.__ready);
  const out = await page.evaluate(async dur => {
    const res = { dur, steps: [], impact: null, todo: [], small: {} };
    // compteur : valeur affichée juste après chaque palier
    for (const st of window.COUNTER_STEPS) { window.__seek(st.t + 0.3); res.steps.push([st.t, st.value, document.querySelector('.ctr-n').textContent]); }
    // impact : fin de la scène
    window.__seek(TL.impact[1] - 0.8);
    const q = s => document.querySelector(s)?.textContent.trim();
    res.impact = { fr: q('#sc-impact .s1 .b'), eu: q('#sc-impact .s2 .b'), hours: q('#sc-impact .hy'), calc: window.IMPACT };
    // parcours du film toutes les 0,25 s : TODO visibles et textes trop petits
    const visible = el => { for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.35) return false; } return true; };
    for (let t = 0.1; t < dur; t += 0.25) {
      window.__seek(t);
      const w = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const txt = n.nodeValue.trim();
        if (!txt) continue;
        const el = n.parentElement;
        if (!visible(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.right < 0 || r.left > 1920 || r.bottom < 0 || r.top > 1080) continue;
        if (/TODO/.test(txt)) res.todo.push([+t.toFixed(2), txt]);
        // taille réelle = taille CSS × échelle cumulée (caméra, zooms)
        const fs = parseFloat(getComputedStyle(el).fontSize);
        const sc = el.offsetHeight ? r.height / el.offsetHeight : 1;
        const px = fs * sc;
        {
          const sc_ = el.closest('.scene')?.id.replace('sc-', '') || '?';
          const key = `${sc_} | ${txt.slice(0, 48)}`;
          res.small[key] = Math.max(res.small[key] ?? 0, +px.toFixed(1));
        }
      }
    }
    return res;
  }, dur);
  await browser.close();
  console.log(`durée : ${out.dur} s`);
  console.log('compteur (instant, attendu, affiché) :'); out.steps.forEach(s => console.log(`  ${s[0].toFixed(1)} s  ${s[1]}  ${s[2]}  ${s[1] === s[2] ? 'OK' : 'ÉCART'}`));
  console.log('impact :', JSON.stringify(out.impact));
  console.log(`TODO visibles : ${out.todo.length}`, out.todo.slice(0, 5));
  const small = Object.entries(out.small).filter(([, v]) => v < 28).sort((a, b) => a[0].localeCompare(b[0]));
  console.log(`textes visibles sous 28 px : ${small.length}`);
  small.forEach(([k, v]) => console.log(`  ${v} px  ${k}`));
})();
