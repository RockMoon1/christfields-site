/* ============================================================
   CHRIST FIELDS — ember-field.js
   Embers scatter on scroll like sparks from a forge,
   then drift back together. Runs only on faithflow.html.
   ============================================================ */

(function () {
  const field = document.getElementById('emberField');
  if (!field) return;

  // Respect reduced-motion preference
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Generate embers ---
  const EMBER_COUNT = window.innerWidth < 700 ? 22 : 38;
  const colors = [
    { c: '#FFD27A', c2: '#C9A548' },
    { c: '#FFB048', c2: '#7A6228' },
    { c: '#FF8A1E', c2: '#7A4218' },
    { c: '#FFE89A', c2: '#C9A548' },
    { c: '#FFC56B', c2: '#A77828' },
  ];

  const embers = [];
  for (let i = 0; i < EMBER_COUNT; i++) {
    const el = document.createElement('span');
    const sizeClass = Math.random() < 0.25 ? 'ember-lg' : (Math.random() < 0.4 ? 'ember-sm' : '');
    el.className = 'ember ' + sizeClass;

    const color = colors[Math.floor(Math.random() * colors.length)];
    const baseLeft = Math.random() * 100;     // %
    const baseTop  = Math.random() * 100;     // %
    const dur      = 7 + Math.random() * 10;  // s
    const delay    = -Math.random() * dur;    // negative for stagger
    const maxOp    = 0.32 + Math.random() * 0.4;

    el.style.left  = baseLeft + '%';
    el.style.top   = baseTop  + '%';
    el.style.setProperty('--col',   color.c);
    el.style.setProperty('--col2',  color.c2);
    el.style.setProperty('--dur',   dur + 's');
    el.style.setProperty('--delay', delay + 's');
    el.style.setProperty('--max-op', maxOp);

    // Each ember gets its own scatter sensitivity
    embers.push({
      el,
      sensX: (Math.random() - 0.5) * 2,   // -1..1
      sensY: 0.6 + Math.random() * 0.8,   // 0.6..1.4
    });

    field.appendChild(el);
  }

  if (reduceMotion) return;  // no scroll-driven motion

  // --- Scroll-driven scatter ---
  let lastScroll = window.scrollY;
  let velocity = 0;
  let scatterAmount = 0;          // current scatter intensity (decays over time)
  let raf = null;
  let scrolling = false;
  let idleTimer = null;

  function onScroll() {
    const now = window.scrollY;
    const delta = now - lastScroll;
    lastScroll = now;
    velocity = delta * 0.6;       // dampen raw delta

    scrolling = true;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { scrolling = false; }, 140);

    // Pump scatter higher with each scroll tick
    scatterAmount = Math.min(80, scatterAmount + Math.abs(velocity) * 1.4);

    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    raf = null;

    // Decay scatter when not actively scrolling — embers drift back together
    if (!scrolling) {
      scatterAmount *= 0.92;
    } else {
      scatterAmount *= 0.98;
    }

    // Apply scatter to each ember
    const direction = velocity > 0 ? 1 : -1;
    for (let i = 0; i < embers.length; i++) {
      const e = embers[i];
      const tx = scatterAmount * e.sensX;
      const ty = scatterAmount * e.sensY * direction;
      e.el.style.setProperty('--scatter-x', tx.toFixed(1) + 'px');
      e.el.style.setProperty('--scatter-y', ty.toFixed(1) + 'px');
    }

    // Keep animating until embers settle back down
    if (scatterAmount > 0.4 || scrolling) {
      raf = requestAnimationFrame(tick);
    } else {
      // Final reset — clean values
      for (let i = 0; i < embers.length; i++) {
        embers[i].el.style.setProperty('--scatter-x', '0px');
        embers[i].el.style.setProperty('--scatter-y', '0px');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Resize: regenerate count if size changes drastically
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Just leave existing embers; they'll continue floating naturally.
    }, 250);
  });
})();
