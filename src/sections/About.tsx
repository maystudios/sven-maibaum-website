export default function About() {
  return (
    <section id="about" className="section-padding fade-in-up">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="gradient-text">Über Mich</span>
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="md:w-1/3">
            <img
              src="/assets/images/sven_maibaum_profile.webp"
              alt="Sven Maibaum - Profilbild"
              className="rounded-full shadow-2xl mx-auto w-64 h-64 md:w-80 md:h-80 object-cover border-4 glow-effect"
              style={{ borderColor: "var(--link-color)" }}
              loading="lazy"
            />
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-4">
              <strong className="text-gray-300">Über mich</strong>
            </h3>

            <blockquote className="space-y-4 mb-6 text-left">
              <p className="leading-relaxed">
                Ich bin Sven Maibaum, Software-Architekt und Spieleentwickler. Schon als Kind
                habe ich alles auseinandergenommen, was irgendwie Technik war – einfach, um zu
                verstehen, wie es funktioniert. Mit elf Jahren habe ich angefangen zu
                programmieren und meine ersten kleinen Spiele gebaut.
              </p>

              <p className="leading-relaxed">
                Schon seit ich ein kleiner Junge war, wollte ich eigentlich Ingenieur werden.
                Maschinen, Mechanik und Logik haben mich von Anfang an fasziniert – das
                Zusammenspiel vieler kleiner Teile, die gemeinsam etwas Großes erschaffen. Mit
                der Zeit habe ich gemerkt, dass Software genau dieselben Prinzipien verfolgt –
                nur viel direkter greifbar, schneller umsetzbar und mit mehr Raum für
                Kreativität. Diese Verbindung aus Technik und Gestaltung hat mich bis heute
                nicht losgelassen.
              </p>

              <p className="leading-relaxed">
                Beruflich bin ich aktuell in mehreren Bereichen aktiv, die sich ideal ergänzen:
              </p>

              <p className="leading-relaxed">
                Bei <strong>LikeTik by </strong>
                <a
                  href="https://www.liketik.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  Axinity
                </a>
                <strong> </strong>arbeite ich als leitender Software-Architekt an einer
                E-Commerce-Plattform, die wir als <strong>offizieller Partner von TikTok</strong>
                entwickeln. Unser Ziel ist es, Social-Commerce technisch neu und skalierbar
                umzusetzen – mit stabilen Systemen, die Marken und Creator direkt miteinander
                verbinden.
              </p>

              <p className="leading-relaxed">
                Bei <strong>
                  <a
                    href="https://www.emotions-gaming.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:underline"
                  >
                    Emotions Gaming
                  </a>
                </strong> leite ich die Entwicklung des Spiels
                <strong>
                  <a
                    href="/projekte/heistline"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:underline"
                  >
                    {" „HeistLine"}
                  </a>
                </strong>
                , einem storybasierten Action-Projekt, bei dem Gameplay und Technik eng
                zusammenarbeiten, um ein intensives Spielerlebnis zu schaffen.
              </p>

              <p className="leading-relaxed">
                Mit <strong>
                  <a
                    href="http://maystudios.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline"
                  >
                    MayStudios
                  </a>
                </strong> konzentriere ich mich auf eigene Spiele- und Tool-Entwicklung –
                darunter Titel wie <em>Mr. Dork 3</em> sowie kleinere
                <a
                  href="https://maystudios.itch.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:underline"
                >
                  {" itch.io-Projekte"}
                </a>
                . Außerdem veröffentliche ich
                <a
                  href="https://www.fab.com/sellers/May-Studios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:underline"
                >
                  {" Plugins und Entwicklungstools"}
                </a>
                {" "}für andere Entwickler.
              </p>

              <p className="leading-relaxed">
                Derzeit studiere ich <strong className="text-gray-300">Computer Science an der
                Heinrich-Heine-Universität Düsseldorf</strong>. Das Studium ist stark
                theorieorientiert und vertieft mein Verständnis in Bereichen wie Algorithmen,
                Core Systems und theoretischer Informatik. Gleichzeitig arbeite ich in realen
                Projekten – so kann ich Theorie und Praxis direkt miteinander verbinden und
                gezielt weiterentwickeln.
              </p>
            </blockquote>

            <a
              href="#contact"
              className="bg-gradient-to-r text-white font-medium py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 inline-block shadow-md nav-link"
            >
              Nehmen Sie Kontakt auf
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
