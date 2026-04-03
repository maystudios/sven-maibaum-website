import { motion } from "motion/react";
import SectionHeading from "../components/SectionHeading";
import { publications } from "../data/publications";
import { fadeInUp, staggerContainer, defaultViewport } from "../lib/animations";

function NetworkGraph() {
  // All layers centered around y=90 (midpoint of viewBox height 180)
  const mid = 90;
  const gap = 32; // vertical spacing between nodes
  const xPositions = [40, 110, 180, 250];
  const nodeCounts = [3, 5, 4, 2];

  const layers = nodeCounts.map((count, l) => {
    const startY = mid - ((count - 1) * gap) / 2;
    return Array.from({ length: count }, (_, i) => ({
      x: xPositions[l],
      y: startY + i * gap,
    }));
  });

  const connections: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    for (const from of layers[l]) {
      for (const to of layers[l + 1]) {
        connections.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
      }
    }
  }

  const labels = ["Input", "Hidden", "Hidden", "Output"];

  return (
    <svg
      viewBox="0 0 290 200"
      className="w-full max-w-[280px] mx-auto"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nodeGlow">
          <stop offset="0%" stopColor="var(--sw-accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--sw-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connections */}
      {connections.map((c, i) => (
        <line
          key={`c-${i}`}
          x1={c.x1}
          y1={c.y1}
          x2={c.x2}
          y2={c.y2}
          stroke="var(--sw-border)"
          strokeWidth="0.7"
          opacity="0.4"
        />
      ))}

      {/* Node glows */}
      {layers.flat().map((node, i) => (
        <circle
          key={`g-${i}`}
          cx={node.x}
          cy={node.y}
          r="14"
          fill="url(#nodeGlow)"
        />
      ))}

      {/* Nodes */}
      {layers.flat().map((node, i) => (
        <circle
          key={`n-${i}`}
          cx={node.x}
          cy={node.y}
          r="5.5"
          fill="var(--sw-accent)"
          opacity="0.8"
        />
      ))}

      {/* Layer labels */}
      {xPositions.map((x, i) => (
        <text
          key={`l-${i}`}
          x={x}
          y={190}
          textAnchor="middle"
          fontSize="8"
          fill="var(--sw-muted)"
          opacity="0.5"
          fontFamily="'Space Grotesk', sans-serif"
          letterSpacing="0.5"
        >
          {labels[i]}
        </text>
      ))}
    </svg>
  );
}

export default function Publications() {
  const pub = publications[0];

  return (
    <section id="publications" className="swiss-section">
      <div className="swiss-container">
        <SectionHeading
          eyebrow="Forschung"
          title="Publikationen"
          className="mb-12"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <motion.div
            variants={fadeInUp}
            className="grid md:grid-cols-[2fr_3fr] border border-border rounded-sm overflow-hidden hover:border-brand/30 transition-colors duration-300"
          >
            {/* Left: Document preview */}
            <div className="bg-surface flex flex-col items-center justify-center p-8 md:p-12 border-b md:border-b-0 md:border-r border-border">
              <NetworkGraph />
              <div className="mt-8 text-center">
                <p className="text-faint text-xs uppercase tracking-[0.15em] mb-1">
                  {pub.type}
                </p>
                <p className="text-muted text-sm">
                  {pub.pages} Seiten · {pub.year}
                </p>
              </div>
            </div>

            {/* Right: Content */}
            <div className="bg-canvas p-8 md:p-12 flex flex-col justify-center">
              <h3
                className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {pub.title}
              </h3>
              <p className="text-muted text-base md:text-lg leading-relaxed mb-6">
                {pub.subtitle}
              </p>
              <p className="text-muted text-sm leading-relaxed mb-8">
                {pub.abstract}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {pub.tags.map((tag) => (
                  <span key={tag.label} className={tag.className}>
                    {tag.label}
                  </span>
                ))}
              </div>

              <a
                href={pub.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="swiss-btn-primary w-fit inline-flex items-center gap-2"
              >
                Arbeit lesen
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
