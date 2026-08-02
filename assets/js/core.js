/* ==========================================================================
   Le Programmatique — moteur commun
   Navigation, apparitions au scroll, parallaxe, compteurs, palette de
   commande, transitions de page, fond animé du hero.
   ========================================================================== */
(() => {
  'use strict';

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => RM.matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ==================================================================
     0. Format de session — 45 min / 1 h / 90 min
     Chaque section porte data-level="core|standard|full". On masque
     tout ce qui dépasse le rang du format retenu. Le choix est
     mémorisé et s'applique à l'ensemble du site.
     ================================================================== */
  const FORMATS = {
    essentiel: { rank: 1, chip: '45 min', total: '45 minutes', name: 'Essentiel' },
    standard: { rank: 2, chip: '1 h', total: '1 heure', name: 'Standard' },
    complet: { rank: 3, chip: '90 min', total: '90 minutes', name: 'Complet' },
  };
  const LVL = { core: 1, standard: 2, full: 3 };
  const SUFFIX = { essentiel: 'E', standard: 'S', complet: 'C' };
  let fmt = 'complet';

  const readFormat = () => {
    try {
      const v = localStorage.getItem('lp-format');
      return FORMATS[v] ? v : 'complet';
    } catch (e) {
      return 'complet';
    }
  };

  function applyFormat(next, persist) {
    fmt = FORMATS[next] ? next : 'complet';
    if (persist) {
      try { localStorage.setItem('lp-format', fmt); } catch (e) { /* mode privé */ }
    }
    const rank = FORMATS[fmt].rank;
    const sfx = SUFFIX[fmt];
    document.documentElement.dataset.format = fmt;

    // Masquage des sections, des liens de sous-navigation et des blocs
    $$('[data-level]').forEach((el) =>
      el.classList.toggle('is-fmt-hidden', LVL[el.dataset.level] > rank)
    );

    // Libellés dépendant du format
    $$('[data-fmt-chip]').forEach((el) => { el.textContent = FORMATS[fmt].chip; });
    $$('[data-fmt-total]').forEach((el) => { el.textContent = FORMATS[fmt].total; });
    $$('[data-fmt-name]').forEach((el) => { el.textContent = FORMATS[fmt].name; });
    $$('[data-txt-e]').forEach((el) => {
      const v = el.dataset['txt' + sfx];
      if (v) el.textContent = v;
    });

    // État des cartes de choix
    $$('[data-fmt-set]').forEach((b) => b.classList.toggle('is-on', b.dataset.fmtSet === fmt));

    updateFormatBar();
    document.dispatchEvent(new CustomEvent('lp:format', { detail: fmt }));
  }

  /** Bandeau de rappel : n'apparaît que si des sections sont masquées. */
  function updateFormatBar() {
    const bar = $('[data-fmt-bar]');
    if (!bar) return;
    // Seules les sections « réelles » comptent : les diapositives de suite
    // créées par le mode présentation n'ont pas d'identifiant.
    const hidden = $$('section[id][data-level].is-fmt-hidden').length;
    bar.hidden = hidden === 0;
    const c = $('[data-fmt-bar-count]', bar);
    if (c) {
      c.textContent = hidden === 1
        ? '1 section est masquée sur ce chapitre.'
        : hidden + ' sections sont masquées sur ce chapitre.';
    }
  }

  function formatUI() {
    const modal = $('[data-fmt-modal]');
    const close = () => {
      if (!modal) return;
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    const open = () => {
      if (!modal) return;
      const mm = $('.mobile-menu');
      if (mm && mm.classList.contains('is-open')) {
        mm.classList.remove('is-open');
        const b = $('.burger');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    $$('[data-fmt-open]').forEach((b) => b.addEventListener('click', open));
    $$('[data-fmt-close]').forEach((b) => b.addEventListener('click', close));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) close();
    });

    $$('[data-fmt-set]').forEach((b) =>
      b.addEventListener('click', () => {
        applyFormat(b.dataset.fmtSet, true);
        if (modal && modal.classList.contains('is-open')) setTimeout(close, 280);
      })
    );
    $$('[data-fmt-all]').forEach((b) =>
      b.addEventListener('click', () => applyFormat('complet', true))
    );
  }

  /* ==================================================================
     0 bis. Mode présentation — une section par écran
     Chaque section devient une diapositive plein écran ; le contenu est
     mis à l'échelle pour tenir sans défilement interne.
     ================================================================== */
  const ICON_PRESENT =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8"/><path d="M12 16v5"/></svg>';

  let presenting = false;

  const slides = () =>
    $$('main > section').filter((s) => !s.classList.contains('is-fmt-hidden'));

  /** Rapport hauteur disponible / hauteur nécessaire pour une diapositive.
   *  Marge de 6 px : les arrondis de rendu ne doivent jamais faire déborder
   *  le contenu sous la barre de pilotage. */
  function fitRatio(sec, wrap) {
    const cs = getComputedStyle(sec);
    const avail =
      sec.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 6;
    const need = wrap.scrollHeight;
    return need > 0 ? Math.min(1, avail / need) : 1;
  }

  /** Blocs de contenu déplaçables : ni l'en-tête de section, ni l'étiquette
   *  « suite » (la compter produisait des diapositives vides). */
  const movableKids = (wrap) =>
    Array.from(wrap.children).filter(
      (n) => !n.classList.contains('sec-head') && !n.classList.contains('slide-cont__tag')
    );

  /**
   * Dernier recours quand il ne reste qu'un seul bloc : si c'est une grille
   * de cartes, on la coupe en deux et la seconde moitié part sur la
   * diapositive suivante. Sans ça, une section comme le panorama des DSP
   * tombait à 35 % d'échelle — lisible sur un écran, pas sur un projecteur.
   */
  function splitGrid(hostWrap, contWrap) {
    const only = movableKids(hostWrap)[0];
    if (!only || only.classList.contains('demo')) return false;
    // Uniquement les vraies grilles de cartes, à plusieurs colonnes : couper
    // un module en deux n'aurait aucun sens.
    const cs = getComputedStyle(only);
    const cols = (cs.gridTemplateColumns || '').split(/\s+/).filter(Boolean).length;
    if (!cs.display.includes('grid') || cols < 2) return false;
    const kids = Array.from(only.children).filter((n) => n.nodeType === 1);
    if (kids.length < 2) return false;

    let clone = Array.from(contWrap.children).find((n) => n._origin === only);
    if (!clone) {
      clone = only.cloneNode(false);
      clone.dataset.gridCont = '1';
      clone._origin = only;
      contWrap.appendChild(clone);
    }
    // Les cartes déplacées passent en tête du clone pour garder leur ordre.
    kids.slice(Math.ceil(kids.length / 2)).reverse()
      .forEach((n) => clone.insertBefore(n, clone.firstChild));
    return true;
  }

  /**
   * Une section trop dense se lit mal une fois réduite. Plutôt que de la
   * rétrécir à 45 %, on la coupe en plusieurs diapositives : les blocs de
   * fin partent sur un écran « suite ». Les nœuds sont déplacés, pas
   * clonés — les écouteurs des modules interactifs survivent.
   */
  function splitSection(sec) {
    const wrap = sec.querySelector(':scope > .wrap');
    if (!wrap || sec.classList.contains('hero')) return;
    let host = sec, hostWrap = wrap, guard = 0;

    while (guard++ < 5 && fitRatio(host, hostWrap) < 0.78) {
      if (movableKids(hostWrap).length <= 1) break;

      const cont = document.createElement('section');
      cont.className = sec.className;
      cont.dataset.slideCont = '1';
      if (sec.dataset.level) cont.dataset.level = sec.dataset.level;
      const cw = document.createElement('div');
      cw.className = wrap.className;
      const tag = document.createElement('div');
      tag.className = 'slide-cont__tag';
      tag.textContent = (sec.querySelector('.kicker')?.textContent || 'Suite').trim() + ' — suite';
      cw.appendChild(tag);
      cont.appendChild(cw);
      host.after(cont);
      cont._origin = sec;

      let g2 = 0;
      while (g2++ < 24) {
        const kids = movableKids(hostWrap);
        if (kids.length <= 1) break;
        cw.insertBefore(kids[kids.length - 1], cw.children[1] || null);
        if (fitRatio(host, hostWrap) >= 0.84) break;
      }
      // Plus rien à déplacer et ça ne tient toujours pas : on coupe la
      // grille, autant de fois que nécessaire.
      let g3 = 0;
      while (g3++ < 4 && fitRatio(host, hostWrap) < 0.72) {
        if (!splitGrid(hostWrap, cw)) break;
      }

      host = cont;
      hostWrap = cw;
    }

    // Dernier recours pour les modules irréductibles (le simulateur
    // d'enchère) : le chapeau passe à la trappe, le titre porte le contexte.
    if (fitRatio(sec, wrap) < 0.76) {
      const lead = sec.querySelector('.sec-head .lead');
      if (lead) lead.classList.add('is-slide-trim');
    }
  }

  /** Rend au DOM sa forme de lecture. */
  function unsplit() {
    $$('.is-slide-trim').forEach((n) => n.classList.remove('is-slide-trim'));
    $$('section[data-slide-cont]').forEach((cont) => {
      const origin = cont._origin;
      const cw = cont.querySelector(':scope > .wrap');
      const target = origin && origin.querySelector(':scope > .wrap');
      if (target && cw) {
        Array.from(cw.children).forEach((n) => {
          if (n.classList.contains('slide-cont__tag')) return;
          // Moitié de grille : ses cartes retournent dans la grille d'origine,
          // le conteneur cloné disparaît avec la section.
          if (n.dataset && n.dataset.gridCont && n._origin) {
            Array.from(n.children).forEach((c) => n._origin.appendChild(c));
            return;
          }
          target.appendChild(n);
        });
      }
      cont.remove();
    });
  }

  /** Recalcule seulement l'échelle des diapositives existantes.
   *  Sans toucher au DOM : utilisable à tout moment sans faire sauter la
   *  position de lecture. */
  function refit() {
    if (!presenting) return;
    slides().forEach((sec) => {
      const wrap = sec.querySelector(':scope > .wrap');
      if (!wrap || sec.classList.contains('hero')) return;
      const prev = wrap.style.getPropertyValue('--fit');
      wrap.style.setProperty('--fit', '1');
      const k = fitRatio(sec, wrap).toFixed(3);
      // On ne réécrit que si la valeur change, pour éviter un repaint inutile.
      if (k !== prev) wrap.style.setProperty('--fit', k);
      else wrap.style.setProperty('--fit', prev);
    });
    updateHud();
  }

  /** Découpe puis ajuste chaque diapositive. Reconstruit le DOM : à ne
   *  lancer qu'à l'entrée en présentation, au redimensionnement ou au
   *  changement de format. */
  function fitSlides() {
    if (!presenting) return;
    unsplit();
    $$('main > section').forEach((sec) => {
      const wrap = sec.querySelector(':scope > .wrap');
      if (wrap) wrap.style.setProperty('--fit', '1');
    });
    $$('main > section').forEach((sec) => {
      if (!sec.classList.contains('is-fmt-hidden')) splitSection(sec);
    });
    refit();
  }

  /** Position d'un élément dans le document, sans passer par offsetTop
   *  (dont le référentiel dépend de l'ancêtre positionné le plus proche). */
  const docTop = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);

  /** Diapositive dont le haut est le plus proche du haut de fenêtre. */
  const currentSlide = () => {
    const list = slides();
    let best = 0, bestD = Infinity;
    list.forEach((s, k) => {
      const d = Math.abs(docTop(s) - window.scrollY);
      if (d < bestD) { bestD = d; best = k; }
    });
    return best;
  };

  function updateHud() {
    const hud = $('.present-hud');
    if (!hud || !presenting) return;
    const list = slides();
    const i = currentSlide();
    $('[data-present-i]', hud).textContent = i + 1;
    $('[data-present-n]', hud).textContent = list.length;
    $('[data-present-prev]', hud).disabled = i <= 0;
    $('[data-present-next]', hud).disabled = i >= list.length - 1;
    const cur = list[i];
    const label = cur
      ? (cur.querySelector('.kicker, h1, h2')?.textContent || '').trim()
      : '';
    $('[data-present-title]', hud).textContent = label;
  }

  /** Amène la diapositive `i` exactement en haut de fenêtre. */
  function toSlide(i, smooth) {
    const list = slides();
    const n = Math.max(0, Math.min(list.length - 1, i));
    if (!list[n]) return;
    window.scrollTo({
      top: docTop(list[n]),
      behavior: smooth && !reduced() ? 'smooth' : 'auto',
    });
    setTimeout(updateHud, 40);
  }

  function goSlide(dir) {
    toSlide(currentSlide() + dir, true);
  }

  function setPresent(on, persist) {
    presenting = on;
    document.documentElement.classList.toggle('is-present', on);
    document.body.classList.toggle('is-present', on);
    $$('[data-present-toggle]').forEach((b) => {
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    if (persist) {
      try { localStorage.setItem('lp-present', on ? '1' : '0'); } catch (e) { /* mode privé */ }
    }
    if (on) {
      // Les titres découpés doivent être visibles d'emblée.
      $$('[data-split], [data-reveal]').forEach((n) => n.classList.add('is-in'));
      requestAnimationFrame(() => {
        const before = currentSlide();
        fitSlides();
        toSlide(before, false);
      });
      // Le premier calcul peut tomber avant que les polices web ne soient
      // appliquées : les hauteurs bougent encore. On repasse une fois la
      // mise en page stabilisée, sinon la première diapositive lue reste
      // calée sur des mesures périmées.
      setTimeout(refit, 260);
      setTimeout(refit, 900);
    } else {
      unsplit();
      $$('main > section > .wrap').forEach((w) => w.style.removeProperty('--fit'));
    }
  }

  function presentUI() {
    if (!$('main')) return;

    // Bouton de bascule, injecté à côté de la puce de format.
    const chip = $('.fmt-chip[data-fmt-open]');
    if (chip && !$('[data-present-toggle]')) {
      const b = document.createElement('button');
      b.className = 'iconbtn';
      b.setAttribute('data-present-toggle', '');
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('title', 'Mode présentation (P)');
      b.setAttribute('aria-label', 'Mode présentation');
      b.innerHTML = ICON_PRESENT;
      chip.after(b);
    }

    // Sur petit écran la puce disparaît de la barre : on la retrouve ici.
    const menu = $('.mobile-menu');
    if (menu && !$('[data-present-toggle]', menu)) {
      const mb = document.createElement('button');
      mb.className = 'btn btn--ghost mt-s';
      mb.style.width = 'max-content';
      mb.setAttribute('data-present-toggle', '');
      mb.setAttribute('aria-pressed', 'false');
      mb.innerHTML = ICON_PRESENT + ' Mode présentation';
      menu.appendChild(mb);
    }

    // Barre de pilotage.
    if (!$('.present-hud')) {
      const hud = document.createElement('div');
      hud.className = 'present-hud';
      hud.innerHTML =
        '<button data-present-prev aria-label="Diapositive précédente"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>' +
        '<span class="present-hud__n"><b data-present-i>1</b> / <span data-present-n>1</span></span>' +
        '<button data-present-next aria-label="Diapositive suivante"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>' +
        '<span class="present-hud__t" data-present-title></span>' +
        '<button class="present-hud__exit" data-present-exit>Quitter</button>';
      document.body.appendChild(hud);
      $('[data-present-prev]', hud).addEventListener('click', () => goSlide(-1));
      $('[data-present-next]', hud).addEventListener('click', () => goSlide(1));
      $('[data-present-exit]', hud).addEventListener('click', () => setPresent(false, true));
    }

    $$('[data-present-toggle]').forEach((b) =>
      b.addEventListener('click', () => setPresent(!presenting, true))
    );

    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
      if (typing) return;
      if ((e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPresent(!presenting, true);
        return;
      }
      if (!presenting) return;
      if (e.key === 'Escape') { setPresent(false, true); return; }
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        goSlide(1);
      }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        goSlide(-1);
      }
    });

    // La molette et le trackpad avancent d'une diapositive à la fois. On
    // remplace ainsi le scroll-snap CSS, qui se calait mal ici.
    let wheelLock = false, wheelAcc = 0;
    window.addEventListener('wheel', (e) => {
      if (!presenting) return;
      if (e.ctrlKey) return;                       // zoom navigateur
      if (e.target.closest('.palette, .fmt-modal')) return;
      e.preventDefault();
      if (wheelLock) return;
      wheelAcc += e.deltaY;
      if (Math.abs(wheelAcc) < 24) return;
      const dir = wheelAcc > 0 ? 1 : -1;
      wheelAcc = 0;
      wheelLock = true;
      goSlide(dir);
      setTimeout(() => { wheelLock = false; }, 640);
    }, { passive: false });

    // Balayage vertical sur écran tactile.
    let touchY = null;
    window.addEventListener('touchstart', (e) => {
      touchY = presenting && e.touches.length === 1 ? e.touches[0].clientY : null;
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
      if (!presenting || touchY === null) return;
      const dy = touchY - (e.changedTouches[0] ? e.changedTouches[0].clientY : touchY);
      touchY = null;
      if (Math.abs(dy) > 60) goSlide(dy > 0 ? 1 : -1);
    }, { passive: true });

    let raf = null;
    window.addEventListener('scroll', () => {
      if (!presenting || raf) return;
      raf = requestAnimationFrame(() => { raf = null; updateHud(); });
    }, { passive: true });

    let rz = null;
    window.addEventListener('resize', () => {
      clearTimeout(rz);
      rz = setTimeout(fitSlides, 140);
    });
    document.addEventListener('lp:format', () => setTimeout(fitSlides, 60));
    // Polices et images changent les hauteurs après coup : on réajuste
    // l'échelle sans redécouper, donc sans déplacer la lecture.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
    window.addEventListener('load', refit);

    let stored = '0';
    try { stored = localStorage.getItem('lp-present') || '0'; } catch (e) { /* mode privé */ }
    if (stored === '1') setPresent(true, false);
  }

  /* ---------------------------------------------------------------- 1. Préloader */
  function preloader() {
    const el = $('.preload');
    if (!el) return;
    const seen = sessionStorage.getItem('lp-seen');
    if (seen || reduced()) {
      el.remove();
      document.body.classList.add('is-ready');
      return;
    }
    sessionStorage.setItem('lp-seen', '1');
    const done = () => {
      el.classList.add('is-done');
      document.body.classList.add('is-ready');
      setTimeout(() => el.remove(), 700);
    };
    setTimeout(done, 1500);
    el.addEventListener('click', done);
  }

  /* ---------------------------------------------------------------- 2. Nav */
  function nav() {
    const bar = $('.nav');
    const burger = $('.burger');
    const menu = $('.mobile-menu');
    const prog = $('.progress');
    const top = $('.totop');

    if (burger && menu) {
      const toggle = (open) => {
        burger.setAttribute('aria-expanded', String(open));
        menu.classList.toggle('is-open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
          $$('a', menu).forEach((a, i) => { a.style.animationDelay = 60 + i * 45 + 'ms'; });
        }
      };
      burger.addEventListener('click', () =>
        toggle(burger.getAttribute('aria-expanded') !== 'true')
      );
      $$('a', menu).forEach((a) => a.addEventListener('click', () => toggle(false)));
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
    }

    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (bar) bar.classList.toggle('is-stuck', y > 20);
      if (prog) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.transform = `scaleX(${h > 0 ? Math.min(y / h, 1) : 0})`;
      }
      if (top) top.classList.toggle('is-on', y > 700);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    if (top) top.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' })
    );
  }

  /* ---------------------------------------------------------------- 3. Apparitions */
  function reveals() {
    const items = $$('[data-reveal]');
    if (!items.length) return;
    if (reduced()) { items.forEach((n) => n.classList.add('is-in')); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });

    // Décalage automatique des enfants d'un même groupe
    $$('[data-stagger]').forEach((group) => {
      const step = parseInt(group.dataset.stagger, 10) || 80;
      $$('[data-reveal]', group).forEach((n, i) => {
        if (!n.style.getPropertyValue('--d')) n.style.setProperty('--d', i * step + 'ms');
      });
    });

    items.forEach((n) => io.observe(n));
  }

  /* ------------------------------------------------- 4. Titres mot par mot */
  function splitTitles() {
    $$('[data-split]').forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach((w, i) => {
        const wrap = document.createElement('span');
        wrap.className = 'split-word';
        const inner = document.createElement('span');
        inner.textContent = w;
        inner.style.setProperty('--d', i * 62 + 'ms');
        wrap.appendChild(inner);
        el.appendChild(wrap);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
      if (reduced()) { el.classList.add('is-in'); return; }
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } });
      }, { threshold: 0.15 });
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------- 5. Parallaxe */
  function parallax() {
    const nodes = $$('[data-parallax]');
    if (!nodes.length || reduced()) return;
    let raf = null;
    const run = () => {
      const vh = window.innerHeight;
      nodes.forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const speed = parseFloat(n.dataset.parallax) || 0.15;
        const center = r.top + r.height / 2 - vh / 2;
        n.style.transform = `translate3d(0, ${(-center * speed).toFixed(2)}px, 0)`;
      });
      raf = null;
    };
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(run); }, { passive: true });
    window.addEventListener('resize', run);
    run();
  }

  /* ---------------------------------------------------------------- 6. Compteurs */
  const fmtNum = (v, dec) =>
    v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  function counters() {
    const nodes = $$('[data-count]');
    if (!nodes.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        const to = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.dec || '0', 10);
        const pre = el.dataset.pre || '';
        const suf = el.dataset.suf || '';
        if (reduced()) { el.textContent = pre + fmtNum(to, dec) + suf; return; }
        const dur = parseInt(el.dataset.dur || '1500', 10);
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = pre + fmtNum(to * eased, dec) + suf;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    nodes.forEach((n) => io.observe(n));
  }

  /* ------------------------------------------------- 7. Halo au survol des cartes */
  function cardGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('mousemove', (e) => {
      const c = e.target.closest('.card');
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      c.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- 8. Sous-nav */
  function scrollSpy() {
    const links = $$('.subnav a[href^="#"]');
    if (!links.length) return;
    const map = new Map();
    links.forEach((a) => {
      const t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) map.set(t, a);
    });
    if (!map.size) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.remove('is-active'));
        const a = map.get(e.target);
        if (!a) return;
        a.classList.add('is-active');
        const bar = $('.subnav__inner');
        if (bar && bar.scrollWidth > bar.clientWidth) {
          const off = a.offsetLeft - bar.clientWidth / 2 + a.offsetWidth / 2;
          bar.scrollTo({ left: Math.max(off, 0), behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-22% 0px -68% 0px' });
    map.forEach((_, t) => io.observe(t));
  }

  /* ------------------------------------------------- 9. Marquee (duplication) */
  function marquees() {
    $$('.marquee__track').forEach((t) => {
      if (t.dataset.dup) return;
      t.dataset.dup = '1';
      t.innerHTML += t.innerHTML;
    });
  }

  /* ------------------------------------------- 10. Fond animé du hero (canvas) */
  function heroCanvas() {
    const cv = $('.hero__canvas');
    if (!cv || reduced()) return;
    const ctx = cv.getContext('2d');
    let w, h, dpr, parts, raf, mouse = { x: -999, y: -999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(Math.round((w * h) / 15000), 110);
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.7 + 0.5,
        o: Math.random() * 0.5 + 0.18,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // liens
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;

        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255,153,0,${0.22 * (1 - dm / 130)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 118) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(150,180,215,${0.13 * (1 - d / 118)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,183,77,${a.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    cv.parentElement.addEventListener('mousemove', (e) => {
      const r = cv.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    }, { passive: true });
    cv.parentElement.addEventListener('mouseleave', () => { mouse = { x: -999, y: -999 }; });
    draw();

    // Économie de ressources hors écran
    new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting && !raf) draw();
        else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0 }).observe(cv);
  }

  /* ------------------------------------------- 11. Palette de commande Ctrl+K */
  const INDEX = [
    { t: 'Accueil', d: 'Vue d’ensemble de la formation', u: 'index.html', g: 'Page' },
    { t: 'Le quiz d’entrée', d: '10 questions pour situer le niveau', u: 'quiz.html', g: 'Page' },
    { t: 'Glossaire', d: '27 termes du programmatique', u: 'glossaire.html', g: 'Page' },

    { t: 'Définition du programmatique', d: 'Achat automatisé, impression par impression', u: 'fondamentaux.html#definition', g: 'Ch. 1' },
    { t: 'L’écosystème', d: 'Annonceur, DSP, SSP, éditeurs', u: 'fondamentaux.html#ecosysteme', g: 'Ch. 1' },
    { t: 'Le cycle de l’enchère', d: 'Simulateur RTB en 120 ms', u: 'fondamentaux.html#enchere', g: 'Ch. 1' },
    { t: 'First price / second price', d: 'Simulateur de prix payé', u: 'fondamentaux.html#prix', g: 'Ch. 1' },
    { t: 'Media based vs audience based', d: 'Deux façons de cibler', u: 'fondamentaux.html#ciblage', l: 2, g: 'Ch. 1' },
    { t: 'Programmatique vs gré à gré', d: 'Comparatif sur 6 critères', u: 'fondamentaux.html#greagre', l: 2, g: 'Ch. 1' },
    { t: 'Les six avantages', d: 'Ce qu’il faut savoir citer', u: 'fondamentaux.html#avantages', g: 'Ch. 1' },
    { t: 'Les types de deals', d: 'Open Auction, PA, PD, PG', u: 'fondamentaux.html#deals', l: 2, g: 'Ch. 1' },
    { t: 'Priorité d’accès à l’inventaire', d: 'Quel deal sert l’impression, et pourquoi', u: 'fondamentaux.html#priorite', l: 2, g: 'Ch. 1' },
    { t: 'Cascade ou header bidding', d: 'Appels SSP en série ou en parallèle', u: 'fondamentaux.html#priorite', l: 2, g: 'Ch. 1' },
    { t: 'Supply Path Optimisation', d: '357 routes, 20 % de déperdition', u: 'fondamentaux.html#spo', l: 3, g: 'Ch. 1' },
    { t: 'Le paysage des DSP', d: 'Amazon DSP, DV360, The Trade Desk, Hawk', u: 'fondamentaux.html#dsp', l: 2, g: 'Ch. 1' },

    { t: 'Objectifs et KPI', d: 'Notoriété, engagement, conversion', u: 'campagne.html#objectifs', g: 'Ch. 2' },
    { t: 'La data', d: 'First, second et third party', u: 'campagne.html#data', g: 'Ch. 2' },
    { t: 'Inventaire et formats', d: 'Display, vidéo, audio, CTV, DOOH', u: 'campagne.html#inventaire', l: 2, g: 'Ch. 2' },
    { t: 'Paramétrage et go live', d: 'Checklist avant lancement', u: 'campagne.html#parametrage', g: 'Ch. 2' },
    { t: 'Optimisation', d: 'Quoi, et dans quel ordre', u: 'campagne.html#optimisation', l: 2, g: 'Ch. 2' },
    { t: 'Mesure et bilan', d: 'Média, comportement, business', u: 'campagne.html#mesure', g: 'Ch. 2' },

    { t: 'Cookies et identité', d: 'Où en est l’adressabilité', u: 'marche.html#cookies', g: 'Ch. 3' },
    { t: 'Les alternatives au cookie', d: 'Contexte, SSO, server-side, deals', u: 'marche.html#alternatives', l: 2, g: 'Ch. 3' },
    { t: 'La position Amazon', d: 'Signaux propriétaires, environnement logué', u: 'marche.html#amazon', g: 'Ch. 3' },
    { t: 'L’audio programmatique', d: 'Le média le plus sous-utilisé', u: 'marche.html#audio', l: 3, g: 'Ch. 3' },
    { t: 'CTV et TV segmentée', d: 'Le premier poste de croissance', u: 'marche.html#ctv', l: 2, g: 'Ch. 3' },
    { t: 'Le DOOH programmatique', d: 'Simulateur de déclencheurs', u: 'marche.html#dooh', l: 3, g: 'Ch. 3' },
    { t: 'L’inventaire Amazon', d: 'Prime Video, Twitch, Fire TV…', u: 'marche.html#inventaire-amazon', g: 'Ch. 3' },

    { t: 'Les interlocuteurs', d: 'Qui fait quoi chez l’agence', u: 'terrain.html#interlocuteurs', l: 2, g: 'Ch. 4' },
    { t: 'Les modèles d’achat', d: 'Transparent et non transparent', u: 'terrain.html#modeles', l: 3, g: 'Ch. 4' },
    { t: 'Un cas déroulé', d: 'Lancement gamme soin, 150 000 €', u: 'terrain.html#cas', g: 'Ch. 4' },
    { t: 'La structure de coûts', d: 'Où passent 100 € investis', u: 'terrain.html#couts', l: 2, g: 'Ch. 4' },
    { t: 'Les objections', d: '5 objections, 5 réponses', u: 'terrain.html#objections', g: 'Ch. 4' },
    { t: 'Les erreurs de setup', d: 'Les 5 pièges classiques', u: 'terrain.html#erreurs', l: 2, g: 'Ch. 4' },
  ];

  function palette() {
    const box = $('.palette');
    if (!box) return;
    const input = $('.palette__in', box);
    const res = $('.palette__res', box);
    let sel = 0, list = [];

    const norm = (s) =>
      s.normalize('NFD')
        .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
        .replace(/[’']/g, "'")
        .toLowerCase();

    const render = (q) => {
      const nq = norm(q);
      // Une section masquée par le format retenu ne doit pas être proposée :
      // le lien n'irait nulle part.
      const pool = INDEX.filter((i) => (i.l || 1) <= FORMATS[fmt].rank);
      list = nq
        ? pool.filter((i) => norm(i.t + ' ' + i.d + ' ' + i.g).includes(nq)).slice(0, 12)
        : pool.slice(0, 9);
      sel = 0;
      if (!list.length) {
        res.innerHTML = '<div class="palette__empty">Aucun résultat pour « ' + q + ' »</div>';
        return;
      }
      res.innerHTML = list
        .map((i, k) => `<a class="palette__item${k === 0 ? ' is-sel' : ''}" href="${i.u}">
            <span><b>${i.t}</b><small>${i.d}</small></span>
            <span class="palette__tag">${i.g}</span></a>`)
        .join('');
    };

    const open = () => {
      // Le menu mobile contient un bouton de recherche : il doit se refermer
      // avant que la palette prenne le focus.
      const mm = $('.mobile-menu');
      if (mm && mm.classList.contains('is-open')) {
        mm.classList.remove('is-open');
        const b = $('.burger');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      input.value = '';
      render('');
      setTimeout(() => input.focus(), 60);
    };
    const close = () => {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    $$('[data-palette-open]').forEach((b) => b.addEventListener('click', open));
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    input.addEventListener('input', () => render(input.value));

    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        box.classList.contains('is-open') ? close() : open();
        return;
      }
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!list.length) return;
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length;
        $$('.palette__item', res).forEach((n, i) => n.classList.toggle('is-sel', i === sel));
        const cur = $$('.palette__item', res)[sel];
        if (cur) cur.scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter' && list[sel]) { window.location.href = list[sel].u; }
    });
  }

  /* ------------------------------------------------- 12. Transitions de page */
  function pageFade() {
    if (reduced()) return;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
      if (/^(#|mailto:|tel:|http)/.test(href)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => { window.location.href = href; }, 240);
    });
    window.addEventListener('pageshow', () => document.body.classList.remove('is-leaving'));
  }

  /* ---------------------------------------------------------------- 13. Boot */
  const boot = () => {
    // Le format s'applique en premier : les titres découpés et les
    // apparitions au scroll doivent travailler sur le DOM déjà filtré.
    applyFormat(readFormat(), false);
    formatUI();
    preloader();
    nav();
    presentUI();
    splitTitles();
    reveals();
    parallax();
    counters();
    cardGlow();
    scrollSpy();
    marquees();
    heroCanvas();
    palette();
    pageFade();
    document.dispatchEvent(new CustomEvent('lp:ready'));
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // Utilitaires partagés
  window.LP = {
    $, $$, reduced, fmt: fmtNum,
    /** Format de session courant ('essentiel' | 'standard' | 'complet'). */
    format: () => fmt,
    /** Rang du format courant : 1 = 45 min, 2 = 1 h, 3 = 90 min. */
    rank: () => FORMATS[fmt].rank,
    /** Déclenche un callback la première fois que l'élément entre à l'écran. */
    onEnter(el, cb, threshold = 0.25) {
      if (!el) return;
      if (reduced()) { cb(el); return; }
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { cb(el); io.disconnect(); } });
      }, { threshold });
      io.observe(el);
    },
    rand: (a, b) => a + Math.random() * (b - a),
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  };
})();
