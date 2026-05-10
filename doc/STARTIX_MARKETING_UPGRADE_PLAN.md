# EduVanta Startix-Based Public Website Upgrade Plan

**Date:** 2026-05-10  
**Status:** Approved for execution — execute phase by phase  
**Source research:** Deep inspection of both codebases + audit report  
`doc/STARTIX_TEMPLATE_DEEP_AUDIT_FOR_EDUVANTA_LANDING.md`

---

## 1. Strategic Summary

EduVanta already has a working 13-section marketing landing page built entirely in custom Tailwind/shadcn components under `src/components/marketing/`. The goal of this upgrade is not building from scratch — it is a **visual and structural replacement**: swap the current Tailwind-only marketing surface with the premium Startix Home-1 SaaS Landing design, and simultaneously add five new inner marketing pages (`/about`, `/services`, `/pricing`, `/faq`, `/contact`, `/blog`) that don't exist yet.

The outcome: a polished, animated, visually rich public website (header → hero → brands → how-it-works → about → features → pricing → testimonials → integrations → FAQ → CTA → footer, plus inner pages) — all under the EduVanta brand, all locale-prefixed (`/en`, `/ar`, `/ur`), all RTL-compatible, all light/dark-mode compatible — while the existing EduVanta dashboard app, auth pages, i18n system, and tests remain 100% untouched.

The integration strategy is **route-scoped CSS isolation + parent class namespace**: Bootstrap 5 and Startix SCSS are imported only inside the new `(marketing)` route group layout, never in the root or locale-level layout. The dashboard continues to load only Tailwind/shadcn. CSS leakage from marketing → dashboard is practically zero because dashboard components use zero Bootstrap class names.

---

## 2. Current State Understanding

### EduVanta has

- **Root layout** (`src/app/layout.tsx`): Loads Geist, Geist Mono, Noto Sans Arabic fonts. Injects locale+dir synchronously via inline script (critical — no SSR flash). No global CSS other than `globals.css`.
- **`globals.css`**: Tailwind v4 with `@theme`, OKLch color space, full light/dark token set, RTL font override (`[dir="rtl"]` → Noto Sans Arabic). EduVanta primary: teal `oklch(0.628 0.116 178)` ≈ `#25A194`.
- **Locale layout** (`src/app/[locale]/layout.tsx`): Validates locale, wraps with `NextIntlClientProvider` + `AppProviders`. `AppProviders` includes `ThemeProvider` (next-themes, `attribute="class"`, adds `class="dark"` to `<html>`), `QueryProvider`, `TooltipProvider`, `Toaster`.
- **Current landing page** (`src/app/[locale]/page.tsx`): 13-section functional marketing page using 16 custom components in `src/components/marketing/`. **This is real content, not a stub.** The Startix upgrade replaces these components with Startix-adapted equivalents.
- **Auth group** (`src/app/[locale]/(auth)/`): 4 pages — login, register, forgot-password, reset-password. All fully tested. No visual dependency on the marketing site.
- **Dashboard group** (`src/app/[locale]/(dashboard)/`): 50+ pages in AppShell. Completely separate layout tree.
- **No inner marketing pages**: `/about`, `/services`, `/pricing`, `/faq`, `/contact`, `/blog` do not exist. The Startix integration creates them.
- **No `not-found.tsx`** file at locale level — falls back to Next.js framework 404.
- **E2E tests**: `landing.test.ts` looks for `data-testid="marketing-navbar"`, verifies `/en`/`/ar`/`/ur` load, checks hero visibility and CTA href to `/dashboard`, checks RTL direction attributes. `auth.test.ts` fully tests all 4 auth pages. `global-routes.test.ts` includes `/login`, `/register` etc. All tests must remain passable.

### Startix provides

- **Home-1 SaaS Landing** (10 sections): Hero, Brands (Swiper), HowWeWork (Swiper), About, Features, Pricing (React state toggle), Testimonials (Swiper), Integration, FAQ (Bootstrap accordion), CTA.
- **Inner pages**: Aboutus (AboutArea + AboutStory + Integration + CTA), Services (ServicesArea), Pricing (PricingHomeOne full page), FAQ (FaqArea), Contact (ContactArea with form), Blog (BlogArea with 3 posts + pagination).
- **Shared layouts**: HeaderOne (with topbar), FooterOne (4-column), Wrapper (AnimationProvider + ScrollToTop + SVG symbols).
- **SCSS system**: `styles.scss` → 28 SCSS partials. `_reboot.scss` sets `:root` CSS vars (`--Primary: #3147FF`, `--Font-Primary: Poppins`), and `* { margin:0; padding:0 }`. All custom SCSS — needs scoping.
- **Bootstrap 5**: Loaded via CSS file + optional JS. FAQ accordion and navbar collapse use Bootstrap JS.
- **GSAP**: ScrollTrigger (free), SplitText (free since GSAP 3.12), ScrollSmoother (GSAP Club — license issue).
- **SVG symbols**: `Iconsvg.tsx` defines `#checkIcon`, `#checkIcon2`, `#quoteIcon`. `SvgIconTwo.tsx` defines `#checkIcon3`. Used in Features and About sections as `<use href="#checkIcon">`.
- **ThemeProvider**: Sets `data-theme` on `<html>` — **conflicts with EduVanta's `class="dark"` approach**. Must not be used.
- **Count component**: `react-countup` + InView — reusable and safe.
- **Startix color**: `--Primary: #3147FF` (blue) — must be overridden to EduVanta teal.

---

## 3. Recommended Integration Architecture

```
Browser request → middleware (next-intl locale routing)
                       ↓
src/app/layout.tsx          ← Root: fonts, inline lang/dir script, NO CSS
       ↓
src/app/[locale]/layout.tsx ← Locale: NextIntlClientProvider, AppProviders (next-themes class mode, QueryClient)
       ↓                                      ↓                              ↓
(marketing)/layout.tsx           (dashboard)/layout.tsx           (auth)/layout.tsx
Bootstrap CSS                     (NO Bootstrap)                   (NO Bootstrap)
Startix SCSS                      Tailwind only                    Tailwind only
.startix-root wrapper             AppShell                         AuthLayoutShell
       ↓                                      ↓                              ↓
Marketing pages                  Dashboard pages                  Auth pages
(home, about, services…)         (50+ pages)                      (login, register…)
Startix components               shadcn/Tailwind                  shadcn/Tailwind
```

**The isolation guarantee**: Bootstrap CSS and Startix SCSS enter the render tree ONLY through `(marketing)/layout.tsx`. Next.js App Router's CSS bundling ensures these styles are only included in the CSS chunks for marketing routes. Dashboard and auth routes never render `(marketing)/layout.tsx`, so they never receive Bootstrap or Startix styles.

**The namespace guarantee**: All Startix custom SCSS selectors are compiled with `.startix-root` parent prefix (e.g., `.startix-root .hero-section`, `.startix-root .accordion`). Even if Bootstrap CSS somehow appears in a cached browser stylesheet during client-side navigation, no dashboard element has Bootstrap class names, so zero visual collision occurs.

**The theme guarantee**: `AppProviders` (in locale layout, parent of both marketing and dashboard) provides `ThemeProvider` with `attribute="class"`. When the user toggles dark mode, `class="dark"` is added to `<html>`. Marketing Startix components respond via `.dark .startix-root { ... }` overrides in a dedicated `startix-dark.scss`. Startix's own ThemeProvider is never instantiated in EduVanta.

---

## 4. Route Strategy

### New marketing routes (all locale-prefixed)

| URL | File | Source |
|-----|------|--------|
| `/[locale]` | `src/app/[locale]/(marketing)/page.tsx` | Home-1 (moved from current `[locale]/page.tsx`) |
| `/[locale]/about` | `src/app/[locale]/(marketing)/about/page.tsx` | Startix Aboutus |
| `/[locale]/services` | `src/app/[locale]/(marketing)/services/page.tsx` | Startix Services |
| `/[locale]/pricing` | `src/app/[locale]/(marketing)/pricing/page.tsx` | Startix Pricing |
| `/[locale]/faq` | `src/app/[locale]/(marketing)/faq/page.tsx` | Startix Faq |
| `/[locale]/contact` | `src/app/[locale]/(marketing)/contact/page.tsx` | Startix Contact |
| `/[locale]/blog` | `src/app/[locale]/(marketing)/blog/page.tsx` | Startix Blog |
| `/[locale]/blog/[slug]` | Not in this phase — deferred | — |

**Note on the landing page move**: `src/app/[locale]/page.tsx` (currently the landing page) is moved to `src/app/[locale]/(marketing)/page.tsx`. In Next.js App Router, `(marketing)` is a route group (parentheses = no URL segment), so the route still resolves to `/en`, `/ar`, `/ur`. The move is purely for layout inheritance — it is zero-URL-impact.

### Auth route strategy — Keep and deprioritize

After examining `e2e/auth.test.ts` (20+ tests for all 4 auth pages), `e2e/global-routes.test.ts` (includes `/login`, `/register` route checks), and `e2e/global-setup.ts` (warms up `/login`, `/register`, `/forgot-password`, `/reset-password`), the safest approach is:

1. **Keep all 4 auth pages intact.** Do not delete or redirect. They continue to exist at `/[locale]/login`, `/[locale]/register`, etc.
2. **Remove auth links from marketing public navigation.** Marketing header nav will only show: Features → `/[locale]/services`, Pricing → `/[locale]/pricing`, Blog → `/[locale]/blog`, Contact → `/[locale]/contact` — and CTAs "Log In" and "Get Started" both point to `/[locale]/dashboard`.
3. **All marketing CTAs route to `/[locale]/dashboard`**: "Get Started", "View Demo", "Start Free Trial", "Book a Demo" → `/[locale]/dashboard`.
4. **Auth pages remain discoverable** for tests and internal links. They're just not featured in the marketing site navigation.
5. **Update `e2e/landing.test.ts`** only to reflect the new `data-testid` values and updated CTA href (`/[locale]/dashboard`). The test already checks for a CTA linking to `/dashboard`.
6. **No test changes needed** for `e2e/auth.test.ts`, `e2e/global-routes.test.ts`, or `e2e/smoke.test.ts` — they test routes that still exist.

### 404 / Not Found

Create `src/app/[locale]/not-found.tsx` using Tailwind-only styling (not Startix CSS — because `not-found.tsx` renders outside the `(marketing)` layout tree and cannot inherit the route-scoped CSS import). The 404 is EduVanta-branded with two action buttons: "Go to Homepage" → `/[locale]` and "View Dashboard" → `/[locale]/dashboard`. Startix 404 design can be used as visual reference, adapted in Tailwind/shadcn components.

---

## 5. CSS and Styling Isolation Strategy

### Layer 1 — Route-scoped import

```
src/app/[locale]/(marketing)/layout.tsx
  └─ import "@/styles/startix-landing.scss"
  └─ import "@/styles/startix-dark.scss"
```

This file is the ONLY place Bootstrap and Startix SCSS enter EduVanta. It never appears in root layout, locale layout, dashboard layout, or auth layout.

### Layer 2 — `startix-landing.scss` composition

```scss
// src/styles/startix-landing.scss

// 1. Bootstrap CSS from node_modules (CSS only — no Bootstrap JS ever)
@import "bootstrap/dist/css/bootstrap.min.css";

// 2. All Startix SCSS partials, all scoped to .startix-root
.startix-root {
  // Override Startix CSS vars to EduVanta brand colors
  --Primary: #25A194;           // EduVanta teal (not Startix blue #3147FF)
  --Font-Primary: 'Geist', sans-serif;
  --Font-Secondary: 'Geist', sans-serif;

  // Breakpoints are variable-only — imported first so partials can use them
  @use './startix/rs' as rs;

  @import './startix/reboot';       // * { margin:0; padding:0 } — now scoped to .startix-root *
  @import './startix/miscellaneous';
  @import './startix/preloader';
  @import './startix/header';
  @import './startix/hero';
  @import './startix/about';
  @import './startix/features';
  @import './startix/pricing';
  @import './startix/testimonial';
  @import './startix/partner';
  @import './startix/process';
  @import './startix/faq';
  @import './startix/cta';
  @import './startix/footer';
  @import './startix/blog';
  @import './startix/contact';
  @import './startix/service';
  @import './startix/breadcrumb';
  // NOT imported: _jarallax, _project, _video, _demo, _newsletter, _cookie, _theme
}
```

