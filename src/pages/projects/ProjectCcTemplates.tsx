import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";

// ─── Data ────────────────────────────────────────────────────────────────────

const COMPONENT_TYPES = [
  {
    type: "Skills",
    flag: "--skill",
    dest: ".claude/skills/<name>/",
    desc: "Instruction sets, die Claude's Fähigkeiten für spezifische Aufgaben erweitern. Ein Verzeichnis mit Markdown-Regeln und Referenzen.",
    accent: "#3b82f6",
  },
  {
    type: "Agents",
    flag: "--agent",
    dest: ".claude/agents/<name>.md",
    desc: "Spezialisierte Sub-Agenten mit eigenem Verhalten — jeder definiert eine fokussierte KI-Rolle oder einen Workflow.",
    accent: "#10b981",
  },
  {
    type: "Hooks",
    flag: "--hook",
    dest: "settings.json (gemergt)",
    desc: "Shell-Befehle, die automatisch auf Claude Code Lifecycle-Events reagieren. Werden sicher in settings.json eingebunden.",
    accent: "#f59e0b",
  },
  {
    type: "Commands",
    flag: "--command",
    dest: ".claude/commands/<name>.md",
    desc: "Custom Slash-Commands für Claude Code. Jeder fügt ein /command-name Shortcut zur Oberfläche hinzu.",
    accent: "#8b5cf6",
  },
];

const AVAILABLE_SKILLS = [
  { name: "tech-product-landing",      desc: "Landing Pages für Software-/CLI-Tools und Developer Libraries (Vite + React + Tailwind v4 + Framer Motion)" },
  { name: "video-download",            desc: "Videos von YouTube, Instagram, TikTok und 1000+ Plattformen herunterladen via yt-dlp" },
  { name: "video-fetch-and-summarize", desc: "Videos herunterladen und strukturierte KI-Zusammenfassungen mit Google Gemini erstellen" },
  { name: "video-summarizer",          desc: "Bestehende MP4-Dateien analysieren und Markdown-Zusammenfassungen generieren" },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

function Eyebrow({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <p className="swiss-eyebrow mb-3" style={accent ? { color: "var(--sw-accent)" } : undefined}>
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display font-bold pb-4 mb-8"
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
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--sw-border)" }}
      >
        <span className="w-3 h-3 rounded-full bg-red-500/60" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <span className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-2 swiss-eyebrow" style={{ fontSize: "0.65rem" }}>{title}</span>
      </div>
      <div className="p-4 space-y-1.5 overflow-x-auto">{children}</div>
    </div>
  );
}

