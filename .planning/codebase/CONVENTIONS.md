# Conventions

> Generated: 2026-03-09 | Focus: quality

---

## Naming Patterns

### Files

- **Component files:** PascalCase with `.tsx` extension. One component per file. The filename matches the default export name.
  - Components: `ProjectShell.tsx`, `SectionHeading.tsx`, `ThemeToggle.tsx`, `FlipWords.tsx`
  - Pages: `Home.tsx`, `NotFound.tsx`, `Visitenkarte.tsx`, `ArchitectShowcase.tsx`
  - Project pages: `ProjectHeistLine.tsx`, `ProjectLikeTik.tsx`, `ProjectMaxsimCli.tsx`, `ProjectCcTemplates.tsx`
- **Data files:** camelCase with `.ts` extension. Example: `src/data/projects.ts`
- **Utility/library files:** camelCase with `.ts` extension. Example: `src/lib/animations.ts`
- **Config files:** lowercase/kebab-case at project root. Examples: `tailwind.config.js`, `eslint.config.js`, `tsconfig.app.json`
- **CSS files:** kebab-case. Single global stylesheet: `src/index.css`

### Functions and Variables

- **Components:** PascalCase function names matching the filename. Use `function` declaration (not arrow function) for the default export.
  ```tsx
  export default function ProjectShell({ ... }: ProjectShellProps) { ... }
  ```
- **Helper components (non-exported):** PascalCase, defined in the same file above the main component. Examples in `src/sections/Skills.tsx`: `DocHeading`, `DocSubheading`, `DocText`, `InlineCode`, `TagList`, `TechBadge`, `MarqueeRow`.
- **Helper functions:** camelCase. Examples: `getNavLinks()` in `src/components/Header.tsx`, `getInitialTheme()` and `applyTheme()` in `src/components/ThemeToggle.tsx`, `tabContent()` in `src/sections/Skills.tsx`.
- **Constants/data arrays:** camelCase for arrays and objects. Examples: `heroTags`, `projectCards`, `projectFilters`, `gameAreas`, `langs`, `devopsAreas`, `aiSteps`, `tabs`, `row1`, `row2`, `experiences`.
- **Upper-case constants:** Used sparingly for truly fixed scalar values. Example: `const COPIES = 8;` in `src/sections/Skills.tsx`. Data arrays like `COMMANDS`, `RUNTIMES`, `WORKFLOW_STEPS` in `src/pages/projects/ProjectMaxsimCli.tsx` use SCREAMING_SNAKE_CASE when the page is self-contained (no consistent rule -- both camelCase and SCREAMING_SNAKE_CASE appear).
- **Event handlers:** Inline arrow functions or `handleX` pattern. Example: `handleClick` in `src/components/Layout.tsx`, `handleKeyDown` in `src/components/Header.tsx`.
- **State variables:** Descriptive camelCase with `set` prefix for setter. Examples: `[open, setOpen]`, `[scrolled, setScrolled]`, `[activeFilter, setActiveFilter]`, `[activeTab, setActiveTab]`, `[theme, setTheme]`.
- **Refs:** camelCase with `Ref` suffix. Examples: `menuRef`, `triggerRef`, `trackRef`, `posRef`, `rafRef`, `lastTimeRef`, `gridRef`, `touchStart`, `touchEnd`.

### Types

- **Props types:** PascalCase with `Props` suffix. Examples: `HeaderProps`, `ProjectShellProps`, `ProjectCardProps`, `SectionHeadingProps`, `FlipWordsProps`, `ThemeToggleProps`, `MarqueeRowProps`.
- **Data types:** PascalCase, descriptive. Examples: `ProjectTag`, `ProjectCard`, `ExperienceEntry`, `TechItem`, `TabId` (union type), `Theme` (union type).

### CSS Classes

