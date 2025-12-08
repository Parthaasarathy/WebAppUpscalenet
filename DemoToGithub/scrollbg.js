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
        // ============================================

        // Mouse tracking
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
      background: #FAFAFA;
    `;
        document.body.insertBefore(geoContainer, document.body.firstChild);

        // Many geometric shapes with scroll speeds
        const shapes = [
            // === CIRCLES ===
            { type: 'circle', size: 450, x: -8, y: -8, color: '#FF0000', opacity: 0.06, parallax: 15, scrollSpeed: 0.04 },
            { type: 'circle', size: 350, x: 82, y: 60, color: '#000000', opacity: 0.04, parallax: 25, scrollSpeed: 0.06 },
            { type: 'circle', size: 200, x: 50, y: 120, color: '#FF0000', opacity: 0.05, parallax: 35, scrollSpeed: 0.1 },
            { type: 'circle', size: 150, x: 20, y: 180, color: '#000000', opacity: 0.03, parallax: 40, scrollSpeed: 0.12 },
            { type: 'circle', size: 100, x: 70, y: 150, color: '#FF0000', opacity: 0.04, parallax: 45, scrollSpeed: 0.14 },

            // === LINES - Horizontal ===
            { type: 'line', width: 2, length: 300, x: 5, y: 25, rotation: 0, color: '#FF0000', opacity: 0.2, parallax: 30, scrollSpeed: 0.08 },
            { type: 'line', width: 1, length: 200, x: 60, y: 85, rotation: 0, color: '#000000', opacity: 0.12, parallax: 25, scrollSpeed: 0.06 },
            { type: 'line', width: 2, length: 250, x: 30, y: 140, rotation: 0, color: '#FF0000', opacity: 0.15, parallax: 35, scrollSpeed: 0.1 },

            // === LINES - Vertical ===
            { type: 'line', width: 2, length: 200, x: 15, y: 40, rotation: 90, color: '#000000', opacity: 0.1, parallax: 28, scrollSpeed: 0.07 },
            { type: 'line', width: 1, length: 300, x: 85, y: 20, rotation: 90, color: '#FF0000', opacity: 0.12, parallax: 22, scrollSpeed: 0.05 },
            { type: 'line', width: 2, length: 150, x: 45, y: 100, rotation: 90, color: '#000000', opacity: 0.08, parallax: 38, scrollSpeed: 0.11 },

            // === LINES - Diagonal ===
            { type: 'line', width: 3, length: 250, x: 8, y: 35, rotation: 45, color: '#FF0000', opacity: 0.22, parallax: 40, scrollSpeed: 0.1 },
            { type: 'line', width: 2, length: 200, x: 75, y: 15, rotation: -30, color: '#000000', opacity: 0.15, parallax: 32, scrollSpeed: 0.08 },
            { type: 'line', width: 2, length: 180, x: 55, y: 70, rotation: 60, color: '#FF0000', opacity: 0.18, parallax: 42, scrollSpeed: 0.12 },
            { type: 'line', width: 2, length: 150, x: 25, y: 95, rotation: -45, color: '#000000', opacity: 0.12, parallax: 36, scrollSpeed: 0.09 },
            { type: 'line', width: 3, length: 220, x: 65, y: 130, rotation: 30, color: '#FF0000', opacity: 0.16, parallax: 44, scrollSpeed: 0.13 },

            // === DOTS - Small ===
            { type: 'dot', size: 6, x: 12, y: 20, color: '#FF0000', opacity: 0.5, parallax: 55, scrollSpeed: 0.16 },
            { type: 'dot', size: 5, x: 35, y: 45, color: '#000000', opacity: 0.35, parallax: 50, scrollSpeed: 0.14 },
            { type: 'dot', size: 4, x: 58, y: 30, color: '#FF0000', opacity: 0.45, parallax: 52, scrollSpeed: 0.15 },
            { type: 'dot', size: 5, x: 78, y: 55, color: '#000000', opacity: 0.3, parallax: 48, scrollSpeed: 0.13 },
            { type: 'dot', size: 6, x: 92, y: 25, color: '#FF0000', opacity: 0.4, parallax: 54, scrollSpeed: 0.16 },

            // === DOTS - Medium ===
            { type: 'dot', size: 10, x: 18, y: 60, color: '#FF0000', opacity: 0.55, parallax: 58, scrollSpeed: 0.17 },
            { type: 'dot', size: 8, x: 42, y: 75, color: '#000000', opacity: 0.4, parallax: 52, scrollSpeed: 0.15 },
            { type: 'dot', size: 12, x: 68, y: 42, color: '#FF0000', opacity: 0.5, parallax: 56, scrollSpeed: 0.16 },
            { type: 'dot', size: 9, x: 88, y: 70, color: '#000000', opacity: 0.35, parallax: 50, scrollSpeed: 0.14 },

            // === DOTS - Large ===
            { type: 'dot', size: 16, x: 8, y: 85, color: '#FF0000', opacity: 0.6, parallax: 62, scrollSpeed: 0.18 },
            { type: 'dot', size: 14, x: 52, y: 92, color: '#000000', opacity: 0.45, parallax: 58, scrollSpeed: 0.17 },
            { type: 'dot', size: 18, x: 75, y: 88, color: '#FF0000', opacity: 0.55, parallax: 60, scrollSpeed: 0.18 },

            // === DOTS - Extended area ===
            { type: 'dot', size: 8, x: 22, y: 110, color: '#FF0000', opacity: 0.4, parallax: 54, scrollSpeed: 0.15 },
            { type: 'dot', size: 10, x: 48, y: 125, color: '#000000', opacity: 0.35, parallax: 52, scrollSpeed: 0.14 },
            { type: 'dot', size: 12, x: 72, y: 115, color: '#FF0000', opacity: 0.45, parallax: 56, scrollSpeed: 0.16 },
            { type: 'dot', size: 6, x: 95, y: 105, color: '#000000', opacity: 0.3, parallax: 50, scrollSpeed: 0.13 },

            // === SQUARES ===
            { type: 'square', size: 100, x: 78, y: 5, color: '#000000', opacity: 0.08, parallax: 18, rotation: 15, scrollSpeed: 0.05, scrollRotate: true },
            { type: 'square', size: 70, x: 5, y: 72, color: '#FF0000', opacity: 0.12, parallax: 24, rotation: -12, scrollSpeed: 0.07, scrollRotate: true },
            { type: 'square', size: 50, x: 42, y: 105, color: '#000000', opacity: 0.06, parallax: 30, rotation: 30, scrollSpeed: 0.09, scrollRotate: true },
            { type: 'square', size: 60, x: 88, y: 95, color: '#FF0000', opacity: 0.1, parallax: 26, rotation: -25, scrollSpeed: 0.08, scrollRotate: true },
            { type: 'square', size: 40, x: 25, y: 140, color: '#000000', opacity: 0.07, parallax: 32, rotation: 45, scrollSpeed: 0.1, scrollRotate: true },

            // === CROSSES (Swiss style) ===
            { type: 'cross', size: 40, x: 20, y: 38, color: '#FF0000', opacity: 0.25, parallax: 45, scrollSpeed: 0.12 },
            { type: 'cross', size: 30, x: 62, y: 58, color: '#000000', opacity: 0.15, parallax: 40, scrollSpeed: 0.1 },
            { type: 'cross', size: 35, x: 82, y: 35, color: '#FF0000', opacity: 0.2, parallax: 42, scrollSpeed: 0.11 },
            { type: 'cross', size: 25, x: 38, y: 115, color: '#000000', opacity: 0.12, parallax: 38, scrollSpeed: 0.09 },

            // === RINGS (hollow circles) ===
            { type: 'ring', size: 120, x: 90, y: 45, color: '#FF0000', opacity: 0.15, parallax: 28, scrollSpeed: 0.07, scrollRotate: true },
            { type: 'ring', size: 80, x: 12, y: 95, color: '#000000', opacity: 0.1, parallax: 32, scrollSpeed: 0.08, scrollRotate: true },
            { type: 'ring', size: 100, x: 55, y: 135, color: '#FF0000', opacity: 0.12, parallax: 30, scrollSpeed: 0.08, scrollRotate: true },
            { type: 'ring', size: 60, x: 78, y: 120, color: '#000000', opacity: 0.08, parallax: 34, scrollSpeed: 0.09, scrollRotate: true },
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
      `;

            if (shape.type === 'circle') {
                styles += `
          width: ${shape.size}px;
          height: ${shape.size}px;
          border-radius: 50%;
          background: ${shape.color};
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
                // Create a cross shape using pseudo-elements simulation
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

        // Animation loop for parallax
        function animate() {
            // Smooth mouse following
            mouseX += (targetMouseX - mouseX) * 0.08;
            mouseY += (targetMouseY - mouseY) * 0.08;

            // Smooth scroll following
            scrollY += (targetScrollY - scrollY) * 0.1;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const offsetX = (mouseX - centerX) / centerX;
            const offsetY = (mouseY - centerY) / centerY;

            // Apply parallax and scroll effects to each shape
            shapeElements.forEach(shape => {
                // Mouse-based movement
                const moveX = offsetX * shape.parallax;
                const moveY = offsetY * shape.parallax;

                // Scroll-based movement (shapes move up as you scroll down)
                const scrollMove = scrollY * shape.scrollSpeed;

                const baseRotation = shape.rotation || 0;

                if (shape.type === 'line') {
                    shape.element.style.transform = `rotate(${baseRotation}deg) translate(${moveX}px, ${moveY - scrollMove}px)`;
                } else if ((shape.type === 'square' || shape.type === 'ring') && shape.scrollRotate) {
                    // Squares and rings also rotate on scroll
                    const scrollRotation = scrollY * 0.03;
                    shape.element.style.transform = `rotate(${baseRotation + scrollRotation}deg) translate(${moveX}px, ${moveY - scrollMove}px)`;
                } else {
                    shape.element.style.transform = `translate(${moveX}px, ${moveY - scrollMove}px)`;
                }
            });

            requestAnimationFrame(animate);
        }

        // Start animation
        animate();
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial scroll position
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
      background: #FF0000;
      z-index: 99999;
      width: 0%;
      transition: width 0.1s linear;
    `;
        document.body.appendChild(scrollProgress);

        window.addEventListener('scroll', () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            if (h > 0) {
                const progress = (window.scrollY / h) * 100;
                scrollProgress.style.width = progress + '%';
            }
        }, { passive: true });

        console.log('Scroll progress bar added');

        // ============================================
        // Reveal Animations on Scroll
        // ============================================
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            revealObserver.observe(el);
        });

        // Headings reveal
        document.querySelectorAll('h1, h2, h3').forEach((heading, i) => {
            heading.style.opacity = '0';
            heading.style.transform = 'translateY(30px)';
            heading.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;

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

        console.log('Reveal animations initialized');

        // ============================================
        // Card Tilt Effect
        // ============================================
        document.querySelectorAll('.card').forEach(card => {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
                card.style.boxShadow = '';
            });
        });

        console.log('Card tilt effects added');

        // ============================================
        // Magnetic Button Effect
        // ============================================
        document.querySelectorAll('.btn, .btn-primary').forEach(btn => {
            if (btn.closest('.nav')) return;

            btn.style.transition = 'transform 0.2s ease';

            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        console.log('Magnetic button effects added');

        // ============================================
        // Footer Year
        // ============================================
        const yearEl = document.querySelector('#year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        console.log('🇨🇭 Swiss Design theme fully initialized!');
    }
})();
