# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow
- **Nach jeder Änderung immer committen und pushen** (kein explizites OK nötig)
- Agent Teams verwenden, ausschließlich Modell **Sonnet 4.6** und **Haiku**
- use Skills like aceternity-ui and tech-product-landing (only as ref)

## Project

Personal portfolio website for Sven Maibaum. React 19 SPA with Vite, TypeScript (strict), and Tailwind CSS v3.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b + vite build + scripts/prerender.mjs (SEO static pages)
npm run lint      # ESLint on all .ts/.tsx files
npm run preview   # Preview production build
```

No testing framework configured. Do not add one without explicit request.

## Architecture

**Routing** (`src/App.tsx`): React Router DOM v7. Home (`/`) renders section components inline. Project detail pages at `/projekte/*`. Legal at `/impressum`, `/datenschutz`, `/agb`. Special routes: `/showcase`, `/visitenkarte`.

**Layout** (`src/Layout.tsx`): Wraps all routes. `projectPaths` Set controls which routes show the header. `specialDetailPages` Set suppresses both header and footer for immersive pages (currently liketik, exambyte). Runs IntersectionObserver for `.fade-in-up` animations and hash-anchor smooth scroll.

**Prerender** (`scripts/prerender.mjs`): Post-build script that generates a static `index.html` per route with correct `<title>`, meta, Open Graph, and Twitter Card tags. Runs automatically in `npm run build`. Add new routes here when adding project pages so social scrapers get the right metadata.

**Animations**: `motion/react` (Motion for React, Framer Motion successor). Import from `"motion/react"`. Used in `ProjectShell` and other components for entrance animations.

**Theming**: `data-theme` attribute on `<html>` (`"light"` | `"dark"`), persisted in localStorage. Inline script in `index.html` sets theme before hydration to prevent flash. CSS variables in `src/index.css` respond to `data-theme`.

**Styling**: Tailwind utilities as primary method. Custom CSS in `src/index.css`: glassmorphism, gradient text, `.fade-in-up`, `.tech-tag-*` variants. Design tokens in `tailwind.config.js`: colors (`ink`, `graphite`, `slate`, `cloud`, `brand`, `brandDark`, `mist`), fonts (`Space Grotesk` display, `Archivo` body), shadows (`glow`, `glass`). Available `.tech-tag-*` suffixes: `purple`, `gray`, `blue`, `teal`, `red`, `orange`, `green`, `pink`, `yellow`.

**State**: React hooks only — no external state library.

## Code Conventions

- Functional components with default exports
- `type` (not `interface`) for props
- `import type` for type-only imports (`verbatimModuleSyntax` enforced)
- No `import React` needed (automatic JSX runtime)
- Import order: React/library hooks → local components → data/types
- Files: PascalCase components, camelCase data files, kebab-case CSS classes
- Content in **German**; code/comments in **English**

## Adding a New Project

1. Add entry to `src/data/projects.ts` (`projectCards` array). Use `route` for internal pages, `link` for external URLs.
2. Create `src/pages/projects/ProjectName.tsx` using `ProjectShell` wrapper.
3. Add route in `src/App.tsx`.
4. Add path to `projectPaths` Set in `Layout.tsx` (shows header).
5. Add route + SEO metadata to `scripts/prerender.mjs` (for social sharing).
6. Optionally add to `specialDetailPages` in `Layout.tsx` to suppress header and footer.

## Key Config

- **Vite**: Base path `/sven-maibaum-portfolio/` in production (env var `VITE_BASE_PATH`), `/` in dev. Deployed at `https://www.sven-maibaum.com`.
- **TypeScript**: Strict, ES2022, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`.
- **ESLint**: Flat config (`eslint.config.js`) with typescript-eslint, react-hooks, react-refresh.

## Constraints

- ARIA attributes required on interactive elements; minimum 44×44px touch targets
- Mobile-first; breakpoints `md:` (768px), `lg:` (1024px)
- Do not add Prettier (ESLint handles formatting)
