# Sven Maibaum Website – agent instructions

Before any project work, read [WEBSITE.md](WEBSITE.md). It is the shared, binding reference
for the personal website at `sven-maibaum.com`: its goals, fixed project decisions,
programming principles and working methods. Follow the provisions relevant to the task.
Keep these provisions in WEBSITE.md rather than duplicating them here.

## Protected project instructions

Treat `WEBSITE.md`, `AGENTS.md` and `CLAUDE.md` as read-only by default.
Do not edit, rewrite, reformat, replace, rename or delete them unless the user
explicitly requests or authorizes the specific change in the current task.
A general implementation, refactoring, cleanup or documentation request is not
permission to modify these files. Earlier permission to create or edit them is
not standing permission for later tasks or other agents.

When the user explicitly asks to develop these documents together, make only
the requested changes and preserve all unrelated content. Never change WEBSITE.md
to fit an implementation, and never remove or weaken this protection without
explicit user authorization. If a task conflicts with these documents, report
the conflict and obtain explicit direction before changing them.

## Who is responsible for what

- The Workflow Harness decides how work is understood, cut, routed, verified and
  recorded. Use the installation from `C:\Users\conta\harness-workflow` (Sven's PC).
  Read `.harness/config.md` before dispatching work; the default mode is `efficient`
  unless a task overrides it, and the owner's routing constraints are recorded there.
- The global Harness brain stores only findings that generalise across projects.
- Project-only facts and environment traps live in `.harness/notes/`; run artefacts
  live in `.harness/runs/` and are not committed.
- A frozen Goal in `.harness/spec.md` is read-only after approval; never rewrite it
  to fit an implementation.

## Safety rails

One-line pointers to provisions whose violation would be severe; the binding text is
in WEBSITE.md.

- Truth (WEBSITE.md, „Wahrheit vor Wirkung“): never invent names, numbers, clients,
  quotes, dates or results for the site; a missing fact is marked `[OFFEN: …]` and
  never shipped to `main`.
- Version control (WEBSITE.md, „Feste Projektentscheidungen“): every push to `main`
  deploys to `sven-maibaum.com`; commit and push after each change, but only checked
  work.
- Public repository (WEBSITE.md, „Feste Projektentscheidungen“): never commit secrets,
  `.env` files, internal documents, customer or contract data.
- Credentials (WEBSITE.md, „Zugangsdaten“): never print, copy or commit keys or tokens;
  they live only in the local `.env` or in the repository's GitHub settings, and
  anything prefixed `VITE_` ends up in the public bundle.
- Language (WEBSITE.md, „Sprache“): conversation with Sven in German; code, identifiers
  and agent artefacts in English; site text in German and English.