- **Custom CSS classes:** kebab-case. Use `swiss-` prefix for design system classes. Examples: `swiss-container`, `swiss-section`, `swiss-btn-primary`, `swiss-btn-secondary`, `swiss-card`, `swiss-eyebrow`, `swiss-heading-xl`, `swiss-heading-lg`, `swiss-heading-md`, `swiss-body`, `swiss-divider`.
- **Tech tag variants:** `tech-tag` base class plus `tech-tag-{color}` modifier. Available colors: `purple`, `gray`, `blue`, `teal`, `red`, `orange`, `green`, `pink`, `yellow`, `indigo`.
- **Form classes:** `fs-` prefix. Examples: `fs-form`, `fs-field`, `fs-label`, `fs-input`, `fs-textarea`, `fs-select`, `fs-button`, `fs-description`.
- **Layout classes:** Descriptive kebab-case. Examples: `header-inner`, `header-desktop`, `header-mobile`, `section-padding`, `project-detail-container`, `project-detail-header`, `project-detail-content`.
- **Animation classes:** `fade-in-up`, `marquee-left`, `marquee-right`, `animate-marquee`, `animate-marquee-reverse`, `animate-glow-pulse`.
- **Media/lightbox classes:** `media-grid`, `media-item`, `media-thumb`, `lightbox`, `lightbox__figure`, `lightbox__close`, `lightbox__nav`, `lightbox__prev`, `lightbox__next`.

---

## Code Style

### Formatting

- **No Prettier.** ESLint handles formatting.
- **Indentation:** 2 spaces.
- **Quotes:** Double quotes for JSX attributes and string literals in imports/ESLint config. Single quotes also appear in some Motion imports (`'motion/react'`) -- not enforced strictly.
- **Semicolons:** Present (standard ESLint default).
- **Trailing commas:** Present on multi-line arrays and objects.
- **Line length:** No hard limit enforced. Some lines exceed 120 characters (especially className strings and inline styles).

### Linting

- **Config:** `eslint.config.js` using ESLint flat config with `defineConfig` and `globalIgnores`.
- **Extends:**
  - `@eslint/js` recommended
  - `typescript-eslint` recommended
  - `eslint-plugin-react-hooks` flat recommended
  - `eslint-plugin-react-refresh` Vite config
- **Scope:** All `**/*.{ts,tsx}` files.
- **Target:** ECMAScript 2020 with browser globals.
- **Ignored:** `dist/` directory.
- **Inline overrides:** Used sparingly. Example in `src/components/Header.tsx`:
  ```tsx
  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with router navigation
  useEffect(() => { setOpen(false); }, [location.pathname]);
  ```
- **Run command:** `npm run lint` (runs `eslint .`).

---

## Import Organization

### Order

Imports follow a consistent three-tier pattern (not enforced by tooling, but followed by convention):

1. **React/library hooks and external packages** -- `react`, `react-dom`, `react-router-dom`, `motion/react`, `lucide-react`, `qrcode.react`
2. **Local components** -- relative paths to `../components/` or `../../components/`
3. **Data and types** -- relative paths to `../data/` or `../lib/`

### Examples

From `src/sections/Projects.tsx`:
```tsx
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ProjectCard from "../components/ProjectCard";
import SectionHeading from "../components/SectionHeading";
import { projectCards, projectFilters } from "../data/projects";
```

From `src/components/ProjectCard.tsx`:
```tsx
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { ProjectCard as ProjectCardType } from "../data/projects";
```

From `src/sections/Experience.tsx`:
```tsx
import { motion } from "motion/react";
import { staggerContainerSlow, fadeInLeft, lineReveal } from "../lib/animations";
```

### Type Imports

Use `import type` for type-only imports. Enforced by TypeScript `verbatimModuleSyntax: true` in `tsconfig.app.json`.

```tsx
import type { ReactNode } from "react";
import type { Variants } from "motion/react";
import type { ProjectCard as ProjectCardType } from "../data/projects";
```

### Path Style

