import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";

// ─── Data ────────────────────────────────────────────────────────────────────

const COMPONENT_TYPES = [
  {
    type: "Skills",
    flag: "--skill",
    dest: ".claude/skills/<name>/",
    desc: "Instruction sets, die Claude's Fähigkeiten für spezifische Tasks erweitern.",
    accent: "#3b82f6",
  },
  {
    type: "Agents",
    flag: "--agent",
    dest: ".claude/agents/<name>.md",
    desc: "Spezialisierte Sub-Agenten mit eigenem Verhalten und fokussierten Workflows.",
    accent: "#10b981",
  },
  {
    type: "Hooks",
    flag: "--hook",
    dest: "settings.json (gemergt)",
    desc: "Shell-Befehle auf Claude Code Lifecycle-Events. Werden sicher eingebunden.",
    accent: "#f59e0b",
  },
  {
    type: "Commands",
    flag: "--command",
    dest: ".claude/commands/<name>.md",
    desc: "Custom Slash-Commands, die als /name-Shortcut in Claude Code verfügbar sind.",
    accent: "#8b5cf6",
  },
];

const AVAILABLE_SKILLS = [
  { name: "tech-product-landing",       desc: "Landing Pages für CLI-Tools & Developer Libraries" },
  { name: "video-download",             desc: "Videos von 1000+ Plattformen via yt-dlp herunterladen" },
  { name: "video-fetch-and-summarize",  desc: "Videos herunterladen + KI-Zusammenfassung via Gemini" },
  { name: "video-summarizer",           desc: "Bestehende MP4-Dateien mit Gemini analysieren" },
];

const CLI_COMMANDS = [
  { cmd: "npx cc-templates",                              comment: "interaktives Menü" },
  { cmd: "npx cc-templates --skill <name>",               comment: "direkt installieren" },
  { cmd: "npx cc-templates --list",                       comment: "Katalog anzeigen" },
  { cmd: "npx cc-templates --skill <name> --global",      comment: "→ ~/.claude/" },
  { cmd: "npx cc-templates --skill <name> --force",       comment: "bestehende überschreiben" },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="swiss-eyebrow mb-3">{children}</p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display font-bold pb-4 mb-6"
      style={{
        fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
        letterSpacing: "-0.02em",
        borderBottom: "1px solid var(--sw-border)",
        color: "var(--sw-fg)",
      }}
    >
      {children}
    </h2>
  );
}

