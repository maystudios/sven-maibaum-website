import ProjectShell from "./ProjectShell";
import type { MobileGame } from "../data/mobileGames";

type MobileGameProjectProps = {
  game: MobileGame;
};

export default function MobileGameProject({ game }: MobileGameProjectProps) {
  const primaryStoreLink = game.storeLinks[0];
  const ctaLabel = primaryStoreLink?.label ?? "Bei MAY STUDIOS ansehen";
  const ctaLink = primaryStoreLink?.href ?? game.sourceUrl;

  return (
    <ProjectShell
      hasSiteHeader
      title={game.title}
      subtitle={game.subtitle}
      heroImage={game.heroImage}
      heroAlt={game.heroAlt}
      ctaLabel={ctaLabel}
      ctaLink={ctaLink}
    >
      <div className="grid grid-cols-2 gap-px bg-surface2 md:grid-cols-4">
        {[
          { label: "Status", value: game.status },
          { label: "Plattform", value: game.platform },
          { label: "Genre", value: game.genre },
          { label: "Studio", value: game.studio },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="mb-1 text-xs uppercase tracking-widest text-faint">{stat.label}</p>
            <p className="font-display text-sm font-semibold text-fg">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.65fr)]">
        <div>
          <h2>Das Spiel</h2>
          <p>{game.overview}</p>
        </div>

        <aside className="border border-border bg-surface p-6" aria-label={`Release-Status von ${game.title}`}>
          <div className="flex items-center justify-between gap-4">
            <p className="m-0 text-xs uppercase tracking-[0.16em] text-faint">Release</p>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                game.statusKind === "live"
                  ? "border-green-500/40 bg-green-500/10 text-fg"
                  : "border-blue-500/40 bg-blue-500/10 text-fg"
              }`}
            >
              {game.statusKind === "live" ? "Veröffentlicht" : "In Entwicklung"}
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted">{game.releaseSummary}</p>

          <div className="mt-5 flex flex-col gap-3">
            {game.storeLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="swiss-btn-primary justify-center"
              >
                {link.label}
              </a>
            ))}
            <a
              href={game.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="swiss-btn-secondary justify-center"
            >
              Projekt bei MAY STUDIOS
            </a>
          </div>
        </aside>
      </div>

      <h2>Spielprinzip und Features</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {game.features.map((feature, index) => (
          <article key={feature.title} className="border border-border bg-surface p-6">
            <p className="mb-4 font-mono text-xs text-brand">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="m-0 font-display text-base font-semibold text-fg">{feature.title}</h3>
            <p className="mb-0 mt-3 text-sm leading-relaxed text-muted">{feature.description}</p>
          </article>
        ))}
      </div>

      {game.screenshots.length > 0 ? (
        <>
          <h2>Direkt aus der App</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
            {game.screenshots.map((screenshot) => (
              <figure key={screenshot.src} className="overflow-hidden border border-border bg-surface p-1.5">
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="aspect-[9/16] w-full object-cover"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </>
      ) : (
        <div className="border border-dashed border-border bg-surface p-6 text-center sm:p-8">
          <p className="mb-2 font-display text-base font-semibold text-fg">Aktuell in Entwicklung</p>
          <p className="m-0 text-sm text-muted">
            Screenshots und Store-Links werden ergänzt, sobald die erste öffentliche Version bereitsteht.
          </p>
        </div>
      )}
    </ProjectShell>
  );
}
