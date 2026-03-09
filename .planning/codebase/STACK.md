# STACK.md

> Generated: 2026-03-09

---

## Languages

### Primary

- **TypeScript** 5.9.3 (strict mode)
  - Config: `tsconfig.json` (project references), `tsconfig.app.json` (app), `tsconfig.node.json` (tooling)
  - Target: ES2022 (app), ES2023 (node tooling)
  - JSX: `react-jsx` (automatic runtime -- no `import React` needed)
  - Strict flags: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`, `erasableSyntaxOnly`
  - `verbatimModuleSyntax` enforced -- use `import type` for type-only imports

### Secondary

- **JavaScript** (ESM) -- used only for config files and the prerender script
  - `postcss.config.js`, `tailwind.config.js`, `eslint.config.js` -- all ESM (`export default`)
  - `scripts/prerender.mjs` -- post-build SEO prerender script (Node ESM)

### Markup / Styles

- **HTML** -- `index.html` (SPA shell with inline theme script, SEO meta, JSON-LD structured data)
- **CSS** -- `src/index.css` (Tailwind directives + custom design system: 878 lines)

---

## Runtime

| Property | Value |
|----------|-------|
| Runtime | Node.js v25.2.1 (dev machine), v20 (CI) |
| Package manager | npm 11.7.0 |
| Lockfile | `package-lock.json` (4367 lines) |
| Module system | ESM (`"type": "module"` in `package.json`) |
| Node version pinning | Not pinned (no `.nvmrc` or `.node-version` file). CI uses Node 20 via `actions/setup-node@v4` |

---

## Frameworks

### Core

| Framework | Version | Purpose | Config |
|-----------|---------|---------|--------|
| React | 19.2.4 | UI library | Automatic JSX runtime via `react-jsx` |
| React DOM | 19.2.4 | DOM renderer | `src/main.tsx` -- `createRoot` API |
| React Router DOM | 7.13.0 | Client-side routing | `src/App.tsx` -- `BrowserRouter` with `basename={import.meta.env.BASE_URL}` |

### Animation

| Library | Version | Purpose | Import |
|---------|---------|---------|--------|
| Motion (motion/react) | 12.34.3 | Entrance animations, page transitions, `AnimatePresence` | `import { motion, AnimatePresence, useInView } from "motion/react"` |

### Styling

| Tool | Version | Purpose | Config |
|------|---------|---------|--------|
| Tailwind CSS | 3.4.17 | Utility-first CSS framework | `tailwind.config.js` |
| PostCSS | 8.4.38 | CSS transformation pipeline | `postcss.config.js` |
| Autoprefixer | 10.4.20 | Vendor prefix injection | Configured as PostCSS plugin |

### Build / Dev

| Tool | Version | Purpose | Config |
|------|---------|---------|--------|
| Vite | 7.3.1 | Dev server + production bundler | `vite.config.ts` |
| @vitejs/plugin-react | 5.1.2 | React Fast Refresh + JSX transform | Plugin in `vite.config.ts` |
| TypeScript | 5.9.3 | Type checking (no emit -- Vite handles transpilation) | `tsconfig.app.json`, `tsconfig.node.json` |

### Linting

| Tool | Version | Purpose | Config |
|------|---------|---------|--------|
| ESLint | 9.39.2 | Code linting | `eslint.config.js` (flat config) |
| typescript-eslint | 8.46.4+ | TypeScript ESLint rules | Extends `tseslint.configs.recommended` |
| eslint-plugin-react-hooks | 7.0.1+ | React hooks linting | Extends `reactHooks.configs.flat.recommended` |
| eslint-plugin-react-refresh | 0.4.24+ | React Refresh boundary validation | Extends `reactRefresh.configs.vite` |

---

## Key Dependencies

### Production Dependencies

| Package | Version (installed) | Purpose | Used in |
|---------|-------------------|---------|---------|
| `react` | 19.2.4 | Core UI library | Every `.tsx` component |
| `react-dom` | 19.2.4 | DOM rendering | `src/main.tsx` |
| `react-router-dom` | 7.13.0 | Client-side routing (BrowserRouter, Route, Routes, Link, useLocation, Outlet) | `src/App.tsx`, `src/components/Layout.tsx`, `src/components/Header.tsx`, `src/components/ProjectShell.tsx`, `src/components/ProjectCard.tsx`, page components |
| `motion` | 12.34.3 | Animation library (successor to Framer Motion). Provides `motion`, `AnimatePresence`, `useInView`, `Variants` type | `src/sections/Hero.tsx`, `src/sections/About.tsx`, `src/sections/Contact.tsx`, `src/sections/Experience.tsx`, `src/sections/Philosophy.tsx`, `src/sections/Projects.tsx`, `src/sections/Skills.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/ProjectShell.tsx`, `src/components/ProjectCard.tsx`, `src/components/FlipWords.tsx`, `src/components/SectionHeading.tsx`, `src/pages/ArchitectShowcase.tsx`, `src/pages/NotFound.tsx`, `src/pages/projects/ProjectMaxsimCli.tsx`, `src/pages/projects/ProjectCcTemplates.tsx`, `src/lib/animations.ts` |
| `lucide-react` | 0.575.0 | Icon library (tree-shakeable SVG icons) | `src/sections/Philosophy.tsx` (Layers, ShieldCheck, Zap, Wrench), `src/sections/Skills.tsx` (Terminal, Package, Settings, Bot) |
| `qrcode.react` | 4.2.0 | QR code canvas generation | `src/pages/Visitenkarte.tsx` (business card page) |

### Dev Dependencies

| Package | Version (installed) | Purpose |
|---------|-------------------|---------|
| `vite` | 7.3.1 | Build tool and dev server |
| `@vitejs/plugin-react` | 5.1.2 | React SWC/Babel integration for Vite |
| `typescript` | 5.9.3 | Type checking |
| `@types/react` | 19.2.5+ | React type definitions |
| `@types/react-dom` | 19.2.3+ | React DOM type definitions |
| `@types/node` | 24.10.1+ | Node.js type definitions (for `tsconfig.node.json`) |
| `tailwindcss` | 3.4.17 | CSS utility framework |
| `postcss` | 8.4.38 | CSS post-processing |
| `autoprefixer` | 10.4.20 | CSS vendor prefixing |
| `eslint` | 9.39.2 | Linter |
| `@eslint/js` | 9.39.1+ | ESLint base JS config |
| `typescript-eslint` | 8.46.4+ | TypeScript ESLint integration |
| `eslint-plugin-react-hooks` | 7.0.1+ | React hooks rules |
| `eslint-plugin-react-refresh` | 0.4.24+ | React Refresh validation |
| `globals` | 16.5.0+ | Global variable definitions for ESLint |

---

## Configuration

### TypeScript Configuration

Three-file project references setup:

- **`tsconfig.json`** -- Root config. Contains no `compilerOptions`, only references to `tsconfig.app.json` and `tsconfig.node.json`. `files: []` prevents accidental compilation.
- **`tsconfig.app.json`** -- Application code. Targets ES2022 with DOM libs. Includes `src/` directory. Uses bundler module resolution. Key flags: `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noEmit`.
- **`tsconfig.node.json`** -- Tooling code (Vite config). Targets ES2023. Includes only `vite.config.ts`. Uses `@types/node`.

### Vite Configuration (`vite.config.ts`)

- Uses `loadEnv` to read `VITE_*` environment variables
- **Base path**: `/sven-maibaum-website/` in production (from `VITE_BASE_PATH` env var), `/` in development
- **Production override**: CI sets `VITE_BASE_PATH=/` in the GitHub Actions workflow (custom domain deployment)
- Single plugin: `@vitejs/plugin-react`
- No custom aliases, no proxy, no SSR configuration

### Tailwind Configuration (`tailwind.config.js`)

Content scanning: `./index.html` and `./src/**/*.{ts,tsx,js,jsx}`

Design tokens:

| Token Category | Values |
|---------------|--------|
| Colors (static) | `ink` (#09090B), `graphite` (#18181B), `slate` (#3F3F46), `cloud` (#FAFAFA), `mist` (#E4E4E7), `brand` (#3b82f6), `brandDark` (#2563EB), `brandLight` (#60a5fa) |
| Colors (adaptive via CSS vars) | `fg`, `canvas`, `surface`, `border`, `muted`, `faint`, `surface2` |
| Colors (compat) | `zinc.300` through `zinc.800` |
| Fonts | `display` (Geist, system-ui), `body` (Geist, system-ui), `mono` (Geist Mono, ui-monospace) |
| Shadows | `accent` (blue ring), `accent-inset` (inset blue ring) |
| Background images | `swiss-grid` (grid-line pattern) |

No Tailwind plugins configured.

### PostCSS Configuration (`postcss.config.js`)

Two plugins: `tailwindcss` and `autoprefixer`. No custom PostCSS plugins.

### ESLint Configuration (`eslint.config.js`)

- Flat config format (ESLint 9.x)
- Ignores `dist/` directory
- Targets `**/*.{ts,tsx}` files only
- Extends: `js.configs.recommended`, `tseslint.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`
- ECMAScript version: 2020
- Globals: browser environment
- No custom rules, no Prettier integration

### Environment Configuration

- `.env.production` exists (contains `VITE_BASE_PATH` -- not read for security)
- CI overrides `VITE_BASE_PATH=/` in `deploy.yml`
- Theme preference: inline `<script>` in `index.html` sets `data-theme="dark"` before React loads

---

## External Resources (loaded from CDN in `index.html`)

| Resource | CDN | Purpose |
|----------|-----|---------|
| Geist font (400-900) + Geist Mono (400-700) | Google Fonts | Display and monospace typography |
| Font Awesome 6.4.0 | cdnjs | Icon library (used via `<i>` tags in components) |

---

## Build Pipeline

### Commands (from `package.json`)

| Command | What it does |
|---------|-------------|
| `npm run dev` | Starts Vite dev server with HMR |
| `npm run build` | `tsc -b` (type check) + `vite build` (bundle) + `node scripts/prerender.mjs` (SEO pages) |
| `npm run lint` | `eslint .` (lint all TS/TSX files) |
| `npm run preview` | `vite preview` (serve production build locally) |

### Build output

- Output directory: `dist/` (gitignored)
- Prerender script generates per-route `index.html` files in `dist/` with correct SEO meta tags
- Also generates `dist/404.html` as GitHub Pages SPA fallback

---

## Deployment

| Property | Value |
|----------|-------|
| Platform | GitHub Pages |
| Trigger | Push to `main` branch or manual `workflow_dispatch` |
| CI config | `.github/workflows/deploy.yml` |
| CI runner | `ubuntu-latest` |
| CI Node version | 20 |
| Install command | `npm ci` |
| Build env var | `VITE_BASE_PATH=/` |
| Deploy method | `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` |
| Custom domain | `www.sven-maibaum.com` (configured via `public/CNAME`) |
| Concurrency | Group `pages`, cancel-in-progress |
| Permissions | `contents: read`, `pages: write`, `id-token: write` |

### SEO Assets

| File | Location | Purpose |
|------|----------|---------|
| `robots.txt` | `public/robots.txt` | Allows all crawlers, points to sitemap |
| `sitemap.xml` | `public/sitemap.xml` | Lists 10 routes with priorities and lastmod dates |
| JSON-LD | Inline in `index.html` | Person + WebSite structured data schema |
| Open Graph + Twitter Card | `index.html` (base) + prerendered per route | Social sharing metadata |
| Prerender script | `scripts/prerender.mjs` | Generates static HTML per route with correct meta tags |

---

## Platform Requirements

### Development

- Node.js 20+ (CI uses 20; dev machine runs 25.2.1)
- npm (lockfile-based)
- Modern browser for dev server (Vite ESM-native dev)
- No Docker, no database, no backend services required

### Production

- Static file hosting (GitHub Pages)
- Custom domain DNS configured to GitHub Pages
- No server-side runtime required -- purely static SPA with prerendered HTML shells
