# Sven Maibaum Portfolio

## What This Is

Personal portfolio website for Sven Maibaum — a React 19 single-page application showcasing game development, AI/ML research, and software engineering projects. Built with Vite, TypeScript (strict), and Tailwind CSS v3. Deployed at `https://www.sven-maibaum.com`.

## Core Value

Visitors immediately understand Sven's skills and projects, with a polished, fast, and visually impressive experience that reflects professional quality.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Home page with 7 sections: Hero, About, Philosophy, Experience, Projects, Skills, Contact
- ✓ 7 project detail pages with ProjectShell wrapper (HeistLine, Mr. Dork 3, LikeTik, Exambyte, itch.io, maxsimcli, cc-templates)
- ✓ Dark/light theme with localStorage persistence and flash prevention
- ✓ Responsive mobile-first design with md/lg breakpoints
- ✓ Client-side routing with React Router DOM v7
- ✓ Project filtering by technology category
- ✓ Scroll-triggered fade-in-up animations
- ✓ Motion/React entrance animations in project pages
- ✓ Legal pages (Impressum, Datenschutz, AGB)
- ✓ Business card page (/visitenkarte) with QR code
- ✓ Architect showcase page
- ✓ SEO prerender script generating static HTML per route
- ✓ Tech stack marquee with rAF delta-time loop

### Active

<!-- Current scope. Building toward these. -->

- [ ] Performance optimization (lazy loading, image optimization, bundle splitting)
- [ ] Enhanced accessibility (ARIA improvements, keyboard navigation, screen reader testing)
- [ ] Content updates and refinement across all sections
- [ ] Additional project detail pages as new work is completed

### Out of Scope

- Blog/CMS system — portfolio is static content, updated manually
- Backend/API — purely client-side SPA
- Testing framework — not needed unless explicitly requested
- Prettier — ESLint handles formatting
- Internationalization (i18n) — content stays in German, code in English
- Legacy sven-maibaum/ directory — do not modify

## Context

- **Deployment**: GitHub Pages with base path `/sven-maibaum-portfolio/` in production
- **Content language**: German for user-facing content, English for code/comments
- **Design system**: Custom Tailwind tokens (ink, graphite, slate, cloud, brand, brandDark, mist), Space Grotesk + Archivo fonts
- **Animation library**: motion/react (Framer Motion successor)
- **Icon library**: lucide-react
- **Special pages**: Some project pages (liketik, exambyte) suppress header+footer for immersive experience
- **Prerender**: Post-build script generates static HTML for each route with proper meta/OG tags

## Constraints

- **Tech Stack**: React 19 + Vite + TypeScript strict + Tailwind CSS v3
- **No external state**: React hooks only, no Redux/Zustand
- **Accessibility**: ARIA on interactive elements, 44x44px min touch targets
- **Mobile-first**: Breakpoints md: (768px), lg: (1024px)
- **TypeScript**: `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
- **Conventions**: `type` not `interface`, `import type` for types, default exports, functional components

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React 19 SPA over SSR/SSG | Portfolio is client-rendered; prerender script handles SEO | ✓ Good |
| Tailwind v3 over v4 | Stable, well-supported, adequate for project needs | ✓ Good |
| motion/react over CSS-only animations | Rich entrance animations needed for project pages | ✓ Good |
| rAF marquee over CSS animation | CSS marquee had speed inconsistencies across widths | ✓ Good |
| German content, English code | Target audience is German-speaking; code stays universal | ✓ Good |
| No testing framework | Small static portfolio; manual testing sufficient | — Pending |
| ProjectShell wrapper pattern | Consistent layout for all project detail pages | ✓ Good |

---
*Last updated: 2026-03-09 after MAXSIM initialization*
