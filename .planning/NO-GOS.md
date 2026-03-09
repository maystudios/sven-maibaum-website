# No-Gos: Sven Maibaum Portfolio

Explicit exclusions and anti-patterns. These are NOT to be done.

## Architecture No-Gos

- **NO-GO-01: Do not modify legacy `sven-maibaum/` directory** — Frozen legacy site; all work in `sven-maibaum-new/`
- **NO-GO-02: Do not add external state management** — No Redux, Zustand, Jotai, etc. React hooks only
- **NO-GO-03: Do not add SSR/SSG framework** — No Next.js, Remix, Astro migration. SPA with prerender is sufficient
- **NO-GO-04: Do not add backend/API** — Purely client-side; no server-side logic, databases, or API routes

## Code Style No-Gos

- **NO-GO-05: Do not use `interface`** — Use `type` for all prop definitions (project convention)
- **NO-GO-06: Do not add Prettier** — ESLint handles formatting; no additional formatters
- **NO-GO-07: Do not use bare `import React`** — Automatic JSX runtime enabled; no React import needed for JSX
- **NO-GO-08: Do not skip `import type`** — `verbatimModuleSyntax` enforced; type-only imports must use `import type`

## Testing No-Gos

- **NO-GO-09: Do not add testing framework without explicit request** — No Jest, Vitest, Playwright, etc. unless asked

## Content No-Gos

- **NO-GO-10: Do not write user-facing content in English** — All visible text stays in German
- **NO-GO-11: Do not write code comments in German** — Code and comments stay in English

## Deployment No-Gos

- **NO-GO-12: Do not change the base path configuration** — `/sven-maibaum-portfolio/` in production via `VITE_BASE_PATH`
- **NO-GO-13: Do not remove prerender script** — Required for SEO/social sharing meta tags

---
*Created: 2026-03-09 during MAXSIM initialization*
