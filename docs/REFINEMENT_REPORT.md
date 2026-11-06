# Portfolio refinement — delivery report

Branch: `refine/portfolio-v2` (based on `main` at `f76d633`). Pull request: https://github.com/armonon/portfolio/pull/1. Preview: https://deploy-preview-1--armonnasiri.netlify.app Nothing has been published to production and no DNS has been changed.

## 1. What was implemented

### Content hierarchy (Phase 2)
- **Homepage**, in order: Hero → 01 Selected work → 02 Evidence → 03 Expertise → 04 Process → 05 About → 06 Contact. Numbers appear only on the homepage and run in order; subpages have none.
- **Hero**: "Ideas into working products." with the requested subline. "You name it, I create it" is kept as the secondary line with the rotating word. The hero also has availability, location, **Explore selected work** and **Start a project**. The collage of real work is still there on desktop.
- **Selected work**: six projects (Sattari Music, Luma Studio, Form Studio, BREAKTHYRULE Eden, ScenePilot, Universal Computer Operator). Each has a live recording or still, its registry status, one verifiable proof line and a case-study link.
- **Evidence**: verified test counts, the full-apps band (live recordings with screenshot strips), the showreel and a live client-site list.
- **New pages**: material that used to make the homepage very long now lives on its own page.
  - `/work`: case studies, websites, AI video and art, social and messaging, more projects, client sites, thecreateco, full index. A jump menu sits at the top.
  - `/services`: the three families, the full service list, local AI agents and engagement types.
  - `/tools`, `/hire` and a 404 page.
- **Old URLs** keep working:
  - `/`, `/work`, `/work/:slug` and `/apps` are unchanged.
  - Old single-page anchors redirect: `#services`, `#agents`, `#tools`, `#websites`, `#sattari`, `#social`, `#best`, `#full-apps`, `#ai-video`, `#index`, `#platforms`, `#studio`, `#apps`.
  - `#/product-radar` still works.

### Capabilities (Phase 3)
- Three families (Digital Products, Creative Technology, AI & Automation) with exactly the items you listed. Each links to the case studies that prove it (`src/services.ts → families`).

### Product status (Phase 4)
- **`src/registry.ts`** is the single source of truth: status, family, live link and public source for 53 entries, including all 40 catalogue apps.
- Statuses: Live / Released, Public Beta, Prototype, In Development, Private Build. They are deliberately conservative: anything its own page calls "alpha", "public testing" or "preview" is a Public Beta.
- Every status pill on the site reads from the registry: cards, catalogue, case pages, full apps, index table, hire page.
- The catalogue has a status filter. Counts come from the registry: 40 apps, of which 36 are Public Beta, 2 Prototype, 1 In Development and 1 Private Build.
- `scripts/check-registry.ts` fails the build-check if any app, flagship or project is missing from the registry or the counts disagree.
- **Claims corrected:**
  - **Luma Studio** was described as a "Rust/wgpu" editor and linked the separate `sweet-suite` repo. It is now accurately a TypeScript engine shared by web and Tauri, with a Rust compositor, and links `armonon/luma-studio`. "108 tests" became "1,200+".
  - **Form Studio**: "200+ tests" became "1,500+", per the repo.
  - **UCO** no longer claims "no API key, nothing leaves the machine". It supports Ollama (local) plus optional Anthropic and Codex back-ends.
  - The hero no longer says "40+ products shipped".

### Case studies (Phase 5)
- **Reusable sections** on `/work/:slug`:
  - status pill
  - the problem
  - my role
  - process
  - architecture & decisions
  - challenges & solutions
  - outcomes (verifiable only)
  - technology
  - source link or private-repo note
  - client and employer prompts
- The existing walkthroughs and footage are kept.
- The content (`src/caseDetails.ts`) was written for the six priority projects. Every fact was checked against the repositories.
- A new page, `/work/universal-computer-operator`, was added.
- The Sattari tabbed showcase now sits on the Sattari case page. Its tabs swap media in place and never open bare images.

### Contact (Phase 6)
- **Form fields:** name, email, category, description, optional budget and timeline.
- **In the browser:** validation with clear messages, focus moves to the first invalid field, and a loading state. On error, the text is kept and an email fallback is offered. A success confirmation is shown, and live regions announce status changes.
- **On the server:** `netlify/functions/contact.mjs` at `/api/contact`.
  - Accepts JSON only, up to 20 KB, and validates every field again.
  - Spam: a honeypot field, a minimum fill time, a link-stuffing check and a per-IP rate limit.
  - Stores the inquiry in **Netlify Forms** (form `contact`, declared in `index.html`), so **no API keys** are involved.
  - It only reports success if Netlify Forms accepted the submission. Otherwise the visitor sees an error plus the mailto fallback.