- **All relative paths.** No path aliases configured (no `@/` or `~/`).
- **No barrel files.** Each component is imported directly from its file.
- **File extensions:** Not included in imports (bundler resolution handles this).

### No `import React`

The automatic JSX runtime (`"jsx": "react-jsx"` in tsconfig) eliminates the need for `import React from 'react'`. Only import named hooks/utilities from `react` as needed: `useState`, `useEffect`, `useRef`, `useMemo`.

---

## Error Handling

### General Pattern

- **No try/catch blocks** in component code. The codebase relies on React's error boundaries (not explicitly configured) and browser defaults.
- **Optional chaining and nullish coalescing** used for safe property access. Example: `project.route ?? "#"` in `src/components/ProjectCard.tsx`.
- **Type narrowing** with explicit null checks. Example: `if (!targetEl) return;` in `src/components/Layout.tsx`.
- **Void operator** for fire-and-forget promises to satisfy `no-floating-promises`. Example in `src/pages/projects/ProjectMaxsimCli.tsx`:
  ```tsx
  void navigator.clipboard.writeText(text).then(() => { ... });
  ```
- **IntersectionObserver fallback:** Check for `typeof IntersectionObserver === "undefined"` before use, with a graceful fallback that adds CSS classes directly. Pattern in `src/components/Layout.tsx` and `src/pages/projects/ProjectHeistLine.tsx`.
- **No global error boundary component** is present in the codebase.

### Form Handling

- Forms use native HTML form submission (Formspree action URL) rather than JavaScript-controlled submission. No client-side validation beyond `required` attributes. See `src/sections/Contact.tsx`.

---

## Logging

- **No logging framework.** No `console.log`, `console.error`, or logging utility detected in the codebase. This is a static portfolio site with no server-side component.

---

## Comments

### When to Comment

- **Section dividers:** Use decorated comment blocks with `──` lines to separate logical sections within large files. Pattern from `src/sections/Skills.tsx` and `src/pages/projects/ProjectMaxsimCli.tsx`:
  ```tsx
  // ─── Types ────────────────────────────────────────────────────────────────────
  // ─── Doc Helpers ──────────────────────────────────────────────────────────────
  // ─── Tab 1: Webentwicklung ────────────────────────────────────────────────────
  // ─── Main Component ───────────────────────────────────────────────────────────
  ```
- **Inline JSX comments:** Short explanatory comments above JSX blocks. Example: `{/* Hero image */}`, `{/* Back button – fixed top-left */}`, `{/* Mobile: Burger */}`.
- **Behavioral notes:** Brief comments explaining non-obvious logic. Example: `// On mobile the header is always opaque so it's always visible as a pinned nav bar.` in `src/components/Header.tsx`.
- **ESLint disable comments:** Always include a justification after `--`. Example: `// eslint-disable-next-line react-hooks/set-state-in-effect -- sync with router navigation`.
- **CSS section headers:** Use `/* === SECTION NAME === */` style in `src/index.css`:
  ```css
  /* =========================================
     1. VARIABLES
     ========================================= */
  ```

### JSDoc/TSDoc

- **Minimal JSDoc usage.** Only seen on helper components in complex pages with `/** */` single-line doc comments. Example from `src/pages/projects/ProjectMaxsimCli.tsx`:
  ```tsx
  /** Swiss eyebrow label */
  function Eyebrow({ ... }) { ... }

  /** Theme-aware terminal block */
  function Terminal({ ... }) { ... }
  ```
- No JSDoc on exported components, hooks, or utility functions.

### Language

- **Code comments in English.** All variable names, function names, type names, and code comments use English.
- **Portfolio content in German.** All user-facing text (headings, descriptions, button labels, alt text, aria-labels, placeholder text) is written in German.

---

## Function Design

### Size

