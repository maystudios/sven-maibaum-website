import ProjectShell from "../../components/ProjectShell";

export default function ProjectFabStore() {
  return (
    <ProjectShell
      hasSiteHeader
      title="Fab Store"
      subtitle="Plugins und Assets für die Unreal Engine — veröffentlicht auf Epics offiziellem Marketplace."
      heroImage={`${import.meta.env.BASE_URL}assets/projects/fab/fab-hero.webp`}
      heroAlt="Fab – Epics offizieller Marketplace für Unreal Engine Assets"
      ctaLabel="Alle Assets auf Fab.com"
      ctaLink="https://www.fab.com/sellers/May-Studios"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface2 mb-8">
        {[
          { label: "Plattform", value: "Fab.com (Epic)" },
          { label: "Engine", value: "Unreal Engine 5" },
          { label: "Produkte", value: "2 Assets" },
          { label: "Bewertung", value: "5.0 / 5.0" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="text-xs uppercase tracking-widest text-faint mb-1">{stat.label}</p>
            <p className="font-display font-semibold text-fg text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2>Über den Store</h2>
      <p>
        Auf <strong>Fab.com</strong> veröffentliche ich Plugins und Asset-Pakete für die{" "}
        <strong>Unreal Engine</strong> — von Gameplay-Systemen wie Weapon Recoil bis zu
        UI-Frameworks für Popups und Notifications. Alle Assets kommen mit Dokumentation,
        Playable Demos und Discord-Support.
      </p>

      {/* May Simple Recoil */}
      <div className="bg-surface border border-border p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="flex items-center flex-wrap gap-3 mb-4">
              <h3 className="font-display font-bold text-fg text-xl m-0">May Simple Recoil</h3>
              <span className="tech-tag tech-tag-orange">Code Plugin</span>
            </div>

            <p className="mb-4">
              Ein umfassendes <strong>Weapon-Recoil-System</strong> für Unreal Engine 5.5. Realistische
              Rückstoß-Dynamik, die sich automatisch an Spieler-States anpasst — Sprint, Crouch, Jump, ADS.
              Mit Real-Time Editor Preview, SIMD-Optimierung und vollständiger Network Replication.
            </p>
            <p className="mb-6">
              Verfügbar als <strong>C++ & Blueprint Plugin</strong> mit zwei Modulen (Runtime + Editor).
              Inkl. Demo-Waffen, Spread-Component und Live-Tuning-Widget.
            </p>

            <div className="mb-6">
              <span className="tech-tag tech-tag-purple">UE 5.5</span>
              <span className="tech-tag tech-tag-blue">C++</span>
              <span className="tech-tag tech-tag-teal">Blueprints</span>
              <span className="tech-tag tech-tag-green">Replicated</span>
              <span className="tech-tag tech-tag-yellow">SIMD</span>
            </div>

            <a
              href="https://www.fab.com/listings/98344337-dca3-4a3d-8197-71316393d13a"
              target="_blank"
              rel="noopener"
              className="swiss-btn-primary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              Auf Fab.com ansehen
            </a>
          </div>

          <div className="lg:w-1/2 flex flex-col gap-4">
            <figure className="border border-border overflow-hidden relative group h-64 lg:h-auto">
              <img
                src="https://media.fab.com/image_previews/gallery_images/ebfbabfc-ffef-4682-8d4a-3c20735a45de/4dd9f875-e3b4-4075-8253-49d2440073c4.jpg"
                alt="May Simple Recoil – Editor Preview und Recoil-Kurven"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-canvas/80 text-fg text-xs py-2 px-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Real-Time Editor Preview mit Recoil-Kurven
              </figcaption>
            </figure>

            <figure className="border border-border overflow-hidden h-48 relative group">
              <img
                src="https://media.fab.com/image_previews/gallery_images/ebfbabfc-ffef-4682-8d4a-3c20735a45de/74c16797-0625-4eb6-8d6e-ccaad633564b.jpg"
                alt="May Simple Recoil – Blueprint Integration"
                className="w-full h-full object-cover object-center"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-canvas/80 text-fg text-xs py-2 px-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Blueprint-Integration und Konfiguration
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* May Pop-up & Notification System */}
      <div className="bg-surface border border-border p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="flex items-center flex-wrap gap-3 mb-4">
              <h3 className="font-display font-bold text-fg text-xl m-0">May Pop-up & Notification System</h3>
              <span className="tech-tag tech-tag-blue">Asset Package</span>
            </div>

            <p className="mb-4">
              Eine <strong>All-in-One-Lösung</strong> für dynamische Popups und Notifications in Unreal Engine.
              Vorkonfigurierte Themes (Dark & Light), interaktive Buttons, Progress-Bars und
              Sound-Effekte — alles komplett in Blueprints, kein C++ nötig.
            </p>
            <p className="mb-6">
              Unterstützt <strong>UE 5.0 bis 5.7</strong> und kommt mit Auto-Detection für fehlende
              Panels, konfigurierbaren Notification-Types (Default, System, Friend) und einem
              Settings-Menü für schnelle Anpassung.
            </p>

            <div className="mb-6">
              <span className="tech-tag tech-tag-purple">UE 5.0 – 5.7</span>
              <span className="tech-tag tech-tag-teal">Blueprints</span>
              <span className="tech-tag tech-tag-gray">UMG Widgets</span>
              <span className="tech-tag tech-tag-pink">Themes</span>
            </div>

            <a
              href="https://www.fab.com/listings/13cad897-c843-4c5a-aba6-94c4cf703c56"
              target="_blank"
              rel="noopener"
              className="swiss-btn-primary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              Auf Fab.com ansehen
            </a>
          </div>

          <div className="lg:w-1/2 flex flex-col gap-4">
            <figure className="border border-border overflow-hidden relative group h-64 lg:h-auto">
              <img
                src="https://media.fab.com/image_previews/gallery_images/4b723f56-62be-4ddd-8d95-afb5b098697d/da3e4b5b-c732-42dd-afbd-453a900386dc.jpg"
                alt="May Popup System – Popup und Notification Beispiele"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-canvas/80 text-fg text-xs py-2 px-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Popup- und Notification-Beispiele im Dark Theme
              </figcaption>
            </figure>

            <figure className="border border-border overflow-hidden h-48 relative group">
              <img
                src="https://media.fab.com/image_previews/gallery_images/4b723f56-62be-4ddd-8d95-afb5b098697d/8c6c9c4e-08ba-41d1-af87-771e81f85de3.jpg"
                alt="May Popup System – Theme-Konfiguration"
                className="w-full h-full object-cover object-center"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-canvas/80 text-fg text-xs py-2 px-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Theme-Konfiguration und Settings-Menü
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <h3>Weitere Assets folgen...</h3>
      <p>
        Der Store wird kontinuierlich erweitert. Neue Plugins und Asset-Pakete sind in Planung.
      </p>
    </ProjectShell>
  );
}