- Direct email stays on every page.

### Performance and media (Phase 7)
- **Posters:** every video has a generated poster frame (`scripts/posters.sh`, 47 posters). Clips only load near the viewport, pause off-screen, and show the poster first.
- **Reduced motion:** with reduced motion turned on, nothing autoplays (a play button is offered) and all ambient animation stops.
- **Animations:** infinite framer-motion loops (hero glow, floating collage, pulse dots) were replaced with compositor-only CSS keyframes.
- **Code splitting:** every page except the homepage is a separate chunk. The homepage JS went from 174 KB gzipped in one bundle to about 150 KB.
- **Fonts:** self-hosted (Latin subset, variable, 107 KB total). The hero fonts are preloaded, and metric-matched fallbacks remove font-swap layout shift. Two third-party font connections are gone.
- **Lazy media:** the 4 MB thecreateco scroll video now loads only when it is near the viewport (`/work` went from 5.9 MB to 1.7 MB).
- **Layout shift is zero** on every page measured. The fixes:
  - a reserved hero height
  - contact and footer render together with lazy pages
  - the static fallback HTML no longer collapses its margin
- **Caching** (`public/_headers`): immutable caching for hashed assets and fonts, one day plus stale-while-revalidate for media, and basic security headers.

### Mobile and accessibility (Phase 8)
- **Contrast:** `--faint` was darkened to pass WCAG AA (4.8:1; it was 3.1:1).
- **Headings:** one h1 per page with no skipped levels.
- **Keyboard and dialogs:**
  - Focus is trapped in the project modal, lightbox, ⌘K palette and mobile menu. Escape closes each one, and focus returns to where it was.
  - A skip link was added.
  - The palette has proper combobox and listbox roles.
- **Touch targets:** 40px or more in the nav and contact areas.
- **Device mockups:** decorative URL bars are hidden from screen readers.
- **Overflow:** none at 360, 390, 768, 1024 or 1440px.

### SEO and domain (Phase 9)
- **Domain:** `https://armonnasiri.netlify.app/* → https://armonnasiri.com/:splat 301!`. I verified that armonnasiri.com is already the primary domain on Netlify and that www already redirects. Deploy previews use other hostnames and are unaffected.
- **Per-page HTML:** every route gets its own prerendered HTML with a unique title, description, canonical, Open Graph and Twitter tags, and crawlable fallback content. New: `/services`, `/tools`, `/hire` and the UCO case.
- **Structured data:** JSON-LD with Person, ProfessionalService and WebSite on the site. Each case page gets CreativeWork or SoftwareApplication.
- **Sitemap:** now 24 URLs.
- **Navigation:** route-aware (Work · Services · Apps · About · For employers · Contact) with `aria-current`. This fixes the wrong highlight on the app catalogue.

### Hiring path (Phase 10)
- `/hire` includes:
  - background
  - specialties (from your existing capabilities)
  - six engineering case studies with key decisions
  - 8 public repositories, each verified public via the GitHub API
  - applied AI and data practice repos
  - experience (existing entries only, nothing added)
  - contact options
- A **Résumé** button appears automatically when `public/resume.pdf` exists.

## 2. Files changed
New:
- `src/registry.ts`, `src/caseDetails.ts`, `src/Home.tsx`, `src/ContactForm.tsx`, `src/contact.ts`, `src/lib.ts`, `src/ui.tsx`, `src/data/projects.ts`
- `src/pages/{WorkPage,ProjectPage,AppsPage,ToolsPage,ServicesPage,HirePage,SattariShowcase}.tsx`, `src/env.d.ts`
- `netlify/functions/contact.mjs`, `public/_headers`, `public/fonts/*`, `public/og/universal-computer-operator.jpg`, `public/videos/posters/*` (47)
- `scripts/check-registry.ts`, `scripts/test-contact.mjs`, `scripts/posters.sh`, `docs/REFINEMENT_REPORT.md`

Modified:
- `src/App.tsx` (now only the shell), `src/cases.ts`, `src/showcase.ts`, `src/services.ts`, `src/productRadarData.ts`, `src/index.css`
- `index.html`, `vite.config.ts`, `public/_redirects`, `package.json`, `package-lock.json` (adds `tsx` as a dev dependency)

Untouched: `netlify/functions/product-sweep.mjs`, Product Radar and all existing media.

