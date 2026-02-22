import { motion } from "motion/react";
import { staggerContainerSlow, fadeInLeft, lineReveal } from "../lib/animations";

type ExperienceEntry = {
  period: string;
  company: string;
  title: string;
  detail: string;
  tags: string[];
};

const experiences: ExperienceEntry[] = [
  {
    period: "März 2025 – Heute",
    company: "LikeTik by Axinity (Teilzeit)",
    title: "Leitender Software-Architekt",
    detail:
      "Verantwortlich für Software-Projektleitung und die Konzeption sowie Implementierung skalierbarer Web-Architekturen in innovativen Software-Engineering Projekten.",
    tags: ["Architektur", "Web", "Projektleitung"],
  },
  {
    period: "Okt. 2024 – Heute",
    company: "Emotions Gaming (Teilzeit)",
    title: "Leitender Spieleentwickler",
    detail:
      'Führende Rolle in der Entwicklung kreativer und technisch anspruchsvoller Spiele, u.a. für das Open-World-Multiplayer-Projekt "The Prisonbreak". Einsatz von Perforce und Unreal Engine.',
    tags: ["Unreal Engine", "Perforce", "Multiplayer"],
  },
  {
    period: "Juni 2023 – Heute",
    company: "MayStudios (Freiberuflich)",
    title: "Unternehmensinhaber & Entwickler",
    detail:
      "Data Scientist & Full-Stack Developer mit über 6 Jahren Erfahrung. Spezialisiert auf Backend-Systeme mit Spring Boot/Framework und datengetriebene Lösungen.",
    tags: ["Spring Boot", "Full-Stack", "Data Science"],
  },
  {
    period: "März 2024 – Juli 2024",
    company: "Phantomedia (Vollzeit)",
    title: "Spieleentwickler",
    detail:
      "Mitwirkung an der Entwicklung von Spielen unter Verwendung von Perforce und Unreal Engine, Fokus auf Gameplay-Mechaniken und Systemintegration.",
    tags: ["Unreal Engine", "Gameplay", "Systeme"],
  },
];


export default function Experience() {
  return (
    <section
      id="experience"
      className="bg-canvas border-t border-border py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <p className="swiss-eyebrow mb-3">Erfahrung</p>
        <h2 className="swiss-heading-lg mb-16">
          Berufserfahrung
        </h2>

        <motion.div
          className="relative"
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
        >
          {/* Animated vertical timeline line (desktop only) */}
          <motion.div
            className="hidden md:block absolute left-[199px] top-0 bottom-0 w-px bg-surface2 origin-top"
            variants={lineReveal}
          />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                className="grid md:grid-cols-[200px_1fr] gap-8 relative"
                variants={fadeInLeft}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Timeline dot (desktop only) */}
                <motion.div
                  className="hidden md:block absolute left-[195px] top-2 w-2 h-2 bg-brand rounded-full"
                  aria-hidden="true"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: index * 0.5, ease: "easeInOut" }}
                />

                {/* Left: period + company */}
                <div className="text-sm text-faint">
                  <p className="font-mono text-xs text-faint mb-1">
                    {exp.period}
                  </p>
                  <p className="font-medium text-muted">{exp.company}</p>
                </div>

                {/* Right: title + detail + tags */}
                <div>
                  <h3 className="font-display font-bold text-fg mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {exp.detail}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border text-faint text-xs px-2 py-0.5 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
