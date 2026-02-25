import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const COMMANDS = [
  { cmd: "/maxsim:new-project", desc: "Projekt initialisieren: Fragen → Research → Roadmap" },
  { cmd: "/maxsim:discuss-phase [N]", desc: "Implementierungsentscheidungen vor dem Planen festhalten" },
  { cmd: "/maxsim:plan-phase [N]", desc: "Research + atomare Pläne + Verifikation" },
  { cmd: "/maxsim:execute-phase <N>", desc: "Pläne in parallelen Wellen ausführen" },
  { cmd: "/maxsim:verify-work [N]", desc: "UAT: Testbare Deliverables durchgehen" },
  { cmd: "/maxsim:complete-milestone", desc: "Meilenstein archivieren, Release taggen" },
  { cmd: "/maxsim:progress", desc: "Wo bin ich? Was kommt als nächstes?" },
  { cmd: "/maxsim:quick", desc: "Ad-hoc Task mit atomaren Commits" },
  { cmd: "/maxsim:debug [desc]", desc: "Systematisches Debugging mit persistentem State" },
  { cmd: "/maxsim:resume-work", desc: "Von der letzten Session wiederherstellen" },
];

const RUNTIMES = [
  { name: "Claude Code", flag: "--claude", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  { name: "OpenCode", flag: "--opencode", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  { name: "Gemini CLI", flag: "--gemini", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
  { name: "Codex", flag: "--codex", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
];

const WORKFLOW_STEPS = [
  {
    n: "01",
    cmd: "/maxsim:new-project",
    title: "Projekt initialisieren",
    desc: "Fragen → Research → Anforderungen → Roadmap. Ein Befehl überführt deine Idee in einen strukturierten Buildplan.",
  },
  {
    n: "02",
    cmd: "/maxsim:discuss-phase 1",
    title: "Phase besprechen",
    desc: "Implementierung formen, bevor etwas gebaut wird. Graubereiche identifizieren und die Vision schärfen.",
  },
  {
    n: "03",
    cmd: "/maxsim:plan-phase 1",
    title: "Phase planen",
    desc: "Recherche wie man implementiert, atomare Task-Pläne erstellen und gegen Anforderungen verifizieren.",
  },
  {
    n: "04",
    cmd: "/maxsim:execute-phase 1",
    title: "Phase ausführen",
    desc: "Pläne in parallelen Wellen mit frischem Kontext pro Plan. Jeder Task bekommt seinen eigenen atomaren Commit.",
  },
  {
    n: "05",
    cmd: "/maxsim:verify-work 1",
    title: "Arbeit verifizieren",
    desc: "Testbare Deliverables einzeln durchgehen. Bei Problemen erstellt das System automatisch Fix-Pläne.",
  },
  {
    n: "06",
    cmd: "/maxsim:complete-milestone",
    title: "Shippen",
    desc: "Meilenstein archivieren und den nächsten starten. Loop: discuss → plan → execute → verify.",
  },
];

function GridHero() {
  return (
    <div
      className="relative overflow-hidden border-b border-border"
      style={{ minHeight: "420px" }}
    >
      {/* Grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99,102,241,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99,102,241,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Corner fades */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 0% 0%, rgba(0,0,0,0.6) 0%, transparent 50%), radial-gradient(ellipse 100% 100% at 100% 100%, rgba(0,0,0,0.6) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-xs font-mono px-3 py-1 rounded-full mb-6 tracking-wider"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Open Source · MIT License
        </motion.div>

        {/* Logo / Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold tracking-tight"
          style={{
            fontSize: "clamp(3rem, 10vw, 6rem)",
            lineHeight: 1,
            background: "linear-gradient(135deg, #e2e8f0 0%, #a5b4fc 50%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
          }}
        >
          maxsim
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-muted text-base sm:text-lg max-w-xl leading-relaxed"
        >
          Meta-prompting & spec-driven development für Claude Code, OpenCode, Gemini CLI und Codex.{" "}
          <strong className="text-fg">Löst Context Rot</strong> — die Qualitätsdegradation, wenn
          der Kontext voll wird.
        </motion.p>

        {/* Install command */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex items-center gap-3 bg-[#0d1117] border border-indigo-500/30 rounded-lg px-5 py-3 font-mono text-sm shadow-lg">
            <span className="text-indigo-400 select-none">$</span>
            <span className="text-green-300 select-all">npx maxsimcli@latest</span>
          </div>
          <div className="flex gap-2">
            <a
              href="https://github.com/maystudios/maxsim"
              target="_blank"
              rel="noopener noreferrer"
              className="swiss-btn-primary inline-flex items-center px-5 py-3 text-sm min-h-[44px]"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/maxsimcli"
              target="_blank"
              rel="noopener noreferrer"
              className="swiss-btn-secondary inline-flex items-center px-5 py-3 text-sm min-h-[44px]"
            >
              npm
            </a>
          </div>
        </motion.div>

        {/* npm badges row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {[
            { label: "Mac", color: "text-slate-300" },
            { label: "Windows", color: "text-slate-300" },
            { label: "Linux", color: "text-slate-300" },
          ].map((p) => (
            <span
              key={p.label}
              className="text-xs border border-border bg-surface px-2.5 py-1 rounded text-faint font-mono"
            >
              {p.label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Terminal({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg overflow-hidden border border-border bg-[#0d1117] text-sm font-mono shadow-lg">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-[#161b22]">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-faint">Terminal</span>
      </div>
      <div className="p-4 space-y-1 overflow-x-auto">{children}</div>
    </div>
  );
}

function TerminalLine({ prompt = "$", command, comment }: { prompt?: string; command: string; comment?: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-indigo-400 select-none shrink-0">{prompt}</span>
      <span className="text-green-300">{command}</span>
      {comment && <span className="text-slate-500 ml-2"># {comment}</span>}
    </div>
  );
}

export default function ProjectMaxsimCli() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopiedCmd(text);
      setTimeout(() => setCopiedCmd(null), 1800);
    });
  };

  return (
    <div className="bg-canvas min-h-screen pt-16">
      {/* Back button */}
      <Link
        to="/#projects"
        className="back-to-portfolio fixed left-4 top-[72px] z-40 inline-flex items-center gap-2 text-sm min-h-[44px]"
        aria-label="Zurück zur Projektübersicht"
      >
        ← Alle Projekte
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GridHero />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-6 sm:px-10 py-16 space-y-20"
      >

        {/* Problem / Solution */}
        <section>
          <h2 className="font-display font-bold text-fg text-2xl mb-8">Was ist maxsim?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface border border-red-500/20 rounded-lg p-6">
              <p className="text-xs uppercase tracking-widest text-red-400 font-mono mb-3">Das Problem</p>
              <h3 className="font-display font-bold text-fg text-base mb-2">Context Rot</h3>
              <p className="text-sm text-muted leading-relaxed">
                Je länger eine KI-Session dauert, desto schlechter wird die Qualität. Der Kontext füllt sich,
                Anweisungen werden vergessen, Inkonsistenzen häufen sich — bekannt als <em>Context Rot</em>.
              </p>
            </div>
            <div className="bg-surface border border-green-500/20 rounded-lg p-6">
              <p className="text-xs uppercase tracking-widest text-green-400 font-mono mb-3">Die Lösung</p>
              <h3 className="font-display font-bold text-fg text-base mb-2">Strukturiertes Agentic Coding</h3>
              <p className="text-sm text-muted leading-relaxed">
                maxsim teilt Projekte in klare Phasen mit frischem Kontext pro Plan, atomaren Commits und
                spezialisierten Agent-Teams — reproduzierbar, sicher und skalierbar.
              </p>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section>
          <h2 className="font-display font-bold text-fg text-2xl mb-2">Installation</h2>
          <p className="text-sm text-muted mb-6">
            Einfach ausführen — der interaktive Installer fragt Runtime und Installationsort ab.
          </p>

          <Terminal>
            <TerminalLine command="npx maxsimcli@latest" />
            <div className="text-slate-500 text-xs mt-2 pl-5">
              → Wähle Runtime: Claude Code · OpenCode · Gemini · Codex · All<br />
              → Wähle Ort: Global (alle Projekte) oder Local (nur dieses Projekt)
            </div>
          </Terminal>

          <div className="mt-6">
            <p className="text-xs text-faint font-mono uppercase tracking-widest mb-3">Non-interactive (CI / Docker / Scripts)</p>
            <Terminal>
              <TerminalLine command="npx maxsimcli --claude --global" comment="Claude Code → ~/.claude/" />
              <TerminalLine command="npx maxsimcli --opencode --global" comment="OpenCode → ~/.config/opencode/" />
              <TerminalLine command="npx maxsimcli --gemini --global" comment="Gemini CLI → ~/.gemini/" />
              <TerminalLine command="npx maxsimcli --codex --global" comment="Codex → ~/.codex/" />
              <TerminalLine command="npx maxsimcli --all --global" comment="Alle Runtimes auf einmal" />
            </Terminal>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {RUNTIMES.map((rt) => (
              <div key={rt.name} className={`border rounded-lg p-4 text-center ${rt.bg}`}>
                <p className={`font-display font-bold text-sm ${rt.color}`}>{rt.name}</p>
                <p className="text-xs text-faint font-mono mt-1">{rt.flag}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-surface border border-border rounded-lg p-4">
            <p className="text-xs text-faint font-mono uppercase tracking-widest mb-2">Verify</p>
            <Terminal>
              <TerminalLine prompt=">" command="/maxsim:help" comment="Claude Code / Gemini" />
              <TerminalLine prompt=">" command="/maxsim-help" comment="OpenCode" />
              <TerminalLine prompt=">" command="$maxsim-help" comment="Codex" />
            </Terminal>
          </div>
        </section>

        {/* Workflow */}
        <section>
          <h2 className="font-display font-bold text-fg text-2xl mb-2">Workflow</h2>
          <p className="text-sm text-muted mb-8">
            Sechs Schritte vom Konzept zum Release — wiederholbar für jeden Meilenstein.
          </p>
          <div className="space-y-4">
            {WORKFLOW_STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex gap-5 bg-surface border border-border rounded-lg p-5 hover:border-indigo-500/40 transition-colors"
              >
                <div className="shrink-0 font-display font-bold text-3xl text-indigo-500/30 leading-none w-10 text-right">
                  {step.n}
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-indigo-300 mb-1">{step.cmd}</p>
                  <h3 className="font-display font-bold text-fg text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-muted">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dashboard */}
        <section>
          <div className="border border-indigo-500/30 bg-indigo-500/5 rounded-lg p-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
                📊
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-fg text-xl mb-2">Live Dashboard</h2>
                <p className="text-sm text-muted mb-4">
                  Echtzeit-Web-Dashboard mit Phase-Progress, offenen Tasks, Blockern und inline Plan-Editor.
                  Automatisch während <code className="text-indigo-300">/maxsim:execute-phase</code> gestartet.
                </p>
                <Terminal>
                  <TerminalLine command="npx maxsimcli dashboard" />
                  <div className="text-slate-500 text-xs mt-2 pl-5">
                    → Öffnet Browser automatisch · Port ab 3333 · WebSocket Live-Updates
                  </div>
                </Terminal>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Animated Progress Bars",
                    "Phase Drill-Down",
                    "CodeMirror Editor",
                    "Todos Panel",
                    "Blockers Panel",
                    "Swiss Style Dark Theme",
                  ].map((f) => (
                    <span key={f} className="text-xs border border-indigo-500/30 text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-full font-mono">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commands Reference */}
        <section>
          <h2 className="font-display font-bold text-fg text-2xl mb-2">Alle Befehle</h2>
          <p className="text-sm text-muted mb-6">Klick zum Kopieren.</p>
          <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
            {COMMANDS.map((item) => (
              <button
                key={item.cmd}
                type="button"
                onClick={() => copyToClipboard(item.cmd)}
                className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-surface transition-colors text-left group"
              >
                <span className="font-mono text-xs text-indigo-300 shrink-0 min-w-[200px]">{item.cmd}</span>
                <span className="text-xs text-muted flex-1">{item.desc}</span>
                <span className="text-xs text-faint font-mono opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {copiedCmd === item.cmd ? "✓ kopiert" : "kopieren"}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Model Profiles */}
        <section>
          <h2 className="font-display font-bold text-fg text-2xl mb-6">Model Profile</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-px bg-border text-xs font-mono uppercase tracking-widest text-faint">
              <div className="bg-surface px-4 py-3">Profil</div>
              <div className="bg-surface px-4 py-3">Planung</div>
              <div className="bg-surface px-4 py-3">Ausführung</div>
              <div className="bg-surface px-4 py-3">Verifikation</div>
            </div>
            {[
              { profile: "quality", planning: "Opus", exec: "Opus", verify: "Sonnet" },
              { profile: "balanced", planning: "Opus", exec: "Sonnet", verify: "Sonnet", default: true },
              { profile: "budget", planning: "Sonnet", exec: "Sonnet", verify: "Haiku" },
            ].map((row) => (
              <div key={row.profile} className="grid grid-cols-4 gap-px bg-border">
                <div className="bg-surface px-4 py-3">
                  <span className="font-mono text-xs text-fg">{row.profile}</span>
                  {row.default && (
                    <span className="ml-2 text-[10px] text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">
                      default
                    </span>
                  )}
                </div>
                <div className="bg-surface px-4 py-3 text-xs text-muted font-mono">{row.planning}</div>
                <div className="bg-surface px-4 py-3 text-xs text-muted font-mono">{row.exec}</div>
                <div className="bg-surface px-4 py-3 text-xs text-muted font-mono">{row.verify}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-faint mt-3">Wechseln mit: <code className="text-indigo-300">/maxsim:set-profile &lt;profile&gt;</code></p>
        </section>

        {/* Links */}
        <section className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: "GitHub",
              href: "https://github.com/maystudios/maxsim",
              sub: "github.com/maystudios/maxsim",
              accent: "hover:border-slate-400/50",
            },
            {
              label: "npm",
              href: "https://www.npmjs.com/package/maxsimcli",
              sub: "npmjs.com/package/maxsimcli",
              accent: "hover:border-red-500/40",
            },
            {
              label: "Website",
              href: "https://maxsimcli.dev",
              sub: "maxsimcli.dev",
              accent: "hover:border-indigo-500/40",
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block bg-surface border border-border rounded-lg p-5 transition-colors ${link.accent} group`}
            >
              <p className="font-display font-bold text-fg text-base group-hover:text-brandLight transition-colors">
                {link.label} →
              </p>
              <p className="text-xs text-faint font-mono mt-1">{link.sub}</p>
            </a>
          ))}
        </section>

      </motion.div>
    </div>
  );
}