## 3. Tests
| Check | Result |
|---|---|
| `tsc -b` | passes |
| `eslint .` | passes, 0 problems |
| `npm run build` | passes |
| `npm test`: registry consistency | passes (53 entries, counts agree) |
| `npm test`: contact function (11 cases, network mocked) | 11/11 |
| Interactive browser suite (60 checks: hero actions, section order and numbering, nav and current state, legacy redirects, filters and search, tabs, case pages, ⌘K, modal focus trap, form validation, error, success and payload, Back scroll restore, posters, reduced motion, mobile menu, touch targets, every internal link, page errors) | 60/60 |
| Route smoke test at 5 widths (one h1, heading order, overflow, console errors, failed requests) | all clean (unknown URLs correctly return 404 with the site's own page) |
| Same interactive suite against the live deploy preview | 60/60 |
| Contact function on the preview: wrong method / invalid fields | 405 / 422 with field errors (no valid submission sent) |
| External links (59) | all resolve except: Digital Human demo on Render returns 503 (existing link, service appears down); GitHub profile returns 403 only from this sandbox's proxy |

## 4. Performance (Lighthouse 12, local production build, simulated throttling)
Mobile figures are the median of 3 runs.

| Page | Before | After |
|---|---|---|
| Home, mobile | Perf 47 · A11y 94 · LCP 5.2 s · TBT 2,800 ms · CLS 0 | **Perf 89 · A11y 100** · LCP 3.6 s · TBT 100 ms · CLS 0 |
| Home, desktop | Perf 98 · A11y 91 · CLS 0.048 | **Perf 99 · A11y 100** · LCP 0.9 s · CLS 0 |
| /work/sattari, mobile | Perf 92 · A11y 96 (live site) | **Perf 94 · A11y 100** · CLS 0 |
| /work, mobile | 5.9 MB transferred (earlier build: the 4 MB scroll video loaded up front) | **1.7 MB** · Perf 82 · CLS 0 |
| /apps, mobile | not measured before | Perf 93 · A11y 100 · CLS 0 |

Best Practices and SEO score 100 on every page measured locally.

**On the deploy preview** (real Netlify CDN; Netlify's preview-only feedback toolbar was blocked, because it adds 1.6 MB that production never loads):

| Page | Perf | A11y | BP | LCP | CLS | Transferred |
|---|---|---|---|---|---|---|
| Home, mobile (3 runs) | 95–96 | 100 | 100 | 2.4 s | 0 | 1.1 MB |
| Home, desktop | 100 | 100 | 100 | 0.6 s | 0 | 1.5 MB |
| /work/sattari, mobile (2 runs) | 95–96 | 100 | 100 | 2.5–2.7 s | 0 | 1.9 MB |
| /apps, mobile | 96 | 100 | 100 | 2.6 s | 0 | 0.3 MB |

SEO shows 69 on the preview only because Netlify serves previews with `x-robots-tag: noindex`. That is intended, and production is not affected.

## 5. Remaining limitations
- **Mobile LCP is about 3.5 s locally and 2.4 s on the Netlify CDN** under Lighthouse's throttled phone profile. The hero headline is rendered by React, so it waits for JavaScript. Prerendering the homepage hero into the HTML would be the next step.
- **No responsive `srcset` and no AV1/WebM.** Images are still single-size JPEGs and videos are still the existing H.264 MP4s. Off-screen posters and videos are deferred instead.
- **The contact function was only tested with a mocked network.** I did not submit to Netlify, because that would store a real submission and could email you.
- **The rate limit is per function instance** (best effort). Netlify Forms adds its own spam filter.
- **Share images:** the UCO image is a plain crop of a screenshot. `/services` and `/hire` reuse the default share image.
- **Testing was emulated.** Mobile layouts were tested in Chromium device emulation, not on physical phones.

## 6. Configuration you need to provide
1. **Netlify Forms:**
   - In Netlify, go to *Site configuration → Forms* and enable **form detection**.
   - After the next deploy, the `contact` form appears there. Add an **email notification** to the address you want.
   - Until form detection is on, the site's form shows its error state with the email fallback, so nothing is lost.
2. **Netlify secrets scan:** rotate `PRODUCT_SWEEP_ADMIN_TOKEN` (its old value collides with text in the repo). This blocked the last production deploy. It did not block this deploy preview, but rotate it before merging so the production build isn't stopped again.
3. **Résumé:** add `public/resume.pdf` and the download button appears on `/hire`.
4. Optionally, check the **Digital Human** demo on Render.

## 7. How to deploy
1. Review the deploy preview linked from the pull request.
2. Enable Netlify form detection (above).
3. Merge the PR into `main`. Netlify builds and publishes production from `main`.
4. On the live site, send one inquiry yourself and confirm it appears under *Forms → contact* and arrives by email.
5. Check that `https://armonnasiri.netlify.app/work` redirects to `https://armonnasiri.com/work`.
