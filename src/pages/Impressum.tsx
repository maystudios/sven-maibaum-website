export default function Impressum() {
  return (
    <main className="container mx-auto px-6 section-padding project-detail-container project-detail-content">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        <span className="gradient-text">Impressum</span>
      </h1>

      <h2>Angaben gemäß § 5 DDG</h2>
      <address className="not-italic leading-7">
        <strong>Sven Maibaum</strong>
        <br />
        Einzelunternehmer, Software-Architekt &amp; Spieleentwickler
        <br />
        [Straße Hausnummer]
        <br />
        51399 Burscheid
        <br />
        Deutschland
      </address>

      <h2>Kontakt</h2>
      <p>
        E-Mail (primär): <a href="mailto:contact@sven-maibaum.com" className="footer-link">contact@sven-maibaum.com</a>
        <br />
        E-Mail (geschäftlich): <a href="mailto:company@maystudios.net" className="footer-link">company@maystudios.net</a>
        <br />
        Telefon: [Telefonnummer]
      </p>
      <p>
        Für schnelle Rückfragen steht das <a href="/#contact" className="footer-link">Kontaktformular</a> zur Verfügung.
      </p>

      <h2>Berufliche Angaben</h2>
      <p>
        Berufsbezeichnung: Software-Architekt / Spieleentwickler
        <br />
        Verliehen in: Deutschland
      </p>
      <p>
        Die Berufsbezeichnung „Software-Architekt“ ist nicht gesetzlich reguliert und nicht kammerpflichtig. Es besteht
        keine Mitgliedschaft in einer Berufskammer im Sinne des Impressumsrechts.
      </p>

      <h2>Steuerliche Angaben</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:
        <br />
        [USt-IdNr., z. B. DE123456789, falls vorhanden]
      </p>
      <p>
        Steuernummer:
        <br />
        [Steuernummer im Format 214/xxxx/xxxx, Finanzamt NRW]
      </p>

      <h2>Verantwortlich für den Inhalt</h2>
      <address className="not-italic leading-7">
        Sven Maibaum
        <br />
        [Straße Hausnummer]
        <br />
        51399 Burscheid
      </address>
      <p>(Vorsorglich auch gemäß § 18 Abs. 2 MStV, soweit redaktionell gestaltete Inhalte vorliegen.)</p>

      <h2>Streitbeilegung</h2>
      <p>
        Die Online-Streitbeilegungsplattform der EU-Kommission wurde am 20. Juli 2025 abgeschaltet. Ein Link auf diese
        Plattform ist daher nicht mehr vorgesehen.
      </p>
      <p>
        Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die Inhalte und Werke auf dieser Website (Texte, Grafiken, Code, Design) sind urheberrechtlich geschützt. Eine
        Vervielfältigung, Bearbeitung oder Verbreitung außerhalb der gesetzlichen Schranken bedarf der vorherigen
        schriftlichen Zustimmung des Urhebers.
      </p>
      <p className="mt-2">© [Jahr] Sven Maibaum</p>
    </main>
  );
}
