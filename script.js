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

// Tailored content shown after a FaithFlow form submission, by dropdown choice.
// Each option produces a self-contained "mini-page" so the user gets the full FaithFlow story
// in one place without having to scroll back through the site.
const FAITHFLOW_CONTENT = {
  'community': {
    eyebrow: 'You Asked About',
    title: 'FaithFlow Community',
    sections: [
      {
        type: 'prose',
        heading: 'What FaithFlow Is',
        paragraphs: [
          'FaithFlow is not an app, a brand, or an online group. It\'s the Christ Fields community framework for real people walking together in Christ — Scripture-rooted, in-person, and honest.',
          'It\'s built on a simple truth: <em>you don\'t grow alone.</em> Accountability, friendship, and faithful community are essential to following Christ.',
          'FaithFlow creates space for people to gather in small groups, study Scripture together, walk through life\'s challenges with honesty, and sharpen each other in faith and discipline.'
        ]
      },
      {
        type: 'prose',
        heading: 'Iron and Ember — Our First Group',
        paragraphs: [
          'Iron and Ember is the first active FaithFlow group and serves as an early model for what future groups may become. A small group of friends meeting in person in Colorado, walking through faith and life together — rooted in Proverbs 27:17.',
          'Iron and Ember is not currently open for public enrollment. As interest grows, new groups may form — prayerfully, with clear leadership and structure.'
        ]
      },
      {
        type: 'list',
        heading: 'How FaithFlow Groups Work',
        items: [
          '<strong>Small and personal.</strong> Groups stay intentionally small. New groups may form prayerfully as interest grows.',
          '<strong>Named and organized.</strong> Each group has its own name, identity, and character — rooted in the same FaithFlow principles.',
          '<strong>Led with humility.</strong> Leaders serve, guide, and equip — they don\'t dominate or perform.',
          '<strong>Scripture-rooted.</strong> The Bible is the foundation, not an afterthought.',
          '<strong>Faithful community.</strong> The goal is faithfulness, not metrics or hype.'
        ]
      },
      {
        type: 'scriptures',
        heading: 'Scripture We Stand On',
        items: [
          { ref: 'Proverbs 27:17', text: 'As iron sharpens iron, so one person sharpens another.' },
          { ref: 'Hebrews 10:24–25', text: 'Let us consider how we may spur one another on toward love and good deeds&hellip; not giving up meeting together.' },
          { ref: 'Acts 2:42', text: 'They devoted themselves to the apostles\' teaching and to fellowship, to the breaking of bread and to prayer.' }
        ]
      },
      {
        type: 'resources',
        heading: 'Trusted Resources for Community',
        intro: 'Starting points for growing in faith and community right where you are.',
        items: [
          { name: 'BibleProject', desc: 'Deeply researched, visually rich Bible study content. Free.', url: 'https://bibleproject.com' },
          { name: 'YouVersion Bible App', desc: 'Free Bible app with reading plans you can share with friends for accountability.', url: 'https://www.bible.com' },
          { name: 'Desiring God', desc: 'Articles, podcasts, and books rooted in Scripture by John Piper and others.', url: 'https://www.desiringgod.org' },
          { name: 'Knowing God — J.I. Packer', desc: 'A foundational book on the character and nature of God.', url: 'https://www.crossway.org/books/knowing-god-tpb/' }
        ]
      }
    ]
  },

  'future-group': {
    eyebrow: 'You Asked About',
    title: 'A Future FaithFlow Group',
    sections: [
      {
        type: 'prose',
        heading: 'While You Wait',
        paragraphs: [
          'Faithful community begins long before a group forms. The strongest groups are made of people who already know how to seek Christ on their own.',
          'Use this season to build a foundation — daily Scripture, honest prayer, and personal discipline. When a group does form, you\'ll bring real depth to it.'
        ]
      },
      {
        type: 'list',
        heading: 'A Simple Place to Start',
        items: [
          'Read one chapter of the Gospel of <strong>John</strong> each day for 21 days. Don\'t rush. Underline what stands out.',
          'Pray honestly — even if just a few sentences a day. Confess. Thank. Ask.',
          'Find one trusted Christian friend and tell them you\'re trying to grow. Ask them to check on you weekly.',
          'Avoid using "I\'m too busy" as a reason. Spend 15 minutes less on something else instead.'
        ]
      },
      {
        type: 'scriptures',
        heading: 'Scripture for the Foundation',
        items: [
          { ref: 'Psalm 1:2–3', text: 'But whose delight is in the law of the Lord, and who meditates on his law day and night. That person is like a tree planted by streams of water.' },
          { ref: 'Matthew 7:24', text: 'Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock.' },
          { ref: 'Philippians 1:6', text: 'Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.' }
        ]
      },
      {
        type: 'resources',
        heading: 'Foundational Resources',
        intro: 'For someone newer to faith or rebuilding the basics — these are trusted, accessible starting points.',
        items: [
          { name: 'BibleProject', desc: 'Free, visual explanations of every book of the Bible. The clearest place to start.', url: 'https://bibleproject.com' },
          { name: 'YouVersion Bible App', desc: 'Free Bible app with hundreds of reading plans, including 7-day intros to faith.', url: 'https://www.bible.com' },
          { name: 'Mere Christianity — C.S. Lewis', desc: 'A short, clear book that explains the heart of Christian faith honestly.', url: 'https://www.harpercollins.com/products/mere-christianity-c-s-lewis' },
          { name: 'Got Questions', desc: 'Bible-rooted answers to thousands of common questions about faith.', url: 'https://www.gotquestions.org' }
        ]
      }
    ]
  },

  'help-start': {
    eyebrow: 'You Asked About',
    title: 'Helping Start a Group',
    sections: [
      {
        type: 'prose',
        heading: 'What This Means',
        paragraphs: [
          'Thank you for being willing. We don\'t take this lightly, and neither should you.',
          'FaithFlow groups are led by people who are first being led themselves — by Christ, by Scripture, and by other faithful believers. Leadership in FaithFlow is service, not status.'
        ]
      },
      {
        type: 'list',
        heading: 'What We\'re Looking For in Future Leaders',
        items: [
          '<strong>Faithful in their own walk.</strong> The private life matches the public one.',
          '<strong>Humble and willing to serve.</strong> Leaders here are not performers.',
          '<strong>Spiritually mature and growing.</strong> Not perfect — but moving forward.',
          '<strong>Accountable to others.</strong> Already in submission, not seeking authority.',
          '<strong>Committed to Scripture.</strong> The Bible is the standard, not personal preference.',
          '<strong>Willing to invest in people.</strong> Real time, real care, real cost.'
        ]
      },
      {
        type: 'list',
        heading: 'What a FaithFlow Group Asks of a Leader',
        items: [
          'Show up consistently — not just when it\'s convenient.',
          'Open Scripture honestly — including the parts that confront you.',
          'Hold confidence — what is shared in the group stays there.',
          'Encourage and confront with love — silence is not faithfulness.',
          'Pray for each member by name.',
          'Stay teachable — leaders are also being shaped.'
        ]
      },
      {
        type: 'scriptures',
        heading: 'Scripture for Leaders',
        items: [
          { ref: 'James 3:1', text: 'Not many of you should become teachers, my brothers and sisters, because you know that we who teach will be judged more strictly.' },
          { ref: '1 Peter 5:2–3', text: 'Be shepherds of God\'s flock that is under your care&hellip; not lording it over those entrusted to you, but being examples to the flock.' },
          { ref: 'Philippians 2:3–4', text: 'Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves.' }
        ]
      },
      {
        type: 'resources',
        heading: 'Resources for Future Leaders',
        intro: 'If you sense a real calling, these will sharpen your understanding of community, Scripture, and humble leadership.',
        items: [
          { name: 'The Trellis and the Vine — Marshall & Payne', desc: 'On building people, not programs. The clearest book on disciple-making we know of.', url: 'https://matthiasmedia.com/products/the-trellis-and-the-vine' },
          { name: 'Spiritual Leadership — J. Oswald Sanders', desc: 'A timeless guide on what humble Christian leadership actually looks like.', url: 'https://www.moodypublishers.com/books/christian-living/spiritual-leadership/' },
          { name: '9Marks', desc: 'Resources on healthy church life, small groups, and biblical leadership.', url: 'https://www.9marks.org' },
          { name: 'Ligonier Ministries', desc: 'Teaching, study tools, and articles for those serious about Scripture.', url: 'https://www.ligonier.org' }
        ]
      },
      {
        type: 'prose',
        heading: 'What Happens Next',
        paragraphs: [
          'When we read your message, we\'ll respond personally. We don\'t auto-onboard leaders. There may be conversation, time, and prayer before any next step.',
          'In the meantime: keep walking faithfully where you are. That\'s the qualification before any title.'
        ]
      }
    ]
  },

  'learn-more': {
    eyebrow: 'You Asked About',
    title: 'FaithFlow, In Brief',
    sections: [
      {
        type: 'prose',
        heading: 'What FaithFlow Is',
        paragraphs: [
          'FaithFlow is the Christ Fields community framework for real people walking together in Christ. Not an app. Not a brand. Real, in-person community grounded in Scripture.',
          'It\'s built on the truth that we don\'t grow alone — we grow through honest friendship, accountability, and faithful study together.'
        ]
      },
      {
        type: 'prose',
        heading: 'Where It Stands Right Now',
        paragraphs: [
          'Iron and Ember is the first active FaithFlow group, meeting in Colorado. As interest grows, new groups may form — prayerfully, with clear leadership and structure.',
          'We\'re not in a hurry to grow. We\'re building this carefully.'
        ]
      },
      {
        type: 'scriptures',
        heading: 'The Heart of It',
        items: [
          { ref: 'Proverbs 27:17', text: 'As iron sharpens iron, so one person sharpens another.' },
          { ref: 'Acts 2:42', text: 'They devoted themselves to the apostles\' teaching and to fellowship, to the breaking of bread and to prayer.' }
        ]
      },
      {
        type: 'resources',
        heading: 'Starting Points for Faith',
        intro: 'Whether you\'re new to faith, returning, or simply curious, these are trusted places to begin.',
        items: [
          { name: 'BibleProject', desc: 'Visual, deeply researched Bible content. Free, accessible at any starting point.', url: 'https://bibleproject.com' },
          { name: 'Mere Christianity — C.S. Lewis', desc: 'A timeless explanation of the heart of Christian faith. Short, clear, and honest.', url: 'https://www.harpercollins.com/products/mere-christianity-c-s-lewis' },
          { name: 'The Reason for God — Tim Keller', desc: 'Christianity for thoughtful skeptics — addresses the hardest questions head-on.', url: 'https://www.penguinrandomhouse.com/books/178708/the-reason-for-god-by-timothy-keller/' },
          { name: 'Got Questions', desc: 'Bible-rooted answers to thousands of questions about faith.', url: 'https://www.gotquestions.org' }
        ]
      }
    ]
  }
};

