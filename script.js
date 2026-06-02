/* ============================================================
   CHRIST FIELDS script.js
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

// Helper: show inline success state. FaithFlow has a full success card. Waitlist just updates the button.
function showFormSuccess(form) {
  const formName = form.getAttribute('name') || 'form';

  if (formName === 'faithflow') {
    const successCard = document.getElementById('ffSuccess');
    const formNote    = document.getElementById('ffFormNote');

    if (successCard) {
      form.hidden = true;
      successCard.hidden = false;
      if (formNote) formNote.hidden = true;
      // Smooth scroll to bring the success card into view if needed
      successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } else {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = "You're in. Welcome to the journey.";
      submitBtn.style.background = '#2D6A4F';
      submitBtn.style.color = '#F0F2EE';
    }
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.disabled = true;
      el.style.opacity = '0.5';
    });
    const cc = form.querySelector('.char-counter') || document.getElementById('charCounter');
    if (cc) cc.style.display = 'none';
  }
}

// Fallback: if the user gets redirected back via ?submitted=1 (JS off, slow JS, or hard navigation),
// show the success card immediately so they never see Netlify's default thank-you page.
(function checkSubmittedParam() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('submitted') === '1') {
    const ffForm = document.getElementById('faithflowForm');
    if (ffForm) {
      showFormSuccess(ffForm);
      // Clean the URL so a refresh doesn't keep the success state
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      }
    }
  }
})();

document.querySelectorAll('form[data-netlify="true"]').forEach(form => {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  const originalLabel = submitBtn.textContent;
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
        showFormSuccess(form);
      } else {
        throw new Error(`Status ${response.status}`);
      }

    } catch (err) {
      submitBtn.textContent = 'Something went wrong, try again';
      submitBtn.disabled = false;
    }
  });
});

// "Back to FaithFlow" button on the success card. Scrolls to top of FaithFlow content.
document.getElementById('ffBackBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.getElementById('what');
  if (target) {
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// --- Receive a Word: AI verse via the /verse serverless function ---
(function () {
  const form = document.getElementById('wordForm');
  if (!form) return;

  const input  = document.getElementById('wordInput');
  const btn    = document.getElementById('wordBtn');
  const result = document.getElementById('wordResult');
  const vEl    = document.getElementById('wordVerse');
  const rEl    = document.getElementById('wordRef');
  const eEl    = document.getElementById('wordEnc');
  const label  = btn ? btn.textContent : 'Receive a Word';
  let busy = false;

  function render(text, ref, enc) {
    vEl.textContent = text ? '“' + text + '”' : '';
    rEl.textContent = ref || '';
    eEl.textContent = enc || '';
    result.hidden = false;
    result.classList.remove('word-result--in');
    void result.offsetWidth;            // restart the reveal animation
    result.classList.add('word-result--in');
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    busy = true;
    if (btn) { btn.textContent = 'Listening…'; btn.disabled = true; }

    try {
      const res = await fetch('/.netlify/functions/verse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: (input.value || '').slice(0, 500) }),
      });
      if (!res.ok) throw new Error('status ' + res.status);
      const data = await res.json();
      render(data.text, data.reference, data.encouragement);
    } catch (err) {
      // Graceful fallback if the function is unavailable (e.g. not yet deployed)
      render(
        'Cast all your care upon him; for he careth for you.',
        '1 Peter 5:7',
        'Whatever you are carrying right now, you do not carry it alone. Bring it to God, and let these words steady you.'
      );
    } finally {
      if (btn) { btn.textContent = label; btn.disabled = false; }
      busy = false;
    }
  });
})();
