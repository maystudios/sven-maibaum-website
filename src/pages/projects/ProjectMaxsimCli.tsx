import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";

// ─── Data ────────────────────────────────────────────────────────────────────

const COMMANDS = [
  { cmd: "/maxsim:new-project",      desc: "Projekt initialisieren: Fragen → Research → Roadmap" },
  { cmd: "/maxsim:discuss-phase [N]",desc: "Implementierungsentscheidungen vor dem Planen festhalten" },
  { cmd: "/maxsim:plan-phase [N]",   desc: "Research + atomare Pläne + Verifikation" },
  { cmd: "/maxsim:execute-phase <N>",desc: "Pläne in parallelen Wellen mit frischem Kontext ausführen" },
  { cmd: "/maxsim:verify-work [N]",  desc: "UAT: Testbare Deliverables einzeln durchgehen" },
  { cmd: "/maxsim:complete-milestone",desc: "Meilenstein archivieren, Release taggen" },
  { cmd: "/maxsim:new-milestone",    desc: "Nächste Version starten" },
  { cmd: "/maxsim:progress",         desc: "Aktueller Stand — was kommt als nächstes?" },
  { cmd: "/maxsim:quick",            desc: "Ad-hoc Task mit atomaren Commits" },
  { cmd: "/maxsim:debug [desc]",     desc: "Systematisches Debugging mit persistentem State" },
  { cmd: "/maxsim:resume-work",      desc: "Von der letzten Session nahtlos wiederherstellen" },
];

const RUNTIMES = [
  { name: "Claude Code", flag: "--claude",   verify: "/maxsim:help",  accent: "var(--sw-accent)" },
  { name: "OpenCode",    flag: "--opencode", verify: "/maxsim-help",  accent: "#10b981" },
  { name: "Gemini CLI",  flag: "--gemini",   verify: "/maxsim:help",  accent: "#f59e0b" },
  { name: "Codex",       flag: "--codex",    verify: "$maxsim-help",  accent: "#8b5cf6" },
];

const WORKFLOW_STEPS = [
  { n: "01", cmd: "/maxsim:new-project",     title: "Initialisieren",  desc: "Fragen → Research → Anforderungen → Roadmap. Idee in einen phasierten Buildplan überführen." },
  { n: "02", cmd: "/maxsim:discuss-phase 1", title: "Besprechen",      desc: "Implementierung formen bevor etwas gebaut wird. Graubereiche klären, Vision schärfen." },
  { n: "03", cmd: "/maxsim:plan-phase 1",    title: "Planen",          desc: "Research, atomare Task-Pläne erstellen und gegen Anforderungen verifizieren." },
  { n: "04", cmd: "/maxsim:execute-phase 1", title: "Ausführen",       desc: "Pläne in parallelen Wellen. Frischer Kontext pro Plan. Jeder Task → eigener atomarer Commit." },
  { n: "05", cmd: "/maxsim:verify-work 1",   title: "Verifizieren",    desc: "Testbare Deliverables durchgehen. Bei Problemen erstellt das System automatisch Fix-Pläne." },
  { n: "06", cmd: "/maxsim:complete-milestone", title: "Shippen",      desc: "Meilenstein archivieren, Release taggen. Loop: discuss → plan → execute → verify." },
];

const DASHBOARD_FEATURES = [
  "Animated Progress Bars", "Phase Drill-Down", "CodeMirror Editor",
  "Todos Panel", "Blockers Panel", "Swiss Style Dark Theme",
  "WebSocket Live-Updates", "Auto-öffnet Browser",
];

// ─── Primitives ───────────────────────────────────────────────────────────────

/** Swiss eyebrow label */
function Eyebrow({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <p
      className="swiss-eyebrow mb-3"
      style={accent ? { color: "var(--sw-accent)" } : undefined}
    >
      {children}
    </p>
  );
}

