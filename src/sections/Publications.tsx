import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import SectionHeading from "../components/SectionHeading";
import { publications } from "../data/publications";
import { fadeInUp, staggerContainer, defaultViewport } from "../lib/animations";

// ─── Neural network simulation ──────────────────────────────────────────────

const TOPOLOGY = [3, 5, 4, 2];
const X_POSITIONS = [40, 120, 200, 280];
const MID_Y = 95;
const GAP_Y = 30;
const CYCLE_MS = 6000; // one full forward pass

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function buildLayers() {
  return TOPOLOGY.map((count, l) => {
    const startY = MID_Y - ((count - 1) * GAP_Y) / 2;
    return Array.from({ length: count }, (_, i) => ({
      x: X_POSITIONS[l],
      y: startY + i * GAP_Y,
    }));
  });
}

type NetworkParams = {
  weights: number[][][]; // weights[layer][fromNode][toNode]
  biases: number[][];    // biases[layer][node] (layers 1..n, index 0 = first hidden)
};

function initParams(): NetworkParams {
  const weights: number[][][] = [];
  const biases: number[][] = [];
  for (let l = 0; l < TOPOLOGY.length - 1; l++) {
    // Xavier-ish initialization: scale by 1/sqrt(fan_in)
    const scale = 1 / Math.sqrt(TOPOLOGY[l]);
    weights[l] = [];
    for (let i = 0; i < TOPOLOGY[l]; i++) {
      weights[l][i] = [];
      for (let j = 0; j < TOPOLOGY[l + 1]; j++) {
        weights[l][i][j] = (Math.random() * 2 - 1) * scale * 2.5;
      }
    }
    // Bias per neuron in the target layer
    biases[l] = Array.from({ length: TOPOLOGY[l + 1] }, () => (Math.random() - 0.5) * 0.5);
  }
  return { weights, biases };
}

/** Full forward pass: a_j = σ( Σᵢ(aᵢ · wᵢⱼ) + bⱼ ) */
function forwardPass(inputs: number[], params: NetworkParams) {
  const activations: number[][] = [inputs];
  let current = inputs;
  for (let l = 0; l < params.weights.length; l++) {
    const next: number[] = [];
    for (let j = 0; j < TOPOLOGY[l + 1]; j++) {
      // Weighted sum: z = Σ(aᵢ · wᵢⱼ)
      let z = 0;
      for (let i = 0; i < current.length; i++) {
        z += current[i] * params.weights[l][i][j];
      }
      // Add bias: z += bⱼ
      z += params.biases[l][j];
      // Activation function: a = σ(z)
      next.push(sigmoid(z));
    }
    activations.push(next);
    current = next;
  }
  return activations;
}

// Layer colors: input=green, hidden=blue, output=red, winner=purple
const LAYER_COLORS = ["#22c55e", "#3b82f6", "#3b82f6", "#ef4444"];
const LAYER_COLORS_DIM = ["#166534", "#1e3a5f", "#1e3a5f", "#7f1d1d"];
const WINNER_COLOR = "#a855f7";
const WINNER_COLOR_DIM = "#581c87";
const LABELS = ["Input", "Hidden", "Hidden", "Output"];

