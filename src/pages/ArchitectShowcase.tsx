import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";

type ComponentDetails = {
  title: string;
  description: string;
  points?: string[];
  tags?: string[];
};

const details: Record<string, ComponentDetails> = {
  "hexagon-core-details": {
    title: "Hexagonaler Kern (Geschäftslogik)",
    description:
      "Der Kern des Moduls enthält die reine Geschäftslogik, unabhängig von externer Infrastruktur. Er definiert, was die Anwendung kann, nicht wie es technisch umgesetzt wird.",
    points: [
      "Bildet die strukturelle Grundlage für einzelne Geschäftsmodule.",
      "Trennt klar die Geschäftslogik von Infrastruktur und externen Anbindungen.",
      "Interaktionen erfolgen ausschließlich über definierte Schnittstellen (Ports).",
    ],
    tags: ["Domain Logic", "Business Rules", "Encapsulation"],
  },
  "input-port-details": {
    title: "Input Port (Driving Port)",
    description:
      "Definiert, wie der Kern von außen angestoßen wird. Dient als Schnittstelle für Anwendungsdienste, die von Adaptern aufgerufen werden.",
    points: [
      "Ermöglicht Aufrufe von UI-Adaptern, Test-Adaptern oder Event-Listener-Adaptern.",
      "Kapselt Anwendungsfälle (Use Cases).",
    ],
    tags: ["API", "Use Cases", "Application Services"],
  },
  "output-port-details": {
    title: "Output Port (Driven Port)",
    description:
      "Definiert, wie der Kern mit externen Systemen oder Infrastrukturkomponenten interagiert, ohne direkte Abhängigkeiten zu diesen aufzubauen.",
    points: [
      "Wird von Adaptern implementiert (z.B. Datenbankzugriff, Event-Publizierung).",
      "Beispiele: Repository-Port, Event-Publisher-Port.",
    ],
    tags: ["Abstractions", "Infrastructure Interface"],
  },
  "adapter-details": {
    title: "Adapter",
    description:
      "Adapter verbinden den hexagonalen Kern mit der Außenwelt. Sie implementieren Output-Ports oder rufen Input-Ports auf.",
    points: [
      "Driving Adapter (Input): Konvertieren externe Anfragen (HTTP, Events) in Aufrufe an Input-Ports (z.B. UI-Controller, Event-Listener).",
      "Driven Adapter (Output): Implementieren Output-Ports für die Interaktion mit Infrastruktur (z.B. Datenbank-Repositories, Message Broker Clients).",
    ],
    tags: ["Infrastructure", "Integration", "Decoupling"],
  },
  "event-bus-details": {
    title: "Interner Event-Bus / Broker",
    description:
      "Ermöglicht die asynchrone und entkoppelte Kommunikation zwischen den verschiedenen hexagonalen Modulen innerhalb des Monolithen.",
    points: [
      "Empfängt Ereignisse von Event-Produzenten (Module).",
      "Leitet Ereignisse an interessierte Event-Konsumenten (andere Module) weiter.",
      "Kann In-Prozess implementiert sein für Monolithen.",
    ],
    tags: ["EDA", "Asynchronous", "Decoupling", "Pub/Sub"],
  },
  "database-details-a": {
    title: "Logische Datenbank (Modul A)",
    description:
      "Jedes Geschäftsmodul (Hexagon) ist für seine eigenen Daten zuständig und besitzt logisch seine eigene Datenbank (z.B. eigenes Schema, eigene Tabellen).",
    points: [
      "Datenhoheit liegt beim Modul.",
      "Andere Module dürfen nicht direkt auf die Datenbanktabellen eines fremden Moduls zugreifen.",
      "Zugriff auf fremde Daten erfolgt über die API (Ports) des jeweiligen Moduls oder durch Reaktion auf publizierte Ereignisse.",
    ],
    tags: ["Data Ownership", "Encapsulation", "Schema per Module"],
  },
  "database-details-b": {
    title: "Logische Datenbank (Modul B)",
    description:
      "Jedes Geschäftsmodul (Hexagon) ist für seine eigenen Daten zuständig und besitzt logisch seine eigene Datenbank (z.B. eigenes Schema, eigene Tabellen).",
    points: [
      "Datenhoheit liegt beim Modul.",
      "Andere Module dürfen nicht direkt auf die Datenbanktabellen eines fremden Moduls zugreifen.",
      "Zugriff auf fremde Daten erfolgt über die API (Ports) des jeweiligen Moduls oder durch Reaktion auf publizierte Ereignisse.",
    ],
    tags: ["Data Ownership", "Encapsulation", "Schema per Module"],
  },
};

const currentYear = new Date().getFullYear();

