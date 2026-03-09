# CONCERNS.md

> Generated: 2026-03-09
> Focus: Technical debt, bugs, security, performance, accessibility, and testing gaps

---

## Tech Debt

### No Code Splitting / Lazy Loading

- **Area:** Bundle size & initial load
- **Issue:** All route components are eagerly imported in `src/App.tsx`. Every page (Home, all 7 project pages, Showcase, Visitenkarte, legal pages, NotFound) is bundled into a single chunk. The `src/pages/projects/ProjectMaxsimCli.tsx` (794 lines), `src/sections/Skills.tsx` (580 lines), `src/pages/projects/ProjectCcTemplates.tsx` (387 lines), and `src/pages/projects/ProjectHeistLine.tsx` (383 lines) are all loaded regardless of which route the user visits.
- **Files:** `src/App.tsx`, all files in `src/pages/`, `src/sections/`
- **Impact:** Larger initial JavaScript bundle than necessary. Users visiting only the homepage download code for all project detail pages, the Showcase, and Visitenkarte. This is particularly relevant on mobile connections.
- **Fix approach:** Use `React.lazy()` with `<Suspense>` for route-level code splitting. Wrap each `<Route>` element in a lazy-loaded component. Keep only `Home` eagerly imported since it is the landing page.

### No React Error Boundary

- **Area:** Runtime error resilience
- **Issue:** Zero Error Boundary components exist in the codebase. If any component throws during rendering (e.g., a missing image path, undefined property access, or a Motion animation error), the entire application crashes with a white screen. No grep matches for `ErrorBoundary`, `componentDidCatch`, or any error boundary pattern.
- **Files:** `src/main.tsx`, `src/App.tsx`, `src/components/Layout.tsx`
- **Impact:** A single rendering error anywhere in the component tree crashes the entire SPA. Users see a blank page with no recovery path.
- **Fix approach:** Add a root-level `<ErrorBoundary>` wrapping `<Routes>` in `src/App.tsx`. Optionally add a second boundary around `<Outlet>` in `src/Layout.tsx` to isolate page-level errors from the header/footer. Display a user-friendly fallback UI in German.

### Unused Font Awesome CDN Load

- **Area:** Performance / dead code
- **Issue:** `index.html` loads the Font Awesome 6.4.0 CSS from `cdnjs.cloudflare.com` (line 47-51), but zero Font Awesome class references (`fa-*`, `fas`, `far`, etc.) exist anywhere in `src/`. All icons use either inline SVGs, Lucide React icons, or custom SVG paths.
- **Files:** `index.html` (line 47-51)
- **Impact:** Unnecessary ~70KB CSS download (plus WOFF2 font files on first use) that blocks rendering. Adds a third-party CDN dependency for zero benefit.
- **Fix approach:** Remove the Font Awesome `<link>` tag from `index.html`.

### Hardcoded Dark-Mode Colors in JSX

- **Area:** Theming consistency
- **Issue:** Multiple components use hardcoded dark-mode color values in inline `style` attributes instead of CSS variables. When light mode is active, these hardcoded values may produce low-contrast or invisible elements.
- **Files:**
  - `src/sections/Hero.tsx` -- hardcoded `rgba(39,39,42,*)` for grid lines, `rgba(59,130,246,0.05)` for radial gradient
  - `src/components/Header.tsx` -- hardcoded `rgba(9,9,11,0.92)` and `rgba(39,39,42,0.8)` for background/border
  - `src/pages/NotFound.tsx` -- hardcoded `#3B82F6`/`#60A5FA`/`#93C5FD` for 404 gradient text
  - `src/pages/projects/ProjectMaxsimCli.tsx` -- extensive hardcoded color values throughout (`rgba(59,130,246,0.05)`, `#86efac`, `#ef4444`, `#22c55e`)
  - `src/pages/projects/ProjectCcTemplates.tsx` -- hardcoded `#86efac` for terminal text
  - `src/sections/Skills.tsx` -- hardcoded `text-zinc-400`, `text-zinc-500` classes
