/* ============================================================
   CHRIST FIELDS — script.js
   ============================================================ */

// --- Logo image fallback (replaces inline onerror handlers removed for CSP) ---
document.querySelectorAll('.nav-logo-img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const text = img.nextElementSibling;
    if (text && text.classList.contains('nav-logo-text')) {
      text.style.display = 'block';
    }
  });
});
document.querySelectorAll('.footer-logo').forEach(img => {
  img.addEventListener('error', () => { img.style.display = 'none'; });
});

// --- Scroll-triggered reveal animations ---
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// --- Nav: frosted glass on scroll ---
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && nav && !nav.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    }
  });
}

// --- Smooth scroll with nav offset ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- Message textarea: character counter ---
const messageField = document.getElementById('messageField');
const charCounter  = document.getElementById('charCounter');
const MAX_CHARS    = 1000;

if (messageField && charCounter) {
  messageField.addEventListener('input', () => {
    const len = messageField.value.length;
    charCounter.textContent = `${len} / ${MAX_CHARS}`;
    charCounter.classList.toggle('near-limit', len > MAX_CHARS * 0.85);
    if (len > MAX_CHARS) {
      messageField.value = messageField.value.slice(0, MAX_CHARS);
      charCounter.textContent = `${MAX_CHARS} / ${MAX_CHARS}`;
    }
  });
}

// --- Netlify Forms: submit handler for any form with data-netlify="true" ---
document.querySelectorAll('form[data-netlify="true"]').forEach(form => {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  const originalLabel = submitBtn.textContent;
  const formName     = form.getAttribute('name') || 'form';
  const successCopy  = formName === 'faithflow'
    ? "Thank you. We'll be in touch soon."
    : "You're in. Welcome to the journey.";

  let lastSubmitTime = 0;
  const RATE_LIMIT_MS = 10000;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      submitBtn.textContent = 'Please wait before trying again.';
      setTimeout(() => { submitBtn.textContent = originalLabel; }, RATE_LIMIT_MS - (now - lastSubmitTime));
      return;
    }

    const name  = form.querySelector('[name="name"]')?.value.trim() || '';
    const email = form.querySelector('[name="email"]')?.value.trim() || '';
    const emailRe = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
    if (!name || name.length > 100) return;
    if (!email || !emailRe.test(email) || email.length > 254) return;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    lastSubmitTime = Date.now();

    try {
      const formData = new FormData(form);
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok || response.status === 200 || response.redirected) {
        submitBtn.textContent = successCopy;
        submitBtn.style.background = '#2D6A4F';
        submitBtn.style.color = '#F0F2EE';
        form.querySelectorAll('input, select, textarea').forEach(el => {
          el.disabled = true;
          el.style.opacity = '0.5';
        });
        const cc = form.querySelector('.char-counter') || document.getElementById('charCounter');
        if (cc) cc.style.display = 'none';
      } else {
        throw new Error(`Status ${response.status}`);
      }

    } catch (err) {
      submitBtn.textContent = 'Something went wrong — try again';
      submitBtn.disabled = false;
    }
  });
});
