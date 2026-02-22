import ProjectShell from "../../components/ProjectShell";

export default function ProjectKIMarketing() {
  return (
    <ProjectShell
      title="KI-Marketing Plattform (Konzept)"
      subtitle="Eine innovative Lösung zur Automatisierung und Optimierung von Marketingkampagnen."
      heroImage="https://placehold.co/900x500/1a202c/38b2ac?text=KI+Marketing+Plattform+Interface"
      heroAlt="KI-Marketing Plattform - Interface Mockup einer intelligenten Marketinglösung"
      ctaLabel="Konzept besprechen"
      ctaLink="/#contact"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-surface2 mb-8">
        {[
          { label: "Typ", value: "Konzeptprojekt" },
          { label: "Kerntech", value: "Python / LLMs" },
          { label: "Studio", value: "MayStudios" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="text-xs uppercase tracking-widest text-faint mb-1">{stat.label}</p>
            <p className="font-display font-semibold text-fg text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2>Projektvision</h2>
      <p>
        Die KI-Marketing Plattform ist ein konzeptionelles Projekt von MayStudios, das darauf abzielt, die Art und
        Weise, wie Unternehmen ihre Marketingkampagnen planen, durchführen und analysieren, zu revolutionieren.
        Durch den Einsatz von künstlicher Intelligenz und Machine Learning sollen Marketingprozesse automatisiert,
        personalisierte Kundenerlebnisse geschaffen und der Return on Investment (ROI) signifikant gesteigert
        werden.
      </p>

      <h3>Kernziele des Konzepts</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        {[
          { title: "Automatisierung", desc: "Wiederkehrende Marketingaufgaben wie Zielgruppensegmentierung und A/B-Testing automatisieren.", color: "brand" },
          { title: "Personalisierung", desc: "Dynamische Anpassung von Botschaften an individuelle Nutzerprofile in Echtzeit.", color: "teal" },
          { title: "Predictive Analytics", desc: "Vorhersage von Kampagnenerfolgen und optimalen Marketingausgaben durch datengestützte Modelle.", color: "purple" },
          { title: "Optimierung", desc: "Kontinuierliche Kampagnen-Optimierung durch Analyse von Leistungsdaten.", color: "brand" },
          { title: "Reporting & Insights", desc: "Verständliche Dashboards und tiefgehende Einblicke in Kampagnenleistung.", color: "teal" },
        ].map((item) => (
          <div key={item.title} className="bg-surface border border-border p-5 hover:border-brand transition-colors duration-200">
            <div className={`w-1 h-4 bg-${item.color} mb-3`} />
            <h4 className="font-display font-semibold text-fg text-sm mb-2">{item.title}</h4>
            <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

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
    </ProjectShell>
  );
}
