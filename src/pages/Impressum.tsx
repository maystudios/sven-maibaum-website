export default function Impressum() {
  return (
    <main className="container mx-auto px-6 section-padding project-detail-container">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        <span className="gradient-text">Impressum</span>
      </h1>
      <p className="mb-4">Angaben gemäß § 5 TMG</p>
      <address className="not-italic leading-7">
        <strong>Sven Maibaum</strong>
        <br />
        [Straße Hausnummer]
        <br />
        51399 Burscheid
        <br />
        Deutschland
        <br />
        E-Mail: <a href="mailto:company@maystudios.net" className="footer-link">company@maystudios.net</a>
      </address>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Umsatzsteuer-ID</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß §27a UStG: [falls vorhanden]</p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Berufsbezeichnung</h2>
      <p>Software-Architekt / Spieleentwickler</p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
        Gesetzen verantwortlich. ...
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Haftung für Links</h2>
      <p>Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. ...</p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Urheberrecht</h2>
      <p>
        Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
        Urheberrecht. ...
      </p>
    </main>
  );
}
