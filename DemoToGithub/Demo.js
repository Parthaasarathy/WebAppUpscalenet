document.addEventListener("DOMContentLoaded", () => {
  /* ========= Motion Preference ========= */
  const REDUCE_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const runIfMotionOK = (fn) => { if (!REDUCE_MOTION) fn(); };

  /* ========= Footer year ========= */
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ========= Page Preloader ========= */
  const overlay = document.createElement('div');
  overlay.className = 'preload-overlay';
  overlay.innerHTML = '<div class="loader" aria-label="Loading"></div>';
  document.body.appendChild(overlay);
  const removeOverlay = () => {
    if (!overlay || !overlay.parentNode) return;
    overlay.classList.add('is-done');
    setTimeout(() => overlay && overlay.remove && overlay.remove(), 500);
  };
  if (REDUCE_MOTION) {
    removeOverlay();
  } else {
    const t1 = setTimeout(removeOverlay, 1200);
    const t2 = setTimeout(removeOverlay, 3000);
    window.addEventListener('load', () => { clearTimeout(t1); clearTimeout(t2); removeOverlay(); });
    document.addEventListener('DOMContentLoaded', () => { setTimeout(removeOverlay, 800); });
    window.addEventListener('pageshow', (e) => { if (e.persisted) removeOverlay(); });
    window.addEventListener('error', () => removeOverlay());
  }

  /* ========= Scroll Progress Bar ========= */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  const setProgress = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight || 1) * 100;
    bar.style.width = scrolled + '%';
  };
  setProgress();
  window.addEventListener('scroll', setProgress, { passive: true });

  /* ========= Mobile nav toggle & Dropdown ========= */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const dropdownTrigger = document.querySelector('.dropdown-trigger');
  const navItemDropdown = document.querySelector('.nav-item.has-dropdown');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
  }

  // Handle dropdown on mobile via click
  if (dropdownTrigger && navItemDropdown) {
    dropdownTrigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        navItemDropdown.classList.toggle('active-mobile');
      }
    });
  }

  // Close nav on link click (excluding dropdown trigger)
  document.querySelectorAll('.nav a:not(.dropdown-trigger)').forEach(link => {
    link.addEventListener('click', () => {
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
  });

  /* ========= Sticky header (robust: fixed on scroll with spacer) ========= */
  const header = document.querySelector('.site-header');
  if (header) {
    let locked = false;
    let spacer = null;

    const lock = () => {
      if (locked) return;
      locked = true;
      header.classList.add('is-sticky');
      // create spacer to prevent layout shift
      spacer = document.createElement('div');
      spacer.className = 'header-spacer';
      spacer.style.height = header.offsetHeight + 'px';
      header.parentNode.insertBefore(spacer, header.nextSibling);
      // fix header in place
      header.style.position = 'fixed';
      header.style.top = '0';
      header.style.left = '0';
      header.style.right = '0';
      header.style.zIndex = '100';
      // ensure width matches container (avoids reflow during scrollbar changes)
      header.style.width = '100%';
    };

    const unlock = () => {
      if (!locked) return;
      locked = false;
      header.classList.remove('is-sticky');
      header.style.position = '';
      header.style.top = '';
      header.style.left = '';
      header.style.right = '';
      header.style.zIndex = '';
      header.style.width = '';
      if (spacer && spacer.parentNode) spacer.parentNode.removeChild(spacer);
      spacer = null;
    };

    const onScroll = () => {
      if (window.scrollY > 1) lock(); else unlock();
    };

    const onResize = () => {
      if (spacer) spacer.style.height = header.offsetHeight + 'px';
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
  }

  /* ========= Active nav highlight (multi-page + same-page) ========= */
  const currentPath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav a[href]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    const base = href.split('#')[0];
    if (base && base === currentPath) a.classList.add('active');
  });

  /* ========= Animated nav indicator (glassy oval that glides) ========= */
  (function () {
    const nav = document.querySelector('.site-header .nav');
    if (!nav) return;

    // Create the indicator pill once
    const indicator = document.createElement('span');
    indicator.className = 'nav-indicator';
    nav.appendChild(indicator);

    const links = Array.from(nav.querySelectorAll('a'));
    if (!links.length) return;

    function moveTo(el) {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nr = nav.getBoundingClientRect();
      const left = r.left - nr.left + nav.scrollLeft; // position within nav
      indicator.style.left = left + 'px';
      indicator.style.width = r.width + 'px';
    }

    // Initial position: current active link or first link
    const initial = nav.querySelector('a.active') || links[0];
    moveTo(initial);
    nav.classList.add('is-ready');

    // Hover/Focus preview
    links.forEach(a => {
      a.addEventListener('mouseenter', () => moveTo(a));
      a.addEventListener('focus', () => moveTo(a));
      a.addEventListener('mouseleave', () => moveTo(nav.querySelector('a.active') || initial));
      a.addEventListener('click', () => {
        links.forEach(x => x.classList.remove('active'));
        a.classList.add('active');
        moveTo(a);
      });
    });

    // Reposition on resize (and orientation changes)
    window.addEventListener('resize', () => moveTo(nav.querySelector('a.active') || initial));
  })();

  /* ========= Smooth scroll for internal anchor links (header-aware) ========= */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          const headerEl = document.querySelector('.site-header');
          const top = el.getBoundingClientRect().top + window.pageYOffset - (((headerEl && headerEl.offsetHeight) || 0) + 8);
          window.scrollTo({ top, behavior: 'smooth' });
          if (nav && nav.classList.contains('open')) nav.classList.remove('open');
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  /* ========= Scroll-to-top button (auto-injected) ========= */
  const toTop = document.createElement('button');
  toTop.className = 'scroll-to-top';
  toTop.setAttribute('aria-label', 'Scroll to top');
  toTop.textContent = '↑';
  document.body.appendChild(toTop);
  const updateToTop = () => { toTop.style.display = window.scrollY > 240 ? 'grid' : 'none'; };
  updateToTop();
  window.addEventListener('scroll', updateToTop, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ========= Basic accordion helper ========= */
  document.querySelectorAll('.js-accordion .acc-header').forEach(h => {
    h.addEventListener('click', () => {
      const content = h.nextElementSibling;
      if (!content) return;
      const open = content.getAttribute('data-open') === 'true';
      content.style.maxHeight = open ? '0px' : content.scrollHeight + 'px';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 260ms ease';
      content.setAttribute('data-open', (!open).toString());
      h.classList.toggle('is-open', !open);
    });
  });

  /* ========= Tiny slider utility (no libs) ========= */
  document.querySelectorAll('.js-slider').forEach(slider => {
    const track = slider.querySelector('.slides');
    const slides = slider.querySelectorAll('.slide');
    if (!track || slides.length === 0) return;

    let index = 0;
    const go = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${-index * 100}%)`;
      track.style.transition = 'transform 360ms ease';
    };

    // Init layout
    slider.style.overflow = 'hidden';
    track.style.display = 'flex';
    track.style.willChange = 'transform';
    slides.forEach(s => { s.style.minWidth = '100%'; });

    // Auto-play every 4s (respect reduced motion)
    let timer = null;
    if (!REDUCE_MOTION) {
      timer = setInterval(() => go(index + 1), 4000);
      slider.addEventListener('mouseenter', () => { if (timer) clearInterval(timer); });
      slider.addEventListener('mouseleave', () => { timer = setInterval(() => go(index + 1), 4000); });
    }

    // Start
    go(0);
  });

  /* ========= Reveal-on-scroll via IntersectionObserver ========= */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    })
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  // Auto-assign tasteful variants + stagger
  const variants = ['fade-left', 'fade-right', 'zoom-in', 'zoom-out', 'flip-up'];
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el, i) => {
    const hasVariant = variants.some(v => el.classList.contains(v));
    if (!hasVariant) el.classList.add(variants[i % variants.length]);
    const siblings = Array.from(el.parentElement ? el.parentElement.children : []);
    const isGroup = siblings.filter(n => n.classList && n.classList.contains('reveal')).length > 1;
    if (isGroup) el.style.animationDelay = (Math.min(i, 6) * 60) + 'ms';
    io.observe(el);
  });
  if (REDUCE_MOTION) { document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view')); }

  /* ========= Simple parallax support (data-parallax="speed") ========= */
  const px = () => {
    document.querySelectorAll('[data-parallax]')
      .forEach(el => {
        const s = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        const y = window.scrollY * s;
        el.style.transform = `translateY(${y}px)`;
      });
  };
  window.addEventListener('scroll', px, { passive: true });
  px();

  /* ========= Subtle tilt/hover for phone mockup ========= */
  const mock = document.querySelector('.phone-mock');
  if (mock) {
    const wrap = mock.closest('.phone-wrap') || mock;
    const maxTilt = 10; // degrees

    const handleMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rx = Math.max(-1, Math.min(1, -dy)) * maxTilt;
      const ry = Math.max(-1, Math.min(1, dx)) * maxTilt;
      mock.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      mock.setAttribute('data-tilt', 'on');
    };

    const reset = () => {
      mock.style.transform = '';
      mock.setAttribute('data-tilt', 'off');
    };

    wrap.addEventListener('mousemove', handleMove);
    wrap.addEventListener('mouseleave', reset);
    wrap.addEventListener('touchmove', (e) => { if (!e.touches[0]) return; handleMove(e.touches[0]); }, { passive: true });
    wrap.addEventListener('touchend', reset);

    // Subtle breathing scale while visible
    runIfMotionOK(() => {
      mock.animate([
        { transform: 'none' },
        { transform: 'scale(1.012)' },
        { transform: 'none' }
      ], { duration: 3800, iterations: Infinity, easing: 'ease-in-out' });
    });
  }

  /* ========= Animated Counters (data-count) ========= */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count')) || 0;
      const duration = parseInt(el.getAttribute('data-duration') || '1200', 10);
      const start = performance.now();
      const from = parseFloat(el.textContent) || 0;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 0.5 - Math.cos(Math.PI * p) / 2; // easeInOut
        const val = Math.floor(from + (target - from) * eased);
        el.textContent = val.toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

  /* ========= Magnetic Buttons (exclude nav) ========= */
  document.querySelectorAll('.btn, .btn-primary, .btn-outline').forEach(btn => {
    if (btn.closest('.nav')) return; // skip nav bar buttons
    const strength = 12; // px
    const move = (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      btn.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };
    const reset = () => { btn.style.transform = ''; };
    btn.addEventListener('mousemove', move);
    btn.addEventListener('mouseleave', reset);
    btn.addEventListener('touchend', reset, { passive: true });
  });

  /* ========= Button ripple (exclude nav) ========= */
  document.querySelectorAll('button, .btn').forEach(btn => {
    if (btn.closest('.nav')) return; // skip nav bar buttons entirely
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', (e) => {
      const circle = document.createElement('span');
      circle.className = 'ripple';
      const d = Math.max(btn.clientWidth, btn.clientHeight);
      circle.style.width = circle.style.height = d + 'px';
      const rect = btn.getBoundingClientRect();
      circle.style.left = e.clientX - rect.left - d / 2 + 'px';
      circle.style.top = e.clientY - rect.top - d / 2 + 'px';
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  /* ========= Lazy-load images (data-src) ========= */
  const imgIO = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (!ent.isIntersecting) return;
      const img = ent.target;
      const src = img.getAttribute('data-src');
      if (src) { img.src = src; img.removeAttribute('data-src'); }
      imgIO.unobserve(img);
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });
  document.querySelectorAll('img[data-src]').forEach(img => imgIO.observe(img));

  /* ========= Projects tag filter (if present) ========= */
  const grid = document.querySelector('#projectGrid');
  if (grid) {
    const cards = Array.from(grid.querySelectorAll('.card'));
    document.querySelectorAll('.tag[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.getAttribute('data-filter');
        document.querySelectorAll('.tag[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cards.forEach(c => {
          const tags = (c.getAttribute('data-tags') || '').split(/\s+/);
          const show = f === '*' || tags.includes(f);
          c.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ========= Pause animations when tab inactive ========= */
  document.addEventListener('visibilitychange', () => {
    const run = !document.hidden;
    document.querySelectorAll('*').forEach(el => el.style.animationPlayState = run ? 'running' : 'paused');
  });

  /* ========= Active section highlight for on-page anchors ========= */
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const anchorLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  if (sections.length && anchorLinks.length) {
    const actIO = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (!ent.isIntersecting) return;
        const id = ent.target.getAttribute('id');
        anchorLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    sections.forEach(s => actIO.observe(s));
  }

  /* ========= Violet Cursor (unified dot across all pages) ========= */
  (function () {
    try {
      let cursor = document.querySelector('.cursor');
      if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
      }

      // Ensure only one dot exists
      const oldDot = document.querySelector('.cursor-dot');
      if (oldDot) oldDot.remove();

      document.body.classList.add('cursor-enabled');

      let x = 0, y = 0, tx = 0, ty = 0, raf;
      const lerp = (a, b, t) => a + (b - a) * t;

      const move = (e) => { x = e.clientX; y = e.clientY; if (!raf) tick(); };
      const tick = () => {
        tx = lerp(tx, x, 0.35);
        ty = lerp(ty, y, 0.35);
        cursor.style.left = tx + 'px';
        cursor.style.top = ty + 'px';
        raf = (Math.abs(tx - x) > 0.2 || Math.abs(ty - y) > 0.2) ? requestAnimationFrame(tick) : (raf = null);
      };

      window.addEventListener('mousemove', move, { passive: true });
    } catch (err) {
      console.warn('Cursor init error:', err);
    }
  })();

  console.log("✨ Enhanced JS loaded with animations");
});