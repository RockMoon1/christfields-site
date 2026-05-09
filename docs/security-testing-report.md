# Web Security Testing Report

**Project:** Christ Fields — christfields2717.com
**Tester:** Site Owner / Developer
**Date:** May 2026
**Scope:** Marketing and waitlist website — full manual review
**Report Type:** Self-conducted web security review and remediation

---

## Purpose

This report documents a manual web security review performed on the Christ Fields website during initial development. The goal was to identify misconfiguration, missing security controls, and common frontend vulnerabilities before public launch, then apply remediations and document them.

This was not a professional penetration test. It was a structured, self-directed security review guided by OWASP best practices, HTTP header standards, and secure frontend development guidelines. All findings and fixes are honest and accurate.

---

## Scope

| Area | In Scope |
|---|---|
| All HTML pages (index, scholarflow-resources, faithflow-resources) | Yes |
| HTTP security headers | Yes |
| HTTPS enforcement and HSTS | Yes |
| Content Security Policy | Yes |
| Waitlist form — input handling, submission security, spam protection | Yes |
| Frontend JavaScript — XSS vectors, unsafe patterns | Yes |
| External links — accuracy, availability | Yes |
| Deployment configuration (netlify.toml) | Yes |
| robots.txt and crawler exposure | Yes |
| Open Graph meta tags — information exposure | Yes |
| Server-side application logic | Not applicable (static site) |
| Database or authentication systems | Not applicable (static site) |
| Network-level testing (port scanning, traffic interception) | Not in scope |

---

## Tools and Methods

