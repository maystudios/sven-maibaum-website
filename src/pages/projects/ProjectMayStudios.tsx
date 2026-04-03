import ProjectShell from "../../components/ProjectShell";

const products = [
  {
    name: "May Simple Recoil",
    tagline: "Advanced Recoil Solution for Unreal Engine",
    version: "1.0.0",
    price: "ab 9,25 €",
    engine: "UE 5.5",
    type: "Code Plugin (C++ & Blueprint)",
    rating: "Neu",
    link: "https://www.fab.com/listings/98344337-dca3-4a3d-8197-71316393d13a",
    docs: "https://maystudios.gitbook.io/maysimplerecoil",
    demo: "https://drive.google.com/file/d/1-U5L-Ox1DAcLNovxWIXKZbmYGKP2KVGl/view?usp=sharing",
    video: "https://youtu.be/XvQN8jUSBKc",
    features: [
      {
        title: "Realistic Recoil Dynamics",
        text: "Natürliches Rückstoßverhalten, das sich dynamisch an Spieler-States anpasst — Sprint, Crouch, Jump, ADS.",
      },
      {
        title: "Real-Time Editor Preview",
        text: "Integriertes Editor-Tool zum sofortigen Visualisieren und Testen von Recoil-Settings ohne Play-Mode.",
      },
      {
        title: "Network Replicated",
        text: "Vollständig repliziertes System für Multiplayer-Spiele mit Demo-Waffen und Spread-Component.",
      },
      {
        title: "SIMD-Optimiert",
        text: "Moderne C++-Techniken und SIMD-Optimierungen in performance-kritischen Bereichen.",
      },
      {
        title: "Blueprint & C++",
        text: "Volle Blueprint-Zugänglichkeit mit robustem C++-Backend für schnelle Iteration und Prototyping.",
      },
      {
        title: "Customizable Easing",
        text: "Timeline-basierte Recoil- und Reset-Animationen mit konfigurierbaren Easing-Funktionen.",
      },
    ],
    modules: [
      { name: "MaySimpleRecoil", type: "Runtime" },
      { name: "MaySimpleRecoilEditor", type: "Editor" },
    ],
    accentBorder: "border-t-orange-400",
  },
  {
    name: "May Pop-up & Notification System",
    tagline: "Ultimate Popup and Notification Solution for Unreal Engine",
    version: "1.0.1",
    price: "ab 5,14 €",
    engine: "UE 5.0 – 5.7",
    type: "Asset Package (Blueprint)",
    rating: "5.0 / 5.0",
    link: "https://www.fab.com/listings/13cad897-c843-4c5a-aba6-94c4cf703c56",
    docs: "https://may-popup-system-documen-ca2wdnq.gamma.site/",
    demo: "https://drive.google.com/file/d/1Z2odMFCKMhgJPTVI40Gn_zQebhOUv0-Z/view?usp=sharing",
    video: null,
    features: [
      {
        title: "Dynamische Popups",
        text: "Vielseitige Popup-Stile mit konfigurierbaren Titeln, Beschreibungen, Icons und Buttons.",
      },
      {
        title: "Interaktive Notifications",
        text: "Klickbare Benachrichtigungen mit Progress-Bar, Sound-Effekten und automatischem Timer.",
      },
      {
        title: "Theme-System",
        text: "Vorkonfigurierte Dark- und White-Themes mit einfacher Anpassung über Settings-Menü.",
      },
      {
        title: "Plug & Play",
        text: "Auto-Detection und -Konfiguration: System erkennt fehlende Panels und ergänzt sie automatisch.",
      },
      {
        title: "Notification Types",
        text: "Default, General, System und Friend System — vorkonfigurierte Typen für gängige Use Cases.",
      },
      {
        title: "Breite UE-Kompatibilität",
        text: "Unterstützt Unreal Engine 5.0 bis 5.7 — funktioniert in nahezu jedem aktuellen Projekt.",
      },
    ],
    modules: null,
    accentBorder: "border-t-blue-400",
  },
];

