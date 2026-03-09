# Roadmap: Sven Maibaum Portfolio

## Overview

The portfolio is fully functional with all core features shipped. Future work focuses on performance optimization, accessibility improvements, and ongoing content updates as new projects are completed.

## Milestones

- 🚧 **v1.1 Polish & Performance** — Phases 1-3 (in progress)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Performance Optimization** — Code splitting, image optimization, and bundle analysis
- [ ] **Phase 2: Accessibility Improvements** — ARIA, keyboard navigation, reduced motion support
- [ ] **Phase 3: Content Refresh** — New project pages and updated content across sections

## Phase Details

### Phase 1: Performance Optimization
**Goal**: Improve load times and bundle efficiency with code splitting, image optimization, and lazy loading
**Depends on**: Nothing (first phase)
**Requirements**: PERF-01, PERF-02, PERF-03
**Success Criteria** (what must be TRUE):
  1. Routes are lazily loaded — only the home page bundle loads on initial visit
  2. Images use WebP format with lazy loading and appropriate srcset
  3. Production bundle size is measurably reduced from current baseline
**Plans**: TBD

### Phase 2: Accessibility Improvements
**Goal**: Ensure the portfolio is fully accessible with proper ARIA, keyboard navigation, and reduced motion support
**Depends on**: Phase 1
**Requirements**: A11Y-01, A11Y-02, A11Y-03, A11Y-04
**Success Criteria** (what must be TRUE):
  1. All interactive elements have proper ARIA attributes and roles
  2. Entire site is navigable via keyboard only (Tab, Enter, Escape)
  3. Animations respect prefers-reduced-motion media query
  4. No accessibility violations in automated audit (Lighthouse)
**Plans**: TBD

### Phase 3: Content Refresh
**Goal**: Add new project pages and refresh existing content to reflect latest work
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. New project detail pages added for any completed work
  2. Experience timeline reflects current status
  3. Project descriptions and imagery are up to date
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Performance Optimization | 0/TBD | Not started | - |
| 2. Accessibility Improvements | 0/TBD | Not started | - |
| 3. Content Refresh | 0/TBD | Not started | - |