- **Impact:** Light mode may have invisible or poorly contrasted elements in Hero grid, Header backdrop, and terminal blocks on project pages. The `--sw-*` CSS variable system exists specifically for this but is bypassed in inline styles.
- **Fix approach:** Replace hardcoded color values with CSS variables (`var(--sw-*)` or `var(--grid-line-v)`, etc.). The Hero grid already has `--grid-line-v` and `--grid-line-h` variables defined in `src/index.css` but `src/sections/Hero.tsx` does not use them.

### Duplicated Smooth-Scroll Logic in Layout.tsx

- **Area:** Code duplication
- **Issue:** `src/components/Layout.tsx` contains the `easeInOutCubic` function and scroll-animation logic duplicated in two separate `useEffect` hooks (lines 46-60 for click-based scrolling and lines 91-112 for hash-based navigation scrolling). Both implement the same cubic easing and `requestAnimationFrame` loop.
- **Files:** `src/components/Layout.tsx` (lines 46-112)
- **Impact:** Maintenance burden. Any change to scroll behavior must be made in two places.
- **Fix approach:** Extract a shared `smoothScrollTo(target, duration)` utility and reuse it in both effects.

### Layout.tsx Documentation Drift

- **Area:** Documentation accuracy
- **Issue:** The CLAUDE.md files reference `projectPaths` (Set) and `specialDetailPages` (Set) in `Layout.tsx` that control header/footer visibility. These do not exist in the current `src/components/Layout.tsx`. The `Layout` component unconditionally renders `<Header>` and `<Footer>` for all routes. The feature described in documentation has either been removed or was never implemented in the current version.
- **Files:** `src/components/Layout.tsx`, `CLAUDE.md` (root and project-level)
- **Impact:** The documentation is misleading for any developer (human or AI) reading it. Immersive project pages (liketik, exambyte) currently show both header and footer, contradicting the documented behavior.
- **Fix approach:** Either re-implement the `specialDetailPages`/`projectPaths` route-filtering logic described in documentation, or update CLAUDE.md to reflect the current always-show behavior.

### Theme Inline Script Hardcodes Dark Only

- **Area:** Theme persistence
- **Issue:** The inline `<script>` in `index.html` (line 36) always sets `data-theme="dark"` unconditionally. It does not check `localStorage` for a previously saved theme preference. While `ThemeToggle.tsx` reads from localStorage on mount, the inline script runs before React hydrates, meaning users who previously selected light mode see a dark-mode flash before React overrides it.
- **Files:** `index.html` (line 36), `src/components/ThemeToggle.tsx`
- **Impact:** Flash of dark mode for users who selected light mode. The `ThemeToggle` component has proper localStorage reading logic (`getInitialTheme`), but the inline script bypasses it.
- **Fix approach:** Update the inline script to read from localStorage first: `document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "dark")`.

### ThemeToggle Component Exists but is Not Used

- **Area:** Dead code / missing feature
- **Issue:** `src/components/ThemeToggle.tsx` is a fully implemented component but is not imported or rendered anywhere in the application. It is not in the `Header`, not in the `Layout`, and not on any page.
- **Files:** `src/components/ThemeToggle.tsx`, `src/components/Header.tsx`
- **Impact:** The light mode theme (fully defined in CSS variables at `src/index.css` lines 120-189) is inaccessible to users. The theme toggle functionality is complete but unreachable.
- **Fix approach:** Import and render `<ThemeToggle />` in the `Header` component (desktop nav area and mobile menu).

### Placeholder Images for Two Projects

- **Area:** Content completeness
- **Issue:** Two project cards use `placehold.co` external placeholder images instead of actual project screenshots.
- **Files:** `src/data/projects.ts`
  - Line 113: `"https://placehold.co/600x400/FFD21E/000000?text=Hugging+Face+Profil"` for the Hugging Face project
  - Line 170: `"https://placehold.co/600x400/e5a935/1a202c?text=Exambyte+Testsystem"` for the Exambyte project
  - `src/pages/projects/ProjectExambyte.tsx` line 8: `"https://placehold.co/900x500/e5a935/1a202c?text=Exambyte+Dashboard+Mockup"` for the hero image
