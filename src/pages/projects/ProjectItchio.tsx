export default function ProjectItchio() {
  return (
    <main className="project-detail-container section-padding fade-in-up visible pt-28">
      <div className="project-detail-header">
        <h1 className="gradient-text">Game Jams & itch.io</h1>
        <p className="project-subtitle">Experimentelle Projekte, Rapid Prototyping und kreative Challenges.</p>
      </div>

      <img
        src="https://placehold.co/900x500/fa5c5c/ffffff?text=Game+Jams+%26+Prototyping"
        alt="Game Jam Collage"
        className="project-image-full"
        loading="lazy"
      />

      <div className="project-detail-content">
        <h2 className="gradient-text">Die Experimentierwiese</h2>
        <p>
          <strong>itch.io</strong> ist meine Plattform für schnelles, kreatives Arbeiten. Hier veröffentliche ich
          Ergebnisse aus Game Jams (wie dem Uni Game Jam), teste neue Gameplay-Mechaniken oder stelle kleine Tools
          bereit. Diese Projekte entstehen oft unter strengen Zeitlimits und fokussieren sich auf innovative Kernideen
          statt auf polierten Hochglanz.
        </p>

        <div className="mt-8 grid gap-8">
          <div className="glassmorphism p-6 rounded-lg border border-gray-700/30 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <div className="flex items-center flex-wrap gap-3 mb-4">
                  <h3 className="text-xl font-bold text-orange-400 m-0">Terrafix</h3>
                  <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                    <i className="fas fa-trophy mr-2 text-yellow-400"></i> 1. Platz HHU Game Jam
                  </span>
                </div>

                <p className="mb-4">
                  Ein Projekt, das im Rahmen eines <strong>Uni Game Jams</strong> an der HHU Düsseldorf vom Team
                  „Vegan & Natural“ zum Thema "Weltenretter" entwickelt wurde.
                </p>
                <p className="mb-4">
                  <strong>Das Konzept:</strong> Terrafix ist ein Third-Person-Aufbauspiel. Der Spieler landet in einer
                  zerstörten, kargen Welt und muss diese durch geschicktes Ressourcenmanagement und den Einsatz von
                  Terraforming-Technologien wiederbeleben. Ziel war es, innerhalb kürzester Zeit eine atmosphärische Welt
                  zu schaffen, die auf die Aktionen des Spielers visuell reagiert.
                </p>
                <p className="mb-6 font-medium text-teal-400 flex items-center">
                  <i className="fas fa-star mr-2"></i> Unser Team konnte die Jury überzeugen und wir haben den 1. Platz
                  des Game Jams belegt!
                </p>

                <div className="mb-6">
                  <span className="tech-tag tech-tag-orange">Game Jam Winner</span>
                  <span className="tech-tag tech-tag-green">Aufbau / Strategy</span>
                  <span className="tech-tag tech-tag-gray">3D</span>
                  <span className="tech-tag tech-tag-blue">Team Project</span>
                </div>

                <a
                  href="https://maystudios.itch.io/terrafix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md w-full sm:w-auto"
                >
                  Terrafix auf itch.io spielen <i className="fas fa-gamepad ml-2"></i>
                </a>
              </div>

              <div className="lg:w-1/2 flex flex-col gap-4">
                <figure className="rounded-lg overflow-hidden border border-gray-700/50 shadow-md group relative h-64 lg:h-auto">
                  <img
                    src="/assets/projects/itchio/gamejam-winner.jpg"
                    alt="Team Vegan & Natural - 1. Platz Siegerehrung"
                    className="w-full h-full object-cover transform transition duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white text-xs py-2 px-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Siegerehrung: 1. Platz für unser Team
                  </figcaption>
                </figure>

                <figure className="rounded-lg overflow-hidden border border-gray-700/50 shadow-md h-48 relative group">
                  <img
                    src="/assets/projects/itchio/gamejam-presentation.jpg"
                    alt="Game Jam Präsentation und Entwicklung"
                    className="w-full h-full object-cover object-center transform transition duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white text-xs py-2 px-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Präsentation unseres Konzepts
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>

        <h3 className="mt-10">Weitere Projekte folgen...</h3>
        <p>
          Diese Seite wird stetig erweitert, sobald neue Jam-Games oder Prototypen veröffentlicht werden. Ich
          experimentiere regelmäßig mit neuen Engines und Tools.
        </p>

        <div className="mt-12 text-center">
          <a
            href="https://maystudios.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 inline-block shadow-md"
          >
            Mein itch.io Profil besuchen <i className="fab fa-itch-io ml-2"></i>
          </a>
        </div>
      </div>

      <a href="/#projects" className="back-to-portfolio">
        <i className="fas fa-arrow-left mr-2"></i>Alle Projekte anzeigen
      </a>
    </main>
  );
}
