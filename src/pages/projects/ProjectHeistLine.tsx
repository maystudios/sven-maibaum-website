import { useEffect, useMemo, useRef, useState } from "react";

const galleryBase = "/assets/projects/heistline/gallery/";
const galleryImages = [
  { file: "01.png", alt: "Helikopter bei Nachtflug", cap: "Black Hawk über Küste in der Nacht", ratio: "16/9" },
  { file: "02.png", alt: "Bankgebäude im Nebel", cap: "Außenansicht der Bank bei Nacht & Nebel", ratio: "16/9" },
  { file: "03.png", alt: "Geiselnahme im Büro", cap: "Criminal überrascht Angestellte im Büro", ratio: "16/9" },
  { file: "04.png", alt: "Tresorraum mit bewaffnetem Räuber", cap: "Räuber betritt goldbeleuchteten Tresorraum", ratio: "16/9" },
  { file: "05.png", alt: "Heist-Team vor dem Gebäude", cap: "Team beobachtet Einsatzkräfte vor der Bank", ratio: "16/9" },
  { file: "06.png", alt: "Räuber stapelt Goldbarren", cap: "Criminal lädt Gold und Bargeld im Tresorraum", ratio: "16/9" },
  { file: "07.png", alt: "Innenansicht Gefängnisblock B", cap: "Überwachungsgalerie im Prison Block B", ratio: "16/9" },
  { file: "08.png", alt: "Helikopter auf Landeplattform", cap: "Escape-Helikopter auf dem Gefängnis-Helipad", ratio: "16/9" },
  { file: "09.png", alt: "Soldat mit Sturmgewehr", cap: "Taktische Einheit im Tunnel mit schallgedämpftem Gewehr", ratio: "16/9" },
  { file: "10.png", alt: "Wohnbereich im Prison Block B", cap: "Gemeinschaftsraum mit Küche und Sofas im Prison Block B", ratio: "16/9" },
  { file: "11.png", alt: "Gefängnis bei Nacht", cap: "Luftaufnahme des Hochsicherheitsgefängnisses bei Nacht", ratio: "16/9" },
  { file: "12.png", alt: "Gefängniskantine", cap: "Essensbereich der Gefangenen mit Tischen und Gittern", ratio: "16/9" },
  { file: "13.png", alt: "Stadtgebäude im Nebel", cap: "Gerichtsgebäude in nebliger Großstadt bei Nacht", ratio: "16/9" },
  { file: "14.png", alt: "Gefängniswäscherei", cap: "Innenansicht der Gefängniswäscherei mit Maschinen", ratio: "16/9" },
  { file: "15.png", alt: "Gefängniskrankenstation", cap: "Medizinische Station im Gefängnis mit Krankenbetten", ratio: "16/9" },
  { file: "16.png", alt: "Straße vor dem Gerichtsgebäude", cap: "Leere Straße mit Laternen vor dem Gerichtsgebäude", ratio: "16/9" },
  { file: "17.png", alt: "Tunnel mit rotem Licht", cap: "Geheimer Fluchttunnel mit roter Beleuchtung", ratio: "16/9" },
  { file: "18.png", alt: "Gefängnishof mit Wachturm", cap: "Beleuchteter Gefängnishof mit Suchscheinwerfern", ratio: "16/9" },
  { file: "19.png", alt: "Wache am Eingangstor", cap: "Wachposten mit Polizeiwagen am Gefängniseingang", ratio: "16/9" },
  { file: "20.png", alt: "Zellengang Block B", cap: "Sicht durch Gitter auf den Zellengang im Prison Block B", ratio: "16/9" },
  { file: "21.png", alt: "Wachraum Tiefgarage", cap: "Kontrollraum in Tiefgarage mit Monitoren und Schränken", ratio: "16/9" },
  { file: "22.png", alt: "Konferenzraum Bank", cap: "Grüner Konferenzraum mit Projektor und Laptops", ratio: "16/9" },
  { file: "23.png", alt: "Hacker-Zentrale", cap: "Server- und Computerraum mit mehreren Monitoren", ratio: "16/9" },
  { file: "24.png", alt: "Überwachungsbüro", cap: "Raum mit Monitorwänden und Büroeinrichtung", ratio: "16/9" },
  { file: "25.png", alt: "Großraumbüro Bank", cap: "Offenes Büro mit Schreibtischen und Computern", ratio: "16/9" },
  { file: "26.png", alt: "Tresorraum Schließfächer", cap: "Raum mit Gitter und Bankschließfächern", ratio: "16/9" },
  { file: "27.png", alt: "Waschraum Bank", cap: "Sanitärbereich mit Waschbecken und Spiegeln", ratio: "16/9" },
  { file: "28.png", alt: "Unterirdischer Gang", cap: "Betonflur mit Rohren und schweren Türen", ratio: "16/9" },
];

