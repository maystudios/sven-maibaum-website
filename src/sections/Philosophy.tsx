import { motion } from "motion/react";
import { staggerContainer, cardVariant } from "../lib/animations";

type PhilosophyItem = {
  number: string;
  title: string;
  summary: string;
  detail: string;
};

const items: PhilosophyItem[] = [
  {
    number: "01",
    title: "Modular & erweiterbar",
    summary: "Schnittstellen & Strukturen, die \u00c4nderungen leicht machen.",
    detail:
      "Systeme sind nie wirklich \u201efertig\u201c. Ich designe APIs und Grenzen so, dass sie Erweiterungen aushalten \u2013 ohne Refactor-Lawinen. Hexagonal / Ports-&-Adapters, klare Abh\u00e4ngigkeitsrichtung, Events f\u00fcr Entkopplung wo sinnvoll.",
  },
  {
    number: "02",
    title: "Clean Code & Design",
    summary:
      "Verst\u00e4ndlich, testbar, anpassbar \u2013 \u00fcber den ganzen Lifecycle.",
    detail:
      "Lesbar, testbar, \u00e4nderbar \u2013 das z\u00e4hlt nachhaltig mehr als \u201eckleve\u201c Einzeiler. Naming, klare Module, geringe Kopplung, hohe Koh\u00e4sion, sinnvolle Comments & Docs.",
  },
  {
    number: "03",
    title: "Schnell prototypen & lernen",
    summary: "Ideen praktisch pr\u00fcfen, fr\u00fch Erkenntnisse gewinnen.",
    detail:
      "Ich validiere fr\u00fch: kleine Prototypen geben schnelle Erkenntnisse \u2013 auch wenn wir sie verwerfen. Fail-fast, aber nachhaltig: Prototyp \u2260 M\u00fcllcode \u2013 Erkenntnisse flie\u00dfen kuratiert ins Produkt.",
  },
  {
    number: "04",
    title: "Core-Systeme & Dev-Tools",
    summary: "Kleine Helfer mit gro\u00dfer Wirkung im Alltag.",
    detail:
      "Ich baue gern Grundlagen, die anderen den Alltag erleichtern: Utility-Libs, Reusable Widgets/Plugins, CI-Snippets. Viele kleine 1%-Verbesserungen ergeben sp\u00fcrbare Velocity-Gewinne.",
  },
];


export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="bg-surface border-t border-border py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <p className="swiss-eyebrow mb-3">Philosophie</p>
        <h2 className="swiss-heading-lg mb-16">
          Meine Arbeitsphilosophie
        </h2>

        <motion.div
          className="grid md:grid-cols-2 gap-px bg-surface2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {items.map((item) => (
            <motion.div
              key={item.number}
              className="bg-surface p-8 cursor-default"
              variants={cardVariant}
              whileHover={{ y: -3, boxShadow: "inset 0 0 0 1px #3b82f6" }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-mono text-xs text-brand/50 tracking-widest mb-3 block">
                {item.number}
              </span>
              <h3 className="font-display font-bold text-fg text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-3">
                {item.summary}
              </p>
              <p className="text-faint text-sm leading-relaxed">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