### Layer 3 — `_reboot.scss` scoping adaptation

The Startix `_reboot.scss` contains two problematic selectors when wrapped inside a class:
- `* { margin:0; padding:0; }` → becomes `.startix-root * { }` — **correct, this is exactly what we want**
- `:root { --Primary: ...; }` → becomes `.startix-root :root { }` — **invalid CSS** (`:root` cannot be a descendant)
- `body { font-family: ...; }` → becomes `.startix-root body { }` — **invalid CSS** (body cannot be a descendant of a div)

**Solution**: When copying `_reboot.scss` to `src/styles/startix/_reboot.scss`, strip the `:root { }` and `body { }` blocks entirely. Place all CSS variable declarations directly in the `.startix-root { }` block in `startix-landing.scss`. Strip the `html` and `body` selectors. Keep only `* { }`, `::before { }`, `::after { }`, `img { }`, `a { }`, `ul, ol { }` — all of which scope correctly.

### Layer 4 — `startix-dark.scss`

```scss
// src/styles/startix-dark.scss
// Imported alongside startix-landing.scss in (marketing)/layout.tsx
.dark .startix-root {
  --Primary: #2dc5b8;           // Brighter EduVanta teal for dark backgrounds
  --Heading: #f5f5f5;
  --Text: #b0b8c1;
  --Secondary: #1a1d2e;
  --SecondaryTwo: rgba(45, 197, 184, 0.15);
  --Background: #0f1117;
  --Border: rgba(255, 255, 255, 0.12);
  background-color: #0f1117;
  color: #b0b8c1;
}
```

### Layer 5 — Tabler Icons delivery

Startix uses `<i className="ti ti-brand-*">` for social icons, integration icons, and feature icons. Rather than importing `tabler-icons.min.css` via SCSS (which would always be compiled together with Bootstrap), deliver it as a `<link>` tag in the marketing layout's `<head>`. Next.js supports `<link>` tags inside route layouts. This scopes Tabler Icons only to pages served under `(marketing)/layout.tsx`.

```tsx
// In (marketing)/layout.tsx head:
<link rel="stylesheet" href="/startix/css/tabler-icons.min.css" />
```

### Bootstrap JS — eliminated entirely

Bootstrap accordion in `FaqArea.tsx` and `FaqHomeOne.tsx` uses `data-bs-toggle="collapse"`. Replace with a `ReactAccordion` component using `useState`. Bootstrap navbar collapse in `HeaderOne.tsx` uses `data-bs-toggle="collapse"`. Replace with `useState` and CSS transitions. **No `bootstrap.js` or `bootstrap.bundle.js` is ever installed or imported.**

The `ReactAccordion` component must output the **exact same HTML class structure** as Bootstrap's accordion so that `_faq.scss` styles still apply:
- `.accordion-item`
- `.accordion-button` (with `aria-expanded` toggled)
- `.accordion-collapse` + `.show` class toggled via `useState`

This means the CSS works — only the JavaScript is replaced with React state.

---

## 6. Asset Strategy

### Directory structure

```
public/startix/
├── img/
│   ├── core-img/       ← ~14 selected files only (see list below)
│   ├── bg-img/         ← ~10 selected files only (see list below)
│   └── partner-img/    ← All 12 files (brands + integrations)
└── css/
    ├── tabler-icons.min.css
    └── fonts/          ← All Tabler icon font files (TTF/WOFF/WOFF2)
```

### Core images to copy (from `Startix/.../public/assets/img/core-img/`)

- `shape2.png`, `shape4.png`, `shape6.png` — pricing/about/hero background shapes
- `question-mark.png` — FAQ section decoration
- `cursor.png`, `curved-arrow.png` — hero decorative elements
- Favicon/logo slots → **do not copy Startix logos; create EduVanta variants**

**Logos to create/place:**
- `public/startix/img/core-img/eduvanta-logo.png` — EduVanta logo for light backgrounds
- `public/startix/img/core-img/eduvanta-logo-light.png` — EduVanta logo for dark backgrounds (header dark state, footer)

### Background images to copy (from `Startix/.../public/assets/img/bg-img/`)

- `bg-img/28.jpg` — About section background photo
- `bg-img/29.png` — **Hero dashboard screenshot → replace with EduVanta dashboard screenshot**
- `bg-img/30.png`, `bg-img/31.png` — Hero trust metric avatar group
- `bg-img/32.png`, `bg-img/33.png` — Features section alternating images
- `bg-img/35.jpg` — How It Works sidebar image
- Testimonial avatar images (exact numbers to be confirmed during Phase 2 by inspecting `TestimoniaHomeOne.tsx`)

### Partner images

Copy all 12 files from `Startix/.../public/assets/img/partner-img/` → `public/startix/img/partner-img/`. They will be used for the brands strip and integrations grid until replaced with EdTech logos in Phase 6.

### What NOT to copy

| Item | Reason |
|------|--------|
| `demo-img/` (entire folder) | Template preview screenshots only — irrelevant |
| ~100+ unused `bg-img/` files | Only copy the ~10 listed above |
| `core-img/logo.png` through `logo-six.png` | Startix branding — replaced by EduVanta logos |
| `flaticon.css` + Flaticon fonts | Flaticon icons not used in home-1 sections |
| `bootstrap.min.css` | Install Bootstrap via npm; import from `node_modules` in SCSS |

### EduVanta-specific assets to create

- **Dashboard screenshot** (Phase 2): Export viewport screenshot from `/en/dashboard` at 1200px width → save as `public/startix/img/bg-img/eduvanta-dashboard.png`. Used in HeroSection as the hero image.
- **Integration logos** (Phase 6): SVG/PNG logos for Google Workspace, Microsoft 365, Zoom, WhatsApp Business, Stripe, Moodle, PayPal — sourced from official brand asset packs (all free for "works with" use cases).
- **Testimonial avatars** (Phase 5): Placeholder avatar images in EduVanta teal color scheme. Can use Startix's `bg-img/30.png`, `31.png` initially.

---

## 7. Dependency Strategy

### Add to EduVanta `package.json`

| Package | Version | Reason | Risk |
|---------|---------|--------|------|
| `bootstrap` | `^5.3.8` | CSS-only — grid, nav, card layout for marketing pages | Low — CSS only, zero Bootstrap JS |
| `sass` | `^1.93.2` | SCSS compilation for adapted Startix partials | None — build-time only |
| `swiper` | `^12.0.2` | Brand carousel, how-it-works, testimonials sliders | Low — SSR-safe with `"use client"` |
| `gsap` | `^3.13.0` | ScrollTrigger + SplitText scroll animations | Medium — client-only, always inside `useEffect` |
| `react-countup` | `^6.5.3` | Hero trust metric animated number | Low — use `enableScrollSpy scrollSpyOnce` |
| `react-intersection-observer` | `^9.16.0` | Viewport trigger for countup | Low — wrapper hook |

**Note**: EduVanta already has `framer-motion ^12.38.0`. For any custom EduVanta-specific transitions beyond the Startix animation library (e.g., page entry fade), framer-motion is preferred. Use GSAP specifically for Startix's scroll-triggered character-split text animations which are tied to the template's visual identity.

### Do NOT add

| Package | Reason |
|---------|--------|
| `jarallax` | Home-4 only — not in home-1 |
| `marquee3000` | Home-4 only — not in home-1 |
| `react-responsive-masonry` | Home-4 only — not in home-1 |
| `react-responsive-modal` | Home-4 video lightbox — not in home-1 |
| `prop-types` | TypeScript project — runtime prop validation not needed |
| Bootstrap JS (`bootstrap/dist/js/bootstrap`) | Replaced entirely by React state components |

### GSAP licensing

- **ScrollTrigger**: Free in all GSAP versions. Use freely.
- **SplitText**: Made free in GSAP 3.12. Since Startix uses `gsap@^3.13.0`, it is free. Use it.
- **ScrollSmoother**: Requires GSAP Club membership. **Do not use ScrollSmoother.** Replace with CSS `scroll-behavior: smooth` on `.startix-root`. The `#smooth-wrapper` and `#smooth-content` DOM structure from Startix's `Wrapper.tsx` is eliminated entirely. The adapted `MarketingWrapper.tsx` renders children directly without any smooth-scroll wrapper div.

---

## 8. Light/Dark Mode Strategy

EduVanta's `ThemeProvider` (next-themes, `attribute="class"`) adds or removes `class="dark"` on `<html>`. This is the single source of truth for theme state across the entire app.

**Startix's `ThemeProvider.tsx` must NOT be used.** It sets `data-theme` on `<html>` and is path-based (home-2 → "two", etc.). This conflicts with both EduVanta's theme system and the route structure.

### Implementation

1. In `src/styles/startix-dark.scss`, define `.dark .startix-root { ... }` overrides for all key CSS variables (see Layer 4 above).
2. The `.dark` class on `<html>` is set by next-themes. `.startix-root` is the wrapper div in `(marketing)/layout.tsx`. The selector `.dark .startix-root` matches whenever dark mode is active on a marketing page.
3. EduVanta's existing theme toggle button (in `AppTopbar` for dashboard pages) is unaffected. For marketing pages, `MarketingHeader` will include its own theme toggle button that calls next-themes' `setTheme`. This can reuse EduVanta's existing `ThemeToggle` component since it's just a button that calls the hook — no visual change needed.
4. Startix's `_theme.scss` (5 variant themes via `data-theme`) — **do not copy**. EduVanta only needs two states: light (default) and dark (`.dark` class). The 5 Startix color themes are irrelevant.

### Dark mode CSS variable mapping

| Startix light | EduVanta dark override |
|--------------|----------------------|
| `--Primary: #25A194` (already overridden to teal) | `--Primary: #2dc5b8` (brighter teal) |
| `--Heading: #161616` | `--Heading: #f5f5f5` |
| `--Text: #49515B` | `--Text: #b0b8c1` |
| `--Secondary: #F7F8FF` | `--Secondary: #1a1d2e` |
| `--Background: #161616` (inverted in template — dark bg for some sections) | `--Background: #0f1117` |
| `--Border: rgba(73,81,91,0.3)` | `--Border: rgba(255,255,255,0.12)` |

---

## 9. EN / AR / UR and RTL Strategy

### Locale routing — unchanged

Marketing pages are inside `src/app/[locale]/(marketing)/` — they inherit the locale param from `[locale]`. `useTranslations()` from next-intl works identically here. `Link` from `@/i18n/navigation` auto-prepends locale. No changes to `middleware.ts`, `routing.ts`, or `request.ts`.

### RTL implementation — phased

