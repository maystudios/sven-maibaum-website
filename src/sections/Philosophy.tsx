import { useEffect, useMemo, useState } from "react";

type PhilosophyItem = {
  key: string;
  title: string;
  summary: string;
  body: string[];
  bullets: string[];
  tags: string[];
};

const items: PhilosophyItem[] = [
  {
    key: "modular",
    title: "Modular & erweiterbar",
    summary: "Schnittstellen & Strukturen, die Änderungen leicht machen.",
    body: [
      "Systeme sind nie wirklich „fertig“. Ich designe APIs und Grenzen so, dass sie Erweiterungen aushalten – ohne Refactor-Lawinen.",
      "Hexagonal / Ports-&-Adapters, klare Abhängigkeitsrichtung, Events für Entkopplung wo sinnvoll.",
    ],
    bullets: [
      "Stabile Domänengrenzen, klare Verantwortlichkeiten",
      "Versionierbare Schnittstellen (API-Verträge)",
      "Kompatibel mit „modularer Monolith“ und Microservice-Cut",
    ],
    tags: ["Modular Monolith", "Ports & Adapters", "Extensibility"],
  },
  {
    key: "clean",
    title: "Clean Code & Design",
    summary: "Verständlich, testbar, anpassbar – über den ganzen Lifecycle.",
    body: [
      "Lesbar, testbar, änderbar – das zählt nachhaltig mehr als „clevere“ Einzeiler.",
      "Naming, klare Module, geringe Kopplung, hohe Kohäsion, sinnvolle Comments & Docs.",
    ],
    bullets: [
      "SOLID / KISS / YAGNI pragmatisch anwenden",
      "Automatisierte Tests & Linting",
      "Architektur-Fitnessfunktionen (Build-Guardrails)",
    ],
    tags: ["Clean Code", "Testing", "Maintainability"],
  },
  {
    key: "proto",
    title: "Schnell prototypen & lernen",
    summary: "Ideen praktisch prüfen, früh Erkenntnisse gewinnen.",
    body: [
      "Ich validiere früh: kleine Prototypen geben schnelle Erkenntnisse – auch wenn wir sie verwerfen.",
      "Fail-fast, aber nachhaltig: Prototyp ≠ Müllcode – Erkenntnisse fließen kuratiert ins Produkt.",
    ],
    bullets: [
      "Spike/Prototype → Decision Record",
      "Messbare Hypothesen statt Bauchgefühl",
      "Zeitbudget & Exit-Kriterien definieren",
    ],
    tags: ["Prototyping", "Lean Learning", "ADR"],
  },
  {
    key: "core",
    title: "Core-Systeme & Dev-Tools",
    summary: "Kleine Helfer mit großer Wirkung im Alltag.",
    body: [
      "Ich baue gern Grundlagen, die anderen den Alltag erleichtern: Utility-Libs, Reusable Widgets/Plugins, CI-Snippets.",
      "Viele kleine 1%-Verbesserungen ergeben spürbare Velocity-Gewinne.",
    ],
    bullets: [
      "Wiederverwendbare Komponenten/Blueprint-Libraries",
      "Gute Defaults, klare Doku, Beispielprojekte",
      "„Golden Path“ + Guardrails",
    ],
    tags: ["DX", "Tooling", "Reuse"],
  },
];

export default function Philosophy() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const active = useMemo(
    () => items.find((item) => item.key === activeKey) ?? null,
    [activeKey]
  );

  useEffect(() => {
    if (!activeKey) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveKey(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeKey]);

  return (
    <section id="philosophy" className="section-padding fade-in-up">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="gradient-text">Meine Arbeitsphilosophie</span>
        </h2>

        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="glassmorphism p-6 rounded-xl shadow-xl">
            <p className="leading-relaxed">
              Für mich ist wichtig, dass Systeme <strong>modular, wartbar und dynamisch</strong> aufgebaut sind.
              Sie sollen offen sein für Erweiterungen – egal ob durch andere Entwickler oder durch Nutzer.
              Ideen probiere ich schnell aus, um früh zu sehen, was funktioniert. So entsteht ein praktischer
              Lerneffekt und Lösungen, die nicht im Weg stehen.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {items.map((item, index) => (
            <article
              key={item.key}
              className="glassmorphism p-6 rounded-xl shadow-xl phil-card cursor-pointer hover:translate-y-[-2px] transition"
              data-key={item.key}
              onClick={() => setActiveKey(item.key)}
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm leading-relaxed mb-0">
                {item.summary}
                <span
                  className={`inline-block ml-1 ${
                    index === 0
                      ? "text-teal-400"
                      : index === 1
                        ? "text-orange-400"
                        : index === 2
                          ? "text-purple-400"
                          : "text-blue-400"
                  }`}
                >
                  Mehr&nbsp;Infos
                </span>
              </p>
            </article>
          ))}
        </div>
      </div>

      <div
        id="philosophy-overlay"
        className={`info-modal ${active ? "" : "hidden"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="philosophy-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveKey(null);
        }}
      >
        <div className="info-modal-content modal-panel">
          <div className="flex items-start justify-between gap-4">
            <h3 id="philosophy-title" className="text-2xl font-bold gradient-text">
              {active?.title ?? ""}
            </h3>

            <button
              id="philosophy-close"
              className="modal-close rounded-lg p-2 min-h-[44px] min-w-[44px] hover:bg-white/5"
              aria-label="Schließen"
              onClick={() => setActiveKey(null)}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div id="philosophy-body" className="mt-3 space-y-3 text-sm leading-relaxed">
            {active?.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {active?.bullets?.length ? (
              <ul className="list-disc list-inside space-y-1">
                {active.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div id="philosophy-tags" className="mt-4 flex flex-wrap gap-2">
            {active?.tags.map((tag) => (
              <span key={tag} className="tech-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
