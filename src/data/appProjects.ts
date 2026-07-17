export type AppProjectFeature = {
  title: string;
  description: string;
};

export type AppProjectScreenshot = {
  src: string;
  alt: string;
};

export type AppProject = {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  status: string;
  platform: string;
  stack: string;
  category: string;
  theme: "orange" | "blue";
  screenshots: AppProjectScreenshot[];
  features: AppProjectFeature[];
  releaseNote: string;
  galleryNote?: string;
};

const base = import.meta.env.BASE_URL;

export const appProjects: AppProject[] = [
  {
    id: "wake-up",
    title: "Wake Up",
    subtitle: "Eine Wecker-App, die das Aufstehen mit einem QR-Code außerhalb des Betts bestätigt.",
    overview:
      "Wake Up beendet einen Alarm erst, wenn ein ausgedruckter QR-Code gescannt wurde. Native Alarme, steigende Snooze-Strafen und eine Notfall-PIN sichern den Ablauf auch am Sperrbildschirm ab. Streaks und Wochenwerte zeigen, wie zuverlässig die neue Routine funktioniert.",
    status: "Pre-Release",
    platform: "Android · iOS",
    stack: "Flutter · Riverpod",
    category: "Alarm & Routinen",
    theme: "orange",
    screenshots: [
      {
        src: `${base}assets/projects/app-development/wake-up/welcome.png`,
        alt: "Willkommensansicht von Wake Up mit QR-Code-Prinzip",
      },
      {
        src: `${base}assets/projects/app-development/wake-up/ready.png`,
        alt: "Wake-Up-Ansicht mit Streak-Start und erstem Alarm",
      },
    ],
    features: [
      {
        title: "QR-Code statt Ausschalten",
        description: "Der persönliche Code wird ausgedruckt und an einem Ort angebracht, für den man das Bett verlassen muss.",
      },
      {
        title: "Native Alarmauslösung",
        description: "Der Alarm funktioniert am Sperrbildschirm, steigert die Lautstärke und verschärft Snooze schrittweise.",
      },
      {
        title: "Streaks und Wochenwerte",
        description: "Aufstehzeiten, Serien und vergangene Alarme machen die eigene Routine nachvollziehbar.",
      },
      {
        title: "Travel Mode",
        description: "Eine lokale Objekterkennung ist als QR-Alternative für Reisen und wechselnde Umgebungen vorbereitet.",
      },
    ],
    releaseNote:
      "Die App befindet sich im Pre-Release. Öffentliche Store-Links werden ergänzt, sobald die Store-Prüfung beginnt.",
  },
  {
    id: "splitup",
    title: "SplitUp",
    subtitle: "Gemeinsame Ausgaben erfassen, flexibel verteilen und mit wenigen Überweisungen ausgleichen.",
    overview:
      "SplitUp verwaltet Ausgaben in Gruppen und berechnet offene Salden über alle Beteiligten. Belege werden direkt auf dem Gerät per OCR erkannt und anschließend gleichmäßig, pro Artikel oder mit eigenen Beträgen und Prozenten verteilt. Der Ausgleichsplan reduziert die nötigen Überweisungen, ohne selbst Geld zu bewegen.",
    status: "Pre-Release",
    platform: "Android · iOS",
    stack: "Flutter · Supabase",
    category: "Ausgaben & OCR",
    theme: "blue",
    screenshots: [
      {
        src: `${base}assets/projects/app-development/splitup/home.png`,
        alt: "SplitUp-Startseite mit Gesamtsaldo und letzten Ausgaben",
      },
      {
        src: `${base}assets/projects/app-development/splitup/group.png`,
        alt: "Gruppenansicht in SplitUp mit Salden und Vorgängen",
      },
      {
        src: `${base}assets/projects/app-development/splitup/settle.png`,
        alt: "Ausgleichsplan in SplitUp mit zwei vorgeschlagenen Überweisungen",
      },
    ],
    features: [
      {
        title: "Gruppen und Mitglieder",
        description: "Kategorien, Cover sowie Mitglieder mit und ohne eigenes Konto bilden gemeinsame Vorhaben ab.",
      },
      {
        title: "Belege lokal erkennen",
        description: "ML Kit und ein lokaler Parser lesen Positionen aus Belegen. Beträge lassen sich anschließend korrigieren.",
      },
      {
        title: "Flexible Aufteilung",
        description: "Ausgaben werden gleichmäßig, pro Artikel oder individuell nach Betrag und Prozent verteilt.",
      },
      {
        title: "Kompakter Ausgleichsplan",
        description: "Ein Min-Cash-Flow-Verfahren berechnet einen Plan mit möglichst wenigen Überweisungen.",
      },
    ],
    releaseNote:
      "Die Kernabläufe sind umgesetzt. Signing, Store-Unterlagen und die Veröffentlichung stehen noch aus.",
    galleryNote: "Die Screenshots verwenden ausschließlich feste Demo-Daten.",
  },
];
