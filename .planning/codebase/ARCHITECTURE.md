# Architecture

> Generated: 2026-03-09 | Focus: arch

## Pattern Overview

- **Name:** Single-Page Application (SPA) with client-side routing
- **Key Characteristics:**
  - React 19 SPA rendered entirely in the browser via `createRoot`
  - Client-side routing via React Router DOM v7 (`BrowserRouter`)
  - No server-side rendering or framework-level data fetching
  - Post-build prerendering for SEO meta tags only (`scripts/prerender.mjs`)
  - All state managed with React hooks (no external state library)
  - Swiss-style design system driven by CSS custom properties and `data-theme` attribute
  - `motion/react` (Motion for React / Framer Motion successor) for all entrance and interaction animations

## Layers

### 1. Entry Layer

- **Purpose:** Bootstrap the React application
- **Location:** `src/main.tsx`, `index.html`
- **Contains:**
  - `StrictMode` wrapper
  - `createRoot` mount to `#root` DOM element
  - Global CSS import (`src/index.css`)
- **Depends on:** `src/App.tsx`
- **Used by:** Browser (initial load)

### 2. Routing Layer

- **Purpose:** Map URL paths to page components; provide layout wrapper
- **Location:** `src/App.tsx`
- **Contains:**
  - `BrowserRouter` with dynamic `basename` from `import.meta.env.BASE_URL`
  - Single `<Route element={<Layout />}>` that wraps all child routes
  - 14 route definitions total: home, 7 project pages, showcase, visitenkarte, 3 legal pages, catch-all 404
- **Depends on:** `src/components/Layout.tsx`, all page components
- **Used by:** Entry layer

**Route map:**

| Path | Component | Category |
|------|-----------|----------|
| `/` | `Home` | Home |
| `/projekte/heistline` | `ProjectHeistLine` | Project |
| `/projekte/mr-dork-3` | `ProjectMrDork3` | Project |
| `/projekte/liketik` | `ProjectLikeTik` | Project |
| `/projekte/exambyte` | `ProjectExambyte` | Project |
| `/projekte/itchio` | `ProjectItchio` | Project |
| `/projekte/maxsimcli` | `ProjectMaxsimCli` | Project |
| `/projekte/cc-templates` | `ProjectCcTemplates` | Project |
| `/visitenkarte` | `Visitenkarte` | Special |
| `/showcase` | `ArchitectShowcase` | Special |
| `/impressum` | `Impressum` | Legal |
| `/datenschutz` | `Datenschutz` | Legal |
| `/agb` | `AGB` | Legal |
| `*` | `NotFound` | Error |

### 3. Layout Layer

- **Purpose:** Provide consistent page shell with Header, Footer, and cross-cutting effects
- **Location:** `src/components/Layout.tsx`
- **Contains:**
  - Conditional `<Header>` and `<Footer>` rendering (currently both always render; the `isHome` prop changes header behavior)
  - `<Outlet />` for nested route rendering
  - Four `useEffect` hooks for cross-cutting behavior:
    1. Scroll-to-top on route change (unless hash anchor)
    2. `IntersectionObserver` for `.fade-in-up` CSS animations
    3. Click handler for smooth-scroll hash anchors (easeInOutCubic, 700ms)
    4. Hash-based smooth scroll on navigation
- **Depends on:** `src/components/Header.tsx`, `src/components/Footer.tsx`
- **Used by:** Routing layer (as `<Route element={<Layout />}>`)

**Important design note:** The current `Layout.tsx` always renders both Header and Footer. The CLAUDE.md mentions `projectPaths` and `specialDetailPages` Sets for conditional rendering, but the current implementation does NOT use these -- Header and Footer render unconditionally. Project detail pages handle their own padding via `ProjectShell`'s `hasSiteHeader` prop.

### 4. Section Layer (Home Page)

- **Purpose:** Compose the home page from ordered content sections
- **Location:** `src/sections/`
- **Contains:** 7 section components rendered in sequence by `src/pages/Home.tsx`
  - `Hero.tsx` -- Full-screen hero with animated grid background, FlipWords title, profile image, CTA buttons
  - `About.tsx` -- Profile image + biography with links to external companies/projects
  - `Philosophy.tsx` -- 4-card grid of work principles using Lucide icons
  - `Experience.tsx` -- Timeline layout with animated dots and staggered entry
  - `Projects.tsx` -- Filterable project card grid with AnimatePresence transitions
  - `Skills.tsx` -- Tabbed skills display with 5 content tabs + tech-stack marquee
  - `Contact.tsx` -- Split layout: contact info links (left) + Formspree form (right)
- **Depends on:** `src/components/SectionHeading.tsx`, `src/components/ProjectCard.tsx`, `src/data/projects.ts`, `src/lib/animations.ts`
- **Used by:** `src/pages/Home.tsx`

