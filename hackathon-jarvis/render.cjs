#!/usr/bin/env node
/* Rendu du film image par image (Chromium headless + ffmpeg).
   Vidéo :  node render.cjs [--fps 30] [--workers 4] [--from 0] [--to 179] [--out build/jarvis-video.mp4]
   Images : node render.cjs --stills 1.5,10,30 [--outdir build/stills]
   Repères sonores : node render.cjs --cues build/cues.json                                             */
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

let pw;
try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const URL = 'file://' + path.join(__dirname, 'index.html') + '?render';
const LAUNCH = { args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text', '--hide-scrollbars'] };

async function open(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('[page error]', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('[console]', m.text()); });
  await page.goto(URL);
  const duration = await page.evaluate(() => window.__ready);
  const cdp = await page.context().newCDPSession(page);
  return { page, cdp, duration };
}

async function grab(p, t, format = 'jpeg') {
  await p.page.evaluate(tt => window.__seek(tt), t);
  const r = await p.cdp.send('Page.captureScreenshot', { format, quality: format === 'jpeg' ? 95 : undefined, optimizeForSpeed: true });
  return Buffer.from(r.data, 'base64');
}

async function stills() {
  const outdir = path.resolve(arg('outdir', path.join(__dirname, 'build/stills')));
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await pw.chromium.launch(LAUNCH);
  const p = await open(browser);
  for (const t of arg('stills').split(',').map(Number)) {
    fs.writeFileSync(path.join(outdir, `t${t.toFixed(2).padStart(6, '0')}.png`), await grab(p, t, 'png'));
  }
  await browser.close();
  console.log('stills →', outdir);
}

// un segment vidéo = une suite d'images consécutives, encodée par son propre ffmpeg
async function segment(p, frames, fps, from, seg) {
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-x264-params', 'aq-mode=3', '-r', String(fps), seg],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
  for (const f of frames) {
    const buf = await grab(p, from + f / fps);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
}

// chaque processus pioche le prochain segment libre : les scènes lourdes se répartissent
async function worker(id, queue, fps, from, t0) {
  const browser = await pw.chromium.launch(LAUNCH);
  const p = await open(browser);
  for (let job = queue.shift(); job; job = queue.shift()) {
    await segment(p, job.frames, fps, from, job.seg);
    console.log(`  worker ${id}: segment ${job.i} done (${((Date.now() - t0) / 1000).toFixed(0)} s, ${queue.length} left)`);
  }
  await browser.close();
}

async function video() {
  const fps = Number(arg('fps', 30));
  const workers = Number(arg('workers', 4));
  const out = path.resolve(arg('out', path.join(__dirname, 'build/jarvis-video.mp4')));
  const tmp = path.join(path.dirname(out), 'segments');
  fs.mkdirSync(tmp, { recursive: true });
  const probe = await pw.chromium.launch(LAUNCH);
  const { duration } = await open(probe);
  await probe.close();
  const from = Number(arg('from', 0)), to = Math.min(Number(arg('to', duration)), duration);
  const total = Math.round((to - from) * fps);
  const chunk = Number(arg('chunk', 240));
  console.log(`render ${from}–${to} s · ${total} frames · ${fps} fps · ${workers} workers`);
  const segs = [], queue = [];
  for (let i = 0, f0 = 0; f0 < total; i++, f0 += chunk) {
    const frames = [];
    for (let f = f0; f < Math.min(total, f0 + chunk); f++) frames.push(f);
    const seg = path.join(tmp, `seg${String(i).padStart(3, '0')}.mp4`);
    segs.push(seg);
    queue.push({ i, frames, seg });
  }
  const t0 = Date.now();
  await Promise.all(Array.from({ length: workers }, (_, w) => worker(w, queue, fps, from, t0)));
  fs.writeFileSync(path.join(tmp, 'list.txt'), segs.map(s => `file '${s}'`).join('\n'));
  execSync(`ffmpeg -v error -y -f concat -safe 0 -i "${path.join(tmp, 'list.txt')}" -c copy -movflags +faststart "${out}"`);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)} s → ${out}`);
}

// repères sonores + découpage → JSON (lu par audio/make_audio.py)
async function cues() {
  const out = path.resolve(arg('cues'));
  const browser = await pw.chromium.launch(LAUNCH);
  const p = await open(browser);
  const data = await p.page.evaluate(() => ({ duration: window.__duration, tl: window.TL, cues: window.__cues, storm: window.STORM_SPAWNS }));
  await browser.close();
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(data, null, 1));
  console.log(`${data.cues.length} cues → ${out}`);
}

(arg('cues') ? cues() : arg('stills') ? stills() : video()).catch(e => { console.error(e); process.exit(1); });
