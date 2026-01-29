import ThemeToggle from "../../components/ThemeToggle";

const currentYear = new Date().getFullYear();

export default function ProjectLikeTik() {
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
          <h1 className="gradient-text">LikeTik</h1>
          <p className="project-subtitle">Die automatisierte Social Commerce Plattform für Creator, Brands & Agenturen.</p>
        </div>

        <img
          src="https://placehold.co/900x500/0a0f1f/8b5cf6?text=LikeTik+App+Showcase"
          alt="LikeTik Dashboard Visualisierung"
          className="project-image-full"
          loading="lazy"
        />

        <div className="project-detail-content">
          <h2 className="gradient-text">Projektübersicht</h2>
          <p>
            <strong>LikeTik</strong> ist eine revolutionäre Plattform, die Social Commerce automatisiert. Als
            <strong> Leitender Software-Architekt</strong> bei Axinity verantworte ich die technische Konzeption und
            Umsetzung dieses komplexen Ökosystems. Die App verbindet Content Creator direkt mit Brands und übernimmt die
            komplette Logistikkette – von der KI-basierten Produktauswahl bis zum Versand.
          </p>
          <p>
            Das Ziel: Follower in echte Käufer zu verwandeln, indem Creator ohne eigenes Lager oder kompliziertes
            Management sofort Produkte verkaufen können, die perfekt zu ihrer Zielgruppe passen.
          </p>

          <h3>Kernfeatures & Innovationen</h3>
          <ul>
            <li>
              <strong>KI-Produkt Matching:</strong> Algorithmen analysieren die Zielgruppe des Creators und schlagen
              Produkte mit der höchsten Kaufwahrscheinlichkeit vor.
            </li>
            <li>
              <strong>Automatisches Fulfillment:</strong> Vollständige Integration von Logistikprozessen – der Creator
              fokussiert sich nur auf Content.
            </li>
            <li>
              <strong>Real-Time Analytics:</strong> Ein Dashboard, das nicht nur vergangene Umsätze zeigt, sondern durch
              KI-Prognosen ("Future Predictions") Wachstumspotenziale aufzeigt.
            </li>
            <li>
              <strong>Multi-Channel Support:</strong> Integration von TikTok Shop, Shopify und eigenen Landing Pages.
            </li>
            <li>
              <strong>Brand Building:</strong> Tools, mit denen Creator in Sekunden ihre eigene Marke (Whitelabel)
              aufbauen können.
            </li>
          </ul>

          <h3>Eingesetzte Technologien</h3>
          <div className="my-4">
            <span className="tech-tag tech-tag-teal">Microservices</span>
            <span className="tech-tag tech-tag-purple">KI & ML</span>
            <span className="tech-tag tech-tag-blue">Cloud (AWS/GCP)</span>
            <span className="tech-tag tech-tag-green">Node.js / Spring Boot</span>
            <span className="tech-tag tech-tag-orange">React / Vue.js</span>
            <span className="tech-tag tech-tag-red">Big Data</span>
            <span className="tech-tag tech-tag-gray">TikTok API</span>
          </div>

          <h3>Ergebnisse</h3>
          <p>
            LikeTik ermöglicht es Creatorn und Agenturen, ihre Monetarisierung drastisch zu vereinfachen. Die Plattform
            skaliert automatisch mit dem Traffic viraler Videos und bietet eine der fortschrittlichsten Lösungen im
            europäischen Social Commerce Markt.
          </p>

          <div className="mt-8">
            <a
              href="https://www.liketik.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 inline-block shadow-md button-like-class"
            >
              Zur offiziellen Website <i className="fas fa-external-link-alt ml-2"></i>
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
