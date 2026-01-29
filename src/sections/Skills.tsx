export default function Skills() {
  return (
    <section id="skills" className="section-padding fade-in-up">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="gradient-text">Meine Kernkompetenzen</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glassmorphism p-6 rounded-lg shadow-lg skill-card">
            <div className="flex items-center mb-4">
              <svg className="w-10 h-10 text-teal-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                ></path>
              </svg>
              <h3 className="text-xl font-semibold text-teal-400">Webentwicklung & Architektur</h3>
            </div>
            <ul className="space-y-1 text-sm list-disc list-inside">
              <li>HTML5, CSS3 (Tailwind CSS, Bootstrap), JavaScript (ES6+)</li>
              <li>Frontend: React, Thymeleaf</li>
              <li>Backend: Node, Spring Boot, NestJS, NextJS, Python</li>
              <li>Architektur: Layered Architecture, Microservices</li>
              <li>Full-Stack & Backend Development (&gt;8 Jahre Erf.)</li>
              <li>Datenbanken: SQL (PostgreSQL, ...), NoSQL (MongoDB)</li>
              <li>APIs: RESTful APIs, GraphQL (Grundlagen), WebSockets</li>
              <li>Version Control: Git, GitHub, GitLab, Bitbucket</li>
            </ul>
          </div>
          <div className="glassmorphism p-6 rounded-lg shadow-lg skill-card">
            <div className="flex items-center mb-4">
              <svg className="w-10 h-10 text-purple-400 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
                />
              </svg>
              <h3 className="text-xl font-semibold text-purple-400">Spieleentwicklung</h3>
            </div>
            <ul className="space-y-1 text-sm list-disc list-inside">
              <li>Game Engines: Unreal Engine, Unity</li>
              <li>Programmiersprachen: C++, Java, Python, C# (Unity)</li>
              <li>Version Control: Perforce, Git(+lsf), Diversion</li>
              <li>Multiplayer-Entwicklung & Netzwerktechnik</li>
              <li>Gameplay-Mechaniken (GAS) & Systemdesign</li>
              <li>Game-Projektleitung</li>
            </ul>
          </div>
          <div className="glassmorphism p-6 rounded-lg shadow-lg skill-card">
            <div className="flex items-center mb-4">
              <svg className="w-10 h-10 mr-3" style={{ color: "#dd6b20" }} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <h3 className="text-xl font-semibold" style={{ color: "#dd6b20" }}>
                Software Engineering & KI
              </h3>
            </div>
            <ul className="space-y-1 text-sm list-disc list-inside">
              <li>Programmiersprachen: Java, Python, C, C#, C++</li>
              <li>Version Control: Perforce, Git (+lsf), GitHub, GitLab,</li>
              <li>Software-Projektleitung & Agile Methoden</li>
              <li>KI & Machine Learning</li>
              <li>Authentifizierung: GitHub OAuth, OAuth2, keycloak</li>
              <li>Deployment: Docker, Kubernetes, Portainer, Jenkins</li>
              <li>Data Science & Analyse</li>
              <li>Cloud Computing (AWS/GCP Grundlagen)</li>
              <li>Grundlagen: Informatik, Mathematik, Algorithmen</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
