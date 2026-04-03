import { useState } from "react";
import ProjectShell from "../../components/ProjectShell";

const base = import.meta.env.BASE_URL;

const recoilImages = [
  { src: `${base}assets/projects/fab/recoil/01.jpg`, alt: "May Simple Recoil – Vorschaubild" },
  { src: `${base}assets/projects/fab/recoil/02.jpg`, alt: "May Simple Recoil – Feature-Overview" },
  { src: `${base}assets/projects/fab/recoil/03.jpg`, alt: "May Simple Recoil – Realtime Editor Preview" },
  { src: `${base}assets/projects/fab/recoil/04.jpg`, alt: "May Simple Recoil – Demo Map Settings" },
  { src: `${base}assets/projects/fab/recoil/05.jpg`, alt: "May Simple Recoil – Blueprint & C++ Core" },
];

const popupImages = [
  { src: `${base}assets/projects/fab/popup/00.jpg`, alt: "May Popup System – Vorschaubild" },
  { src: `${base}assets/projects/fab/popup/01.jpg`, alt: "May Popup System – HUD Workflow" },
  { src: `${base}assets/projects/fab/popup/02.jpg`, alt: "May Popup System – Widget Blueprint" },
  { src: `${base}assets/projects/fab/popup/03.jpg`, alt: "May Popup System – Example Project Demo" },
];

type CarouselImage = { src: string; alt: string };

function ImageCarousel({ images }: { images: CarouselImage[] }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative border border-border overflow-hidden select-none">
      <img
        src={images[index].src}
        alt={images[index].alt}
        className="w-full aspect-video object-cover"
      />

      {/* Prev / Next */}
      <button
        onClick={prev}
        aria-label="Vorheriges Bild"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-canvas/70 hover:bg-canvas/90 text-fg w-9 h-9 flex items-center justify-center text-lg transition-colors duration-200 cursor-pointer"
      >
        &#10094;
      </button>
      <button
        onClick={next}
        aria-label="Nächstes Bild"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-canvas/70 hover:bg-canvas/90 text-fg w-9 h-9 flex items-center justify-center text-lg transition-colors duration-200 cursor-pointer"
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Bild ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer ${
              i === index ? "bg-fg" : "bg-fg/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectFabStore() {
  return (
    <ProjectShell
      hasSiteHeader
      title="Fab Store"
      subtitle="Plugins und Assets für die Unreal Engine — veröffentlicht auf Epics offiziellem Marketplace."
      heroImage={`${base}assets/projects/fab/fab-hero.webp`}
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

          <div className="lg:w-1/2">
            <ImageCarousel images={recoilImages} />
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

          <div className="lg:w-1/2">
            <ImageCarousel images={popupImages} />
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
