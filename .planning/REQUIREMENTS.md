# Requirements: Sven Maibaum Portfolio

**Defined:** 2026-03-09
**Core Value:** Visitors immediately understand Sven's skills and projects with a polished, fast, visually impressive experience.

## v1 Requirements

Requirements for the current portfolio. All validated — this is a brownfield project.

### Navigation & Layout

- [x] **NAV-01**: Sticky header with navigation links to home sections
- [x] **NAV-02**: Smooth scroll to anchor sections on link click
- [x] **NAV-03**: Conditional header/footer per route (immersive pages suppress both)
- [x] **NAV-04**: 404 Not Found page for unknown routes
- [x] **NAV-05**: Footer with links and contact info

### Home Sections

- [x] **HOME-01**: Hero section with name, title, and call-to-action
- [x] **HOME-02**: About section with personal introduction
- [x] **HOME-03**: Philosophy section
- [x] **HOME-04**: Experience/timeline section
- [x] **HOME-05**: Projects grid with technology filter tabs
- [x] **HOME-06**: Skills/tech stack section with marquee
- [x] **HOME-07**: Contact section with links

### Project Pages

- [x] **PROJ-01**: Project detail pages using ProjectShell wrapper
- [x] **PROJ-02**: HeistLine project page
- [x] **PROJ-03**: Mr. Dork 3 project page
- [x] **PROJ-04**: LikeTik project page (immersive, no header/footer)
- [x] **PROJ-05**: Exambyte project page (immersive, no header/footer)
- [x] **PROJ-06**: itch.io/Game Jams project page
- [x] **PROJ-07**: maxsimcli project page
- [x] **PROJ-08**: cc-templates project page
- [x] **PROJ-09**: External link to Hugging Face profile

### Theming & Design

- [x] **THEME-01**: Dark/light theme toggle with smooth transition
- [x] **THEME-02**: Theme persisted in localStorage
- [x] **THEME-03**: No flash of wrong theme on load (inline script)
- [x] **THEME-04**: Design tokens via Tailwind config (colors, fonts, shadows)
- [x] **THEME-05**: Glassmorphism and gradient text CSS effects

### Animations

- [x] **ANIM-01**: Scroll-triggered fade-in-up animations via IntersectionObserver
- [x] **ANIM-02**: Motion/React entrance animations on project pages
- [x] **ANIM-03**: Tech stack marquee with constant-speed rAF loop

### Special Pages

- [x] **SPEC-01**: Architect showcase page (/showcase)
- [x] **SPEC-02**: Digital business card (/visitenkarte) with QR code
- [x] **SPEC-03**: Impressum legal page
- [x] **SPEC-04**: Datenschutz (privacy) legal page
- [x] **SPEC-05**: AGB (terms) legal page

### SEO & Deployment

- [x] **SEO-01**: Prerender script generates static HTML per route
- [x] **SEO-02**: Correct title, meta, Open Graph, Twitter Card per page
- [x] **SEO-03**: Base path configuration for GitHub Pages deployment

## v2 Requirements

Planned improvements for future milestones.

### Performance

- **PERF-01**: Route-based code splitting with React.lazy
- **PERF-02**: Image optimization (WebP, lazy loading, srcset)
- **PERF-03**: Bundle size analysis and optimization

### Accessibility

- **A11Y-01**: Full ARIA landmark roles on all interactive elements
- **A11Y-02**: Keyboard navigation for all interactive components
- **A11Y-03**: Screen reader testing and optimization
- **A11Y-04**: Reduced motion support (prefers-reduced-motion)

### Content

- **CONT-01**: New project pages as work is completed
- **CONT-02**: Updated experience/timeline entries
- **CONT-03**: Refined project descriptions and imagery

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog/CMS | Static portfolio; manual updates sufficient |
| Backend API | Purely client-side, no server-side logic needed |
| i18n/Localization | German-only audience; English code convention |
| User authentication | No user accounts needed |
| Contact form backend | Use mailto/external links |
| Testing framework | Not requested; manual testing adequate for static site |
| Legacy site modifications | sven-maibaum/ directory is frozen |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01..05 | Pre-existing | Complete |
| HOME-01..07 | Pre-existing | Complete |
| PROJ-01..09 | Pre-existing | Complete |
| THEME-01..05 | Pre-existing | Complete |
| ANIM-01..03 | Pre-existing | Complete |
| SPEC-01..05 | Pre-existing | Complete |
| SEO-01..03 | Pre-existing | Complete |
| PERF-01..03 | Phase 1 | Pending |
| A11Y-01..04 | Phase 2 | Pending |
| CONT-01..03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 28 total (all complete)
- v2 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after MAXSIM initialization*