Each section uses `id` attributes for hash-anchor navigation (e.g., `id="projects"`, `id="skills"`).

### 5. Page Layer

- **Purpose:** Full page components for non-home routes
- **Location:** `src/pages/`, `src/pages/projects/`
- **Contains:**
  - **Project detail pages** (`src/pages/projects/`): 7 files, each using `ProjectShell` wrapper with project-specific content
  - **Special pages:** `ArchitectShowcase.tsx` (standalone showcase with its own hero, skill cards, marquee, principles, featured projects), `Visitenkarte.tsx` (digital business card with vCard download, QR code, Wallet pass)
  - **Legal pages:** `Impressum.tsx`, `Datenschutz.tsx`, `AGB.tsx` -- static content
  - **Error page:** `NotFound.tsx` -- styled 404 with grid backdrop and CTAs
- **Depends on:** `src/components/ProjectShell.tsx`, `src/components/SectionHeading.tsx`, `src/lib/animations.ts`
- **Used by:** Routing layer

### 6. Component Layer

- **Purpose:** Reusable UI building blocks
- **Location:** `src/components/`
- **Contains:**
  - `Header.tsx` -- Fixed navigation bar with desktop/mobile layouts, active section tracking via IntersectionObserver, animated mobile menu with focus trap
  - `Footer.tsx` -- Three-column footer (brand, quick links, contact/social)
  - `ProjectShell.tsx` -- Wrapper for project detail pages providing hero image, title, subtitle, back button, optional CTA
  - `ProjectCard.tsx` -- Card component for project grid; handles both internal (`Link`) and external (`<a>`) navigation
  - `SectionHeading.tsx` -- Reusable section header with eyebrow, title, optional subtitle; center or left aligned
  - `FlipWords.tsx` -- Animated word rotator using AnimatePresence; used in Hero subtitle
  - `ThemeToggle.tsx` -- Light/dark theme toggle button (reads `data-theme` from DOM, persists to localStorage)
- **Depends on:** `motion/react`, `react-router-dom`, `src/data/projects.ts` (ProjectCard only)
- **Used by:** Section layer, page layer, layout layer

### 7. Data Layer

- **Purpose:** Static data definitions and TypeScript types
- **Location:** `src/data/`
- **Contains:**
  - `projects.ts` -- `ProjectCard` type definition and `projectCards` array (8 projects) with `projectFilters` array (6 filter options)
  - Project data includes: `id`, `title`, `summary`, `tags` (with CSS classes), `filters`, `dataTags`, `image`, `route` or `link`, `cta`, `accent`, `buttonClass`
- **Depends on:** Nothing
- **Used by:** `src/sections/Projects.tsx`, `src/components/ProjectCard.tsx`

### 8. Library Layer

- **Purpose:** Shared animation presets and utilities
- **Location:** `src/lib/`
- **Contains:**
  - `animations.ts` -- Reusable `motion/react` `Variants` objects: `fadeInUp`, `fadeInLeft`, `staggerContainer`, `staggerContainerSlow`, `cardVariant`, `lineReveal`, `defaultViewport`
- **Depends on:** `motion/react` (types only)
- **Used by:** `src/sections/Experience.tsx`, `src/pages/ArchitectShowcase.tsx`

### 9. Style Layer

- **Purpose:** Global styles, design system, CSS animations
- **Location:** `src/index.css`, `tailwind.config.js`
- **Contains:**
  - CSS custom properties for dark and light themes (`:root` and `html[data-theme="light"]`)
  - Swiss-style component classes: `.swiss-btn-primary`, `.swiss-btn-secondary`, `.swiss-card`, `.tech-tag`, `.filter-btn`, `.swiss-section`, `.swiss-container`, `.swiss-heading-*`, `.swiss-body`, `.swiss-eyebrow`
  - Form styling: `.fs-form`, `.fs-field`, `.fs-input`, `.fs-textarea`, `.fs-button`
  - Project detail styles: `.project-detail-content` (auto-styles h2, h3, p, ul, li, strong, a)
  - Header layout: `.header-inner`, `.header-desktop`, `.header-mobile` with 768px breakpoint
  - Media grid and lightbox styles
  - CSS animations: `fadeInUp`, `marquee`, `marquee-reverse`, `glow-pulse`
  - `prefers-reduced-motion` media query disabling animations
  - Custom scrollbar styling
- **Depends on:** Tailwind CSS base/components/utilities directives
- **Used by:** All components via Tailwind utility classes and custom CSS classes

## Data Flow

### 1. Page Navigation Flow

