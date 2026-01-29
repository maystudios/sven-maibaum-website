const experiences = [
  {
    badge: "LT",
    title: "Leitender Software-Architekt",
    company: "LikeTik by Axinity (Teilzeit)",
    timeframe: "März 2025 – Heute",
    detail:
      "Verantwortlich für Software-Projektleitung und die Konzeption sowie Implementierung skalierbarer Web-Architekturen in innovativen Software-Engineering Projekten.",
    badgeClass: "bg-teal-500/20 text-teal-400",
    titleClass: "text-teal-400",
  },
  {
    badge: "EG",
    title: "Leitender Spieleentwickler",
    company: "Emotions Gaming (Teilzeit)",
    timeframe: "Okt. 2024 – Heute",
    detail:
      "Führende Rolle in der Entwicklung kreativer und technisch anspruchsvoller Spiele, u.a. für das Open-World-Multiplayer-Projekt \"The Prisonbreak\". Einsatz von Perforce und Unreal Engine.",
    badgeClass: "bg-purple-500/20 text-purple-400",
    titleClass: "text-purple-400",
  },
  {
    badge: "MS",
    title: "Unternehmensinhaber & Entwickler",
    company: "MayStudios (Freiberuflich)",
    timeframe: "Juni 2023 – Heute (Gründer)",
    detail:
      "Data Scientist & Full-Stack Developer mit über 6 Jahren Erfahrung. Spezialisiert auf Backend-Systeme mit Spring Boot/Framework und datengetriebene Lösungen.",
    badgeClass: "bg-orange-500/20 text-orange-400",
    titleClass: "",
    titleStyle: "#dd6b20",
  },
  {
    badge: "P",
    title: "Spieleentwickler",
    company: "Phantomedia (Vollzeit)",
    timeframe: "März 2024 – Juli 2024 (5 Monate)",
    detail:
      "Mitwirkung an der Entwicklung von Spielen unter Verwendung von Perforce und Unreal Engine, Fokus auf Gameplay-Mechaniken und Systemintegration.",
    badgeClass: "bg-gray-500/20 text-gray-400",
    titleClass: "",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section-padding fade-in-up">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="gradient-text">Berufserfahrung</span>
        </h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          {experiences.map((experience) => (
            <div
              key={experience.title}
              className="glassmorphism p-6 rounded-lg shadow-lg flex items-start space-x-4 experience-card"
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                  experience.badgeClass
                }`}
                aria-hidden="true"
              >
                {experience.badge}
              </div>
              <div>
                <h3
                  className={`text-xl font-semibold ${experience.titleClass}`.trim()}
                  style={experience.titleStyle ? { color: experience.titleStyle } : undefined}
                >
                  {experience.title}
                </h3>
                <p>{experience.company}</p>
                <p className="text-sm">{experience.timeframe}</p>
                <p className="mt-2 text-sm">{experience.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