- **Small, focused components.** Most components are under 100 lines. Section components like `src/sections/Skills.tsx` (580 lines) and project pages like `src/pages/projects/ProjectMaxsimCli.tsx` (795 lines) are larger because they contain co-located data arrays and internal helper components.
- **No prescribed line limit.** Large files exist but are internally organized with section dividers.

### Parameters

- **Props destructured in function signature.** Always destructure directly in the parameter list with a typed props object:
  ```tsx
  export default function SectionHeading({ eyebrow, title, subtitle, align = "center", className = "" }: SectionHeadingProps) {
  ```
- **Default values:** Provide defaults for optional props in the destructuring. Examples: `align = "center"`, `className = ""`, `hasSiteHeader = false`, `interval = 2500`, `speed = 60`, `reverse = false`.

### Returns

- **Single JSX return.** Components return a single JSX expression. No early returns for loading/error states (no async data fetching).
- **Conditional rendering:** Use ternary expressions or `&&` / `? ... : null` patterns. Prefer `condition ? <Component /> : null` over `condition && <Component />` for clarity:
  ```tsx
  {eyebrow ? (
    <motion.div ...>...</motion.div>
  ) : null}
  ```
  Though `&&` also appears: `{isActive && (<motion.div ... />)}`.

---

## Module Design

### Exports

- **One default export per component file.** Every component file exports exactly one default function component.
  ```tsx
  export default function Header({ isHome }: HeaderProps) { ... }
  ```
- **Named exports for data/types.** Data files export types and constants with named exports:
  ```tsx
  export type ProjectTag = { ... };
  export type ProjectCard = { ... };
  export const projectCards: ProjectCard[] = [ ... ];
  export const projectFilters = [ ... ];
  ```
- **Named exports for animation variants.** `src/lib/animations.ts` exports all variants as named exports:
  ```tsx
  export const fadeInUp: Variants = { ... };
  export const staggerContainer: Variants = { ... };
  export const defaultViewport = { once: true, margin: "-10%" } as const;
  ```

### Barrel Files

- **No barrel files (index.ts).** Each module is imported directly by its full path. No `src/components/index.ts` or similar re-export files.

### Co-location

- **Data arrays co-located with components** when data is specific to that component. Examples:
  - `heroTags` in `src/sections/Hero.tsx`
  - `experiences` in `src/sections/Experience.tsx`
  - `items` (philosophy cards) in `src/sections/Philosophy.tsx`
  - `tabs`, `row1`, `row2`, `langs`, `gameAreas`, `devopsAreas`, `aiSteps` in `src/sections/Skills.tsx`
  - `COMMANDS`, `RUNTIMES`, `WORKFLOW_STEPS`, `DASHBOARD_FEATURES` in `src/pages/projects/ProjectMaxsimCli.tsx`
- **Shared data in `src/data/`.** Only `projects.ts` exists for data shared across multiple components (`ProjectCard` and `Projects` section).
- **Shared animation variants in `src/lib/`.** Only `animations.ts` exists for reusable Motion variants.

---

## Component Composition Patterns

### Section Components

Section components (`src/sections/*.tsx`) follow a consistent structure:
1. Render a `<section>` element with an `id` attribute for anchor navigation.
2. Use `swiss-section` or manual `bg-canvas border-t border-border py-24` classes for section spacing.
3. Use `swiss-container` or `max-w-6xl mx-auto px-6 sm:px-10` for content width.
4. Use the `SectionHeading` component for section titles with eyebrow text.
5. Wrap content in `motion` components for scroll-triggered entrance animations.

Example pattern from `src/sections/Projects.tsx`:
```tsx
<section id="projects" className="swiss-section">
  <div className="swiss-container">
    <SectionHeading eyebrow="Portfolio" title="Ausgewählte Projekte" className="mb-12" />
    {/* Section content */}
  </div>
</section>
```

### Project Detail Pages

Two patterns exist:

