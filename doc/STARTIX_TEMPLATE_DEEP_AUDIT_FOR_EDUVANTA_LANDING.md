# Startix Template Deep Audit for EduVanta Landing Page

**Date:** 2026-05-10  
**Auditor:** GitHub Copilot  
**Audit scope:** Read-only. No EduVanta source modified except creating this file.

---

## 1. Executive Summary

Startix is a premium multipurpose SaaS/Agency landing page Next.js template. It ships five homepage variants (SaaS, App, Startup, AI, Software) together with a full set of inner pages (About, Services, Projects, Blog, Pricing, FAQ, Contact, Team, 404). It is visually polished, animation-rich, and built with a professional design language.

**Suitability verdict: Suitable with caution.**

Startix is technically a standalone Next.js app that uses Bootstrap 5, global SCSS, GSAP (including premium ScrollSmoother/SplitText plugins), Jarallax, Swiper, and Marquee3000 — none of which exist in EduVanta. Its CSS global imports would catastrophically collide with EduVanta's Tailwind v4 + shadcn/ui dashboard if imported naively. However, a carefully scoped integration (landing page only, CSS isolated to a parent wrapper class, GSAP/Bootstrap loaded only on the landing route) is achievable without touching EduVanta's dashboard, auth, i18n, or test infrastructure.

The recommended primary variant for EduVanta is **home-1 (SaaS Landing)**.

---

## 2. Startix Location and Runnable App Root

| Item | Path |
|------|------|
| Template root | `EduVanta/Startix/` |
| Documentation | `EduVanta/Startix/documentation/` |
| **Runnable Next.js app** | **`EduVanta/Startix/startix-nextjs/`** |
| `package.json` | `EduVanta/Startix/startix-nextjs/package.json` |
| `next.config.ts` | `EduVanta/Startix/startix-nextjs/next.config.ts` |
| App root | `EduVanta/Startix/startix-nextjs/src/app/` |

The runnable app is confirmed at `Startix/startix-nextjs/`. It has its own `.git` repo, its own `node_modules` would be installed separately, and it is completely independent of EduVanta.

---

## 3. Startix Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | ^16.0.0 | Framework — App Router, SSR/SSG |
| React | 19.1.0 | UI rendering |
| TypeScript | ^5 | Type safety |
| Bootstrap | ^5.3.8 | Layout, grid, components (navbar, accordion, modal) |
| Sass | ^1.93.2 | SCSS compilation — master stylesheet |
| GSAP | ^3.13.0 | Scroll-triggered animations, text splitting, smooth scroll |
| Jarallax | ^2.2.1 | Parallax background images |
| Swiper | ^12.0.2 | Carousel/slider (partners, testimonials, how-it-works) |
| marquee3000 | ^1.1.1 | Infinite text/logo marquee strip |
| react-countup | ^6.5.3 | Animated number counters |
| react-intersection-observer | ^9.16.0 | Viewport-based animation triggers |
| react-responsive-masonry | ^2.7.1 | Masonry grid layout (blog/projects) |
| react-responsive-modal | ^7.0.0 | Lightbox/video modal |
| prop-types | ^15.8.1 | Runtime prop validation |

**Note on GSAP:** `ScrollSmoother` and `SplitText` are **GSAP Club (paid) plugins**, required for the smooth scroll wrapper (`#smooth-wrapper / #smooth-content`) and character-split text animations used in every hero section. These are included in the vendor bundle. They must be licensed to use in production.

---

## 4. Folder and File Structure

```
Startix/startix-nextjs/
├── next.config.ts              # typedRoutes: true, sassOptions includePaths
├── package.json
├── tsconfig.json
├── public/
│   └── assets/
│       ├── css/
│       │   ├── bootstrap.min.css    ← Full Bootstrap 5 CSS (~30KB min)
│       │   ├── flaticon.css         ← Flaticon icon font
│       │   ├── tabler-icons.min.css ← Tabler icons (used extensively)
│       │   └── fonts/               ← Icon font files
│       ├── img/
│       │   ├── core-img/    ← Logos, shapes, decorative PNGs (44 files)
│       │   ├── bg-img/      ← Hero/section backgrounds (124 files)
│       │   ├── demo-img/    ← Template preview images
│       │   └── partner-img/ ← Partner/integration logos (12 files)
│       └── scss/
│           ├── styles.scss          ← Master SCSS (imports all partials)
│           ├── _reboot.scss         ← CSS vars, * reset, body/html
│           ├── _header.scss
│           ├── _hero.scss
│           ├── _about.scss
│           ├── _features.scss
│           ├── _pricing.scss
│           ├── _testimonial.scss
│           ├── _footer.scss
│           ├── _cta.scss
│           ├── _faq.scss
│           ├── _blog.scss
│           ├── _partner.scss
│           ├── _process.scss
│           ├── _service.scss
│           ├── _team.scss
│           ├── _video.scss
│           ├── _miscellaneous.scss
│           ├── _preloader.scss
│           ├── _jarallax.scss
│           ├── _theme.scss          ← data-theme="two/three/four/five" overrides
│           ├── _cookie.scss
│           ├── _newsletter.scss
│           ├── _project.scss
│           ├── _breadcrumb.scss
│           ├── _contact.scss
│           ├── _demo.scss
│           └── _rs.scss             ← Responsive breakpoint vars (used via @use 'rs')
└── src/
    ├── app/
    │   ├── layout.tsx              ← Root layout: imports SCSS, Google Fonts, ThemeProvider
    │   ├── page.tsx                ← "/" → HomePreview (template demo index)
    │   ├── loading.tsx
    │   ├── (homes)/
    │   │   ├── home-1/page.tsx
    │   │   ├── home-2/page.tsx
    │   │   ├── home-3/page.tsx
    │   │   ├── home-4/page.tsx
    │   │   └── home-5/page.tsx
    │   ├── (outhers)/              ← Note: "outhers" typo in template
    │   │   ├── about-us/
    │   │   ├── contact/
    │   │   ├── faq/
    │   │   └── pricing/
    │   ├── (blog)/
    │   ├── (project)/
    │   ├── (service)/
    │   ├── (team)/
    │   ├── 404/
    │   └── [...not-found]/
    ├── common/
    │   ├── ThemeProvider.tsx       ← Sets data-theme on <html> per route
    │   ├── AnimationProvider.tsx   ← GSAP ScrollSmoother + all animations
    │   ├── ScrollToTop.tsx         ← Scroll-to-top button with progress
    │   ├── SearchbarArea.tsx
    │   ├── SidebarArea.tsx
    │   ├── Breadcrumb.tsx
    │   └── count.tsx               ← react-countup wrapper
    ├── components/
    │   └── homes/
    │       ├── home/               ← Template demo index (HomePreview)
    │       ├── home-1/             ← SaaS Landing (11 components)
    │       ├── home-2/             ← App Landing
    │       ├── home-3/             ← Startup Landing
    │       ├── home-4/             ← AI Landing (11 components)
    │       └── home-5/             ← Software Landing
    ├── layouts/
    │   ├── Wrapper.tsx             ← AnimationProvider + ScrollToTop + SVG icons
    │   ├── headers/
    │   │   ├── HeaderOne.tsx       ← With topbar (email/phone/location)
    │   │   ├── HeaderTwo.tsx
    │   │   ├── HeaderThree.tsx
    │   │   ├── HeaderFour.tsx      ← Minimal, dark, with offcanvas sidebar
    │   │   ├── HeaderFive.tsx
    │   │   └── Navmenu.tsx         ← Shared dropdown nav from menu-data.ts
    │   └── footers/
    │       ├── FooterOne.tsx       ← 4-column with logo, social, links
    │       ├── FooterTwo.tsx
    │       ├── FooterThree.tsx
    │       ├── FooterFour.tsx
    │       └── FooterFive.tsx
    ├── data/
    │   ├── menu-data.ts
    │   ├── service-data.ts
    │   ├── projects-data.ts
    │   └── testimonial-data.ts
    ├── hooks/
    ├── modal/
    ├── styles/
    │   └── index.scss              ← Entry point: imports Bootstrap CSS, flaticon, tabler-icons, styles.scss
    ├── svg/
    └── types/
```

