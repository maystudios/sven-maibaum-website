const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer id="site-footer" className="footer glassmorphism border-t">
      <div className="container mx-auto px-6 py-10 grid gap-8 footer-grid">
        <section aria-labelledby="footer-brand" className="footer-col">
          <h2 id="footer-brand" className="text-xl font-semibold gradient-text">
            Sven Maibaum
          </h2>
          <p className="mt-3 text-sm footer-text">
            Leitender Software-Architekt & Spieleentwickler.
          </p>
          <p className="mt-2 text-sm footer-text-muted">Letztes Update: Dez 2025</p>
        </section>

        <nav aria-labelledby="footer-links" className="footer-col">
          <h2 id="footer-links" className="text-sm font-semibold tracking-wide footer-heading">
            Schnellzugriff
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <a className="footer-link nav-link" href="/#projects">
                Projekte
              </a>
            </li>
            <li>
              <a className="footer-link nav-link" href="/#skills">
                Skills
              </a>
            </li>
            <li>
              <a className="footer-link nav-link" href="/#about">
                Über mich
              </a>
            </li>
            <li>
              <a className="footer-link nav-link" href="/showcase">
                Architektur Showcase
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-legal" className="footer-col">
          <h2 id="footer-legal" className="text-sm font-semibold tracking-wide footer-heading">
            Rechtliches
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <a className="footer-link" href="/impressum">
                Impressum
              </a>
            </li>
            <li>
              <a className="footer-link" href="/datenschutz">
                Datenschutz
              </a>
            </li>
            <li>
              <a className="footer-link" href="/agb">
                AGB
              </a>
            </li>
          </ul>
        </nav>

        <section aria-labelledby="footer-contact" className="footer-col">
          <h2 id="footer-contact" className="text-sm font-semibold tracking-wide footer-heading">
            Kontakt
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <a className="footer-link" href="mailto:contact@sven-maibaum.com">
                contact@sven-maibaum.com
              </a>
            </li>
            <li className="flex items-center space-x-4">
              <a
                className="footer-icon"
                href="https://www.linkedin.com/in/sven-maibaum/"
                target="_blank"
                rel="noopener"
              >
                LinkedIn
              </a>
              <a
                className="footer-icon"
                href="https://github.com/maystudios"
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div
        className="container mx-auto px-6 py-4 text-sm text-center border-t"
        style={{ borderColor: "var(--glass-border)" }}
      >
        © <span id="currentYear">{currentYear}</span> Sven Maibaum. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