- **Impact:** Unprofessional appearance. External dependency on `placehold.co` -- images will fail if the service is down. These are also not preloaded or cached by service workers.
- **Fix approach:** Create or obtain actual screenshots/mockups for Hugging Face and Exambyte projects. Store them in `public/assets/projects/`.

### Prerender Script Does Not Cover All Routes

- **Area:** SEO completeness
- **Issue:** `scripts/prerender.mjs` generates static HTML with correct meta tags for 10 routes, but two routes are missing: `/visitenkarte` and `/showcase`. These routes fall back to the generic `404.html` (which is just the un-modified `index.html` template), meaning social scrapers see the homepage meta tags instead of page-specific ones.
- **Files:** `scripts/prerender.mjs` (lines 25-93)
- **Impact:** Sharing `/showcase` or `/visitenkarte` on LinkedIn/Slack/WhatsApp shows the generic homepage title/description/image. However, `/visitenkarte` intentionally sets `noindex, nofollow` via JavaScript (line 12-18 of `src/pages/Visitenkarte.tsx`), so prerendering it for SEO is debatable. `/showcase` should have its own meta tags.
- **Fix approach:** Add `/showcase` to the `routes` array in `scripts/prerender.mjs` with appropriate title, description, and image. Optionally add `/visitenkarte` with noindex meta if the prerender path should also signal crawlers.

---

## Known Bugs

### Discord Link is Placeholder

- **Symptoms:** The "Discord beitreten" button on the HeistLine project page links to `https://discord.gg/` (the base URL with no invite code).
- **Files:** `src/pages/projects/ProjectHeistLine.tsx` (line 269)
- **Trigger:** User clicks the Discord button on `/projekte/heistline`.
- **Workaround:** None. The link leads to Discord's generic landing page, not a specific server.

### NotFound Page Links to Wrong Hash

- **Symptoms:** The "Projekte ansehen" button on the 404 page links to `/#projekte` (line 154), but the projects section ID is `#projects` (in `src/sections/Projects.tsx` line 20).
- **Files:** `src/pages/NotFound.tsx` (line 154)
- **Trigger:** Visit any non-existent route and click "Projekte ansehen."
- **Workaround:** The link navigates to the home page but does not scroll to the projects section.

### Wallet Button References Missing Asset

- **Symptoms:** The "Wallet" button on `/visitenkarte` attempts to download `/assets/sven_maibaum.pkpass`, but there is no indication this file exists in the `public/assets/` directory.
- **Files:** `src/pages/Visitenkarte.tsx` (line 77-82)
- **Trigger:** User clicks the Wallet button on the business card page.
- **Workaround:** The download silently fails or returns a 404.

### VCard PHOTO URL May Not Resolve

- **Symptoms:** The vCard data generated in `src/pages/Visitenkarte.tsx` (line 43) references `https://sven-maibaum.com/assets/images/sven_maibaum_profile.webp` without the `/sven-maibaum-portfolio/` base path used in production.
- **Files:** `src/pages/Visitenkarte.tsx` (line 43)
- **Trigger:** User saves the vCard. Contact apps attempt to load the profile photo from the wrong URL.
- **Workaround:** None. The photo URL in the vCard is a static string, not dynamically constructed from `import.meta.env.BASE_URL`.

---

## Security Considerations

### Contact Form Lacks Client-Side Feedback

