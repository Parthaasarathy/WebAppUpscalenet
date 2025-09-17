document.addEventListener("DOMContentLoaded", () => {
  /* ========= Footer year ========= */
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ========= Mobile nav toggle ========= */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));

  /* ========= Sticky header class on scroll (for glass nav) ========= */
  const header = document.querySelector('.site-header');
  const stickyThreshold = 24; // px
  const setSticky = () => {
    if (!header) return;
    const isSticky = window.scrollY > stickyThreshold;
    header.classList.toggle('is-sticky', isSticky);
  };
  setSticky();
  window.addEventListener('scroll', setSticky, { passive: true });

  /* ========= Smooth scroll for internal anchor links ========= */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  Object.assign(toTop.style, {
    position: 'fixed', right: '16px', bottom: '16px', width: '40px', height: '40px',
    borderRadius: '20px', border: '1px solid #2a3360', background: 'linear-gradient(135deg, #5b7cff, #7ef0ff)',
    color: '#081028', fontWeight: '700', cursor: 'pointer', display: 'none', zIndex: 1000
  });
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

    // Auto-play every 4s
    let timer = setInterval(() => go(index + 1), 4000);
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', () => timer = setInterval(() => go(index + 1), 4000));

    // Start
    go(0);
  });

  /* ========= Reveal-on-scroll via IntersectionObserver ========= */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    })
  },{root:null,rootMargin:'0px 0px -10% 0px',threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  /* ========= Simple parallax support (data-parallax="speed") ========= */
  const px = () => {
    document.querySelectorAll('[data-parallax]')
      .forEach(el=>{
        const s = parseFloat(el.getAttribute('data-parallax'))||0.15;
        const y = window.scrollY * s;
        el.style.transform = `translateY(${y}px)`;
      });
  };
  window.addEventListener('scroll', px, {passive:true});
  px();

  /* ========= Subtle tilt/hover for phone mockup ========= */
  const mock = document.querySelector('.phone-mock');
  if (mock) {
    const wrap = mock.closest('.phone-wrap') || mock;
    const maxTilt = 10; // degrees

    const handleMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / (rect.width/2);
      const dy = (e.clientY - cy) / (rect.height/2);
      const rx = Math.max(-1, Math.min(1, -dy)) * maxTilt;
      const ry = Math.max(-1, Math.min(1, dx)) * maxTilt;
      mock.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      mock.setAttribute('data-tilt','on');
    };

    const reset = () => {
      mock.style.transform = '';
      mock.setAttribute('data-tilt','off');
    };

    wrap.addEventListener('mousemove', handleMove);
    wrap.addEventListener('mouseleave', reset);
    wrap.addEventListener('touchmove', (e)=>{ if (!e.touches[0]) return; handleMove(e.touches[0]); }, {passive:true});
    wrap.addEventListener('touchend', reset);
  }

  console.log("Enhanced site scripts loaded ✔");
});