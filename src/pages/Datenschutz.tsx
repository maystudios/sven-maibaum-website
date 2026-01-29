export default function Datenschutz() {
  return (
    <main className="container mx-auto px-6 section-padding project-detail-container project-detail-content">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        <span className="gradient-text">Datenschutzerklärung</span>
      </h1>

      <h2>1. Verantwortlicher</h2>
      <p>Sven Maibaum, [Adresse], E-Mail: company@maystudios.net</p>

      <h2>2. Hosting</h2>
      <p>
        Diese Website wird als statische Seite betrieben (z. B. GitHub Pages). Beim Aufruf werden Server-Logfiles
        verarbeitet (IP-Adresse, Datum/Zeit, User-Agent). Rechtsgrundlage ist Art. 6 Abs.1 lit. f DSGVO (berechtigte
        Interessen an stabiler Bereitstellung).
      </p>

      <h2>3. Kontaktaufnahme</h2>
      <p>
        Bei Kontaktaufnahme per E-Mail werden die angegebenen Daten zur Bearbeitung der Anfrage verarbeitet (Art. 6
        Abs.1 lit. b oder f DSGVO). Speicherung bis Abschluss der Anfrage oder gesetzlicher Aufbewahrung.
      </p>

      <h2>4. Formulare (Formspree)</h2>
      <p>
        Für das Kontaktformular nutzen wir Formspree. Anbieter: Formspree, Inc. Übermittelte Daten werden an Formspree
        weitergeleitet. Details siehe Datenschutzhinweise des Anbieters. Rechtsgrundlage: Art. 6 Abs.1 lit. b DSGVO
        (Vertrag/Anfrage).
      </p>

      <h2>5. Cookies & lokale Speicherung</h2>
      <p>Wir verwenden keinen Tracking-Cookie. Das Theme (hell/dunkel) wird in <em>localStorage</em> gespeichert.</p>

      <h2>6. Analyse (Google Analytics / gtag)</h2>
      <p>
        Falls aktiviert: Google Analytics (IP-Anonymisierung, Aufbewahrungsdauer, Opt-Out-Möglichkeiten). Rechtsgrundlage
        regelmäßig: Art. 6 Abs.1 lit. a DSGVO (Einwilligung). Bitte Cookie-Banner/Consent nachrüsten, sofern Analytics
        produktiv genutzt wird.
      </p>

      <h2>7. Betroffenenrechte</h2>
      <ul>
        <li>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit (Art. 15–20 DSGVO)</li>
        <li>Widerspruch (Art. 21 DSGVO)</li>
        <li>Beschwerde bei einer Aufsichtsbehörde</li>
      </ul>

      <h2>8. Änderungen</h2>
      <p>
        Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder bei Änderungen
        des Dienstes anzupassen.
      </p>
    </main>
  );
}
