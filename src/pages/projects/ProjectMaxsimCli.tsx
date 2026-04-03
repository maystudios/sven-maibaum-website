import ProjectShell from "../../components/ProjectShell";

const base = import.meta.env.BASE_URL;

export default function ProjectMaxsimCli() {
  return (
    <ProjectShell
      hasSiteHeader
      title="maxsimcli"
      subtitle="Open-Source-CLI für KI-gestütztes Software-Engineering. Meta-prompting und spec-driven development für Claude Code, OpenCode, Gemini CLI und Codex."
      heroImage={`${base}assets/projects/maxsimcli/preview-v3.svg`}
      heroAlt="maxsimcli – Meta-prompting CLI für strukturiertes Agentic Coding"
      ctaLabel="Dokumentation auf maxsimcli.dev"
      ctaLink="https://maxsimcli.dev"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface2 mb-8">
        {[
          { label: "Typ", value: "CLI Tool" },
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
        sich, Anweisungen werden vergessen, Inkonsistenzen häufen sich. <strong>maxsimcli</strong> löst
        das durch strukturiertes Agentic Coding: Projekte werden in klar abgegrenzte Phasen aufgeteilt,
        jeder Plan bekommt frischen Kontext und jeder Task erzeugt einen eigenen atomaren Commit.
      </p>
      <p>
        Das Tool funktioniert als Meta-Prompting-Layer für bestehende KI-Coding-Assistenten.
        Es installiert sich als Slash-Command-Sammlung und steuert den gesamten Entwicklungsworkflow
        von der Projektinitialisierung bis zum Release.
      </p>

      {/* Supported Runtimes */}
      <h2>Unterstützte Runtimes</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { name: "Claude Code", flag: "--claude", color: "border-t-blue-400" },
          { name: "OpenCode", flag: "--opencode", color: "border-t-emerald-400" },
          { name: "Gemini CLI", flag: "--gemini", color: "border-t-amber-400" },
          { name: "Codex", flag: "--codex", color: "border-t-violet-400" },
        ].map((rt) => (
          <div key={rt.name} className={`bg-surface border border-border border-t-2 ${rt.color} p-5`}>
            <h3 className="font-display font-bold text-fg text-sm mb-1">{rt.name}</h3>
            <p className="font-mono text-xs text-faint">{rt.flag}</p>
          </div>
        ))}
      </div>

      {/* Workflow */}
      <h2>Workflow: Sechs Schritte zum Release</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            step: "01",
            title: "Initialisieren",
            cmd: "/maxsim:new-project",
            desc: "Fragen, Research, Anforderungen und Roadmap. Idee in einen phasierten Buildplan überführen.",
          },
          {
            step: "02",
            title: "Besprechen",
            cmd: "/maxsim:discuss-phase",
            desc: "Implementierung formen bevor etwas gebaut wird. Graubereiche klären, Vision schärfen.",
          },
          {
            step: "03",
            title: "Planen",
            cmd: "/maxsim:plan-phase",
            desc: "Research, atomare Task-Pläne erstellen und gegen Anforderungen verifizieren.",
          },
          {
            step: "04",
            title: "Ausführen",
            cmd: "/maxsim:execute-phase",
            desc: "Pläne in parallelen Wellen. Frischer Kontext pro Plan. Jeder Task bekommt eigenen Commit.",
          },
          {
            step: "05",
            title: "Verifizieren",
            cmd: "/maxsim:verify-work",
            desc: "Testbare Deliverables durchgehen. Bei Problemen erstellt das System automatisch Fix-Pläne.",
          },
          {
            step: "06",
            title: "Shippen",
            cmd: "/maxsim:complete-milestone",
            desc: "Meilenstein archivieren, Release taggen. Dann Loop: discuss, plan, execute, verify.",
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

      {/* Key Features */}
      <h2>Features</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            title: "Frischer Kontext pro Plan",
            desc: "Jeder Task startet mit sauberem Kontext. Kein Aufblähen, keine vergessenen Anweisungen.",
          },
          {
            title: "Atomare Commits",
            desc: "Jeder abgeschlossene Task wird einzeln committet. Rollback und Review werden trivial.",
          },
          {
            title: "Live Dashboard",
            desc: "Echtzeit-Web-Dashboard mit Phase-Progress, offenen Tasks, Blockern und inline Plan-Editor.",
          },
          {
            title: "Multi-Runtime",
            desc: "Funktioniert mit Claude Code, OpenCode, Gemini CLI und Codex. Ein Workflow für alle.",
          },
          {
            title: "Model Profile",
            desc: "Drei vorkonfigurierte Profile (quality, balanced, budget) steuern, welche Modelle pro Phase genutzt werden.",
          },
          {
            title: "Spezialisierte Agent-Teams",
            desc: "Aufgaben werden automatisch an passende Agenten delegiert. Planung, Ausführung und Verifikation laufen getrennt.",
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

      {/* Installation */}
      <h2>Installation</h2>
      <div className="bg-surface border border-border p-6 lg:p-8">
        <p className="mb-4">
          Ein Befehl genügt. Der interaktive Installer fragt nach Runtime und Installationsort.
        </p>
        <div className="bg-canvas border border-border p-4 font-mono text-sm mb-4">
          <span className="text-brandLight select-none">$ </span>
          <span className="select-all text-green-400">npx maxsimcli@latest</span>
        </div>
        <p className="mb-4">
          Für CI/Docker/Scripts gibt es den non-interactive Modus:
        </p>
        <div className="bg-canvas border border-border p-4 font-mono text-xs space-y-1">
          <p><span className="text-brandLight select-none">$ </span><span className="text-green-400">npx maxsimcli --claude --global</span></p>
          <p><span className="text-brandLight select-none">$ </span><span className="text-green-400">npx maxsimcli --all --global</span></p>
        </div>
        <p className="text-xs text-faint mt-3">
          Ersetze <code className="text-brandLight">--global</code> durch <code className="text-brandLight">--local</code> für projektbezogene Installation.
        </p>
      </div>

      {/* Tech Stack */}
      <h3>Technologien</h3>
      <div className="my-4">
        <span className="tech-tag tech-tag-blue">TypeScript</span>
        <span className="tech-tag tech-tag-purple">Claude Code</span>
        <span className="tech-tag tech-tag-teal">Open Source</span>
        <span className="tech-tag tech-tag-green">Node.js</span>
        <span className="tech-tag tech-tag-orange">Meta-Prompting</span>
        <span className="tech-tag tech-tag-gray">npm</span>
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