---

## 5. Route and Page Inventory

| Route | Page File | Component | Notes |
|-------|-----------|-----------|-------|
| `/` | `app/page.tsx` | `HomePreview` | Template demo index — not a real landing |
| `/home-1` | `app/(homes)/home-1/page.tsx` | `HomeOne` | SaaS Landing |
| `/home-2` | `app/(homes)/home-2/page.tsx` | `HomeTwo` | App Landing |
| `/home-3` | `app/(homes)/home-3/page.tsx` | `HomeThree` | Startup Landing |
| `/home-4` | `app/(homes)/home-4/page.tsx` | `HomeFour` | AI Landing |
| `/home-5` | `app/(homes)/home-5/page.tsx` | `HomeFive` | Software/Agency |
| `/about-us` | `app/(outhers)/about-us/page.tsx` | `AboutUs` | Inner page |
| `/contact` | `app/(outhers)/contact/page.tsx` | `Contact` | Inner page |
| `/faq` | `app/(outhers)/faq/page.tsx` | `Faq` | Inner page |
| `/pricing` | `app/(outhers)/pricing/page.tsx` | `Pricing` | Inner page |
| `/services` | `app/(service)/services/page.tsx` | `Services` | Inner page |
| `/service-details` | `app/(service)/service-details/page.tsx` | — | Inner page |
| `/projects` | `app/(project)/projects/page.tsx` | — | Inner page |
| `/project-details` | `app/(project)/project-details/page.tsx` | — | Inner page |
| `/blog` | `app/(blog)/blog/page.tsx` | — | Inner page |
| `/blog-grid` | `app/(blog)/blog-grid/page.tsx` | — | Inner page |
| `/blog-details` | `app/(blog)/blog-details/page.tsx` | — | Inner page |
| `/team` | `app/(team)/team/page.tsx` | — | Inner page |
| `/team-details` | `app/(team)/team-details/page.tsx` | — | Inner page |
| `/404` | `app/404/page.tsx` | — | Custom 404 |

**None of these routes are locale-prefixed.** All routes are flat English-only paths.

---

## 6. Homepage Variant Analysis

### home-1 — SaaS Landing

- **Header:** `HeaderOne` — fixed, with topbar bar (email/phone/address/social), sticky on scroll, SearchbarArea toggle
- **Footer:** `FooterOne` — 4-column: logo+bio+social, Pages, Utility Pages, Information
- **Sections (in order):**
  1. `HeroHomeOne` — dark hero with large headline, trust metric with avatar group + CountUp (10k+ customers), supporting copy, hero dashboard screenshot (`bg-img/29.png`), background shape
  2. `BrandsHomeOne` — Swiper auto-scroll partner logo strip
  3. `HowWeWorkHomeOne` — Swiper card carousel of services with sidebar image
  4. `AboutHomeOne` — 2-col: image left, content right, bullet list, CTA button
  5. `FeaturesHomeOne` — alternating 2-col feature blocks (Marketing Teams, Project Management...)
  6. `PricingHomeOne` — 3-tier pricing cards with monthly/yearly toggle (React state)
  7. `TestimoniaHomeOne` — Swiper testimonial slider with avatar, name, role
  8. `IntegrationHomeOne` — Grid of integration cards (Instagram, X, Adobe XD, Figma, Slack...)
  9. `FaqHomeOne` — 2-col: heading+CTA left, Bootstrap accordion right
  10. `CtaHomeOne` — Dark CTA with headline, copy, 2 CTA buttons