- **Risk:** Low
- **Files:** `src/sections/Contact.tsx` (lines 76-131)
- **Current mitigation:** The form submits directly to Formspree (`https://formspree.io/f/xvgrpazj`) via POST. Formspree handles CSRF protection, spam filtering, and rate limiting on its end. The form uses `method="POST"` and `target="_top"`, which navigates away from the SPA.
- **Recommendations:** Add client-side submission handling (via `fetch` or Formspree's React integration) to show success/error states without navigating away. Add a honeypot field for additional spam protection.

### No Content Security Policy

- **Risk:** Low (static portfolio site)
- **Files:** `index.html`
- **Current mitigation:** None. The site loads resources from `fonts.googleapis.com`, `fonts.gstatic.com`, `cdnjs.cloudflare.com`, `store.steampowered.com` (iframes), and `placehold.co` (images).
- **Recommendations:** Add a `<meta http-equiv="Content-Security-Policy">` tag or configure CSP via hosting headers. Restrict `script-src`, `style-src`, `img-src`, and `frame-src` to known domains.

### External Links Missing `noreferrer` on Some Elements

- **Risk:** Very low
- **Files:**
  - `src/pages/projects/ProjectHeistLine.tsx` line 264: uses `rel="noopener"` but omits `noreferrer`
  - `src/pages/projects/ProjectHeistLine.tsx` line 271: same
  - `src/pages/projects/ProjectMrDork3.tsx` line 108: same
- **Current mitigation:** Modern browsers already isolate `target="_blank"` windows by default. The risk is minimal.
- **Recommendations:** Standardize on `rel="noopener noreferrer"` for all external links.

### `.env.production` File Exists

- **Risk:** Unknown (not read per forbidden files policy)
- **Files:** `.env.production`
- **Current mitigation:** The existence of this file is noted. Per policy, its contents are not read.
- **Recommendations:** Verify the `.env.production` file does not contain secrets and is appropriate for git tracking. Consider adding it to `.gitignore` if it contains any sensitive configuration.

---

## Performance Bottlenecks

### Hero Section Renders 58 Animated Grid Lines

- **Problem:** The Hero component creates 40 vertical and 18 horizontal `<motion.div>` elements for the background grid, each with individual staggered animations.
- **Files:** `src/sections/Hero.tsx` (lines 15-35)
- **Cause:** 58 separate Motion components with unique `transition.delay` values. Each registers its own animation observer. On lower-end devices, this produces a noticeable frame drop during the initial page load animation.
- **Improvement path:** Replace with a single CSS background using `background-image: repeating-linear-gradient(...)` or a single `<canvas>` element. If animation is essential, animate a single overlay opacity instead of 58 individual elements.

### Large Component Files Without Splitting

- **Problem:** Several component files are very large single-file components with multiple sub-components.
- **Files:**
  - `src/pages/projects/ProjectMaxsimCli.tsx` -- 794 lines
  - `src/sections/Skills.tsx` -- 580 lines
  - `src/pages/projects/ProjectCcTemplates.tsx` -- 387 lines
  - `src/pages/projects/ProjectHeistLine.tsx` -- 383 lines
  - `src/pages/ArchitectShowcase.tsx` -- 287 lines
- **Cause:** Sub-components (e.g., `Terminal`, `TLine`, `TComment`, `FadeIn`, `Hero`, `StatsBar` in ProjectMaxsimCli; `Webentwicklung`, `Spieleentwicklung`, `SoftwareEngineering`, `DevOps`, `KIArchitektur`, `MarqueeRow` in Skills) are defined inline rather than extracted to separate files.
- **Improvement path:** Extract reusable sub-components into `src/components/` where they have potential for reuse, or into co-located files for page-specific sub-components.

### Marquee Uses 8 Copies of Item Arrays

- **Problem:** The tech-stack marquee in `src/sections/Skills.tsx` creates 8 copies of each row's items (96 items per row, 192 total DOM elements) to ensure the wrap point is always off-screen.
- **Files:** `src/sections/Skills.tsx` (lines 448-450)
- **Cause:** The `COPIES = 8` constant was introduced to push the wrap seam far off-screen, but 8x is excessive for most viewport widths.
- **Improvement path:** Reduce to 3-4 copies or dynamically calculate the needed copies based on viewport width. Alternatively, use CSS animations with a single duplication (the `ArchitectShowcase.tsx` marquee at lines 188-201 uses only 2 copies with CSS animation).

### Project Images Not Optimized

- **Problem:** Project images load as full-resolution PNGs and JPGs without responsive `srcset` or size hints.
- **Files:** `src/components/ProjectCard.tsx` (line 14), `src/components/ProjectShell.tsx` (line 44), `src/pages/projects/ProjectHeistLine.tsx` (gallery images)
- **Cause:** Images use a simple `<img src=... loading="lazy">` without `width`/`height` attributes or `srcset`. The HeistLine gallery loads 28 full-resolution PNGs.
- **Improvement path:** Add explicit `width` and `height` attributes to prevent CLS (Cumulative Layout Shift). Convert PNGs to WebP. Provide multiple sizes via `srcset` for responsive loading.

---

## Fragile Areas

### Layout.tsx Scroll Effects

- **Files:** `src/components/Layout.tsx`
- **Why fragile:** Four separate `useEffect` hooks manage scroll behavior, IntersectionObserver for fade-in animations, click-based smooth scroll, and hash-based smooth scroll. All depend on `location.pathname` and query the DOM directly. Changes to section IDs, header height, or scroll behavior in any component can break the scroll offset calculations.
- **Safe modification:** Do not change section `id` attributes without updating the header nav links in `src/components/Header.tsx` and the footer links in `src/components/Footer.tsx`.
- **Test coverage gaps:** No automated tests. Manual testing required for: scroll-to-section from header nav, scroll-to-section from footer links, smooth scroll from another page (e.g., `/projekte/heistline` back to `/#projects`), hash-based navigation on page load.

### Header.tsx Active-Section Tracking

- **Files:** `src/components/Header.tsx` (lines 40-59, 92-98)
- **Why fragile:** The `isActiveLink` function checks `activeSection` state (tracked via IntersectionObserver) combined with route-path matching. The section IDs list at line 42 (`["home", "about", "philosophy", "skills", "projects", "contact"]`) is hardcoded and must stay in sync with section `id` attributes in `src/sections/*.tsx` and the `navLinks` array at lines 9-16.
- **Safe modification:** When adding/removing a section, update all three locations: the `ids` array (line 42), the `navLinks` function (lines 9-16), and the actual section component's `id` attribute.
- **Test coverage gaps:** No tests for active-section highlighting behavior.

### Prerender Script Uses Regex String Replacement

- **Files:** `scripts/prerender.mjs` (lines 99-154)
- **Why fragile:** The `injectMeta` function replaces meta tag content using regex patterns that match specific attribute ordering (e.g., `<meta\s+name="description"\s+content="`). If the HTML formatter or Vite build changes the attribute order, the regex will silently fail to match, leaving the default homepage meta tags in place.
- **Safe modification:** Do not rearrange HTML meta tag attributes in `index.html`. Test prerendered output after any `index.html` changes.
- **Test coverage gaps:** No automated verification that prerendered files have correct meta tags.

---

## Scaling Limits

### Single CSS File for All Styles

- **Current capacity:** All custom CSS (877 lines) lives in `src/index.css`. This is manageable for the current ~35-file project.
- **Limit:** As new sections, components, and project pages are added, this file will become difficult to navigate. Design system tokens, component styles, animation keyframes, and utility classes are intermixed.
- **Scaling path:** Extract styles into dedicated files per concern (e.g., `variables.css`, `components.css`, `animations.css`) and import them in `index.css`. Alternatively, migrate component-specific styles to CSS modules or Tailwind's `@apply` in component-scoped stylesheets.

### Static Project Data

- **Current capacity:** 8 projects in `src/data/projects.ts`, each manually maintained.
- **Limit:** Adding new projects requires changes in 4-6 files (data, page component, route, prerender script, optionally Layout paths). There is no content management system or dynamic content loading.
- **Scaling path:** For 20+ projects, consider a markdown/MDX-based system or a lightweight CMS. For now, the process is documented in CLAUDE.md and manageable.

---

## Dependencies at Risk

### Font Loading from External CDNs

- **Risk:** Runtime dependency on `fonts.googleapis.com`, `fonts.gstatic.com`, and `cdnjs.cloudflare.com`. If any CDN is down or blocked (some corporate networks block Google/Cloudflare CDNs), fonts and the unused Font Awesome CSS will fail to load.
- **Impact:** Degraded typography. The `font-display: swap` in the Google Fonts URL prevents render-blocking, but the fallback to system fonts changes the visual design.
- **Migration plan:** Self-host the Geist and Geist Mono font files. Download WOFF2 files to `public/fonts/` and reference them with `@font-face` in `src/index.css`. Remove the Google Fonts and Font Awesome CDN links from `index.html`.

### Tailwind CSS v3 (Not v4)

- **Risk:** Tailwind CSS v3 is in maintenance mode since Tailwind CSS v4 released. The project uses `tailwindcss@^3.4.17`.
- **Impact:** No immediate risk; v3 continues to receive patches. However, ecosystem tooling (IDE extensions, documentation) will increasingly focus on v4.
- **Migration plan:** No urgent need to migrate. When migrating, the primary changes are configuration format (CSS-based config in v4) and potential utility class changes. The custom CSS variable system in `src/index.css` should ease the transition.

---

## Missing Critical Features

### No Automated Testing

- **Problem:** Zero test files exist in the project. No test framework is configured (`package.json` has no test-related dependencies or scripts). Per project constraints, do not add a test framework without explicit request.
- **What it blocks:** Confident refactoring, CI/CD quality gates, regression detection. Every change must be manually verified.

### No Service Worker / Offline Support

- **Problem:** No service worker or PWA manifest. The site has no offline capability.
- **What it blocks:** Not critical for a portfolio site, but relevant for the `/visitenkarte` business card page which would benefit from offline access.

### Reduced Motion Only Partially Respected

- **Problem:** `src/index.css` (lines 873-877) includes a `@media (prefers-reduced-motion: reduce)` rule that disables CSS animations and transitions for `.media-item`, `.lightbox__*`, and `.fade-in-up`. However, all `motion/react` (Framer Motion) JavaScript animations throughout the app are unaffected by this media query. Every section uses `motion.div` with `initial`/`animate`/`whileInView` props that still animate even when the user requests reduced motion.
- **What it blocks:** Full WCAG 2.1 compliance for motion-sensitive users.
- **Files:** `src/sections/Hero.tsx`, `src/sections/About.tsx`, `src/sections/Philosophy.tsx`, `src/sections/Experience.tsx`, `src/sections/Projects.tsx`, `src/sections/Skills.tsx`, `src/sections/Contact.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/FlipWords.tsx`, `src/components/ProjectShell.tsx`, `src/components/SectionHeading.tsx`
- **Fix approach:** Use Motion for React's `useReducedMotion()` hook to conditionally disable animations. Alternatively, configure the global `MotionConfig` component with `reducedMotion="user"` at the app root.

---

## Test Coverage Gaps

### Entire Application is Untested

- **What is untested:** Everything. No unit tests, integration tests, or E2E tests exist.
- **Files:** All files in `src/`
- **Risk:** High for refactoring (no regression detection), low for current stability (the app is a static portfolio with no complex business logic, API calls, or state management).
- **Priority:** Medium. The most valuable tests would be:
  1. Smoke test: Verify each route renders without throwing
  2. Prerender script: Verify output files have correct meta tags
  3. Navigation: Verify header nav links point to correct section IDs
  4. Contact form: Verify form submission works (E2E)
  5. Theme toggle: Verify localStorage persistence and CSS variable switching

---

## Accessibility Gaps

### Skip-to-Content Link Missing

- **Problem:** No skip navigation link exists for keyboard users to bypass the header and jump directly to `<main>` content.
- **Files:** `src/components/Layout.tsx`, `src/components/Header.tsx`
- **Impact:** Keyboard users must tab through all header navigation links before reaching page content.
- **Fix approach:** Add a visually-hidden skip link as the first focusable element: `<a href="#main-content" class="sr-only focus:not-sr-only">Zum Inhalt springen</a>`. Add `id="main-content"` to the `<main>` element in Layout.

### FlipWords Animation Lacks Live Region

- **Problem:** The `FlipWords` component in the Hero section cycles through text ("Software-Architektur", "Spieleentwicklung", etc.) every 2.5 seconds. Screen readers do not announce these changes because no `aria-live` region is used.
- **Files:** `src/components/FlipWords.tsx`, `src/sections/Hero.tsx`
- **Impact:** Screen reader users miss the rotating subtitle content. They only hear the first word.
- **Fix approach:** Add `aria-live="polite"` to the wrapper span, or provide a static `aria-label` on the parent that lists all words.

### Lightbox Navigation Buttons Below 44px

- **Problem:** The lightbox close button and prev/next navigation buttons in `src/index.css` (lines 789-805) are styled as `height: 2.5rem; width: 2.5rem;` (40x40px), which is below the project's stated minimum of 44x44px touch targets.
- **Files:** `src/index.css` (lines 789-805), `src/pages/projects/ProjectHeistLine.tsx`
- **Impact:** Difficult to tap on mobile devices in the lightbox view.
- **Fix approach:** Increase `.lightbox__close` and `.lightbox__nav` dimensions to `min-width: 44px; min-height: 44px`.

### HeistLine Gallery Items Lack ARIA Role

- **Problem:** Gallery `<figure>` elements in HeistLine use `tabIndex={0}` and `onClick`/`onKeyDown` for interactive behavior but do not have `role="button"` to communicate their interactive nature to assistive technology.
- **Files:** `src/pages/projects/ProjectHeistLine.tsx` (lines 222-240)
- **Impact:** Screen readers announce these as generic elements rather than actionable buttons.
- **Fix approach:** Add `role="button"` and `aria-label="Bild vergrößern: {image.alt}"` to each gallery `<figure>`.

### Tab Buttons in Skills and Projects Lack Accessible Roles

- **Problem:** The skill tab buttons in `src/sections/Skills.tsx` (lines 509-531) do not use `role="tablist"` / `role="tab"` / `role="tabpanel"` ARIA patterns. Similarly, the project filter buttons in `src/sections/Projects.tsx` use `aria-pressed` (toggle button pattern) rather than the tab pattern, which is semantically correct but may benefit from `role="tablist"` for the container.
- **Files:** `src/sections/Skills.tsx`, `src/sections/Projects.tsx`
- **Impact:** Screen reader users do not get proper tab-panel navigation cues (e.g., "tab 1 of 5").
- **Fix approach:** Add `role="tablist"` to the tab container, `role="tab"` and `aria-selected` to each tab button, and `role="tabpanel"` to the content area. Add `aria-controls` and `id` attributes to link tabs with their panels.

---

## Browser Compatibility Issues

### `backgroundClip: "text"` Without Fallback

- **Problem:** The NotFound page (lines 78-79) and ProjectMaxsimCli Hero (lines 208-211) use `backgroundClip: "text"` with `WebkitBackgroundClip: "text"` and `-webkit-text-fill-color: transparent` for gradient text. While broadly supported, the non-prefixed `background-clip: text` requires explicit browser support. A fallback solid color is not provided.
- **Files:** `src/pages/NotFound.tsx`, `src/pages/projects/ProjectMaxsimCli.tsx`
- **Impact:** In browsers that do not support `background-clip: text`, the text becomes invisible (transparent fill with no clipping fallback). This affects less than 1% of users but the failure mode is total text invisibility.
- **Fix approach:** Add a `color` fallback before the gradient properties so text remains visible if gradient clipping fails.

### `navigator.share` / `navigator.canShare` for VCard

- **Problem:** The Visitenkarte page uses the Web Share API (`navigator.canShare`, `navigator.share`) to share vCard files. This API is not available on desktop Firefox or older browsers.
- **Files:** `src/pages/Visitenkarte.tsx` (lines 49-60)
- **Impact:** The code handles this gracefully with a try/catch fallback to a download link. No bug, but the primary sharing path is only available on mobile Safari and Chrome.
- **Fix approach:** No action needed. The fallback is already implemented.
