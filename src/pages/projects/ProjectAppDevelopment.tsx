import ProjectShell from "../../components/ProjectShell";

const base = import.meta.env.BASE_URL;

export default function ProjectAppDevelopment() {
  return (
    <ProjectShell
      hasSiteHeader
      title="App-Entwicklung"
      subtitle="Ein vorbereiteter Bereich für eigenständige Apps, Store-Releases und technische Produktarbeit."
      heroImage={`${base}assets/projects/app-development/preview.svg`}
      heroAlt="Vorbereiteter Bereich für kommende App-Projekte"
    >
      <div className="grid grid-cols-2 gap-px bg-surface2 md:grid-cols-4">
        {[
          { label: "Status", value: "In Vorbereitung" },
          { label: "Projekte", value: "0" },
          { label: "Bereich", value: "Apps" },
          { label: "Plattformen", value: "Mobile · Desktop" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="mb-1 text-xs uppercase tracking-widest text-faint">{stat.label}</p>
            <p className="font-display text-sm font-semibold text-fg">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Platz für kommende Apps</h2>
        <p>
          Dieser Bereich ist für Anwendungen außerhalb der Spieleentwicklung reserviert. Projekte werden ergänzt,
          sobald sie einen Stand erreicht haben, der sich sinnvoll mit Screenshots, Architektur und Release-Details
          dokumentieren lässt.
        </p>
      </div>

      <section className="border border-dashed border-border bg-surface p-8 text-center sm:p-12" aria-labelledby="empty-apps-title">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">00 Einträge</p>
        <h2 id="empty-apps-title" className="!mt-4 !border-0 !pb-0 font-display text-2xl font-bold text-fg">
          Noch keine App-Projekte veröffentlicht
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Die Struktur steht bereits. Neue Apps können später als einzelne Einträge mit Funktionen, Technologie,
          Screenshots und Store-Link ergänzt werden.
        </p>
      </section>

      <div>
        <h2>Was später dokumentiert wird</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { number: "01", title: "Produkt", text: "Ziel, Nutzer und zentrale Funktionen der Anwendung." },
            { number: "02", title: "Technik", text: "Architektur, Plattformen und relevante Entscheidungen." },
            { number: "03", title: "Release", text: "Veröffentlichung, Store-Links und laufender Betrieb." },
          ].map((item) => (
            <article key={item.number} className="border border-border bg-surface p-5">
              <p className="font-mono text-xs text-brand">{item.number}</p>
              <h3 className="mt-4 font-display text-base font-semibold text-fg">{item.title}</h3>
              <p className="m-0 text-sm leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </ProjectShell>
  );
}
