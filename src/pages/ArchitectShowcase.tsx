import { motion } from "motion/react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { staggerContainer, cardVariant, defaultViewport } from "../lib/animations";

type SkillCard = {
  number: string;
  title: string;
  tags: string[];
  tagColor: string;
};

const skillCards: SkillCard[] = [
  { number: "01", title: "Spieleentwicklung", tags: ["Unreal Engine 5", "Unity", "Blueprint", "C++"], tagColor: "purple" },
  { number: "02", title: "Backend-Architektur", tags: ["Java/Spring Boot", "Docker", "PostgreSQL", "REST APIs"], tagColor: "blue" },
  { number: "03", title: "KI & Data Science", tags: ["Python", "Machine Learning", "LLMs", "Analyse"], tagColor: "teal" },
  { number: "04", title: "Web Frontend", tags: ["React", "TypeScript", "Vite", "TailwindCSS"], tagColor: "blue" },
  { number: "05", title: "DevOps & Tooling", tags: ["CI/CD", "Git", "Linux", "Cloud"], tagColor: "gray" },
  { number: "06", title: "Prototyping & Game Jams", tags: ["Rapid Prototyping", "itch.io", "Jam-Projekte"], tagColor: "orange" },
];

const row1Skills = [
  { label: "React", color: "blue" },
  { label: "TypeScript", color: "blue" },
  { label: "Unreal Engine 5", color: "purple" },
  { label: "Java Spring Boot", color: "teal" },
  { label: "Python", color: "teal" },
  { label: "Node.js", color: "gray" },
  { label: "Docker", color: "blue" },
  { label: "PostgreSQL", color: "teal" },
  { label: "Unity", color: "purple" },
  { label: "C++", color: "gray" },
  { label: "TailwindCSS", color: "blue" },
];

const row2Skills = [
  { label: "Vite", color: "gray" },
  { label: "Blueprint Visual Scripting", color: "purple" },
  { label: "REST APIs", color: "blue" },
  { label: "CI/CD", color: "teal" },
  { label: "Linux", color: "gray" },
  { label: "Git", color: "orange" },
  { label: "Figma", color: "pink" },
  { label: "WebGL", color: "teal" },
  { label: "Spring Boot", color: "blue" },
  { label: "Machine Learning", color: "purple" },
];

const principleCards = [
  {
    number: "01",
    title: "Modular & Entkoppelt",
    description: "Saubere Grenzen zwischen Systemen. Ports & Adapters, klare Abhängigkeiten, Events zur Entkopplung.",
  },
  {
    number: "02",
    title: "Performance-First",
    description: "Architektur-Entscheidungen mit Blick auf Laufzeit. Profiling vor Optimierung, messbare Verbesserungen.",
  },
  {
    number: "03",
    title: "Developer Experience",
    description: "Code der Freude macht. Klares Naming, gute Dokumentation, schnelle Feedback-Loops im Dev-Workflow.",
  },
  {
    number: "04",
    title: "Spielmechanik & Systeme",
    description: "Gameplay als emergentes Verhalten aus gut designten Systemen. Playtesting als Validierung.",
  },
];

const featuredProjects = [
  { number: "01", title: "HeistLine", description: "Prison-Escape MMO in Unreal Engine 5", link: "/projekte/heistline" },
  { number: "02", title: "LikeTik", description: "Social-Commerce Plattform für TikTok", link: "/projekte/liketik" },
  { number: "03", title: "Exambyte", description: "KI-gestütztes Prüfungssystem", link: "/projekte/exambyte" },
];

