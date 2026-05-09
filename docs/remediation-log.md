# Remediation Log

A chronological record of all security findings identified and remediated on the Christ Fields website. Each entry includes the date, what was found, what action was taken, and the result.

Cross-reference with [`security-testing-report.md`](security-testing-report.md) for full finding details.

---

## May 2026

| Date | Finding ID | Issue | File(s) Changed | Action Taken | Result |
|---|---|---|---|---|---|
| May 2026 | F-01 | No HTTPS enforcement — site reachable over plain HTTP | `netlify.toml` | Added 301 redirect from `http://*` to `https://*` | All HTTP traffic now permanently redirected to HTTPS |
| May 2026 | F-01 | No HSTS header | `netlify.toml` | Added `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` | Browsers will enforce HTTPS for 2 years after first visit |
| May 2026 | F-02 | No Content Security Policy | `netlify.toml` | Implemented strict CSP: `default-src 'self'`, no `unsafe-inline`, no `eval`, Google Fonts whitelisted | XSS attack surface significantly reduced |
| May 2026 | F-03 | Missing X-Frame-Options | `netlify.toml` | Added `X-Frame-Options: DENY` | Clickjacking via iframe embedding blocked |
| May 2026 | F-03 | Missing X-Content-Type-Options | `netlify.toml` | Added `X-Content-Type-Options: nosniff` | MIME-sniffing attacks blocked |
| May 2026 | F-03 | Missing Referrer-Policy | `netlify.toml` | Added `Referrer-Policy: strict-origin-when-cross-origin` | Referrer data no longer leaked to third parties |
| May 2026 | F-03 | Missing Cross-Origin-Opener-Policy | `netlify.toml` | Added `Cross-Origin-Opener-Policy: same-origin` | Cross-origin window reference attacks blocked |
| May 2026 | F-03 | Missing Cross-Origin-Resource-Policy | `netlify.toml` | Added `Cross-Origin-Resource-Policy: same-origin` | Asset hotlinking from other origins blocked |
| May 2026 | F-03 | Basic Permissions-Policy | `netlify.toml` | Added initial Permissions-Policy disabling camera, mic, geolocation, payment, USB, and more | Unnecessary browser features disabled |
| May 2026 | F-04 | Inline `onerror` event handlers on logo images | `index.html`, `script.js` | Removed all `onerror="..."` attributes; added equivalent `addEventListener('error', ...)` in `script.js` | HTML is now CSP-compliant; no inline event handlers |
| May 2026 | F-05 | Inline `style=""` attributes | `index.html`, `style.css` | Moved all inline styles to CSS classes | HTML is now compliant with strict CSP `style-src` without `unsafe-inline` |
| May 2026 | F-06 | Form accepts any string as email | `script.js` | Added regex validation: `/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/` and length bounds check | Invalid email strings now rejected client-side |
| May 2026 | F-07 | No rate limiting on form submission | `script.js` | Added 10-second cooldown using `Date.now()` comparison; button disabled after submit | Rapid resubmission prevented |
| May 2026 | F-08 | No honeypot spam protection | `index.html` | Added `netlify-honeypot="bot-field"` and hidden input to form | Netlify-level bot filtering enabled |
| May 2026 | F-09 | No Cache-Control headers | `netlify.toml` | Added per-type Cache-Control: HTML/CSS/JS → `no-cache, no-store, must-revalidate`; assets → `public, max-age=604800` | Security updates propagate immediately; assets cached efficiently |
| May 2026 | F-10 | Dev file `logo-preview.html` accessible publicly | `netlify.toml`, `robots.txt` | Added 301 redirect to `/` in `netlify.toml`; added `Disallow` in `robots.txt` | File blocked from public access and search indexing |
| May 2026 | F-11 | Permissions-Policy missing 2023–2025 Privacy Sandbox APIs | `netlify.toml` | Expanded Permissions-Policy to 20+ directives including all Privacy Sandbox and hardware APIs | All known modern browser APIs now explicitly disabled |
| May 2026 | F-12 | `X-XSS-Protection: 1; mode=block` — deprecated and exploitable | `netlify.toml` | Changed to `X-XSS-Protection: 0` | Deprecated header disabled; reduces risk in legacy browsers |
| May 2026 | F-13 | Broken outbound link (404) — NT Reading Plan | `faithflow-resources.html` | Replaced dead Flatiron Church URL with `https://www.esv.org/resources/reading-plans/` | All outbound links now return valid responses |
| May 2026 | F-14 | Unauthorized partnership claim — Trace Labs | `index.html` | Removed "Trace Labs" from OSINT project description and tags | No false partnership claim; reduced legal exposure |
| May 2026 | F-15 | Redundant meta CSP in subpages | `scholarflow-resources.html`, `faithflow-resources.html` | Removed `<meta http-equiv="Content-Security-Policy">` from both pages | Single authoritative CSP source (netlify.toml header) |

---

## Additional Content and UX Fixes (Same Sprint)

| Date | Issue | Action Taken | Result |
|---|---|---|---|
| May 2026 | "Trusted Resources" button on project cards was unclickable | Added `pointer-events: none` to `.project-card::before` pseudo-element | Button now correctly receives click events |
| May 2026 | Resources section making main page too long | Moved resources to standalone sub-pages (`scholarflow-resources.html`, `faithflow-resources.html`) | Cleaner UX; project cards now have focused "Trusted Resources →" buttons |
| May 2026 | No branded social sharing image | Created 1200×630 `og-image.png` using Node.js + sharp | Social shares now show branded image instead of chain-link icon |
| May 2026 | Logo has white background; blends poorly on dark site | Removed background via BFS flood-fill (Node.js + sharp) | Logo now has transparent background |
| May 2026 | Logo text ("ChristFields") hard to read on dark background | Recolored text pixels to gold (HSL: hue=43°, sat=0.72) in processing script | Logo text is clearly visible at normal zoom |

---

## Open Items

| Issue | Notes |
|---|---|
| HSTS preload list submission | Header is configured correctly. Domain should be submitted at [hstspreload.org](https://hstspreload.org) after deployment. |
| CSP violation reporting | No `report-to` endpoint configured. Violations are silently dropped. A reporting endpoint (e.g., report-uri.com free tier) would provide visibility into any CSP issues in production. |
| Formal SSL/TLS audit | Netlify manages TLS. Recommend running a full SSL Labs test after deploy to confirm A+ rating. |

---

*All remediations were applied directly to source files and deployment configuration. No finding was marked resolved without a corresponding code change.*
