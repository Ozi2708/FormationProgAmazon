#!/usr/bin/env node
/* Vérifications automatiques du film d'intro v4 (pitch-v4.html) :
   - durée (exactement 90 s), paliers du compteur de temps gagné, chiffres d'impact
   - aucun « TODO » ni adresse e-mail affichés
   Usage : node tools/check-v3.cjs                                                                 */
const path = require('path');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }

(async () => {
  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.log('ERREUR page :', e.message));
  await page.goto('file://' + path.join(__dirname, '..', 'pitch-v4.html') + '?render');
  const dur = await page.evaluate(() => window.__ready);
  const out = await page.evaluate(async dur => {
    const res = { dur, steps: [], impact: null, bad: [] };
    for (const [, b, v] of CONFIG.COUNTER) { window.__seek(b + 0.05); res.steps.push([b, J.hm(v), document.querySelector('#sc-counter .v').textContent]); }
    window.__seek(CONFIG.SHOTS.impact[1] - 0.2);
    const q = s => document.querySelector(s)?.textContent.trim();
    res.impact = { team: q('#sc-impact .l2'), eu: q('#sc-impact .l3'), calc: window.IMPACT };
    const visible = el => { for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; } return true; };
    for (let t = 0.1; t < dur; t += 0.25) {
      window.__seek(t);
      const w = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const txt = n.nodeValue.trim();
        if (txt && /TODO|\S@\S/.test(txt) && visible(n.parentElement)) res.bad.push([+t.toFixed(2), txt.slice(0, 60)]);
      }
    }
    return res;
  }, dur);
  await browser.close();
  console.log(`durée : ${out.dur.toFixed(2)} s ${Math.abs(out.dur - 90) < 0.01 ? 'OK' : 'ÉCART'}`);
  console.log('compteur (instant, attendu, affiché) :'); out.steps.forEach(s => console.log(`  ${s[0].toFixed(1)} s  ${s[1]}  ${s[2]}  ${s[1] === s[2] ? 'OK' : 'ÉCART'}`));
  console.log('impact :', JSON.stringify(out.impact));
  console.log(`TODO ou e-mails visibles : ${out.bad.length}`, out.bad.slice(0, 5));
})();
