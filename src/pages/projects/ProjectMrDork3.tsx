export default function ProjectMrDork3() {
  return (
    <div>
      <section
        className="min-h-[70vh] pt-28 pb-16 bg-cover bg-center flex items-center hero-section"
        style={{
          backgroundImage:
            "linear-gradient(var(--hero-overlay-start), var(--hero-overlay-end)), url('https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3274870/capsule_616x353.jpg')",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              <span className="gradient-text">Mr. Dork 3</span>
              <span
                className="block text-2xl md:text-3xl mt-2 opacity-90"
                style={{ color: "var(--text-hero-color)" }}
              >
                One Last Doodle
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-6" style={{ color: "var(--text-hero-color)" }}>
              Der liebenswerte Mr. Dork ist zurück! Ein <strong>Action-Platformer</strong>, der klassische
              Mechaniken mit modernen Twists, prozeduralen <strong>Infinity-Modi</strong> und spannenden
              <strong> Multiplayer-Battles</strong> vereint.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://store.steampowered.com/app/3274870/Mr_Dork_3_One_Last_Doodle/"
                target="_blank"
                rel="noopener"
                className="bg-gradient-to-r text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 glow-effect"
                style={{ backgroundColor: "#1b2838" }}
              >
                Auf Steam ansehen <i className="fa-brands fa-steam ml-2"></i>
              </a>
              <a
                href="https://mrdork3.com/"
                target="_blank"
                rel="noopener"
                className="bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105"
              >
                Offizielle Website
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="glassmorphism p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span className="gradient-text">Das Spielprinzip</span>
              </h2>
              <p className="leading-relaxed mb-4">
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
            <div className="rounded-xl overflow-hidden shadow-xl flex items-center justify-center bg-black">
              <iframe
                src="https://store.steampowered.com/widget/3274870/"
                title="Mr. Dork 3 Steam Widget"
                className="w-full max-w-[646px] h-[190px]"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="gradient-text">Spielmodi & Features</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glassmorphism p-6 rounded-xl shadow-lg border-t-4 border-teal-400">
              <h3 className="text-xl font-semibold mb-2">Story Mode</h3>
              <p>
                Reise durch diverse, handgebaute Welten. Jedes Level führt neue Mechaniken ein und erhöht die
                Schwierigkeitskurve progressiv.
              </p>
            </div>

            <div className="glassmorphism p-6 rounded-xl shadow-lg border-t-4 border-orange-400">
              <h3 className="text-xl font-semibold mb-2">Infinity Mode</h3>
              <p>
                Kein Run ist wie der andere. Stelle dich endlosen, prozedural generierten Leveln in Modi wie
                <em> The Floor is Lava</em> oder <em>Endless Right</em>.
              </p>
            </div>

            <div className="glassmorphism p-6 rounded-xl shadow-lg border-t-4 border-purple-400">
              <h3 className="text-xl font-semibold mb-2">Multiplayer</h3>
              <p>
                Ob Couch-Co-Op oder kompetitiver Battle Mode: Spiele mit oder gegen Freunde (Splitscreen & Online via
                Steam Party geplant).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            <span className="gradient-text">Technologie & Entwicklung</span>
          </h2>
          <div className="max-w-3xl mx-auto glassmorphism p-8 rounded-xl">
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
        </div>
      </section>

      <section className="section-padding text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">Bereit für das Abenteuer?</h2>
          <a
            href="https://store.steampowered.com/app/3274870/Mr_Dork_3_One_Last_Doodle/"
            target="_blank"
            rel="noopener"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
          >
            Jetzt auf Steam wishlisten
          </a>
        </div>
      </section>
    </div>
  );
}
