import ThemeToggle from "../../components/ThemeToggle";

const currentYear = new Date().getFullYear();

export default function ProjectExambyte() {
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
          <h1 className="gradient-text">Exambyte</h1>
          <p className="project-subtitle">Web-basiertes Testsystem als Alternative zu ILIAS für Programmierlabore.</p>
        </div>

        <img
          src="https://placehold.co/900x500/e5a935/1a202c?text=Exambyte+Dashboard+Mockup"
          alt="Exambyte - Dashboard Mockup des web-basierten Testsystems"
          className="project-image-full"
          loading="lazy"
        />
        <div className="project-detail-content">
          <h2 className="gradient-text">Projektübersicht</h2>
          <p>
            ExamByte wurde als moderne und effiziente Alternative zur bestehenden Prüfungsplattform ILIAS für die
            Klausurzulassung im Programmierpraktikum entwickelt. Die Anwendung dient als webbasiertes Testsystem, das
            die Durchführung von Tests mit verschiedenen Fragetypen (Multiple-Choice, Freitext) unterstützt und eine
            manuelle Korrektur ermöglicht. Ein zentrales Feature ist die rollenbasierte Authentifizierung (Studenten,
            Korrektoren, Organisatoren, IT und Admin) über GitHub OAuth.
          </p>
          <p>
            Ziel war es, die Effizienz und Transparenz des gesamten Prüfungsprozesses zu verbessern. Studierende
            erhalten eine klare Übersicht über ihren Zulassungsstatus, während Korrektoren und Organisatoren eine
            bessere Kontrolle über den Korrekturfortschritt und die allgemeine Prüfungsverwaltung haben.
          </p>

          <h3>Wesentliche Funktionale Anforderungen</h3>
          <ul>
            <li>Authentifizierung über GitHub OAuth mit differenzierten Rollen.</li>
            <li>Unterstützung für Multiple-Choice- und Freitextfragen.</li>
            <li>Umfassende Testverwaltung: Erstellung, Durchführung und Bewertung von Tests.</li>
            <li>
              Manuelle Bewertung von Freitextaufgaben inklusive einer verpflichtenden Feedback-Funktion für Korrektoren.
            </li>
            <li>Detaillierte Übersichten für Organisatoren zur Verfolgung des Korrekturstatus und der Ergebnisse.</li>
            <li>Export-Funktionen für Testergebnisse im CSV-Format.</li>
            <li>Klare Anzeige des Zulassungsstatus für Studierende.</li>
          </ul>

          <h3>Architekturkonzept & Einschränkungen</h3>
          <p>Die Entwicklung von ExamByte unterlag spezifischen technologischen und organisatorischen Rahmenbedingungen.</p>
          <ul>
            <li><strong>Technologie-Stack:</strong> Verpflichtende Entwicklung in Java mit Spring Boot und PostgreSQL als Datenbank.</li>
            <li><strong>Authentifizierung:</strong> Ausschließlich über GitHub OAuth2.</li>
            <li><strong>Hosting:</strong> Bereitstellung als Docker-Container, verwaltet mit Docker Compose.</li>
            <li>
              <strong>Datenverarbeitung:</strong> Sichere Speicherung und Verarbeitung von Daten unter Einhaltung der Datenschutzrichtlinien.
            </li>
            <li><strong>Versionskontrolle:</strong> Verwaltung des Projekts in einem Git-Repository mit strukturierten Commits.</li>
            <li><strong>Barrierefreiheit:</strong> Kompatibilität mit Screenreadern und Bedienbarkeit ohne Maus.</li>
          </ul>

          <h3>Technischer Kontext & Schnittstellen</h3>
          <ul>
            <li>
              <strong>Web-Frontend:</strong> Realisiert mit Thymeleaf und HTML/CSS (Bootstrap) für die Interaktion der Nutzer.
            </li>
            <li>
              <strong>REST API:</strong> Bereitstellung aller notwendigen Endpunkte für Testverwaltung und Bewertung mittels Spring Boot Controllern.
            </li>
            <li><strong>Datenbank:</strong> PostgreSQL zur Speicherung aller relevanten Test- und Nutzerdaten.</li>
            <li><strong>OAuth-Provider:</strong> GitHub OAuth zur Authentifizierung der Benutzer.</li>
          </ul>

          <h3>Eingesetzte Technologien</h3>
          <div className="my-4">
            <span className="tech-tag tech-tag-yellow">Java</span>
            <span className="tech-tag tech-tag-green">Spring Boot</span>
            <span className="tech-tag tech-tag-blue">PostgreSQL</span>
            <span className="tech-tag tech-tag-gray">GitHub OAuth</span>
            <span className="tech-tag tech-tag-orange">Docker</span>
            <span className="tech-tag tech-tag-orange">Docker Compose</span>
            <span className="tech-tag tech-tag-teal">Thymeleaf</span>
            <span className="tech-tag tech-tag-purple">Bootstrap</span>
            <span className="tech-tag tech-tag-gray">Git</span>
            <span className="tech-tag tech-tag-blue">REST APIs</span>
          </div>

          <h3>Ergebnisse & Lernerfahrungen</h3>
          <p>
            ExamByte stellt eine deutliche Verbesserung gegenüber dem vorherigen System dar, indem es eine
            benutzerfreundlichere Oberfläche, effizientere Korrekturprozesse und eine transparentere Ergebniskommunikation
            bietet. Die rollenbasierte Zugriffskontrolle und die Integration von GitHub OAuth gewährleisten Sicherheit
            und eine einfache Benutzerverwaltung. Das Projekt bot wertvolle Erfahrungen in der Konzeption und
            Implementierung eines vollumfänglichen Web-Systems unter Berücksichtigung von Skalierbarkeit, Sicherheit und
            Benutzerfreundlichkeit.
          </p>
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
