import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import ConsentSettingsButton from "../consent/ConsentSettingsButton";
import "./Links.css";

const PAGE_TITLE = "Social Links – TikTok, YouTube & Instagram | Sven Maibaum";
const PAGE_DESCRIPTION =
  "Alle Kanäle von Sven Maibaum an einem Ort: TikTok, YouTube und Instagram, dazu der Weg zurück ins Portfolio.";
const PAGE_URL = "https://www.sven-maibaum.com/links/";

/** Inline brand marks, so the page needs no icon font for the platforms. */
const tikTokIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
  </svg>
);

const youTubeIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
  </svg>
);

const instagramIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.26 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.86.07-3.21 0-3.59-.01-4.86-.07-1.17-.06-1.82-.26-2.24-.42-.57-.22-.96-.48-1.38-.9-.42-.42-.69-.82-.9-1.38-.17-.42-.36-1.07-.42-2.24-.05-1.26-.06-1.65-.06-4.84 0-3.2.01-3.59.06-4.86.06-1.17.25-1.82.42-2.24.21-.57.48-.96.9-1.38.42-.42.81-.69 1.38-.9.42-.17 1.05-.36 2.22-.42C8.43 2.18 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.91.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.91.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.14.56 2.91.31.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.77.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.77.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
  </svg>
);

const arrowIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
  </svg>
);

/** Per-card accent, consumed by the custom properties in Links.css. */
type AccentStyle = CSSProperties & {
  "--links-accent": string;
  "--links-line": string;
  "--links-wash": string;
};

type Channel = {
  name: string;
  handle: string;
  href?: string;
  icon: ReactNode;
  accent: AccentStyle;
};

const channels: Channel[] = [
  {
    name: "TikTok",
    handle: "@sven_maibaum",
    href: "https://www.tiktok.com/@sven_maibaum",
    icon: tikTokIcon,
    accent: {
      "--links-accent": "var(--links-tiktok)",
      "--links-line": "rgba(37, 244, 238, 0.4)",
      "--links-wash": "rgba(37, 244, 238, 0.08)",
    },
  },
  {
    name: "YouTube",
    handle: "@sven-maibaum",
    href: "https://www.youtube.com/@sven-maibaum",
    icon: youTubeIcon,
    accent: {
      "--links-accent": "#ff3b30",
      "--links-line": "rgba(255, 59, 48, 0.4)",
      "--links-wash": "rgba(255, 59, 48, 0.08)",
    },
  },
  {
    name: "Instagram",
    handle: "Bald verfügbar",
    icon: instagramIcon,
    accent: {
      "--links-accent": "#e1306c",
      "--links-line": "var(--sw-border-light)",
      "--links-wash": "transparent",
    },
  },
];

export default function Links() {
  // Client-side navigation keeps the prerendered <head> of the previous route,
  // so set this page's metadata on mount and put the old values back on exit.
  useEffect(() => {
    const fields = [
      { selector: 'meta[name="description"]', attr: "content", value: PAGE_DESCRIPTION },
      { selector: 'link[rel="canonical"]', attr: "href", value: PAGE_URL },
      { selector: 'meta[property="og:url"]', attr: "content", value: PAGE_URL },
      { selector: 'meta[property="og:title"]', attr: "content", value: PAGE_TITLE },
      { selector: 'meta[property="og:description"]', attr: "content", value: PAGE_DESCRIPTION },
      { selector: 'meta[name="twitter:title"]', attr: "content", value: PAGE_TITLE },
      { selector: 'meta[name="twitter:description"]', attr: "content", value: PAGE_DESCRIPTION },
    ];

    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const undo = fields.map(({ selector, attr, value }) => {
      const el = document.querySelector(selector);
      const previous = el?.getAttribute(attr) ?? null;
      el?.setAttribute(attr, value);
      return () => {
        if (el && previous !== null) el.setAttribute(attr, previous);
      };
    });

    return () => {
      document.title = previousTitle;
      undo.forEach((restore) => restore());
    };
  }, []);

  return (
    <div className="links-page">
      <div className="links-bg" aria-hidden="true">
        <div className="links-bg-grid" />
        <div className="links-bg-glow" />
      </div>

      <main className="links-main">
        <header className="links-identity links-reveal">
          <div className="links-avatar-frame">
            <img
              className="links-avatar"
              src={`${import.meta.env.BASE_URL}assets/images/sven_maibaum_profile.webp`}
              alt="Sven Maibaum"
              width={104}
              height={104}
            />
          </div>
          <h1 className="links-name">Sven Maibaum</h1>
          <p className="links-role">Software-Architekt &amp; Spieleentwickler</p>
          <p className="links-bio">
            Ich baue Spiele, Apps und KI-Tools bei MayStudios. Alle Kanäle findest du hier.
          </p>
        </header>

        <h2 className="links-eyebrow links-reveal" style={{ "--links-delay": "90ms" } as CSSProperties}>
          Kanäle
        </h2>

        <ul className="links-list">
          {channels.map((channel, index) => (
            <li
              key={channel.name}
              className="links-reveal"
              style={{ "--links-delay": `${150 + index * 90}ms` } as CSSProperties}
            >
              {channel.href ? (
                <a
                  className="links-card"
                  style={channel.accent}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${channel.name} (${channel.handle}) in neuem Tab öffnen`}
                >
                  <span className="links-card-icon">{channel.icon}</span>
                  <span className="links-card-body">
                    <span className="links-card-name">{channel.name}</span>
                    <span className="links-card-handle">{channel.handle}</span>
                  </span>
                  <span className="links-card-arrow">{arrowIcon}</span>
                </a>
              ) : (
                <div className="links-card links-card--soon" style={channel.accent}>
                  <span className="links-card-icon">{channel.icon}</span>
                  <span className="links-card-body">
                    <span className="links-card-name">{channel.name}</span>
                    <span className="links-card-handle">{channel.handle}</span>
                  </span>
                  <span className="links-badge">Soon</span>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="links-reveal" style={{ "--links-delay": "420ms" } as CSSProperties}>
          <a className="links-portfolio" href={import.meta.env.BASE_URL}>
            <span className="links-portfolio-label">Zum Portfolio</span>
            <span className="links-portfolio-meta">sven-maibaum.com</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </a>
        </div>
      </main>

      <footer className="links-footer">
        <div className="links-footer-inner">
          <nav className="links-footer-nav" aria-label="Rechtliches und Portfolio">
            <a href={import.meta.env.BASE_URL}>Portfolio</a>
            <a href={`${import.meta.env.BASE_URL}impressum/`}>Impressum</a>
            <a href={`${import.meta.env.BASE_URL}datenschutz/`}>Datenschutz</a>
            <ConsentSettingsButton className="links-footer-button" />
          </nav>
          <p className="links-copy">© {new Date().getFullYear()} Sven Maibaum</p>
        </div>
      </footer>
    </div>
  );
}
