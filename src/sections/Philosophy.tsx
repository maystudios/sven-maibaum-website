import { motion } from "motion/react";
import { Layers, ShieldCheck, Zap, Wrench } from "lucide-react";

const items = [
  {
    icon: Layers,
    title: "Modular & erweiterbar",
    description:
      "Systeme sind nie wirklich fertig. Ich designe APIs und Grenzen so, dass sie Erweiterungen aushalten \u2013 ohne Refactor-Lawinen. Hexagonal\u2009/\u2009Ports-&-Adapters, klare Abh\u00e4ngigkeitsrichtung, Events f\u00fcr Entkopplung wo sinnvoll.",
  },
  {
    icon: ShieldCheck,
    title: "Clean Code & Design",
    description:
      "Lesbar, testbar, \u00e4nderbar \u2013 das z\u00e4hlt nachhaltig mehr als clevere Einzeiler. Naming, klare Module, geringe Kopplung, hohe Koh\u00e4sion, sinnvolle Comments & Docs \u2013 \u00fcber den gesamten Lifecycle.",
  },
  {
    icon: Zap,
    title: "Schnell prototypen & lernen",
    description:
      "Ich validiere fr\u00fch: kleine Prototypen geben schnelle Erkenntnisse \u2013 auch wenn wir sie verwerfen. Fail-fast, aber nachhaltig: Erkenntnisse flie\u00dfen kuratiert ins Produkt, kein Wegwerfcode.",
  },
  {
    icon: Wrench,
    title: "Core-Systeme & Dev-Tools",
    description:
      "Ich baue gern Grundlagen, die anderen den Alltag erleichtern: Utility-Libs, Reusable Widgets/Plugins, CI-Snippets. Viele kleine 1\u2009%-Verbesserungen ergeben sp\u00fcrbare Velocity-Gewinne im Team.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Philosophy() {
  return (
    <section id="philosophy" className="bg-canvas border-t border-border py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest text-muted font-medium mb-4">
            Arbeitsweise
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-fg leading-tight">
            Meine Arbeitsphilosophie
          </h2>
          <p className="mt-4 text-muted text-lg max-w-xl">
            Prinzipien, die ich in jedem Projekt verfolge – unabhängig von Technologie oder Teamgröße.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {items.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="relative bg-canvas p-8 group cursor-default"
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ boxShadow: "inset 0 0 0 1px #3b82f6" }}
              />

              <div className="mb-5 inline-flex items-center justify-center w-10 h-10 bg-surface text-brand">
                <Icon size={20} strokeWidth={1.5} />
              </div>

              <h3 className="text-fg font-bold text-lg mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