1. User clicks a navigation link or enters a URL
2. `BrowserRouter` matches the path to a `<Route>`
3. `Layout` component renders with the matched child via `<Outlet />`
4. Layout's `useEffect` hooks fire:
   - Scrolls to top (or to hash target)
   - Re-attaches IntersectionObserver for `.fade-in-up` elements
   - Re-attaches smooth-scroll click handler
5. Matched page component renders and mounts

### 2. Project Filter Flow

1. User clicks a filter button in `Projects` section
2. `setActiveFilter` updates local state
3. `useMemo` recomputes `filteredProjects` by matching `project.filters` against active filter
4. `AnimatePresence` with `mode="popLayout"` animates card exits and entries
5. Each `ProjectCard` renders with scale/opacity entrance animation

### 3. Theme Toggle Flow

1. On page load, inline `<script>` in `index.html` sets `data-theme="dark"` (prevents flash)
2. `ThemeToggle` component reads current theme from DOM attribute, then localStorage, then system preference
3. User clicks toggle: `setTheme` updates React state, `useEffect` calls `applyTheme` which sets `data-theme` attribute
4. Theme persists to `localStorage` as `"theme"` key
5. CSS custom properties in `src/index.css` respond to `html[data-theme="light"]` selector, re-theming all UI

### 4. Contact Form Flow

1. User fills out form fields in `Contact` section
2. Form submits via standard POST to `https://formspree.io/f/xvgrpazj`
3. `target="_top"` ensures full-page redirect to Formspree's confirmation page
4. No client-side form handling or validation beyond HTML `required` attributes

### 5. Prerender SEO Flow (Build Time)

1. `npm run build` runs `tsc -b && vite build && node scripts/prerender.mjs`
2. `prerender.mjs` reads the built `dist/index.html` as a template
3. For each route in its `routes` array, it injects per-page title, description, canonical URL, OG/Twitter meta tags
4. Writes the modified HTML to `dist/{route}/index.html`
5. Also creates `dist/404.html` as GitHub Pages SPA fallback

**State management:** React hooks only (`useState`, `useEffect`, `useRef`, `useMemo`). No external state library (Redux, Zustand, etc.). State is local to each component -- no shared global state.

## Key Abstractions

### ProjectShell

- **Purpose:** Consistent wrapper for all project detail pages
- **Example paths:** `src/components/ProjectShell.tsx`, used by `src/pages/projects/ProjectLikeTik.tsx`, `src/pages/projects/ProjectExambyte.tsx`, etc.
- **Pattern:** Compound layout component accepting `title`, `subtitle`, `heroImage`, `heroAlt`, `children`, optional `ctaLabel`/`ctaLink`, and `hasSiteHeader` boolean. Provides animated hero image, back button (fixed position), content container, and optional CTA button. Children are rendered inside `.project-detail-content` which applies auto-styling to h2/h3/p/ul/li elements via CSS.

### SectionHeading

- **Purpose:** Consistent section header with eyebrow label, title, and optional subtitle
- **Example paths:** `src/components/SectionHeading.tsx`, used in `src/sections/About.tsx`, `src/sections/Projects.tsx`, `src/sections/Skills.tsx`, `src/sections/Contact.tsx`, `src/pages/ArchitectShowcase.tsx`
- **Pattern:** Accepts `eyebrow`, `title`, `subtitle`, `align` ("left" | "center"), `className`. Uses `whileInView` animation with staggered children.

### ProjectCard

- **Purpose:** Display a single project in the filterable grid
- **Example paths:** `src/components/ProjectCard.tsx`, used by `src/sections/Projects.tsx`
- **Pattern:** Reads from `ProjectCard` type. Conditionally renders `<Link>` for internal routes or `<a>` for external links. Wraps content in `motion.div` with hover elevation effect.

### Animation Presets

- **Purpose:** Reusable motion variants to ensure consistent animation behavior
- **Example paths:** `src/lib/animations.ts`
- **Pattern:** Exported `Variants` objects (`fadeInUp`, `fadeInLeft`, `staggerContainer`, `cardVariant`, `lineReveal`) and a `defaultViewport` config. Components import and spread these as `variants`, `initial`, `whileInView` props.

### Design System CSS Classes

- **Purpose:** Swiss-style design system as CSS classes using custom properties
- **Example paths:** `src/index.css`
- **Pattern:** `.swiss-*` prefix for layout/typography/button classes. `.tech-tag-*` for colored technology tags. `.fs-*` for form elements. `.project-detail-content` for auto-styling project page prose. All colors reference CSS custom properties that respond to `data-theme`.

## Entry Points

### Browser Entry

- **Location:** `index.html` -> `src/main.tsx`
- **Triggers:** Browser page load
- **Responsibilities:** Mount React app to `#root`, wrap in `StrictMode`, import global CSS

### Build Entry

