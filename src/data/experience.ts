export type ExperienceEntry = {
  period: string;
  company: string;
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
    period: "März 2025 – Heute",
    company: "LikeTik by Axinity (Teilzeit)",
    title: "Leitender Software-Architekt",
    detail:
      "Verantwortlich für Software-Projektleitung und die Konzeption sowie Implementierung skalierbarer Web-Architekturen in innovativen Software-Engineering Projekten.",
    tags: ["Architektur", "Web", "Projektleitung"],
  },
  {
    period: "Okt. 2024 – Heute",
    company: "Emotions Gaming (Teilzeit)",
    title: "Leitender Spieleentwickler",
    detail:
      'Führende Rolle in der Entwicklung kreativer und technisch anspruchsvoller Spiele, u.a. für das Open-World-Multiplayer-Projekt "The Prisonbreak". Einsatz von Perforce und Unreal Engine.',
    tags: ["Unreal Engine", "Perforce", "Multiplayer"],
  },
  {
    period: "Juni 2023 – Heute",
    company: "MayStudios (Freiberuflich)",
    title: "Unternehmensinhaber & Entwickler",
    detail:
      "Data Scientist & Full-Stack Developer mit über 6 Jahren Erfahrung. Spezialisiert auf Backend-Systeme mit Spring Boot/Framework und datengetriebene Lösungen.",
    tags: ["Spring Boot", "Full-Stack", "Data Science"],
  },
  {
    period: "März 2024 – Juli 2024",
    company: "Phantomedia (Vollzeit)",
    title: "Spieleentwickler",
    detail:
      "Mitwirkung an der Entwicklung von Spielen unter Verwendung von Perforce und Unreal Engine, Fokus auf Gameplay-Mechaniken und Systemintegration.",
    tags: ["Unreal Engine", "Gameplay", "Systeme"],
  },
];
