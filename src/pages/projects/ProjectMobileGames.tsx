import ProjectShell from "../../components/ProjectShell";
import { mobileGames } from "../../data/mobileGames";
import type { MobileGame } from "../../data/mobileGames";

const base = import.meta.env.BASE_URL;
const releasedGames = [mobileGames.shapes, mobileGames.tiles];

type GameStatsProps = {
  game: MobileGame;
};

function GameStats({ game }: GameStatsProps) {
  return (
    <dl className="grid grid-cols-2 gap-px bg-surface2">
      {[
        { label: "Status", value: game.status },
        { label: "Plattform", value: game.platform },
        { label: "Genre", value: game.genre },
        { label: "Studio", value: game.studio },
      ].map((stat) => (
        <div key={stat.label} className="bg-surface p-4">
          <dt className="text-[11px] uppercase tracking-[0.14em] text-faint">{stat.label}</dt>
          <dd className="mt-1 font-display text-sm font-semibold text-fg">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

type ReleasedGameProps = {
  game: MobileGame;
  index: string;
};

function ReleasedGame({ game, index }: ReleasedGameProps) {
  return (
    <article className="border border-border bg-surface p-5 sm:p-7 lg:p-8">
      <span id={game.id} aria-hidden="true" className="relative -top-16 block h-0" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)] lg:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-brand">{index}</span>
            <span className="inline-flex rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fg">
              Veröffentlicht
            </span>
          </div>

          <h3 className="mt-5 font-display text-2xl font-bold text-fg">{game.title}</h3>
          <p className="mt-2 text-base font-medium text-fg">{game.subtitle}</p>
          <p>{game.overview}</p>

          <GameStats game={game} />

          <div className="mt-6 flex flex-wrap gap-3">
            {game.storeLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="swiss-btn-primary"
              >
                {link.label}
              </a>
            ))}
            <a
              href={game.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="swiss-btn-secondary"
            >
              Bei MAY STUDIOS
            </a>
          </div>
        </div>

        <div className="space-y-4">
          {game.heroImage && game.heroAlt ? (
            <figure className="overflow-hidden border border-border bg-canvas">
              <img src={game.heroImage} alt={game.heroAlt} className="aspect-video w-full object-cover" />
            </figure>
          ) : null}

          <div className="grid grid-cols-3 gap-3">
            {game.screenshots.map((screenshot) => (
              <figure key={screenshot.src} className="overflow-hidden border border-border bg-canvas p-1">
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="aspect-[9/16] w-full object-cover"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {game.features.map((feature) => (
          <div key={feature.title}>
            <p className="mb-1 font-display text-sm font-semibold text-fg">{feature.title}</p>
            <p className="m-0 text-xs leading-relaxed text-muted">{feature.description}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function ProjectMobileGames() {
  const hydroLoop = mobileGames.hydroLoop;

  return (
    <ProjectShell
      hasSiteHeader
      title="Mobile Games"
      subtitle="Veröffentlichte Mobile-Puzzles und laufende Spieleprojekte von MAY STUDIOS und Partnerstudios."
      heroImage={`${base}assets/projects/mobile-games/card.svg`}
      heroAlt="Mobile Games von MAY STUDIOS"
      ctaLabel="Alle Spiele bei MAY STUDIOS"
      ctaLink="https://maystudios.net/games"
    >
      <div className="grid grid-cols-2 gap-px bg-surface2 md:grid-cols-4">
        {[
          { label: "Titel", value: "3" },
          { label: "Veröffentlicht", value: "2" },
          { label: "Plattformen", value: "Android · iOS" },
          { label: "Schwerpunkt", value: "Puzzle Games" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="mb-1 text-xs uppercase tracking-widest text-faint">{stat.label}</p>
            <p className="font-display text-sm font-semibold text-fg">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Die Sammlung</h2>
        <p>
          Hier sind die Mobile-Spiele gebündelt, an denen ich mit MAY STUDIOS und Partnerstudios arbeite. Fertige
          Releases stehen neben Projekten in Entwicklung. Neue Titel lassen sich später als weiterer Eintrag ergänzen.
        </p>
      </div>

      <div className="space-y-6">
        {releasedGames.map((game, index) => (
          <ReleasedGame key={game.id} game={game} index={String(index + 1).padStart(2, "0")} />
        ))}

        <article className="border border-border bg-surface p-6 sm:p-8">
          <span id={hydroLoop.id} aria-hidden="true" className="relative -top-16 block h-0" />
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-brand">03</span>
            <span className="inline-flex rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fg">
              Working Title
            </span>
            <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-muted">
              In Entwicklung
            </span>
          </div>

          <div className="mt-6 max-w-3xl">
            <h3 className="font-display text-2xl font-bold text-fg">{hydroLoop.title}</h3>
            <p className="mt-2 text-base font-medium text-fg">{hydroLoop.subtitle}</p>
            <p>{hydroLoop.overview}</p>
          </div>

          <div className="mt-6 grid gap-px bg-surface2 sm:grid-cols-3">
            {[
              { label: "Status", value: hydroLoop.status },
              { label: "Plattform", value: hydroLoop.platform },
              { label: "Genre", value: hydroLoop.genre },
            ].map((stat) => (
              <div key={stat.label} className="bg-canvas p-4">
                <p className="mb-1 text-xs uppercase tracking-widest text-faint">{stat.label}</p>
                <p className="m-0 font-display text-sm font-semibold text-fg">{stat.value}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted">
            Bildmaterial und Store-Links folgen, sobald der Titel öffentlich gezeigt werden kann.
          </p>
        </article>
      </div>
    </ProjectShell>
  );
}