**Pattern 1: `ProjectShell` wrapper** for standard project pages. Used by `ProjectLikeTik.tsx`, `ProjectHeistLine.tsx`, `ProjectMrDork3.tsx`, `ProjectItchio.tsx`, `ProjectExambyte.tsx`, `ProjectCcTemplates.tsx`. Pass `title`, `subtitle`, `heroImage`, `heroAlt`, and optional `ctaLabel`/`ctaLink`. Content goes as children:
```tsx
<ProjectShell title="LikeTik" subtitle="..." heroImage={...} heroAlt="..." ctaLabel="..." ctaLink="...">
  <h2>Section Title</h2>
  <p>Content...</p>
</ProjectShell>
```

**Pattern 2: Custom layout** for immersive/showcase project pages. Used by `ProjectMaxsimCli.tsx`. Builds a completely custom page with its own hero, stats bar, and section components. Still includes the back-to-portfolio `Link`.

### Animation Patterns

- **Motion for React** (`motion/react`) is the animation library. Import `motion`, `AnimatePresence`, and `useInView` from `"motion/react"`.
- **Entrance animations:** Use `initial` / `animate` for page-load animations, `initial` / `whileInView` with `viewport={{ once: true }}` for scroll-triggered animations.
- **Common entrance:** `initial={{ opacity: 0, y: 24 }}` then `animate={{ opacity: 1, y: 0 }}` with `duration: 0.5-0.6, ease: "easeOut"`.
- **Staggered children:** Use `variants` with `staggerChildren` on container and individual `variants` on children.
- **Layout animations:** Use `layout` prop and `layoutId` for shared-element transitions (tab indicators, filter underlines).
- **AnimatePresence:** Wrap conditionally rendered elements for exit animations. Use `mode="wait"` for sequential transitions.
- **Hover effects:** Use `whileHover` for interactive elements: `whileHover={{ y: -4 }}`, `whileHover={{ scale: 1.02 }}`, `whileHover={{ x: 4 }}`.
- **Reusable variants:** Define in `src/lib/animations.ts` (`fadeInUp`, `fadeInLeft`, `staggerContainer`, `cardVariant`, `lineReveal`, `defaultViewport`).
- **Inline variants:** Also define variants inline in component files when specific to that component.

### Tailwind + CSS Variable Integration

- **Tailwind custom colors reference CSS variables.** Defined in `tailwind.config.js`: `fg: 'var(--sw-fg)'`, `canvas: 'var(--sw-bg)'`, `surface: 'var(--sw-surface)'`, `border: 'var(--sw-border)'`, `muted: 'var(--sw-muted)'`, `faint: 'var(--sw-text-faint)'`, `surface2: 'var(--sw-surface-light)'`.
- **Use Tailwind classes for these tokens.** Write `bg-canvas`, `text-fg`, `text-muted`, `border-border`, `bg-surface` instead of raw CSS variable references.
- **Inline styles for one-off values.** Use `style={{}}` when CSS variables are needed directly or for complex gradients/backgrounds that Tailwind cannot express:
  ```tsx
  style={{ background: "linear-gradient(to right, transparent, rgba(59,130,246,0.5), transparent)" }}
  ```
- **Swiss design system classes** (`swiss-btn-primary`, `swiss-card`, `swiss-heading-lg`, etc.) are used for standardized UI elements.
- **Responsive breakpoints:** Mobile-first with `sm:` (640px), `md:` (768px), `lg:` (1024px). Use `hidden md:block` / `md:hidden` for show/hide patterns.

### Accessibility Patterns

