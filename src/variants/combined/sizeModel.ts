/**
 * Schematic system that grows with the project size level: one small piece
 * at Mini, a distributed system over three regions at Maximal. Pure data,
 * shared by the WebGL scene and the SVG fallback. Coordinates are floor units
 * (x to the right, z toward the viewer).
 */

export type NodeKind = "client" | "service" | "db" | "queue" | "gateway" | "cache";

export type SizeNode = {
  id: string;
  kind: NodeKind;
  x: number;
  z: number;
  /** First level (1..5) at which the node exists. */
  level: number;
};

export type SizeLink = { from: string; to: string; level: number };

export type SizeRegion = { id: string; x: number; z: number; w: number; d: number; level: number };

const nodes: SizeNode[] = [
  // Mini: one small thing
  { id: "app", kind: "client", x: 0, z: 0, level: 1 },
  // Klein: app with a small backend and one database
  { id: "api", kind: "service", x: 1.8, z: 0, level: 2 },
  { id: "db1", kind: "db", x: 3.6, z: 0, level: 2 },
  // Mittel: second client, a few services, cache, external interface
  { id: "app2", kind: "client", x: 0, z: 1.6, level: 3 },
  { id: "auth", kind: "service", x: 1.8, z: 1.6, level: 3 },
  { id: "files", kind: "service", x: 1.8, z: -1.6, level: 3 },
  { id: "cache", kind: "cache", x: 3.6, z: -1.6, level: 3 },
  { id: "ext", kind: "gateway", x: 3.6, z: 1.6, level: 3 },
  // Groß: queue with workers, second database, search, more clients
  { id: "app3", kind: "client", x: 0, z: -1.6, level: 4 },
  { id: "queue", kind: "queue", x: 5.5, z: 0.8, level: 4 },
  { id: "worker1", kind: "service", x: 7.2, z: 1.6, level: 4 },
  { id: "worker2", kind: "service", x: 7.2, z: 0, level: 4 },
  { id: "db2", kind: "db", x: 8.8, z: 0.8, level: 4 },
  { id: "search", kind: "service", x: 1.8, z: -3.2, level: 4 },
  { id: "index", kind: "db", x: 3.6, z: -3.2, level: 4 },
];

const links: SizeLink[] = [
  { from: "app", to: "api", level: 2 },
  { from: "api", to: "db1", level: 2 },
  { from: "app2", to: "api", level: 3 },
  { from: "api", to: "auth", level: 3 },
  { from: "api", to: "files", level: 3 },
  { from: "files", to: "cache", level: 3 },
  { from: "auth", to: "db1", level: 3 },
  { from: "api", to: "ext", level: 3 },
  { from: "app3", to: "api", level: 4 },
  { from: "api", to: "queue", level: 4 },
  { from: "queue", to: "worker1", level: 4 },
  { from: "queue", to: "worker2", level: 4 },
  { from: "worker1", to: "db2", level: 4 },
  { from: "worker2", to: "db2", level: 4 },
  { from: "api", to: "search", level: 4 },
  { from: "search", to: "index", level: 4 },
];

const regions: SizeRegion[] = [{ id: "region-a", x: 4.4, z: -0.8, w: 10.6, d: 6.4, level: 5 }];

/** Maximal adds two more regions with their own gateway, services, queue and database. */
function addRegion(id: string, ox: number, oz: number, replicateTo: string) {
  const n = (suffix: string, kind: NodeKind, x: number, z: number) =>
    nodes.push({ id: `${id}-${suffix}`, kind, x: ox + x, z: oz + z, level: 5 });
  n("gw", "gateway", 0, 0);
  n("s1", "service", 1.8, 1.4);
  n("s2", "service", 1.8, 0);
  n("s3", "service", 1.8, -1.4);
  n("q", "queue", 3.7, 0.7);
  n("w", "service", 5.4, 0.7);
  n("db", "db", 5.4, -1.2);
  const l = (from: string, to: string) => links.push({ from: `${id}-${from}`, to: `${id}-${to}`, level: 5 });
  l("gw", "s1");
  l("gw", "s2");
  l("gw", "s3");
  l("s1", "q");
  l("q", "w");
  l("w", "db");
  l("s3", "db");
  links.push({ from: `${id}-db`, to: replicateTo, level: 5 });
  links.push({ from: `${id}-gw`, to: "api", level: 5 });
  regions.push({ id, x: ox + 2.7, z: oz - 0.1, w: 7.4, d: 4.4, level: 5 });
}

addRegion("eu", -2.2, -9, "db1");
addRegion("us", 7.2, -9, "db2");

export const sizeNodes: readonly SizeNode[] = nodes;
export const sizeLinks: readonly SizeLink[] = links;
export const sizeRegions: readonly SizeRegion[] = regions;

export type Bounds = { minX: number; maxX: number; minZ: number; maxZ: number };

/** Floor area covered at a level, including region platforms. */
export function boundsAt(level: number): Bounds {
  const b: Bounds = { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity };
  for (const node of nodes) {
    if (node.level > level) continue;
    b.minX = Math.min(b.minX, node.x);
    b.maxX = Math.max(b.maxX, node.x);
    b.minZ = Math.min(b.minZ, node.z);
    b.maxZ = Math.max(b.maxZ, node.z);
  }
  for (const r of regions) {
    if (r.level > level) continue;
    b.minX = Math.min(b.minX, r.x - r.w / 2);
    b.maxX = Math.max(b.maxX, r.x + r.w / 2);
    b.minZ = Math.min(b.minZ, r.z - r.d / 2);
    b.maxZ = Math.max(b.maxZ, r.z + r.d / 2);
  }
  return b;
}
