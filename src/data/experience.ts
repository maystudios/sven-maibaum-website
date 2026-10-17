export type ExperienceEntry = {
  period: string;
  company: string;
  /** Optional website of the company, linked from its name. */
  companyUrl?: string;
  title: string;
  detail: string;
  tags: string[];
};

export const experienceHeading = {
  eyebrow: "Erfahrung",
  title: "Berufserfahrung",
};

export const experiences: ExperienceEntry[] = [
  {
    period: "2026 – Heute",
    company: "Sentrix Code GmbH",
    companyUrl: "https://sentrixcode.com",
    title: "Chief Technology Officer (CTO)",
    detail:
      "Software und Spiele entwickeln, auf den Markt bringen und die Dienstleistungen drumherum liefern. Als CTO verantworte ich Architektur, Technik und Entwicklung.",
    tags: ["Technische Leitung", "Architektur"],
  },
  {
    period: "Juni 2023 – Heute",
    company: "MayStudios (Selbstständig)",
    title: "CEO",
    detail:
      "Eigenes Technologieunternehmen für Aufträge in Softwareentwicklung, Softwarearchitektur, Produktmanagement, technischer Leitung und Spieleentwicklung. Daneben entwickle ich eigene Produkte. Programmiert habe ich zuerst mit elf Jahren, heute sind es über zehn Jahre Erfahrung.",
    tags: ["Softwarearchitektur", "Spieleentwicklung", "Eigene Produkte"],
  },
  {
    period: "März 2025 – Apr. 2026",
    company: "LikeTik by Axinity (Teilzeit)",
    title: "Lead Softwarearchitekt & Software Developer",
    detail:
      "Architektur, technische Ausrichtung und Umsetzung einer Social-Commerce-App, von den Produktanforderungen bis zur skalierbaren Software.",
    tags: ["Architektur", "Web", "Projektleitung"],
  },
  {
    period: "Okt. 2024 – März 2026",
    company: "Emotions Gaming (Vollzeit, remote)",
    title: "Leitender Spieleentwickler",
    detail:
      'Lead Game Developer von HeistLine, früher unter dem Arbeitstitel "The Prison Break": Gameplay-Systeme, Spielablauf und Multiplayer-Netzwerk in Unreal Engine mit C++ und Blueprints, dazu Werkzeuge für das Team und die technische Planung.',
    tags: ["Unreal Engine", "C++", "Multiplayer"],
  },
  {
    period: "März 2024 – Juli 2024",
    company: "Phantomedia (Vollzeit)",
    title: "Spieleentwickler",
    detail:
      "KI-Systeme für Dinosaurier in Unreal Engine mit State Trees und Mass AI, prozedurale Animation und angepasste Navigation.",
    tags: ["Unreal Engine", "KI", "Animation"],
  },
];