**Phases 1–8 (foundation and content)**: Bootstrap 5 logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-0`, `end-0`) are RTL-compatible natively. The Bootstrap grid and navbar automatically flip in RTL. The `dir="rtl"` attribute on `<html>` (set by EduVanta's inline script in `src/app/layout.tsx`) triggers CSS logical properties automatically for Bootstrap.

**Phase 9 (RTL polish)**: Audit all Startix custom SCSS for physical `left:` and `right:` values. Create `src/styles/startix-rtl.scss` with overrides:

```scss
[dir="rtl"] .startix-root {
  // Fix any absolute-positioned decorative elements
  .hero-section .hero-img { left: auto; right: -100px; }
  // Fix text-align where physical values were used
  .header-section .header-top { text-align: right; }
  // Additional fixes discovered during Phase 9 audit
}
```

Import in `(marketing)/layout.tsx` alongside the other SCSS files.

**Swiper RTL**: Add `dir="rtl"` attribute to Swiper components when locale is `ar` or `ur`. Detect via `const locale = useLocale()` from next-intl in the Swiper wrapper client component.

**Font for RTL**: EduVanta's `globals.css` already applies `font-family: var(--font-noto-arabic)` when `[dir="rtl"]` is set. This override is inherited by `.startix-root *` through the CSS cascade. The Startix `--Font-Primary: Poppins` variable (overridden to Geist) is further overridden by the more specific `[dir="rtl"]` selector from `globals.css`.

### i18n text

All hardcoded English strings in Startix-adapted components are extracted to a `landing.*` namespace in `src/messages/en.json`, `ar.json`, `ur.json` in Phase 8. Phases 1–7 can use hardcoded English strings in components, with `useTranslations` hooks already in place and returning the English string directly. This allows phases to be executed and visually verified before full translation work.

---

## 10. Content Replacement Strategy

### Navigation (MarketingHeader — adapted from HeaderOne)

| Startix element | EduVanta replacement |
|----------------|---------------------|
| Topbar (email / address / phone) | **Remove topbar entirely** — replace with locale switcher + dark mode toggle in a minimal sub-bar OR remove entirely for cleaner look |
| Home dropdown (5 variants) | Remove — single root `/[locale]` |
| About Us | About → `/[locale]/about` |
| Pages mega-dropdown | Features → `/[locale]/services`, Pricing → `/[locale]/pricing` |
| Blog | Blog → `/[locale]/blog` |
| Contact | Contact → `/[locale]/contact` |
| Search button | Remove |
| "Get Started" CTA | "View Demo" → `/[locale]/dashboard` |
| Login link (not in HeaderOne by default) | Add "Log In" → `/[locale]/dashboard` |

The marketing header **must** carry `data-testid="marketing-navbar"` to preserve the `e2e/landing.test.ts` assertion. It must contain the text "EduVanta" in the logo/brand area.

### Hero (HeroHomeOne → HeroSection)

| Element | Startix | EduVanta |
|---------|---------|---------|
| Pre-headline badge | "Best Platform for Teams" | "School · College · LMS Management" |
| Main headline | "Commitment Igniting Future Pathways" | "Run Your School From One Connected Platform" |
| Body copy | Generic SaaS copy | "EduVanta gives administrators, teachers, students and parents one unified workspace — multilingual, mobile-ready, and built for modern institutions." |
| Trust metric number (CountUp) | 10,000+ | 500+ |
| Trust metric label | "trusted customers" | "institutions worldwide" |
| Trust avatar images | Generic avatars | Keep `bg-img/30.png`, `31.png` initially |
| Hero image | Generic SaaS dashboard | EduVanta dashboard screenshot (`/startix/img/bg-img/eduvanta-dashboard.png`) |
| Primary CTA | "Get Started" | "View Demo Dashboard" → `/[locale]/dashboard` |
| Secondary CTA | "How it Works ▶" | "Explore Platform" |

### Brands / Trust Strip (BrandsHomeOne → BrandsSection)

| Element | Startix | EduVanta |
|---------|---------|---------|
| Section context | Logo strip (no heading) | Add: "Trusted by schools across 20+ countries" as a heading above the strip |
| Logos | 5 generic company logos | EdTech/institution logos: Google for Education, Microsoft Education, Zoom, WhatsApp Business, Stripe — using `partner-img/` slot |

### How It Works (HowWeWorkHomeOne → HowItWorksSection)

| Element | Startix | EduVanta |
|---------|---------|---------|
| Section heading | "Boost Productivity With Access" | "Up and Running in 4 Simple Steps" |
| Card 1 | Generic service | "Create Your School" — add institution name, type, admin email |
| Card 2 | Generic service | "Import Students & Staff" — bulk CSV upload or manual entry |
| Card 3 | Generic service | "Configure Your Modules" — fees, library, attendance, calendar |
| Card 4 | Generic service | "Go Live Today" — share access with teachers, students, and parents |
| Sidebar image | `bg-img/35.jpg` | EduVanta setup screenshot or keep Startix image |

### About (AboutHomeOne → AboutSection)

| Element | Startix | EduVanta |
|---------|---------|---------|
| Heading | "Robust, Easy-to-Use SaaS for Builders" | "Built for School Leaders, by Education Experts" |
| Body copy | Generic SaaS body | EduVanta story: multilingual SaaS built for institutions across the Middle East, South Asia, and beyond |
| Bullet 1 | Generic | "Available in English, Arabic & Urdu — with full RTL layout support" |
| Bullet 2 | Generic | "Mobile-first design that works on any device, anywhere" |
| Bullet 3 | Generic | "Bank-grade data security and role-based access control" |
| Image | `bg-img/28.jpg` | Keep or replace with EduVanta product photo |
| CTA | "Learn More" | "Explore Our Platform" → `/[locale]/services` |

### Features (FeaturesHomeOne → FeaturesSection — 3 alternating blocks)

| Block | Startix Heading | EduVanta Heading | EduVanta Bullets |
|-------|----------------|-----------------|-----------------|
| 1 | "Marketing Teams" | "Student & Academic Management" | Enroll students / Manage classes & sections / Track daily attendance / Record exam results / Issue certificates |
| 2 | "Project Management" | "Finance, Fees & HRM" | Collect fees online / Manage expense heads / Process payroll / Track all transactions / Generate finance reports |
| 3 | "Strategic Planning" | "Communication & Library" | Send school notices & events / Manage book inventory / Issue & return books / Multi-channel parent messaging |

### Pricing (PricingHomeOne → PricingSection — React state monthly/yearly toggle)

| Element | Startix | EduVanta |
|---------|---------|---------|
| Section heading | "Pricing that's Affordable For Everyone" | "Simple, Transparent Pricing for Every Institution" |
| Toggle | Monthly / Yearly | Monthly / Yearly |
| Plan 1 | Basic $0/mo | **Starter** — Free demo / limited modules |
| Plan 2 | Standard $49/mo | **Professional** — [price TBD] |
| Plan 3 | Premium $99/mo | **Enterprise** — Contact sales |
| Feature lines | Generic SaaS features | Student limits, staff accounts, modules included, support tier, language options, RTL support indicator |
| Plan CTA buttons | "Get Started" | "View Demo" → `/[locale]/dashboard` |

### Testimonials (TestimoniaHomeOne → TestimonialsSection — Swiper)

Replace with 4–5 placeholder school administrator testimonials with realistic-sounding fictional institutions:

- "EduVanta transformed how we manage our 1,200 students. The fee collection alone saves us 10 hours a week." — *Principal, Al-Noor International School*
- "The Arabic RTL support is flawless. Our staff adapted within a day." — *Admin Manager, Gulf Education Group*
- "We run three campuses from one dashboard. The attendance and exam modules are exceptional." — *Director, Crescent College System*
- "Finally, a school management system that works as well in Urdu as it does in English." — *Head of Operations, Lahore Academy*

### Integrations (IntegrationHomeOne → IntegrationsSection)

| Startix | EduVanta |
|---------|---------|
| Instagram | Google Workspace |
| X (Twitter) | Microsoft 365 |
| Adobe XD | Zoom |
| Figma | WhatsApp Business |
| Slack | Stripe |
| Facebook | Moodle |
| Google Drive | PayPal |

Replace `partner-img/` logos with actual EdTech tool logos or placeholder-branded SVGs.

### FAQ (FaqHomeOne → FaqSection — ReactAccordion, not Bootstrap)

Replace Bootstrap accordion with React `useState` accordion. Questions:

1. Is EduVanta available in Arabic and Urdu?
2. Can I manage multiple schools or campuses from one account?
3. How is student data kept private and secure?
4. What modules are included in the free demo?
5. Can I see a live demo without creating an account?
6. Does EduVanta support RTL layouts for Arabic and Urdu users?

### CTA (CtaHomeOne → CtaSection)

| Element | Startix | EduVanta |
|---------|---------|---------|
| Background | Dark / brand-colored | Dark teal / EduVanta primary |
| Headline | "Sign Up for Your Free 14 Day Trial Now!" | "See EduVanta in Action — No Sign Up Required" |
| Body copy | "Join 13k+ teams who have streamlined..." | "Explore the full platform demo with realistic school, college, and LMS data. Switch between dashboard views and modules instantly." |
| Button 1 | "Get Started Now" | "View Demo Dashboard" → `/[locale]/dashboard` |
| Button 2 | "Request Free Demo" | "Contact Us" → `/[locale]/contact` |

### Footer (FooterOne → MarketingFooter)

| Column | Startix | EduVanta |
|--------|---------|---------|
| Logo + bio | Startix logo + generic bio | EduVanta logo + "Smart School, College & LMS Management — Multilingual, RTL-ready, mobile-first." |
| Social icons | Generic social links | EduVanta social links (GitHub, LinkedIn, Twitter/X, YouTube) |
| Column 2 heading | "Pages" | "Platform" |
| Column 2 links | Home, About, Integrations, Pricing, Contact | Students, Teachers, Finance, Library, Communication |
| Column 3 heading | "Utility Pages" | "Company" |
| Column 3 links | Projects, Blog, Team, etc. | About, Blog, Pricing, Contact |
| Column 4 heading | "Information" | "Support" |
| Column 4 links | Process, Privacy, Terms, FAQs | FAQ, Help Center, Privacy Policy, Terms of Use |
| Copyright | "© 2024 Startix. All rights reserved." | "© 2026 EduVanta. All rights reserved." |

### About Page (`/[locale]/about`)

Adapt Startix's `AboutArea` + `AboutStory`. Remove `AboutTeam` (not relevant for a SaaS product). `AboutStory` CountUp stats: Years Founded (2), Institutions Served (500+), Modules Available (12+), Languages Supported (3). Embed `IntegrationsSection` as a "works with" grid. End with `CtaSection`.

### Services Page (`/[locale]/services`)

Adapt Startix's `ServicesArea` with 12 EduVanta modules replacing generic IT services. Each module card: Tabler icon + module name + 2-line description:

1. Student Management — Enrollment, profiles, categories, attendance tracking
2. Teacher Management — Staff records, timetables, leave management
3. Guardian Portal — Parent access, student progress, communication
4. Attendance — Daily student and teacher attendance with reports
5. Academic Setup — Classes, classrooms, sections, subjects
6. Exams & Results — Schedules, grading, result publication
7. Fees Management — Collection, groups, types, discounts
8. Finance — Income, expenses, transactions, reporting
9. HRM & Payroll — Employee management, payroll processing, departments
10. Library — Book inventory, issue/return, member management
11. Communication — Notices, events, messages, alerts
12. Certificates — Generation, customization, download

### Pricing Page (`/[locale]/pricing`)

Use `PricingSection` (from home-1) in full-page context. Add `FaqSection` below pricing cards (pricing-specific FAQ). Add a testimonial quote above the CTA. End with `CtaSection`.

### FAQ Page (`/[locale]/faq`)

Adapt `FaqArea` with 12+ EduVanta-specific questions. Two-column layout: Left column heading + CTA button → `/[locale]/contact`, Right column `ReactAccordion` with 12 Q&A pairs. No Google Maps. No Bootstrap accordion.

### Contact Page (`/[locale]/contact`)

Adapt `ContactArea`. **Remove the Google Maps iframe** (privacy risk; replace with a decorative illustration or EduVanta campus-style image). Left panel: EduVanta contact info + social links. Right panel: inquiry form (Name, Email, Institution Name, Subject, Message). Form uses React Hook Form + Zod for client-side validation. On submit: no network request — display a success toast via EduVanta's existing `sonner` Toaster with message: "Thanks! This is a demo form. For real inquiries, email support@eduvanta.com." Add a visible notice: "This is a demo contact form — submissions are not sent."

### Blog Page (`/[locale]/blog`)

Adapt `BlogArea` with 3 EduVanta education SaaS blog post cards:

1. "AI in Education: How Smart Tools Are Transforming School Management" — Category: Technology — Date: May 2026
2. "Why RTL-Ready SaaS Matters for Arabic and Urdu-Speaking Institutions" — Category: Localization — Date: April 2026
3. "A Complete Guide to Digital Fee Management for Schools and Colleges" — Category: Finance — Date: March 2026

"Read More" links on cards point to `/[locale]/blog` (same page) with a notice: "Full articles coming soon." `/blog/[slug]` is deferred to a future phase.

### 404 Page (`src/app/[locale]/not-found.tsx`)

Tailwind-only styled 404 (cannot use Startix CSS here — outside `(marketing)` layout tree). EduVanta branding. Heading: "Page Not Found". Subtext: "The page you're looking for doesn't exist." Two buttons: "Go to Homepage" → `/[locale]` (using Link from `@/i18n/navigation`) and "View Dashboard" → `/[locale]/dashboard`.

---

## 11. Component Mapping

| Startix Source | EduVanta Target | Location | Notes |
|---------------|----------------|----------|-------|
| `components/homes/home-1/index.tsx` | `components/landing/home/index.tsx` | Adapted | EduVanta content, locale-aware Links |
| `components/homes/home-1/HeroHomeOne.tsx` | `components/landing/home/HeroSection.tsx` | Adapted | Replace image, text, CTAs |
| `components/homes/home-1/BrandsHomeOne.tsx` | `components/landing/home/BrandsSection.tsx` | Adapted | Replace logos, add heading |
| `components/homes/home-1/HowWeWorkHomeOne.tsx` | `components/landing/home/HowItWorksSection.tsx` | Adapted | 4 EduVanta onboarding steps |
| `components/homes/home-1/AboutHomeOne.tsx` | `components/landing/home/AboutSection.tsx` | Adapted | EduVanta content + image |
| `components/homes/home-1/FeaturesHomeOne.tsx` | `components/landing/home/FeaturesSection.tsx` | Adapted | 3 EduVanta feature blocks |
| `components/homes/home-1/PricingHomeOne.tsx` | `components/landing/home/PricingSection.tsx` | Adapted | EduVanta plan names/prices/features |
| `components/homes/home-1/TestimoniaHomeOne.tsx` | `components/landing/home/TestimonialsSection.tsx` | Adapted | EduVanta school admin testimonials |
| `components/homes/home-1/IntegrationHomeOne.tsx` | `components/landing/home/IntegrationsSection.tsx` | Adapted | EdTech integrations grid |
| `components/homes/home-1/FaqHomeOne.tsx` | `components/landing/home/FaqSection.tsx` | Adapted | ReactAccordion + EduVanta Q&A |
| `components/homes/home-1/CtaHomeOne.tsx` | `components/landing/home/CtaSection.tsx` | Adapted | EduVanta text + dashboard links |
| `layouts/headers/HeaderOne.tsx` | `components/landing/shared/MarketingHeader.tsx` | Adapted | No topbar; EduVanta nav; React useState mobile menu; `data-testid="marketing-navbar"` |
| `layouts/footers/FooterOne.tsx` | `components/landing/shared/MarketingFooter.tsx` | Adapted | EduVanta 4 columns, copyright |
| `layouts/Wrapper.tsx` | `components/landing/shared/MarketingWrapper.tsx` | Adapted | No ScrollSmoother; AnimationProvider + ScrollToTop + SVG symbols |
| `common/AnimationProvider.tsx` | `components/landing/shared/AnimationProvider.tsx` | Adapted | Remove ScrollSmoother; keep ScrollTrigger + SplitText only |
| `common/ScrollToTop.tsx` | `components/landing/shared/ScrollToTop.tsx` | Direct copy | As-is |
| `common/count.tsx` | `components/landing/shared/CountUp.tsx` | Adapted | Add `enableScrollSpy scrollSpyOnce` for SSR safety |
| `common/ThemeProvider.tsx` | **Not copied** | — | EduVanta uses next-themes; Startix ThemeProvider eliminated entirely |
| `common/Breadcrumb.tsx` | `components/landing/shared/Breadcrumb.tsx` | Adapted | EduVanta routes; `Link` from `@/i18n/navigation` |
| (new) | `components/landing/shared/ReactAccordion.tsx` | NEW | Pure React useState accordion with Bootstrap-compatible HTML class structure |
| `svg/Iconsvg.tsx` | `components/landing/svg/Iconsvg.tsx` | Direct copy | `#checkIcon`, `#checkIcon2`, `#quoteIcon` SVG symbols |
| `svg/SvgIconTwo.tsx` | `components/landing/svg/SvgIconTwo.tsx` | Direct copy | `#checkIcon3` SVG symbol |
| `hooks/UseSticky.ts` | `components/landing/shared/useSticky.ts` | Direct copy | Sticky header scroll detection hook |
| `data/menu-data.ts` | Not copied — replaced | — | EduVanta nav defined inline in MarketingHeader |
| `data/service-data.ts` | `data/mock/marketing-services.ts` | Replaced | 12 EduVanta modules for ServicesArea |
| `data/testimonial-data.ts` | `data/mock/marketing-testimonials.ts` | Replaced | EduVanta school admin testimonials |
| (new) | `data/mock/marketing-blog-posts.ts` | NEW | 3 EduVanta blog post objects |
| (new) | `data/mock/marketing-modules.ts` | NEW | 12 EduVanta modules for ServicesArea |
| `components/Aboutus/AboutArea.tsx` | `components/landing/about/AboutArea.tsx` | Adapted | EduVanta product story |
| `components/Aboutus/AboutStory.tsx` | `components/landing/about/AboutStory.tsx` | Adapted | CountUp stats: years, institutions, modules, languages |
| `components/Aboutus/AboutTeam.tsx` | **Not copied** | — | Not relevant for a SaaS product page |
| `components/Aboutus/index.tsx` | `components/landing/about/index.tsx` | Adapted | AboutArea + AboutStory + IntegrationsSection + CtaSection |
| `components/Services/ServicesArea.tsx` | `components/landing/services/ServicesArea.tsx` | Adapted | 12 EduVanta module cards with Tabler icons |
| `components/Services/index.tsx` | `components/landing/services/index.tsx` | Adapted | Breadcrumb + ServicesArea + CtaSection |
| `components/Blog/BlogArea.tsx` | `components/landing/blog/BlogArea.tsx` | Adapted | 3 EduVanta blog post cards |
| `components/Blog/index.tsx` | `components/landing/blog/index.tsx` | Adapted | Breadcrumb + BlogArea + CtaSection |
| `components/Faq/FaqArea.tsx` | `components/landing/faq/FaqArea.tsx` | Adapted | ReactAccordion + 12 EduVanta Q&A |
| `components/Faq/index.tsx` | `components/landing/faq/index.tsx` | Adapted | Breadcrumb + FaqArea + CtaSection |
| `components/Contact/ContactArea.tsx` | `components/landing/contact/ContactArea.tsx` | Adapted | No Maps; React Hook Form + Zod; demo notice |
| `components/Contact/index.tsx` | `components/landing/contact/index.tsx` | Adapted | Breadcrumb + ContactArea |
| `components/Pricing/` (uses PricingHomeOne) | `components/landing/pricing/PricingPage.tsx` | Adapted | Breadcrumb + PricingSection + FaqSection + CtaSection |
| `app/404/page.tsx` (Startix) | `src/app/[locale]/not-found.tsx` | NEW (Tailwind) | EduVanta branded; Tailwind only (outside marketing layout) |

