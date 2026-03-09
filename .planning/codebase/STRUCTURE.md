# Structure

> Generated: 2026-03-09 | Focus: arch

## Directory Layout

```
sven-maibaum-new/
+-- .github/
|   +-- workflows/
|       +-- deploy.yml              # GitHub Pages deployment
+-- .planning/                      # MAXSIM planning artifacts
|   +-- codebase/                   # Generated codebase analysis
+-- dist/                           # Build output (generated, gitignored)
+-- node_modules/                   # Dependencies (gitignored)
+-- public/                         # Static assets served as-is
|   +-- assets/                     # Images, project screenshots, favicon
|   +-- CNAME                       # Custom domain: sven-maibaum.com
|   +-- robots.txt                  # Search engine directives
|   +-- sitemap.xml                 # Site map for crawlers
|   +-- vite.svg                    # Vite default favicon
+-- scripts/
|   +-- prerender.mjs               # Post-build SEO prerendering
+-- src/
|   +-- assets/                     # Importable assets (currently empty)
|   +-- components/                 # Reusable UI components
|   |   +-- FlipWords.tsx           # Animated word rotator
|   |   +-- Footer.tsx              # Site footer
|   |   +-- Header.tsx              # Fixed navigation header
|   |   +-- Layout.tsx              # Route layout wrapper
|   |   +-- ProjectCard.tsx         # Project grid card
|   |   +-- ProjectShell.tsx        # Project detail page wrapper
|   |   +-- SectionHeading.tsx      # Reusable section header
|   |   +-- ThemeToggle.tsx         # Light/dark theme toggle
|   +-- data/                       # Static data and type definitions
|   |   +-- projects.ts             # Project cards array and filter list
|   +-- lib/                        # Shared utilities
|   |   +-- animations.ts           # Motion variant presets
|   +-- pages/                      # Route-level page components
|   |   +-- projects/               # Project detail pages
|   |   |   +-- ProjectCcTemplates.tsx
|   |   |   +-- ProjectExambyte.tsx
|   |   |   +-- ProjectHeistLine.tsx
|   |   |   +-- ProjectItchio.tsx
|   |   |   +-- ProjectLikeTik.tsx
|   |   |   +-- ProjectMaxsimCli.tsx
|   |   |   +-- ProjectMrDork3.tsx
|   |   +-- AGB.tsx                 # Legal: terms of service
|   |   +-- ArchitectShowcase.tsx   # Developer showcase page
|   |   +-- Datenschutz.tsx         # Legal: privacy policy
|   |   +-- Home.tsx                # Home page (composes sections)
|   |   +-- Impressum.tsx           # Legal: imprint
|   |   +-- NotFound.tsx            # 404 error page
|   |   +-- Visitenkarte.tsx        # Digital business card
|   +-- sections/                   # Home page section components
|   |   +-- About.tsx               # About/biography section
|   |   +-- Contact.tsx             # Contact form section
|   |   +-- Experience.tsx          # Work experience timeline
|   |   +-- Hero.tsx                # Hero banner section
|   |   +-- Philosophy.tsx          # Work philosophy cards
|   |   +-- Projects.tsx            # Filterable project grid
|   |   +-- Skills.tsx              # Tabbed skills + tech marquee
|   +-- App.tsx                     # Router configuration
|   +-- index.css                   # Global styles + design system
|   +-- main.tsx                    # Application entry point
+-- .env.production                 # Production environment vars (exists)
+-- .gitignore
+-- CLAUDE.md                       # Claude Code instructions
+-- eslint.config.js                # ESLint flat config
+-- index.html                      # HTML template with SEO + JSON-LD
+-- package.json                    # Dependencies and scripts
+-- package-lock.json               # Lockfile
+-- postcss.config.js               # PostCSS config (Tailwind)
+-- tailwind.config.js              # Tailwind design tokens
+-- tsconfig.app.json               # TypeScript config (app)
+-- tsconfig.json                   # TypeScript config (root)
+-- tsconfig.node.json              # TypeScript config (node/vite)
+-- vite.config.ts                  # Vite build configuration
```

## Directory Purposes

### `src/components/`