export default function ProjectMayStudios() {
  return (
    <ProjectShell
      hasSiteHeader
      title="May Studios"
      subtitle="Professionelle Unreal-Engine-Assets auf Fab.com — Recoil-Systeme, UI-Komponenten und Developer-Tools für Game-Entwickler weltweit."
      heroImage="https://placehold.co/1200x500/18181b/a1a1aa?text=May+Studios+%E2%80%93+Unreal+Engine+Assets"
      heroAlt="May Studios – Unreal Engine Assets auf Fab.com"
      ctaLabel="Zum Fab.com Store"
      ctaLink="https://www.fab.com/sellers/May-Studios"
    >
      {/* Stats */}
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

      {/* Overview */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="bg-surface border border-border p-8 lg:p-10">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Über May Studios</h3>
          <p>
            <strong>May Studios</strong> entwickelt professionelle Plugins und Asset-Pakete für die{" "}
            <strong>Unreal Engine</strong>. Der Fokus liegt auf praxisnahen Developer-Tools, die sich
            nahtlos in bestehende Projekte integrieren lassen — von Gameplay-Mechaniken wie Recoil-Systemen
            bis zu UI-Frameworks für Popups und Notifications.
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside">
            <li><strong>Code Plugins</strong> mit C++ &amp; Blueprint Support</li>
            <li><strong>Dokumentation</strong> &amp; Playable Demos</li>
            <li><strong>Network Replication</strong> für Multiplayer-Ready Assets</li>
            <li><strong>Discord Community</strong> für Support &amp; Feedback</li>
          </ul>
        </div>
        <div className="bg-surface border border-border p-8 lg:p-10">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Warum Fab.com?</h3>
          <p>
            <strong>Fab</strong> ist Epics offizieller Marketplace — der Nachfolger des Unreal Engine
            Marketplace. Alle Assets sind dort direkt in den Editor integrierbar und profitieren von
            Epics Qualitätssicherung und globalem Reach.
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-faint min-w-[80px]">Seller</span>
              <span className="text-fg text-sm font-medium">May-Studios</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-faint min-w-[80px]">Seit</span>
              <span className="text-fg text-sm font-medium">September 2024</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-faint min-w-[80px]">Kontakt</span>
              <a href="mailto:company@maystudios.net" className="text-brandLight hover:underline text-sm">
                company@maystudios.net
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-faint min-w-[80px]">Web</span>
              <a href="https://maystudios.net" target="_blank" rel="noopener" className="text-brandLight hover:underline text-sm">
                maystudios.net
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      {products.map((product, productIndex) => (
        <div key={product.name}>
          <h2>{product.name}</h2>
          <p className="text-faint text-xs uppercase tracking-widest mb-4">{product.tagline}</p>

          {/* Product stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-surface2 mb-6">
            {[
              { label: "Version", value: product.version },
              { label: "Preis", value: product.price },
              { label: "Engine", value: product.engine },
              { label: "Typ", value: product.type },
              { label: "Bewertung", value: product.rating },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface p-3">
                <p className="text-xs uppercase tracking-widest text-faint mb-1">{stat.label}</p>
                <p className="font-display font-semibold text-fg text-xs">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Product features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {product.features.map((feature) => (
              <div
                key={feature.title}
                className={`bg-surface border border-border border-t-2 ${product.accentBorder} p-6`}
              >
                <h3 className="font-display font-bold text-fg text-base mb-2">{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>

          {/* Modules (only for Recoil) */}
          {product.modules && (
            <div className="bg-surface border border-border p-6 mb-6">
              <h3 className="font-display font-bold text-fg text-base mb-3">Code Modules</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.modules.map((mod) => (
                  <div key={mod.name} className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-widest text-faint min-w-[60px]">{mod.type}</span>
                    <code className="text-fg text-sm bg-surface2 px-2 py-1">{mod.name}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product links */}
          <div className="flex flex-wrap gap-3">
            <a
              href={product.link}
              target="_blank"
              rel="noopener"
              className="swiss-btn-primary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              Auf Fab.com ansehen
            </a>
            <a
              href={product.docs}
              target="_blank"
              rel="noopener"
              className="swiss-btn-secondary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              Dokumentation
            </a>
            <a
              href={product.demo}
              target="_blank"
              rel="noopener"
              className="swiss-btn-secondary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              Playable Demo
            </a>
            {product.video && (
              <a
                href={product.video}
                target="_blank"
                rel="noopener"
                className="swiss-btn-secondary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
              >
                Video Showcase
              </a>
            )}
          </div>

          {productIndex < products.length - 1 && (
            <hr className="border-border mt-8" />
          )}
        </div>
      ))}

      {/* Tech Stack */}
      <h2>Tech Stack</h2>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <span className="tech-tag tech-tag-purple">Unreal Engine 5</span>
        <span className="tech-tag tech-tag-blue">C++</span>
        <span className="tech-tag tech-tag-teal">Blueprints</span>
        <span className="tech-tag tech-tag-orange">Fab.com</span>
        <span className="tech-tag tech-tag-gray">UMG / Slate</span>
        <span className="tech-tag tech-tag-green">Network Replication</span>
        <span className="tech-tag tech-tag-yellow">SIMD</span>
        <span className="tech-tag tech-tag-pink">GitBook</span>
      </div>

      {/* Community & Support */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-surface border border-border p-6">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Community & Support</h3>
          <p className="mb-4">Fragen, Feature Requests oder Bugs? Der Discord-Server ist die schnellste Anlaufstelle.</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://discord.gg/gReyJTbzkZ"
              target="_blank"
              rel="noopener"
              className="swiss-btn-secondary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              Discord beitreten
            </a>
            <a
              href="mailto:company@maystudios.net"
              className="swiss-btn-secondary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              E-Mail senden
            </a>
          </div>
        </div>
        <div className="bg-surface border border-border p-6">
          <h3 className="font-display font-bold text-fg text-lg mb-3">Roadmap</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Recoil v1.0.1:</strong> Advanced Recoil Patterns, Interactive Feedback, Enhanced Editor Tools</li>
            <li><strong>Popup v1.0.2:</strong> Advanced Animations, Notification Queuing, Cursor Settings</li>
            <li>Weitere Plugins und Asset-Pakete in Planung</li>
          </ul>
        </div>
      </div>
    </ProjectShell>
  );
}
