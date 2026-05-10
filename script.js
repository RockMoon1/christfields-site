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

// Tailored resource sets shown after a FaithFlow form submission, by dropdown choice
const FAITHFLOW_RESOURCES = {
  'community': {
    title: 'For Walking in Faithful Community',
    intro: 'While you wait to hear back, these are trusted starting points for growing in faith and community right where you are.',
    items: [
      { name: 'BibleProject', desc: 'Deeply researched, visually rich Bible study content. Free.', url: 'https://bibleproject.com' },
      { name: 'YouVersion Bible App', desc: 'Free Bible app with reading plans you can share with friends for accountability.', url: 'https://www.bible.com' },
      { name: 'Desiring God', desc: 'Articles, podcasts, and books rooted in Scripture by John Piper and others.', url: 'https://www.desiringgod.org' },
      { name: 'Knowing God — J.I. Packer', desc: 'A foundational book on the character and nature of God. Hard to find a better starting point.', url: 'https://www.crossway.org/books/knowing-god-tpb/' }
    ]
  },
  'future-group': {
    title: 'For Preparing Your Heart for Community',
    intro: 'Faithful community begins long before a group forms. These resources will help you grow in spiritual readiness while you wait.',
    items: [
      { name: 'Life Together — Dietrich Bonhoeffer', desc: 'A short classic on what genuine Christian community actually requires.', url: 'https://www.fortresspress.com/store/product/9780060608521/Life-Together' },
      { name: 'Spiritual Disciplines for the Christian Life — Donald Whitney', desc: 'A practical, scripture-rooted guide to private faithfulness and discipline.', url: 'https://www.crossway.org/books/spiritual-disciplines-for-the-christian-life-revised-edi-tpb/' },
      { name: 'BibleProject Classroom', desc: 'Free, deeper-dive courses on individual books of the Bible and biblical themes.', url: 'https://bibleproject.com/classroom' },
      { name: 'Desiring God', desc: 'Articles and resources on growing in Christ, especially in seasons of waiting.', url: 'https://www.desiringgod.org' }
    ]
  },
  'help-start': {
    title: 'For Future Group Leaders',
    intro: 'If you sense a calling to help shepherd others, these are resources to sharpen your understanding of community, scripture, and humble leadership.',
    items: [
      { name: 'The Trellis and the Vine — Marshall & Payne', desc: 'On building people, not programs. The clearest book on disciple-making we know of.', url: 'https://matthiasmedia.com/products/the-trellis-and-the-vine' },
      { name: '9Marks', desc: 'Resources on healthy church life, small groups, and biblical leadership.', url: 'https://www.9marks.org' },
      { name: 'Ligonier Ministries', desc: 'Teaching, study tools, and articles for those serious about scripture and theology.', url: 'https://www.ligonier.org' },
      { name: 'Spiritual Leadership — J. Oswald Sanders', desc: 'A timeless guide on what humble Christian leadership actually looks like.', url: 'https://www.moodypublishers.com/books/christian-living/spiritual-leadership/' }
    ]
  },
  'learn-more': {
    title: 'Starting Points for Faith',
    intro: 'Whether you\'re new to faith, returning, or simply curious, these are trusted places to begin.',
    items: [
      { name: 'BibleProject', desc: 'Visual, deeply researched Bible content. Free, and accessible at any starting point.', url: 'https://bibleproject.com' },
      { name: 'Mere Christianity — C.S. Lewis', desc: 'A timeless explanation of the heart of Christian faith. Short, clear, and honest.', url: 'https://www.harpercollins.com/products/mere-christianity-c-s-lewis' },
      { name: 'The Reason for God — Tim Keller', desc: 'Christianity for thoughtful skeptics — addresses the hardest questions head-on.', url: 'https://www.penguinrandomhouse.com/books/178708/the-reason-for-god-by-timothy-keller/' },
      { name: 'Got Questions', desc: 'Bible-rooted answers to thousands of questions about faith, scripture, and life.', url: 'https://www.gotquestions.org' }
    ]
  }
};

function populateFaithflowResources(interestValue) {
  // Default to 'learn-more' if we don't recognize the value (e.g. URL-fallback case)
  const resourceSet = FAITHFLOW_RESOURCES[interestValue] || FAITHFLOW_RESOURCES['learn-more'];

  const titleEl = document.getElementById('ffResourcesTitle');
  const introEl = document.getElementById('ffResourcesIntro');
  const listEl  = document.getElementById('ffResourcesList');
  if (!titleEl || !introEl || !listEl) return;

  titleEl.textContent = resourceSet.title;
  introEl.textContent = resourceSet.intro;
  listEl.innerHTML = resourceSet.items.map(item => `
    <li class="ff-success-resource">
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">
        <div class="ff-sr-info">
          <span class="ff-sr-name">${item.name}</span>
          <span class="ff-sr-desc">${item.desc}</span>
        </div>
        <span class="ff-sr-arrow" aria-hidden="true">&#8599;</span>
      </a>
    </li>
  `).join('');
}

// Helper: show inline success state (FaithFlow has a full success card; waitlist just updates the button)
function showFormSuccess(form) {
  const formName = form.getAttribute('name') || 'form';

  if (formName === 'faithflow') {
    const successCard = document.getElementById('ffSuccess');
    const formNote    = document.getElementById('ffFormNote');
    const interest    = form.querySelector('[name="interest"]')?.value || 'learn-more';

    populateFaithflowResources(interest);

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
  if (window.location.search.includes('submitted=1')) {
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
      submitBtn.textContent = 'Something went wrong — try again';
      submitBtn.disabled = false;
    }
  });
});

// "Back to FaithFlow" button on the success card — scrolls to top of FaithFlow content
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
