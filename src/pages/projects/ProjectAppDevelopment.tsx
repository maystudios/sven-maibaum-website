import ProjectShell from "../../components/ProjectShell";
import { appProjects } from "../../data/appProjects";
import type { AppProject } from "../../data/appProjects";

const base = import.meta.env.BASE_URL;

const themeStyles = {
  orange: {
    badge: "border-orange-400/40 bg-orange-400/10",
    number: "text-orange-400",
    note: "border-orange-400/50 bg-orange-400/5",
  },
  blue: {
    badge: "border-blue-400/40 bg-blue-400/10",
    number: "text-blue-400",
    note: "border-blue-400/50 bg-blue-400/5",
  },
} satisfies Record<AppProject["theme"], { badge: string; number: string; note: string }>;

type AppEntryProps = {
  project: AppProject;
  index: string;
};

function AppEntry({ project, index }: AppEntryProps) {
  const styles = themeStyles[project.theme];
  const galleryClass =
    project.screenshots.length === 2 ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 gap-3 sm:grid-cols-3";
  return (
    <article
      id={project.id}
      tabIndex={-1}
      aria-labelledby={`${project.id}-title`}
      className="scroll-mt-24 border border-border bg-surface p-5 outline-none focus-visible:ring-2 focus-visible:ring-brand sm:p-7 lg:p-8"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className={"font-mono text-xs " + styles.number}>{index}</span>
        <span
          className={
            "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fg " +
            styles.badge
          }
        >
          {project.status}
        </span>
        <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-muted">
          {project.category}
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)] lg:gap-10">
        <div>
          <h3 id={`${project.id}-title`} className="!mt-0 font-display text-2xl font-bold text-fg">
            {project.title}
          </h3>
          <p className="mt-2 text-base font-medium text-fg">{project.subtitle}</p>
          <p>{project.overview}</p>

          <dl className="grid grid-cols-2 gap-px bg-surface2">
            {[
              { label: "Status", value: project.status },
              { label: "Plattform", value: project.platform },
              { label: "Stack", value: project.stack },
              { label: "Bereich", value: project.category },
            ].map((stat) => (
              <div key={stat.label} className="bg-canvas p-4">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">{stat.label}</dt>
                <dd className="mt-1 font-display text-sm font-semibold text-fg">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <p className={"mt-6 border-l-2 p-4 text-sm text-muted " + styles.note}>{project.releaseNote}</p>
        </div>

        <div>
          <div className={galleryClass}>
            {project.screenshots.map((screenshot) => (
              <figure key={screenshot.src} className="overflow-hidden border border-border bg-canvas p-1">
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="aspect-[9/19] w-full object-contain"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
          {project.galleryNote ? <p className="mt-3 text-xs text-muted">{project.galleryNote}</p> : null}
        </div>
      </div>

      <div className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {project.features.map((feature) => (
          <div key={feature.title}>
            <p className="mb-1 font-display text-sm font-semibold text-fg">{feature.title}</p>
            <p className="m-0 text-xs leading-relaxed text-muted">{feature.description}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function ProjectAppDevelopment() {
  return (
    <ProjectShell
      hasSiteHeader
      title="App-Entwicklung"
      subtitle="Mobile Produktentwicklung mit Flutter, nativen Plattformfunktionen und klaren Release-Prozessen."
      heroImage={base + "assets/projects/app-development/preview.svg"}
      heroAlt="App-Entwicklung mit Wake Up und SplitUp"
    >
      <div className="grid grid-cols-2 gap-px bg-surface2 md:grid-cols-4">
        {[
          { label: "Status", value: "2 × Pre-Release" },
          { label: "Projekte", value: "2" },
          { label: "Plattformen", value: "Android · iOS" },
          { label: "Stack", value: "Flutter" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="mb-1 text-xs uppercase tracking-widest text-muted">{stat.label}</p>
            <p className="font-display text-sm font-semibold text-fg">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Mobile Produktentwicklung</h2>
        <p>
          Dieser Bereich bündelt eigenständige Anwendungen außerhalb der Spieleentwicklung. Beide Projekte befinden
          sich im Pre-Release und werden hier mit ihrem aktuellen Funktionsumfang, Stack und Entwicklungsstand
          dokumentiert.
        </p>
      </div>

      <nav className="grid gap-px bg-surface2 sm:grid-cols-2" aria-label="App-Projekte">
        {appProjects.map((project, index) => (
          <a
            key={project.id}
            href={"#" + project.id}
            onClick={() => {
              window.setTimeout(() => document.getElementById(project.id)?.focus({ preventScroll: true }), 0);
            }}
            className="swiss-btn-secondary !justify-between !rounded-none !border-0 !bg-surface !px-5 !py-4"
          >
            <span>
              <span className="mr-3 font-mono text-xs text-brand">{String(index + 1).padStart(2, "0")}</span>
              {project.title}
            </span>
            <span aria-hidden="true">↓</span>
          </a>
        ))}
      </nav>

      <div className="space-y-6">
        {appProjects.map((project, index) => (
          <AppEntry key={project.id} project={project} index={String(index + 1).padStart(2, "0")} />
        ))}
      </div>
    </ProjectShell>
  );
}