function TLine({ prompt = "$", command, comment }: { prompt?: string; command: string; comment?: string }) {
  return (
    <div className="flex gap-2 items-start flex-wrap">
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

function TOutput({ children }: { children: React.ReactNode }) {
  return (
    <p className="pl-5 text-xs" style={{ color: "var(--sw-text-muted)" }}>
      {children}
    </p>
  );
}

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
      style={{ borderBottom: "1px solid var(--sw-border)", minHeight: 420 }}
    >
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
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(59,130,246,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
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
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--sw-accent)" }} />
          <span className="swiss-eyebrow" style={{ marginBottom: 0 }}>Open Source · MIT License</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display font-bold"
          style={{
            fontSize: "clamp(3rem, 10vw, 6rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            background: "linear-gradient(145deg, var(--sw-fg) 20%, var(--sw-accent-light) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          cc-templates
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-5 max-w-2xl"
          style={{ color: "var(--sw-text-muted)", fontSize: "1.0625rem", lineHeight: 1.65 }}
        >
          Claude Code Komponenten aus dem Community-Katalog installieren —{" "}
          <strong style={{ color: "var(--sw-fg)", fontWeight: 600 }}>
            Skills, Agents, Hooks und Commands
          </strong>{" "}
          mit einem einzigen Befehl.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <div
            className="flex items-center gap-3 font-mono text-sm"
            style={{
              background: "var(--sw-surface)",
              border: "1px solid var(--sw-border-light)",
              padding: "0.7rem 1.25rem",
              borderRadius: "2px",
            }}
          >
            <span style={{ color: "var(--sw-accent)", userSelect: "none" }}>$</span>
            <span className="select-all" style={{ color: "#86efac" }}>npx cc-templates</span>
          </div>
          <a
            href="https://github.com/maystudios/cc-templates"
            target="_blank"
            rel="noopener noreferrer"
            className="swiss-btn-secondary"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/cc-templates"
            target="_blank"
            rel="noopener noreferrer"
            className="swiss-btn-secondary"
          >
            npm
          </a>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { label: "Typ",       value: "CLI Tool" },
    { label: "Sprache",   value: "TypeScript" },
    { label: "Lizenz",    value: "MIT" },
    { label: "Node.js",   value: "≥ 22" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: "1px solid var(--sw-border)" }}>
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="px-6 py-5"
          style={{ borderRight: i < stats.length - 1 ? "1px solid var(--sw-border)" : undefined }}
        >
          <p className="swiss-eyebrow">{s.label}</p>
          <p className="font-display font-bold text-sm" style={{ color: "var(--sw-fg)" }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProjectCcTemplates() {
  return (
    <div className="bg-canvas min-h-screen pt-16">
      <Link
        to="/#projects"
        className="back-to-portfolio fixed left-4 top-[72px] z-40"
        aria-label="Zurück zur Projektübersicht"
      >
        ← Alle Projekte
      </Link>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Hero />
      </motion.div>

      <StatsBar />

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 space-y-20">

        {/* 1. Was ist cc-templates */}
        <FadeIn>
          <section>
            <Eyebrow>Kontext</Eyebrow>
            <SectionHeading>Was ist cc-templates?</SectionHeading>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--sw-text-muted)", maxWidth: "60ch" }}>
              cc-templates ist ein <strong style={{ color: "var(--sw-fg)" }}>Paketmanager für Claude Code</strong>.
              Wer Skills, Agents, Hooks oder Commands aus dem Community-Katalog installieren möchte,
              braucht dafür keinen manuellen Datei-Copy mehr — ein einziger{" "}
              <code style={{ color: "var(--sw-accent-light)" }}>npx</code>-Befehl reicht.
              Die Komponenten landen direkt in <code style={{ color: "var(--sw-accent-light)" }}>.claude/</code> und
              sind sofort in Claude Code verfügbar.
            </p>

            {/* Interactive demo */}
            <Terminal title="bash — interaktives Menü">
              <TLine command="npx cc-templates" />
              <TOutput>? What type of component do you want to install?</TOutput>
              <TOutput>  Skill · Agent · Hook · Command</TOutput>
              <TOutput>? Which skill?</TOutput>
              <TOutput>  tech-product-landing</TOutput>
              <TOutput>  video-download</TOutput>
              <TOutput>  video-fetch-and-summarize</TOutput>
              <TOutput>▸ video-summarizer</TOutput>
              <p className="pl-5 text-xs" style={{ color: "#86efac" }}>✓ Installed skill video-download to .claude/skills/video-download/</p>
            </Terminal>
          </section>
        </FadeIn>

        {/* 2. Component Types */}
        <FadeIn>
          <section>
            <Eyebrow>Komponenten</Eyebrow>
            <SectionHeading>Was lässt sich installieren?</SectionHeading>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-px"
              style={{ background: "var(--sw-border)", border: "1px solid var(--sw-border)" }}
            >
              {COMPONENT_TYPES.map((c) => (
                <div
                  key={c.type}
                  className="p-6"
                  style={{ background: "var(--sw-surface)", borderTop: `2px solid ${c.accent}` }}
                >
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 className="font-display font-bold text-sm" style={{ color: c.accent }}>{c.type}</h3>
                    <code className="font-mono text-xs" style={{ color: "var(--sw-text-faint)" }}>{c.flag}</code>
                  </div>
                  <p className="text-xs mb-2" style={{ color: "var(--sw-text-muted)", lineHeight: 1.6 }}>{c.desc}</p>
                  <p className="font-mono text-xs" style={{ color: "var(--sw-text-faint)" }}>→ {c.dest}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* 3. CLI Commands */}
        <FadeIn>
          <section>
            <Eyebrow>Usage</Eyebrow>
            <SectionHeading>Alle Befehle</SectionHeading>

            <div className="space-y-4">
              <div
                className="p-6 relative overflow-hidden"
                style={{
                  background: "var(--sw-surface)",
                  border: "1px solid var(--sw-border-light)",
                  borderLeft: "3px solid var(--sw-accent)",
                  borderRadius: "2px",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)",
                  }}
                />
                <p className="swiss-eyebrow mb-3" style={{ color: "var(--sw-accent)" }}>Interaktiv</p>
                <Terminal title="bash">
                  <TLine command="npx cc-templates" />
                  <TComment>→ Menü: Typ wählen → Komponente wählen → fertig</TComment>
                </Terminal>
              </div>

              <Terminal title="bash — direkte Installation">
                <TLine command="npx cc-templates --skill video-download" />
                <TLine command="npx cc-templates --agent my-agent" />
                <TLine command="npx cc-templates --hook my-hook" />
                <TLine command="npx cc-templates --command my-command" />
                <TLine command="npx cc-templates --list" comment="gesamten Katalog anzeigen" />
                <TLine command="npx cc-templates --skill video-download --global" comment="nach ~/.claude/ installieren" />
                <TLine command="npx cc-templates --skill video-download --force" comment="bestehende überschreiben" />
              </Terminal>

              <div>
                <p className="swiss-eyebrow mb-3">Via skills.sh</p>
                <Terminal>
                  <TLine command="npx skills add maystudios/cc-templates" comment="alle Skills" />
                  <TLine command="npx skills add maystudios/cc-templates --skill video-download" />
                </Terminal>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 4. Available Skills */}
        <FadeIn>
          <section>
            <Eyebrow>Katalog</Eyebrow>
            <SectionHeading>Verfügbare Skills</SectionHeading>

            <div style={{ border: "1px solid var(--sw-border)" }}>
              <div
                className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 hidden sm:grid"
                style={{ borderBottom: "1px solid var(--sw-border)", background: "var(--sw-surface)" }}
              >
                <span className="swiss-eyebrow" style={{ marginBottom: 0 }}>Name</span>
                <span className="swiss-eyebrow" style={{ marginBottom: 0 }}>Beschreibung</span>
              </div>
              {AVAILABLE_SKILLS.map((skill, i) => (
                <div
                  key={skill.name}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-1 sm:gap-4 px-5 py-4"
                  style={{ borderBottom: i < AVAILABLE_SKILLS.length - 1 ? "1px solid var(--sw-border)" : undefined }}
                >
                  <span className="font-mono text-xs" style={{ color: "var(--sw-accent-light)" }}>
                    {skill.name}
                  </span>
                  <span className="text-xs leading-relaxed" style={{ color: "var(--sw-text-muted)" }}>
                    {skill.desc}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: "var(--sw-text-faint)" }}>
              Agents, Hooks und Commands folgen — der Katalog wächst via Community Pull Requests.
            </p>
          </section>
        </FadeIn>

        {/* 5. Links */}
        <FadeIn>
          <section>
            <Eyebrow>Links</Eyebrow>
            <div
              className="grid sm:grid-cols-2 gap-px"
              style={{ background: "var(--sw-border)", border: "1px solid var(--sw-border)" }}
            >
              {[
                { label: "GitHub", href: "https://github.com/maystudios/cc-templates", sub: "github.com/maystudios/cc-templates" },
                { label: "npm",    href: "https://www.npmjs.com/package/cc-templates",  sub: "npmjs.com/package/cc-templates" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6"
                  style={{ background: "var(--sw-surface)", textDecoration: "none", transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sw-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--sw-surface)")}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-sm" style={{ color: "var(--sw-fg)" }}>{link.label}</span>
                    <span style={{ color: "var(--sw-text-faint)" }}>↗</span>
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