---

## 12. File/Folder Plan

```
EduVanta/
├── src/
│   ├── app/
│   │   ├── layout.tsx                       ← UNCHANGED
│   │   ├── globals.css                      ← UNCHANGED
│   │   ├── page.tsx                         ← UNCHANGED (root → /en redirect)
│   │   └── [locale]/
│   │       ├── layout.tsx                   ← UNCHANGED (NextIntlClientProvider + AppProviders)
│   │       ├── page.tsx                     ← DELETED after (marketing)/page.tsx verified
│   │       ├── not-found.tsx                ← NEW (Tailwind-only, EduVanta branded)
│   │       ├── (auth)/                      ← UNCHANGED — all 4 auth pages kept
│   │       │   ├── layout.tsx
│   │       │   ├── login/page.tsx
│   │       │   ├── register/page.tsx
│   │       │   ├── forgot-password/page.tsx
│   │       │   └── reset-password/page.tsx
│   │       ├── (dashboard)/                 ← UNCHANGED — all 50+ dashboard pages
│   │       └── (marketing)/                 ← NEW route group
│   │           ├── layout.tsx               ← NEW: imports Startix CSS; .startix-root wrapper; Tabler Icons <link>
│   │           ├── page.tsx                 ← MOVED then REPLACED with Startix home-1
│   │           ├── about/
│   │           │   └── page.tsx             ← NEW
│   │           ├── services/
│   │           │   └── page.tsx             ← NEW
│   │           ├── pricing/
│   │           │   └── page.tsx             ← NEW
│   │           ├── faq/
│   │           │   └── page.tsx             ← NEW
│   │           ├── contact/
│   │           │   └── page.tsx             ← NEW
│   │           └── blog/
│   │               └── page.tsx             ← NEW
│   ├── components/
│   │   ├── marketing/                       ← EXISTING (16 files) — kept until Phase 12 QA complete, then deleted
│   │   └── landing/                         ← NEW — all Startix-adapted marketing components
│   │       ├── home/
│   │       │   ├── index.tsx
│   │       │   ├── HeroSection.tsx
│   │       │   ├── BrandsSection.tsx
│   │       │   ├── HowItWorksSection.tsx
│   │       │   ├── AboutSection.tsx
│   │       │   ├── FeaturesSection.tsx
│   │       │   ├── PricingSection.tsx
│   │       │   ├── TestimonialsSection.tsx
│   │       │   ├── IntegrationsSection.tsx
│   │       │   ├── FaqSection.tsx
│   │       │   └── CtaSection.tsx
│   │       ├── about/
│   │       │   ├── index.tsx
│   │       │   ├── AboutArea.tsx
│   │       │   └── AboutStory.tsx
│   │       ├── services/
│   │       │   ├── index.tsx
│   │       │   └── ServicesArea.tsx
│   │       ├── blog/
│   │       │   ├── index.tsx
│   │       │   └── BlogArea.tsx
│   │       ├── faq/
│   │       │   ├── index.tsx
│   │       │   └── FaqArea.tsx
│   │       ├── contact/
│   │       │   ├── index.tsx
│   │       │   └── ContactArea.tsx
│   │       ├── pricing/
│   │       │   └── PricingPage.tsx
│   │       ├── shared/
│   │       │   ├── MarketingHeader.tsx      ← Adapted HeaderOne; React state mobile; data-testid="marketing-navbar"
│   │       │   ├── MarketingFooter.tsx      ← Adapted FooterOne; EduVanta 4 columns
│   │       │   ├── MarketingWrapper.tsx     ← No ScrollSmoother; SVG symbols + AnimationProvider + ScrollToTop
│   │       │   ├── AnimationProvider.tsx    ← Adapted; ScrollTrigger + SplitText only; no ScrollSmoother
│   │       │   ├── ScrollToTop.tsx          ← Direct copy
│   │       │   ├── CountUp.tsx              ← Adapted; enableScrollSpy scrollSpyOnce
│   │       │   ├── Breadcrumb.tsx           ← Adapted; Link from @/i18n/navigation
│   │       │   ├── ReactAccordion.tsx       ← NEW: useState accordion, Bootstrap-compatible HTML structure
│   │       │   └── useSticky.ts             ← Direct copy from Startix
│   │       └── svg/
│   │           ├── Iconsvg.tsx              ← Direct copy (#checkIcon, #checkIcon2, #quoteIcon)
│   │           └── SvgIconTwo.tsx           ← Direct copy (#checkIcon3)
│   ├── data/
│   │   └── mock/
│   │       ├── marketing-services.ts        ← NEW: How It Works step data (4 steps)
│   │       ├── marketing-testimonials.ts    ← NEW: EduVanta school admin testimonials
│   │       ├── marketing-modules.ts         ← NEW: 12 EduVanta module service cards for ServicesArea
│   │       └── marketing-blog-posts.ts      ← NEW: 3 EduVanta blog post objects
│   ├── messages/
│   │   ├── en.json                          ← ADD "landing" namespace (Phase 8)
│   │   ├── ar.json                          ← ADD "landing" namespace in Arabic (Phase 8)
│   │   └── ur.json                          ← ADD "landing" namespace in Urdu (Phase 8)
│   └── styles/
│       ├── startix-landing.scss             ← NEW: Bootstrap import + .startix-root { ... all partials }
│       ├── startix-dark.scss                ← NEW: .dark .startix-root { ... } overrides
│       ├── startix-rtl.scss                 ← NEW (Phase 9): [dir="rtl"] .startix-root { ... } overrides
│       └── startix/                         ← NEW: adapted SCSS partials (scoped; no :root, no html/body)
│           ├── _rs.scss                     ← Breakpoint variables
│           ├── _reboot.scss                 ← Adapted: no :root block, no html/body; only * {} etc.
│           ├── _miscellaneous.scss
│           ├── _preloader.scss
│           ├── _header.scss
│           ├── _hero.scss
│           ├── _about.scss
│           ├── _features.scss
│           ├── _pricing.scss
│           ├── _testimonial.scss
│           ├── _partner.scss
│           ├── _process.scss
│           ├── _faq.scss
│           ├── _cta.scss
│           ├── _footer.scss
│           ├── _blog.scss
│           ├── _contact.scss
│           ├── _service.scss
│           └── _breadcrumb.scss
└── public/
    └── startix/
        ├── img/
        │   ├── core-img/                    ← ~14 selected files only (shapes, decorative)
        │   ├── bg-img/                      ← ~10 selected files + eduvanta-dashboard.png
        │   └── partner-img/                 ← All 12 files
        └── css/
            ├── tabler-icons.min.css
            └── fonts/                       ← All Tabler icon font files (TTF/WOFF/WOFF2)
```