- **Location:** `vite.config.ts`
- **Triggers:** `npm run build`
- **Responsibilities:** Configure Vite with React plugin, set base path from env var

### Prerender Entry

- **Location:** `scripts/prerender.mjs`
- **Triggers:** Runs automatically after `vite build` via `npm run build` script
- **Responsibilities:** Generate per-route static HTML with correct SEO meta tags, create 404 fallback

### CI/CD Entry

- **Location:** `.github/workflows/deploy.yml`
- **Triggers:** Push to `main` branch or manual `workflow_dispatch`
- **Responsibilities:** Install deps, build, upload artifact, deploy to GitHub Pages

## Error Handling

### Strategy

Minimal error handling appropriate for a static portfolio site. No error boundaries, no API error states, no retry logic.

### Patterns

- **404 page:** `NotFound.tsx` renders a styled 404 page with links back to home and projects. Catch-all `*` route in `App.tsx` directs unmatched paths here.
- **GitHub Pages 404 fallback:** `prerender.mjs` generates `dist/404.html` so GitHub Pages serves the SPA shell for any unrecognized URL; React Router then handles routing client-side.
- **Form submission:** Contact form uses Formspree with standard HTML `required` validation. No client-side error handling for submission failures.
- **Image loading:** All non-hero images use `loading="lazy"`. Hero profile image uses `loading="eager"`. No error fallbacks for broken images.
- **IntersectionObserver fallback:** `Layout.tsx` checks `typeof IntersectionObserver === "undefined"` and applies `.visible` class immediately if unavailable.
- **Web Share API fallback:** `Visitenkarte.tsx` checks `navigator.canShare` before attempting share; falls back to blob download if unavailable.

## Cross-Cutting Concerns

### Scroll Management

- `Layout.tsx` scrolls to top on every route change (unless hash anchor present)
- Custom easeInOutCubic smooth scroll for hash anchors (700ms duration)
- Delegated click handler on `document` catches all `a[href^="#"]` and `a[href^="/#"]` links
- Header offset calculation uses actual header element height (fallback 64px)

### Animation System

Two parallel animation systems:

1. **CSS-based:** `.fade-in-up` class with `IntersectionObserver` in `Layout.tsx` -- adds `.visible` class on intersection, triggering `@keyframes fadeInUp`. Marquee animations via CSS `@keyframes`. `prefers-reduced-motion` disables all CSS animations.

2. **motion/react-based:** Component-level entrance animations (`initial`/`animate`/`whileInView`), layout animations (`layoutId` for active indicators), `AnimatePresence` for mount/unmount transitions, `whileHover` for interaction feedback. Shared presets in `src/lib/animations.ts`.

### Theme System

- Default theme: `"dark"` (set by inline script in `index.html` before React hydrates)
- Toggle: `ThemeToggle.tsx` reads from DOM > localStorage > system preference
- Persistence: `localStorage.setItem("theme", next)`
- Mechanism: `data-theme` attribute on `<html>` element
- Response: CSS custom properties in `src/index.css` (`:root` for dark, `html[data-theme="light"]` for light overrides)
- Tailwind integration: Semantic color tokens (`fg`, `canvas`, `surface`, `border`, `muted`, `faint`) map to CSS variables in `tailwind.config.js`

### SEO

- Structured data (JSON-LD) in `index.html` for Person and WebSite schemas
- Open Graph and Twitter Card meta tags in `index.html`
- Post-build prerendering (`scripts/prerender.mjs`) injects per-route meta for social scrapers
- `public/sitemap.xml` and `public/robots.txt` for search engine crawling
- `public/CNAME` for custom domain configuration
- Visitenkarte page dynamically injects `<meta name="robots" content="noindex, nofollow">` via useEffect

### Accessibility

- ARIA attributes on interactive elements: `aria-label`, `aria-expanded`, `aria-controls`, `aria-current`, `aria-modal`, `aria-pressed`, `role="dialog"`
- Keyboard focus trap in mobile menu (`Header.tsx`): Tab/Shift+Tab cycling, Escape to close
- Minimum 44x44px touch targets enforced via `min-h-[44px] min-w-[44px]` classes
- Semantic HTML: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<address>`
- `aria-hidden="true"` on decorative SVGs and visual elements
- Focus-visible outlines on interactive elements

### Responsive Design

- Mobile-first approach with Tailwind breakpoints: `md:` (768px), `lg:` (1024px), `sm:` (640px)
- Header switches between `.header-desktop` (md+) and `.header-mobile` (below md) via CSS
- Content containers use responsive padding: `px-6 sm:px-10`
- Grid layouts collapse: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Typography uses `clamp()` for fluid sizing in headings
- Skills section tables switch to card layout on mobile (`hidden md:block` / `md:hidden`)
