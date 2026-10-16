# Harness configuration

Default mode: **efficient**. A task may override this mode. The same eight acceptance floors apply in
every mode.

- project-id: sven-maibaum-website
- canonical harness: `C:\Users\conta\harness-workflow` (`SPEC/`, `brain/` and `commands/` resolve there)
- binding project document: `WEBSITE.md`
- language: conversation German, artefacts English, user-facing copy German and English

## Owner's routing constraints (2026-10-16)

Set by Sven when he chose the mode. His words, verbatim (dictated; "Anti-Gravity" = Antigravity):

> „Wir möchten an sich wahrscheinlich stärker mit Claude Code arbeiten. Das heißt an sich einfach
> Claude-Modelle, die da draufgeworfen werden. Und also je nachdem, wenn die Aufgabe in Codex gestartet
> wird, dann sollte mit Codex gearbeitet werden. Wenn sie in Claude Code gestartet wird, dann sollte sie
> mit Claude Code bearbeitet werden. Und vielleicht mal so ein GPT-6.1 Sol Agent als Fremdreviewer zum
> Beispiel. Oder ein Anti-Gravity Argon gibt es auch mittlerweile. Kann genutzt werden oder über
> Anti-Gravity kann auch Opus 5.5 oder Sonnet 5.5 genutzt werden. Grundsätzlich gesehen, wenn wir mit
> Claude Code arbeiten, sollten die Aufgaben auch eher Richtung Opus 5.5 verteilt werden, weil Sonnet 5.5
> pro Aufgabe an sich teurer ist als Opus, weil Opus intelligenter ist, obwohl es halt teurere
> Tokenkosten hat, braucht halt einfach Sonnet meistens doppelt bis dreimal so lang, was das Ganze am Ende
> teurer macht. Haiku wird ja autonom einfach so verwendet, Haiku kann auch einfach so verwendet werden,
> für ganz, ganz kleine Sachen […]“
>
> „Kannst du an sich initialisieren auf Efficient Mode. Aber halt mit diesen Models. Das ist halt, wenn
> wir in Claude Code arbeiten, arbeiten wir mit Claude Models. Wenn wir mit Codex arbeiten, arbeiten wir
> mit Codex Models. Du hast Anti-Gravity zur Verfügung, um zum Beispiel auch mal Gemini 4 Argon zu
> aktivieren. Auf Low, Mittel oder Hoch. Du hättest auch über Anti-Gravity sowas wie Opus 5.5 oder
> Sonnet 5.5 zur Verfügung. Tatsächlich. Sind auch noch Kontingente, die man verbrauchen kann, gerne.“
>
> „Also manchmal, wir möchten super token-effizient arbeiten. Das heißt, manchmal braucht man vielleicht
> gar keinen Sub-Agent, sondern kann das einfach direkt machen, wenn es nur irgendwas Kleines ist. Da muss
> man nicht immer unbedingt einen Sub-Agent für starten.“

What the orchestrator takes from this:

1. **The host follows the start.** A task started in Claude Code is worked with Claude models; a task
   started in Codex is worked with Codex models.
2. **Claude Code default: Opus 5.5.** The owner's cost-per-solved-task judgement is that Sonnet 5.5 is
   usually more expensive per task than Opus 5.5 because it needs two to three times as long. Haiku is
   for very small, mechanical tasks (finding, extracting, renaming).
3. **Cross-model review is welcome.** A GPT-6.1 Sol agent (Codex) as external reviewer; Antigravity
   with Gemini 4 Argon (low, medium or high) is available, and Antigravity also offers Opus 5.5 and
   Sonnet 5.5. The owner says those quotas may be used.
4. **No sub-agent for small things.** If a task is small, the running agent does it directly. The
   independent review floor is unaffected.

The superseded rule from the old `CLAUDE.md` (2026-02-25: „Agent Teams verwenden, ausschließlich Modell
Sonnet 4.6 und Haiku“) no longer applies.
