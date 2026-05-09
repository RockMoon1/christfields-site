# Website Changelog

All notable changes to the christfields2717.com website. Organized by date and category.

---

## May 2026

### May 2026 — Security Hardening

**Security Headers (netlify.toml)**
- Added full HTTP security header suite via Netlify's `_headers` configuration in `netlify.toml`
- `Strict-Transport-Security`: 2-year max-age, includeSubDomains, preload
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME-sniffing
- `X-XSS-Protection: 0` — disables deprecated XSS auditor (was `1; mode=block`, which can be exploited in old browsers)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — disabled 20+ browser APIs the site never uses, including all Privacy Sandbox APIs added in 2023–2025
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `Content-Security-Policy`: strict policy — no `unsafe-inline`, no `eval`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`

**Cache Control (netlify.toml)**
- HTML pages: `no-cache, no-store, must-revalidate` — ensures updates go live immediately after deploy
- CSS and JS files: `no-cache, no-store, must-revalidate`
- Assets folder: `public, max-age=604800, stale-while-revalidate=86400` (7 days)

**HTTPS Enforcement**
- Added 301 redirect from `http://` to `https://` in `netlify.toml`

**Dev File Blocking**
- Added 301 redirect for `/logo-preview.html` → `/` to prevent public access to dev preview page

**Content Security Policy — HTML cleanup**
- Removed redundant `<meta http-equiv="Content-Security-Policy">` tags from `scholarflow-resources.html` and `faithflow-resources.html` — the server header is the authoritative enforcement layer

**JavaScript — Form Security (script.js)**
- Replaced inline `onerror` handlers on logo images with script-based error listeners (required for CSP compliance — no inline event handlers)
- Added client-side rate limiting on waitlist form: 10-second cooldown between submissions
- Added `maxlength` attributes on all form fields: name (100), email (254), message (1000)
- Added email format regex validation: `/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/`
- Added explicit length double-check in form submit handler (mirrors HTML attributes)
- Removed all inline `style=""` attributes from HTML and moved to CSS classes

**Netlify Forms**
- Added `netlify-honeypot="bot-field"` to waitlist form for bot spam filtering

---

### May 2026 — Resources Pages

**New Pages Created**
- `scholarflow-resources.html` — Standalone page listing trusted productivity and accountability tools:
  - Reclaim.ai (intelligent time blocking)
  - Freedom (cross-device site blocker)
  - Opal (deep focus sessions)
  - Ever Accountable (online accountability)
  - Victory by Covenant Eyes (freedom from pornography)
- `faithflow-resources.html` — Standalone page listing trusted faith and community resources:
  - BibleProject (animated Bible overviews)
  - BSF International (in-depth Bible Study Fellowship)
  - LifeChange Series by NavPress (topical Bible study guides)
  - NT Reading Plans via ESV.org (replaced a broken 404 link)
  - Celebrate Recovery (Christ-centered recovery community)

**Navigation Change**
- Removed Resources nav link (resources are now accessed via project card buttons, not top nav)
- Added "Trusted Resources →" button to ScholarFlow and FaithFlow project cards on `index.html`
- Fixed button unclickable bug: `project-card::before` pseudo-element was covering the button with `position: absolute; inset: 0` — fixed with `pointer-events: none`

**Broken Link Fix**
- NT Reading Plan link was returning 404 (Flatiron Church link no longer existed)
- Replaced with `https://www.esv.org/resources/reading-plans/` (official ESV reading plans)

---

### May 2026 — Open Graph / Social Sharing

**OG Image**
- Created `assets/og-image.png` (1200×630px) using Node.js + sharp
- Dark background with emerald radial glow, logo centered, scripture quote and site URL as text overlays
- Image gives social media shares (iMessage, Twitter/X, Facebook, Slack, Discord) a branded appearance instead of a chain-link icon

**Meta Tags Added to All Pages**
- `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:width`, `og:image:height`, `og:site_name`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Added to: `index.html`, `scholarflow-resources.html`, `faithflow-resources.html`

---

### May 2026 — Logo and Branding

**Logo Processing**
- Removed white background from `logo.png` using a BFS flood-fill algorithm (Node.js + sharp)
- Flood-fill seeds from all border pixels, marking reachable white/near-white pixels transparent
- Preserves enclosed whites and highlights inside the logo shape
- Original backed up as `assets/logo-original-backup.png`

**Logo Text Recoloring**
- "ChristFields" text in the lower portion of the logo was dark charcoal — blended into the site's dark background
- Recolored all visible pixels in the bottom 74.5% of the image to gold (HSL: hue=43°, saturation=0.72, lightness boosted to min 0.38)
- Maintains luminosity variation so the metallic appearance is preserved
- Script: `remove-bg.js` (stored locally, not in repo — processes `logo-original-backup.png` → `logo.png`)

**Logo Animation**
- Wrapped logo image in `.logo-fire-wrap` with CSS-animated fire effect (Option E — "Full Fire"):
  - Two layered glow divs with `mix-blend-mode: screen` (adds light without obscuring logo)
  - Logo flicker animation (`logoFlame` keyframes, `brightness` filter)
  - 10 ember particle spans with varied `--ox`, `--drift`, `--dur`, `--delay`, `--col` CSS custom properties
  - Hover state: scale(1.1), intensified glow, faster flicker
- Applied in both nav and footer

**Logo Size**
- Increased nav logo height from 42px to 72px for better readability at normal zoom levels
- Updated `--nav-h` from 72px to 88px to accommodate larger logo

---

### May 2026 — Content and Accuracy

**OSINT & Trace Card**
- Removed "Trace Labs" from project description and tags
- Replaced with "Missing Persons" tag
- Reason: Christ Fields has no formal partnership with Trace Labs; claiming one without authorization raises legal and accuracy concerns

**Copyright Year**
- Footer shows © 2026 Christ Fields

---

## robots.txt

- Added `/logo-preview.html` to `Disallow`
- Added `Sitemap` reference for future use

---

*This changelog is maintained manually. Dates reflect approximate development timeline.*
