export type PublicationTag = {
  label: string;
  className: string;
};

export type Publication = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  year: number;
  abstract: string;
  tags: PublicationTag[];
  pdfUrl: string;
  pages: number;
};

export const publications: Publication[] = [
  {
    id: "neurale-netze",
    title: "Neurale Netze",
    subtitle:
      "Künstliche Intelligenz zur Bilderkennung am Beispiel von Obst mithilfe von paralleler Programmierung auf Basis von Grafikarten",
    type: "Facharbeit · Informatik (Abitur)",
    year: 2024,
    abstract:
      "Konstruktion eines vollständig eigenständigen Convolutional Neural Networks zur Bilderkennung. Die Arbeit behandelt die Theorie biologischer Neuronen, Netzarchitekturen (Perceptron, Feed Forward, CNN) und Lernverfahren (Forward Propagation, Backpropagation) sowie die praktische Implementierung mit GPU-Parallelisierung und Tensor-Core-Optimierung.",
    tags: [
      { label: "Neural Networks", className: "tech-tag tech-tag-purple" },
      { label: "CNN", className: "tech-tag tech-tag-blue" },
      { label: "GPU Computing", className: "tech-tag tech-tag-green" },
      { label: "Bilderkennung", className: "tech-tag tech-tag-teal" },
      { label: "Tensor Cores", className: "tech-tag tech-tag-orange" },
    ],
    pdfUrl: `${import.meta.env.BASE_URL}assets/publications/Sven_Fredrik_Maibaum_Abschlussarbeit_ABI_Informatik__Neurale_Netze.pdf`,
    pages: 45,
  },
];
