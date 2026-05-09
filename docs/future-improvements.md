# Future Improvements

Planned work and known gaps for the Christ Fields website and ecosystem. Organized by priority.

---

## Security

| Item | Priority | Notes |
|---|---|---|
| Submit domain to HSTS preload list | High | HSTS header is configured correctly. Submit at [hstspreload.org](https://hstspreload.org) after first stable deploy. Preload protects users on their very first visit before HSTS has been cached. |
| Run SSL Labs test post-deploy | High | Verify Netlify's TLS configuration earns an A+ rating. Free at [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/). |
| Run securityheaders.com scan post-deploy | High | Confirm all headers are delivered correctly in production. Some headers only work over HTTPS and cannot be fully tested locally. |
| Add CSP violation reporting | Medium | Configure a `report-to` endpoint so CSP violations are logged rather than silently dropped. Free options: [report-uri.com](https://report-uri.com) free tier. |
| Add a `sitemap.xml` | Low | Helps search indexing and completes the `robots.txt` sitemap reference already in place. |
| Subresource Integrity for third-party resources | Low | SRI for Google Fonts is impractical (dynamic content), but should be evaluated if other CDN-hosted scripts are added in the future. |

---

## Website Features

| Item | Priority | Notes |
|---|---|---|
| Add favicon | High | No favicon currently configured. Users see a default browser icon. |
| Add PWA manifest (`manifest.json`) | Medium | Enables "Add to Home Screen" on mobile and improves browser tab appearance. |
| Add social media links to footer | Medium | Footer has a placeholder comment for social links. Add as accounts are created. |
| Add real screenshots to README | Medium | README has a placeholder section. Add after first live deploy. |
| Versioned asset filenames (cache busting) | Low | CSS and JS use `no-cache` headers since filenames are not versioned. Long-term, using hashed filenames (e.g., `style.abc123.css`) would allow long-lived caching with automatic cache busting on change. |

---

## Logo and Branding

| Item | Priority | Notes |
|---|---|---|
| Upscale logo to higher resolution | Medium | Current logo is 155×145px — low resolution for retina/HiDPI displays. Consider regenerating at 2× or 3× size. |
| Professional logo touchups | Medium | Original logo has areas that could benefit from cleanup. Consider vector format (SVG) long-term for full scalability. |
| Add `<link rel="icon">` favicon using the logo | Medium | Crop or adapt the logo for favicon use at 32×32 and 192×192. |
| Add `apple-touch-icon` | Low | iOS home screen icon for when users bookmark the site. |

---

## Products — ScholarFlow

| Item | Priority | Notes |
|---|---|---|
| Define MVP feature set | High | Core loop: task management + distraction blocking + habit tracking |
| Evaluate tech stack | High | Framework (Next.js / SvelteKit), database, auth provider, AI API |
| Build waitlist landing page specific to ScholarFlow | Medium | Dedicated domain or subdomain with more detail about the product |
| Google Docs / Calendar integration research | Medium | OAuth scope requirements, API quotas, privacy implications |
| Design accountability system | Medium | How does ScholarFlow make it harder to cheat than existing tools? |

---

## Products — FaithFlow

| Item | Priority | Notes |
|---|---|---|
| Define pilot group structure | High | Meeting format, study materials, commitment expectations, group size |
| Identify pilot city / location | High | In-person model requires geographic focus for first group |
| Create intake form for interested participants | Medium | More detailed than the general waitlist; captures location, availability, goals |

---

## Products — OSINT & Trace

| Item | Priority | Notes |
|---|---|---|
| Define methodology and ethical guidelines | High | OSINT work requires clear rules of engagement and privacy boundaries |
| Research partner organizations | High | Identify legitimate missing persons organizations to collaborate with |
| Document tools and workflow | Medium | Create internal documentation for reproducible OSINT process |

---

## Documentation

| Item | Priority | Notes |
|---|---|---|
| Add screenshots to `docs/` folder | Medium | Visual record of design decisions |
| Create a contributing guide if the project opens to collaborators | Low | Guidelines for code style, branch naming, PR process |
| Add version tags to this repo as stable milestones are reached | Low | e.g., `v0.1.0` — first deploy, `v0.2.0` — after ScholarFlow landing page |

---

*This document is updated as the project evolves. Items here are aspirational — not commitments.*
