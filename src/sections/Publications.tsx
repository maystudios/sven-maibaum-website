import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import SectionHeading from "../components/SectionHeading";
import { publications } from "../data/publications";
import { fadeInUp, staggerContainer, defaultViewport } from "../lib/animations";
import NetworkSvg from "../components/NetworkSvg";
import {
  buildLayers,
  cosEase,
  forwardPass,
  initParams,
  layerDraw,
} from "../lib/neuralNetwork";
import type { NetworkParams } from "../lib/neuralNetwork";

// ─── Neural network simulation ──────────────────────────────────────────────

const TOPOLOGY = [3, 5, 4, 2];
const X_POSITIONS = [40, 120, 200, 280];
const MID_Y = 95;
const GAP_Y = 30;
const CYCLE_MS = 12000; // one full forward pass

function NetworkGraph() {
  const layers = buildLayers(TOPOLOGY, X_POSITIONS, MID_Y, GAP_Y);
  const [activations, setActivations] = useState<number[][]>(() => TOPOLOGY.map((c) => Array(c).fill(0)));
  const [absWeights, setAbsWeights] = useState<number[][][]>([]);
  // drawProgress[l]: 0→1 per layer, never reverses (controls synapse draw-in)
  const [drawProgress, setDrawProgress] = useState<number[]>(() => Array(TOPOLOGY.length).fill(0));
  const [fadeAlpha, setFadeAlpha] = useState(0);
  const frameRef = useRef(0);

  const simRef = useRef({
    params: null as NetworkParams | null,
    inputs: null as number[] | null,
    prevCycle: 0,
    start: 0,
  });

  useEffect(() => {
    let running = true;
    const sim = simRef.current;

    // Weights are generated ONCE and never change
    if (!sim.params) {
      sim.params = initParams(TOPOLOGY);
      sim.inputs = Array.from({ length: TOPOLOGY[0] }, () => Math.random());
      sim.start = performance.now();
    }

    let needsWeightSync = true;

    // Continuous wave: waveX travels from first to last layer x-position
    const xMin = X_POSITIONS[0];
    const xMax = X_POSITIONS[X_POSITIONS.length - 1];
    const xRange = xMax - xMin;
    const spread = xRange * 0.4; // wide spread for flowing overlap between layers

    function tick() {
      if (!running) return;
      const elapsed = performance.now() - sim.start;
      const cyclePos = (elapsed % CYCLE_MS) / CYCLE_MS;

      // New inputs at cycle boundary
      if (cyclePos < 0.03 && sim.prevCycle > 0.95) {
        sim.inputs = Array.from({ length: TOPOLOGY[0] }, () => Math.random());
      }
      sim.prevCycle = cyclePos;

      if (needsWeightSync) {
        needsWeightSync = false;
        setAbsWeights(sim.params!.weights.map((layer) => layer.map((row) => row.map(Math.abs))));
      }

      const fullAct = forwardPass(TOPOLOGY, sim.inputs!, sim.params!);

      // Timeline:
      //   0.00–0.10  Ramp globalFade 0→1 (gentle start from idle)
      //   0.00–0.70  Wave sweeps left→right (cosine eased, overlaps with ramp)
      //   0.70–0.80  Hold at full brightness
      //   0.80–0.96  Fade 1→0 (back to dim idle state)
      //   0.96–1.00  Idle baseline, new inputs arrive

      // Wave front position (cosine ease-in-out)
      let waveX: number;
      if (cyclePos < 0.70) {
        const wt = cosEase(cyclePos / 0.70);
        waveX = (xMin - spread) + (xRange + spread * 2) * wt;
      } else {
        waveX = xMax + spread;
      }

      // Per-layer draw: smooth activation as wave passes each layer
      const draw = layerDraw(X_POSITIONS, waveX, spread);

      // Global fade: cosine ease for smooth ramp-in and fade-out
      let globalFade: number;
      if (cyclePos < 0.10) {
        globalFade = cosEase(cyclePos / 0.10);
      } else if (cyclePos < 0.80) {
        globalFade = 1;
      } else if (cyclePos < 0.96) {
        globalFade = 1 - cosEase((cyclePos - 0.80) / 0.16);
      } else {
        globalFade = 0;
      }

      // Activations reflect wave draw-in only (fade is applied uniformly in render)
      const visible = fullAct.map((layer, l) =>
        layer.map((a) => a * draw[l])
      );

      setActivations(visible);
      setDrawProgress(draw);
      setFadeAlpha(globalFade);
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <NetworkSvg
      layers={layers}
      activations={activations}
      absWeights={absWeights}
      drawProgress={drawProgress}
      fadeAlpha={fadeAlpha}
      viewBox="0 0 320 210"
      className="w-full max-w-[300px] mx-auto"
      labelY={200}
    />
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