function Terminal({ children }: { children: React.ReactNode }) {
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
        className="flex items-center gap-2 px-4 py-2"
        style={{ borderBottom: "1px solid var(--sw-border)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
      </div>
      <div className="p-4 space-y-1.5 overflow-x-auto">{children}</div>
    </div>
  );
}

function TLine({ command, comment }: { command: string; comment?: string }) {
  return (
    <div className="flex gap-2 items-start flex-wrap">
      <span className="shrink-0 select-none" style={{ color: "var(--sw-accent)" }}>$</span>
      <span style={{ color: "#86efac" }}>{command}</span>
      {comment && <span style={{ color: "var(--sw-text-faint)" }}># {comment}</span>}
    </div>
  );
}

function TOut({ children, green }: { children: React.ReactNode; green?: boolean }) {
  return (
    <p
      className="pl-5 text-xs"
      style={{ color: green ? "#86efac" : "var(--sw-text-faint)" }}
    >
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
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
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
      style={{ borderBottom: "1px solid var(--sw-border)", minHeight: 360 }}
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 mb-5"
          style={{
            border: "1px solid var(--sw-border)",
            padding: "0.25rem 0.75rem",
            borderRadius: "2px",
          }}
        >
          <span className="swiss-eyebrow" style={{ marginBottom: 0, color: "var(--sw-text-faint)" }}>
            Open Source · MIT · Node.js ≥ 22
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.07 }}
          className="font-display font-bold"
          style={{
            fontSize: "clamp(2.75rem, 9vw, 5.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            color: "var(--sw-fg)",
          }}
        >
          cc-templates
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-5 max-w-xl"
          style={{ color: "var(--sw-text-muted)", fontSize: "1rem", lineHeight: 1.7 }}
        >
          Paketmanager für Claude Code. Skills, Agents, Hooks und Commands
          aus dem Community-Katalog mit einem einzigen Befehl installieren.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <div
            className="flex items-center gap-3 font-mono text-sm"
            style={{
              background: "var(--sw-surface)",
              border: "1px solid var(--sw-border)",
              padding: "0.6rem 1.1rem",
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <Hero />
      </motion.div>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-14 space-y-16">

        {/* 1. Was ist es */}
        <FadeIn>
          <section>
            <Eyebrow>Kontext</Eyebrow>
            <SectionHeading>Was ist cc-templates?</SectionHeading>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--sw-text-muted)", maxWidth: "58ch" }}>
              Statt Skills, Agents oder Hooks manuell zu kopieren, reicht ein einziger{" "}
              <code style={{ color: "var(--sw-accent-light)" }}>npx</code>-Befehl.
              Das interaktive Menü führt durch Typ und Auswahl — die Komponente
              landet direkt in <code style={{ color: "var(--sw-accent-light)" }}>.claude/</code> und
              ist sofort in Claude Code verfügbar.
            </p>

            <Terminal>
              <TLine command="npx cc-templates" />
              <TOut>? What type of component do you want to install?</TOut>
              <TOut>  Skill · Agent · Hook · Command</TOut>
              <TOut>? Which skill?</TOut>
              <TOut>▸ video-download</TOut>
              <TOut green>✓ Installed skill video-download to .claude/skills/video-download/</TOut>
            </Terminal>
          </section>
        </FadeIn>

        {/* 2. Komponenten */}
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
                  className="p-5"
                  style={{ background: "var(--sw-surface)", borderTop: `2px solid ${c.accent}` }}
                >
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <h3 className="font-display font-bold text-sm" style={{ color: c.accent }}>{c.type}</h3>
                    <code className="font-mono text-xs" style={{ color: "var(--sw-text-faint)" }}>{c.flag}</code>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--sw-text-muted)" }}>{c.desc}</p>
                  <p className="font-mono text-xs" style={{ color: "var(--sw-text-faint)" }}>→ {c.dest}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* 3. CLI */}
        <FadeIn>
          <section>
            <Eyebrow>Usage</Eyebrow>
            <SectionHeading>Befehle</SectionHeading>

            <Terminal>
              {CLI_COMMANDS.map((c) => (
                <TLine key={c.cmd} command={c.cmd} comment={c.comment} />
              ))}
            </Terminal>
            <p className="text-xs mt-3" style={{ color: "var(--sw-text-faint)" }}>
              <code style={{ color: "var(--sw-accent-light)" }}>--global</code> installiert nach{" "}
              <code style={{ color: "var(--sw-accent-light)" }}>~/.claude/</code> statt ins aktuelle Projekt.
            </p>
          </section>
        </FadeIn>

        {/* 4. Skill-Katalog */}
        <FadeIn>
          <section>
            <Eyebrow>Katalog</Eyebrow>
            <SectionHeading>Verfügbare Skills</SectionHeading>

            <div style={{ border: "1px solid var(--sw-border)" }}>
              {AVAILABLE_SKILLS.map((s, i) => (
                <div
                  key={s.name}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-1 sm:gap-6 px-5 py-3.5"
                  style={{ borderBottom: i < AVAILABLE_SKILLS.length - 1 ? "1px solid var(--sw-border)" : undefined }}
                >
                  <span className="font-mono text-xs" style={{ color: "var(--sw-accent-light)" }}>{s.name}</span>
                  <span className="text-xs" style={{ color: "var(--sw-text-muted)" }}>{s.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-2.5" style={{ color: "var(--sw-text-faint)" }}>
              Agents, Hooks und Commands folgen via Community Pull Requests.
            </p>
          </section>
        </FadeIn>

        {/* 5. Links */}
        <FadeIn>
          <section>
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
                  className="block p-5"
                  style={{ background: "var(--sw-surface)", textDecoration: "none", transition: "background 0.15s" }}
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