- **Purpose:** Reusable UI components shared across pages and sections
- **Contains:** 8 component files (Layout, Header, Footer, ProjectShell, ProjectCard, SectionHeading, FlipWords, ThemeToggle)
- **Key files:**
  - `Layout.tsx` -- Route wrapper with scroll management, IntersectionObserver, smooth scroll
  - `Header.tsx` -- Fixed nav with desktop/mobile modes, active section tracking, keyboard-trapped mobile menu
  - `ProjectShell.tsx` -- Standard wrapper for project detail pages (hero, title, back button, content)
  - `ProjectCard.tsx` -- Handles both internal route links and external URL links

### `src/sections/`

- **Purpose:** Home page content sections rendered in order by `Home.tsx`
- **Contains:** 7 section components (Hero, About, Philosophy, Experience, Projects, Skills, Contact)
- **Key files:**
  - `Hero.tsx` -- Full-screen hero with animated grid background (40 vertical + 18 horizontal lines), profile image, FlipWords rotator
  - `Projects.tsx` -- Filterable project grid with `useMemo` filtering and `AnimatePresence` transitions
  - `Skills.tsx` -- 5-tab skills display with helper sub-components (DocHeading, DocSubheading, TagList, InlineCode) + rAF-driven tech marquee

### `src/pages/`

- **Purpose:** Top-level route components (non-home pages)
- **Contains:** 7 page files + `projects/` subdirectory
- **Key files:**
  - `Home.tsx` -- Composes all 7 sections in order
  - `ArchitectShowcase.tsx` -- Standalone multi-section showcase page (6 sections with own hero, skills, marquee, principles, featured projects, CTA)
  - `Visitenkarte.tsx` -- Digital business card with vCard download, Web Share API, QR code modal, Wallet pass download
  - `NotFound.tsx` -- Styled 404 with gradient text, grid backdrop, reflection effect

### `src/pages/projects/`

- **Purpose:** Individual project detail pages
- **Contains:** 7 project page files, each using `ProjectShell` wrapper
- **Key files:**
  - `ProjectHeistLine.tsx` -- Includes full media gallery with lightbox (custom implementation)
  - `ProjectMaxsimCli.tsx` -- Complex page with command reference, runtime comparison, workflow steps, architecture diagram
  - `ProjectLikeTik.tsx` -- Feature grid cards, technology tags
  - `ProjectExambyte.tsx` -- Requirements list, architecture constraints, tech overview

### `src/data/`

- **Purpose:** Static content data and TypeScript type exports
- **Contains:** `projects.ts` with `ProjectCard` and `ProjectTag` types, `projectCards` array (8 entries), `projectFilters` array (6 entries)
- **Key files:**
  - `projects.ts` -- Central source of truth for all portfolio projects. Each entry specifies `route` (internal) or `link` (external) for navigation.

### `src/lib/`

- **Purpose:** Shared utility code and animation presets
- **Contains:** `animations.ts` with 7 exported motion variant objects
- **Key files:**
  - `animations.ts` -- `fadeInUp`, `fadeInLeft`, `staggerContainer`, `staggerContainerSlow`, `cardVariant`, `lineReveal`, `defaultViewport`

### `scripts/`

- **Purpose:** Build-time scripts
- **Contains:** `prerender.mjs`
- **Key files:**
  - `prerender.mjs` -- Post-build script that generates static `index.html` per route with injected SEO meta tags. Also creates `404.html` for GitHub Pages SPA fallback.

### `public/`

- **Purpose:** Static files copied directly to build output without processing
- **Contains:** `assets/` directory with images, `CNAME`, `robots.txt`, `sitemap.xml`
- **Key files:**
  - `assets/` -- Project images, profile photos, favicon (not processed by Vite)
  - `CNAME` -- Custom domain configuration for GitHub Pages
  - `sitemap.xml` -- Sitemap for search engine crawlers
  - `robots.txt` -- Crawler directives

### `.github/workflows/`

- **Purpose:** CI/CD automation
- **Contains:** `deploy.yml`
- **Key files:**
  - `deploy.yml` -- GitHub Actions workflow: checkout, Node 20 setup, `npm ci`, `npm run build` (with `VITE_BASE_PATH=/`), upload artifact, deploy to GitHub Pages

## Key File Locations

### Entry Points

| Purpose | File |
|---------|------|
| HTML template | `index.html` |
| React mount | `src/main.tsx` |
| Router config | `src/App.tsx` |
| Layout wrapper | `src/components/Layout.tsx` |
| Home page | `src/pages/Home.tsx` |

### Configuration