export default function ArchitectShowcase() {
  return (
    <div className="bg-canvas">
      {/* Back button – fixed top-left */}
      <Link
        to="/"
        className="back-to-portfolio fixed top-4 left-4 z-40 inline-flex items-center gap-2 text-sm min-h-[44px]"
        aria-label="Zurück zur Startseite"
      >
        &larr; Startseite
      </Link>
      {/* SECTION 1 — Hero */}
      <section className="bg-canvas min-h-[60vh] relative overflow-hidden flex items-center justify-center">
        {/* Blue radial gradient vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 70%)" }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, rgba(59,130,246,0.5), transparent)" }}
        />

        {/* Geometric grid background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px"
              style={{ left: `${(i + 1) * 12.5}%`, backgroundColor: 'var(--grid-line-v)' }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px"
              style={{ top: `${(i + 1) * 16.67}%`, backgroundColor: 'var(--grid-line-h)' }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.2 + i * 0.07, ease: "easeOut" }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <p className="swiss-eyebrow mb-4">Developer Showcase</p>
          <h1 className="swiss-heading-xl text-fg mb-6">
            Mein technischer<br />Fingerabdruck
          </h1>
          <p className="swiss-body max-w-2xl mx-auto text-center">
            Ein Überblick über meine Fähigkeiten, Projekte und Denkweise als Software-Architekt und Spieleentwickler.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 — Kernkompetenzen */}
      <section className="bg-canvas border-t border-border py-24">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading eyebrow="Kompetenzen" title="Was ich beherrsche" className="mb-16" />
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {skillCards.map((card) => (
              <motion.div
                key={card.number}
                className="bg-surface p-8"
                variants={cardVariant}
                whileHover={{ boxShadow: "inset 0 0 0 1px #3b82f6" }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-mono text-xs text-brand/50 tracking-widest mb-3 block">{card.number}</span>
                <h3 className="font-display font-bold text-fg text-lg mb-4">{card.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag) => (
                    <span key={tag} className={`tech-tag tech-tag-${card.tagColor} text-[10px]`}>{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — Tech Stack Marquee */}
      <section className="bg-canvas border-t border-border py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <p className="swiss-eyebrow text-center mb-8">Technologien &amp; Werkzeuge</p>
        </div>
        <div
          className="overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex gap-3 mb-3">
            <div className="flex gap-3 animate-marquee whitespace-nowrap">
              {[...row1Skills, ...row1Skills].map((skill, i) => (
                <span key={i} className={`tech-tag tech-tag-${skill.color} px-3 py-1 text-xs`}>{skill.label}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-3 animate-marquee-reverse whitespace-nowrap">
              {[...row2Skills, ...row2Skills].map((skill, i) => (
                <span key={i} className={`tech-tag tech-tag-${skill.color} px-3 py-1 text-xs`}>{skill.label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Architektur-Prinzipien */}
      <section className="bg-canvas border-t border-border py-24">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeading eyebrow="Arbeitsweise" title="Meine Prinzipien" className="mb-16" />
          <motion.div
            className="grid md:grid-cols-2 gap-px bg-surface2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {principleCards.map((card) => (
              <motion.div
                key={card.number}
                className="bg-surface p-8"
                variants={cardVariant}
                whileHover={{ boxShadow: "inset 0 0 0 1px #3b82f6" }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-mono text-xs text-brand/50 tracking-widest mb-3 block">{card.number}</span>
                <h3 className="font-display font-bold text-fg text-lg mb-3">{card.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 — Ausgewählte Projekte */}
      <section className="bg-canvas border-t border-border py-24">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading eyebrow="Portfolio" title="Ausgewählte Projekte" className="mb-16" />
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {featuredProjects.map((project) => (
              <motion.div
                key={project.number}
                className="bg-surface border border-border p-6 hover:border-brand transition-colors duration-200"
                variants={cardVariant}
                whileHover={{ y: -2 }}
              >
                <span className="font-mono text-xs text-brand/50 tracking-widest mb-3 block">{project.number}</span>
                <h3 className="font-display font-bold text-fg mb-2">{project.title}</h3>
                <p className="text-muted text-sm mb-4">{project.description}</p>
                <Link to={project.link} className="swiss-btn-secondary inline-flex items-center gap-2 text-sm">
                  Ansehen
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="translate-y-px">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 6 — CTA Footer */}
      <section className="bg-canvas border-t border-border py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6"
        >
          <h2 className="swiss-heading-md text-fg mb-4">Bereit für ein Gespräch?</h2>
          <p className="text-muted mb-8">Ich freue mich über neue Projekte, Ideen und Kooperationen.</p>
          <Link to="/#contact" className="swiss-btn-primary inline-flex items-center gap-2">
            Kontakt aufnehmen
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="translate-y-px">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
