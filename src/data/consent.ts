import type { ConsentCategory } from "../consent/consentStore";

/** Copy of the consent banner and the consent-gated embeds. Facts: Datenschutz.tsx, sections 5 to 7. */
export const consentCopy = {
  title: "Cookie-Einstellungen",
  intro:
    "Mit Ihrer Einwilligung zähle ich mit Google Analytics Besuche und Seitenaufrufe. Auf den Seiten zu HeistLine und Mr. Dork 3 kann zusätzlich ein Steam-Widget von Valve laden. Ohne Ihre Einwilligung lädt beides nicht. Ihre Wahl können Sie jederzeit über „Cookie-Einstellungen“ im Seitenfuß ändern.",
  policyLead: "Mehr dazu in der",
  policyLink: "Datenschutzerklärung",
  acceptAll: "Alle akzeptieren",
  rejectAll: "Ablehnen",
  settings: "Einstellungen",
  save: "Auswahl speichern",
  necessaryLabel: "Notwendig",
  necessaryState: "immer aktiv",
  necessaryDescription:
    "Ihre Auswahl speichert die Website im lokalen Speicher Ihres Browsers, damit dieser Hinweis nicht bei jedem Aufruf erscheint. Diese Angabe verlässt Ihr Gerät nicht.",
  reopen: "Cookie-Einstellungen",
};

export const consentCategories: { id: ConsentCategory; label: string; description: string }[] = [
  {
    id: "statistics",
    label: "Statistik",
    description:
      "Google Analytics zählt Besuche und Seitenaufrufe. Dafür setzt Google die Cookies _ga und _ga_TSBZ01TVDR, die bis zu zwei Jahre gültig sind. Anbieter ist Google Ireland Limited; Daten können an Google LLC in den USA gehen.",
  },
  {
    id: "externalMedia",
    label: "Externe Medien",
    description:
      "Das Steam-Widget lädt direkt von Valve (store.steampowered.com und steamstatic.com). Dabei erhält Valve Ihre IP-Adresse und setzt eigene Cookies. Valve sitzt in den USA.",
  },
];

export const steamPlaceholderCopy = {
  notice:
    "Das Steam-Widget lädt Inhalte direkt von Valve. Dabei erhält Valve Ihre IP-Adresse und setzt Cookies. Es lädt erst, wenn Sie in externe Medien einwilligen; widerrufen können Sie das jederzeit über „Cookie-Einstellungen“.",
  load: "Steam-Widget laden",
  store: "Im Steam-Store ansehen",
};
