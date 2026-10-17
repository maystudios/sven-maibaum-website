import ProjectShell from "../../components/ProjectShell";

export default function ProjectLikeTik() {
  return (
    <ProjectShell
      title="LikeTik"
      subtitle="Die automatisierte Social Commerce Plattform für Creator, Brands & Agenturen."
      heroImage={`${import.meta.env.BASE_URL}assets/projects/liketik/liketik.png`}
      heroAlt="LikeTik Dashboard Visualisierung"
      ctaLabel="Zur offiziellen Website"
      ctaLink="https://www.liketik.com/"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface2 mb-8">
        {[
          { label: "Rolle", value: "Lead Architect" },
          { label: "Typ", value: "Social Commerce" },
          { label: "Status", value: "Aktiv" },
          { label: "Team", value: "Axinity" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="text-xs uppercase tracking-widest text-faint mb-1">{stat.label}</p>
            <p className="font-display font-semibold text-fg text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2>Projektübersicht</h2>
      <p>
        <strong>LikeTik</strong> ist eine revolutionäre Plattform, die Social Commerce automatisiert. Als
        <strong> Lead Softwarearchitekt &amp; Software Developer</strong> bei Axinity habe ich von März 2025 bis
        April 2026 die technische Konzeption und Umsetzung dieses komplexen Ökosystems verantwortet. Die App verbindet Content Creator direkt mit Brands und übernimmt die
        komplette Logistikkette – von der KI-basierten Produktauswahl bis zum Versand.
      </p>
      <p>
        Das Ziel: Follower in echte Käufer zu verwandeln, indem Creator ohne eigenes Lager oder kompliziertes
        Management sofort Produkte verkaufen können, die perfekt zu ihrer Zielgruppe passen.
      </p>

      <h3>Kernfeatures & Innovationen</h3>
      <div className="grid sm:grid-cols-2 gap-4 my-4">
        {[
          { icon: "⚡", title: "KI-Produkt Matching", desc: "Algorithmen analysieren die Zielgruppe des Creators und schlagen Produkte mit der höchsten Kaufwahrscheinlichkeit vor." },
          { icon: "🔄", title: "Automatisches Fulfillment", desc: "Vollständige Integration von Logistikprozessen – der Creator fokussiert sich nur auf Content." },
          { icon: "📊", title: "Real-Time Analytics", desc: "Dashboard mit KI-Prognosen (\"Future Predictions\") und Wachstumspotenzialen." },
          { icon: "🔗", title: "Multi-Channel Support", desc: "Integration von TikTok Shop, Shopify und eigenen Landing Pages." },
          { icon: "🏷️", title: "Brand Building", desc: "Tools, mit denen Creator in Sekunden ihre eigene Marke (Whitelabel) aufbauen können." },
        ].map((feature) => (
          <div key={feature.title} className="bg-surface border border-border p-5 hover:border-brand transition-colors duration-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg" aria-hidden="true">{feature.icon}</span>
              <h4 className="font-display font-semibold text-fg text-sm">{feature.title}</h4>
            </div>
            <p className="text-muted text-xs leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <h3>Eingesetzte Technologien</h3>
      <div className="my-4">
        <span className="tech-tag tech-tag-teal">Microservices</span>
        <span className="tech-tag tech-tag-purple">KI & ML</span>
        <span className="tech-tag tech-tag-blue">Cloud (AWS/GCP)</span>
        <span className="tech-tag tech-tag-green">Node.js / Spring Boot</span>
        <span className="tech-tag tech-tag-orange">React / Vue.js</span>
        <span className="tech-tag tech-tag-red">Big Data</span>
        <span className="tech-tag tech-tag-gray">TikTok API</span>
      </div>

      <h3>Ergebnisse</h3>
      <p>
        LikeTik ermöglicht es Creatorn und Agenturen, ihre Monetarisierung drastisch zu vereinfachen. Die Plattform
        skaliert automatisch mit dem Traffic viraler Videos und bietet eine der fortschrittlichsten Lösungen im
        europäischen Social Commerce Markt.
      </p>
    </ProjectShell>
  );
}