export default function ProjectHeistLine() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = useMemo(
    () => (activeIndex !== null ? galleryImages[activeIndex] : null),
    [activeIndex]
  );
  const gridRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const items = grid.querySelectorAll(".media-item");
    if (typeof IntersectionObserver === "undefined") {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((idx) => (idx === null ? 0 : (idx + 1) % galleryImages.length));
      if (event.key === "ArrowLeft")
        setActiveIndex((idx) => (idx === null ? 0 : (idx - 1 + galleryImages.length) % galleryImages.length));
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
  };

  const closeLightbox = () => {
    setActiveIndex(null);
  };

  const nextImage = (step = 1) => {
    setActiveIndex((idx) => (idx === null ? 0 : (idx + step + galleryImages.length) % galleryImages.length));
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStart.current = event.changedTouches[0].screenX;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEnd.current = event.changedTouches[0].screenX;
    if (touchEnd.current < touchStart.current - 50) nextImage(1);
    if (touchEnd.current > touchStart.current + 50) nextImage(-1);
  };

  return (
    <div>
      <section
        className="min-h-[70vh] pt-28 pb-16 bg-cover bg-center flex items-center hero-section"
        style={{
          backgroundImage:
            "linear-gradient(var(--hero-overlay-start), var(--hero-overlay-end)), url('https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3613860/capsule_616x353.jpg')",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              <span className="gradient-text">HeistLine</span>
              <span
                className="text-lg md:text-2xl align-middle opacity-80"
                style={{ color: "var(--text-hero-color)" }}
              >
                {" "}(vormals <em>The Prisonbreak</em>)
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-6" style={{ color: "var(--text-hero-color)" }}>
              Wähle deine Seite – <strong>Cop</strong> oder <strong>Criminal</strong>. Entkomme, plane
              <strong> Heists</strong>, baue <strong>Basen</strong>, verdiene <strong>Bounties</strong> und dominiere
              mit deinem Team in einem dynamischen Open-World-MMO-Setting.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://store.steampowered.com/app/3613860/The_Prisonbreak/"
                target="_blank"
                rel="noopener"
                className="bg-gradient-to-r text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 glow-effect"
              >
                Auf Steam wünschen <i className="fa-brands fa-steam ml-2"></i>
              </a>
              <a
                href="https://www.heist-line.com/"
                target="_blank"
                rel="noopener"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105"
              >
                Offizielle Seite
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
                <span className="gradient-text">Das Spiel in 30 Sekunden</span>
              </h2>
              <p className="leading-relaxed">
                HeistLine verbindet <strong>Prison-Escape</strong>, <strong>taktische Überfälle</strong> und
                <strong> MMO-Spielgefühl</strong>. Entscheide dich für <em>Law & Order</em> oder die <em>Unterwelt</em>,
                schmiede Pläne, koordiniere mit deinem Squad und setze Strategien in einer lebendigen Open World um.
              </p>
              <ul className="mt-4 space-y-2 list-disc list-inside">
                <li><strong>Online Multiplayer</strong> (Co-op & PvP)</li>
                <li><strong>Heists & Raids</strong> mit Planungsphase</li>
                <li><strong>Base Building</strong> & Loadout-Progression</li>
                <li><strong>Bounty/Rep-System</strong> für Risiko/Belohnung</li>
              </ul>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img
                src="/assets/projects/heistline/VaultHeist.png"
                alt="Vault Heist – Beispiel-Screenshot"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="gradient-text">Key Features</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Wähle deine Seite",
                text: "Als Cop jagst du Ausbrecher, sicherst Evidence und verhinderst Überfälle. Als Criminal fliehst du, planst Heists und baust ein Netzwerk auf.",
              },
              {
                title: "Heists mit Tiefe",
                text: "Recon, Tools, Entry-Points, Rollenverteilung – Planung zählt. Improvisation rettet Missionen, wenn Pläne scheitern.",
              },
              {
                title: "Persistente Progression",
                text: "Basen/Unterschlüpfe, Loadouts, Fahrzeuge und Reputation formen deine Langzeit-Ziele.",
              },
              {
                title: "Bounty & Reputation",
                text: "Hohe Kopfgelder locken Jäger – Ruhm birgt Risiko. Balance zwischen Profit und Exposure.",
              },
              {
                title: "Co-op & PvP",
                text: "Koordiniere dich mit deinem Team, doch rechne mit Gegenwehr durch Spieler & AI-Security.",
              },
              {
                title: "Sprachen",
                text: "Deutsch & Englisch (Interface/Audio/Untertitel). Quelle: Steam Store.",
              },
            ].map((feature) => (
              <div key={feature.title} className="glassmorphism p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">
                <span className="gradient-text">Gameplay-Loop (Criminal)</span>
              </h2>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Flucht/Einbruch vorbereiten: Info-Gathering, Tools, Rollen.</li>
                <li>Infiltration & Execution: Stealth, Social, Force – flexibel reagieren.</li>
                <li>Escape & Fencing: Fluchtwege, Hehlernetz, Geldfluss.</li>
                <li>Base-Ausbau & Loadouts optimieren; neue Ziele wählen.</li>
              </ol>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">
                <span className="gradient-text">Gameplay-Loop (Cop)</span>
              </h2>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Patrol & Intel: Hotspots, Beobachtung, Durchsuchungen.</li>
                <li>Intervention: Sperren, Zugriff, Festnahme, Evidence sichern.</li>
                <li>Transport/Processing: Rückführung, Bounty-Claim.</li>
                <li>Aufrüstung, Team-Taktiken, nächste Operation planen.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            <span className="gradient-text">Galerie</span>
          </h2>
          <p className="text-center opacity-80 mb-6">
            Alle Bilder sind klickbar (Lightbox). Mit Pfeiltasten navigieren, ESC schließt.
          </p>
          <div id="gallery" className="media-grid" ref={gridRef}>
            {galleryImages.map((image, index) => (
              <figure
                key={image.file}
                className="media-item"
                tabIndex={0}
                style={{ aspectRatio: image.ratio }}
                onClick={() => openLightbox(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openLightbox(index);
                  }
                }}
              >
                <div style={{ position: "relative" }}>
                  <img className="media-thumb" src={`${galleryBase}${image.file}`} alt={image.alt} loading="lazy" />
                </div>
                <figcaption>{image.cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glassmorphism p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span className="gradient-text">Fakten & Status</span>
              </h2>
              <ul className="space-y-2">
                <li><strong>Plattform:</strong> PC (Windows), Steam (TBA)</li>
                <li><strong>Modi:</strong> Online Co-op, Online PvP, MMO</li>
                <li><strong>Sprachen:</strong> Deutsch & Englisch (UI/Audio/Subs)</li>
                <li><strong>Entwickler/Publisher:</strong> Emotions-Gaming</li>
                <li><strong>Status:</strong> <em>Planned Release: To be announced</em></li>
              </ul>
              <p className="text-sm opacity-70 mt-3">Quellen: Steam-Store-Seite, Emotions-Gaming.</p>
            </div>
            <div className="glassmorphism p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span className="gradient-text">Call to Action</span>
              </h2>
              <p className="mb-4">Unterstütze das Projekt und erhalte News zum Release:</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://store.steampowered.com/app/3613860/The_Prisonbreak/"
                  target="_blank"
                  rel="noopener"
                  className="bg-gradient-to-r text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 glow-effect"
                >
                  Auf Steam wünschen
                </a>
                <a
                  href="https://discord.gg/"
                  target="_blank"
                  rel="noopener"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
                >
                  Discord beitreten
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">
            <span className="gradient-text">Steam</span>
          </h2>
          <p className="opacity-80 mb-4">Direkt aus dem Steam-Store eingebettet.</p>
          <iframe
            src="https://store.steampowered.com/widget/3613860/"
            title="HeistLine Steam Widget"
            className="w-full max-w-[646px]"
            style={{ height: "190px" }}
          ></iframe>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glassmorphism p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span className="gradient-text">FAQ</span>
              </h2>
              <details className="mb-3">
                <summary className="font-semibold cursor-pointer">Wann erscheint HeistLine?</summary>
                <p className="mt-2 opacity-90">Release: <em>To be announced</em> (laut Steam).</p>
              </details>
              <details className="mb-3">
                <summary className="font-semibold cursor-pointer">Unterstützte Sprachen?</summary>
                <p className="mt-2 opacity-90">Deutsch & Englisch (Interface, Audio, Untertitel).</p>
              </details>
              <details>
                <summary className="font-semibold cursor-pointer">Gibt es Singleplayer?</summary>
                <p className="mt-2 opacity-90">
                  Der Fokus liegt auf Online Co-op & PvP in einer persistenten Welt.
                </p>
              </details>
            </div>
            <div className="glassmorphism p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span className="gradient-text">Presse & Kontakt</span>
              </h2>
              <p className="mb-3">Presseanfragen, Interviews, Keyart-Anfragen:</p>
              <ul className="space-y-2">
                <li>
                  <strong>Studio:</strong>{" "}
                  <a
                    className="text-teal-400 hover:text-teal-300"
                    href="https://www.emotions-gaming.de/"
                    target="_blank"
                    rel="noopener"
                  >
                    Emotions-Gaming
                  </a>
                </li>
                <li>
                  <strong>Business:</strong>{" "}
                  <a className="text-teal-400 hover:text-teal-300" href="mailto:company@maystudios.net">
                    company@maystudios.net
                  </a>
                </li>
                <li>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    className="text-teal-400 hover:text-teal-300"
                    href="https://www.linkedin.com/in/sven-maibaum/"
                    target="_blank"
                    rel="noopener"
                  >
                    Sven Maibaum
                  </a>
                </li>
              </ul>
              <p className="text-sm opacity-70 mt-4">
                Bildrechte: Bitte nur freigegebene/selbst erstellte Assets nutzen. Die hier verlinkten
                Steam-Thumbnails sind Platzhalter zum Testen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div
        id="lightbox"
        className={`lightbox ${activeIndex === null ? "hidden" : ""}`}
        aria-hidden={activeIndex === null ? "true" : "false"}
        role="dialog"
        aria-label="Bildanzeige (Lightbox)"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLightbox();
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button className="lightbox__close" onClick={closeLightbox} aria-label="Schließen (Esc)">
          &times;
        </button>
        <button className="lightbox__nav lightbox__prev" onClick={() => nextImage(-1)} aria-label="Vorheriges Bild">
          &#10094;
        </button>
        <figure className="lightbox__figure">
          {activeImage ? (
            <>
              <img src={`${galleryBase}${activeImage.file}`} alt={activeImage.alt} />
              <figcaption>{activeImage.cap}</figcaption>
            </>
          ) : null}
        </figure>
        <button className="lightbox__nav lightbox__next" onClick={() => nextImage(1)} aria-label="Nächstes Bild">
          &#10095;
        </button>
      </div>
    </div>
  );
}