- **Visual style:** Dark hero, light body sections alternating with `bg-secondary` (#F7F8FF), strong blue primary (`#3147FF`), animated headings
- **Key assets:** `bg-img/29.png` (hero screenshot), `bg-img/28.jpg` (about), `bg-img/30-35.png/jpg`, `core-img/shape*.png` (backgrounds), `partner-img/1-12.png`
- **Dependencies used:** Swiper (brands + HowWeWork + testimonials), react-countup (hero), GSAP (all scroll animations + smooth scroll), Bootstrap JS (FAQ accordion), Jarallax (none in home-1)
- **EduVanta suitability:** ⭐⭐⭐⭐⭐ — Excellent. SaaS positioning maps directly to EduVanta's school management SaaS pitch. Pricing section is ready. Integration section adapts to EdTech integrations. FAQ is ready. CTA converts perfectly.

### home-2 — App Landing

- **Header:** `HeaderTwo` — transparent, minimal
- **Footer:** `FooterTwo`
- **Sections:** Hero, Features, FunFact (CountUp stats, SSR disabled via `dynamic()`), About, Interface (app screenshots), Pricing, Testimonials, FAQ, CTA, Blog
- **Visual style:** Gradient/glassmorphic, lighter palette
- **EduVanta suitability:** ⭐⭐⭐ — App-feel is less relevant than SaaS positioning. Interface screenshots would need EdTech dashboard screenshots. FunFact section is a nice addition but FunfactHomeTwo is explicitly `ssr: false`.

### home-3 — Startup Landing

- **Header:** `HeaderThree`
- **Footer:** `FooterThree`
- **Sections:** Hero, About, Services, Projects, Testimonials, Pricing, FAQ, Blog, CTA
- **Visual style:** Warmer tones, more agency/startup feel, prominent project showcases
- **EduVanta suitability:** ⭐⭐ — Projects/portfolio focus is irrelevant for a school management SaaS. Agency-style positioning doesn't match.

### home-4 — AI Landing

- **Header:** `HeaderFour` — minimal dark with no topbar, offcanvas sidebar for nav
- **Footer:** `FooterFour`
- **Sections (in order):**
  1. `HeroHomFour` — **Jarallax parallax** hero, full-bleed dark image background (`bg-img/59.jpg`), minimal headline + rotating circular graphic
  2. `AboutHomeFour` — About with stats
  3. `FeaturesHomeFour` — Feature cards (Networking, Algorithm, Integration)
  4. `ServiceHomeFour` — Service grid
  5. `VideoHomeFour` — Jarallax video section with modal
  6. `ProjectHomeFour` — Masonry project grid (`react-responsive-masonry`)
  7. `TestimonialHomeFour` — Testimonial slider
  8. `PricingHomeFour` — Pricing cards
  9. `FaqHomeFour` — FAQ accordion
  10. `BlogHomeFour` — Blog grid
  11. (No CTA section in home-4)
- **Visual style:** Dark throughout, AI/tech aesthetic, heavy use of Jarallax parallax
- **Key extra dependencies:** Jarallax (hero + video), react-responsive-masonry (projects), react-responsive-modal (video lightbox)
- **EduVanta suitability:** ⭐⭐⭐ — The dark/AI aesthetic is modern but may be too "AI startup" rather than "school management platform". Projects/masonry grid is irrelevant. No dedicated CTA section. Jarallax adds hydration risk.

### home-5 — Software/Agency Landing

- **Header:** `HeaderFive`
- **Footer:** `FooterFive`
- **Sections:** Hero, Services, WhatWeDo, OurService, Projects, Process, Team, Testimonials, FAQ, CTA
- **Visual style:** Agency, bold typography, strong grid
- **EduVanta suitability:** ⭐ — Agency/portfolio focus with Team showcase and Projects grid is entirely wrong for a school management SaaS.

---

## 7. Recommended Variant for EduVanta

**Primary recommendation: home-1 (SaaS Landing)**

Reasons:
1. **Positioning match:** SaaS Landing is designed for platforms sold on subscription — identical to EduVanta's school/college/LMS SaaS model.
2. **Section fit:** Every section maps naturally — hero→EduVanta pitch, brands→school/EdTech partners, how-it-works→onboarding steps, about→company story, features→module highlights, pricing→EduVanta tiers, testimonials→school admin quotes, integrations→EdTech tools, FAQ→common questions, CTA→free trial / demo.
3. **Fewer risky dependencies:** Does not use Jarallax (parallax) or react-responsive-masonry, reducing hydration risk vs home-4.
4. **Bootstrap accordion for FAQ:** Works without Bootstrap JS if replaced with a Headless UI/Radix accordion, making CSS isolation easier.
5. **HeaderOne topbar:** The contact/social strip is easy to replace with EduVanta contact info.
6. **FooterOne:** Clean 4-column structure ideal for EduVanta's feature links.
7. **Pricing section with monthly/yearly toggle:** Directly usable for EduVanta's subscription tiers (Basic/Standard/Premium → Starter/Professional/Enterprise).
8. **Integration section:** Maps perfectly to EdTech integrations (Google Workspace, Microsoft Teams, Zoom, Moodle, etc.)
9. **No masonry/projects grid:** The generic agency sections (Projects, Team) do not appear in home-1.

**Secondary option (if dark aesthetic is preferred):** home-4, but it requires Jarallax (parallax + video modal), has no dedicated CTA section, and includes irrelevant Projects/masonry content.

---

## 8. Recommended Landing Section Map (home-1)

| Order | Component | File | Current Startix Purpose | EduVanta Purpose | Text Replacement | Key Assets | Tech Risk |
|-------|-----------|------|------------------------|------------------|-----------------|------------|-----------|
| 1 | `HeaderOne` | `layouts/headers/HeaderOne.tsx` | Nav with topbar, logo, search | EduVanta nav: logo, links (Features, Pricing, Login, Get Started) | Email, phone, address, all nav labels, logo src | `core-img/logo.png` → EduVanta logo | Requires Bootstrap sticky JS |
| 2 | `HeroHomeOne` | `components/homes/home-1/HeroHomeOne.tsx` | SaaS headline + trust metric + dashboard screenshot | "Manage Every School, College & LMS in One Platform" + 10k+ schools metric + EduVanta dashboard screenshot | Headline, copy, metric label + number | `bg-img/29.png` → EduVanta dashboard screenshot | react-countup SSR |
| 3 | `BrandsHomeOne` | `components/homes/home-1/BrandsHomeOne.tsx` | Partner logo Swiper carousel | EdTech/school partner logos or "Trusted by schools in 20+ countries" | Replace 5 partner logo images | `partner-img/1-5.png` | Swiper SSR |
| 4 | `HowWeWorkHomeOne` | `components/homes/home-1/HowWeWorkHomeOne.tsx` | Service Swiper slider | "How EduVanta Works": Sign Up → Add School → Import Students → Go Live | Section heading, 3-step process text, sidebar image | `bg-img/35.jpg` | Swiper |
| 5 | `AboutHomeOne` | `components/homes/home-1/AboutHomeOne.tsx` | Generic about + 3 bullets | "Built for Modern Educators": EduVanta story, 3 benefits (Multi-language, Mobile-ready, Secure) | All copy, 3 bullet texts, CTA button text | `bg-img/28.jpg` | None |
| 6 | `FeaturesHomeOne` | `components/homes/home-1/FeaturesHomeOne.tsx` | Marketing & Project Mgmt features | EduVanta modules: "Student Management", "Finance & Fees", "Academic Calendar" | All headings, all body copy, feature bullet lists, CTA text | `bg-img/32.png`, `bg-img/33.png` | None |
| 7 | `PricingHomeOne` | `components/homes/home-1/PricingHomeOne.tsx` | 3-tier with monthly/yearly toggle | EduVanta tiers: Starter / Professional / Enterprise with school-specific limits | All plan names, prices, feature list texts | None | None |
| 8 | `TestimoniaHomeOne` | `components/homes/home-1/TestimoniaHomeOne.tsx` | Generic customer testimonials | School admin and principal testimonials | All quote text, names, roles, avatar images | Avatar images from `bg-img/` | Swiper |
| 9 | `IntegrationHomeOne` | `components/homes/home-1/IntegrationHomeOne.tsx` | Generic tool integrations (Instagram, Figma, Slack…) | EdTech integrations (Google Workspace, Microsoft 365, Zoom, WhatsApp, Moodle, PayPal) | All integration names, descriptions, logos | `partner-img/6-12.png` → integration logos | None |
| 10 | `FaqHomeOne` | `components/homes/home-1/FaqHomeOne.tsx` | Generic SaaS FAQ | EduVanta FAQ (pricing, multi-tenant, data security, languages, support) | All FAQ question and answer text | `core-img/question-mark.png` | Bootstrap JS accordion |
| 11 | `CtaHomeOne` | `components/homes/home-1/CtaHomeOne.tsx` | "Sign Up for 14 Day Free Trial" | "Start Your Free School Trial" or "Book a Demo" | Headline, copy, 2 button labels | None | None |
| 12 | `FooterOne` | `layouts/footers/FooterOne.tsx` | Generic footer with 4 columns | EduVanta footer: logo, tagline, social links, Features/Company/Legal/Support columns | All column headings, all link texts, social hrefs, copyright | `core-img/logo.png` → EduVanta logo | None |

---

## 9. Header, Navigation, and CTA Audit

### HeaderOne Structure
- **Two zones:** TopBar (email / address / phone / social icons) + Navbar (logo / Navmenu dropdown / search toggle / login CTA)
- **State:** `useState` for search open/close; `UseSticky` custom hook for scroll-based `sticky-on` class
- **Navmenu:** Renders from `data/menu-data.ts` — a typed array with nested dropdowns. Current items: Home (5 submenu variants), About Us, Pages (mega-dropdown), Blog, Contact
- **CTA in header:** None in home-1 header by default — login/sign-up buttons would need to be added
- **Mobile:** Bootstrap collapse navbar via `data-bs-toggle="collapse"` — requires Bootstrap JS
- **Search:** `SearchbarArea` component — fullscreen overlay, uses `window` directly (SSR risk)
- **Logo:** `<Image src="/assets/img/core-img/logo.png">` — replace with EduVanta logo

### Changes needed for EduVanta:
- Replace `menu-data.ts` entries with: Features, Pricing, About, Blog, Login → `/en/login`, Get Started → `/en/login`
- Remove topbar or replace with EduVanta contact/language switcher
- Replace logo `src`
- CTA links must point to `/en/login` or `/en/dashboard`
- Remove "Home" dropdown submenu (template navigation) entirely

---

## 10. Footer Audit

### FooterOne Structure
- 4-column grid: Column 1 (logo + bio + social), Column 2 (Pages), Column 3 (Utility Pages), Column 4 (Information)
- Copyright line at bottom
- Social icons use Tabler Icons `<i className="ti ti-brand-*">` — dependent on `tabler-icons.min.css`
- All links are `<a href="#">` placeholders
- Logo: `/assets/img/core-img/logo.png`

### Changes needed for EduVanta:
- Replace logo, company bio, social hrefs
- Column 2 → EduVanta feature links (Students, Teachers, Finance, Library…)
- Column 3 → Company links (About, Blog, Careers, Contact)
- Column 4 → Legal/Support (Privacy Policy, Terms, Help Center, Security)
- Copyright → "© 2026 EduVanta. All rights reserved."
- Remove attribution to Startix template

---

## 11. Styling and CSS Collision Risk

### How Startix loads CSS

```
src/styles/index.scss (global import in app/layout.tsx)
├── ../../public/assets/css/bootstrap.min.css   ← FULL Bootstrap 5
├── ../../public/assets/css/flaticon.css         ← Flaticon icon font
├── ../../public/assets/css/tabler-icons.min.css ← Tabler icons
└── ../../public/assets/scss/styles.scss
    ├── _reboot.scss   ← *{margin:0;padding:0} + :root CSS vars + body/html resets
    ├── _header.scss
    ├── _hero.scss
    └── ... (25 SCSS partials)
```

**This is a single global import in `layout.tsx`.** In Next.js App Router, styles imported in the root layout apply globally to ALL routes. If this import were placed in EduVanta's layout, it would affect every page.

### CSS Collision Analysis

| Startix Style | EduVanta Impact | Risk Level |
|--------------|-----------------|------------|
| Bootstrap 5 `.container`, `.row`, `.col-*` | Conflicts with Tailwind `container` if both active | 🔴 Critical |
| Bootstrap `.btn`, `.btn-primary` | Overrides EduVanta's shadcn/ui Button component styles | 🔴 Critical |
| Bootstrap `.navbar`, `.nav-*` | Collides with EduVanta sidebar/topbar nav | 🔴 Critical |
| Bootstrap `.form-control`, `.form-check` | Breaks EduVanta auth/form inputs | 🔴 Critical |
| Bootstrap `.accordion-*` | Collides if EduVanta uses accordion anywhere | 🟠 High |
| `_reboot.scss: * { margin:0; padding:0 }` | Flattens Tailwind margin/padding defaults | 🔴 Critical |
| `:root { --Primary, --Secondary... }` | Pollutes EduVanta's Tailwind/shadcn CSS variable namespace | 🟠 High |
| `body` font-family (Poppins/Inter via Google Fonts) | Overrides EduVanta's font choice | 🟡 Medium |
| `.header-section position:fixed` | Could overlay EduVanta dashboard topbar | 🔴 Critical |
| Bootstrap grid `@media` breakpoints | Conflicts with Tailwind responsive prefixes | 🟠 High |
| Tabler Icons font (same as EduVanta uses `ti-*`) | **May be compatible** — EduVanta also uses Tabler Icons | 🟢 Low |
| Flaticon `.flaticon-*` classes | No overlap with EduVanta | 🟢 Low |
| Swiper CSS (`swiper/css` imports in components) | Isolated to components using Swiper | 🟡 Medium |

### Recommended CSS Isolation Strategy

**Strategy: Route-level CSS import + parent class namespace**

1. **Do NOT import Startix CSS in EduVanta's root `app/layout.tsx`.**
2. Create a dedicated `app/[locale]/(landing)/layout.tsx` (or keep it in the existing locale page) that imports Startix CSS only for the landing route.
3. Wrap ALL Startix landing content in a single parent `<div className="startix-root">` and prepend all Startix custom SCSS selectors with `.startix-root`.
4. Bootstrap CSS cannot be namespaced easily — instead, import Bootstrap only inside a CSS layer or scoped import.
5. Use Next.js `<link>` with `precedence` prop or dynamic route-scoped stylesheet imports.
6. Never import Bootstrap, flaticon, or tabler-icons CSS globally in EduVanta — EduVanta already handles its icon set separately.
7. The `_reboot.scss` `* { margin:0; padding:0 }` MUST be scoped to `.startix-root *` or removed.

---

## 12. Dependency Risk and Bundle Impact

| Package | Used Where | EduVanta Equivalent | Must Add | SSR Risk | Bundle Impact |
|---------|-----------|---------------------|----------|----------|--------------|
| `bootstrap` ^5.3.8 | All layout, grid, navbar, accordion, carousel | None (Tailwind + shadcn/ui) | CSS only for landing | JS: bootstrap.js loaded in AnimationProvider via `require()` — SSR safe (client-only) | +30KB CSS, +70KB JS |
| `sass` ^1.93.2 | SCSS compilation | Not in EduVanta (Tailwind v4) | Only for landing SCSS | None | Build-time only |
| `gsap` ^3.13.0 | AnimationProvider — ALL animations, ScrollSmoother, SplitText | No equivalent | Yes, for animations | 🔴 High — `window` usage, must be `"use client"` + dynamic import | +180KB |
| `gsap ScrollSmoother` | `#smooth-wrapper / #smooth-content` scroll | None | Yes (GSAP Club plugin) | 🔴 High — browser-only | Included in gsap bundle |
| `gsap SplitText` | `.heading-chars` text animations | None | Yes (GSAP Club plugin) | 🟡 Medium — client-only | Included in gsap bundle |
| `jarallax` ^2.2.1 | `HeroHomFour`, `VideoHomeFour` (home-4 only) | None | **No** — not needed for home-1 | 🔴 High — requires `window`, jarallax.css | ~25KB |
| `swiper` ^12.0.2 | BrandsHomeOne, HowWeWorkHomeOne, TestimoniaHomeOne | EduVanta has no Swiper | Yes | 🟡 Medium — SSR-safe with proper config | ~150KB |
| `marquee3000` | Not found in home-1 components | None | **No** — not needed for home-1 | 🔴 High — browser-only | ~10KB |
| `react-countup` ^6.5.3 | `count.tsx` (HeroHomeOne trust metric) | None | Yes | 🟡 Medium — disable SSR with `enableScrollSpy` | ~20KB |
| `react-intersection-observer` ^9.16.0 | Animation triggers | None | Yes (paired with countup) | 🟢 Low | ~5KB |
| `react-responsive-masonry` ^2.7.1 | ProjectHomeFour (home-4 only) | None | **No** — not needed for home-1 | 🔴 High — requires window | ~15KB |
| `react-responsive-modal` ^7.0.0 | VideoHomeFour (home-4 only) | None | **No** — not needed for home-1 | 🟡 Medium | ~20KB |
| `prop-types` ^15.8.1 | Runtime type checks | None (TypeScript) | **No** | None | ~10KB |

**Total additional bundle for home-1 (estimated):** Bootstrap CSS ~30KB + GSAP ~180KB + Swiper ~150KB + react-countup ~20KB = **~380KB additional** (gzipped ~100KB).

**GSAP Club plugins warning:** `ScrollSmoother` and `SplitText` appear to be included as part of the gsap package installed (`gsap@^3.13.0`). In GSAP 3.12+, some previously Club-only plugins were made free. As of GSAP 3.12, `SplitText` was made free; `ScrollSmoother` requires GSAP Club. **Verify licensing before production use.**

---

## 13. Asset Audit

### Asset Overview

| Group | Location | Count | Size estimate | Notes |
|-------|----------|-------|---------------|-------|
| Core images (logos, shapes, icons) | `public/assets/img/core-img/` | 44 files | ~500KB | All critical — logos, shapes, decorative |
| Background images | `public/assets/img/bg-img/` | 124 files | ~15MB | Most are unused for home-1 — only ~12 needed |
| Demo images | `public/assets/img/demo-img/` | ~12 files | ~2MB | Template preview only — do not copy |
| Partner images | `public/assets/img/partner-img/` | 12 files | ~200KB | Needed for brands + integrations sections |
| Bootstrap CSS | `public/assets/css/bootstrap.min.css` | 1 file | ~230KB | Minified Bootstrap 5 |
| Flaticon CSS | `public/assets/css/flaticon.css` | 1 file | ~20KB | Flaticon icon font (rarely used in home-1) |
| Tabler Icons CSS | `public/assets/css/tabler-icons.min.css` | 1 file | ~80KB | Used extensively (header, footer, nav icons) |
| Icon font files | `public/assets/css/fonts/` | ~10 files | ~500KB | TTF/WOFF/WOFF2 for Tabler and Flaticon |

### Assets Required for home-1 Specifically

**Core images (required):**
- `core-img/logo.png` — replace with EduVanta logo
- `core-img/logo-light.png` — light variant for dark bg headers
- `core-img/logo-sm.png` — small favicon-style logo
- `core-img/shape2.png` — pricing section background
- `core-img/shape4.png` — about section background
- `core-img/shape6.png` — hero section background
- `core-img/question-mark.png` — FAQ section decoration
- `core-img/cursor.png`, `core-img/curved-arrow.png` — decorative

**Background images (home-1 specific):**
- `bg-img/28.jpg` — About section photo
- `bg-img/29.png` — Hero dashboard screenshot (replace with EduVanta screenshot)
- `bg-img/30.png`, `bg-img/31.png` — Hero avatar group (trust metric)
- `bg-img/32.png`, `bg-img/33.png` — Features section images
- `bg-img/35.jpg` — How It Works sidebar image
- Testimonial avatars (various from bg-img)

**Partner images (home-1 specific):**
- `partner-img/1.png` through `partner-img/12.png` — All needed for brands + integrations

**Recommended target location in EduVanta:**
```
public/startix/
├── img/
│   ├── core-img/     (only required files above)
│   ├── bg-img/       (only required files above)
│   └── partner-img/  (all 12 files)
└── css/
    ├── bootstrap.min.css
    ├── tabler-icons.min.css
    ├── fonts/
    └── (flaticon.css — optional)
```

**Do NOT copy:**
- `public/assets/img/demo-img/` — template preview only
- 100+ unused `bg-img/` files from other homepage variants
- Multiple logo variants for themes 2-5 (`logo-two.png`, `logo-three.png`, etc.)

---

## 14. Animation and Browser API Audit

### GSAP (AnimationProvider.tsx)

```tsx
"use client"; // ✓ correct
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import SplitText from "gsap/SplitText";
```

- All GSAP initialization is inside `useEffect` with `typeof window !== "undefined"` guard — **SSR-safe in isolation**
- However, `AnimationProvider` is rendered inside `Wrapper` which wraps EVERY page — it runs on every route
- `ScrollSmoother.create()` requires `#smooth-wrapper` and `#smooth-content` DOM elements — they must exist in the page HTML before GSAP runs
- `SplitText` splits `.heading-chars` elements on mount — if elements are not yet painted, animations fail silently
- Animations re-initialize on every route change via `usePathname` dependency — **memory leak risk** without proper cleanup (cleanup exists via `ctx.revert()` but ScrollSmoother cleanup is incomplete)

### Jarallax (home-4 only)

```tsx
import { useJarallax } from "@/hooks/useJarallax";
import 'jarallax/dist/jarallax.css';
```

- Direct `window` and `document` access — **will crash on SSR if not guarded**
- Custom hook `useJarallax` uses `useEffect` — SSR-safe if implemented correctly
- **Not needed for home-1 — do not include**

### Swiper

```tsx
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
```

- Swiper React is generally SSR-safe in Next.js 15/16 with App Router
- CSS imports inside component files create per-component style injection — acceptable
- `Autoplay` module requires client interaction — use `"use client"` directive (already done in template)

### Bootstrap JS

```tsx
useEffect(() => {
  if (typeof window !== "undefined") {
    require("bootstrap/dist/js/bootstrap");
  }
}, []);
```

- Loaded via dynamic `require()` in `useEffect` — **client-only, SSR-safe**
- Required for: navbar collapse, FAQ accordion (`data-bs-toggle="collapse"`), offcanvas sidebar
- If Bootstrap JS is not loaded, the FAQ accordion will not open/close interactively
- **Mitigation:** Replace Bootstrap accordion with a React state-based accordion to remove Bootstrap JS dependency entirely

### Marquee3000

- Not used in home-1 — **skip entirely**

### react-countup

- Used in `count.tsx` (HeroHomeOne trust metric)
- SSR-compatible if `enableScrollSpy` is set — renders static `0` on server, animates on client
- Use `<CountUp enableScrollSpy scrollSpyOnce>` to prevent flash

### `data-speed` attribute (Jarallax)

- Elements in home-1 have `data-speed="0.8"` attributes (e.g., question-mark image) — these are no-ops without Jarallax loaded. Safe to leave in HTML.

### `data-delay` attribute (GSAP)

- Elements use `data-delay="0.3"` etc. — read by `AnimationProvider` GSAP code to set animation delay. Safe to leave in HTML.

---

## 15. I18N and RTL Compatibility

### Current Startix State

| Concern | Status |
|---------|--------|
| Locale routing | ❌ None — flat English-only routes (`/home-1`, `/home-4`) |
| RTL support | ❌ None — uses Bootstrap `ms-*`/`me-*` spacing (logical properties, RTL-compatible) but no `dir="rtl"` handling |
| `text-align: left` hardcoded | 🟡 Possible — inspect SCSS partials for `text-align: left` (found in `_header.scss`, `_hero.scss`) |
| `margin-left`/`margin-right` hardcoded | 🟡 Possible — `pe-xxl-5`, `ms-3` Bootstrap classes are logical (OK for RTL) but custom SCSS may have `left:` values |
| `float: left` | ❌ Bootstrap 5 does not use float-based grid — OK |
| `position: absolute; left:` | 🟡 Likely in decorative/shape elements — needs inspection |
| Hardcoded English text | ❌ All text is hardcoded English strings in TSX files |
| `next-intl` integration | ❌ None — no `useTranslations`, no `routing.ts`, no `[locale]` param |

### Required for EduVanta Landing (future work):

1. **Phase 1 (initial):** Landing page can be English-only. Wrap in EduVanta's `[locale]` route but only render EN content initially. Add `hreflang` meta tags.
2. **Phase 2 (i18n):** Extract all hardcoded strings from landing components into EduVanta's `messages/en.json` under a `landing.*` namespace. Add AR/UR translations.
3. **Phase 3 (RTL):** Audit all Startix SCSS for `left:`/`right:` physical properties. Bootstrap 5 logical props (ms/me/ps/pe) already work RTL. Custom SCSS `_hero.scss`, `_header.scss`, `_footer.scss` need RTL overrides.
4. **Do not** mix Bootstrap RTL CSS with Tailwind RTL utilities on the same page.

---

## 16. EduVanta Integration Strategy Recommendation

### Recommended Strategy: Route-scoped CSS + Locale-aware Page Component

**Do NOT:**
- Import Startix `index.scss` in EduVanta's root `app/layout.tsx`
- Install Bootstrap globally in EduVanta
- Copy Startix route groups (`(homes)/`) into EduVanta's `src/app/`
- Replace EduVanta's current `src/app/[locale]/page.tsx` wholesale without testing CSS isolation

**DO:**

1. **Keep Startix CSS entirely separate from EduVanta's Tailwind CSS.**
   - Create a dedicated landing layout: `src/app/[locale]/(landing)/layout.tsx`
   - Import Startix CSS **only** in this layout — not in the root layout
   - This ensures Bootstrap and Startix SCSS never load on dashboard, auth, or any other EduVanta route

2. **Create a `StartixLandingPage` component** that contains all home-1 sections.
   - Source: adapt from `Startix/startix-nextjs/src/components/homes/home-1/index.tsx`
   - Place adapted components in `src/features/landing/` or `src/components/landing/`

3. **Copy only required assets** to `public/startix/img/` and `public/startix/css/`.

4. **Install only required dependencies** in EduVanta's `package.json`: `bootstrap`, `sass`, `swiper`, `gsap`, `react-countup`, `react-intersection-observer`. Skip: `jarallax`, `marquee3000`, `react-responsive-masonry`, `react-responsive-modal`, `prop-types`.

5. **Replace EduVanta's `/[locale]/page.tsx`** with the adapted Startix landing. Keep all other routes (auth, dashboard) completely untouched.

6. **CTA links must use EduVanta i18n-aware routing:** Use `Link` from `@/i18n/navigation` for login/register CTAs.

7. **Preserve `/[locale]/login`** and all dashboard routes — the landing page is purely a marketing surface.

8. **For development/preview:** Add a temporary `src/app/[locale]/startix-preview/page.tsx` that renders the raw Startix home-1 component with its CSS, for visual verification before replacing the real landing page. Delete this route before production.

---

## 17. What Should Be Copied Later

### Source files (from `Startix/startix-nextjs/src/`):

```
components/homes/home-1/
  ├── index.tsx                    ← Adapt render order, remove Wrapper
  ├── HeroHomeOne.tsx              ← Adapt content, keep structure
  ├── BrandsHomeOne.tsx            ← Adapt, replace images
  ├── HowWeWorkHomeOne.tsx         ← Adapt content + images
  ├── AboutHomeOne.tsx             ← Adapt content + image
  ├── FeaturesHomeOne.tsx          ← Adapt content + images
  ├── PricingHomeOne.tsx           ← Adapt plan names/prices/features
  ├── TestimoniaHomeOne.tsx        ← Adapt quotes/names/avatars
  ├── IntegrationHomeOne.tsx       ← Replace with EdTech integrations
  ├── FaqHomeOne.tsx               ← Adapt questions/answers
  └── CtaHomeOne.tsx               ← Adapt text + button links

layouts/headers/HeaderOne.tsx      ← Adapt: replace logo, nav links, remove topbar or adapt
layouts/footers/FooterOne.tsx      ← Adapt: replace logo, all links, copyright
layouts/Wrapper.tsx                ← Adapt: keep AnimationProvider, remove if GSAP not used
common/AnimationProvider.tsx       ← Keep (GSAP animations)
common/ScrollToTop.tsx             ← Keep as-is
common/count.tsx                   ← Keep (react-countup wrapper)
data/menu-data.ts                  ← Replace entirely with EduVanta nav
hooks/UseSticky.ts                 ← Keep as-is
```

### Assets (from `Startix/startix-nextjs/public/assets/`):

```
css/bootstrap.min.css
css/tabler-icons.min.css
css/fonts/ (all font files for tabler-icons)
img/core-img/ (only the ~12 files listed in Section 13)
img/bg-img/ (only the ~8 files listed in Section 13)
img/partner-img/ (all 12 files)
scss/styles.scss (master SCSS — scope to .startix-root)
scss/_reboot.scss (scope selectors to .startix-root)
scss/_header.scss
scss/_hero.scss
scss/_about.scss
scss/_features.scss
scss/_pricing.scss
scss/_testimonial.scss
scss/_integration.scss (if exists, or relevant parts of _partner.scss)
scss/_faq.scss
scss/_cta.scss
scss/_footer.scss
scss/_miscellaneous.scss
scss/_theme.scss
scss/_rs.scss (breakpoint vars — required by all partials)
scss/_preloader.scss (optional — remove preloader if not wanted)
```

### src/styles/index.scss equivalent:
- Create `src/styles/startix-landing.scss` importing only the files above
- Import this ONLY in `src/app/[locale]/(landing)/layout.tsx`

---

## 18. What Should Not Be Copied

| Item | Reason |
|------|--------|
| `app/page.tsx` (HomePreview) | Template demo — irrelevant |
| `app/(homes)/home-2/` through `home-5/` | Not the chosen variant |
| `components/homes/home-2/` through `home-5/` | Not the chosen variant |
| `app/(outhers)/`, `(blog)/`, `(project)/`, `(service)/`, `(team)/` | Inner template pages — EduVanta has its own |
| `app/404/` | EduVanta has its own not-found |
| `app/[...not-found]/` | EduVanta has its own |
| `public/assets/img/demo-img/` | Template preview screenshots |
| `public/assets/img/bg-img/` (unused files) | Only copy ~8 specific files |
| `core-img/logo-two.png` through `logo-six.png` | Other theme logos |
| `public/assets/css/flaticon.css` + Flaticon fonts | Not needed in home-1 |
| `common/AnimationProvider.tsx` ScrollSmoother init | Consider replacing smooth scroll with CSS `scroll-behavior: smooth` to avoid GSAP Club requirement |
| `layouts/headers/HeaderTwo` through `HeaderFive` | Not needed |
| `layouts/footers/FooterTwo` through `FooterFive` | Not needed |
| `components/Aboutus/`, `Blog/`, `Contact/` etc. | EduVanta has its own pages |
| `data/projects-data.ts`, `service-data.ts` | Not used in home-1 |
| `modal/` | Video lightbox — not in home-1 |
| `svg/` (Iconsvg, SvgIconTwo) | SVG sprite defs for checkIcon etc — may be needed for feature lists, inspect |

**SVG sprites note:** `Iconsvg.tsx` and `SvgIconTwo.tsx` define SVG `<symbol>` elements (checkIcon, checkIcon2) that are referenced in `FeaturesHomeOne` and `AboutHomeOne` as `<use href="#checkIcon">`. These small SVG sprite files MUST be copied if those feature list check icons are used.

---

## 19. Content Replacement Map

| Section | Startix Generic Text | EduVanta Direction |
|---------|---------------------|-------------------|
| **Header topbar** | `info@example.com`, `629 Elgin St. Celina, 2202`, `(888).123.456.7894` | `support@eduvanta.com`, office city, support number — or remove topbar entirely |
| **Header nav** | Home / About Us / Pages / Blog / Contact | Features / Pricing / About / Log In / Get Started Free |
| **Hero headline** | "Commitment Igniting Future Pathways" | "Manage Every School, College & LMS in One Platform" |
| **Hero subheading** | "We transform businesses of most major sector powerful and adaptable digital solutions..." | "EduVanta gives administrators, teachers, parents and students a unified, multilingual platform — built for the modern campus." |
| **Hero trust metric** | "More than 10k+ trusted customers" | "Trusted by 500+ schools across 20 countries" (or actual metric) |
| **Hero image** | Generic SaaS dashboard mockup (`bg-img/29.png`) | EduVanta dashboard screenshot (export from `/en/dashboard`) |
| **Brands/Partners strip** | 5 generic company logos | Partner EdTech logos: Google for Education, Microsoft Education, Zoom, WhatsApp, etc. |
| **How It Works heading** | "Boost Productivity With Access" | "Up and Running in 4 Simple Steps" |
| **How It Works steps** | Generic SaaS services | 1. Create Account → 2. Set Up School → 3. Import Students & Staff → 4. Launch |
| **About heading** | "Robust, Easy-to-Use SaaS for Builders" | "Built for School Leaders, by Education Experts" |
| **About bullets** | "Integrate a diverse range of ideas / Deliver highest quality / Believe in power of implication" | "Multi-language support (EN/AR/UR) / Mobile-first design / Bank-grade security & data privacy" |
| **Features section 1 heading** | "Marketing Teams" | "Student & Academic Management" |
| **Features section 1 bullets** | "Social Media Design / Management / Ad strategy / Campaigns" | "Enroll students / Manage classes & sections / Track attendance / Issue certificates" |
| **Features section 2 heading** | "Project Management" | "Finance & Fees Management" |
| **Features section 2 bullets** | Generic project features | "Collect fees online / Manage expense heads / Generate income reports / Track transactions" |
| **Pricing section heading** | "Pricing that's Affordable For Everyone" | "Simple, Transparent Pricing for Every School" |
| **Pricing plan names** | Basic / Standard / Premium | Starter / Professional / Enterprise |
| **Pricing plan prices** | $00 / $49 / $99 per month | TBD — EduVanta commercial pricing |
| **Pricing features** | Generic SaaS features | Student limits, staff accounts, modules included, support tier |
| **Testimonials** | Generic startup names/roles | School principal/admin quotes with school names and cities |
| **Integrations heading** | "We Collaborate With Top Software Company" | "Works With the Tools Schools Already Use" |
| **Integration cards** | Instagram / X / Adobe XD / Figma / Slack / Facebook | Google Workspace / Microsoft 365 / Zoom / WhatsApp / Stripe / Moodle |
| **FAQ heading** | "Have Any Questions? Here Some Answers" | "Frequently Asked Questions" |
| **FAQ Q1** | "What warranties do I have for installation?" | "Is EduVanta available in Arabic and Urdu?" |
| **FAQ Q2** | "How long does it take to build a new website?" | "Can I manage multiple schools in one account?" |
| **FAQ Q3-5** | Generic | Data security, pricing, free trial details |
| **CTA headline** | "Sign Up for Your Free 14 Day Trial Now!" | "Start Your Free School Trial Today" |
| **CTA body** | "Join 13k+ teams who have streamlined..." | "Join hundreds of schools that replaced paper-based management with EduVanta." |
| **CTA buttons** | "Get Started Now / Request Free Demo" | "Start Free Trial / Book a Live Demo" |
| **Footer bio** | "Each demo built with Teba will look different..." | EduVanta tagline: "Smart School, College & LMS Management — Multilingual, RTL-ready, mobile-first." |
| **Footer column 1 links** | Pages: Home / About / Integrations / Pricing / Contact | Features: Students / Teachers / Finance / Library / Communication |
| **Footer column 2 links** | Utility Pages: Projects / Blog / Team etc. | Company: About / Blog / Careers / Press |
| **Footer column 3 links** | Information: Working Process / Privacy / Terms / FAQs | Support: Help Center / Documentation / Status / Contact |
| **Copyright** | "© 2024 Startix. All rights reserved." | "© 2026 EduVanta. All rights reserved." |
| **Page metadata title** | "Startix - Multipurpose SaaS Landing Next JS Template" | "EduVanta — Smart School, College & LMS Management" |
| **Page metadata description** | "Modern web template built with Next.js and TypeScript" | "EduVanta is a multilingual school management SaaS for administrators, teachers, students and parents." |

---

## 20. Build/Run Findings

### Startix

**Commands run:** None. The Startix template at `Startix/startix-nextjs/` does not have a `node_modules/` directory installed. Installing dependencies into it would violate the audit-only constraint.

**Why not run:**
1. The audit instruction explicitly states "Do NOT install Startix dependencies into EduVanta package.json during this audit."
2. Startix is a sibling folder to EduVanta's `src/` — installing in `Startix/startix-nextjs/` would create a second `node_modules` tree outside the pnpm workspace scope.
3. The pnpm workspace (`pnpm-workspace.yaml`) in EduVanta root may or may not include the Startix subfolder — not verified to avoid workspace conflicts.

**Findings from static inspection:**
- `package.json` scripts: `dev`, `build`, `start` — standard Next.js
- `next.config.ts`: `typedRoutes: true` (typed route strings — **not compatible with EduVanta which does not enable `typedRoutes`**), `sassOptions.includePaths`
- `tsconfig.json`: Standard Next.js config, `@` aliases to `./src`
- No custom Next.js middleware
- No `.env` or `.env.example` files detected

### EduVanta `pnpm dev` flag issue

The terminal notification shows:
```
next dev --no-turbopack
error: unknown option '--no-turbopack'
```

In **Next.js 16**, Turbopack is the default dev server. The `--no-turbopack` flag was removed. The correct workaround is to **not use `pnpm dev`** at all during this phase (use `pnpm start` after `pnpm build`). The EduVanta `package.json` `dev` script is simply `next dev` — do not add `--no-turbopack`. If Turbopack panics, use the production server (`pnpm build && pnpm start`).

---

## 21. Key Risks

| Priority | Risk | Impact | Mitigation |
|----------|------|--------|-----------|
| 🔴 P1 | Bootstrap 5 CSS globally breaks EduVanta dashboard | Catastrophic — entire dashboard UI destroyed | Import Bootstrap ONLY in landing route layout |
| 🔴 P1 | `_reboot.scss` `* {margin:0;padding:0}` breaks Tailwind | Catastrophic — all spacing lost globally | Scope to `.startix-root *` or remove |
| 🔴 P1 | GSAP ScrollSmoother requires GSAP Club license | Legal/commercial | Verify license; replace with CSS `scroll-behavior` if unlicensed |
| 🔴 P1 | GSAP `#smooth-wrapper` conflicts with EduVanta layout | Scroll breaks on dashboard | Only render in landing layout; never in app shell |
| 🟠 P2 | Bootstrap `.btn`, `.form-control`, `.nav-*` class names leak | Auth/form/nav styling broken | CSS layer or scoped import |
| 🟠 P2 | Swiper CSS `import` inside components may be global in Next.js | Swiper styles on non-landing pages | Use dynamic import with `ssr:false` pattern |
| 🟠 P2 | `ThemeProvider` sets `data-theme` on `<html>` — global | Affects EduVanta's own dark mode `data-theme` | Use different attribute name or remove ThemeProvider |
| 🟠 P2 | No i18n/locale routing in Startix | Landing does not respect `/en`, `/ar`, `/ur` | Wrap in EduVanta's locale routing system |
| 🟡 P3 | Hero dashboard screenshot is Startix generic | Misleading brand | Replace with actual EduVanta dashboard screenshot |
| 🟡 P3 | Partner logos are generic | Misleading | Replace with real or placeholder EdTech logos |
| 🟡 P3 | react-countup may cause hydration mismatch | SSR/client mismatch | Use `enableScrollSpy` or `dynamic(() => ..., {ssr: false})` |
| 🟡 P3 | Bootstrap accordion requires Bootstrap JS | FAQ non-interactive without it | Replace with React state accordion |
| 🟢 P4 | GSAP `SplitText` free since 3.12 | Licensing resolved | Confirm version |
| 🟢 P4 | Tabler Icons CSS may conflict with EduVanta Tabler usage | Minor — same icon set | EduVanta likely loads Tabler separately; check for duplicate |

---

## 22. Recommended Next Step

After reviewing this audit, the next step should be to create a **detailed conversion implementation plan** that covers:

1. Exact file-by-file copy list with source → destination mappings
2. EduVanta route structure changes (new `(landing)` route group)
3. CSS scoping approach (which SCSS selectors to prefix with `.startix-root`)
4. Component adaptation checklist per section (text, images, links)
5. Dependency installation commands for EduVanta
6. GSAP license decision (ScrollSmoother vs. CSS alternative)
7. Bootstrap JS removal plan (replace accordion with React component)
8. Test strategy (ensure Playwright e2e tests still pass after landing change)
9. A VS Code implementation prompt that can execute the full conversion safely

Do not begin implementation until this plan is reviewed and approved.

---

## 23. Files Inspected

| File | Purpose |
|------|---------|
| `Startix/startix-nextjs/package.json` | Dependencies and scripts |
| `Startix/startix-nextjs/next.config.ts` | Next.js config |
| `Startix/startix-nextjs/src/app/layout.tsx` | Root layout — SCSS import, ThemeProvider |
| `Startix/startix-nextjs/src/app/page.tsx` | Root route — HomePreview |
| `Startix/startix-nextjs/src/app/(homes)/home-1/page.tsx` | home-1 entry |
| `Startix/startix-nextjs/src/app/(homes)/home-2/page.tsx` | home-2 entry |
| `Startix/startix-nextjs/src/app/(homes)/home-3/page.tsx` | home-3 entry |
| `Startix/startix-nextjs/src/app/(homes)/home-4/page.tsx` | home-4 entry |
| `Startix/startix-nextjs/src/app/(homes)/home-5/page.tsx` | home-5 entry |
| `Startix/startix-nextjs/src/components/homes/home-1/index.tsx` | home-1 component tree |
| `Startix/startix-nextjs/src/components/homes/home-1/HeroHomeOne.tsx` | Hero section |
| `Startix/startix-nextjs/src/components/homes/home-1/BrandsHomeOne.tsx` | Partner carousel (Swiper) |
| `Startix/startix-nextjs/src/components/homes/home-1/HowWeWorkHomeOne.tsx` | How it works (Swiper) |
| `Startix/startix-nextjs/src/components/homes/home-1/AboutHomeOne.tsx` | About section |
| `Startix/startix-nextjs/src/components/homes/home-1/FeaturesHomeOne.tsx` | Features alternating blocks |
| `Startix/startix-nextjs/src/components/homes/home-1/PricingHomeOne.tsx` | Pricing cards with toggle |
| `Startix/startix-nextjs/src/components/homes/home-1/TestimoniaHomeOne.tsx` | Testimonials (Swiper) |
| `Startix/startix-nextjs/src/components/homes/home-1/IntegrationHomeOne.tsx` | Integrations grid |
| `Startix/startix-nextjs/src/components/homes/home-1/FaqHomeOne.tsx` | FAQ accordion |
| `Startix/startix-nextjs/src/components/homes/home-1/CtaHomeOne.tsx` | Call-to-action |
| `Startix/startix-nextjs/src/components/homes/home-4/index.tsx` | home-4 component tree |
| `Startix/startix-nextjs/src/components/homes/home-4/HeroHomFour.tsx` | home-4 Jarallax hero |
| `Startix/startix-nextjs/src/components/homes/home-4/FeaturesHomeFour.tsx` | home-4 feature cards |
| `Startix/startix-nextjs/src/components/homes/home-2/index.tsx` | home-2 structure |
| `Startix/startix-nextjs/src/components/homes/home-3/index.tsx` | home-3 structure |
| `Startix/startix-nextjs/src/components/homes/home-5/index.tsx` | home-5 structure |
| `Startix/startix-nextjs/src/layouts/headers/HeaderOne.tsx` | HeaderOne (with topbar) |
| `Startix/startix-nextjs/src/layouts/headers/HeaderFour.tsx` | HeaderFour (dark, minimal) |
| `Startix/startix-nextjs/src/layouts/footers/FooterOne.tsx` | FooterOne |
| `Startix/startix-nextjs/src/layouts/Wrapper.tsx` | AnimationProvider + ScrollToTop |
| `Startix/startix-nextjs/src/common/ThemeProvider.tsx` | data-theme setter |
| `Startix/startix-nextjs/src/common/AnimationProvider.tsx` | GSAP init + all animations |
| `Startix/startix-nextjs/src/common/ScrollToTop.tsx` | Scroll-to-top button |
| `Startix/startix-nextjs/src/common/count.tsx` | CountUp wrapper |
| `Startix/startix-nextjs/src/data/menu-data.ts` | Navigation data |
| `Startix/startix-nextjs/src/styles/index.scss` | SCSS entry point |
| `Startix/startix-nextjs/public/assets/scss/styles.scss` | Master stylesheet (TOC) |
| `Startix/startix-nextjs/public/assets/scss/_reboot.scss` | CSS reset + :root vars |
| `Startix/startix-nextjs/public/assets/scss/_header.scss` | Header styles |
| `Startix/startix-nextjs/public/assets/css/` | CSS files list |
| `Startix/startix-nextjs/public/assets/img/core-img/` | Core image listing |
| `Startix/startix-nextjs/public/assets/img/bg-img/` | Background image count (124 files) |
| `Startix/startix-nextjs/public/assets/img/partner-img/` | Partner images (12 files) |

---

## 24. Final Verdict

**Suitable with caution.**

Startix home-1 (SaaS Landing) is an excellent visual and structural match for EduVanta's landing page needs. The section structure, pricing toggle, integration grid, and CTA design all map cleanly to EduVanta's product positioning.

However, direct integration carries serious CSS collision risk and requires deliberate engineering effort to isolate Bootstrap 5 and Startix SCSS from EduVanta's Tailwind v4 + shadcn/ui dashboard. The GSAP ScrollSmoother licensing question must be resolved. The Bootstrap accordion must be replaced with a React state accordion.

With a careful, route-scoped integration plan (CSS isolated to the landing route, GSAP initialized only on landing, Bootstrap JS never loaded on dashboard routes), Startix home-1 can become EduVanta's polished marketing landing page without touching the dashboard, auth, i18n, RTL, or test infrastructure.

**Recommended primary variant: home-1 (SaaS Landing)**  
**Integration approach: Route-scoped CSS + parent class namespace + selective dependency install**  
**Next action: Produce detailed conversion implementation plan before writing any code**