---

## 13. Phased Implementation Plan

### Phase 0 — Preflight and Safety Setup

**Objective**: Establish a safe working baseline before any structural changes.

**Actions**:
1. Create a git branch: `git checkout -b feat/startix-marketing`
2. Run `pnpm build` and verify exit code 0. If it fails, fix before proceeding.
3. Run `pnpm typecheck` — capture current error count as baseline.
4. Note all current `e2e/landing.test.ts` test assertions — what `data-testid` values are expected, what CTA hrefs are checked. These must pass after Phase 5.
5. Note the current count of routes in `e2e/global-setup.ts` warmup list — new routes will be added in Phase 7.
6. No file changes.

**Risk controls**: Observation only.  
**Verification**: `pnpm build` exits 0. `pnpm typecheck` count noted.  
**Acceptance criteria**: Clean git baseline on a feature branch. Build passes.

---

### Phase 1 — Route Architecture: (marketing) Route Group

**Objective**: Establish the `(marketing)` route group with layout, move the existing landing page into it, add placeholder inner pages. **Zero visual change** to the landing page at this stage.

**Files touched**:
- `src/app/[locale]/(marketing)/layout.tsx` — NEW (minimal, no CSS yet)
- `src/app/[locale]/(marketing)/page.tsx` — NEW (exact copy of current `[locale]/page.tsx` content)
- `src/app/[locale]/page.tsx` — DELETED after `(marketing)/page.tsx` is verified
- `src/app/[locale]/(marketing)/about/page.tsx` — NEW (stub)
- `src/app/[locale]/(marketing)/services/page.tsx` — NEW (stub)
- `src/app/[locale]/(marketing)/pricing/page.tsx` — NEW (stub)
- `src/app/[locale]/(marketing)/faq/page.tsx` — NEW (stub)
- `src/app/[locale]/(marketing)/contact/page.tsx` — NEW (stub)
- `src/app/[locale]/(marketing)/blog/page.tsx` — NEW (stub)
- `src/app/[locale]/not-found.tsx` — NEW (stub)

**`(marketing)/layout.tsx` at this phase** — minimal wrapper only, no CSS import:
```tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <div className="startix-root">{children}</div>;
}
```

**Stub page template**:
```tsx
export default function AboutPage() {
  return <main><p>Coming soon.</p></main>;
}
```

**Actions**:
1. Create `(marketing)/` directory and all files.
2. Copy current `[locale]/page.tsx` content exactly into `(marketing)/page.tsx`.
3. Delete `[locale]/page.tsx`.
4. Verify `/en`, `/ar`, `/ur` still render the existing 13-section landing page.
5. Verify `/en/about`, `/en/services`, etc. return stub content, not 404.

**Risk controls**: The existing landing page must render identically — no CSS changes yet. The `(marketing)` layout adds only a wrapper `<div>` with `className="startix-root"`. No visual difference expected.  
**Verification**: `pnpm build`. Visit `/en`, `/ar`, `/ur` in browser. Run `e2e/landing.test.ts` — must pass.  
**Acceptance criteria**: All existing landing tests pass. `/en/about` through `/en/blog` return stub content, not 404.

---

### Phase 2 — Asset Copy

**Objective**: Copy only the required Startix assets into `public/startix/`. No code changes.

**Files touched**:
- `public/startix/img/core-img/` — selected files
- `public/startix/img/bg-img/` — selected files
- `public/startix/img/partner-img/` — all 12 files
- `public/startix/css/tabler-icons.min.css`
- `public/startix/css/fonts/` — all Tabler icon font files

**Actions**:
1. Create `public/startix/` directory structure.
2. Copy assets per the selection in Section 6 of this plan.
3. Do NOT copy `demo-img/`, `bootstrap.min.css`, `flaticon.css`, unused `bg-img/` files.
4. Export an EduVanta dashboard screenshot from `/en/dashboard` at 1200px viewport width. Save as `public/startix/img/bg-img/eduvanta-dashboard.png`. Use browser DevTools screenshot or Playwright screenshot utility.
5. Place EduVanta logo variants at `public/startix/img/core-img/eduvanta-logo.png` and `eduvanta-logo-light.png`.

**Risk controls**: Assets in `public/` are static files. Cannot break anything.  
**Verification**: Navigate to `http://localhost:3000/startix/css/tabler-icons.min.css` — returns CSS file.  
**Acceptance criteria**: All required asset files accessible via `/startix/...` public URLs. `pnpm build` still exits 0.

---

### Phase 3 — Dependencies + SCSS Infrastructure

**Objective**: Install npm packages and create the Startix SCSS compilation pipeline. **CSS must not yet load on any live route** — this phase only prepares the infrastructure.

*Depends on: Phase 0 (clean build baseline).*

**Files touched**:
- `package.json` — new dependencies added
- `pnpm-lock.yaml` — updated automatically
- `src/styles/startix/` — all adapted SCSS partial files (new directory)
- `src/styles/startix-landing.scss` — NEW
- `src/styles/startix-dark.scss` — NEW

**Actions**:
1. Install packages: `pnpm add bootstrap sass swiper gsap react-countup react-intersection-observer`
2. Create `src/styles/startix/` directory.
3. Copy SCSS partials from `Startix/startix-nextjs/public/assets/scss/` into `src/styles/startix/`. Required partials listed in Section 12 file structure above.
4. Adapt `src/styles/startix/_reboot.scss`: strip the `:root { }` block entirely (CSS vars move to `startix-landing.scss`). Strip `html { }` and `body { }` selectors. Keep `* { }`, `::before { }`, `::after { }`, `img { }`, `a { }`, `ul { }`, `ol { }`.
5. Create `src/styles/startix-landing.scss` with Bootstrap import + `.startix-root { }` block importing all adapted partials. Include CSS var overrides inside the `.startix-root` block (see Section 5, Layer 2 for full structure).
6. Create `src/styles/startix-dark.scss` with `.dark .startix-root { }` block (see Section 5, Layer 4).
7. **Do NOT import `startix-landing.scss` in any layout yet.** Validate that SCSS compiles without errors by temporarily adding the import to a test file and running `pnpm build`, then removing it.

**Risk controls**: SCSS not imported in any live route during this phase. If SCSS compilation fails, fix partials before proceeding to Phase 4.  
**Verification**: `pnpm build` exits 0. `pnpm typecheck` exits 0.  
**Acceptance criteria**: All 6 packages installed. SCSS infrastructure exists in `src/styles/startix/`. `startix-landing.scss` compiles without errors. No live route affected.

---

### Phase 4 — Shared Marketing Components

**Objective**: Build all reusable marketing shell components before any page uses them. These form the visual frame of every marketing page.

*Depends on: Phase 3 (dependencies installed).*

**Files touched** — all NEW under `src/components/landing/shared/` and `src/components/landing/svg/`.

**Components to build**:

