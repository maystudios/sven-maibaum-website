export type MobileGameFeature = {
  title: string;
  description: string;
};

export type MobileGameScreenshot = {
  src: string;
  alt: string;
};

export type MobileGameStoreLink = {
  label: string;
  href: string;
};

export type MobileGame = {
  title: string;
  subtitle: string;
  overview: string;
  status: string;
  statusKind: "live" | "development";
  platform: string;
  genre: string;
  studio: string;
  heroImage: string;
  heroAlt: string;
  screenshots: MobileGameScreenshot[];
  features: MobileGameFeature[];
  storeLinks: MobileGameStoreLink[];
  releaseSummary: string;
  sourceUrl: string;
};

const base = import.meta.env.BASE_URL;

export const mobileGames = {
  shapes: {
    title: "Shapes · Puzzle Escape",
    subtitle: "Ein ruhiges Schiebepuzzle mit acht Schwierigkeitsstufen und einem eigenen Silhouetten-Modus.",
    overview:
      "Farbige Formen müssen in ihrer vorgegebenen Richtung vom Spielfeld geschoben werden. Das Spiel verzichtet auf Timer, Energie und tägliche Pflichtaufgaben. Die Rätsel werden deterministisch erzeugt und bleiben dadurch auf jedem Gerät lösbar.",
    status: "Android veröffentlicht, iOS in Prüfung",
    statusKind: "live",
    platform: "Android · iOS in Prüfung",
    genre: "Puzzle · Casual",
    studio: "Wega Studios × MAY STUDIOS",
    heroImage: `${base}assets/projects/mobile-games/shapes/banner.webp`,
    heroAlt: "Key Art von Shapes · Puzzle Escape",
    screenshots: [
      {
        src: `${base}assets/projects/mobile-games/shapes/screenshot-01.webp`,
        alt: "Spielfeld von Shapes · Puzzle Escape",
      },
      {
        src: `${base}assets/projects/mobile-games/shapes/screenshot-02.webp`,
        alt: "Silhouetten-Modus von Shapes · Puzzle Escape",
      },
      {
        src: `${base}assets/projects/mobile-games/shapes/screenshot-03.webp`,
        alt: "Großes Rätsel in Shapes · Puzzle Escape",
      },
    ],
    features: [
      {
        title: "Tippen und schieben",
        description: "Jede Form bewegt sich in eine feste Richtung. Das Level ist gelöst, sobald das Brett leer ist.",
      },
      {
        title: "Acht Stufen",
        description: "Die Spielfelder wachsen von kurzen Einstiegsrätseln bis zu großen, anspruchsvollen Gittern.",
      },
      {
        title: "Silhouetten-Modus",
        description: "Spätere Level formen das Brett als Rakete, Herz, Stern, Anker oder Krone.",
      },
      {
        title: "Ohne Zeitdruck",
        description: "Kein Countdown und keine Energie. Ein Level kann jederzeit begonnen und beendet werden.",
      },
    ],
    storeLinks: [
      {
        label: "Bei Google Play öffnen",
        href: "https://play.google.com/store/apps/details?id=com.wegastudios.shapespuzzleescape",
      },
    ],
    releaseSummary:
      "Shapes wurde gemeinsam mit Wega Studios für Mobile entwickelt. Die Android-Version ist auf Google Play verfügbar, die iOS-Version befindet sich in Prüfung.",
    sourceUrl: "https://maystudios.net/games/shapes-puzzle-escape",
  },
  tiles: {
    title: "Tiles · Logic Puzzle",
    subtitle: "Ein Logikspiel mit 1.000 eindeutig lösbaren Levels, acht Welten und wachsender Rastergröße.",
    overview:
      "Pro Zeile, Spalte und Farbregion wird genau eine Kachel gesetzt. Zwei Kacheln dürfen sich dabei nicht berühren, auch nicht diagonal. Jedes Rätsel besitzt genau eine logisch herleitbare Lösung und kommt ohne Raten aus.",
    status: "Auf Google Play veröffentlicht",
    statusKind: "live",
    platform: "Android · iOS geplant",
    genre: "Logik-Puzzle",
    studio: "Wega Studios × MAY STUDIOS",
    heroImage: `${base}assets/projects/mobile-games/tiles/banner.webp`,
    heroAlt: "Key Art von Tiles · Logic Puzzle",
    screenshots: [
      {
        src: `${base}assets/projects/mobile-games/tiles/screenshot-01.webp`,
        alt: "Spielfeld von Tiles · Logic Puzzle",
      },
      {
        src: `${base}assets/projects/mobile-games/tiles/screenshot-02.webp`,
        alt: "Spielmechanik von Tiles · Logic Puzzle",
      },
      {
        src: `${base}assets/projects/mobile-games/tiles/screenshot-03.webp`,
        alt: "Verschiedene Welten in Tiles · Logic Puzzle",
      },
    ],
    features: [
      {
        title: "Logik statt Raten",
        description: "Alle 1.000 Level wurden auf eine eindeutige Lösung geprüft und lassen sich Schritt für Schritt lösen.",
      },
      {
        title: "Klare Regeln",
        description: "Genau eine Kachel gehört in jede Zeile, Spalte und Farbregion. Diagonale Berührungen sind ausgeschlossen.",
      },
      {
        title: "Acht Welten",
        description: "Die Raster wachsen von 5 × 5 bis 12 × 12. Neue Umgebungen markieren den steigenden Anspruch.",
      },
      {
        title: "Optionales Hilfesystem",
        description: "Hinweise zeigen den nächsten logischen Schritt. Der Spielfortschritt bleibt auch offline verfügbar.",
      },
    ],
    storeLinks: [
      {
        label: "Bei Google Play öffnen",
        href: "https://play.google.com/store/apps/details?id=com.wegastudios.tileslogicpuzzle",
      },
    ],
    releaseSummary:
      "Tiles wurde gemeinsam mit Wega Studios entwickelt und als Android-App veröffentlicht. Der Store-Auftritt, die Monetarisierung und die laufenden Updates gehören zum Release-Prozess.",
    sourceUrl: "https://maystudios.net/games/tiles-logic-puzzle",
  },
  hydroLoop: {
    title: "HydroLoop",
    subtitle: "Ein räumliches Rohr-Puzzle, bei dem einzelne Segmente zu einem geschlossenen Wasserkreislauf verbunden werden.",
    overview:
      "HydroLoop überträgt das bekannte Pipes-Prinzip in eine 3D-Ansicht. Rohrsegmente werden gedreht und miteinander verbunden, bis das gesamte System einen geschlossenen Kreislauf bildet. Das Projekt befindet sich aktuell in Entwicklung für Mobile.",
    status: "In Entwicklung",
    statusKind: "development",
    platform: "Android · iOS geplant",
    genre: "3D-Puzzle",
    studio: "Wega Studios × MAY STUDIOS",
    heroImage: `${base}assets/projects/mobile-games/hydroloop/banner.svg`,
    heroAlt: "Abstrakte Rohrschleife für HydroLoop",
    screenshots: [],
    features: [
      {
        title: "Rohre im Raum",
        description: "Die Puzzle-Elemente werden in einer räumlichen Ansicht gelesen, gedreht und verbunden.",
      },
      {
        title: "Geschlossener Kreislauf",
        description: "Ein Level ist gelöst, wenn alle relevanten Rohrsegmente korrekt miteinander verbunden sind.",
      },
      {
        title: "Mobile Steuerung",
        description: "Die Interaktion wird für kurze Touch-Eingaben und gut lesbare Spielzustände entwickelt.",
      },
      {
        title: "Release vorbereitet",
        description: "Android und iOS sind als Zielplattformen vorgesehen. Store-Links werden nach Veröffentlichung ergänzt.",
      },
    ],
    storeLinks: [],
    releaseSummary:
      "HydroLoop entsteht gemeinsam mit Wega Studios. Aktuell werden die 3D-Puzzlemechanik und die Touch-Steuerung für Android und iOS ausgearbeitet.",
    sourceUrl: "https://maystudios.net/games/hydroloop",
  },
} satisfies Record<string, MobileGame>;
