# Goal — Trust foundation: working contact, correct legal pages, no unconsented third parties, tests

Status: DRAFT — not frozen. Freezes on the owner's explicit yes.

## GOAL

Make `sven-maibaum.com` trustworthy before any redesign: the contact form sends in production, the legal
pages are complete and true, nothing loads from third parties on page view without consent, removed pages
are gone, known false or broken content is fixed, and a test foundation (Vitest and Playwright, run in CI
before deploy) proves it.

## CONTEXT

`WEBSITE.md` is the binding reference. The survey `.harness/survey-*.md` lists the defects with file and
line. The legal reading is in `docs/research/2026-10-16-legal.md`. Every push to `main` deploys; the owner
allows committing and pushing checked work without asking.

## SOURCES OF TRUTH

1. `WEBSITE.md` (top rule „Wahrheit vor Wirkung“, sections „Seitenstruktur“, „Rechtliches“, „Tests: erst
   rot, dann grün“, „Fertig heißt fertig“).
2. `docs/research/2026-10-16-legal.md` for legal facts.
3. The owner's statements; anything not stated there is not invented.

## SCOPE

- CI provides the EmailJS values to the build; the form sends; failure shows the e-mail address as the
  next step.
- Fonts Geist and Geist Mono self-hosted; Font Awesome link and Google preconnects removed;
  `placehold.co` images removed.
- One own consent banner (categories „Statistik“ and „Externe Medien“, reject as easy as accept, nothing
  preselected, reopen link in every footer); Steam widgets load only after „Externe Medien“ consent (also
  grantable at the widget); before that, an own image with a store link.
- The analytics tool the owner chooses, loaded only after „Statistik“ consent, tracking SPA route changes,
  never capturing contact-form input.
- Datenschutzerklärung corrected per `WEBSITE.md` „Rechtliches“; no placeholders; numbering fixed.
- Routes `/showcase` and `/agb` removed with their components, prerender entries and sitemap entries.
- `src/sections/Experience.tsx` experience claim replaced by the owner's fact (over ten years of programming).
- Sitemap lists every indexable route; JSON-LD image points to an existing file; the Wallet button is hidden
  while `sven_maibaum.pkpass` does not exist.
- Vitest and Playwright set up, with scripts in `package.json` and a test step in `deploy.yml` before deploy.

## NON-SCOPE

Visual redesign, motion concept, „Kein KI-Look“ rework, English version, MAY STUDIOS / Sentrix split on the
site, career facts other than the experience claim, Discord link, canonical-domain change, image
optimisation, code splitting.

## CONSTRAINTS

- `WEBSITE.md`, `AGENTS.md`, `CLAUDE.md` are read-only for this run.
- No new runtime third party. No secret ever printed or committed; only public EmailJS values get the
  `VITE_` prefix.
- Tests never send through EmailJS.
- Lint baseline: 0 errors; the existing warning in `src/components/Layout.tsx` may stay, no new warning.
- Push only checked work; each push deploys.

## ACCEPTANCE CRITERIA

- **AC-1** Given the deployed site, when the home page JavaScript is inspected, then the three EmailJS
  constants are non-empty; and when the owner sends a test message through the live form, then it arrives
  (owner confirms).
- **AC-2** Given a fresh browser with no stored consent, when each indexable route is loaded and scrolled to
  the end, then no request leaves for any host other than `sven-maibaum.com` (Playwright network log).
- **AC-3** Given a Steam project page, when the visitor has not consented, then no request goes to
  `steampowered.com`; when the visitor consents at the widget, then the widget loads.
- **AC-3b** Given consent to „Statistik“, when the visitor navigates between three routes, then the
  analytics tool records three page views; given rejection or no choice, then no request goes to the
  analytics host; and the footer link reopens the choice and a withdrawal stops further requests.
- **AC-4** Given `/datenschutz`, when it is read, then it contains no bracketed placeholder, names EmailJS
  Pte. Ltd. with standard contractual clauses, describes GitHub log retention by criterion, names Valve for
  the widget, describes the analytics tool with consent as legal basis, and states that fonts are served
  locally.
- **AC-5** Given the build, when `/showcase` or `/agb` is requested, then the not-found page is shown, and
  neither path appears in `dist/` prerender output or `public/sitemap.xml`.
- **AC-6** Given `public/sitemap.xml`, when compared with the router's indexable routes, then every route is
  listed exactly once (automated test).
- **AC-7** Given the site, when searched for „über 6 Jahren Erfahrung“, `placehold.co` or a link to a
  missing local file, then nothing is found (automated test where possible).
- **AC-8** Given CI, when a push to `main` runs, then lint, build, Vitest and Playwright run before deploy,
  and a failing test blocks the deploy.
- **AC-9** Every new test was seen failing for the intended reason before it passed (red-green evidence
  under `.harness/runs/`).

## ASSUMPTIONS AND OPEN QUESTIONS

- Who sets the EmailJS values in the repository's GitHub settings: the owner, or an agent via `gh` from the
  local `.env` without displaying them? (owner decides)
- Which analytics tool (owner decides after the comparison in the run notes).
- Exambyte has no real image in the repository; the card shows no image until the owner provides one.
- Old `/showcase` and `/agb` URLs show the not-found page rather than redirecting.