function NetworkGraph() {
  const layers = buildLayers();
  const [activations, setActivations] = useState<number[][]>(() => TOPOLOGY.map((c) => Array(c).fill(0)));
  // Absolute weights for render — updated in the animation loop, not via ref
  const [absWeights, setAbsWeights] = useState<number[][][]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    let running = true;
    let params = initParams();
    let inputs = Array.from({ length: TOPOLOGY[0] }, () => Math.random());
    let prevCycle = 0;
    let weightsChanged = true;
    const start = performance.now();

    function tick() {
      if (!running) return;
      const elapsed = performance.now() - start;
      const cyclePos = (elapsed % CYCLE_MS) / CYCLE_MS;

      // Detect cycle wrap-around: previous was near end, current is near start
      if (cyclePos < 0.05 && prevCycle > 0.85) {
        params = initParams();
        inputs = Array.from({ length: TOPOLOGY[0] }, () => Math.random());
        weightsChanged = true;
      }
      prevCycle = cyclePos;

      if (weightsChanged) {
        weightsChanged = false;
        setAbsWeights(params.weights.map((layer) => layer.map((row) => row.map(Math.abs))));
      }

      // Full forward pass: a_j = sigmoid( sum(a_i * w_ij) + b_j )
      const fullAct = forwardPass(inputs, params);

      // Quintic ease-in-out: smoother than smoothstep, no harsh starts/stops
      const ease5 = (t: number) => {
        if (t < 0.5) return 16 * t * t * t * t * t;
        const u = 1 - t;
        return 1 - 16 * u * u * u * u * u;
      };

      // Phase layout with overlap and hold:
      //   0.00–0.15  Input eases in
      //   0.08–0.30  Hidden 1 eases in
      //   0.22–0.48  Hidden 2 eases in
      //   0.38–0.62  Output eases in
      //   0.62–0.78  Hold (everything fully lit)
      //   0.78–1.00  Global fade-out
      const layerStarts = [0.0, 0.08, 0.22, 0.38];
      const layerEnds   = [0.15, 0.30, 0.48, 0.62];

      // Global fade-out in the last ~22% of the cycle
      const fadeOut = cyclePos > 0.78
        ? 1 - ease5((cyclePos - 0.78) / 0.22)
        : 1;

      const visible = fullAct.map((layer, l) => {
        const t = Math.max(0, Math.min(1,
          (cyclePos - layerStarts[l]) / (layerEnds[l] - layerStarts[l])
        ));
        const layerEase = ease5(t) * fadeOut;
        return layer.map((a) => a * layerEase);
      });

      setActivations(visible);
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Build connection data with activation info
  const connections: {
    x1: number; y1: number; x2: number; y2: number;
    fromLayer: number; fromIdx: number; toIdx: number;
  }[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    for (let i = 0; i < layers[l].length; i++) {
      for (let j = 0; j < layers[l + 1].length; j++) {
        connections.push({
          x1: layers[l][i].x, y1: layers[l][i].y,
          x2: layers[l + 1][j].x, y2: layers[l + 1][j].y,
          fromLayer: l, fromIdx: i, toIdx: j,
        });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 320 210"
      className="w-full max-w-[300px] mx-auto"
      aria-hidden="true"
    >
      {/* Connections — color matches the connection group:
           Input→Hidden1 = green, Hidden→Hidden = blue, Hidden2→Output = red */}
      {connections.map((c, i) => {
        const srcAct = activations[c.fromLayer]?.[c.fromIdx] ?? 0;
        const w = absWeights[c.fromLayer]?.[c.fromIdx]?.[c.toIdx] ?? 0;
        const strength = Math.min(1, srcAct * w * 1.2);
        // Synapse color by connection group
        const synapseColors = ["#22c55e", "#3b82f6", "#ef4444"];
        const synapseColor = synapseColors[c.fromLayer];
        const baseOpacity = 0.08;
        const activeOpacity = baseOpacity + strength * 0.55;
        // Line length for stroke-dash draw effect
        const len = Math.sqrt((c.x2 - c.x1) ** 2 + (c.y2 - c.y1) ** 2);
        const dashOffset = len * (1 - strength);
        return (
          <line
            key={`c-${i}`}
            x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
            stroke={strength > 0.1 ? synapseColor : "var(--sw-border)"}
            strokeWidth={0.6 + strength * 1.4}
            opacity={activeOpacity}
            strokeDasharray={len}
            strokeDashoffset={dashOffset}
            style={{ transition: "opacity 0.5s cubic-bezier(.4,0,.2,1), stroke 0.5s cubic-bezier(.4,0,.2,1), stroke-width 0.5s cubic-bezier(.4,0,.2,1), stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1)" }}
          />
        );
      })}

      {/* Nodes per layer */}
      {layers.map((layer, l) => {
        // Find winning output neuron (highest activation in last layer)
        const outputLayer = TOPOLOGY.length - 1;
        const outputActs = activations[outputLayer] ?? [];
        const winnerIdx = l === outputLayer && outputActs.some((a) => a > 0.05)
          ? outputActs.indexOf(Math.max(...outputActs))
          : -1;

        return layer.map((node, i) => {
          const act = activations[l]?.[i] ?? 0;
          const isWinner = l === outputLayer && i === winnerIdx;
          const color = isWinner ? WINNER_COLOR : LAYER_COLORS[l];
          const colorDim = isWinner ? WINNER_COLOR_DIM : LAYER_COLORS_DIM[l];
          const nodeR = isWinner ? 7 : 6;
          const glowR = (isWinner ? 16 : 12) + act * 8;
          return (
            <g key={`n-${l}-${i}`}>
              {/* Glow */}
              <circle
                cx={node.x} cy={node.y} r={glowR}
                fill={color}
                opacity={act * (isWinner ? 0.4 : 0.25)}
                style={{ transition: "r 0.6s cubic-bezier(.4,0,.2,1), opacity 0.6s cubic-bezier(.4,0,.2,1)" }}
              />
              {/* Node body */}
              <circle
                cx={node.x} cy={node.y} r={nodeR}
                fill={act > 0.1 ? color : colorDim}
                opacity={0.3 + act * 0.7}
                style={{ transition: "fill 0.6s cubic-bezier(.4,0,.2,1), opacity 0.6s cubic-bezier(.4,0,.2,1)" }}
              />
              {/* Bright center */}
              <circle
                cx={node.x} cy={node.y} r={2 + act * (isWinner ? 3 : 2)}
                fill="#fff"
                opacity={act * (isWinner ? 0.85 : 0.6)}
                style={{ transition: "r 0.6s cubic-bezier(.4,0,.2,1), opacity 0.6s cubic-bezier(.4,0,.2,1)" }}
              />
            </g>
          );
        });
      })}

      {/* Layer labels */}
      {X_POSITIONS.map((x, i) => (
        <text
          key={`l-${i}`}
          x={x} y={200}
          textAnchor="middle"
          fontSize="8"
          fill={LAYER_COLORS[i]}
          opacity="0.5"
          fontFamily="'Space Grotesk', sans-serif"
          letterSpacing="0.5"
        >
          {LABELS[i]}
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
