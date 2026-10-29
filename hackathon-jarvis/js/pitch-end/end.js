/* Écran de fin (2,6 s) : « Thank you. » et l'équipe, chaque portrait cerclé d'un anneau orange qui se dessine,
   reliés au titre par des traits de lumière */
(function () {
  'use strict';
  const { E, P, tf, vis, splitWords, revealWords, $, $$, scene, clamp } = J;
  const DUR = 2.6, OR = '#FF6200', INK = '#161D26', COB = '#A3AAB5';
  const TEAM = window.TEAM || []; // equipe/team.js (non versionné, comme les photos)
  const PX = i => 960 + (i - 1.5) * 330, PY = 650, R = 105, LOGO = { x: 960, y: 205 };
  scene({
    id: 'end', t0: 0, t1: DUR, fin: 0,
    css: `
    #sc-end{background:radial-gradient(1500px 1000px at 50% 40%,#1F2834 0%,${INK} 55%,#0F141B 100%)}
    #sc-end .glow{position:absolute;left:${LOGO.x - 380}px;top:${LOGO.y - 380}px;width:760px;height:760px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,120,30,.35),rgba(255,98,0,0))}
    #sc-end .lg{position:absolute;left:${LOGO.x - 55}px;top:${LOGO.y - 55}px}
    #sc-end svg.ln{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
    #sc-end .ty{position:absolute;left:0;right:0;top:300px;text-align:center;font-family:InterTight;font-weight:800;font-size:132px;letter-spacing:-.045em;color:#fff;line-height:1}
    #sc-end .ty .o{color:${OR}}
    #sc-end .pp{position:absolute;top:${PY - R}px;width:${2 * R}px;height:${2 * R}px;margin-left:-${R}px}
    #sc-end .pp img{position:absolute;inset:8px;width:calc(100% - 16px);height:calc(100% - 16px);border-radius:50%;object-fit:cover;object-position:50% 30%}
    #sc-end .pp svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;transform:rotate(-90deg)}
    #sc-end .al{position:absolute;top:${PY + R + 22}px;width:300px;margin-left:-150px;text-align:center;font:600 30px Plex,monospace;color:#fff;letter-spacing:.02em}
    #sc-end .al span{color:${OR}}
    #sc-end .cr{position:absolute;left:0;right:0;top:960px;text-align:center;font:500 26px InterV;color:${COB};letter-spacing:.02em}`,
    build(el, s) {
      const C = 2 * Math.PI * (R - 3);
      el.innerHTML = `<div class="glow"></div><svg class="ln">${TEAM.map((_, i) => `<path d="M${LOGO.x},455 C${LOGO.x},520 ${PX(i)},470 ${PX(i)},${PY - R}" fill="none" stroke="${OR}" stroke-opacity=".5" stroke-width="2"/>`).join('')}</svg>
        <div class="lg">${J.jarvisLogo(110)}</div>
        <div class="ty">Thank <span class="o">you.</span></div>
        ${TEAM.map((t, i) => `<div class="pp" style="left:${PX(i)}px"><img src="equipe/${t}.png" alt=""><svg viewBox="0 0 ${2 * R} ${2 * R}"><circle cx="${R}" cy="${R}" r="${R - 3}" fill="none" stroke="${OR}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}"/></svg></div>
          <div class="al" style="left:${PX(i)}px">${t}<span>@</span></div>`).join('')}
        <div class="cr">JARVIS · Built on Aki · Powered by Claude</div>`;
      s.glow = $('.glow', el); s.lg = $('.lg', el); s.ty = splitWords($('.ty', el)); s.pp = $$('.pp', el); s.al = $$('.al', el); s.cr = $('.cr', el);
      s.rings = $$('.pp circle', el); s.C = C; s.lines = $$('svg.ln path', el); s.len = s.lines.map(p => p.getTotalLength());
      s.lines.forEach((p, i) => { p.style.strokeDasharray = s.len[i]; });
    },
    update(lt, dur, s, t) {
      const fin = 1 - P(lt, DUR - 0.25, 0.25, E.inC); // dernière image : fondu au noir
      s.el.style.filter = `brightness(${fin.toFixed(3)})`;
      tf(s.lg, { s: 0.5 + 0.5 * P(lt, 0, 0.45, E.outB), o: P(lt, 0, 0.2) });
      tf(s.glow, { o: P(lt, 0, 0.5) * (0.8 + 0.2 * Math.sin(t * 6)) });
      revealWords(s.ty, lt, 0.1, { st: 0.12, dy: 50, d: 0.5 });
      s.lines.forEach((p, i) => { p.style.strokeDashoffset = (s.len[i] * (1 - P(lt, 0.35 + i * 0.08, 0.5, E.ioC))).toFixed(1); });
      s.pp.forEach((p, i) => {
        const a = 0.55 + i * 0.12;
        tf(p, { s: 0.6 + 0.4 * P(lt, a, 0.45, E.outB), o: P(lt, a, 0.2) });
        s.rings[i].style.strokeDashoffset = (s.C * (1 - P(lt, a + 0.1, 0.55, E.ioC))).toFixed(1);
      });
      s.al.forEach((a, i) => vis(a, lt, 0.8 + i * 0.12, Infinity, { dy: 12, blur: 4, din: 0.4 }));
      vis(s.cr, lt, 1.3, Infinity, { dy: 10, blur: 4, din: 0.4 });
    },
  });
})();
