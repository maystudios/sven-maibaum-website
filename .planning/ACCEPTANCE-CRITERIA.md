# Acceptance Criteria: Sven Maibaum Portfolio

Measurable success criteria for the current milestone (v1.1 Polish & Performance).

## Milestone: v1.1 Polish & Performance

### AC-01: Route-Level Code Splitting
- Production build creates separate chunks per route
- Initial page load transfers < 200KB JS (gzipped)
- Navigating to a project page loads its chunk on demand
- **Verification:** `npm run build` output shows multiple chunk files

### AC-02: Optimized Images
- All project images served in WebP format
- Images below the fold use `loading="lazy"`
- Hero/above-fold images have explicit width/height to prevent CLS
- **Verification:** Lighthouse Performance score >= 90

### AC-03: Accessibility Compliance
- All interactive elements (buttons, links, toggles) have ARIA labels
- Tab navigation reaches all interactive elements in logical order
- Theme toggle is keyboard-accessible (Enter/Space)
- Animations respect `prefers-reduced-motion: reduce`
- **Verification:** Lighthouse Accessibility score >= 95

### AC-04: Content Currency
- All project pages reflect current state of each project
- Experience timeline includes latest entries
- No placeholder images in production (placehold.co links replaced)
- **Verification:** Manual review of all pages

### AC-05: Build Health
- `npm run build` completes without errors or warnings
- `npm run lint` passes with zero errors
- No TypeScript strict mode violations
- **Verification:** CI-equivalent build check passes

---
*Created: 2026-03-09 during MAXSIM initialization*
