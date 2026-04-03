import ProjectShell from "../../components/ProjectShell";

const base = import.meta.env.BASE_URL;

export default function ProjectMaxsimCli() {
  return (
    <ProjectShell
      hasSiteHeader
      title="maxsimcli"
      subtitle="Meta-Prompting und Context Engineering für Claude Code. Strukturierte Prompts, dedizierte Agenten und spec-driven Planning. Jeder Task bekommt einen eigenen Subagenten mit frischem Kontext."
      heroImage={`${base}assets/projects/maxsimcli/preview-v3.svg`}
      heroAlt="maxsimcli – Meta-prompting CLI für strukturiertes Agentic Coding"
      ctaLabel="Dokumentation auf maxsimcli.dev"
      ctaLink="https://maxsimcli.dev"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface2 mb-8">
        {[
          { label: "Typ", value: "CLI / Slash Commands" },
          { label: "Sprache", value: "TypeScript" },
          { label: "Lizenz", value: "MIT" },
          { label: "Status", value: "Aktiv" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="text-xs uppercase tracking-widest text-faint mb-1">{stat.label}</p>
            <p className="font-display font-semibold text-fg text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Overview */}
      <h2>Das Problem: Context Rot</h2>
      <p>
        Je länger eine KI-Session dauert, desto schlechter wird die Qualität. Der Kontext füllt
        sich, architektonische Entscheidungen gehen verloren, Fehler wiederholen sich.
        <strong> maxsimcli</strong> löst das durch Context Engineering: Arbeit wird in Phasen
        aufgeteilt und jeder Task an einen eigenen Subagenten mit frischem Kontext delegiert.
        GitHub Issues dienen als Single Source of Truth, damit nichts zwischen Sessions verloren geht.
      </p>
      <p>
        Das Tool installiert 14 Slash Commands, 4 spezialisierte Agenten, 15 Skills und 18 Workflows
        direkt in das <code>.claude/</code>-Verzeichnis. Kein separater API-Key nötig, keine
        zusätzlichen Kosten neben dem bestehenden Claude-Code-Abo.
      </p>

      {/* How It Works */}
      <h2>Workflow: Vier Schritte zum Feature</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            step: "01",
            title: "Installieren",
            cmd: "npx maxsimcli@latest",
            desc: "Commands, Workflows und Agenten landen im .claude/-Verzeichnis. Ein Befehl, fertig.",
          },
          {
            step: "02",
            title: "Initialisieren",
            cmd: "/maxsim:init",
            desc: "Erstellt ein GitHub Project Board, Issue-Labels und Milestones. Sammelt Projektkontext.",
          },
          {
            step: "03",
            title: "Planen",
            cmd: "/maxsim:plan",
            desc: "Researcher-Agent untersucht die Codebase. Planner-Agent erstellt strukturierte Task-Issues auf GitHub.",
          },
          {
            step: "04",
            title: "Ausführen",
            cmd: "/maxsim:execute",
            desc: "Executor-Agenten setzen Pläne in parallelen Wellen um. Jeder Plan bekommt einen atomaren Commit.",
          },
        ].map((step) => (
          <div key={step.step} className="bg-surface border border-border p-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display font-bold text-brandLight text-lg">{step.step}</span>
              <h3 className="font-display font-bold text-fg text-base">{step.title}</h3>
            </div>
            <code className="text-xs text-brandLight block mb-2">{step.cmd}</code>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* 4 Agents */}
      <h2>Vier spezialisierte Agenten</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            name: "Researcher",
            desc: "Untersucht die Codebase, sammelt technischen Kontext. Kann optional Brave Search für externe Recherche nutzen.",
            color: "border-t-emerald-400",
          },
          {
            name: "Planner",
            desc: "Verwandelt Research in strukturierte GitHub Issues mit Task-Abhängigkeiten und Wellen-Gruppierung.",
            color: "border-t-blue-400",
          },
          {
            name: "Executor",
            desc: "Liest Pläne, implementiert Änderungen, committet atomar. Unabhängige Pläne laufen parallel in Git Worktrees.",
            color: "border-t-amber-400",
          },
          {
            name: "Verifier",
            desc: "Prüft gegen 5 Quality Gates: Tests, Build, Lint, Spec Compliance und Code Review.",
            color: "border-t-violet-400",
          },
        ].map((agent) => (
          <div key={agent.name} className={`bg-surface border border-border border-t-2 ${agent.color} p-5`}>
            <h3 className="font-display font-bold text-fg text-sm mb-2">{agent.name}</h3>
            <p className="text-muted text-xs leading-relaxed">{agent.desc}</p>
          </div>
        ))}
      </div>

      {/* Key Features */}
      <h2>Features</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Context Engineering",
            desc: "Jeder Task wird an einen Subagenten mit frischem Kontext delegiert. Die Hauptsession bleibt sauber.",
          },
          {
            title: "Spec-Driven Development",
            desc: "Phasen, Research, Verifikation und UAT. Jeder Schritt landet in Markdown und überlebt Session-Wechsel.",
          },
          {
            title: "Wave-Based Parallelization",
            desc: "Tasks werden in Abhängigkeitswellen gruppiert und parallel ausgeführt. Jede Welle nutzt isolierte Subagenten.",
          },
          {
            title: "5 Verification Gates",
            desc: "Tests, Build, Lint, Spec Compliance und Code Review prüfen jede Phase vor dem Abschluss. Strict Mode konfigurierbar.",
          },
          {
            title: "GitHub als Single Source of Truth",
            desc: "Project Board mit 5 Spalten, Issue-Tracking, Labels und Milestones. Kein lokaler State, der verloren gehen kann.",
          },
          {
            title: "3 Model Profile",
            desc: "Quality (Opus), Balanced (Mix) und Budget (Sonnet/Haiku). Pro Agent und Projekt überschreibbar.",
          },
          {
            title: "15 Skills & 18 Workflows",
            desc: "TDD, Code Review, Debugging, Brainstorming, Security Audits. Eigene Skills in .claude/skills/ überleben Upgrades.",
          },
          {
            title: "Branching Strategies",
            desc: "Erstellt automatisch Git-Branches pro Phase. Templates wie maxsim/phase-{N}-task-{id} halten das Repo aufgeräumt.",
          },
          {
            title: "Self-Improvement Loop",
            desc: "Erfasst Learnings aus jeder Session. Autoresearch misst Metriken, behält Verbesserungen und verwirft Regressionen.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-surface border border-border p-5 hover:border-brand transition-colors duration-200"
          >
            <h4 className="font-display font-semibold text-fg text-sm mb-2">{feature.title}</h4>
            <p className="text-muted text-xs leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Commands */}
      <h2>Befehle</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-surface border border-border p-6">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Kern-Workflow</h3>
          <ul className="space-y-2">
            {[
              { cmd: "/maxsim:go", desc: "Auto-Erkennung: macht das Richtige basierend auf Projektstatus" },
              { cmd: "/maxsim:init", desc: "GitHub-Integration und Project Board aufsetzen" },
              { cmd: "/maxsim:plan", desc: "Phase planen mit Research und Task-Breakdown" },
              { cmd: "/maxsim:execute", desc: "Pläne mit parallelen Agenten ausführen" },
              { cmd: "/maxsim:quick", desc: "Schnelle Tasks ohne formale Phase" },
              { cmd: "/maxsim:progress", desc: "Status vom GitHub Board mit Empfehlung" },
            ].map((item) => (
              <li key={item.cmd} className="flex gap-3 items-start">
                <code className="text-xs text-brandLight shrink-0 mt-0.5">{item.cmd}</code>
                <span className="text-xs text-muted">{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface border border-border p-6">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Autonome Loops & Tools</h3>
          <ul className="space-y-2">
            {[
              { cmd: "/maxsim:debug", desc: "Systematisches Debugging: Reproduzieren, Hypothese, Isolieren, Fix" },
              { cmd: "/maxsim:fix-loop", desc: "Autonome Fehlerreparatur bis null Fehler" },
              { cmd: "/maxsim:debug-loop", desc: "Autonomes Bug-Hunting mit Hypothesis-Testing" },
              { cmd: "/maxsim:improve", desc: "Optimierungsloop gegen beliebige Metrik" },
              { cmd: "/maxsim:security", desc: "STRIDE + OWASP Security Audit (read-only)" },
              { cmd: "/maxsim:settings", desc: "Konfiguration anpassen" },
            ].map((item) => (
              <li key={item.cmd} className="flex gap-3 items-start">
                <code className="text-xs text-brandLight shrink-0 mt-0.5">{item.cmd}</code>
                <span className="text-xs text-muted">{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Model Profiles */}
      <h2>Model Profile</h2>
      <div className="bg-surface border border-border overflow-hidden">
        <div className="grid grid-cols-5 gap-px bg-border">
          {["Profil", "Planner", "Executor", "Researcher", "Verifier"].map((h) => (
            <div key={h} className="bg-surface px-4 py-3">
              <span className="text-xs uppercase tracking-widest text-faint">{h}</span>
            </div>
          ))}
        </div>
        {[
          { profile: "quality", planner: "Opus", executor: "Opus", researcher: "Sonnet", verifier: "Opus" },
          { profile: "balanced", planner: "Opus", executor: "Sonnet", researcher: "Sonnet", verifier: "Sonnet", isDefault: true },
          { profile: "budget", planner: "Sonnet", executor: "Sonnet", researcher: "Haiku", verifier: "Sonnet" },
        ].map((row) => (
          <div key={row.profile} className="grid grid-cols-5 gap-px bg-border">
            <div className="bg-surface px-4 py-3 flex items-center gap-2">
              <span className="font-mono text-xs text-fg">{row.profile}</span>
              {row.isDefault && <span className="tech-tag tech-tag-blue text-[0.6rem] !mb-0 !mr-0">default</span>}
            </div>
            {[row.planner, row.executor, row.researcher, row.verifier].map((val, j) => (
              <div key={j} className="bg-surface px-4 py-3 font-mono text-xs text-muted">
                {val}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Installation */}
      <h2>Installation</h2>
      <div className="bg-surface border border-border p-6 lg:p-8">
        <p className="mb-4">
          Ein Befehl installiert alles ins <code>.claude/</code>-Verzeichnis. Kein globales Binary nötig.
        </p>
        <div className="bg-canvas border border-border p-4 font-mono text-sm mb-4">
          <span className="text-brandLight select-none">$ </span>
          <span className="select-all text-green-400">npx maxsimcli@latest</span>
        </div>
        <p className="mb-4">
          Danach im Projektverzeichnis:
        </p>
        <div className="bg-canvas border border-border p-4 font-mono text-sm">
          <span className="text-brandLight select-none">$ </span>
          <span className="text-green-400">/maxsim:init</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-faint mb-2">Voraussetzungen</p>
            <ul className="space-y-1 text-xs text-muted">
              <li>Node.js 22+</li>
              <li>Claude Code</li>
              <li>Git</li>
              <li>GitHub CLI (gh)</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-faint mb-2">Was installiert wird</p>
            <ul className="space-y-1 text-xs text-muted">
              <li>14 Slash Commands</li>
              <li>4 Agent-Definitionen</li>
              <li>15 Skills, 18 Workflows</li>
              <li>8 Hooks, Tool-Binary</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <h3>Technologien</h3>
      <div className="my-4">
        <span className="tech-tag tech-tag-blue">TypeScript</span>
        <span className="tech-tag tech-tag-purple">Claude Code</span>
        <span className="tech-tag tech-tag-teal">Open Source</span>
        <span className="tech-tag tech-tag-green">Node.js</span>
        <span className="tech-tag tech-tag-orange">Markdown Prompts</span>
        <span className="tech-tag tech-tag-gray">GitHub API</span>
        <span className="tech-tag tech-tag-red">npm</span>
      </div>

      {/* Links */}
      <h2>Links</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { label: "GitHub", href: "https://github.com/maystudios/maxsim", sub: "Source Code & Issues" },
          { label: "npm", href: "https://www.npmjs.com/package/maxsimcli", sub: "Package Registry" },
          { label: "Website", href: "https://maxsimcli.dev", sub: "Dokumentation & Guides" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface border border-border p-6 hover:border-brand transition-colors duration-200 block no-underline"
          >
            <h3 className="font-display font-bold text-fg text-sm mb-1">{link.label}</h3>
            <p className="text-xs text-faint">{link.sub}</p>
          </a>
        ))}
      </div>
    </ProjectShell>
  );
}