const getTagClass = (tag: string) => {
  const lower = tag.toLowerCase();
  if (lower.includes("eda") || lower.includes("async")) return "tech-tag tech-tag-red";
  if (lower.includes("api") || lower.includes("use cases")) return "tech-tag tech-tag-green";
  if (lower.includes("domain") || lower.includes("business")) return "tech-tag tech-tag-purple";
  if (lower.includes("infra") || lower.includes("integration")) return "tech-tag tech-tag-blue";
  return "tech-tag tech-tag-gray";
};

export default function ArchitectShowcase() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const active = useMemo(() => (activeKey ? details[activeKey] : null), [activeKey]);

  useEffect(() => {
    if (!activeKey) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveKey(null);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeKey]);

  return (
    <div>
      <header className="sticky top-0 z-40 glassmorphism shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/#home" className="text-xl font-bold gradient-text">Sven Maibaum</a>
          <div className="flex items-center">
            <a href="/#home" className="hover:text-teal-400 transition duration-300">
              <i className="fas fa-arrow-left mr-2"></i>Zurück zum Portfolio
            </a>
            <ThemeToggle className="theme-switcher" title="Toggle theme" iconSizeClass="w-5 h-5" />
          </div>
        </div>
      </header>

      <main className="project-detail-container section-padding">
        <section id="showcase-intro" className="fade-in-up">
          <div className="project-detail-header text-center">
            <h1 className="gradient-text">Software Architektur Showcase</h1>
            <p className="project-subtitle mt-2">Ein Einblick in angewandte Architekturkonzepte und -prinzipien.</p>
          </div>
          <p className="text-center max-w-3xl mx-auto mt-4 mb-12">
            Als Software-Architekt entwerfe und implementiere ich robuste, skalierbare und wartbare Systeme. Diese Seite
            demonstriert einige der Konzepte und Muster, mit denen ich arbeite, um komplexe Herausforderungen zu lösen.
            Entdecken Sie interaktiv, wie modulare Architekturen und moderne Ansätze funktionieren.
          </p>
        </section>

        <section id="modular-event-driven-monolith" className="fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            <span className="gradient-text">Modulare, Ereignisgesteuerte Monolithische Architektur</span>
          </h2>
          <p className="text-center max-w-3xl mx-auto mb-8">
            Diese Architektur kombiniert die <strong className="text-teal-400">Hexagonale Architektur (Ports & Adapter)</strong>
            für klare Modulstrukturen mit einer <strong className="text-purple-400">Ereignisgesteuerten Architektur (EDA)</strong>
            für entkoppelte Kommunikation innerhalb eines Monolithen. Klicken Sie auf die Komponenten, um mehr zu erfahren.
          </p>

          <div className="glassmorphism p-6 md:p-8 rounded-xl shadow-xl mb-12">
            <div className="text-sm mb-4 text-center"><em>Diagramm: Vereinfachte Darstellung</em></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="border-2 border-dashed p-4 rounded-lg">
                <h4 className="font-semibold text-center mb-3 text-lg text-purple-400">Modul A (z.B. User Mgt.)</h4>
                <div
                  className="diagram-component hexagon-core"
                  data-title="Hexagonaler Kern (Modul A)"
                  data-details="hexagon-core-details"
                  onClick={() => setActiveKey("hexagon-core-details")}
                >
                  Hexagonaler Kern
                </div>
                <div className="flex justify-around mt-3">
                  <div
                    className="diagram-component port"
                    data-title="Input Port (Modul A)"
                    data-details="input-port-details"
                    onClick={() => setActiveKey("input-port-details")}
                  >
                    Input Port
                  </div>
                  <div
                    className="diagram-component port"
                    data-title="Output Port (Modul A)"
                    data-details="output-port-details"
                    onClick={() => setActiveKey("output-port-details")}
                  >
                    Output Port
                  </div>
                </div>
                <div
                  className="diagram-component adapter mt-3"
                  data-title="Adapter (Modul A)"
                  data-details="adapter-details"
                  onClick={() => setActiveKey("adapter-details")}
                >
                  Adapter (UI, DB, Event)
                </div>
                <div
                  className="diagram-component database mt-3"
                  data-title="Logische Datenbank (Modul A)"
                  data-details="database-details-a"
                  onClick={() => setActiveKey("database-details-a")}
                >
                  Logische DB A
                </div>
              </div>

              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="text-center">
                  <i className="fas fa-arrow-right arrow hidden md:inline-block"></i>
                  <i className="fas fa-arrow-down arrow md:hidden"></i>
                </div>
                <div
                  className="diagram-component event-bus w-full md:w-3/4"
                  data-title="Interner Event-Bus"
                  data-details="event-bus-details"
                  onClick={() => setActiveKey("event-bus-details")}
                >
                  Interner Event-Bus
                </div>
                <div className="text-center">
                  <i className="fas fa-arrow-right arrow hidden md:inline-block"></i>
                  <i className="fas fa-arrow-down arrow md:hidden"></i>
                </div>
              </div>

              <div className="border-2 border-dashed p-4 rounded-lg">
                <h4 className="font-semibold text-center mb-3 text-lg text-teal-400">Modul B (z.B. Produkt Mgt.)</h4>
                <div
                  className="diagram-component hexagon-core"
                  data-title="Hexagonaler Kern (Modul B)"
                  data-details="hexagon-core-details"
                  onClick={() => setActiveKey("hexagon-core-details")}
                >
                  Hexagonaler Kern
                </div>
                <div className="flex justify-around mt-3">
                  <div
                    className="diagram-component port"
                    data-title="Input Port (Modul B)"
                    data-details="input-port-details"
                    onClick={() => setActiveKey("input-port-details")}
                  >
                    Input Port
                  </div>
                  <div
                    className="diagram-component port"
                    data-title="Output Port (Modul B)"
                    data-details="output-port-details"
                    onClick={() => setActiveKey("output-port-details")}
                  >
                    Output Port
                  </div>
                </div>
                <div
                  className="diagram-component adapter mt-3"
                  data-title="Adapter (Modul B)"
                  data-details="adapter-details"
                  onClick={() => setActiveKey("adapter-details")}
                >
                  Adapter (Event Listener, DB)
                </div>
                <div
                  className="diagram-component database mt-3"
                  data-title="Logische Datenbank (Modul B)"
                  data-details="database-details-b"
                  onClick={() => setActiveKey("database-details-b")}
                >
                  Logische DB B
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="glassmorphism p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-teal-400">Vorteile</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Hohe Modularität & Kapselung</li>
                <li>Starke Entkopplung der Module</li>
                <li>Verbesserte Testbarkeit</li>
                <li>Flexibilität & Erweiterbarkeit</li>
                <li>Klare Verantwortlichkeiten</li>
                <li>Gute Vorbereitung für Microservices-Migration</li>
              </ul>
            </div>
            <div className="glassmorphism p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-orange-400">Potenzielle Herausforderungen</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Initiale Komplexität bei der Einführung</li>
                <li>Overhead des Event-Bus (auch In-Prozess)</li>
                <li>Debugging von asynchronen Flüssen</li>
                <li>Umgang mit Eventual Consistency (intern)</li>
                <li>Transaktionsmanagement über Modulgrenzen</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="core-competencies" className="mt-16 fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            <span className="gradient-text">Weitere Kernkompetenzen</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glassmorphism p-6 rounded-lg shadow-lg skill-card">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Microservice-Architekturen</h3>
              <p className="text-sm">
                Design und Implementierung verteilter Systeme mit Fokus auf Skalierbarkeit, Resilienz und unabhängiger
                Deployment-Fähigkeit.
              </p>
            </div>
            <div className="glassmorphism p-6 rounded-lg shadow-lg skill-card">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Cloud-Native Lösungen (AWS/GCP)</h3>
              <p className="text-sm">
                Entwicklung von Anwendungen, die optimal die Vorteile von Cloud-Plattformen nutzen (Serverless,
                Containerisierung, Managed Services).
              </p>
            </div>
            <div className="glassmorphism p-6 rounded-lg shadow-lg skill-card">
              <h3 className="text-xl font-semibold text-green-400 mb-2">API Design & Management</h3>
              <p className="text-sm">
                Konzeption von robusten und entwicklerfreundlichen APIs (REST, GraphQL) inklusive Versionierung,
                Sicherheit und Dokumentation.
              </p>
            </div>
          </div>
          <p className="text-center mt-8">Weitere Details zu spezifischen Technologien und Mustern folgen in Kürze...</p>
        </section>

        <a
          href="/#contact"
          className="block w-max mx-auto mt-12 bg-gradient-to-r text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Architektur-Diskussion starten
        </a>
      </main>

      <div
        id="componentInfoModal"
        className={`info-modal ${active ? "" : "hidden"}`}
        aria-labelledby="modalTitle"
        role="dialog"
        aria-modal="true"
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveKey(null);
        }}
      >
        <div className="info-modal-content">
          <div className="flex justify-between items-center mb-4">
            <h3 id="modalTitle" className="text-2xl font-bold gradient-text">
              {active?.title ?? "Komponentendetails"}
            </h3>
            <button
              id="closeModalButton"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Schließen"
              onClick={() => setActiveKey(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div id="modalBody">
            {active ? (
              <>
                <p>{active.description}</p>
                {active.points?.length ? (
                  <ul>
                    {active.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
                {active.tags?.length ? (
                  <div className="mt-4">
                    {active.tags.map((tag) => (
                      <span key={tag} className={getTagClass(tag)}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <p>Detailinformationen zur Komponente werden hier geladen...</p>
            )}
          </div>
        </div>
      </div>

      <footer className="py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {currentYear} Sven Maibaum. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
