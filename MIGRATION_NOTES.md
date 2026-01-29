# Migration Notes

Mapping from the legacy HTML site to the new React components.

- `index.html` Hero → `src/sections/Hero.tsx`
- `index.html` About → `src/sections/About.tsx`
- `components/philosophy.html` + `js/philosophy.js` → `src/sections/Philosophy.tsx`
- `index.html` Experience → `src/sections/Experience.tsx`
- `index.html` Projects grid → `src/sections/Projects.tsx` + `src/data/projects.ts`
- Project pages:
  - `pages/projekt-heistline.html` → `src/pages/projects/ProjectHeistLine.tsx`
  - `pages/projekt-mrdork3.html` → `src/pages/projects/ProjectMrDork3.tsx`
  - `pages/projekt-liketik.html` → `src/pages/projects/ProjectLikeTik.tsx`
  - `pages/projekt-exambyte.html` → `src/pages/projects/ProjectExambyte.tsx`
  - `pages/projekt-ki-marketing.html` → `src/pages/projects/ProjectKIMarketing.tsx`
  - `pages/projekt-itchio-games.html` → `src/pages/projects/ProjectItchio.tsx`
- `pages/architect-showcase.html` → `src/pages/ArchitectShowcase.tsx`
- Legal pages:
  - `pages/impressum.html` → `src/pages/Impressum.tsx`
  - `pages/datenschutz.html` → `src/pages/Datenschutz.tsx`
  - `pages/agb.html` → `src/pages/AGB.tsx`
- `404.html` → `src/pages/NotFound.tsx`
