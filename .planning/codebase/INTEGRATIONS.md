# INTEGRATIONS.md

> Generated: 2026-03-09

---

## APIs & External Services

This is a static portfolio SPA with no backend API calls. All content is hardcoded in TypeScript data files and components.

| Service | Type | Purpose | SDK/Client |
|---------|------|---------|------------|
| Google Fonts | CDN | Typography (Geist, Geist Mono) | `<link>` tag in `index.html` |
| cdnjs (Font Awesome 6.4.0) | CDN | Icon library | `<link>` tag in `index.html` |
| GitHub Pages | Hosting | Static site deployment | GitHub Actions workflow |

No REST APIs, GraphQL endpoints, or third-party SDKs are consumed at runtime.

---

## Data Storage

### Databases

None. This is a purely static site with no server-side storage.

### File Storage

| Type | Location | Purpose |
|------|----------|---------|
| Static images | `public/assets/images/` | Profile photos, hero background |
| Project images | `public/assets/projects/{project}/` | Per-project screenshots and galleries |
| SVG assets | `public/assets/projects/{project}/*.svg` | Project preview graphics |
| Favicon | `public/assets/favicon.ico` | Browser tab icon |

### Caching

No application-level caching. Relies on browser caching and GitHub Pages CDN headers.

---

## Authentication & Identity

Not applicable. No authentication, no user accounts, no login flows. The site is publicly accessible with no gated content.

---

## Monitoring & Observability

### Error Tracking

Not configured. No Sentry, Bugsnag, or similar error tracking service.

### Logging

No structured logging. Browser `console.log` only (in `scripts/prerender.mjs` for build output).

### Analytics

Not detected in the codebase. No Google Analytics, Plausible, Umami, or similar analytics scripts.

---

## CI/CD & Deployment

### Pipeline

| Stage | Tool | Config |
|-------|------|--------|
| Source control | Git + GitHub | Repository at `github.com/maystudios` |
| CI | GitHub Actions | `.github/workflows/deploy.yml` |
| Build | npm + Vite + prerender script | `npm run build` (tsc + vite build + prerender) |
| Deploy | GitHub Pages (actions/deploy-pages@v4) | Static files from `dist/` |

### Workflow Details (`deploy.yml`)

- **Trigger**: Push to `main` branch, or manual `workflow_dispatch`
- **Runner**: `ubuntu-latest`
- **Node version**: 20 (via `actions/setup-node@v4`)
- **Steps**: Checkout -> Setup Node (with npm cache) -> `npm ci` -> `npm run build` (with `VITE_BASE_PATH=/`) -> Upload artifact -> Deploy to Pages
- **Concurrency**: Group `pages`, cancels in-progress deployments
- **Permissions**: `contents: read`, `pages: write`, `id-token: write`

### Domain Configuration

| Property | Value |
|----------|-------|
| Custom domain | `www.sven-maibaum.com` |
| CNAME file | `public/CNAME` (contents: `www.sven-maibaum.com`) |
| Canonical URL | `https://www.sven-maibaum.com/` |

---

## Environment Configuration

### Required Environment Variables

| Variable | Used In | Purpose | Default |
|----------|---------|---------|---------|
| `VITE_BASE_PATH` | `vite.config.ts` | Base path for asset URLs in production | `/sven-maibaum-website/` (fallback in code); CI sets `/` |

### Environment Files

| File | Committed | Purpose |
|------|-----------|---------|
| `.env.production` | Yes (exists) | Production environment variables (contains `VITE_BASE_PATH`) |

### Secrets

No secrets required. No API keys, no auth tokens, no service credentials. The GitHub Pages deploy uses the built-in `GITHUB_TOKEN` via `id-token: write` permissions.

---

## Webhooks & Callbacks

### Incoming

None. No webhook endpoints (static site, no server).

### Outgoing

None. No outbound webhook calls.

---

## Third-Party Content / SEO Integrations

| Integration | Implementation | Files |
|-------------|---------------|-------|
| Open Graph meta tags | `<meta property="og:*">` in `index.html` + prerendered pages | `index.html`, `scripts/prerender.mjs` |
| Twitter Card meta tags | `<meta name="twitter:*">` in `index.html` + prerendered pages | `index.html`, `scripts/prerender.mjs` |
| JSON-LD structured data | `<script type="application/ld+json">` inline in `index.html` | `index.html` (Person + WebSite schema) |
| Sitemap | Static XML file | `public/sitemap.xml` |
| robots.txt | Static text file | `public/robots.txt` |
| Canonical URLs | `<link rel="canonical">` per page | `index.html`, `scripts/prerender.mjs` |

### External Links (referenced in structured data / meta)

| Service | URL | Purpose |
|---------|-----|---------|
| LinkedIn | `https://www.linkedin.com/in/sven-maibaum/` | Social profile link |
| GitHub | `https://github.com/maystudios` | Code profile link |