- **`aria-label`** on all interactive elements without visible text: buttons, icon links, navigation landmarks.
- **`aria-expanded`** and `aria-controls`** on toggle buttons (mobile menu).
- **`aria-hidden="true"`** on decorative SVG icons and visual-only elements.
- **`aria-current="page"`** on active navigation links.
- **`role="dialog"` and `aria-modal="true"`** on the mobile menu overlay.
- **`aria-label`** on `<nav>` elements: `"Hauptnavigation"`, `"Hauptmen\u00fc"`, `"Kontakt-Links"`.
- **`aria-labelledby`** on footer sections referencing heading IDs.
- **`aria-pressed`** on filter toggle buttons.
- **Minimum 44x44px touch targets.** Enforced with `min-h-[44px]` and `min-w-[44px]` on buttons and links.
- **Keyboard trap** implemented in mobile menu (Tab/Shift+Tab cycling, Escape to close) in `src/components/Header.tsx`.
- **`loading="lazy"`** on images (except the hero profile image which uses `loading="eager"`).
- **Focus-visible outlines** via CSS: `outline: 2px solid var(--sw-accent)`.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables transitions and animations, showing elements at full opacity.

### Theming

- **Dark mode is default.** CSS variables in `:root` define the dark theme.
- **Light mode via `html[data-theme="light"]`** overrides CSS variables.
- **Theme persisted in `localStorage`** under the key `"theme"`.
- **Flash prevention:** An inline `<script>` in `index.html` sets `data-theme` before React renders.
- **`ThemeToggle` component** reads from DOM attribute on mount, not from localStorage directly (DOM is source of truth since inline script runs first).

---

## Data File Conventions

### Structure (from `src/data/projects.ts`)

- Define types first with `export type`.
- Use `type` keyword (not `interface`) for all type definitions.
- Export typed constant arrays with explicit type annotation.
- Data objects include all fields inline (no spreading or inheritance).
- Image paths use `import.meta.env.BASE_URL` prefix for assets: `` `${import.meta.env.BASE_URL}assets/projects/...` ``.
- External URLs use full `https://` paths.

### Pattern

```tsx
export type ProjectTag = {
  label: string;
  className: string;
};

export type ProjectCard = {
  id: string;
  title: string;
  summary: string;
  tags: ProjectTag[];
  // ...
};

export const projectCards: ProjectCard[] = [
  {
    id: "heistline",
    title: "HeistLine",
    summary: "Prison-Escape & Heist MMO...",
    tags: [
      { label: "Unreal Engine", className: "tech-tag tech-tag-purple" },
    ],
    image: `${import.meta.env.BASE_URL}assets/projects/heistline/VaultHeist.png`,
    route: "/projekte/heistline",
    cta: "Mehr anzeigen",
    // ...
  },
];
```

---

## TypeScript Conventions

### Strict Mode Settings (from `tsconfig.app.json`)

- `"strict": true` -- enables all strict type-checking options.
- `"noUnusedLocals": true` -- flags unused local variables.
- `"noUnusedParameters": true` -- flags unused function parameters.
- `"noFallthroughCasesInSwitch": true` -- prevents switch case fallthrough.
- `"noUncheckedSideEffectImports": true` -- checks side-effect imports.
- `"verbatimModuleSyntax": true` -- requires `import type` for type-only imports.
- `"erasableSyntaxOnly": true` -- restricts to syntax that can be erased (no enums or namespaces).

### Type vs Interface

- **Always use `type`, never `interface`.** This is a project-wide convention enforced in CLAUDE.md. All props, data shapes, and union types use `type`:
  ```tsx
  type HeaderProps = { isHome: boolean };
  type Theme = "light" | "dark";
  type TabId = "webentwicklung" | "spieleentwicklung" | ...;
  ```

### Type Assertions

- **Non-null assertion** on `document.getElementById('root')!` in `src/main.tsx`.
- **`as` casting** used for DOM element types: `document.querySelector("header") as HTMLElement | null`, `root.getAttribute("data-theme") as Theme | null`.
- **`as const`** for immutable objects: `export const defaultViewport = { once: true, margin: "-10%" } as const;` and `ease: "easeOut" as const` in variant objects.

### Generic Usage

- Minimal generic usage. `querySelectorAll<HTMLElement>(...)` for DOM queries. No custom generic types defined.
