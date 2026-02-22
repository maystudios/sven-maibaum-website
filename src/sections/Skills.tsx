import { motion } from "motion/react";
import { staggerContainer, cardVariant } from "../lib/animations";
import SectionHeading from "../components/SectionHeading";

type SkillCategory = {
  number: string;
  title: string;
  skills: string[];
};

const categories: SkillCategory[] = [
  {
    number: "01",
    title: "Webentwicklung & Architektur",
    skills: [
      "HTML5, CSS3 (Tailwind CSS, Bootstrap), JavaScript (ES6+)",
      "Frontend: React, Thymeleaf",
      "Backend: Node, Spring Boot, NestJS, NextJS, Python",
      "Architektur: Layered Architecture, Microservices",
      "Full-Stack & Backend Development (>8 Jahre Erf.)",
      "Datenbanken: SQL (PostgreSQL, ...), NoSQL (MongoDB)",
      "APIs: RESTful APIs, GraphQL (Grundlagen), WebSockets",
      "Version Control: Git, GitHub, GitLab, Bitbucket",
    ],
  },
  {
    number: "02",
    title: "Spieleentwicklung",
    skills: [
      "Game Engines: Unreal Engine, Unity",
      "Programmiersprachen: C++, Java, Python, C# (Unity)",
      "Version Control: Perforce, Git(+lsf), Diversion",
      "Multiplayer-Entwicklung & Netzwerktechnik",
      "Gameplay-Mechaniken (GAS) & Systemdesign",
      "Game-Projektleitung",
    ],
  },
  {
    number: "03",
    title: "Software Engineering & KI",
    skills: [
      "Programmiersprachen: Java, Python, C, C#, C++",
      "Version Control: Perforce, Git (+lsf), GitHub, GitLab",
      "Software-Projektleitung & Agile Methoden",
      "KI & Machine Learning",
      "Authentifizierung: GitHub OAuth, OAuth2, Keycloak",
      "Deployment: Docker, Kubernetes, Portainer, Jenkins",
      "Data Science & Analyse",
      "Cloud Computing (AWS/GCP Grundlagen)",
      "Grundlagen: Informatik, Mathematik, Algorithmen",
    ],
  },
];


const row1Skills = [
  { name: "React", color: "tech-tag-blue" },
  { name: "TypeScript", color: "tech-tag-blue" },
  { name: "Unreal Engine 5", color: "tech-tag-purple" },
  { name: "Java Spring Boot", color: "tech-tag-green" },
  { name: "Python", color: "tech-tag-yellow" },
  { name: "Node.js", color: "tech-tag-green" },
  { name: "Docker", color: "tech-tag-teal" },
  { name: "PostgreSQL", color: "tech-tag-teal" },
  { name: "Unity", color: "tech-tag-purple" },
  { name: "C++", color: "tech-tag-gray" },
  { name: "TailwindCSS", color: "tech-tag-blue" },
  { name: "Git", color: "tech-tag-orange" },
];
const row2Skills = [
  { name: "Vite", color: "tech-tag-purple" },
  { name: "REST APIs", color: "tech-tag-blue" },
  { name: "WebGL", color: "tech-tag-teal" },
  { name: "Figma", color: "tech-tag-pink" },
  { name: "Linux", color: "tech-tag-gray" },
  { name: "CI/CD", color: "tech-tag-orange" },
  { name: "GraphQL", color: "tech-tag-pink" },
  { name: "Three.js", color: "tech-tag-teal" },
  { name: "Blueprint Visual Scripting", color: "tech-tag-purple" },
  { name: "AWS", color: "tech-tag-orange" },
  { name: "MongoDB", color: "tech-tag-green" },
  { name: "Redux", color: "tech-tag-purple" },
];

export default function Skills() {
  return (
    <section id="skills" className="swiss-section--surface swiss-section">
      <div className="swiss-container">
        <SectionHeading eyebrow="Expertise" title="Meine Kernkompetenzen" className="mb-12" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-surface2"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.number}
              variants={cardVariant}
              className="bg-surface p-8"
            >
              <span className="text-brand font-display text-sm font-bold tracking-wider">
                {cat.number}
              </span>
              <h3 className="font-display font-semibold text-fg mt-2 mb-4">
                {cat.title}
              </h3>
              <ul className="space-y-2">
                {cat.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm text-muted flex items-start gap-2"
                  >
                    <span className="w-1 h-1 bg-brand/60 rounded-full mt-2 shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Marquee Skills Section */}
        <div className="mt-16 pt-12 border-t border-border">
          <p className="swiss-eyebrow text-center mb-8">Technologien &amp; Werkzeuge</p>
          <div
            className="overflow-hidden"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
            }}
          >
            {/* Row 1: scrolls left */}
            <div className="flex gap-3 mb-3">
              <div className="flex gap-3 animate-marquee whitespace-nowrap">
                {[...row1Skills, ...row1Skills].map((skill, i) => (
                  <span key={i} className={`tech-tag ${skill.color} px-3 py-1 text-xs font-medium`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
            {/* Row 2: scrolls right */}
            <div className="flex gap-3">
              <div className="flex gap-3 animate-marquee-reverse whitespace-nowrap">
                {[...row2Skills, ...row2Skills].map((skill, i) => (
                  <span key={i} className={`tech-tag ${skill.color} px-3 py-1 text-xs font-medium`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
