# sven-maibaum.com

Personal website of Sven Maibaum: projects, products and contact for development work.
Live at <https://sven-maibaum.com>.

The binding project reference is [WEBSITE.md](WEBSITE.md) (German). Agents start at
[AGENTS.md](AGENTS.md).

## Stack

Vite, React, TypeScript and Tailwind CSS 3, with React Router and Motion. After the build,
`scripts/prerender.mjs` writes a static `index.html` per route with its own metadata.
Every push to `main` builds and deploys to GitHub Pages through
`.github/workflows/deploy.yml`.

## Commands

```bash
npm ci            # install from the lockfile
npm run dev       # development server
npm run build     # type check, production build and prerender
npm run lint      # ESLint
npm run preview   # serve the production build
```

The contact form needs `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` and
`VITE_EMAILJS_PUBLIC_KEY` in a local `.env` (not committed). CI builds with Node 20.
