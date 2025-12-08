(function () {
    'use strict';

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('🇨🇭 Swiss Design - Initializing...');

        // ============================================
        // Swiss Design - Geometric Background Animation
        // Inspired by Lugano Living Lab
        // ============================================

        // Mouse tracking with smooth interpolation
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let targetMouseX = mouseX;
        let targetMouseY = mouseY;

        // Scroll tracking
        let scrollY = 0;
        let targetScrollY = 0;

        // Create geometric shapes container
        const geoContainer = document.createElement('div');
        geoContainer.id = 'swiss-geo';
        geoContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      overflow: hidden;
      background: linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%);
    `;
        document.body.insertBefore(geoContainer, document.body.firstChild);

        // Grid overlay - Swiss style
        const gridSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        gridSVG.setAttribute('width', '100%');
        gridSVG.setAttribute('height', '100%');
        gridSVG.style.cssText = 'position:absolute;top:0;left:0;opacity:0.03;';

        // Create grid pattern
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        pattern.setAttribute('id', 'grid');
        pattern.setAttribute('width', '100');
        pattern.setAttribute('height', '100');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');

        const pathV = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathV.setAttribute('d', 'M 100 0 L 0 0 0 100');
        pathV.setAttribute('fill', 'none');
        pathV.setAttribute('stroke', '#000');
        pathV.setAttribute('stroke-width', '0.5');
        pattern.appendChild(pathV);
        defs.appendChild(pattern);
        gridSVG.appendChild(defs);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', 'url(#grid)');
        gridSVG.appendChild(rect);
        geoContainer.appendChild(gridSVG);

        // Geometric shapes - refined Swiss style
        const shapes = [
            // === Large accent circles ===
            { type: 'circle', size: 500, x: -8, y: -10, color: '#E30613', opacity: 0.04, parallax: 12, scrollSpeed: 0.03 },
            { type: 'circle', size: 400, x: 85, y: 55, color: '#000000', opacity: 0.025, parallax: 18, scrollSpeed: 0.04 },
            { type: 'circle', size: 250, x: 45, y: 110, color: '#E30613', opacity: 0.035, parallax: 28, scrollSpeed: 0.07 },

            // === Primary lines - bold ===
            { type: 'line', width: 4, length: 350, x: 5, y: 22, rotation: 0, color: '#E30613', opacity: 0.18, parallax: 25, scrollSpeed: 0.05 },
            { type: 'line', width: 3, length: 280, x: 70, y: 65, rotation: 0, color: '#000000', opacity: 0.1, parallax: 20, scrollSpeed: 0.04 },

            // === Diagonal lines ===
            { type: 'line', width: 3, length: 300, x: 8, y: 38, rotation: 45, color: '#E30613', opacity: 0.15, parallax: 32, scrollSpeed: 0.06 },
            { type: 'line', width: 2, length: 220, x: 75, y: 18, rotation: -35, color: '#000000', opacity: 0.1, parallax: 26, scrollSpeed: 0.05 },
            { type: 'line', width: 2, length: 180, x: 55, y: 78, rotation: 55, color: '#E30613', opacity: 0.12, parallax: 35, scrollSpeed: 0.07 },

            // === Vertical lines ===
            { type: 'line', width: 2, length: 250, x: 18, y: 35, rotation: 90, color: '#000000', opacity: 0.08, parallax: 22, scrollSpeed: 0.045 },
            { type: 'line', width: 2, length: 200, x: 88, y: 25, rotation: 90, color: '#E30613', opacity: 0.1, parallax: 18, scrollSpeed: 0.035 },

            // === Dots - accent points ===
            { type: 'dot', size: 14, x: 12, y: 55, color: '#E30613', opacity: 0.65, parallax: 50, scrollSpeed: 0.12 },
            { type: 'dot', size: 10, x: 68, y: 32, color: '#000000', opacity: 0.4, parallax: 45, scrollSpeed: 0.1 },
            { type: 'dot', size: 12, x: 85, y: 72, color: '#E30613', opacity: 0.55, parallax: 52, scrollSpeed: 0.13 },
            { type: 'dot', size: 8, x: 38, y: 18, color: '#000000', opacity: 0.35, parallax: 42, scrollSpeed: 0.09 },
            { type: 'dot', size: 16, x: 5, y: 88, color: '#E30613', opacity: 0.6, parallax: 55, scrollSpeed: 0.14 },
            { type: 'dot', size: 10, x: 52, y: 92, color: '#000000', opacity: 0.3, parallax: 48, scrollSpeed: 0.11 },
            { type: 'dot', size: 8, x: 78, y: 95, color: '#E30613', opacity: 0.5, parallax: 50, scrollSpeed: 0.12 },

            // === Squares - rotating on scroll ===
            { type: 'square', size: 90, x: 78, y: 8, color: '#000000', opacity: 0.06, parallax: 15, rotation: 12, scrollSpeed: 0.04, scrollRotate: true },
            { type: 'square', size: 65, x: 8, y: 72, color: '#E30613', opacity: 0.08, parallax: 20, rotation: -8, scrollSpeed: 0.05, scrollRotate: true },
            { type: 'square', size: 50, x: 45, y: 105, color: '#000000', opacity: 0.05, parallax: 25, rotation: 25, scrollSpeed: 0.06, scrollRotate: true },

            // === Crosses - Swiss motif ===
            { type: 'cross', size: 35, x: 22, y: 42, color: '#E30613', opacity: 0.2, parallax: 38, scrollSpeed: 0.08 },
            { type: 'cross', size: 25, x: 65, y: 58, color: '#000000', opacity: 0.12, parallax: 35, scrollSpeed: 0.07 },

            // === Rings - hollow circles ===
            { type: 'ring', size: 100, x: 92, y: 48, color: '#E30613', opacity: 0.12, parallax: 22, scrollSpeed: 0.05, scrollRotate: true },
            { type: 'ring', size: 70, x: 15, y: 95, color: '#000000', opacity: 0.08, parallax: 28, scrollSpeed: 0.06, scrollRotate: true },
        ];

        const shapeElements = [];

        shapes.forEach(shape => {
            const el = document.createElement('div');
            el.className = 'swiss-shape';

            let styles = `
        position: absolute;
        left: ${shape.x}%;
        top: ${shape.y}%;
        opacity: ${shape.opacity};
        will-change: transform;
        transition: opacity 0.3s ease;
      `;

            if (shape.type === 'circle') {
                styles += `
          width: ${shape.size}px;
          height: ${shape.size}px;
          border-radius: 50%;
          background: radial-gradient(circle, ${shape.color} 0%, transparent 70%);
        `;
            } else if (shape.type === 'line') {
                styles += `
          width: ${shape.length}px;
          height: ${shape.width}px;
          background: ${shape.color};
          transform-origin: left center;
          transform: rotate(${shape.rotation}deg);
        `;
            } else if (shape.type === 'dot') {
                styles += `
          width: ${shape.size}px;
          height: ${shape.size}px;
          border-radius: 50%;
          background: ${shape.color};
          box-shadow: 0 0 ${shape.size * 2}px ${shape.color}40;
        `;
            } else if (shape.type === 'square') {
                styles += `
          width: ${shape.size}px;
          height: ${shape.size}px;
          border: 2px solid ${shape.color};
          background: transparent;
          transform: rotate(${shape.rotation || 0}deg);
        `;
            } else if (shape.type === 'cross') {
                el.innerHTML = `
          <div style="position:absolute;width:${shape.size}px;height:3px;background:${shape.color};top:50%;left:0;transform:translateY(-50%);"></div>
          <div style="position:absolute;width:3px;height:${shape.size}px;background:${shape.color};left:50%;top:0;transform:translateX(-50%);"></div>
        `;
                styles += `
          width: ${shape.size}px;
          height: ${shape.size}px;
          position: relative;
        `;
            } else if (shape.type === 'ring') {
                styles += `
          width: ${shape.size}px;
          height: ${shape.size}px;
          border-radius: 50%;
          border: 2px solid ${shape.color};
          background: transparent;
        `;
            }

            el.style.cssText = styles;
            geoContainer.appendChild(el);
            shapeElements.push({ element: el, ...shape });
        });

        console.log('Created', shapeElements.length, 'geometric shapes');

        // Mouse movement handler
        function onMouseMove(e) {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        }

        // Scroll handler
        function onScroll() {
            targetScrollY = window.scrollY;
        }

        // Smooth animation loop
        function animate() {
            // Ultra-smooth interpolation
            mouseX += (targetMouseX - mouseX) * 0.06;
            mouseY += (targetMouseY - mouseY) * 0.06;
            scrollY += (targetScrollY - scrollY) * 0.08;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const offsetX = (mouseX - centerX) / centerX;
            const offsetY = (mouseY - centerY) / centerY;

            // Update each shape
            shapeElements.forEach(shape => {
                const moveX = offsetX * shape.parallax;
                const moveY = offsetY * shape.parallax;
                const scrollMove = scrollY * shape.scrollSpeed;
                const baseRotation = shape.rotation || 0;

                if (shape.type === 'line') {
                    shape.element.style.transform = `rotate(${baseRotation}deg) translate(${moveX}px, ${moveY - scrollMove}px)`;
                } else if ((shape.type === 'square' || shape.type === 'ring') && shape.scrollRotate) {
                    const scrollRotation = scrollY * 0.025;
                    shape.element.style.transform = `rotate(${baseRotation + scrollRotation}deg) translate(${moveX}px, ${moveY - scrollMove}px)`;
                } else {
                    shape.element.style.transform = `translate(${moveX}px, ${moveY - scrollMove}px)`;
                }
            });

            // Move grid slightly with scroll
            gridSVG.style.transform = `translateY(${-scrollY * 0.02}px)`;

            requestAnimationFrame(animate);
        }

        animate();
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // ============================================
        // Scroll Progress Bar
        // ============================================
        const scrollProgress = document.createElement('div');
        scrollProgress.id = 'scroll-progress';
        scrollProgress.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #E30613 0%, #000 100%);
      z-index: 99999;
      width: 0%;
      transition: width 0.15s ease-out;
    `;
        document.body.appendChild(scrollProgress);

        window.addEventListener('scroll', () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            if (h > 0) {
                const progress = (window.scrollY / h) * 100;
                scrollProgress.style.width = progress + '%';
            }
        }, { passive: true });

        // ============================================
        // Reveal Animations - Smooth & Elegant
        // ============================================
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateX(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
            revealObserver.observe(el);
        });

        // Headings reveal with stagger
        let headingDelay = 0;
        document.querySelectorAll('h1, h2, h3').forEach((heading) => {
            heading.style.opacity = '0';
            heading.style.transform = 'translateY(40px)';
            heading.style.transition = `opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${headingDelay}s, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${headingDelay}s`;
            headingDelay += 0.05;

            const headingObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        headingObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            headingObserver.observe(heading);
        });

        // Paragraphs reveal
        document.querySelectorAll('.hero p, .section p').forEach((p, i) => {
            p.style.opacity = '0';
            p.style.transform = 'translateY(30px)';
            p.style.transition = `opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.2 + i * 0.1}s, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.2 + i * 0.1}s`;

            const pObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        pObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            pObserver.observe(p);
        });

        // ============================================
        // Card Effects - 3D Tilt
        // ============================================
        document.querySelectorAll('.card').forEach(card => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
            });
        });

        // ============================================
        // Magnetic Button Effect
        // ============================================
        document.querySelectorAll('.btn, .btn-primary').forEach(btn => {
            if (btn.closest('.nav')) return;

            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        // ============================================
        // Smooth Scroll for Anchor Links
        // ============================================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // ============================================
        // Footer Year
        // ============================================
        const yearEl = document.querySelector('#year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        // ============================================
        // Mobile Nav Toggle
        // ============================================
        const navToggle = document.querySelector('.nav-toggle');
        const nav = document.querySelector('.nav');
        if (navToggle && nav) {
            navToggle.addEventListener('click', () => {
                nav.classList.toggle('open');
            });
        }

        console.log('🇨🇭 Swiss Design theme fully initialized!');
    }
})();
