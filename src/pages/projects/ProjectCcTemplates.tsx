import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";

// ─── Data ────────────────────────────────────────────────────────────────────

const COMPONENT_TYPES = [
  {
    type: "Skills",
    flag: "--skill",
    desc: "Instruction sets that extend Claude's capabilities for specific tasks. Installed to .claude/skills/<name>/.",
    accent: "#3b82f6",
  },
  {
    type: "Agents",
    flag: "--agent",
    desc: "Custom sub-agents with specialized behaviors. Each defines a focused AI persona or workflow.",
    accent: "#10b981",
  },
  {
    type: "Hooks",
    flag: "--hook",
    desc: "Shell commands that run on Claude Code lifecycle events. Merged into settings.json — never overwrites existing hooks.",
    accent: "#f59e0b",
  },
  {
    type: "Commands",
    flag: "--command",
    desc: "Custom slash commands for Claude Code. Each adds a /command-name shortcut in the interface.",
    accent: "#8b5cf6",
  },
];

const AVAILABLE_SKILLS = [
  { name: "tech-product-landing", desc: "Landing pages für Software/CLI-Tools und Developer Libraries" },
  { name: "video-download",        desc: "Videos von YouTube, Instagram, TikTok u.v.m. herunterladen" },
  { name: "video-fetch-and-summarize", desc: "Videos herunterladen und mit Gemini AI zusammenfassen" },
  { name: "video-summarizer",      desc: "Bestehende MP4-Dateien mit Gemini AI analysieren" },
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
      {/* Grid background */}
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
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--sw-accent)" }} />
          <span className="swiss-eyebrow" style={{ marginBottom: 0 }}>Open Source · MIT License</span>
        </motion.div>

        {/* Title */}
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
          maystudios
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-5 max-w-2xl"
          style={{ color: "var(--sw-text-muted)", fontSize: "1.0625rem", lineHeight: 1.65 }}
        >
          Claude Code Komponenten installieren — Skills, Agents, Hooks und Commands —
          mit{" "}
          <strong style={{ color: "var(--sw-fg)", fontWeight: 600 }}>einem einzigen Befehl.</strong>
        </motion.p>

        {/* Install snippet + CTAs */}
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
            <span className="select-all" style={{ color: "#86efac" }}>npx maystudios</span>
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
    { label: "Typ",      value: "CLI Tool" },
    { label: "Sprache",  value: "TypeScript" },
    { label: "Lizenz",   value: "MIT" },
    { label: "Status",   value: "Aktiv" },
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

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 space-y-20">

        {/* 1. What is it */}
        <FadeIn>
          <section>
            <Eyebrow>Kontext</Eyebrow>
            <SectionHeading>Was ist maystudios?</SectionHeading>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--sw-text-muted)", maxWidth: "52ch" }}>
              Ein CLI-Tool, das Claude Code Komponenten aus dem öffentlichen Katalog in Sekunden installiert.
              Statt Skills, Agents oder Hooks manuell zu kopieren, reicht ein einziger <code style={{ color: "var(--sw-accent-light)" }}>npx</code>-Befehl.
            </p>

            {/* Component types grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-px"
              style={{ background: "var(--sw-border)", border: "1px solid var(--sw-border)" }}
            >
              {COMPONENT_TYPES.map((c) => (
                <div
                  key={c.type}
                  className="p-6"
                  style={{
                    background: "var(--sw-surface)",
                    borderTop: `2px solid ${c.accent}`,
                  }}
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="font-display font-bold text-sm" style={{ color: c.accent }}>{c.type}</h3>
                    <code className="font-mono text-xs" style={{ color: "var(--sw-text-faint)" }}>{c.flag} &lt;name&gt;</code>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--sw-text-muted)" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* 2. Installation */}
        <FadeIn>
          <section>
            <Eyebrow>Getting Started</Eyebrow>
            <SectionHeading>Installation</SectionHeading>

            {/* Interactive */}
            <div
              className="p-6 mb-6 relative overflow-hidden"
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
                <TLine command="npx maystudios" />
                <TComment>→ Wähle Komponenten-Typ: Skill · Agent · Hook · Command</TComment>
                <TComment>→ Wähle Komponente aus dem Katalog</TComment>
                <TComment>→ Fertig — installiert in .claude/</TComment>
              </Terminal>
            </div>

            {/* Direct */}
            <div className="mb-6">
              <p className="swiss-eyebrow mb-3">Direkt — ohne Menü</p>
              <Terminal>
                <TLine command="npx maystudios --skill tech-product-landing" />
                <TLine command="npx maystudios --skill video-download" />
                <TLine command="npx maystudios --list" comment="Gesamten Katalog anzeigen" />
                <TLine command="npx maystudios --skill &lt;name&gt; --global" comment="Zu ~/.claude/ installieren" />
                <TLine command="npx maystudios --skill &lt;name&gt; --force" comment="Bestehende überschreiben" />
              </Terminal>
            </div>

            {/* Via skills.sh */}
            <div>
              <p className="swiss-eyebrow mb-3">Via skills.sh</p>
              <Terminal>
                <TLine command="npx skills add maystudios/cc-templates" comment="Alle Skills" />
                <TLine command="npx skills add maystudios/cc-templates --skill video-download" />
              </Terminal>
            </div>
          </section>
        </FadeIn>

        {/* 3. Available Skills */}
        <FadeIn>
          <section>
            <Eyebrow>Katalog</Eyebrow>
            <SectionHeading>Verfügbare Skills</SectionHeading>

            <div style={{ border: "1px solid var(--sw-border)" }}>
              <div
                className="grid grid-cols-[1fr_1fr] gap-4 px-5 py-3"
                style={{ borderBottom: "1px solid var(--sw-border)", background: "var(--sw-surface)" }}
              >
                <span className="swiss-eyebrow" style={{ marginBottom: 0 }}>Skill</span>
                <span className="swiss-eyebrow hidden sm:block" style={{ marginBottom: 0 }}>Beschreibung</span>
              </div>
              {AVAILABLE_SKILLS.map((skill, i) => (
                <div
                  key={skill.name}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-1 sm:gap-4 px-5 py-3.5"
                  style={{ borderBottom: i < AVAILABLE_SKILLS.length - 1 ? "1px solid var(--sw-border)" : undefined }}
                >
                  <span className="font-mono text-xs" style={{ color: "var(--sw-accent-light)" }}>
                    {skill.name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--sw-text-muted)" }}>{skill.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: "var(--sw-text-faint)" }}>
              Agents, Hooks und Commands folgen — der Katalog wächst via Community-Beiträge.
            </p>
          </section>
        </FadeIn>

        {/* 4. Links */}
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
