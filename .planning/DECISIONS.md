# Decisions: Sven Maibaum Portfolio

Architectural and technical decisions with rationale. Referenced from PROJECT.md Key Decisions table.

## DEC-001: React 19 SPA with Client-Side Routing
**Date:** Pre-existing
**Context:** Portfolio needs fast navigation between sections and project pages
**Decision:** Use React 19 SPA with React Router DOM v7, no SSR/SSG framework
**Rationale:** Client-side rendering is sufficient for a portfolio; prerender script handles SEO for social sharing crawlers
**Status:** ✓ Good

## DEC-002: Tailwind CSS v3 with Custom Design Tokens
**Date:** Pre-existing
**Context:** Need consistent styling with design tokens (colors, fonts, shadows)
**Decision:** Tailwind v3 with custom theme config: ink, graphite, slate, cloud, brand, brandDark, mist colors; Space Grotesk + Archivo fonts
**Rationale:** Utility-first CSS with design token support; v3 is stable and well-supported
**Status:** ✓ Good

## DEC-003: motion/react for Animations
**Date:** Pre-existing
**Context:** Project pages need rich entrance animations beyond CSS capabilities
**Decision:** Use motion/react (Framer Motion successor) for component animations
**Rationale:** Declarative API, React 19 compatible, used in ProjectShell and entrance sequences
**Status:** ✓ Good

## DEC-004: rAF Delta-Time Marquee
**Date:** Pre-existing (recent)
**Context:** CSS animation marquee had speed inconsistencies across different viewport widths
**Decision:** Replace CSS marquee with requestAnimationFrame delta-time loop
**Rationale:** Constant visual speed regardless of content width; frame-rate independent
**Status:** ✓ Good

## DEC-005: Prerender Script for SEO
**Date:** Pre-existing
**Context:** SPA needs proper meta tags for social sharing (Open Graph, Twitter Cards)
**Decision:** Post-build Node.js script (scripts/prerender.mjs) generates static index.html per route
**Rationale:** Avoids SSR framework overhead; only needed for meta tags, not full page rendering
**Status:** ✓ Good

## DEC-006: Immersive Project Pages
**Date:** Pre-existing
**Context:** Some projects (LikeTik, Exambyte) benefit from full-screen presentation
**Decision:** `specialDetailPages` Set in Layout.tsx suppresses header and footer for designated pages
**Rationale:** Creates focused, immersive experience for showcase-worthy projects
**Status:** ✓ Good

## DEC-007: No Testing Framework
**Date:** Pre-existing
**Context:** Small static portfolio with no complex business logic
**Decision:** No testing framework configured; manual testing only
**Rationale:** ROI of testing framework is low for a static portfolio; add only if explicitly requested
**Status:** — Pending

---
*Created: 2026-03-09 during MAXSIM initialization*
