import ProjectShell from "../../components/ProjectShell";

export default function ProjectItchio() {
  return (
    <ProjectShell
      hasSiteHeader
      title="Game Jams & itch.io"
      subtitle="Experimentelle Projekte, Rapid Prototyping und kreative Challenges."
      heroImage={`${import.meta.env.BASE_URL}assets/projects/itchio/itchio.png`}
      heroAlt="Game Jam Collage"
      ctaLabel="Mein itch.io Profil besuchen"
      ctaLink="https://maystudios.itch.io/"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-surface2 mb-8">
        {[
          { label: "Plattform", value: "itch.io" },
          { label: "Top-Projekt", value: "Terrafix" },
          { label: "Bestes Ergebnis", value: "1. Platz HHU" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="text-xs uppercase tracking-widest text-faint mb-1">{stat.label}</p>
            <p className="font-display font-semibold text-fg text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2>Die Experimentierwiese</h2>
      <p>
        <strong>itch.io</strong> ist meine Plattform für schnelles, kreatives Arbeiten. Hier veröffentliche ich
        Ergebnisse aus Game Jams (wie dem Uni Game Jam), teste neue Gameplay-Mechaniken oder stelle kleine Tools
        bereit. Diese Projekte entstehen oft unter strengen Zeitlimits und fokussieren sich auf innovative Kernideen
        statt auf polierten Hochglanz.
      </p>

      {/* Terrafix */}
      <div className="bg-surface border border-border p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="flex items-center flex-wrap gap-3 mb-4">
              <h3 className="font-display font-bold text-fg text-xl m-0">Terrafix</h3>
              <span className="tech-tag tech-tag-yellow flex items-center">
                1. Platz HHU Game Jam
              </span>
            </div>

            <p className="mb-4">
              Ein Projekt, das im Rahmen eines <strong>Uni Game Jams</strong> an der HHU Düsseldorf vom Team
              „Vegan & Natural" zum Thema "Weltenretter" entwickelt wurde.
            </p>
            <p className="mb-4">
              <strong>Das Konzept:</strong> Terrafix ist ein Third-Person-Aufbauspiel. Der Spieler landet in einer
              zerstörten, kargen Welt und muss diese durch geschicktes Ressourcenmanagement und den Einsatz von
              Terraforming-Technologien wiederbeleben. Ziel war es, innerhalb kürzester Zeit eine atmosphärische Welt
              zu schaffen, die auf die Aktionen des Spielers visuell reagiert.
            </p>
            <p className="mb-6 font-medium text-brandLight">
              Unser Team konnte die Jury überzeugen und wir haben den 1. Platz des Game Jams belegt!
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
              rel="noreferrer"
              className="swiss-btn-primary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              Terrafix auf itch.io spielen
            </a>
          </div>

          <div className="lg:w-1/2 flex flex-col gap-4">
            <figure className="border border-border overflow-hidden relative group h-64 lg:h-auto">
              <img
                src={`${import.meta.env.BASE_URL}assets/projects/itchio/gamejam-winner.jpg`}
                alt="Team Vegan & Natural - 1. Platz Siegerehrung"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-canvas/80 text-fg text-xs py-2 px-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Siegerehrung: 1. Platz für unser Team
              </figcaption>
            </figure>

            <figure className="border border-border overflow-hidden h-48 relative group">
              <img
                src={`${import.meta.env.BASE_URL}assets/projects/itchio/gamejam-presentation.jpg`}
                alt="Game Jam Präsentation und Entwicklung"
                className="w-full h-full object-cover object-center"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-canvas/80 text-fg text-xs py-2 px-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Präsentation unseres Konzepts
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <h3>Weitere Projekte folgen...</h3>
      <p>
        Diese Seite wird stetig erweitert, sobald neue Jam-Games oder Prototypen veröffentlicht werden. Ich
        experimentiere regelmäßig mit neuen Engines und Tools.
      </p>
    </ProjectShell>
  );
}