/** Section heading with bottom rule */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display font-bold text-fg pb-4 mb-8"
      style={{
        fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
        letterSpacing: "-0.02em",
        borderBottom: "1px solid var(--sw-border)",
        color: "var(--sw-fg)",
      }}
    >
      {children}
    </h2>
  );
}

/** Theme-aware terminal block */
function Terminal({ title = "Terminal", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden text-sm font-mono"
      style={{
        background: "var(--sw-surface)",
        border: "1px solid var(--sw-border)",
        borderRadius: "2px",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--sw-border)", background: "var(--sw-surface)" }}
      >
        <span className="w-3 h-3 rounded-full bg-red-500/60" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <span className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-2 swiss-eyebrow" style={{ fontSize: "0.65rem" }}>{title}</span>
      </div>
      {/* Content */}
      <div className="p-4 space-y-1.5 overflow-x-auto">{children}</div>
    </div>
  );
}

function TLine({ prompt = "$", command, comment }: { prompt?: string; command: string; comment?: string }) {
  return (
    <div className="flex gap-2 items-start">
      <span className="shrink-0 select-none" style={{ color: "var(--sw-accent)" }}>{prompt}</span>
      <span style={{ color: "#86efac" }}>{command}</span>
      {comment && <span className="ml-1" style={{ color: "var(--sw-text-faint)" }}># {comment}</span>}
    </div>
  );
}

function TComment({ children }: { children: React.ReactNode }) {
  return (
    <p className="pl-5 text-xs" style={{ color: "var(--sw-text-faint)" }}>
      {children}
    </p>
  );
}

// ─── Animate-when-in-view wrapper ────────────────────────────────────────────

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ borderBottom: "1px solid var(--sw-border)", minHeight: 460 }}
    >
      {/* Swiss grid background — theme-aware */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-line-v) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line-h) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Aceternity-style radial glow — accent color from design system */}
      <div
        aria-hidden
        className="absolute inset-0 animate-glow-pulse pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(59,130,246,0.13) 0%, transparent 70%)",
        }}
      />

      {/* Scanning beam — horizontal sweep */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <motion.div
          initial={{ x: "-10%" }}
          animate={{ x: "110%" }}
          transition={{ duration: 6, repeat: Infinity, repeatDelay: 8, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "80px",
            background: "linear-gradient(to right, transparent, rgba(59,130,246,0.07), transparent)",
          }}
        />
      </div>

      {/* Subtle vignette edges */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 110% 100% at 0% 50%, rgba(9,9,11,0.35) 0%, transparent 55%), radial-gradient(ellipse 110% 100% at 100% 50%, rgba(9,9,11,0.35) 0%, transparent 55%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 mb-6"
          style={{
            border: "1px solid var(--sw-border-light)",
            background: "rgba(59,130,246,0.06)",
            padding: "0.3rem 0.875rem",
            borderRadius: "2px",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--sw-accent)" }}
          />
          <span className="swiss-eyebrow" style={{ marginBottom: 0 }}>Open Source · MIT License</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display font-bold"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 7rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            background: "linear-gradient(145deg, var(--sw-fg) 20%, var(--sw-accent-light) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          maxsim
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-5 max-w-2xl"
          style={{ color: "var(--sw-text-muted)", fontSize: "1.0625rem", lineHeight: 1.65 }}
        >
          Meta-prompting & spec-driven development für{" "}
          <strong style={{ color: "var(--sw-fg)", fontWeight: 600 }}>
            Claude Code, OpenCode, Gemini CLI und Codex.
          </strong>{" "}
          Löst <em>Context Rot</em> — die Qualitätsdegradation, wenn der Kontext voll wird.
        </motion.p>

        {/* Install snippet + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          {/* Primary install command */}
          <div
            className="flex items-center gap-3 font-mono text-sm"
            style={{
              background: "var(--sw-surface)",
              border: "1px solid var(--sw-border-light)",
              padding: "0.7rem 1.25rem",
              borderRadius: "2px",
              boxShadow: "0 0 0 1px transparent",
            }}
          >
            <span style={{ color: "var(--sw-accent)", userSelect: "none" }}>$</span>
            <span className="select-all" style={{ color: "#86efac" }}>npx maxsimcli@latest</span>
          </div>

          <a
            href="https://github.com/maystudios/maxsim"
            target="_blank" rel="noopener noreferrer"
            className="swiss-btn-primary"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/maxsimcli"
            target="_blank" rel="noopener noreferrer"
            className="swiss-btn-secondary"
          >
            npm
          </a>
        </motion.div>

        {/* Platform pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-6 flex gap-2"
        >
          {["Mac", "Windows", "Linux"].map((p) => (
            <span
              key={p}
              className="swiss-eyebrow"
              style={{
                border: "1px solid var(--sw-border)",
                padding: "0.2rem 0.65rem",
                borderRadius: "2px",
                marginBottom: 0,
              }}
            >
              {p}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { label: "Typ",      value: "CLI Tool" },
    { label: "Sprache",  value: "TypeScript" },
    { label: "Lizenz",   value: "MIT" },
    { label: "Status",   value: "Aktiv" },
  ];
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4"
      style={{ borderBottom: "1px solid var(--sw-border)" }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="px-6 py-5"
          style={{
            borderRight: i < stats.length - 1 ? "1px solid var(--sw-border)" : undefined,
          }}
        >
          <p className="swiss-eyebrow">{s.label}</p>
          <p className="font-display font-bold text-sm" style={{ color: "var(--sw-fg)" }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProjectMaxsimCli() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copy = (text: string) => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopiedCmd(text);
      setTimeout(() => setCopiedCmd(null), 1800);
    });
  };

  return (
    <div className="bg-canvas min-h-screen pt-16">
      {/* Back */}
      <Link
        to="/#projects"
        className="back-to-portfolio fixed left-4 top-[72px] z-40"
        aria-label="Zurück zur Projektübersicht"
      >
        ← Alle Projekte
      </Link>

      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Hero />
      </motion.div>

      {/* Stats */}
      <StatsBar />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 space-y-20">

        {/* 1. Problem / Solution */}
        <FadeIn>
          <section>
            <Eyebrow>Kontext</Eyebrow>
            <SectionHeading>Was ist maxsim?</SectionHeading>

            <div className="grid md:grid-cols-2 gap-0" style={{ border: "1px solid var(--sw-border)" }}>
              {/* Problem */}
              <div
                className="p-7"
                style={{
                  borderRight: "1px solid var(--sw-border)",
                  borderLeft: "3px solid #ef4444",
                }}
              >
                <Eyebrow>Das Problem</Eyebrow>
                <h3 className="font-display font-bold text-base mb-3" style={{ color: "var(--sw-fg)" }}>
                  Context Rot
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--sw-text-muted)" }}>
                  Je länger eine KI-Session dauert, desto schlechter wird die Qualität. Der Kontext füllt
                  sich, Anweisungen werden vergessen, Inkonsistenzen häufen sich.
                </p>
              </div>
              {/* Solution */}
              <div
                className="p-7"
                style={{ borderLeft: "3px solid #22c55e" }}
              >
                <Eyebrow>Die Lösung</Eyebrow>
                <h3 className="font-display font-bold text-base mb-3" style={{ color: "var(--sw-fg)" }}>
                  Strukturiertes Agentic Coding
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--sw-text-muted)" }}>
                  maxsim teilt Projekte in klar abgegrenzte Phasen mit <strong style={{ color: "var(--sw-fg)" }}>frischem Kontext</strong> pro
                  Plan, <strong style={{ color: "var(--sw-fg)" }}>atomaren Commits</strong> und
                  spezialisierten Agent-Teams.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 2. Installation */}
        <FadeIn>
          <section>
            <Eyebrow>Getting Started</Eyebrow>
            <SectionHeading>Installation</SectionHeading>

            {/* Main command — featured */}
            <div
              className="p-6 mb-6 relative overflow-hidden"
              style={{
                background: "var(--sw-surface)",
                border: "1px solid var(--sw-border-light)",
                borderLeft: "3px solid var(--sw-accent)",
                borderRadius: "2px",
              }}
            >
              {/* Subtle glow behind the block */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)",
                }}
              />
              <p className="swiss-eyebrow mb-3" style={{ color: "var(--sw-accent)" }}>Interaktiv</p>
              <Terminal title="bash">
                <TLine command="npx maxsimcli@latest" />
                <TComment>→ Wähle Runtime: Claude Code · OpenCode · Gemini · Codex · All</TComment>
                <TComment>→ Wähle Ort: Global (alle Projekte) oder Local (dieses Projekt)</TComment>
              </Terminal>
            </div>

            {/* Non-interactive */}
            <div className="mb-6">
              <p className="swiss-eyebrow mb-3">Non-interactive — CI / Docker / Scripts</p>
              <Terminal>
                <TLine command="npx maxsimcli --claude   --global" comment="Claude Code → ~/.claude/" />
                <TLine command="npx maxsimcli --opencode --global" comment="OpenCode → ~/.config/opencode/" />
                <TLine command="npx maxsimcli --gemini   --global" comment="Gemini CLI → ~/.gemini/" />
                <TLine command="npx maxsimcli --codex    --global" comment="Codex → ~/.codex/" />
                <TLine command="npx maxsimcli --all      --global" comment="Alle Runtimes gleichzeitig" />
              </Terminal>
              <p className="text-xs mt-2" style={{ color: "var(--sw-text-faint)" }}>
                Ersetze <code style={{ color: "var(--sw-accent-light)" }}>--global</code> durch{" "}
                <code style={{ color: "var(--sw-accent-light)" }}>--local</code> für projektbezogene Installation.
              </p>
            </div>

            {/* Runtimes */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-px"
              style={{ background: "var(--sw-border)" }}
            >
              {RUNTIMES.map((rt) => (
                <div
                  key={rt.name}
                  className="p-5"
                  style={{ background: "var(--sw-surface)", borderTop: `2px solid ${rt.accent}` }}
                >
                  <p className="font-display font-bold text-sm mb-1" style={{ color: rt.accent }}>
                    {rt.name}
                  </p>
                  <p className="font-mono text-xs mb-3" style={{ color: "var(--sw-text-faint)" }}>{rt.flag}</p>
                  <p className="swiss-eyebrow" style={{ marginBottom: "0.25rem", fontSize: "0.6rem" }}>Verify</p>
                  <code className="font-mono text-xs" style={{ color: "var(--sw-text-muted)" }}>{rt.verify}</code>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* 3. Workflow */}
        <FadeIn>
          <section>
            <Eyebrow>Workflow</Eyebrow>
            <SectionHeading>Sechs Schritte zum Release</SectionHeading>

            <div className="relative">
              {/* Connecting line */}
              <div
                className="absolute left-[2.375rem] top-4 bottom-4 hidden sm:block"
                style={{ width: "1px", background: "var(--sw-border)" }}
              />

              <div className="space-y-2">
                {WORKFLOW_STEPS.map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex gap-5 group relative"
                  >
                    {/* Step number */}
                    <div
                      className="shrink-0 w-[4.75rem] h-[4.75rem] hidden sm:flex items-center justify-center z-10"
                      style={{
                        background: "var(--sw-surface)",
                        border: "1px solid var(--sw-border)",
                        borderRadius: "2px",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <span
                        className="font-display font-bold text-xl"
                        style={{ color: "var(--sw-accent)", letterSpacing: "-0.02em" }}
                      >
                        {step.n}
                      </span>
                    </div>

                    {/* Content */}
                    <div
                      className="flex-1 p-5 transition-colors"
                      style={{
                        background: "var(--sw-surface)",
                        border: "1px solid var(--sw-border)",
                        borderRadius: "2px",
                      }}
                    >
                      <div className="flex flex-wrap items-baseline gap-3 mb-1">
                        <span
                          className="sm:hidden font-display font-bold text-base"
                          style={{ color: "var(--sw-accent)" }}
                        >
                          {step.n}
                        </span>
                        <h3 className="font-display font-bold text-sm" style={{ color: "var(--sw-fg)" }}>
                          {step.title}
                        </h3>
                        <code
                          className="font-mono text-xs"
                          style={{ color: "var(--sw-accent-light)" }}
                        >
                          {step.cmd}
                        </code>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--sw-text-muted)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 4. Dashboard — Aceternity bento card */}
        <FadeIn>
          <section>
            <Eyebrow>Live Dashboard</Eyebrow>
            <div
              className="relative overflow-hidden p-8 sm:p-10"
              style={{
                background: "var(--sw-surface)",
                border: "1px solid var(--sw-border-light)",
                borderRadius: "2px",
                boxShadow: "inset 0 0 60px rgba(59,130,246,0.04)",
              }}
            >
              {/* Faint grid inside card */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, var(--grid-line-v) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--grid-line-h) 1px, transparent 1px)
                  `,
                  backgroundSize: "32px 32px",
                  opacity: 0.6,
                }}
              />
              {/* Accent top border */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(to right, transparent, var(--sw-accent), transparent)" }}
              />

              <div className="relative z-10 flex flex-col sm:flex-row gap-8">
                <div className="flex-1">
                  <h2
                    className="font-display font-bold mb-3"
                    style={{ fontSize: "1.375rem", color: "var(--sw-fg)", letterSpacing: "-0.02em" }}
                  >
                    Live Dashboard
                  </h2>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--sw-text-muted)" }}>
                    Echtzeit-Web-Dashboard mit Phase-Progress, offenen Tasks, Blockern und inline
                    Plan-Editor. Startet automatisch während{" "}
                    <code style={{ color: "var(--sw-accent-light)" }}>/maxsim:execute-phase</code>.
                  </p>
                  <Terminal title="bash">
                    <TLine command="npx maxsimcli dashboard" />
                    <TComment>→ Öffnet Browser automatisch · Port ab 3333 · WebSocket Live-Updates</TComment>
                  </Terminal>
                </div>

                <div className="sm:w-56 shrink-0">
                  <p className="swiss-eyebrow mb-3">Features</p>
                  <ul className="space-y-2">
                    {DASHBOARD_FEATURES.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span style={{ color: "var(--sw-accent)", marginTop: "2px", fontSize: "0.6rem" }}>▸</span>
                        <span className="text-xs" style={{ color: "var(--sw-text-muted)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 5. Commands reference */}
        <FadeIn>
          <section>
            <Eyebrow>Befehlsreferenz</Eyebrow>
            <SectionHeading>Alle Befehle</SectionHeading>
            <p className="text-sm mb-6" style={{ color: "var(--sw-text-muted)" }}>
              Klick auf einen Befehl zum Kopieren.
            </p>

            <div style={{ border: "1px solid var(--sw-border)" }}>
              {/* Header */}
              <div
                className="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3"
                style={{
                  borderBottom: "1px solid var(--sw-border)",
                  background: "var(--sw-surface)",
                }}
              >
                <span className="swiss-eyebrow" style={{ marginBottom: 0 }}>Befehl</span>
                <span className="swiss-eyebrow hidden sm:block" style={{ marginBottom: 0 }}>Beschreibung</span>
                <span />
              </div>

              {COMMANDS.map((item, i) => (
                <button
                  key={item.cmd}
                  type="button"
                  onClick={() => copy(item.cmd)}
                  className="w-full grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_1fr_auto] gap-4 items-center px-5 py-3.5 text-left group"
                  style={{
                    borderBottom: i < COMMANDS.length - 1 ? "1px solid var(--sw-border)" : undefined,
                    background: "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sw-surface)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--sw-accent-light)" }}
                  >
                    {item.cmd}
                  </span>
                  <span
                    className="hidden sm:block text-xs"
                    style={{ color: "var(--sw-text-muted)" }}
                  >
                    {item.desc}
                  </span>
                  <span
                    className="font-mono text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--sw-text-faint)" }}
                  >
                    {copiedCmd === item.cmd ? "✓" : "↗"}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* 6. Model Profiles */}
        <FadeIn>
          <section>
            <Eyebrow>Konfiguration</Eyebrow>
            <SectionHeading>Model Profile</SectionHeading>

            <div style={{ border: "1px solid var(--sw-border)" }}>
              {/* Header */}
              <div
                className="grid grid-cols-4 gap-px"
                style={{ background: "var(--sw-border)" }}
              >
                {["Profil", "Planung", "Ausführung", "Verifikation"].map((h) => (
                  <div
                    key={h}
                    className="px-5 py-3"
                    style={{ background: "var(--sw-surface)" }}
                  >
                    <span className="swiss-eyebrow" style={{ marginBottom: 0 }}>{h}</span>
                  </div>
                ))}
              </div>

              {[
                { profile: "quality",  planning: "Opus",   exec: "Opus",   verify: "Sonnet" },
                { profile: "balanced", planning: "Opus",   exec: "Sonnet", verify: "Sonnet", default: true },
                { profile: "budget",   planning: "Sonnet", exec: "Sonnet", verify: "Haiku" },
              ].map((row) => (
                <div
                  key={row.profile}
                  className="grid grid-cols-4 gap-px"
                  style={{ background: "var(--sw-border)", borderTop: "1px solid var(--sw-border)" }}
                >
                  <div className="px-5 py-4 flex items-center gap-2" style={{ background: "var(--sw-surface)" }}>
                    <span className="font-mono text-xs" style={{ color: "var(--sw-fg)" }}>{row.profile}</span>
                    {row.default && (
                      <span
                        className="tech-tag tech-tag-blue"
                        style={{ fontSize: "0.6rem", marginRight: 0, marginBottom: 0 }}
                      >
                        default
                      </span>
                    )}
                  </div>
                  {[row.planning, row.exec, row.verify].map((val, j) => (
                    <div
                      key={j}
                      className="px-5 py-4"
                      style={{ background: "var(--sw-surface)", color: "var(--sw-text-muted)", fontFamily: "monospace", fontSize: "0.75rem" }}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p className="text-xs mt-3" style={{ color: "var(--sw-text-faint)" }}>
              Wechseln mit:{" "}
              <code style={{ color: "var(--sw-accent-light)" }}>/maxsim:set-profile &lt;profile&gt;</code>
            </p>
          </section>
        </FadeIn>

        {/* 7. Links */}
        <FadeIn>
          <section>
            <Eyebrow>Links</Eyebrow>
            <div
              className="grid sm:grid-cols-3 gap-px"
              style={{ background: "var(--sw-border)", border: "1px solid var(--sw-border)" }}
            >
              {[
                { label: "GitHub",  href: "https://github.com/maystudios/maxsim",      sub: "github.com/maystudios/maxsim",    accentHover: "var(--sw-fg)" },
                { label: "npm",     href: "https://www.npmjs.com/package/maxsimcli",   sub: "npmjs.com/package/maxsimcli",     accentHover: "#f87171" },
                { label: "Website", href: "https://maxsimcli.dev",                     sub: "maxsimcli.dev",                   accentHover: "var(--sw-accent-light)" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 group"
                  style={{
                    background: "var(--sw-surface)",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sw-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--sw-surface)")}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-sm" style={{ color: "var(--sw-fg)" }}>
                      {link.label}
                    </span>
                    <span style={{ color: "var(--sw-text-faint)", transition: "color 0.2s" }}>↗</span>
                  </div>
                  <p className="font-mono text-xs" style={{ color: "var(--sw-text-faint)" }}>{link.sub}</p>
                </a>
              ))}
            </div>
          </section>
        </FadeIn>

      </div>
    </div>
  );
}
