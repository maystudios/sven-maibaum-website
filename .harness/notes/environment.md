# Environment notes

Established 2026-10-16. Unverified points are marked.

## Machine and toolchain

- Windows 11, Git Bash and PowerShell. Local Node is v25.2.1; CI builds with Node 20 (`deploy.yml`).
- `node_modules` was absent on 2026-10-16; `npm ci` installs 254 packages in about 30 s.
- `npm run build` passes; `npm run lint` reports 0 errors and 1 known warning
  (`src/components/Layout.tsx:16`, `react-hooks/exhaustive-deps`, missing `location.hash`). Treat that
  warning as the baseline until it is fixed; a new warning is a regression.
- Git warns "LF will be replaced by CRLF" on edited files; harmless, no `.gitattributes` exists.
- The Windows build produces different JS hashes than the Linux CI build. Compare live assets against
  the CI build log, not against a local `dist/`.

## Deployment traps

- The deploy workflow can be disabled in GitHub. It was disabled manually on 2026-10-09 16:34, which
  took the whole site offline ("There isn't a GitHub Pages site here" on every URL). Re-enabled
  2026-10-16 on the owner's word. Check `gh api repos/maystudios/sven-maibaum-website/actions/workflows/237245762 --jq .state`
  when the site returns that page.
- GitHub Pages serves `sven-maibaum.com`; `www.sven-maibaum.com` redirects there, and slashless paths
  redirect to the slash form (`/links` → `/links/`). `public/CNAME` says `www.sven-maibaum.com`, but
  with Actions-based Pages the custom domain comes from the repository settings (`sven-maibaum.com`).
- The CI build has no EmailJS values: `deploy.yml` passes only `VITE_BASE_PATH`, and the repository has
  no Actions secrets or variables. In the live bundle the three EmailJS constants compile to `void 0`,
  so the contact form cannot send in production (read 2026-10-16). Locally `.env` provides them.
- Fastly caches 404 pages for a short time (`Age` header); add a query string when checking a fix.

## Third parties at runtime (2026-10-16)

Google Fonts CSS (Geist) on every page, unused Font Awesome CSS from cdnjs, two Steam widget iframes
(set a `sessionid` cookie, observed via curl only), `placehold.co` images for Exambyte, EmailJS on
submit. Details and legal reading: `docs/research/2026-10-16-legal.md`.

## Owner-only actions

- GitHub repository settings: Actions variables or secrets for EmailJS, Pages settings, enabling or
  disabling workflows.
- EmailJS account and template; which mailbox receives the form (unknown, unverified).
- Facts about the business (headcount, turnover, W-IdNr, register entry) and the HeistLine Discord
  invite link.
