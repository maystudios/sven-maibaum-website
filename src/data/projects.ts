export type ProjectTag = {
  label: string;
  className: string;
};

export type ProjectCard = {
  id: string;
  title: string;
  summary: string;
  tags: ProjectTag[];
  filters: string[];
  dataTags: string[];
  image: string;
  link?: string;
  route?: string;
  cta: string;
  accent: string;
  accentStyle?: string;
  buttonClass: string;
};

export const projectCards: ProjectCard[] = [
  {
    id: "heistline",
    title: "HeistLine",
    summary:
      "Prison-Escape & Heist MMO – wähle Cop oder Criminal, plane Überfälle, baue Basen und dominiere online.",
    tags: [
      { label: "Unreal Engine", className: "tech-tag tech-tag-purple" },
      { label: "Multiplayer", className: "tech-tag tech-tag-gray" },
      { label: "MMO", className: "tech-tag tech-tag-blue" },
    ],
    filters: ["unreal-engine"],
    dataTags: ["unreal-engine", "multiplayer", "heist"],
    image: `${import.meta.env.BASE_URL}assets/projects/heistline/VaultHeist.png`,
    route: "/projekte/heistline",
    cta: "Mehr anzeigen",
    accent: "text-purple-400",
    buttonClass:
      "inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition transform hover:scale-105 text-sm",
  },
  {
    id: "mrdork3",
    title: "Mr. Dork 3",
    summary:
      "One Last Doodle: Ein herausfordernder 2D-Platformer mit Puzzle-Elementen, Retro-Style und modernen Multiplayer-Modi.",
    tags: [
      { label: "Platformer", className: "tech-tag tech-tag-teal" },
      { label: "Unity", className: "tech-tag tech-tag-purple" },
      { label: "Multiplayer", className: "tech-tag tech-tag-blue" },
    ],
    filters: ["unity"],
    dataTags: ["unity", "unity", "platformer", "puzzle", "indie"],
    image: `${import.meta.env.BASE_URL}assets/projects/mrdork/mrdork3.png`,
    route: "/projekte/mr-dork-3",
    cta: "Mehr anzeigen",
    accent: "text-teal-400",
    buttonClass:
      "inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 text-sm",
  },
  {
    id: "itchio",
    title: "Game Jams & itch.io",
    summary:
      "Sammlung meiner Game-Jam-Projekte (z.B. Terrafix) und Rapid-Prototyping-Experimente.",
    tags: [
      { label: "itch.io", className: "tech-tag tech-tag-red" },
      { label: "Game Jam", className: "tech-tag tech-tag-orange" },
      { label: "Terrafix", className: "tech-tag tech-tag-green" },
    ],
    filters: ["unity"],
    dataTags: ["game-dev", "indie", "prototyping", "unity", "unreal-engine"],
    image: `${import.meta.env.BASE_URL}assets/projects/itchio/itchio.png`,
    route: "/projekte/itchio",
    cta: "Mehr anzeigen",
    accent: "text-red-400",
    buttonClass:
      "inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 text-sm",
  },
  {
    id: "liketik",
    title: "LikeTik",
    summary:
      "KI-gestützte Social Commerce Plattform. Automatisiertes Fulfillment und intelligente Produktempfehlungen für Creator & Brands.",
    tags: [
      { label: "Social Commerce", className: "tech-tag tech-tag-purple" },
      { label: "KI/ML", className: "tech-tag tech-tag-teal" },
      { label: "Java", className: "tech-tag tech-tag-pink" },
      { label: "Architecture", className: "tech-tag tech-tag-blue" },
    ],
    filters: ["ai-ml", "java"],
    dataTags: ["ai-ml", "social-commerce", "mobile-app", "web-dev", "architecture", "java"],
    image: `${import.meta.env.BASE_URL}assets/projects/liketik/liketik.png`,
    route: "/projekte/liketik",
    cta: "Mehr anzeigen",
    accent: "",
    accentStyle: "#8b5cf6",
    buttonClass:
      "inline-block bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 text-sm",
  },
  {
    id: "huggingface",
    title: "Hugging Face & AI Research",
    summary:
      "Mein Hub für optimierte KI-Modelle. Fokus auf Fine-Tuning von LLMs, Quantisierung und ONNX-Konvertierungen.",
    tags: [
      { label: "Hugging Face", className: "tech-tag tech-tag-yellow" },
      { label: "Fine-Tuning", className: "tech-tag tech-tag-teal" },
      { label: "ONNX", className: "tech-tag tech-tag-blue" },
    ],
    filters: ["ai-ml", "python"],
    dataTags: ["ai-ml", "python", "onnx", "quantization", "hugging-face"],
    image: "https://placehold.co/600x400/FFD21E/000000?text=Hugging+Face+Profil",
    link: "https://huggingface.co/Svenni551",
    cta: "Zum Profil",
    accent: "text-yellow-400",
    buttonClass:
      "inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 text-sm",
  },
  {
    id: "maxsimcli",
    title: "maxsimcli",
    summary:
      "Open-Source-CLI für KI-gestütztes Software-Engineering. Strukturierte Phasen, atomare Commits und spezialisierte Agent-Teams direkt im Terminal.",
    tags: [
      { label: "Open Source", className: "tech-tag tech-tag-teal" },
      { label: "Claude Code", className: "tech-tag tech-tag-purple" },
      { label: "Agentic Coding", className: "tech-tag tech-tag-blue" },
    ],
    filters: ["typescript", "ai-ml"],
    dataTags: ["cli", "typescript", "ai-ml", "open-source", "developer-tools"],
    image: `${import.meta.env.BASE_URL}assets/projects/maxsimcli/preview-v2.svg`,
    route: "/projekte/maxsimcli",
    cta: "Mehr anzeigen",
    accent: "text-blue-400",
    buttonClass:
      "inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 text-sm",
  },
  {
    id: "exambyte",
    title: "Exambyte",
    summary:
      "Web-basiertes Testsystem als ILIAS-Alternative für Programmierlabore.",
    tags: [
      { label: "Java", className: "tech-tag tech-tag-yellow" },
      { label: "Spring Boot", className: "tech-tag tech-tag-green" },
      { label: "PostgreSQL", className: "tech-tag tech-tag-blue" },
    ],
    filters: ["java"],
    dataTags: ["java", "spring-boot", "postgresql", "github-oauth"],
    image: "https://placehold.co/600x400/e5a935/1a202c?text=Exambyte+Testsystem",
    route: "/projekte/exambyte",
    cta: "Mehr anzeigen",
    accent: "text-yellow-400",
    buttonClass:
      "inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 text-sm",
  },
];

export const projectFilters = [
  { id: "all", label: "Alle" },
  { id: "unreal-engine", label: "Unreal Engine" },
  { id: "unity", label: "Unity" },
  { id: "ai-ml", label: "AI/ML" },
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "typescript", label: "TypeScript" },
];
