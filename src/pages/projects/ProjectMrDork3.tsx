import ProjectShell from "../../components/ProjectShell";

export default function ProjectMrDork3() {
  return (
    <ProjectShell
      hasSiteHeader
      title="Mr. Dork 3"
      subtitle="One Last Doodle — Der liebenswerte Mr. Dork ist zurück! Ein Action-Platformer, der klassische Mechaniken mit modernen Twists, prozeduralen Infinity-Modi und spannenden Multiplayer-Battles vereint."
      heroImage={`${import.meta.env.BASE_URL}assets/projects/mrdork/mrdork3.png`}
      heroAlt="Mr. Dork 3 – One Last Doodle"
      ctaLabel="Jetzt auf Steam wishlisten"
      ctaLink="https://store.steampowered.com/app/3274870/Mr_Dork_3_One_Last_Doodle/"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface2 mb-8">
        {[
          { label: "Engine", value: "Unity 2D" },
          { label: "Genre", value: "Platformer" },
          { label: "Plattform", value: "PC / Steam" },
          { label: "Status", value: "In Entwicklung" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="text-xs uppercase tracking-widest text-faint mb-1">{stat.label}</p>
            <p className="font-display font-semibold text-fg text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Das Spielprinzip + Steam Widget */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-surface border border-border p-6">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Das Spielprinzip</h3>
          <p className="mb-4">
            Mr. Dork 3 führt die beliebte Reihe in eine neue Ära. Die Level sind voller tückischer Fallen, Rätsel
            und versteckter Geheimnisse. Es erfordert Präzision, Timing und Köpfchen, um Mr. Dork sicher ans Ziel
            zu bringen.
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Klassisches Platforming:</strong> Knifflige Sprungpassagen und Physik-Rätsel.</li>
            <li>
              <strong>Infinity Modes:</strong> Prozedural generierte Herausforderungen wie "The Floor is Lava".
            </li>
            <li>
              <strong>Battle Mode:</strong> Tritt gegen Freunde an – wer meistert den Parcours schneller?
            </li>
            <li>
              <strong>Retro-Modern Style:</strong> Handgezeichneter Doodle-Look mit modernen Effekten.
            </li>
          </ul>
        </div>
        <div className="border border-border overflow-hidden flex items-center justify-center bg-surface">
          <iframe
            src="https://store.steampowered.com/widget/3274870/"
            title="Mr. Dork 3 Steam Widget"
            className="w-full max-w-[646px] h-[190px]"
          ></iframe>
        </div>
      </div>

      {/* Spielmodi & Features */}
      <h2>Spielmodi & Features</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface border border-border border-t-2 border-t-teal-400 p-6">
          <h3 className="font-display font-bold text-fg text-base mb-2">Story Mode</h3>
          <p>
            Reise durch diverse, handgebaute Welten. Jedes Level führt neue Mechaniken ein und erhöht die
            Schwierigkeitskurve progressiv.
          </p>
        </div>
        <div className="bg-surface border border-border border-t-2 border-t-orange-400 p-6">
          <h3 className="font-display font-bold text-fg text-base mb-2">Infinity Mode</h3>
          <p>
            Kein Run ist wie der andere. Stelle dich endlosen, prozedural generierten Leveln in Modi wie
            <em> The Floor is Lava</em> oder <em>Endless Right</em>.
          </p>
        </div>
        <div className="bg-surface border border-border border-t-2 border-t-purple-400 p-6">
          <h3 className="font-display font-bold text-fg text-base mb-2">Multiplayer</h3>
          <p>
            Ob Couch-Co-Op oder kompetitiver Battle Mode: Spiele mit oder gegen Freunde (Splitscreen & Online via
            Steam Party geplant).
          </p>
        </div>
      </div>

      {/* Technologie & Entwicklung */}
      <h2>Technologie & Entwicklung</h2>
      <div className="bg-surface border border-border p-8">
        <p className="mb-4">
          Mr. Dork 3 wird mit der <strong>Unity Engine</strong> entwickelt, um eine präzise 2D-Steuerung und
          plattformübergreifende Kompatibilität zu gewährleisten. Ein besonderer Fokus liegt auf dem prozeduralen
          Generierungssystem für die Infinity-Modi und der nahtlosen Steam-Integration.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <span className="tech-tag tech-tag-purple">Unity 2D</span>
          <span className="tech-tag tech-tag-blue">C#</span>
          <span className="tech-tag tech-tag-gray">Steamworks API</span>
          <span className="tech-tag tech-tag-orange">Procedural Generation</span>
          <span className="tech-tag tech-tag-teal">Input System</span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h3 className="font-display font-bold text-fg text-xl mb-4">Bereit für das Abenteuer?</h3>
        <a
          href="https://store.steampowered.com/app/3274870/Mr_Dork_3_One_Last_Doodle/"
          target="_blank"
          rel="noopener"
          className="swiss-btn-primary inline-flex items-center px-8 py-3 text-sm min-h-[44px]"
        >
          Jetzt auf Steam wishlisten
        </a>
      </div>
    </ProjectShell>
  );
}