| Purpose | File |
|---------|------|
| Vite build config | `vite.config.ts` |
| TypeScript (app) | `tsconfig.app.json` |
| TypeScript (root) | `tsconfig.json` |
| TypeScript (node) | `tsconfig.node.json` |
| ESLint | `eslint.config.js` |
| Tailwind | `tailwind.config.js` |
| PostCSS | `postcss.config.js` |
| Package manifest | `package.json` |
| Production env | `.env.production` |

### Core Logic

| Purpose | File |
|---------|------|
| Global styles + design system | `src/index.css` |
| Design tokens (Tailwind) | `tailwind.config.js` |
| Project data | `src/data/projects.ts` |
| Animation presets | `src/lib/animations.ts` |
| SEO prerender | `scripts/prerender.mjs` |
| Deployment | `.github/workflows/deploy.yml` |

### Testing

No test files exist. No testing framework is configured.

## Naming Conventions

### Files

| Type | Convention | Examples |
|------|-----------|----------|
| Components | PascalCase | `Header.tsx`, `ProjectCard.tsx`, `SectionHeading.tsx` |
| Pages | PascalCase | `Home.tsx`, `NotFound.tsx`, `ArchitectShowcase.tsx` |
| Project pages | PascalCase with "Project" prefix | `ProjectHeistLine.tsx`, `ProjectLikeTik.tsx` |
| Data files | camelCase | `projects.ts` |
| Utility files | camelCase | `animations.ts` |
| Config files | kebab-case or dotted | `eslint.config.js`, `tailwind.config.js`, `vite.config.ts` |
| Scripts | camelCase | `prerender.mjs` |
| CSS files | kebab-case | `index.css` |

### Directories

| Convention | Examples |
|-----------|----------|
| All lowercase, plural for collections | `components/`, `pages/`, `sections/`, `scripts/` |
| Singular for utility directories | `data/`, `lib/` |
| Nested by category | `pages/projects/` |

## Where to Add New Code

### New Home Section

1. Create section component at `src/sections/NewSection.tsx`
2. Add `id` attribute on `<section>` for hash navigation
3. Import and place in `src/pages/Home.tsx` in desired order
4. Add navigation link in `src/components/Header.tsx` `getNavLinks` function

### New Project Page

1. Add entry to `projectCards` array in `src/data/projects.ts` (use `route` for internal, `link` for external)
2. Create page at `src/pages/projects/ProjectName.tsx` using `ProjectShell` wrapper
3. Add `<Route>` in `src/App.tsx`
4. Add route to `scripts/prerender.mjs` routes array with SEO metadata
5. (Note: CLAUDE.md mentions adding to `projectPaths` in Layout.tsx, but current Layout.tsx does not implement this feature)

### New Standalone Page

1. Create page component at `src/pages/PageName.tsx`
2. Add `<Route>` in `src/App.tsx` inside the `<Route element={<Layout />}>` wrapper
3. Add route to `scripts/prerender.mjs` if SEO meta tags are needed
4. Add footer/header links as appropriate

### New Reusable Component

- Create at `src/components/ComponentName.tsx`
- Use PascalCase filename
- Export as default function component
- Define props with `type` keyword (not `interface`)

### New Animation Preset

- Add to `src/lib/animations.ts`
- Export as named `Variants` object
- Follow existing pattern: `hidden` and `visible` variant keys

### New Static Data

- Add to existing file in `src/data/` or create new camelCase file
- Export types with `export type`
- Export data with `export const`

### New Utility Function

- Add to existing file in `src/lib/` or create new camelCase file
- Use named exports

## Special Directories

### `dist/`

- **Purpose:** Vite build output
- **Generated:** Yes, by `npm run build`
- **Committed:** No (in `.gitignore`)

### `public/assets/`

- **Purpose:** Static assets (images, icons) served without processing
- **Generated:** No, manually managed
- **Committed:** Yes

### `src/assets/`

- **Purpose:** Importable assets processed by Vite (currently empty)
- **Generated:** No
- **Committed:** Yes (directory exists but empty)

### `.planning/`

- **Purpose:** MAXSIM planning and codebase analysis artifacts
- **Generated:** Yes, by MAXSIM agents
- **Committed:** Varies (analysis documents are typically committed)

### `node_modules/`

- **Purpose:** npm dependencies
- **Generated:** Yes, by `npm ci` / `npm install`
- **Committed:** No (in `.gitignore`)

### `maxsim-landigpage/`

- **Purpose:** Separate landing page project (appears to be a submodule or separate concern)
- **Generated:** No
- **Committed:** Tracked as a modified submodule reference