| Tool / Method | Purpose |
|---|---|
| Browser DevTools (Chrome) | Inspecting DOM, headers, console errors, network requests |
| Manual code review | Reviewing HTML, CSS, JS, and netlify.toml for security issues |
| [securityheaders.com](https://securityheaders.com) | Validating HTTP response headers against current best practices |
| [SSL Labs](https://www.ssllabs.com/ssltest/) | SSL/TLS configuration analysis (Netlify-managed certificates) |
| Manual link checking | Verifying all outbound links return valid responses |
| OWASP Secure Headers Project | Reference for required and recommended response headers |
| OWASP Top 10 (Web) | Framework for categorizing findings |
| Claude (AI assistant) | Documentation support and security guidance during remediation |

---

## Methodology

The review followed this sequence:

1. **Inventory** — Identified all pages, assets, forms, and external dependencies
2. **Header analysis** — Checked all HTTP response headers against OWASP and securityheaders.com recommendations
3. **CSP review** — Evaluated Content Security Policy strictness; checked for unsafe-inline, unsafe-eval, and overly broad directives
4. **JavaScript review** — Manually reviewed script.js for XSS vectors (innerHTML, document.write, eval), insecure form handling, and missing input validation
5. **Form security** — Checked for spam protection, rate limiting, input sanitization, and submission handling
6. **Link audit** — Manually verified all outbound links were live and accurate
7. **Content accuracy review** — Checked for false claims, legal exposure, and sensitive information disclosure
8. **Asset and file exposure** — Identified any development files accessible at public URLs
9. **Remediation** — Applied fixes directly to source files and deployment configuration
10. **Documentation** — Recorded all findings, risk levels, and outcomes

---

## Findings

### Summary

| Severity | Count |
|---|---|
| High | 2 |
| Medium | 4 |
| Low | 6 |
| Informational | 3 |
| **Total** | **15** |

---

### Finding Table

| # | Finding | Severity | Area | Status |
|---|---|---|---|---|
| F-01 | No HTTPS enforcement — HTTP accessible without redirect | High | Deployment | Remediated |
| F-02 | Content Security Policy absent | High | Headers | Remediated |
| F-03 | No HTTP security headers configured | Medium | Headers | Remediated |
| F-04 | Inline event handlers (`onerror`) violate CSP | Medium | HTML/JS | Remediated |
| F-05 | Inline `style=""` attributes violate strict CSP | Medium | HTML/CSS | Remediated |
| F-06 | Form accepts any string as email address | Medium | Form | Remediated |
| F-07 | No client-side rate limiting on form submission | Low | Form | Remediated |
| F-08 | No honeypot field for bot spam | Low | Form | Remediated |
| F-09 | No `Cache-Control` headers on HTML/CSS/JS | Low | Headers | Remediated |
| F-10 | Dev/preview file exposed at public URL | Low | Deployment | Remediated |
| F-11 | `Permissions-Policy` missing modern Privacy Sandbox APIs | Low | Headers | Remediated |
| F-12 | `X-XSS-Protection: 1; mode=block` — deprecated, exploitable in old browsers | Low | Headers | Remediated |
| F-13 | Broken outbound link (404) in FaithFlow resources | Informational | Content | Remediated |
| F-14 | Unverified partnership claim (Trace Labs) in site copy | Informational | Content | Remediated |
| F-15 | Redundant `<meta http-equiv="Content-Security-Policy">` in subpages | Informational | HTML | Remediated |

---

### Detailed Findings

---

#### F-01 — No HTTPS Enforcement

**Severity:** High
**Category:** Transport Security
**Description:**
The site was reachable over plain HTTP (`http://christfields2717.com`). No redirect was configured to force HTTPS. Any user navigating via HTTP would have their traffic transmitted unencrypted, and any form submission would be vulnerable to interception.

**Evidence:**
Initial `netlify.toml` contained no redirect rules.

**Remediation Applied:**
Added a 301 redirect rule in `netlify.toml`:
```toml
[[redirects]]
  from   = "http://christfields2717.com/*"
  to     = "https://christfields2717.com/:splat"
  status = 301
  force  = true
```
Also added `Strict-Transport-Security` header with a 2-year max-age, `includeSubDomains`, and `preload` directive for HSTS preload list eligibility.

---

#### F-02 — Content Security Policy Absent

**Severity:** High
**Category:** OWASP A03 — Injection (XSS)
**Description:**
No Content Security Policy was configured. Without a CSP, the browser places no restrictions on script execution sources, allowing injected scripts (via a compromised CDN, browser extension, or man-in-the-middle scenario) to execute freely. While the static nature of this site limits XSS exposure, the absence of a CSP is a significant missing control.

**Evidence:**
No `Content-Security-Policy` header in initial response headers. No CSP meta tag present.

**Remediation Applied:**
Implemented a strict CSP via `netlify.toml`:
```
default-src 'self';
script-src 'self';
style-src 'self' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self';
form-action 'self';
frame-ancestors 'none';
base-uri 'self';
object-src 'none';
upgrade-insecure-requests
```
Key points: no `unsafe-inline`, no `unsafe-eval`, Google Fonts explicitly whitelisted, form POST restricted to same origin.

---

#### F-03 — No HTTP Security Headers

**Severity:** Medium
**Category:** Security Misconfiguration
**Description:**
The initial deployment had no HTTP security response headers configured. The following were absent:

- `X-Frame-Options` — clickjacking protection
- `X-Content-Type-Options` — MIME-sniffing prevention
- `Referrer-Policy` — referrer data leakage
- `Permissions-Policy` — browser feature restrictions
- `Cross-Origin-Opener-Policy` — cross-origin window attacks
- `Cross-Origin-Resource-Policy` — resource hotlinking

**Evidence:**
No headers present in initial response. Confirmed with browser DevTools Network tab.

**Remediation Applied:**
Full header suite added to `netlify.toml` under `[[headers]]` for `"/*"`. See `netlify.toml` for full values.

---

#### F-04 — Inline Event Handlers Violate CSP

**Severity:** Medium
**Category:** CSP Bypass / Code Quality
**Description:**
Logo `<img>` elements used `onerror="..."` inline event handler attributes. These are blocked by any CSP with `script-src 'self'` (no `unsafe-inline`). They also represent a weaker pattern — inline handlers are harder to audit and easier to weaponize in injection scenarios.

**Evidence:**
```html
<img src="assets/logo.png" onerror="this.style.display='none'">
```

**Remediation Applied:**
Removed all inline `onerror` handlers. Replaced with script-based event listeners in `script.js`:
```js
document.querySelectorAll('.nav-logo-img').forEach(img => {
  img.addEventListener('error', () => { img.style.display = 'none'; });
});
```

---

#### F-05 — Inline Style Attributes Violate Strict CSP

**Severity:** Medium
**Category:** CSP Compliance
**Description:**
Several elements used `style="display:none"` or similar inline style attributes. Strict CSP policies that omit `style-src 'unsafe-inline'` block these. Inline styles also make it harder to audit all visual behavior from a single source.

**Evidence:**
Multiple `style=""` attributes found in `index.html`.

**Remediation Applied:**
Moved all inline styles to CSS classes in `style.css`. Removed all `style=""` attributes from HTML.

---

#### F-06 — Form Accepts Any String as Email

**Severity:** Medium
**Category:** Input Validation
**Description:**
The waitlist form's JavaScript validation only checked `if (!email)` — it did not verify the email was in a valid format. A submission of `x`, `@`, or `abc@` would pass the client-side check. While Netlify handles server-side processing and the honeypot reduces bot activity, proper format validation is a baseline control.

Note: The HTML `<input type="email">` attribute provides some browser-level validation, but this is bypassable via scripted requests or DevTools.

**Evidence:**
```js
// Before
if (!name || !email) return;
```

**Remediation Applied:**
Added email format regex validation:
```js
const emailRe = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
if (!email || !emailRe.test(email) || email.length > 254) return;
```
Also added explicit length bounds check for `name` (max 100 chars) mirroring the `maxlength` HTML attribute.

---

#### F-07 — No Client-Side Rate Limiting on Form

**Severity:** Low
**Category:** Denial of Service / Spam
**Description:**
No delay or cooldown was enforced between form submissions. A user or script could rapidly re-submit the form by clicking the button multiple times or scripting repeated calls to the submit handler. While Netlify has server-side spam protection, client-side throttling is an additional layer.

**Remediation Applied:**
Added a 10-second rate limit enforced via `Date.now()` comparison:
```js
const RATE_LIMIT_MS = 10000;
if (now - lastSubmitTime < RATE_LIMIT_MS) { return; }
```
The button also disables after submission and shows a waiting message.

---

#### F-08 — No Honeypot Field

**Severity:** Low
**Category:** Spam Protection
**Description:**
The form had no hidden honeypot field. Automated bots often fill every visible field — a hidden field that legitimate users never see provides a lightweight bot filter.

**Remediation Applied:**
Added Netlify's built-in honeypot:
```html
<form netlify-honeypot="bot-field" ...>
  <p hidden><label>Do not fill this out: <input name="bot-field"></label></p>
```

---

#### F-09 — No Cache-Control Headers

**Severity:** Low
**Category:** Information Exposure / Stale Content
**Description:**
No `Cache-Control` headers were configured. Browsers and CDN edges may cache HTML pages aggressively. After deploying a fix (including a security fix), users could be served the old cached version. This is especially relevant for security-sensitive updates like form validation or script changes.

**Remediation Applied:**
Added per-type Cache-Control rules in `netlify.toml`:
- HTML: `no-cache, no-store, must-revalidate`
- CSS/JS: `no-cache, no-store, must-revalidate`
- Assets: `public, max-age=604800, stale-while-revalidate=86400`

---

#### F-10 — Dev/Preview File Exposed at Public URL

**Severity:** Low
**Category:** Information Disclosure
**Description:**
`logo-preview.html` — a development file used to compare five logo animation options — was present in the site root and accessible at `https://christfields2717.com/logo-preview.html`. It exposed internal design iteration work and could reveal information about the site's structure and tooling.

**Remediation Applied:**
- Added `Disallow: /logo-preview.html` to `robots.txt`
- Added a 301 redirect in `netlify.toml` routing the URL to `/`

---

#### F-11 — Permissions-Policy Missing Modern APIs

**Severity:** Low
**Category:** Privacy / Feature Control
**Description:**
The initial `Permissions-Policy` header covered basic APIs (camera, mic, geolocation) but was missing all Privacy Sandbox APIs introduced by Google in 2023–2025, as well as several hardware APIs (Bluetooth, NFC, HID, Serial, Wake Lock, WebXR).

**Remediation Applied:**
Expanded `Permissions-Policy` to 20+ directives including:
`browsing-topics=()`, `join-ad-interest-group=()`, `run-ad-auction=()`, `attribution-reporting=()`, `private-aggregation=()`, `shared-storage=()`, `bluetooth=()`, `serial=()`, `hid=()`, `nfc=()`, `screen-wake-lock=()`, `xr-spatial-tracking=()`, `identity-credentials-get=()`

---

#### F-12 — X-XSS-Protection Set to Exploitable Value

**Severity:** Low
**Category:** Security Misconfiguration
**Description:**
`X-XSS-Protection: 1; mode=block` was initially set. This header is deprecated and the XSS Auditor it controls was removed from Chrome/Edge. In Internet Explorer and very old browsers, `mode=block` can actually be exploited to perform information disclosure attacks via timing side channels. The recommended modern value is `0` to explicitly disable the broken auditor.

**Remediation Applied:**
Changed to `X-XSS-Protection: 0`.

---

#### F-13 — Broken Outbound Link (404)

**Severity:** Informational
**Category:** Content Quality
**Description:**
The NT Reading Plan link in `faithflow-resources.html` pointed to a Flatiron Church URL that no longer exists and returned a 404. Any visitor clicking it would reach a broken page.

**Remediation Applied:**
Replaced with the official ESV Reading Plans page: `https://www.esv.org/resources/reading-plans/`

---

#### F-14 — Unverified Partnership Claim

**Severity:** Informational
**Category:** Legal / Accuracy
**Description:**
The OSINT & Trace project card referenced Trace Labs by name and implied a partnership relationship. Publicly claiming a partnership with an organization without their authorization can create legal exposure and misrepresents the project's actual status.

**Remediation Applied:**
Removed "Trace Labs" from the project description and tags. Language now refers to "collaboration with organizations working toward that same end" — accurate and non-specific.

---

#### F-15 — Redundant Meta CSP in Subpages

**Severity:** Informational
**Category:** Code Quality / CSP Clarity
**Description:**
`scholarflow-resources.html` and `faithflow-resources.html` contained `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`. Since the full CSP is enforced at the server/CDN level via `netlify.toml`, these meta tags were redundant. Their presence could cause confusion during future audits about which CSP was authoritative.

**Remediation Applied:**
Removed redundant meta CSP tags from both subpages.

---

## Residual Risk and Limitations

| Item | Notes |
|---|---|
| Client-side validation is bypassable | All JS validation can be bypassed by scripted requests. Netlify provides server-side spam filtering; this is accepted risk for a static waitlist site. |
| Google Fonts is an external dependency | Fonts load from `fonts.googleapis.com` and `fonts.gstatic.com`. These are explicitly whitelisted in CSP. Compromise of Google's font CDN is outside this project's control. |
| No Subresource Integrity (SRI) for Google Fonts | SRI for dynamically-served Google Fonts is impractical due to variable content. Accepted risk. |
| No CSP violation reporting | No `report-uri` or `report-to` endpoint is configured. Violations will not be logged. A future improvement would be adding a reporting endpoint. |
| HSTS preload not yet submitted | The header is configured correctly for preload eligibility. The domain has not yet been submitted to the browser HSTS preload list. |
| SSL/TLS managed by Netlify | TLS certificate and cipher configuration is handled by Netlify. Not independently tested. Expected to be strong (Netlify uses Let's Encrypt with modern TLS). |

---

## Skills Demonstrated

This review demonstrates practical application of the following:

- **Web security fundamentals** — HTTP security headers, CSP, HSTS, clickjacking prevention, MIME sniffing, referrer control
- **OWASP awareness** — Mapping findings to OWASP Top 10 categories (A03 Injection, A05 Misconfiguration)
- **Secure frontend development** — Eliminating inline event handlers, moving styles to CSS, validating and sanitizing form input
- **Deployment security** — Configuring security controls at the CDN/hosting layer (Netlify `_headers`)
- **Documentation discipline** — Structured finding format with severity, evidence, and remediation — consistent with real-world security reporting
- **Remediation mindset** — Not just identifying issues but understanding root causes and applying appropriate fixes
- **Honest scoping** — Clearly distinguishing a self-directed review from a professional penetration test

---

*This report was written by the site owner and developer. All findings are honest and reflect actual work performed on the codebase.*
