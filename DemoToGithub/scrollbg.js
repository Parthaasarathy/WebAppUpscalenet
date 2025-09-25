(function(){
  const root = document.documentElement;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  let stx = 0, sty = 0, targetX = 0, targetY = 0, pulse = 0;

  function onScroll(){
    const h = document.documentElement.scrollHeight - window.innerHeight || 1;
    const sprog = clamp(window.scrollY / h, 0, 1);
    root.style.setProperty('--sprog', sprog.toFixed(4));
    // add a tiny tilt derived from scroll rhythm
    targetY = clamp(((window.scrollY % 240) / 240) * 2 - 1, -1, 1);
  }

  function onPointerMove(e){
    const x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
    const y = (e.clientY / window.innerHeight) * 2 - 1; // -1..1
    targetX = clamp(x, -1, 1);
    targetY = clamp(y, -1, 1);
  }

  function onClick(){ pulse = 0.7; }

  function tick(){
    stx += (targetX - stx) * 0.06;
    sty += (targetY - sty) * 0.06;
    root.style.setProperty('--stx', stx.toFixed(4));
    root.style.setProperty('--sty', sty.toFixed(4));
    if(pulse > 0.001){
      root.style.setProperty('--pulse', pulse.toFixed(3));
      pulse *= 0.92;
    } else if(root.style.getPropertyValue('--pulse') !== '0') {
      root.style.setProperty('--pulse', '0');
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('mousemove', onPointerMove, { passive:true });
  window.addEventListener('click', onClick, { passive:true });
  onScroll();
  tick();
})();   