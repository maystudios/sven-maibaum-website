import {
  LAYER_COLORS,
  LAYER_COLORS_DIM,
  LAYER_LABELS,
  SYNAPSE_COLORS,
  WINNER_COLOR,
  WINNER_COLOR_DIM,
  buildConnections,
} from "../lib/neuralNetwork";
import type { NetworkNode } from "../lib/neuralNetwork";

type NetworkSvgProps = {
  layers: NetworkNode[][];
  /** Visible activation per node (already multiplied by the layer draw-in). */
  activations: number[][];
  absWeights: number[][][];
  /** Per-layer draw-in of the outgoing synapses, 0..1. */
  drawProgress: number[];
  /** Global brightness, 0..1. */
  fadeAlpha: number;
  viewBox: string;
  className?: string;
  labelY: number;
  labelFont?: string;
};

/** Renders the forward pass of the small network: synapses draw in, nodes glow with their activation. */
export default function NetworkSvg({
  layers,
  activations,
  absWeights,
  drawProgress,
  fadeAlpha,
  viewBox,
  className,
  labelY,
  labelFont = "'Space Grotesk', sans-serif",
}: NetworkSvgProps) {
  // Build connection data with activation info
  const connections = buildConnections(layers);

  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true">
      {/* Connections — color matches the connection group:
           Input→Hidden1 = green, Hidden→Hidden = blue, Hidden2→Output = red */}
      {connections.map((c, i) => {
        const srcAct = activations[c.fromLayer]?.[c.fromIdx] ?? 0;
        const w = absWeights[c.fromLayer]?.[c.fromIdx]?.[c.toIdx] ?? 0;
        const strength = Math.min(1, srcAct * w * 1.2);
        const synapseColor = SYNAPSE_COLORS[c.fromLayer];
        // Draw-in from source to target (never reverses)
        const len = Math.sqrt((c.x2 - c.x1) ** 2 + (c.y2 - c.y1) ** 2);
        const draw = drawProgress[c.fromLayer] ?? 0;
        const dashOffset = len * (1 - draw);
        // Base dim line + activation-driven brightness
        const activeOpacity = 0.03 + strength * 0.55 * fadeAlpha;
        return (
          <line
            key={`c-${i}`}
            x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
            stroke={strength > 0.1 ? synapseColor : "var(--sw-border)"}
            strokeWidth={0.6 + strength * 1.4}
            opacity={activeOpacity}
            strokeDasharray={len}
            strokeDashoffset={dashOffset}
          />
        );
      })}

      {/* Nodes per layer */}
      {layers.map((layer, l) => {
        // Find winning output neuron (highest activation in last layer)
        const outputLayer = layers.length - 1;
        const outputActs = activations[outputLayer] ?? [];
        const winnerIdx = l === outputLayer && outputActs.some((a) => a > 0.05)
          ? outputActs.indexOf(Math.max(...outputActs))
          : -1;

        return layer.map((node, i) => {
          const act = activations[l]?.[i] ?? 0;
          const displayAct = act * fadeAlpha; // combines activation + fade
          const isWinner = l === outputLayer && i === winnerIdx;
          const color = isWinner ? WINNER_COLOR : LAYER_COLORS[l];
          const colorDim = isWinner ? WINNER_COLOR_DIM : LAYER_COLORS_DIM[l];
          const nodeR = isWinner ? 7 : 6;
          const glowR = (isWinner ? 18 : 12) + displayAct * 8;
          return (
            <g key={`n-${l}-${i}`}>
              {/* Glow — only when active */}
              <circle
                cx={node.x} cy={node.y} r={glowR}
                fill={color}
                opacity={displayAct * (isWinner ? 0.45 : 0.25)}
              />
              {/* Node body — base always visible, activation adds brightness */}
              <circle
                cx={node.x} cy={node.y} r={nodeR}
                fill={displayAct > 0.1 ? color : colorDim}
                opacity={0.2 + displayAct * 0.7}
              />
              {/* Bright center — only when active */}
              <circle
                cx={node.x} cy={node.y} r={2 + displayAct * (isWinner ? 3 : 2)}
                fill="#fff"
                opacity={displayAct * (isWinner ? 0.85 : 0.6)}
              />
            </g>
          );
        });
      })}

      {/* Layer labels */}
      {layers.map((layer, i) => (
        <text
          key={`l-${i}`}
          x={layer[0]?.x ?? 0} y={labelY}
          textAnchor="middle"
          fontSize="8"
          fill={LAYER_COLORS[i]}
          opacity="0.5"
          fontFamily={labelFont}
          letterSpacing="0.5"
        >
          {LAYER_LABELS[i]}
        </text>
      ))}
    </svg>
  );
}
