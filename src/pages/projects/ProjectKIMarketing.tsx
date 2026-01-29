import ThemeToggle from "../../components/ThemeToggle";

const currentYear = new Date().getFullYear();

export default function ProjectKIMarketing() {
  return (
    <div>
      <header className="sticky top-0 z-40 glassmorphism shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/#home" className="text-xl font-bold gradient-text">
            Sven Maibaum
          </a>
          <div className="flex items-center">
            <a href="/#projects" className="hover:text-teal-400 transition duration-300">
              <i className="fas fa-arrow-left mr-2"></i>Zurück zu Projekten
            </a>
            <ThemeToggle className="theme-switcher" title="Toggle theme" iconSizeClass="w-5 h-5" />
          </div>
        </div>
      </header>

      <main className="project-detail-container section-padding fade-in-up visible">
        <div className="project-detail-header">
          <h1 className="gradient-text">KI-Marketing Plattform (Konzept)</h1>
          <p className="project-subtitle">
            Eine innovative Lösung zur Automatisierung und Optimierung von Marketingkampagnen.
          </p>
        </div>

        <img
          src="https://placehold.co/900x500/1a202c/38b2ac?text=KI+Marketing+Plattform+Interface"
          alt="KI-Marketing Plattform - Interface Mockup einer intelligenten Marketinglösung"
          className="project-image-full"
          loading="lazy"
        />
        <div className="project-detail-content">
          <h2 className="gradient-text">Projektvision</h2>
          <p>
            Die KI-Marketing Plattform ist ein konzeptionelles Projekt von MayStudios, das darauf abzielt, die Art und
            Weise, wie Unternehmen ihre Marketingkampagnen planen, durchführen und analysieren, zu revolutionieren.
            Durch den Einsatz von künstlicher Intelligenz und Machine Learning sollen Marketingprozesse automatisiert,
            personalisierte Kundenerlebnisse geschaffen und der Return on Investment (ROI) signifikant gesteigert
            werden.
          </p>

          <h3>Kernziele des Konzepts</h3>
          <ul>
            <li>
              <strong>Automatisierung:</strong> Wiederkehrende Marketingaufgaben (z.B. Zielgruppensegmentierung,
              A/B-Testing von Anzeigen, Content-Verteilung) automatisieren.
            </li>
            <li>
              <strong>Personalisierung:</strong> Dynamische Anpassung von Marketingbotschaften und Angeboten an
              individuelle Nutzerprofile und -verhalten in Echtzeit.
            </li>
            <li>
              <strong>Predictive Analytics:</strong> Vorhersage von Kampagnenerfolgen, Kundenabwanderung (Churn) und
              optimalen Marketingausgaben durch datengestützte Modelle.
            </li>
            <li>
              <strong>Optimierung:</strong> Kontinuierliche Optimierung von Kampagnen durch Analyse von Leistungsdaten und
              automatische Anpassung von Parametern.
            </li>
            <li>
              <strong>Reporting & Insights:</strong> Bereitstellung verständlicher Dashboards und tiefgehender Einblicke
              in die Kampagnenleistung und das Kundenverhalten.
            </li>
          </ul>

          <h3>Potenzielle Module & Funktionen</h3>
          <ul>
            <li>Kunden-Daten-Plattform (CDP) Integration</li>
            <li>KI-gestützte Content-Erstellung und -Optimierung</li>
            <li>Automatisierte E-Mail-Marketing-Flows</li>
            <li>Intelligente Budgetallokation für Werbekanäle</li>
            <li>Sentiment-Analyse von Kundenfeedback</li>
            <li>Chatbot-Integration für Kundenservice und Lead-Generierung</li>
          </ul>

          <h3>Technologischer Ansatz (Konzept)</h3>
          <p>
            Die Plattform würde auf einem modernen Technologie-Stack basieren, der Skalierbarkeit, Flexibilität und
            schnelle Iteration ermöglicht.
          </p>
          <div className="my-4">
            <span className="tech-tag tech-tag-teal">Python (Flask/Django, FastAPI)</span>
            <span className="tech-tag tech-tag-yellow">Machine Learning (Scikit-learn, TensorFlow/PyTorch)</span>
            <span className="tech-tag tech-tag-purple">React / Vue.js / Svelte (Frontend)</span>
            <span className="tech-tag tech-tag-blue">Datenbanken (z.B. PostgreSQL, MongoDB)</span>
            <span className="tech-tag tech-tag-gray">Cloud-Infrastruktur (AWS, GCP, Azure)</span>
            <span className="tech-tag tech-tag-orange">Data-Pipelines (z.B. Apache Airflow)</span>
            <span className="tech-tag tech-tag-green">Big Data Technologien (z.B. Spark)</span>
          </div>

          <h3>Mehrwert & Ausblick</h3>
          <p>
            Eine solche KI-Marketing Plattform würde Unternehmen ermöglichen, ihre Marketingeffizienz drastisch zu
            steigern, Kosten zu senken und eine tiefere, personalisierte Beziehung zu ihren Kunden aufzubauen.
            MayStudios sieht in diesem Bereich erhebliches Potenzial und ist bereit, dieses Konzept für interessierte
            Partner weiterzuentwickeln und zu realisieren.
          </p>

          <div className="mt-8">
            <a
              href="/#contact"
              className="bg-gradient-to-r text-white font-medium py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 inline-block shadow-md button-like-class"
            >
              Konzept besprechen <i className="fas fa-comments ml-2"></i>
            </a>
          </div>
        </div>

        <a href="/#projects" className="back-to-portfolio">
          <i className="fas fa-arrow-left mr-2"></i>Alle Projekte anzeigen
        </a>
      </main>

      <footer className="py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {currentYear} Sven Maibaum. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
