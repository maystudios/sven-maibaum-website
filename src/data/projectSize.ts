/**
 * Project size scale for the contact form. Level names are the owner's
 * (16.10.2026). The example lines are proposals by an agent and still need the
 * owner's confirmation; they describe scope only and name no clients or brands.
 */
export const projectSizeLabel = "Projektgröße";

export type ProjectSizeLevel = {
  label: string;
  /** Typical projects of this size (proposal). */
  example: string;
};

export const projectSizeLevels: ProjectSizeLevel[] = [
  { label: "Mini", example: "Ein kleines Tool, ein Skript oder eine Landingpage." },
  { label: "Klein", example: "Eine App oder Website mit kleinem Backend und einer Datenbank." },
  { label: "Mittel", example: "Eine Plattform mit Nutzerkonten, mehreren Diensten und Schnittstellen zu anderen Systemen." },
  { label: "Groß", example: "Viele Dienste, mehrere Datenbanken und Warteschlangen, etwa ein Marktplatz oder ein Multiplayer-Spiel." },
  { label: "Maximal", example: "Ein verteiltes System über mehrere Regionen mit vielen Datenbanken oder ein großes AAA-Spiel." },
];
