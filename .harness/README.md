# Harness — project-local

The harness lives in the `harness-workflow` repo and its skills are installed globally in
`~/.claude/skills`. Nothing is vendored here.

| Path | |
|---|---|
| `config.md` | Default mode (`efficient`) and the owner's routing constraints. |
| `spec.md` | The frozen Goal for the current run. Read-only once agreed. |
| `run-prompt.md` | What starts the run: `/harness .harness/run-prompt.md` |
| `notes/` | Project knowledge: environment traps, conventions, what this codebase expects. Stays here. |
| `runs/` | Per-run artefacts a later observation can be checked against. Gitignored. |
| `survey-*.md` | Point-in-time surveys of the project's real state. |

The binding project document is `WEBSITE.md` in the repository root; research it cites is versioned
under `docs/research/`. There is no other project knowledge store.

Observations about **models, cuts, check kinds, failure sites and general craft** go to the global
brain at `harness-workflow/brain/` — those generalise. Anything that only makes sense inside this
project stays in `notes/`.

Rule of thumb: if the sentence still makes sense with the project's name removed, it belongs in the
global brain. If it only makes sense here, it stays here.
