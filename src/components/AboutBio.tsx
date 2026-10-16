type AboutBioProps = {
  className?: string;
};

/** Biography paragraphs of the about section, shared by the regular site and the motion variants. */
export default function AboutBio({ className = "space-y-5 text-muted text-lg leading-relaxed" }: AboutBioProps) {
  return (
    <div className={className}>
      <p>
        Ich bin Sven Maibaum, Software-Architekt und Spieleentwickler. Schon als Kind
        habe ich alles auseinandergenommen, was irgendwie Technik war – einfach, um zu
        verstehen, wie es funktioniert. Mit elf Jahren habe ich angefangen zu
        programmieren und meine ersten kleinen Spiele gebaut.
      </p>

      <p>
        Schon seit ich ein kleiner Junge war, wollte ich eigentlich Ingenieur werden.
        Maschinen, Mechanik und Logik haben mich von Anfang an fasziniert – das
        Zusammenspiel vieler kleiner Teile, die gemeinsam etwas Großes erschaffen. Mit
        der Zeit habe ich gemerkt, dass Software genau dieselben Prinzipien verfolgt –
        nur viel direkter greifbar, schneller umsetzbar und mit mehr Raum für
        Kreativität. Diese Verbindung aus Technik und Gestaltung hat mich bis heute
        nicht losgelassen.
      </p>

      <p>
        Beruflich bin ich aktuell in mehreren Bereichen aktiv, die sich ideal ergänzen:
      </p>

      <p>
        Bei <strong className="text-fg">LikeTik by </strong>
        <a
          href="https://www.liketik.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brandLight hover:text-brand transition-colors duration-200"
        >
          Axinity
        </a>
        {' '}arbeite ich als leitender Software-Architekt an einer
        E-Commerce-Plattform, die wir als{' '}
        <strong className="text-fg">offizieller Partner von TikTok</strong>{' '}
        entwickeln. Unser Ziel ist es, Social-Commerce technisch neu und skalierbar
        umzusetzen – mit stabilen Systemen, die Marken und Creator direkt miteinander
        verbinden.
      </p>

      <p>
        Bei{' '}
        <a
          href="https://www.emotions-gaming.de/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brandLight hover:text-brand transition-colors duration-200 font-semibold"
        >
          Emotions Gaming
        </a>{' '}
        leite ich die Entwicklung des Spiels{' '}
        <a
          href="/projekte/heistline"
          className="text-brandLight hover:text-brand transition-colors duration-200 font-semibold"
        >
          „HeistLine"
        </a>
        , einem storybasierten Action-Projekt, bei dem Gameplay und Technik eng
        zusammenarbeiten, um ein intensives Spielerlebnis zu schaffen.
      </p>

      <p>
        Mit{' '}
        <a
          href="http://maystudios.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brandLight hover:text-brand transition-colors duration-200 font-semibold"
        >
          MayStudios
        </a>{' '}
        konzentriere ich mich auf eigene Spiele- und Tool-Entwicklung –
        darunter Titel wie <em>Mr. Dork 3</em> sowie kleinere{' '}
        <a
          href="https://maystudios.itch.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brandLight hover:text-brand transition-colors duration-200"
        >
          itch.io-Projekte
        </a>
        . Außerdem veröffentliche ich{' '}
        <a
          href="https://www.fab.com/sellers/May-Studios"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brandLight hover:text-brand transition-colors duration-200"
        >
          Plugins und Entwicklungstools
        </a>{' '}
        für andere Entwickler.
      </p>

      <p>
        Derzeit studiere ich{' '}
        <strong className="text-fg">
          Computer Science an der Heinrich-Heine-Universität Düsseldorf
        </strong>
        . Das Studium ist stark theorieorientiert und vertieft mein Verständnis in
        Bereichen wie Algorithmen, Core Systems und theoretischer Informatik.
        Gleichzeitig arbeite ich in realen Projekten – so kann ich Theorie und Praxis
        direkt miteinander verbinden und gezielt weiterentwickeln.
      </p>
    </div>
  );
}
