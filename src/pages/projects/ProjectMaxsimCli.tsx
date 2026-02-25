import ProjectShell from "../../components/ProjectShell";

export default function ProjectMaxsimCli() {
  return (
    <ProjectShell
      hasSiteHeader
      title="maxsimcli"
      subtitle="Ein vollständig Open-Source-CLI-Tool für KI-gestütztes Software-Engineering. Strukturierte Phasen, atomare Commits und intelligente Agent-Teams – direkt im Terminal."
      heroImage=""
      heroAlt="maxsimcli – AI-powered CLI for structured software development"
      ctaLabel="Auf GitHub ansehen"
      ctaLink="https://github.com/maystudios/maxsim"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface2 mb-8">
        {[
          { label: "Typ", value: "CLI Tool" },
          { label: "Sprache", value: "TypeScript / Node.js" },
          { label: "Lizenz", value: "Open Source" },
          { label: "Status", value: "Aktiv" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="text-xs uppercase tracking-widest text-faint mb-1">{stat.label}</p>
            <p className="font-display font-semibold text-fg text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Overview */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="bg-surface border border-border p-8 lg:p-10">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Was ist maxsimcli?</h3>
          <p>
            <strong>maxsimcli</strong> ist ein Open-Source-CLI-Tool, das strukturiertes, KI-gestütztes
            Software-Engineering direkt in die Kommandozeile bringt. Es kombiniert{" "}
            <strong>Phasen-basiertes Planen</strong>, <strong>atomare Commits</strong> und{" "}
            <strong>spezialisierte Claude-Agent-Teams</strong>, um komplexe Entwicklungsaufgaben
            reproduzierbar und sicher durchzuführen.
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside">
            <li>Strukturierte Roadmaps mit Meilensteinen & Phasen</li>
            <li>Parallele Agent-Teams für Planung, Ausführung & Verifikation</li>
            <li>Checkpoint-System für sichere Kontextübergaben</li>
            <li>Atomare Git-Commits nach jedem Task</li>
          </ul>
        </div>
        <div className="bg-surface border border-border p-8 lg:p-10">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Installation</h3>
          <p className="text-faint mb-4">Einfach per npm installieren und sofort loslegen:</p>
          <pre className="bg-[var(--color-surface2,#0d1117)] border border-border rounded p-4 text-sm font-mono overflow-x-auto">
            <code className="text-green-400">npm install -g maxsimcli</code>
          </pre>
          <p className="text-faint text-sm mt-3 mb-4">Danach steht der Befehl global zur Verfügung:</p>
          <pre className="bg-[var(--color-surface2,#0d1117)] border border-border rounded p-4 text-sm font-mono overflow-x-auto">
            <code className="text-blue-300">maxsim --help</code>
          </pre>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://www.npmjs.com/package/maxsimcli"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brandLight hover:underline"
            >
              npm-Paket ansehen →
            </a>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <h2>Key Features</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Phasen-basiertes Planen",
            text: "Projekte werden in klar abgegrenzte Phasen unterteilt. Jede Phase hat ein definiertes Ziel, detaillierte Pläne und verifizierbare Erfolgskriterien.",
          },
          {
            title: "Spezialisierte Agent-Teams",
            text: "Planer, Executor, Researcher, Verifier – jeder Agent hat eine klar definierte Rolle und arbeitet parallel, um die beste Lösung zu erarbeiten.",
          },
          {
            title: "Atomare Git-Commits",
            text: "Jeder abgeschlossene Task landet in einem eigenen Commit. Kein verlorener Fortschritt, vollständige Nachvollziehbarkeit und saubere Git-History.",
          },
          {
            title: "Checkpoint-System",
            text: "Kontextübergaben zwischen Sessions werden sicher persistiert. Arbeit kann jederzeit unterbrochen und nahtlos fortgesetzt werden.",
          },
          {
            title: "Roadmap & Meilensteine",
            text: "Von der ersten Idee bis zum Release – Roadmaps mit Meilensteinen strukturieren auch große Projekte übersichtlich und nachvollziehbar.",
          },
          {
            title: "Open Source",
            text: "Vollständig auf GitHub verfügbar. Community-Beiträge sind willkommen – Issues, Pull Requests und Feature-Requests jederzeit möglich.",
          },
        ].map((feature) => (
          <div key={feature.title} className="bg-surface border border-border p-6">
            <h3 className="font-display font-bold text-fg text-base mb-2">{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>

      {/* Workflow */}
      <h2>Typischer Workflow</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-display font-bold text-fg text-lg mb-3">Neues Projekt starten</h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li>
              <code className="text-sm bg-surface2 px-1 rounded">/maxsim:new-project</code> – Tiefer
              Kontext-Aufbau mit Researcher-Agenten.
            </li>
            <li>Roadmap mit Meilensteinen und Phasen wird automatisch erstellt.</li>
            <li>
              <code className="text-sm bg-surface2 px-1 rounded">/maxsim:plan-phase</code> – Detailplan
              mit Verifikations-Loop für jede Phase.
            </li>
            <li>
              <code className="text-sm bg-surface2 px-1 rounded">/maxsim:execute-phase</code> –
              Wave-basierte parallele Ausführung aller Tasks.
            </li>
          </ol>
        </div>
        <div>
          <h3 className="font-display font-bold text-fg text-lg mb-3">Qualitätssicherung</h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li>
              <code className="text-sm bg-surface2 px-1 rounded">/maxsim:verify-work</code> –
              Ziel-rückwärts-Analyse: Wurde das Phasenziel wirklich erreicht?
            </li>
            <li>
              <code className="text-sm bg-surface2 px-1 rounded">/maxsim:audit-milestone</code> –
              Vollständigkeitsprüfung vor Milestone-Abschluss.
            </li>
            <li>Integration Checker verifiziert E2E-Flows zwischen Phasen.</li>
            <li>Automatische VERIFICATION.md Berichte pro Phase.</li>
          </ol>
        </div>
      </div>

      {/* Tech Stack */}
      <h2>Tech Stack</h2>
      <div className="flex flex-wrap gap-3">
        {[
          { label: "TypeScript", cls: "tech-tag tech-tag-blue" },
          { label: "Node.js", cls: "tech-tag tech-tag-green" },
          { label: "Claude API", cls: "tech-tag tech-tag-purple" },
          { label: "Git", cls: "tech-tag tech-tag-orange" },
          { label: "npm", cls: "tech-tag tech-tag-red" },
          { label: "Open Source", cls: "tech-tag tech-tag-teal" },
        ].map((t) => (
          <span key={t.label} className={t.cls}>
            {t.label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div className="bg-surface border border-border p-6">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Links</h3>
          <ul className="space-y-3">
            <li>
              <strong>GitHub:</strong>{" "}
              <a
                className="text-brandLight hover:underline"
                href="https://github.com/maystudios/maxsim"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/maystudios/maxsim
              </a>
            </li>
            <li>
              <strong>npm:</strong>{" "}
              <a
                className="text-brandLight hover:underline"
                href="https://www.npmjs.com/package/maxsimcli"
                target="_blank"
                rel="noopener noreferrer"
              >
                npmjs.com/package/maxsimcli
              </a>
            </li>
            <li>
              <strong>Website:</strong>{" "}
              <a
                className="text-brandLight hover:underline"
                href="https://maxsimcli.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                maxsimcli.dev
              </a>
            </li>
          </ul>
        </div>
        <div className="bg-surface border border-border p-6">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Mitmachen</h3>
          <p className="mb-4">
            maxsimcli ist ein Community-Projekt. Issues, Feature-Requests und Pull Requests sind
            jederzeit willkommen!
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/maystudios/maxsim"
              target="_blank"
              rel="noopener noreferrer"
              className="swiss-btn-primary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              GitHub öffnen
            </a>
            <a
              href="https://www.npmjs.com/package/maxsimcli"
              target="_blank"
              rel="noopener noreferrer"
              className="swiss-btn-secondary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              npm ansehen
            </a>
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}
