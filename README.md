# Christ Fields

**"As iron sharpens iron, so one person sharpens another." — Proverbs 27:17**

A Christian technology company building tools and communities for people who want to live and work with wisdom, integrity, and faithfulness.

---

## What This Repository Is

This is the source code and documentation for the [christfields2717.com](https://christfields2717.com) marketing and waitlist website. The site introduces the Christ Fields brand, presents the projects currently in development, and collects early-access signups via a Netlify-hosted waitlist form.

It is an evolving personal and startup project. The code, documentation, and security work here represent real decisions made during active development — not a polished finished product.

---

## Mission

Christ Fields exists at the intersection of faith and technology. We build tools that genuinely serve people — helping them manage time, resist distraction, grow in faithfulness, and walk with integrity in private as well as in public.

---

## Projects

| Project | Status | Description |
|---|---|---|
| **ScholarFlow** | Coming Soon | Student productivity and personal growth app — AI task management, habit building, Bible study, and wellness in one platform |
| **FaithFlow** | Coming Soon | In-person small group community for honest accountability, spiritual growth, and brotherhood/sisterhood |
| **OSINT & Trace** | In Development | Applying open-source intelligence and cybersecurity to help locate missing persons |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Hosting | [Netlify](https://netlify.com) (static deploy via Netlify Drop) |
| Forms | Netlify Forms (with honeypot spam filtering) |
| Frontend | Vanilla HTML5, CSS3, JavaScript (no frameworks) |
| Fonts | Google Fonts — Cormorant Garamond, Inter |
| Image Processing | Node.js + [sharp](https://sharp.pixelplumbing.com/) (local scripts only, not served) |
| Version Control | Git / GitHub |

---

## Security Posture

This site was reviewed for common web security vulnerabilities and hardened accordingly. Key measures in place:

- Strict Content Security Policy (no `unsafe-inline`, no `eval`)
- HSTS with 2-year max-age, subdomains, and preload
- HTTPS enforcement via 301 redirect
- Full HTTP security header suite (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `COOP`, `CORP`, `Permissions-Policy`)
- Netlify honeypot + client-side rate limiting on the waitlist form
- Input length enforcement and email format validation
- Cache-Control headers per asset type
- Dev/preview files blocked from public access

For full details see [`docs/security-testing-report.md`](docs/security-testing-report.md) and [`docs/remediation-log.md`](docs/remediation-log.md).

---

## Repository Structure

```
/
├── index.html                      # Main landing page
├── scholarflow-resources.html      # ScholarFlow trusted resources page
├── faithflow-resources.html        # FaithFlow trusted resources page
├── logo-preview.html               # Dev/animation preview (blocked in production)
├── style.css                       # All styles
├── script.js                       # All frontend JavaScript
├── netlify.toml                    # Deployment config + security headers
├── robots.txt                      # Crawler rules
├── package.json                    # Node.js deps (image processing scripts only)
├── assets/
│   ├── logo.png                    # Processed logo (transparent bg, gold text)
│   ├── og-image.png                # Open Graph / social sharing image (1200×630)
│   └── logo-process-notes.md       # Notes on logo processing scripts
└── docs/
    ├── project-overview.md         # Full project description and context
    ├── website-changelog.md        # Chronological log of site changes
    ├── security-testing-report.md  # Web security review and findings
    ├── remediation-log.md          # Fixes applied with dates and outcomes
    └── future-improvements.md      # Planned work and known gaps
```

---

## Screenshots

*Coming soon — screenshots will be added after the next deploy.*

---

## Live Site

[christfields2717.com](https://christfields2717.com)

---

## Roadmap

- [ ] Deploy to Netlify and verify all security headers with securityheaders.com
- [ ] Submit domain to HSTS preload list
- [ ] Add favicon and PWA manifest
- [ ] Build ScholarFlow MVP
- [ ] Launch FaithFlow small group pilot
- [ ] Add social media links as accounts are created

---

## Disclaimer

This is an actively evolving personal and startup project. Code quality, documentation, and features will continue to improve. This repository is shared publicly to demonstrate real-world development, security awareness, and documentation practices — not as a finished product.

---

*Christ Fields — Iron sharpens iron.*
