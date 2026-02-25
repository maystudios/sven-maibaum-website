import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Package, Settings, Bot } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "webentwicklung" | "spieleentwicklung" | "software-engineering" | "devops" | "ki-architektur";

// ─── Doc Helpers ──────────────────────────────────────────────────────────────

function DocHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-fg font-bold text-xl tracking-tight mb-4">{children}</h3>;
}
function DocSubheading({ children }: { children: React.ReactNode }) {
  return <h4 className="text-fg font-semibold text-base tracking-tight mb-3 mt-6">{children}</h4>;
}
function DocText({ children }: { children: React.ReactNode }) {
  return <p className="text-muted text-sm leading-relaxed mb-4">{children}</p>;
}
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-brand text-xs bg-surface px-1.5 py-0.5 rounded border border-border">
      {children}
    </code>
  );
}
function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((t) => (
        <span key={t} className="font-mono text-xs px-2 py-0.5 rounded bg-surface border border-border text-zinc-400">
          {t}
        </span>
      ))}
    </div>
  );
}

// ─── Tab 1: Webentwicklung ────────────────────────────────────────────────────

function Webentwicklung() {
  return (
    <div className="space-y-8">
      <div>
        <DocHeading>Frontend & Backend</DocHeading>
        <DocText>
          Über 8 Jahre Full-Stack-Erfahrung — von interaktiven React-SPAs bis zu verteilten
          Microservice-Architekturen mit Java Spring Boot. Ich decke den gesamten Stack ab,
          von der UI bis zur Datenbankschicht.
        </DocText>
      </div>

      <div className="border-l-2 border-brand pl-6 space-y-1">
        <p className="text-xs uppercase tracking-widest text-muted font-medium mb-3">Frontend</p>
        <TagList tags={["React", "TypeScript", "JavaScript (ES6+)", "TailwindCSS", "Bootstrap", "Next.js", "Thymeleaf", "Vite", "Redux", "Three.js", "WebGL"]} />
      </div>

      <div className="border-l-2 border-brand pl-6 space-y-1">
        <p className="text-xs uppercase tracking-widest text-muted font-medium mb-3">Backend</p>
        <TagList tags={["Java Spring Boot", "Node.js", "NestJS", "Python (FastAPI / Django)", "REST APIs", "GraphQL", "WebSockets"]} />
      </div>

      <div>
        <DocSubheading>Datenbanken & Infrastruktur</DocSubheading>
        <div className="hidden md:block overflow-hidden border border-border rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted font-medium">Technologie</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted font-medium">Typ</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted font-medium">Stärke</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "PostgreSQL",  type: "SQL",        note: "Primäre Wahl für relationale Daten" },
                { name: "MongoDB",     type: "NoSQL",      note: "Dokumentenorientierte Strukturen" },
                { name: "REST APIs",   type: "API",        note: "Design, Versionierung, Dokumentation" },
                { name: "GraphQL",     type: "API",        note: "Flexible Queries für komplexe Clients" },
                { name: "WebSockets",  type: "Realtime",   note: "Live-Daten, Multiplayer, Chat" },
                { name: "Git / CI",    type: "DevOps",     note: "GitHub, GitLab, Bitbucket, Pipelines" },
              ].map((row, i) => (
                <motion.tr key={row.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <td className="px-4 py-3"><InlineCode>{row.name}</InlineCode></td>
                  <td className="px-4 py-3 text-muted">{row.type}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{row.note}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="md:hidden space-y-3">
          {[
            { name: "PostgreSQL", type: "SQL", note: "Primäre Wahl für relationale Daten" },
            { name: "MongoDB", type: "NoSQL", note: "Dokumentenorientierte Strukturen" },
            { name: "REST APIs", type: "API", note: "Design, Versionierung, Dokumentation" },
          ].map((row) => (
            <div key={row.name} className="border border-border rounded p-4 bg-surface">
              <InlineCode>{row.name}</InlineCode>
              <p className="text-muted text-sm mt-1">{row.type} — {row.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <DocSubheading>Architekturmuster</DocSubheading>
        <TagList tags={["Layered Architecture", "Microservices", "Hexagonal Architecture", "Event-Driven", "Domain-Driven Design", "REST", "MVC"]} />
      </div>
    </div>
  );
}

// ─── Tab 2: Spieleentwicklung ─────────────────────────────────────────────────

const gameAreas = [
  {
    title: "Unreal Engine 5",
    meta: "C++ · Blueprint · GAS · Multiplayer",
    description:
      "Hauptplattform für professionelle Spieleentwicklung. Spezialisiert auf das Gameplay Ability System (GAS) für komplexe Charakter- und Fähigkeitssysteme, Multiplayer-Netzwerkarchitektur sowie Performance-Optimierung mit Nanite und Lumen.",
    tags: ["C++", "Blueprint Visual Scripting", "Gameplay Ability System", "Replication / Networking", "Nanite & Lumen", "Animation Blueprint", "AI / Behavior Trees"],
  },
  {
    title: "Unity",
    meta: "C# · Physics · Cinemachine",
    description:
      "Einsatz in kleineren Titeln, Game-Jam-Projekten und Prototypen. Gameplay-Logik in C#, physikbasierte Mechaniken sowie Kamera-Systeme mit Cinemachine.",
    tags: ["C#", "Unity Physics", "Cinemachine", "Animator Controller", "XR Toolkit", "UI Toolkit"],
  },
  {
    title: "Projektleitung (Games)",
    meta: "Scrum · Milestone-Planung · Team-Koordination",
    description:
      "Leitung von Spieleentwicklungsteams mit klarer Milestone-Struktur. Koordination zwischen Art, Design und Programmierung — von der Konzeptphase bis zum Release.",
    tags: ["Milestone-Planung", "Sprint-Reviews", "Backlog-Management", "Cross-Team-Kommunikation", "QA-Koordination"],
  },
  {
    title: "Version Control (Games)",
    meta: "Perforce · Git LFS · Diversion",
    description:
      "Professionelles Asset-Management für große Binärdateien. Perforce (P4) für AAA-Teams mit Tausenden von Assets, Git LFS für kleinere Studios, Diversion als moderne Alternative.",
    tags: ["Perforce (P4)", "Git LFS", "Diversion", "Branching-Strategien", "Asset-Locking"],
  },
];

function Spieleentwicklung() {
  return (
    <div className="space-y-10">
      {gameAreas.map((area, i) => (
        <motion.div key={area.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="border-l-2 border-brand pl-6">
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <span className="text-brand font-mono font-semibold text-base">{area.title}</span>
            <span className="text-xs text-muted font-mono">{area.meta}</span>
          </div>
          <DocText>{area.description}</DocText>
          <TagList tags={area.tags} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Tab 3: Software Engineering ─────────────────────────────────────────────

const langs = [
  { name: "Java",       cat: "Backend / Enterprise",   level: "Expert",         years: "> 8 Jahre" },
  { name: "TypeScript", cat: "Frontend / Backend",      level: "Expert",         years: "> 4 Jahre" },
  { name: "Python",     cat: "Scripting / KI / Data",  level: "Fortgeschritten",years: "> 5 Jahre" },
  { name: "C++",        cat: "Systems / Game Dev",      level: "Fortgeschritten",years: "> 4 Jahre" },
  { name: "C#",         cat: "Unity / .NET",            level: "Fortgeschritten",years: "> 3 Jahre" },
  { name: "C",          cat: "Systems / Embedded",      level: "Grundlagen",     years: "> 2 Jahre" },
];

function SoftwareEngineering() {
  return (
    <div className="space-y-8">
      <div>
        <DocHeading>Sprachen, Methodik & Architektur</DocHeading>
        <DocText>
          Solide Grundlagen in Algorithmen, Datenstrukturen und Softwarearchitektur —
          kombiniert mit mehrjähriger Erfahrung in agiler Projektleitung und Clean-Code-Prinzipien.
          Studium der Informatik an der Heinrich-Heine-Universität Düsseldorf.
        </DocText>
      </div>

      <div>
        <DocSubheading>Programmiersprachen</DocSubheading>
        <div className="hidden md:block overflow-hidden border border-border rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted font-medium w-32">Sprache</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted font-medium">Einsatzgebiet</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted font-medium w-40">Level</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted font-medium w-28">Erfahrung</th>
              </tr>
            </thead>
            <tbody>
              {langs.map((l, i) => (
                <motion.tr key={l.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <td className="px-4 py-3"><InlineCode>{l.name}</InlineCode></td>
                  <td className="px-4 py-3 text-muted">{l.cat}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{l.level}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs font-mono">{l.years}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3">
          {langs.map((l, i) => (
            <motion.div key={l.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border border-border rounded p-4 bg-surface">
              <InlineCode>{l.name}</InlineCode>
              <p className="text-muted text-sm mt-1">{l.cat}</p>
              <p className="text-zinc-500 text-xs font-mono mt-1">{l.level} · {l.years}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <DocSubheading>Architekturmuster</DocSubheading>
        <TagList tags={["Layered Architecture", "Hexagonal / Ports & Adapters", "Microservices", "Event-Driven Design", "Domain-Driven Design", "Clean Architecture", "MVC / MVVM"]} />
      </div>

      <div>
        <DocSubheading>Projektmanagement & Methodik</DocSubheading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {[
            { label: "Agile Methoden", items: ["Scrum", "Kanban", "Sprint-Planung", "Retrospektiven"] },
            { label: "Tools & Prozesse", items: ["Jira", "Linear", "Code Reviews", "Pair Programming"] },
            { label: "Qualitätssicherung", items: ["Unit Tests", "Integration Tests", "CI/CD-Pipelines", "Linting & Formatting"] },
            { label: "Dokumentation", items: ["OpenAPI / Swagger", "Confluence", "README-Driven Dev", "ADRs"] },
          ].map((group) => (
            <div key={group.label} className="border border-border rounded p-4 bg-surface">
              <p className="text-xs uppercase tracking-widest text-muted font-medium mb-3">{group.label}</p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-muted flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-brand/60 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: DevOps & Cloud ────────────────────────────────────────────────────

const devopsAreas = [
  {
    title: "Containerisierung",
    meta: "Docker · Docker Compose · Kubernetes",
    description: "Reproduzierbare Deployments mit Docker. Orchestrierung von Multi-Service-Setups via Compose für Entwicklung und Kubernetes für Produktion. Monitoring mit Portainer.",
    tags: ["Docker", "Docker Compose", "Kubernetes", "Portainer", "Container Registries"],
  },
  {
    title: "CI/CD Pipelines",
    meta: "Jenkins · GitHub Actions · GitLab CI",
    description: "Automatisierte Build-, Test- und Deploy-Pipelines. Konfiguration von Branch-Strategien, Staging-Umgebungen und automatischen Rollbacks bei fehlgeschlagenen Tests.",
    tags: ["Jenkins", "GitHub Actions", "GitLab CI", "Automated Testing", "Staging / Production Deploy", "Rollback-Strategien"],
  },
  {
    title: "Authentifizierung & Security",
    meta: "OAuth2 · Keycloak · JWT",
    description: "Sichere API-Gateways und Authentifizierungsflüsse. OAuth2 und OpenID Connect mit Keycloak als Identity Provider, GitHub OAuth für Entwickler-Tools.",
    tags: ["OAuth2", "OpenID Connect", "Keycloak", "GitHub OAuth", "JWT", "API-Gateway"],
  },
  {
    title: "Cloud & Infrastruktur",
    meta: "AWS · GCP · Linux",
    description: "Grundlagen in AWS (EC2, S3, RDS) und GCP. Linux-Server-Administration, Netzwerkkonfiguration und Deployment-Automatisierung auf Produktivservern.",
    tags: ["AWS (EC2, S3, RDS)", "GCP (Grundlagen)", "Ubuntu / Debian", "Nginx", "SSH & Netzwerk"],
  },
];

function DevOps() {
  return (
    <div className="space-y-10">
      {devopsAreas.map((area, i) => (
        <motion.div key={area.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="border-l-2 border-brand pl-6">
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <span className="text-brand font-mono font-semibold text-base">{area.title}</span>
            <span className="text-xs text-muted font-mono">{area.meta}</span>
          </div>
          <DocText>{area.description}</DocText>
          <TagList tags={area.tags} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Tab 5: KI & Architektur ──────────────────────────────────────────────────

const aiSteps = [
  {
    number: "01",
    title: "Problemanalyse & Datenstrategie",
    description:
      "Strukturierte Analyse der Anforderungen vor dem ersten Modell. Datenquellen identifizieren, Qualität bewerten, Bias erkennen und die Preprocessing-Pipeline sauber definieren — damit das Modell später auf solider Grundlage steht.",
    tags: ["Datenanalyse", "Feature Engineering", "Preprocessing", "Pandas / NumPy"],
  },
  {
    number: "02",
    title: "Modell-Auswahl & Training",
    description:
      "Bewusste Auswahl zwischen klassischem ML und Deep Learning je nach Datenmenge und Anforderung. Systematische Hyperparameter-Optimierung und Evaluation per Cross-Validation statt blindem Trial & Error.",
    tags: ["scikit-learn", "PyTorch", "Regression / Classification", "Cross-Validation", "Hyperparameter-Tuning"],
  },
  {
    number: "03",
    title: "Integration in Produktivsysteme",
    description:
      "KI-Modelle sind kein Selbstzweck — sie müssen in bestehende Systeme integriert werden. REST-Wrapper um Modelle, sodass Frontend und Backend nahtlos mit KI-Features erweitert werden können ohne den Stack zu komplizieren.",
    tags: ["REST-API-Wrapper", "Python-Microservice", "Model Serving", "Latenz-Optimierung"],
  },
  {
    number: "04",
    title: "Saubere Softwarearchitektur als Basis",
    description:
      "KI-Projekte scheitern oft an schlechter Basisarchitektur, nicht am Modell. Clean Architecture, klare Modul-Grenzen und testbarer Code sind Voraussetzung — dann erst das Modell obendrauf.",
    tags: ["Clean Architecture", "Testbarkeit", "Modulare Services", "Separation of Concerns"],
  },
  {
    number: "05",
    title: "Data Science & Analyse",
    description:
      "Datengetriebene Entscheidungen durch Visualisierung und statistische Analyse. Einsatz in realen Projekten zur Optimierung von Geschäftsprozessen und zur Erkennung von Mustern in komplexen Datensätzen.",
    tags: ["Matplotlib / Seaborn", "Statistische Analyse", "Jupyter Notebooks", "Reporting"],
  },
];

function KIArchitektur() {
  return (
    <div className="space-y-8">
      <div>
        <DocHeading>KI, Machine Learning & Systemdesign</DocHeading>
        <DocText>
          KI als Werkzeug, nicht als Buzzword — eingebettet in eine saubere Softwarearchitektur.
          Von der Datenanalyse über das Modell-Training bis zur nahtlosen Integration
          in produktive Backend-Systeme.
        </DocText>
      </div>

      <div className="space-y-6">
        {aiSteps.map((step, i) => (
          <motion.div key={step.number} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4">
            <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-0">
              <span className="text-2xl font-bold text-brand font-mono leading-none">{step.number}</span>
              <div className="flex-1 md:flex-none md:mt-4 md:w-px md:self-stretch md:bg-border" />
            </div>
            <div className="space-y-3 pb-2">
              <h4 className="text-fg font-semibold text-sm tracking-tight">{step.title}</h4>
              <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              <TagList tags={step.tags} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const tabs: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "webentwicklung",       label: "Webentwicklung",       Icon: Terminal },
  { id: "spieleentwicklung",    label: "Spieleentwicklung",    Icon: Terminal },
  { id: "software-engineering", label: "Software Engineering", Icon: Package  },
  { id: "devops",               label: "DevOps & Cloud",       Icon: Settings },
  { id: "ki-architektur",       label: "KI & Architektur",     Icon: Bot      },
];

function tabContent(id: TabId) {
  switch (id) {
    case "webentwicklung":       return <Webentwicklung />;
    case "spieleentwicklung":    return <Spieleentwicklung />;
    case "software-engineering": return <SoftwareEngineering />;
    case "devops":               return <DevOps />;
    case "ki-architektur":       return <KIArchitektur />;
  }
}

// ─── Tech-Stack Marquee ───────────────────────────────────────────────────────

type TechItem = { name: string; dot: string };

const row1: TechItem[] = [
  { name: "React",            dot: "bg-blue-400"   },
  { name: "TypeScript",       dot: "bg-blue-400"   },
  { name: "Unreal Engine 5",  dot: "bg-purple-400" },
  { name: "Java Spring Boot", dot: "bg-green-400"  },
  { name: "Python",           dot: "bg-yellow-400" },
  { name: "Node.js",          dot: "bg-green-400"  },
  { name: "Docker",           dot: "bg-teal-400"   },
  { name: "PostgreSQL",       dot: "bg-teal-400"   },
  { name: "Unity",            dot: "bg-purple-400" },
  { name: "C++",              dot: "bg-slate-400"  },
  { name: "TailwindCSS",      dot: "bg-blue-400"   },
  { name: "Git",              dot: "bg-orange-400" },
];
const row2: TechItem[] = [
  { name: "Vite",                       dot: "bg-purple-400" },
  { name: "REST APIs",                  dot: "bg-blue-400"   },
  { name: "WebGL",                      dot: "bg-teal-400"   },
  { name: "Figma",                      dot: "bg-pink-400"   },
  { name: "Linux",                      dot: "bg-slate-400"  },
  { name: "CI/CD",                      dot: "bg-orange-400" },
  { name: "GraphQL",                    dot: "bg-pink-400"   },
  { name: "Three.js",                   dot: "bg-teal-400"   },
  { name: "Blueprint Visual Scripting", dot: "bg-purple-400" },
  { name: "AWS",                        dot: "bg-orange-400" },
  { name: "MongoDB",                    dot: "bg-green-400"  },
  { name: "Redux",                      dot: "bg-purple-400" },
];

function TechBadge({ name, dot }: TechItem) {
  return (
    <div className="shrink-0 inline-flex items-center gap-2 px-4 py-2 border border-border bg-surface rounded-sm mx-3">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className="font-display text-sm text-fg/80 whitespace-nowrap">{name}</span>
    </div>
  );
}

const marqueeRow1 = [...row1, ...row1];
const marqueeRow2 = [...row2, ...row2];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Skills() {
  const [activeTab, setActiveTab] = useState<TabId>("webentwicklung");

  return (
    <section id="skills" className="swiss-section overflow-hidden">
      <div className="swiss-container">
        <SectionHeading eyebrow="Expertise" title="Meine Kernkompetenzen" className="mb-12" />

        {/* Tab bar */}
        <div className="relative mb-0 overflow-x-auto">
          <div className="flex min-w-max border-b border-border">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                    isActive ? "text-fg" : "text-muted hover:text-fg",
                  ].join(" ")}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="skills-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-px bg-brand"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="border border-t-0 border-border rounded-b bg-surface">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6 md:p-10"
            >
              {tabContent(activeTab)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tech-Stack marquee — full-width */}
      <div className="mt-16 pt-12 border-t border-border">
        <div className="swiss-container mb-8">
          <p className="swiss-eyebrow mb-3">Technologien &amp; Werkzeuge</p>
          <h3 className="font-display font-bold text-3xl md:text-4xl text-fg leading-tight">
            Mein Tech-Stack
          </h3>
          <p className="mt-3 text-muted text-base max-w-xl">
            Ein Überblick über die Technologien, mit denen ich täglich arbeite und Projekte umsetze.
          </p>
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display uppercase tracking-widest text-muted">Frameworks &amp; Sprachen</span>
              <span className="h-px w-8 bg-border" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-display uppercase tracking-widest text-muted">Tools &amp; Infrastruktur</span>
              <span className="h-px w-8 bg-border" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--sw-bg), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, var(--sw-bg), transparent)" }} />
          <div className="marquee-left">
            {marqueeRow1.map((item, i) => <TechBadge key={`r1-${item.name}-${i}`} {...item} />)}
          </div>
        </div>

        <div className="relative overflow-hidden mt-4">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--sw-bg), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, var(--sw-bg), transparent)" }} />
          <div className="marquee-right">
            {[...marqueeRow2].reverse().map((item, i) => <TechBadge key={`r2-${item.name}-${i}`} {...item} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
