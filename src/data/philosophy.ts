import { Layers, ShieldCheck, Zap, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PhilosophyItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const philosophyHeading = {
  eyebrow: "Arbeitsweise",
  title: "Meine Arbeitsphilosophie",
  intro: "Prinzipien, die ich in jedem Projekt verfolge – unabhängig von Technologie oder Teamgröße.",
};

export const philosophyItems: PhilosophyItem[] = [
  {
    icon: Layers,
    title: "Modular & erweiterbar",
    description:
      "Systeme sind nie wirklich fertig. Ich designe APIs und Grenzen so, dass sie Erweiterungen aushalten – ohne Refactor-Lawinen. Hexagonal / Ports-&-Adapters, klare Abhängigkeitsrichtung, Events für Entkopplung wo sinnvoll.",
  },
  {
    icon: ShieldCheck,
    title: "Clean Code & Design",
    description:
      "Lesbar, testbar, änderbar – das zählt nachhaltig mehr als clevere Einzeiler. Naming, klare Module, geringe Kopplung, hohe Kohäsion, sinnvolle Comments & Docs – über den gesamten Lifecycle.",
  },
  {
    icon: Zap,
    title: "Schnell prototypen & lernen",
    description:
      "Ich validiere früh: kleine Prototypen geben schnelle Erkenntnisse – auch wenn wir sie verwerfen. Fail-fast, aber nachhaltig: Erkenntnisse fließen kuratiert ins Produkt, kein Wegwerfcode.",
  },
  {
    icon: Wrench,
    title: "Core-Systeme & Dev-Tools",
    description:
      "Ich baue gern Grundlagen, die anderen den Alltag erleichtern: Utility-Libs, Reusable Widgets/Plugins, CI-Snippets. Viele kleine 1 %-Verbesserungen ergeben spürbare Velocity-Gewinne im Team.",
  },
];
