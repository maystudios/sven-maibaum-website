import ProjectShell from "../../components/ProjectShell";

export default function ProjectExambyte() {
  return (
    <ProjectShell
      title="Exambyte"
      subtitle="Web-basiertes Testsystem als Alternative zu ILIAS für Programmierlabore."
      heroImage="https://placehold.co/900x500/e5a935/1a202c?text=Exambyte+Dashboard+Mockup"
      heroAlt="Exambyte - Dashboard Mockup des web-basierten Testsystems"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface2 mb-8">
        {[
          { label: "Typ", value: "Web-Applikation" },
          { label: "Backend", value: "Java / Spring Boot" },
          { label: "Auth", value: "GitHub OAuth2" },
          { label: "Status", value: "Abgeschlossen" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="text-xs uppercase tracking-widest text-faint mb-1">{stat.label}</p>
            <p className="font-display font-semibold text-fg text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2>Projektübersicht</h2>
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
      <div className="grid sm:grid-cols-2 gap-3 my-4">
        {[
          "Authentifizierung über GitHub OAuth mit differenzierten Rollen",
          "Multiple-Choice- und Freitextfragen",
          "Umfassende Testverwaltung: Erstellung, Durchführung und Bewertung",
          "Manuelle Bewertung mit verpflichtender Feedback-Funktion",
          "Detaillierte Korrekturstatus-Übersichten für Organisatoren",
          "Export-Funktionen für Testergebnisse im CSV-Format",
          "Klare Anzeige des Zulassungsstatus für Studierende",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm text-muted bg-surface border border-border p-3">
            <span className="w-1.5 h-1.5 bg-brand/60 rounded-full mt-1.5 shrink-0" />
            {item}
          </div>
        ))}
      </div>

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
    </ProjectShell>
  );
}