**`MarketingHeader.tsx`** (adapted from `HeaderOne.tsx`):
- EduVanta navigation links (Features, Pricing, Blog, Contact)
- Two CTA buttons: "Log In" and "View Demo" → both pointing to `/dashboard` via `Link` from `@/i18n/navigation`
- `useSticky` hook for scroll-based sticky header class
- `useState` for mobile menu open/close (no Bootstrap JS)
- CSS transition for mobile menu instead of Bootstrap collapse
- `data-testid="marketing-navbar"` on the `<header>` or `<nav>` root element
- Logo using `<Image>` from next/image pointing to `/startix/img/core-img/eduvanta-logo.png`
- Dark mode logo variant when `.dark` class is active
- Locale switcher (reuse EduVanta's existing locale switcher component if available, or build from scratch)
- Theme toggle button (reuse EduVanta's existing toggle)
- `"use client"` directive (uses hooks)

**`MarketingFooter.tsx`** (adapted from `FooterOne.tsx`):
- 4-column grid using Bootstrap `.row .col-lg-*`
- Column 1: EduVanta logo + tagline + social icon links (Tabler Icons `ti ti-brand-*`)
- Columns 2–4: EduVanta nav links (Platform, Company, Support)
- Copyright line: "© 2026 EduVanta. All rights reserved."
- All links use `Link` from `@/i18n/navigation`

**`MarketingWrapper.tsx`** (adapted from `Wrapper.tsx`):
- Renders: `<AnimationProvider>` + `<ScrollToTop>` + `<Iconsvg>` + `<SvgIconTwo>` + `{children}`
- **No ScrollSmoother wrapper divs** — children rendered directly
- `"use client"` directive

**`AnimationProvider.tsx`** (adapted from Startix's `AnimationProvider.tsx`):
- `"use client"` directive
- `useEffect` with `typeof window !== "undefined"` guard
- Registers `ScrollTrigger` and `SplitText` via `gsap.registerPlugin()`
- Animates `.heading-chars` elements using SplitText character split
- Animates `.heading-word` elements using SplitText word split
- Animates `.fade-in` elements using `gsap.fromTo` with ScrollTrigger
- **No `ScrollSmoother.create()` call** — this is the key omission vs Startix original
- Cleanup via `ctx.revert()` in `useEffect` return

**`ScrollToTop.tsx`**: Direct copy from Startix. Shows scroll progress as CSS variable. Appears after 600px scroll.

**`CountUp.tsx`** (adapted from Startix's `count.tsx`):
- Wraps `react-countup` with `react-intersection-observer`
- **Adds `enableScrollSpy` and `scrollSpyOnce`** to prevent SSR hydration mismatch
- Accepts `end`, `suffix`, `duration` props

**`ReactAccordion.tsx`** (new component — no Startix equivalent):
- `"use client"` directive
- `useState` for tracking which item is open
- Props: `items: { id: string; question: string; answer: string }[]`
- Renders with Bootstrap-compatible class structure:
  ```tsx
  <div className="accordion">
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className={`accordion-button ${isOpen ? '' : 'collapsed'}`} aria-expanded={isOpen} onClick={toggle}>
          {question}
        </button>
      </h2>
      <div className={`accordion-collapse ${isOpen ? 'show' : ''}`}>
        <div className="accordion-body">{answer}</div>
      </div>
    </div>
  </div>
  ```
- Clicking a button toggles its item; clicking an open item closes it (standard accordion behavior)

**`useSticky.ts`**: Direct copy from Startix. Returns `isSticky` boolean based on scroll position threshold.

**`Breadcrumb.tsx`** (adapted from Startix's `Breadcrumb.tsx`):
- Accepts `items: { label: string; href?: string }[]` prop
- Uses `Link` from `@/i18n/navigation` for locale-aware breadcrumb links
- Last item has no link (current page)

**`Iconsvg.tsx`, `SvgIconTwo.tsx`**: Direct copies. These define `<svg>` symbol elements with `display:none` that are referenced via `<use href="#checkIcon">` in feature and about components.

**Verification**: `pnpm typecheck` on all new files. All pass without TypeScript errors.  
**Acceptance criteria**: All 9 shared components + 2 SVG files created. Zero TypeScript errors. Components are not yet used in any route.

---

### Phase 5 — Home-1 Landing Adaptation

**Objective**: Replace the existing 13-section custom Tailwind landing page with the Startix Home-1 SaaS Landing, fully EduVanta-branded. This is the centerpiece of the entire upgrade.

*Depends on: Phases 1, 3, 4.*

**Files touched**:
- `src/app/[locale]/(marketing)/layout.tsx` — ADD SCSS imports and Tabler Icons `<link>`
- `src/app/[locale]/(marketing)/page.tsx` — REPLACE with new Startix home-1 composition
- `src/components/landing/home/index.tsx` — NEW
- `src/components/landing/home/HeroSection.tsx` — NEW
- `src/components/landing/home/BrandsSection.tsx` — NEW
- `src/components/landing/home/HowItWorksSection.tsx` — NEW
- `src/components/landing/home/AboutSection.tsx` — NEW
- `src/components/landing/home/FeaturesSection.tsx` — NEW
- `src/components/landing/home/PricingSection.tsx` — NEW
- `src/components/landing/home/TestimonialsSection.tsx` — NEW
- `src/components/landing/home/IntegrationsSection.tsx` — NEW
- `src/components/landing/home/FaqSection.tsx` — NEW
- `src/components/landing/home/CtaSection.tsx` — NEW
- `src/data/mock/marketing-services.ts` — NEW
- `src/data/mock/marketing-testimonials.ts` — NEW

**Marketing layout update** (this activates the Startix CSS for the first time):
```tsx
// src/app/[locale]/(marketing)/layout.tsx
import "@/styles/startix-landing.scss";
import "@/styles/startix-dark.scss";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/startix/css/tabler-icons.min.css" />
      <div className="startix-root">
        <MarketingWrapper>{children}</MarketingWrapper>
      </div>
    </>
  );
}
```

**Actions per section** (each is a distinct sub-step that can be committed individually):

1. **HeroSection**: Large headline with `className="heading-chars"` for GSAP SplitText, dashboard screenshot via `<Image>`, `CountUp` trust metric, two CTA buttons using `Link` from `@/i18n/navigation`. SSR-safe: CountUp uses `enableScrollSpy`.
2. **BrandsSection**: `"use client"`. Swiper with `Autoplay` + `freeMode`. 5 EduVanta partner logos. Import: `import "swiper/css"` and `import "swiper/css/autoplay"`.
3. **HowItWorksSection**: `"use client"`. Swiper card carousel. 4-step EduVanta onboarding data from `marketing-services.ts`. Sidebar image (Next.js `<Image>`).
4. **AboutSection**: 2-column layout. 3 bullets using `<use href="#checkIcon">` SVG symbol. `className="fade-in"` on elements for GSAP. CTA `Link` to `/services`.
5. **FeaturesSection**: 3 alternating `flex-row / flex-row-reverse` blocks. Each block: image left/right, content on other side. `className="heading-word"` for GSAP.
6. **PricingSection**: `"use client"`. `useState(false)` for isYearly toggle. 3 plan cards with conditional price display. All CTA buttons → `/dashboard`.
7. **TestimonialsSection**: `"use client"`. Swiper with `Navigation` and `Pagination` modules. 4 EduVanta testimonials from `marketing-testimonials.ts`.
8. **IntegrationsSection**: Static CSS grid. 7 EdTech integration cards (logo + name + description). No Swiper needed.
9. **FaqSection**: Uses `ReactAccordion` with 6 EduVanta Q&A items. No Bootstrap JS. No `data-bs-toggle` attributes.
10. **CtaSection**: Dark section with EduVanta primary teal background. 2 CTA buttons: `/dashboard` and `/contact`.

**Important note on Swiper components and i18n**: Swiper components are `"use client"` and cannot call `useTranslations()` directly. At this phase, content is hardcoded in English. Phase 8 will refactor by having the server page component (`page.tsx`) fetch translations via `getTranslations()` and pass strings as props to client components.

**Deprecation**: After this phase, `src/components/marketing/` files are no longer used. Do NOT delete yet — keep for reference through Phase 12.

**Risk controls**:
- Before activating CSS import: verify `pnpm build` exits 0 with new components but without the SCSS import in layout.
- After adding SCSS import: run dashboard page in browser and inspect CSS — confirm NO Bootstrap classes appear in dashboard page CSS.
- If any SCSS compilation error occurs, fix the relevant `src/styles/startix/` partial before proceeding.

**Verification**: `pnpm build`. Navigate `/en` — Startix home-1 renders correctly. Navigate `/en/dashboard` — dashboard is visually unchanged. Run `e2e/landing.test.ts` — `data-testid="marketing-navbar"` visible, "EduVanta" text in navbar, RTL direction on `/ar`. Both light and dark mode render correctly on landing.  
**Acceptance criteria**: All `e2e/landing.test.ts` tests pass. Dashboard renders without any visual difference. Zero TypeScript errors.

---

### Phase 6 — Inner Marketing Pages

**Objective**: Implement all 6 inner marketing pages with Startix-adapted components and EduVanta content.

*Depends on: Phase 5 (shared layout + CSS established).*

**Sub-phases** (each independently committable):

**6a. About Page** (`/[locale]/about`):
- Build `src/components/landing/about/AboutArea.tsx` — EduVanta product story, hero image, 3 feature bullets with `#checkIcon` symbols
- Build `src/components/landing/about/AboutStory.tsx` — Narrative + 4 CountUp stats
- Build `src/components/landing/about/index.tsx` — Composition: Breadcrumb + AboutArea + AboutStory + IntegrationsSection + CtaSection
- Replace `about/page.tsx` stub with full composition

**6b. Services Page** (`/[locale]/services`):
- Build `src/components/landing/services/ServicesArea.tsx` — 12 EduVanta module cards with Tabler icons (`ti ti-*`)
- Create `src/data/mock/marketing-modules.ts` — 12 module objects: `{ id, title, description, icon }`
- Build `src/components/landing/services/index.tsx` — Breadcrumb + ServicesArea + CtaSection
- Replace `services/page.tsx` stub

**6c. Pricing Page** (`/[locale]/pricing`):
- Build `src/components/landing/pricing/PricingPage.tsx` — Full composition: Breadcrumb + PricingSection + FaqSection (subset, 4 pricing-specific Q&A) + CtaSection
- Replace `pricing/page.tsx` stub

**6d. FAQ Page** (`/[locale]/faq`):
- Build `src/components/landing/faq/FaqArea.tsx` — Two-column: heading + CTA left, ReactAccordion with 12 Q&A right
- Build `src/components/landing/faq/index.tsx` — Breadcrumb + FaqArea + CtaSection
- Replace `faq/page.tsx` stub

**6e. Contact Page** (`/[locale]/contact`):
- Build `src/components/landing/contact/ContactArea.tsx` — Left panel: contact info + social. Right panel: React Hook Form + Zod form (Name, Email, Institution, Subject, Message). No Google Maps. Demo notice visible. On submit: sonner toast success message.
- Build `src/components/landing/contact/index.tsx` — Breadcrumb + ContactArea
- Replace `contact/page.tsx` stub

**6f. Blog Page** (`/[locale]/blog`):
- Create `src/data/mock/marketing-blog-posts.ts` — 3 EduVanta blog post objects: `{ id, title, excerpt, category, date, image, slug }`
- Build `src/components/landing/blog/BlogArea.tsx` — 3 post cards using blog post data. "Read More" links point to `/blog` (same page) with a `#` hash until `/blog/[slug]` is implemented. Sidebar with recent posts + categories.
- Build `src/components/landing/blog/index.tsx` — Breadcrumb + BlogArea + CtaSection
- Replace `blog/page.tsx` stub

**6g. Not Found** (`src/app/[locale]/not-found.tsx`):
- Build using Tailwind + shadcn/ui components only (no Startix CSS — outside `(marketing)` layout)
- Visual reference: Startix 404 page layout
- Content: EduVanta logo, "404", "Page Not Found" heading, subtext, two action buttons (Homepage + Dashboard)

**Verification**: `pnpm build`. Visit all 6 new routes in browser. `pnpm typecheck` exits 0. No TypeScript errors. Breadcrumbs show correct paths.  
**Acceptance criteria**: All 6 inner pages render without 404. Header and footer appear on all pages. Breadcrumb is correct. React accordion works without Bootstrap JS.

---

### Phase 7 — Auth Route Simplification and CTA Updates

**Objective**: Update all public marketing CTAs to point to `/[locale]/dashboard`. Verify no auth links appear in marketing navigation. Update test warmup list. Keep auth pages intact.

*Depends on: Phase 5 (marketing header exists).*

**Files touched**:
- `src/components/landing/shared/MarketingHeader.tsx` — Verify no `/login`, `/register` links in nav. Both "Log In" and "Get Started" → `/dashboard`
- `src/components/landing/home/HeroSection.tsx` — Primary CTA → `/dashboard`
- `src/components/landing/home/CtaSection.tsx` — Button 1 → `/dashboard`, Button 2 → `/contact`
- `src/components/landing/home/PricingSection.tsx` — All plan CTA buttons → `/dashboard`
- `e2e/global-setup.ts` — ADD new routes to warmup: `/en/about`, `/en/services`, `/en/pricing`, `/en/faq`, `/en/contact`, `/en/blog`, and AR/UR equivalents
- `e2e/landing.test.ts` — Update to match any changed `data-testid` values or new section names if needed

**Auth pages**: Do absolutely nothing to them. All 4 auth pages continue to exist at `/[locale]/login`, `/[locale]/register`, `/[locale]/forgot-password`, `/[locale]/reset-password`. `e2e/auth.test.ts` passes unchanged.

**Verification**: `pnpm build`. All "Get Started", "View Demo", "Log In" links resolve to `/en/dashboard`. No marketing nav item links to auth pages. `e2e/landing.test.ts` passes. `e2e/auth.test.ts` passes unchanged.  
**Acceptance criteria**: Zero auth links in marketing nav. All marketing CTAs route to `/dashboard`. Auth e2e tests continue to pass.

---

### Phase 8 — i18n Text Extraction (EN / AR / UR)

**Objective**: Replace all hardcoded English strings in landing components with `useTranslations("landing")` calls. Add the `landing.*` namespace to all 3 locale message files.

*Depends on: Phase 6 (all pages implemented with hardcoded English strings).*

**Files touched**:
- `src/messages/en.json` — ADD `landing` top-level namespace
- `src/messages/ar.json` — ADD `landing` namespace with Arabic translations
- `src/messages/ur.json` — ADD `landing` namespace with Urdu translations
- All components in `src/components/landing/` — ADD `useTranslations("landing")` and replace hardcoded strings

**`landing` namespace top-level structure**:
```json
{
  "landing": {
    "nav": { "features": "...", "pricing": "...", "blog": "...", "contact": "...", "login": "...", "cta": "..." },
    "hero": { "badge": "...", "headline": "...", "body": "...", "trustCount": "...", "trustLabel": "...", "ctaPrimary": "...", "ctaSecondary": "..." },
    "brands": { "heading": "..." },
    "howItWorks": { "heading": "...", "step1Title": "...", "step1Body": "...", ... },
    "about": { "heading": "...", "body": "...", "bullet1": "...", "bullet2": "...", "bullet3": "...", "cta": "..." },
    "features": { "block1Heading": "...", "block1Body": "...", ... },
    "pricing": { "heading": "...", "monthly": "...", "yearly": "...", "plan1Name": "...", ... },
    "testimonials": { "heading": "...", "quote1": "...", "name1": "...", "role1": "...", ... },
    "integrations": { "heading": "...", "subheading": "...", "tool1": "...", ... },
    "faq": { "heading": "...", "q1": "...", "a1": "...", ... },
    "cta": { "heading": "...", "body": "...", "btn1": "...", "btn2": "..." },
    "footer": { "bio": "...", "platform": "...", "company": "...", "support": "...", ... },
    "about_page": { ... },
    "services_page": { ... },
    "pricing_page": { ... },
    "faq_page": { ... },
    "contact_page": { ... },
    "blog_page": { ... },
    "notFound": { "heading": "...", "body": "...", "homeBtn": "...", "dashboardBtn": "..." }
  }
}
```

**i18n pattern for client components** (Swiper, Pricing toggle, etc.):

Since `"use client"` components cannot call `useTranslations()` directly in all cases, use this pattern:
- Server page component (`page.tsx`) or server-side inner index component calls `const t = await getTranslations("landing")` and passes string props to client components.
- Example: `<HeroSection headline={t("hero.headline")} body={t("hero.body")} ... />`
- Alternatively, use `useTranslations()` hook directly in `"use client"` components — this is supported in next-intl 4.x when the component is rendered inside `NextIntlClientProvider` (which is set up in `[locale]/layout.tsx`).

**Verification**: Visit `/ar` — all landing text in Arabic. Visit `/ur` — all landing text in Urdu. `pnpm typecheck` exits 0. `pnpm build` exits 0.  
**Acceptance criteria**: Zero hardcoded English strings in `src/components/landing/` components. All 3 locales render translated marketing content.

---

### Phase 9 — RTL Polish

**Objective**: Ensure all Startix marketing pages render correctly under `dir="rtl"` for Arabic and Urdu.

*Depends on: Phase 8 (i18n complete).*

**Files touched**:
- `src/styles/startix-rtl.scss` — NEW
- `src/app/[locale]/(marketing)/layout.tsx` — ADD import for `startix-rtl.scss`
- Potentially minor fixes in individual component JSX (e.g., Swiper `dir` attribute)

**Actions**:
1. Visit `/ar` on all 7 marketing pages (home + 6 inner) with browser DevTools open.
2. Identify all physical `left:`/`right:` CSS property values in Startix SCSS that need flipping for RTL. Common locations:
   - `_header.scss`: dropdown arrow direction, logo/nav alignment
   - `_hero.scss`: hero image absolute positioning (`right: -100px` style values)
   - `_footer.scss`: social nav hover effect direction
   - `_about.scss`: image overlap positioning
   - `_pricing.scss`: check icon placement, card shadow direction
3. Create `src/styles/startix-rtl.scss` with documented overrides.
4. For Swiper components (BrandsSection, HowItWorksSection, TestimonialsSection): detect locale and add `dir="rtl"` prop to `<Swiper>` when locale is `ar` or `ur`. Use `useLocale()` from next-intl.
5. Import `startix-rtl.scss` in `(marketing)/layout.tsx`.

**Verification**: All 7 marketing pages render without layout breakage at `/ar` and `/ur`. Navbar hamburger appears on the correct (left) side for RTL. Hero image mirrors. Cards flip correctly.  
**Acceptance criteria**: Zero horizontal overflow on RTL pages. No layout element appears visually broken. `e2e/rtl.test.ts` updated to include `/ar/about`, `/ar/services`, etc. and passes.

---

### Phase 10 — Dark Mode Integration

**Objective**: Ensure all Startix marketing pages render correctly in dark mode.

*Depends on: Phase 3 (`startix-dark.scss` created). Can run concurrently with Phase 9.*

**Actions**:
1. Test dark mode by running in browser console: `localStorage.setItem("theme", "dark"); location.reload()`
2. Visit each marketing page section and identify any dark mode issues:
   - Text invisible (dark text on dark background)
   - White section backgrounds that don't flip
   - Header/footer background in dark mode
   - Card backgrounds
   - Swiper pagination dot colors
   - Accordion border colors
3. Expand `src/styles/startix-dark.scss` with section-specific overrides as needed:
   ```scss
   .dark .startix-root {
     .header-section { background-color: #0f1117; }
     .footer-section { background-color: #0d1018; }
     .pricing-card { background-color: #1a1d2e; border-color: rgba(255,255,255,0.1); }
     // etc.
   }
   ```
4. Ensure pricing toggle, FAQ accordion open/close states, and Swiper arrows are all visible in dark mode.
5. Note: EduVanta's `globals.css` dark mode tokens (OKLch) are NOT inherited by Startix CSS — Startix uses its own CSS vars (`--Primary`, `--Heading`, `--Text`) that must be explicitly overridden in `startix-dark.scss`.

**Verification**: Set dark mode via localStorage. All 7 marketing pages render legibly in dark mode. All text readable. All interactive elements visible and usable. `e2e/dark-mode.test.ts` updated to include marketing landing dark mode check.  
**Acceptance criteria**: All marketing pages visually correct in both light and dark mode. No invisible text or broken layouts in either mode.

---

### Phase 11 — Responsive Polish

**Objective**: Ensure all marketing pages are fully responsive across mobile, tablet, and desktop breakpoints.

*Depends on: Phase 6.*

**Breakpoints to test**: 320px, 375px, 768px, 1024px, 1280px, 1920px.

**Areas to check**:
- Swiper `slidesPerView` at mobile (BrandsSection: 2–3 logos, TestimonialsSection: 1 card)
- Navbar hamburger menu opens/closes correctly at mobile
- Hero text scaling — Startix SCSS uses `clamp()` in `_hero.scss` for fluid typography
- Pricing cards: single column stacking on mobile
- Features alternating blocks: stack vertically on mobile
- Footer columns: responsive grid collapse
- About two-column: stack vertically on mobile
- Blog cards: responsive grid

**Actions**:
1. Test all breakpoints in browser DevTools.
2. Fix any overflow or horizontal scroll issues in Startix SCSS partials.
3. Adjust Swiper `breakpoints` config in BrandsSection and TestimonialsSection if needed.

**Verification**: Playwright Mobile Chrome project runs against all marketing pages. No horizontal scrollbar on any page at 375px. Playwright `e2e/responsive.test.ts` (if exists) passes.  
**Acceptance criteria**: No horizontal overflow at any breakpoint. All sections usable on 375px viewport. Mobile navigation functional.

---

### Phase 12 — Tests Update and QA

**Objective**: Update all affected tests to match the new marketing site structure. Ensure dashboard regression is zero. Run the full test suite.

*Depends on: All Phases 1–11.*

**Files touched**:
- `e2e/landing.test.ts` — Update assertions for new Startix section structure
- `e2e/global-routes.test.ts` — Add 6 new marketing routes to `assertNoFourOhFour()` checks
- `e2e/global-setup.ts` — Already updated in Phase 7; verify completeness
- `e2e/smoke.test.ts` — Verify still passes as-is (should require no changes)
- `e2e/auth.test.ts` — Verify still passes unchanged (auth pages kept)
- `e2e/dark-mode.test.ts` — Add marketing landing dark mode check
- `e2e/rtl.test.ts` — Add marketing RTL checks for `/ar/about`, `/ar/services`, etc.

**Full QA checklist**:
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0
- [ ] `pnpm test` (Vitest unit tests) — all pass
- [ ] `pnpm build` exits 0
- [ ] `e2e/smoke.test.ts` — `/en`, `/ar`, `/ur` load; root redirects
- [ ] `e2e/landing.test.ts` — marketing-navbar testid, EduVanta text, RTL, CTA href
- [ ] `e2e/auth.test.ts` — all 4 auth pages fully functional (no changes expected)
- [ ] `e2e/global-routes.test.ts` — all routes return non-404 (60+ dashboard routes + 6 new marketing routes)
- [ ] `e2e/dark-mode.test.ts` — dashboard dark mode + marketing dark mode
- [ ] `e2e/rtl.test.ts` — `/ar`, `/ur` direction attribute + marketing RTL
- [ ] `e2e/responsive.test.ts` (Mobile Chrome) — no horizontal overflow
- [ ] `e2e/dashboard-variants.test.ts` — all dashboard variants load correctly
- [ ] `e2e/finance.test.ts`, `e2e/fees.test.ts`, `e2e/library.test.ts`, etc. — no regressions from CSS changes
- [ ] Manual dashboard spot check: Students, Finance, Library pages load with zero Startix CSS visual interference
- [ ] Manual dark mode spot check on dashboard: `.dark` class visually correct on all dashboard pages

**Acceptance criteria**: Full green test run. All Playwright tests pass across Chromium, Firefox, and Mobile Chrome. No dashboard regression.

---

### Phase 13 — Build Optimization and Final Verification

**Objective**: Ensure Bootstrap/GSAP/Swiper are NOT in the dashboard bundle. Remove deprecated components. Final content polish.

*Depends on: Phase 12.*

**Actions**:
1. Analyze bundle composition: `pnpm build` then inspect `.next/static/chunks/` to confirm `bootstrap`, `gsap`, `swiper` chunks are absent from dashboard page chunks and present only in marketing route chunks.
2. Ensure GSAP tree-shaking: use named imports (`import { gsap } from "gsap"`, `import { ScrollTrigger } from "gsap/ScrollTrigger"`, `import { SplitText } from "gsap/SplitText"`) rather than barrel/side-effect imports.
3. Delete `src/components/marketing/` directory (16 old files) after confirming zero imports remain via `grep -r "components/marketing" src/`. Requires destructive action — confirm before executing.
4. Final content pass: proofread all EduVanta marketing copy in EN. Verify AR and UR translations are complete.
5. Replace dashboard screenshot placeholder in hero with a fresh high-quality export from `/en/dashboard`.
6. Replace EdTech integration logo placeholders with final SVG/PNG assets.
7. Remove any `console.log` statements added during development.
8. Final `pnpm build` — exit code 0.
9. Final `pnpm start` — manual verification of all 7 marketing pages + key dashboard pages.

**Verification**: Bundle analysis confirms Bootstrap/GSAP absent from dashboard chunks. All QA checklist items from Phase 12 pass. Zero TypeScript errors. Zero lint errors. Zero deprecated component imports.  
**Acceptance criteria**: Complete green build + test run. Marketing site live and polished. Dashboard unchanged. `src/components/marketing/` deleted. No dead code remaining.

---

## 14. Test and QA Plan

| Check | Tool | Command | Expected Outcome |
|-------|------|---------|-----------------|
| TypeScript | tsc | `pnpm typecheck` | 0 errors |
| ESLint | eslint | `pnpm lint` | 0 errors |
| Unit tests | Vitest | `pnpm test` | All pass |
| Build | Next.js | `pnpm build` | Exit code 0 |
| Smoke — locales | Playwright | `e2e/smoke.test.ts` | `/en`, `/ar`, `/ur` load; root → `/en` redirect |
| Landing — structure | Playwright | `e2e/landing.test.ts` | `marketing-navbar` testid, "EduVanta" text, RTL direction, CTA href to dashboard |
| Auth pages | Playwright | `e2e/auth.test.ts` | All 4 auth pages load; forms validate; RTL works |
| Route coverage | Playwright | `e2e/global-routes.test.ts` | 60+ dashboard routes + 6 new marketing routes return non-404 |
| Dark mode | Playwright | `e2e/dark-mode.test.ts` | Dashboard dark mode unchanged; marketing dark mode correct |
| RTL | Playwright | `e2e/rtl.test.ts` | `/ar`, `/ur` have `dir=rtl` on html; marketing pages RTL-correct |
| Responsive | Playwright | Mobile Chrome project | No horizontal overflow at Pixel 5 viewport (393px) |
| Dashboard regression | Playwright | All dashboard e2e tests | No visual or functional regressions |
| Bundle analysis | Manual | Inspect `.next/static/chunks/` | Bootstrap/GSAP/Swiper absent from dashboard chunks |

---

## 15. Risks and Mitigations

| Priority | Risk | Impact | Mitigation |
|----------|------|--------|-----------|
| 🔴 P1 | Bootstrap CSS leaks to dashboard after client-side navigation | Dashboard UI breaks visually | Scope all Startix custom SCSS to `.startix-root`. Bootstrap class names don't appear in dashboard components. If leakage occurs, add `@layer base { ... }` isolation or use CSS cascade layers. |
| 🔴 P1 | `_reboot.scss` `* { margin:0; padding:0 }` applies globally outside `.startix-root` | All EduVanta spacing broken | Wrap all SCSS in `.startix-root { }` in `startix-landing.scss`. Strip `:root` and `html/body` selectors from adapted `_reboot.scss`. Verify with dashboard visual check after Phase 5. |
| 🔴 P1 | GSAP AnimationProvider crashes on SSR | Build fails or runtime crash | All GSAP code inside `useEffect` with `typeof window !== "undefined"` guard. `AnimationProvider` is `"use client"`. GSAP never imported at module top level in a server context. |
| 🟠 P2 | Swiper SSR hydration mismatch | Console errors; visual flash on hydration | All Swiper components use `"use client"` directive. `suppressHydrationWarning` on Swiper outer wrapper if needed. |
| 🟠 P2 | `useTranslations` not available in deep client component tree | Build error or missing translations | Use props-drilling pattern: server page calls `getTranslations()`, passes strings as props to client Swiper components. Or use `useTranslations()` hook (supported in next-intl 4.x with client provider). |
| 🟠 P2 | Marketing layout CSS import accidentally affects auth pages | Auth form inputs styled by Bootstrap | Auth pages are in `(auth)/layout.tsx` which does NOT inherit from `(marketing)/layout.tsx`. Verify route group isolation with browser network panel after Phase 5. |
| 🟠 P2 | Moving `[locale]/page.tsx` to `(marketing)/page.tsx` breaks existing landing tests | `e2e/landing.test.ts` fails | `data-testid="marketing-navbar"` must be preserved in new `MarketingHeader`. Monitor test immediately after Phase 1. |
| 🟠 P2 | SCSS `@use` vs `@import` Dart Sass compatibility | SCSS compilation error | Use `@use` consistently throughout adapted partials (Dart Sass 1.80+ deprecates `@import`). Or use `@import` throughout (still works in current Sass 1.93). Do not mix systems. |
| 🟡 P3 | RTL: physical `left`/`right` values in Startix SCSS cause misaligned layouts on `/ar` | Marketing pages broken in AR/UR | Phase 9 RTL audit systematically catches these. Bootstrap 5 uses logical properties by default — only custom SCSS needs overrides. |
| 🟡 P3 | Dark mode: Startix SCSS components don't respond to `.dark` class | Marketing pages unreadable in dark | `startix-dark.scss` covers all CSS vars. Phase 10 section-by-section audit catches missed selectors. |
| 🟡 P3 | `react-countup` hydration mismatch in Hero trust metric | SSR/client number mismatch; hydration warning | Use `enableScrollSpy` + `scrollSpyOnce` in `CountUp.tsx`. If still flashing, wrap in `dynamic(() => import(...), { ssr: false })`. |
| 🟡 P3 | Bootstrap accordion CSS classes (`.collapse`, `.show`) expected by `_faq.scss` not applied by `ReactAccordion` | FAQ accordion unstyled | `ReactAccordion` outputs identical HTML class structure as Bootstrap accordion. The SCSS targets these class names — they still work. Test after Phase 4 by inspecting `_faq.scss` selectors. |
| 🟡 P3 | GSAP SplitText splits DOM structure, causing React hydration mismatch | Console errors; potential layout flash | SplitText runs only in `useEffect` (client-side, post-hydration). Server renders unsplit text. Client splits. Add `suppressHydrationWarning` on heading elements with `className="heading-chars"`. |
| 🟡 P3 | Contact form "send" triggered accidentally by users expecting real submission | User confusion; trust issue | Clear visible notice on form: "This is a demo — form submissions are not sent." Sonner toast on submit: "Demo form — no data sent." |
| 🟢 P4 | Tabler Icons `<link>` tag in layout causes FOUC (flash of unstyled icons) | Icons briefly appear as squares | Add `<link rel="preload" as="style">` hint alongside the stylesheet link. Or inline critical Tabler icon CSS for the most-used icons. |
| 🟢 P4 | Blog "Read More" links are dead (no `/blog/[slug]` yet) | Broken UX expectation | Label cards as "Preview" or "Coming Soon". Disable the link visually. Add a tooltip: "Full articles coming soon." |
| 🟢 P4 | Dashboard screenshot in hero becomes outdated | Misleading product preview | Document as a periodic refresh task. Use Next.js `<Image>` with `priority` for LCP optimization. |

---

## 16. Open Questions / Decisions Needed Before Execution

**Q1: Brand primary color on marketing site**

The Startix template uses blue (`#3147FF`). EduVanta's dashboard uses teal (`#25A194`). This plan overrides `--Primary` to EduVanta teal on the marketing site for brand consistency.

- **Option A** (Recommended): Override to EduVanta teal `#25A194` on marketing. Consistent brand identity between marketing and dashboard.
- **Option B**: Keep Startix blue `#3147FF` on marketing site only (two-tone brand — inconsistent).
- **Option C**: Define a new EduVanta marketing color (e.g., indigo `#4F46E5` for a more EdTech-specific palette) used on marketing only.

→ **Decision needed before Phase 3.**

**Q2: EduVanta dashboard screenshot for hero image**

Phase 2 calls for exporting a screenshot from `/en/dashboard`. The production server must be running.

- **Option A** (Recommended): Use Startix's `bg-img/29.png` as an initial placeholder. Replace with a real EduVanta dashboard screenshot in Phase 13.
- **Option B**: Export a screenshot immediately in Phase 2 using Playwright's screenshot utility.

→ **Decision needed before Phase 2.**

**Q3: Testimonials and integration logos**

EduVanta has no real customer data.

- **Option A** (Recommended): Create realistic-sounding fictional school/institution testimonials. Use official EdTech company logos (Google, Microsoft, Zoom, etc.) as "works with" references — these are permitted for compatibility claims with proper usage. Source logos from official brand asset pages.
- **Option B**: Use fully placeholder text and icons for both.

→ **Decision needed before Phase 5.**

**Q4: Contact form behavior**

No backend exists. Three options:

- **Option A** (Recommended): Client-side form validation (React Hook Form + Zod) with a `sonner` success toast on submit. No network request. Visible demo notice on the form.
- **Option B**: Show a static "This is a demo — please email us directly" message instead of a form.
- **Option C**: Wire to a real form service (Formspree, EmailJS). Out of scope for mock-only architecture.

→ **Decision needed before Phase 6e.**

**Q5: Blog `/blog/[slug]` — defer or include in this phase?**

The plan defers blog detail pages. Blog "Read More" links loop back to the blog list.

- **Option A** (Recommended): Defer `/blog/[slug]` to a future phase. Mark blog post links as coming soon.
- **Option B**: Implement 3 static blog detail pages with hardcoded content in this phase.

→ **Recommend Option A.** Confirm agreement before Phase 6f.

**Q6: `pnpm dev` vs `pnpm build && pnpm start` for development**

SCSS compilation (including Bootstrap import) may behave differently in Turbopack dev mode. All verification steps in this plan use `pnpm build && pnpm start`.

→ **Convention: always use `pnpm build && pnpm start` for verification.** Do not use `pnpm dev` for visual testing. This is already the EduVanta convention per the session history.

**Q7: `src/styles/startix/` SCSS import strategy (`@use` vs `@import`)**

Dart Sass 1.80+ deprecates `@import` in favor of `@use`. The Startix template was written with `@import`. EduVanta's Tailwind v4 uses PostCSS. The `sass` package handles compilation separately from PostCSS.

- **Option A** (Recommended): Use `@import` throughout `src/styles/startix/` partials to stay faithful to the original template structure. Accept the deprecation warning in build output. Plan to migrate to `@use` in a future cleanup phase.
- **Option B**: Convert all partials to `@use` / `@forward` immediately. More work, future-proof.

→ **Decision needed before Phase 3.**

---

## 17. Final Recommendation

**Proceed with this plan.**

The architecture is technically sound, the CSS isolation via `(marketing)/layout.tsx` is the correct Next.js App Router approach, and the phased execution ensures each step can be independently verified and rolled back if needed.

**Start with Phase 0** — run `pnpm build`, verify the clean baseline, create the git branch `feat/startix-marketing`. This is reversible, takes under 5 minutes, and establishes the safety foundation for all subsequent phases.

**The single most important architectural decision** (and the one that makes everything else safe) is that Bootstrap CSS is imported ONLY in `src/app/[locale]/(marketing)/layout.tsx`. If this constraint is maintained throughout all phases, the dashboard cannot be affected.

**Phase execution order**:
- Phases 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13
- Each phase depends on the previous. Do not skip phases.
- Phase 5 (Home-1 landing) is the highest-risk phase. Execute it only after Phases 1–4 are fully verified.
- Phases 9 (RTL) and 10 (Dark mode) can be executed in parallel once Phase 8 is complete.
- Phase 11 (Responsive) can begin after Phase 6.

**Rollback strategy**: Since all work is on the `feat/startix-marketing` branch, any phase can be rolled back by reverting the commits for that phase. The main branch remains untouched until Phase 13 final verification is complete and the plan owner approves merging.

---

*Plan generated: 2026-05-10*  
*Research sources: `src/app/[locale]/page.tsx`, `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/app/globals.css`, `middleware.ts`, `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/components/marketing/` (16 files), `src/components/providers/app-providers.tsx`, `e2e/landing.test.ts`, `e2e/auth.test.ts`, `e2e/smoke.test.ts`, `e2e/global-routes.test.ts`, `e2e/global-setup.ts`, `playwright.config.ts`, `package.json`, `Startix/startix-nextjs/src/components/homes/home-1/` (11 files), `Startix/startix-nextjs/src/components/Aboutus/` (4 files), `Startix/startix-nextjs/src/components/Services/` (2 files), `Startix/startix-nextjs/src/components/Blog/` (2 files), `Startix/startix-nextjs/src/components/Faq/` (2 files), `Startix/startix-nextjs/src/components/Contact/` (2 files), `Startix/startix-nextjs/src/components/Pricing/` (1 file), `Startix/startix-nextjs/src/layouts/headers/HeaderOne.tsx`, `Startix/startix-nextjs/src/layouts/footers/FooterOne.tsx`, `Startix/startix-nextjs/src/layouts/Wrapper.tsx`, `Startix/startix-nextjs/src/common/AnimationProvider.tsx`, `Startix/startix-nextjs/src/common/ThemeProvider.tsx`, `Startix/startix-nextjs/src/common/count.tsx`, `Startix/startix-nextjs/src/svg/` (2 files), `Startix/startix-nextjs/public/assets/scss/` (15 partials inspected), `Startix/startix-nextjs/src/styles/index.scss`, `doc/STARTIX_TEMPLATE_DEEP_AUDIT_FOR_EDUVANTA_LANDING.md`*
