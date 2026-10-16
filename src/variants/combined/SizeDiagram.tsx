import { boundsAt, sizeLinks, sizeNodes, sizeRegions } from "./sizeModel";
import type { NodeKind } from "./sizeModel";

const LEVEL_COLORS = ["#eab308", "#22c55e", "#22d3ee", "#a855f7", "#a855f7"];

type SizeDiagramProps = {
  level: number;
};

function Shape({ kind, x, y, stroke }: { kind: NodeKind; x: number; y: number; stroke: string }) {
  // Stroke widths are screen pixels (non-scaling stroke), independent of the zoom per level
  const common = { fill: "var(--sw-surface)", stroke, strokeWidth: 1.5, vectorEffect: "non-scaling-stroke" as const };
  switch (kind) {
    case "db":
      return <circle cx={x} cy={y} r={0.32} {...common} />;
    case "queue":
      return <rect x={x - 0.6} y={y - 0.13} width={1.2} height={0.26} {...common} />;
    case "gateway":
      return <rect x={x - 0.45} y={y - 0.31} width={0.9} height={0.62} rx={0.08} {...common} />;
    case "client":
      return <rect x={x - 0.45} y={y - 0.08} width={0.9} height={0.16} {...common} />;
    case "cache":
      return <rect x={x - 0.21} y={y - 0.21} width={0.42} height={0.42} transform={`rotate(45 ${x} ${y})`} {...common} />;
    default:
      return <rect x={x - 0.28} y={y - 0.28} width={0.56} height={0.56} {...common} />;
  }
}

/**
 * Flat top view of the same system as the WebGL scene. Used while three.js
 * loads and when WebGL is not available.
 */
export default function SizeDiagram({ level }: SizeDiagramProps) {
  const b = boundsAt(level);
  const pad = 1.2;
  const viewBox = `${b.minX - pad} ${b.minZ - pad} ${b.maxX - b.minX + pad * 2} ${b.maxZ - b.minZ + pad * 2}`;
  const byId = new Map(sizeNodes.map((n) => [n.id, n]));
  const accent = LEVEL_COLORS[level - 1];

  return (
    <svg viewBox={viewBox} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {sizeRegions
        .filter((r) => r.level <= level)
        .map((r) => (
          <rect
            key={r.id}
            x={r.x - r.w / 2}
            y={r.z - r.d / 2}
            width={r.w}
            height={r.d}
            fill="none"
            stroke="var(--sw-text-muted)"
            strokeDasharray="0.2 0.15"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      {sizeLinks
        .filter((l) => l.level <= level)
        .map((l) => {
          const a = byId.get(l.from)!;
          const z = byId.get(l.to)!;
          return (
            <line
              key={`${l.from}-${l.to}`}
              x1={a.x}
              y1={a.z}
              x2={z.x}
              y2={z.z}
              stroke="var(--sw-border-light)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      {sizeNodes
        .filter((n) => n.level <= level)
        .map((n) => (
          <Shape key={n.id} kind={n.kind} x={n.x} y={n.z} stroke={n.level === level ? accent : "var(--sw-text-muted)"} />
        ))}
    </svg>
  );
}