// Render a tailored content section based on type
function renderFaithflowSection(section) {
  const heading = section.heading
    ? `<h4 class="ff-success-section-heading">${section.heading}</h4>`
    : '';

  if (section.type === 'prose') {
    const body = section.paragraphs.map(p => `<p>${p}</p>`).join('');
    return `<div class="ff-success-section ff-success-section--prose">${heading}${body}</div>`;
  }

  if (section.type === 'list') {
    const items = section.items.map(item => `<li>${item}</li>`).join('');
    return `<div class="ff-success-section ff-success-section--list">${heading}<ul>${items}</ul></div>`;
  }

  if (section.type === 'scriptures') {
    const items = section.items.map(s => `
      <li class="ff-success-scripture">
        <cite>${s.ref}</cite>
        <blockquote>"${s.text}"</blockquote>
      </li>
    `).join('');
    return `<div class="ff-success-section ff-success-section--scriptures">${heading}<ul>${items}</ul></div>`;
  }

  if (section.type === 'resources') {
    const intro = section.intro ? `<p class="ff-success-section-intro">${section.intro}</p>` : '';
    const items = section.items.map(item => `
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
    return `<div class="ff-success-section ff-success-section--resources">${heading}${intro}<ul class="ff-success-resources-list">${items}</ul></div>`;
  }

  return '';
}

function populateFaithflowResources(interestValue) {
  const content = FAITHFLOW_CONTENT[interestValue] || FAITHFLOW_CONTENT['learn-more'];

  const eyebrowEl = document.getElementById('ffResourcesEyebrow');
  const titleEl   = document.getElementById('ffResourcesTitle');
  const introEl   = document.getElementById('ffResourcesIntro');
  const listEl    = document.getElementById('ffResourcesList');
  if (!titleEl || !listEl) return;

  if (eyebrowEl) eyebrowEl.textContent = content.eyebrow || 'You Asked About';
  titleEl.textContent = content.title;
  if (introEl) introEl.style.display = 'none';   // intro is now per-section, not top-level

  listEl.innerHTML = '';
  listEl.classList.remove('ff-success-resources-list');  // not a flat list anymore
  listEl.classList.add('ff-success-content');

  listEl.innerHTML = content.sections.map(renderFaithflowSection).join('');
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
