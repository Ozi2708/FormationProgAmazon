/* Film jury v3 — recréation de la nouvelle plateforme JARVIS (logo, barre latérale, pages, cartes, toasts)
   L'interface est construite à sa taille réelle (2000 × 1125, comme les captures) ; la caméra la cadre. */
(function () {
  'use strict';
  const { ic, esc } = J;

  // ---------- icônes absentes de js/icons.js (Lucide, licence ISC) ----------
  Object.assign(window.ICONS, {
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    'volume-2': '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'more-v': '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    'area-chart': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"/>',
    'arrow-up': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  });


  // ---------- caméra : place le point (fx, fy) de l'interface au centre de la vue, à l'échelle s ----------
  // keys : [[t, s, fx, fy, durée], ...] ; la clé b commence à bouger « durée » s avant son instant
  J.camAt = (keys, lt) => {
    if (lt <= keys[0][0]) return { s: keys[0][1], x: keys[0][2], y: keys[0][3] };
    for (let i = 1; i < keys.length; i++) {
      const a = keys[i - 1], b = keys[i];
      if (lt < b[0]) {
        const d = Math.min(b[4] ?? 0.9, b[0] - a[0]);
        const u = J.E.ioC(J.clamp((lt - (b[0] - d)) / d));
        return { s: J.lerp(a[1], b[1], u), x: J.lerp(a[2], b[2], u), y: J.lerp(a[3], b[3], u) };
      }
    }
    const k = keys[keys.length - 1];
    return { s: k[1], x: k[2], y: k[3] };
  };
  J.camApply = (el, c, vw, vh) => {
    el.style.transform = `translate(${(vw / 2 - c.x * c.s).toFixed(2)}px,${(vh / 2 - c.y * c.s).toFixed(2)}px) scale(${c.s.toFixed(4)})`;
  };

  // ---------- logo JARVIS (kit officiel) : cercle, V orange et sa pointe ----------
  let LID = 0;
  J.jarvisLogo = (d, dark = true) => {
    const id = 'jl' + (LID++), disc = dark ? '#FFFFFF' : '#232F3E', ring = dark ? '#D5D9D9' : '#37475A';
    return `<svg class="jlogo" viewBox="0 0 200 200" style="width:${d}px;height:${d}px;display:block;overflow:visible"><defs>
      <mask id="m${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="#fff"/><path d="M -10 58 H 180 L 100 190 L 87.00 162.96" fill="none" stroke="#000" stroke-width="20" stroke-linejoin="miter" stroke-miterlimit="4"/></mask>
      <clipPath id="c${id}"><circle cx="100" cy="100" r="92"/></clipPath></defs>
      <circle cx="100" cy="100" r="96" fill="${disc}"/>
      <circle cx="100" cy="100" r="87.5" fill="none" stroke="${ring}" stroke-width="9" mask="url(#m${id})"/>
      <g clip-path="url(#c${id})"><path class="jl-v" d="M -10 58 H 180 L 100 190 L 90.03 169.27" fill="none" stroke="#FF9900" stroke-width="12" stroke-linejoin="miter" stroke-miterlimit="4"/><path class="jl-tip" d="M 95.88 167.57 Q 81.82 139.72 62.74 112.50 Q 74.29 151.76 85.06 172.77 Z" fill="#FF9900"/></g></svg>`;
  };

  // ---------- jetons de la plateforme ----------
  const T = {
    bg: '#F4F2EE', side: '#1D2733', ink: '#15191E', mut: '#5E656C', mut2: '#8A9097', line: '#E4E0D9',
    red: '#C40F2E', redbg: '#FBE3E5', grn: '#1F7A3D', grnbg: '#E2F1E5', or: '#F26B0F', amz: '#FF9900',
    s1: '#F6E0E1', s2: '#F7E5D6', s3: '#E3E8EB', toast: '#161B22',
  };
  J.T = T;

  J.UI_CSS = `
  .ui{position:absolute;left:0;top:0;width:2000px;height:1125px;background:${T.bg};transform-origin:0 0;overflow:hidden;font-family:InterV,sans-serif;color:${T.ink};font-size:15px}
  .ui .hd{font-family:InterTight,InterV,sans-serif;font-weight:800;letter-spacing:-.035em}
  .ui .ic{stroke-width:1.8}
  /* barre latérale */
  .ui .sb{position:absolute;left:0;top:0;width:246px;height:1125px;background:${T.side};color:#E8EBEE}
  .ui .sb .lg{position:absolute;left:24px;top:26px;display:flex;align-items:center;gap:11px}
  .ui .sb .lg b{display:block;font-family:InterTight;font-weight:800;font-size:22px;letter-spacing:-.01em;color:#fff;line-height:1}
  .ui .sb .lg .amz-logo{margin-top:4px}
  .ui .sb .it{position:absolute;left:15px;width:216px;height:37px;margin-top:-18.5px;border-radius:8px;display:flex;align-items:center;gap:12px;padding:0 12px 0 19px;font-size:15px;color:#E5E8EB}
  .ui .sb .it .ic{color:#AEB5BD}
  .ui .sb .it.on{background:rgba(255,255,255,.09);color:#fff;font-weight:650}
  .ui .sb .it.on .ic{color:${T.amz}}
  .ui .sb .it .bd{margin-left:auto;min-width:20px;height:20px;border-radius:10px;display:grid;place-items:center;font-size:11.5px;font-weight:700;background:#3A4552;color:#fff;padding:0 5px}
  .ui .sb .it .bd.o{background:${T.or}}
  .ui .sb .sh{position:absolute;left:25px;font-size:11.5px;font-weight:700;letter-spacing:.06em;color:#AAB2BB}
  .ui .sb .ft{position:absolute;left:15px;right:15px;top:1043px;border-top:1px solid rgba(255,255,255,.1)}
  .ui .sb .ab{position:absolute;left:25px;top:1056px;height:25px;padding:0 10px;border-radius:13px;border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;gap:7px;font-size:12px;color:#E8EBEE}
  .ui .sb .ab i{width:7px;height:7px;border-radius:50%;background:#2DBE5A}
  .ui .sb .nx{position:absolute;left:25px;top:1092px;font-size:12.5px;color:#9AA2AB}
  /* barre du haut */
  .ui .tb{position:absolute;left:246px;right:0;top:0;height:68px;border-bottom:1px solid ${T.line};background:${T.bg}}
  .ui .tb .sr{position:absolute;left:34px;top:13px;width:463px;height:40px;border:1px solid #D9D5CE;border-radius:9px;background:#fff;display:flex;align-items:center;gap:12px;padding:0 12px 0 14px;color:#5E656C;font-size:15px}
  .ui .tb .sr kbd{margin-left:auto;font:500 11px InterV;border:1px solid #D9D5CE;border-radius:5px;padding:3px 6px;color:#5E656C}
  .ui .tb .mt{position:absolute;left:513px;top:16px;height:35px;border:1px solid #D9D5CE;border-radius:18px;background:#fff;display:flex;align-items:center;gap:9px;padding:0 13px;font-size:13.5px;color:#3D434A;white-space:nowrap}
  .ui .tb .mt b{color:${T.ink}}
  .ui .tb .st{position:absolute;right:33px;top:24px;display:flex;gap:14px;font-size:12.5px;color:#4A5057;white-space:nowrap}
  .ui .tb .st span{display:flex;align-items:center;gap:5px}
  .ui .tb .st i{width:6px;height:6px;border-radius:50%;background:#2DBE5A}
  .ui .tb .st i.r{background:#E23B4E}
  .ui .tb .st b{color:${T.ink}}.ui .tb .st b.r{color:${T.red}}
  /* pages */
  .ui .pg{position:absolute;left:246px;top:68px;width:1754px;height:1057px;overflow:hidden;background:${T.bg}}
  .ui .pgi{position:absolute;left:0;top:0;width:1754px;height:2200px}
  .ui .ab0{position:absolute}
  .ui .kk{font-size:12.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:#4A5057}
  .ui .ttl{font-family:InterTight;font-weight:800;font-size:36px;letter-spacing:-.035em;color:${T.ink}}
  .ui .lead{font-size:15px;line-height:1.48;color:#2E343A}
  .ui .chp{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 8px;border-radius:5px;font-size:12px;font-weight:650;white-space:nowrap}
  .ui .chp.g{background:${T.grnbg};color:${T.grn}}.ui .chp.r{background:${T.redbg};color:${T.red}}.ui .chp.k{background:#14181D;color:#fff;border-radius:11px}
  .ui .chp.n{background:#ECE8E1;color:#2A3036}.ui .chp.o{background:#FCE9D9;color:#B8500A}
  .ui .sv{display:inline-grid;place-items:center;height:20px;padding:0 6px;border-radius:4px;font-size:11.5px;font-weight:750;white-space:nowrap}
  .ui .sv.s1{background:${T.red};color:#fff}.ui .sv.s2{background:#F6A04D;color:#3A1D00;border:1px solid #C96A12}.ui .sv.s3{background:#fff;color:#2A3036;border:1px solid #2A3036}
  .ui .box{background:#fff;border:1px solid ${T.line};border-radius:12px}
  .ui .btn2{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 12px;border:1px solid #D2CEC7;border-radius:7px;background:#fff;font-size:14px;font-weight:550;color:${T.ink};white-space:nowrap}
  .ui .btn2.or{background:${T.or};border-color:${T.or};color:#fff}
  .ui .btn2.dk{background:#14181D;border-color:#14181D;color:#fff}
  /* tableau Sev 1 / 2 / 3 */
  .ui .brd{position:absolute;border:1px solid ${T.line};border-radius:14px;background:#fff}
  .ui .brd .bh{position:absolute;left:17px;top:18px;display:flex;align-items:center;gap:14px}
  .ui .brd .bh .hd{font-size:18px}
  .ui .brd .pb{width:152px;height:6px;border-radius:3px;background:#E4E4E4;overflow:hidden}
  .ui .brd .pb i{display:block;height:100%;background:#2DB84C;border-radius:3px}
  .ui .brd .bh span{font-size:13.5px;color:#4A5057}.ui .brd .bh span b{color:${T.ink}}
  .ui .brd .add{position:absolute;right:16px;top:14px}
  .ui .col{position:absolute;top:57px;width:353px;border-radius:14px;padding:13px 13px 13px}
  .ui .col.c1{background:${T.s1}}.ui .col.c2{background:${T.s2}}.ui .col.c3{background:${T.s3}}
  .ui .col .ch{height:50px;position:relative;padding:3px 3px 0}
  .ui .col .ch .a{display:flex;align-items:center;gap:7px;font-size:15px;color:#4A5057}
  .ui .col .ch .a b{font-family:InterTight;font-weight:800;font-size:16px;color:${T.ink}}
  .ui .col .ch .a i{width:10px;height:10px;border-radius:50%}
  .ui .col .ch .s{font-size:12.5px;color:#5E656C;margin-top:4px}
  .ui .col .ch .n{position:absolute;right:3px;top:2px;min-width:24px;height:22px;border-radius:11px;background:#fff;display:grid;place-items:center;font-size:12.5px;font-weight:700}
  .ui .col .stack{position:relative}
  .ui .col .empty{height:62px;display:grid;place-items:center;font-size:13.5px;color:#7A8188}
  .ui .col .drop{position:absolute;left:0;right:0;top:0;height:62px;border:1.5px dashed #9AA0A6;border-radius:9px;display:grid;place-items:center;font-size:13px;font-weight:600;color:#4A5057;background:rgba(255,255,255,.4)}
  .ui .cd{position:absolute;left:0;width:327px;background:#fff;border-radius:9px;box-shadow:0 1px 2px rgba(20,24,30,.07),0 0 0 1px rgba(20,24,30,.05);padding:13px 14px 0 15px}
  .ui .cd.r1{box-shadow:inset 4px 0 0 ${T.red},0 1px 2px rgba(20,24,30,.07),0 0 0 1px rgba(20,24,30,.05)}
  .ui .cd .h{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#4A5057;height:24px}
  .ui .cd .h .ic{color:#6A7178}
  .ui .cd .cb{position:absolute;right:13px;top:12px;width:25px;height:25px;border-radius:50%;border:1.5px solid #B9BEC4;background:#fff;display:grid;place-items:center;color:#fff}
  .ui .cd .t{margin-top:4px;font-family:InterTight;font-weight:750;font-size:14.5px;line-height:1.36;letter-spacing:-.015em;color:${T.ink};padding-right:18px}
  .ui .cd .m{margin-top:7px;display:flex;gap:10px;font-size:13px;color:#4A5057}
  .ui .cd .m b{color:${T.red};font-weight:650}.ui .cd .m b.k{color:${T.ink}}
  .ui .cd .tg{margin-top:8px;display:flex;gap:6px;flex-wrap:wrap}
  .ui .cd .f{margin-top:11px;border-top:1px solid #ECE9E4;height:38px;display:flex;align-items:center;justify-content:space-between;font-size:13.5px;color:#3A4047}
  .ui .cd .f span{display:flex;align-items:center;gap:4px}
  .ui .cd.done{background:rgba(255,250,245,.75);box-shadow:none;border:1px dashed #E8D6C4;padding-bottom:12px}
  .ui .cd.done .t{color:#7A8188;text-decoration:line-through;font-weight:600;padding-left:28px;margin-top:0}
  .ui .cd .ok{position:absolute;left:13px;top:13px;width:21px;height:21px;border-radius:50%;background:#2DB84C;display:grid;place-items:center;color:#fff}
  .ui .cd .dn{font-size:12.5px;color:#7A8188;padding-left:28px;margin-top:4px}
  /* colonne de droite */
  .ui .nm{position:absolute;border:1px solid ${T.line};border-top:4px solid ${T.or};border-radius:14px;background:#fff;padding:20px 17px}
  .ui .nm .k{font-size:12px;font-weight:700;letter-spacing:.16em;color:${T.or}}
  .ui .nm .r{display:flex;gap:12px;margin-top:10px}
  .ui .nm .r .hd{font-size:30px;letter-spacing:-.04em}
  .ui .nm .r b{font-family:InterTight;font-weight:800;font-size:15px;line-height:1.3;letter-spacing:-.02em}
  .ui .nm .r span{display:block;font-size:13px;color:#4A5057;margin-top:4px}
  .ui .nm p{margin-top:14px;font-size:14px;line-height:1.45}
  .ui .nm ul{margin:10px 0 0 18px;font-size:13px;line-height:1.5;color:#3A4047}
  .ui .lt{position:absolute;border:1px solid ${T.line};border-radius:14px;background:#fff;padding:18px 20px}
  .ui .lt .k{font-size:12px;font-weight:700;letter-spacing:.16em;color:#3A4047}
  .ui .lt .row{display:flex;gap:22px;padding:11px 0;border-bottom:1px solid #ECE9E4;font-size:14px}
  .ui .lt .row:last-child{border:0}
  .ui .lt .row b{font-weight:700;min-width:36px}.ui .lt .row div b{display:block;font-weight:650}.ui .lt .row div span{font-size:13px;color:#4A5057}
  .ui .t5{position:absolute;border:1px solid ${T.line};border-radius:14px;background:#fff;padding:18px 9px 14px 11px}
  .ui .t5 .k{font-size:12px;font-weight:700;letter-spacing:.16em;color:#3A4047;padding-left:10px}
  .ui .t5 .rows{position:relative;margin-top:12px;height:330px}
  .ui .t5 .rw{position:absolute;left:0;right:0;height:60px;border-radius:7px;display:flex;align-items:center;gap:12px;padding:0 12px 0 14px}
  .ui .t5 .rw.s1{background:${T.s1};box-shadow:inset 3px 0 0 ${T.red}}.ui .t5 .rw.s2{background:${T.s2};box-shadow:inset 3px 0 0 #F6A04D}
  .ui .t5 .rw .no{font-family:InterTight;font-weight:800;font-size:17px;width:12px}
  .ui .t5 .rw .nm2{flex:1;min-width:0}.ui .t5 .rw .nm2 b{display:block;font-family:InterTight;font-weight:750;font-size:14px;letter-spacing:-.02em;white-space:nowrap}
  .ui .t5 .rw .nm2 span{font-size:12.5px;color:#4A5057}
  .ui .t5 .rw .amt{text-align:right;font-size:13px;font-weight:750;color:${T.red}}
  .ui .t5 .rw .amt .sv{display:grid;margin:0 0 3px auto}
  .ui .t5 .ft2{font-size:13px;color:#4A5057;padding:6px 10px 0}
  /* toast de la plateforme */
  .jtoast{position:absolute;background:${T.toast};color:#fff;border-radius:9px;padding:15px 18px;font-size:15px;line-height:1.4;display:flex;gap:26px;align-items:center;box-shadow:0 18px 40px rgba(0,0,0,.28);font-family:InterV}
  .jtoast .tx{flex:1}.jtoast .tx span{display:block;font-size:13px;color:#B5BCC4;margin-top:4px}
  .jtoast .un{color:${T.amz};font-weight:700}
  /* fenêtre d'une tâche */
  .ui .dim{position:absolute;inset:0;background:rgba(20,26,34,.55)}
  .ui .mdl{position:absolute;left:386px;top:30px;width:1228px;height:1065px;background:${T.bg};border-radius:12px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.35)}
  .ui .mdl .top{position:absolute;left:0;right:0;top:0;height:6px;background:${T.or}}
  .ui .mdl .hdr{position:absolute;left:0;right:0;top:6px;height:136px;background:#fff;border-bottom:1px solid ${T.line}}
  .ui .mdl .crumb{position:absolute;left:23px;top:21px;display:flex;gap:7px;align-items:center;font-size:13px;font-weight:600;color:#3A4047}
  .ui .mdl .mt2{position:absolute;left:23px;top:46px;font-size:26px}
  .ui .mdl .chs{position:absolute;left:23px;top:89px;display:flex;gap:7px}
  .ui .mdl .chs .chp{height:26px;font-size:13px;border-radius:13px;padding:0 10px}
  .ui .mdl .mv{position:absolute;right:58px;top:22px;display:flex;align-items:center;gap:6px;font-size:13px;color:#3A4047}
  .ui .mdl .mv i{width:28px;height:28px;border:1px solid #D2CEC7;border-radius:6px;display:grid;place-items:center;font-style:normal;font-weight:700;background:#fff}
  .ui .mdl .mv i.on{background:${T.or};border-color:${T.or};color:#fff}
  .ui .mdl .dn2{position:absolute;right:58px;top:60px;width:122px;height:30px;border:1.5px solid #4CB86A;border-radius:7px;background:#EAF7EC;color:${T.grn};font-weight:650;font-size:14px;display:grid;place-items:center}
  .ui .mdl .lc{position:absolute;left:24px;top:160px;width:566px}
  .ui .mdl .ex{background:#fff;border:1px solid ${T.line};border-left:4px solid ${T.or};border-radius:10px;padding:18px 16px 16px}
  .ui .mdl .ex .k,.ui .mdl .dr .k{font-size:12px;font-weight:700;letter-spacing:.14em;color:#3A4047}
  .ui .mdl .ex .big{margin-top:14px;font-size:17px;line-height:1.42;color:${T.ink};font-weight:500}
  .ui .mdl .ex .sm{margin-top:8px;font-size:13.5px;color:#3A4047}
  .ui .mdl .cx{margin-top:12px;background:#F1EEE8;border-radius:8px;padding:12px 14px 12px 30px;font-size:13.5px;line-height:1.48;color:#2E343A}
  .ui .mdl .cx .k{margin-left:-16px;margin-bottom:6px;font-size:11.5px}
  .ui .mdl .why{margin-top:10px;background:#FBEADC;border-radius:8px;padding:10px 12px;display:flex;gap:10px;font-size:13.5px;line-height:1.45}
  .ui .mdl .tiles{margin-top:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
  .ui .mdl .tiles div{background:#fff;border:1px solid ${T.line};border-radius:8px;padding:11px 12px;font-size:12.5px;color:#4A5057;min-height:60px}
  .ui .mdl .tiles b{display:block;margin-top:5px;font-family:InterTight;font-weight:800;font-size:15px;letter-spacing:-.02em;color:${T.ink}}
  .ui .mdl .dr{position:absolute;left:609px;top:160px;width:596px;background:#fff;border:1px solid ${T.line};border-radius:10px;padding:18px 16px}
  .ui .mdl .dr .to{margin-top:10px;font-size:13.5px;color:#3A4047}
  .ui .mdl .dr .sj{margin-top:12px;border:1px solid #D9D5CE;border-radius:6px;height:38px;display:flex;align-items:center;padding:0 13px;font-size:14px;font-weight:600}
  .ui .mdl .dr .bdy{margin-top:10px;border:1px solid #D9D5CE;border-radius:6px;height:346px;padding:14px;font-size:14.5px;line-height:1.55;color:${T.ink};overflow:hidden}
  .ui .mdl .dr .rw2{margin-top:12px;border:1px solid #D9D5CE;border-radius:8px;padding:10px 12px}
  .ui .mdl .dr .rw2 .q{display:flex;align-items:center;gap:10px;font-size:13.5px;color:#5E656C}
  .ui .mdl .dr .rw2 .q .btn2{margin-left:auto;height:28px;border-radius:14px;background:#8F959B;border-color:#8F959B;color:#fff;font-size:12.5px}
  .ui .mdl .dr .rw2 .o{margin-top:8px;display:flex;gap:7px;padding-left:34px}
  .ui .mdl .dr .rw2 .o span{border:1px solid #D9D5CE;border-radius:13px;padding:3px 10px;font-size:12.5px;color:#3A4047}
  .ui .mdl .dr .sc{margin-top:16px;display:flex;align-items:center;gap:10px;font-size:13.5px;color:#3A4047}
  .ui .mdl .dr .sc .pill{background:#DDF2E1;color:${T.grn};border-radius:11px;padding:3px 9px;font-weight:600}
  .ui .mdl .dr .sc .pill b{font-weight:800;color:${T.ink}}
  .ui .mdl .dr .bt{margin-top:12px;display:flex;gap:8px}
  `;

  // ---------- coquille commune : barre latérale + barre du haut ----------
  const NAV = [
    { id: 'today', y: 125, icon: 'sun', name: 'Today', bd: 4 },
    { h: 'Amazon Ads', y: 172 },
    { id: 'campaigns', y: 203, icon: 'area-chart', name: 'Campaigns', bd: 4, o: 1 },
    { id: 'trouble', y: 241, icon: 'route', name: 'Troubleshooting', bd: 3, o: 1 },
    { id: 'news', y: 279, icon: 'volume-2', name: "What's new", bd: 36 },
    { h: 'My Book of Business', y: 326 },
    { id: 'clients', y: 357, icon: 'users', name: 'Clients', bd: 6 },
    { id: 'agenda', y: 395, icon: 'calendar', name: 'Agenda', bd: 4 },
    { id: 'goals', y: 433, icon: 'check', name: 'Goals 2026', bd: 3, o: 1 },
    { h: 'Your queue', y: 480 },
    { id: 'write', y: 511, icon: 'sparkles', name: 'Write' },
    { id: 'settings', y: 1013, icon: 'settings', name: 'Settings', bd: 16 },
  ];
  J.shell = () => `
    <div class="sb"><div class="lg">${J.jarvisLogo(40)}<div><b>JARVIS</b>${BRAND.logo(70)}</div></div>
      ${NAV.map(n => n.h ? `<div class="sh" style="top:${n.y - 7}px">${n.h}</div>`
        : `<div class="it" data-id="${n.id}" style="top:${n.y}px">${ic(n.icon, 17)}<span>${n.name}</span>${n.bd ? `<span class="bd${n.o ? ' o' : ''}">${n.bd}</span>` : ''}</div>`).join('')}
      <div class="ft"></div><div class="ab"><i></i>AI briefing · 08:00</div><div class="nx">Next at 10:00</div></div>
    <div class="tb"><div class="sr">${ic('search', 16)}<span>Ask JARVIS, or jump to a campaign or an account</span><kbd>Ctrl K</kbd></div>
      <div class="mt">${ic('calendar', 15)}<b>09:45 · in 1 h 31</b><span>Weekly - Dentsu GAE x Amazon Ads</span></div>
      <div class="st"><span><i></i>Mail &amp; Slack <b>08:00</b></span><span><i class="r"></i>DSP <b class="r">28/10</b></span><span><i></i>Goals <b>29/10</b></span><span>Fri 30 Oct</span></div></div>`;

  // ---------- cartes du tableau ----------
  // src : [icône, préfixe, nom] · meta : [échéance en rouge, propriétaire] · tags : [[classe, texte], ...]
  J.card = (c, cls = '') => `<div class="cd ${cls}" data-k="${c.k}"><div class="h">${ic(c.icon || 'mail', 13)}${c.pre ? `<span>${c.pre}</span>` : ''}<span>${esc(c.src)}</span></div>
      <div class="cb"></div><div class="t">${esc(c.t)}</div>
      <div class="m">${c.due ? `<b class="${c.dueK ? 'k' : ''}">${c.due}</b>` : ''}<span>${c.own || 'You own it'}</span></div>
      ${c.tags && c.tags.length ? `<div class="tg">${c.tags.map(g => `<span class="chp ${g[0]}">${g[1]}</span>`).join('')}</div>` : ''}
      <div class="f"><span>${ic('more-v', 13)}Open</span>${ic('x', 13)}</div></div>`;
  J.doneCard = (t, k) => `<div class="cd done" data-k="${k}"><div class="ok">${ic('check', 13)}</div><div class="t">${esc(t)}</div><div class="dn">Done 08:14</div></div>`;

  J.toast = (main, sub, undo = true) => `<div class="jtoast"><div class="tx">${main}${sub ? `<span>${sub}</span>` : ''}</div>${undo ? '<div class="un">Undo</div>' : ''}</div>`;
})();
