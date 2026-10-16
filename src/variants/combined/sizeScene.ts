import {
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  GridHelper,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import { boundsAt, sizeLinks, sizeNodes, sizeRegions } from "./sizeModel";
import type { NodeKind } from "./sizeModel";

/**
 * WebGL illustration of the project size levels (loaded on demand, see
 * SizePanel). Line-drawn boxes on a floor grid; what a level adds is drawn in
 * the level colour, packets travel along the links. No textures, no
 * post-processing; it only renders while visible.
 */
export type SizeScene = {
  setLevel: (level: number, instant: boolean) => void;
  setRunning: (running: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  resize: (width: number, height: number) => void;
  refreshTheme: () => void;
  dispose: () => void;
};

/** Level colours, matching the slider (Maximal cycles through a rainbow). */
const LEVEL_COLORS = ["#eab308", "#22c55e", "#22d3ee", "#a855f7", "#a855f7"];

const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const easeInQuad = (t: number) => t * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Shape = { geometry: BufferGeometry; edges: EdgesGeometry; lift: number };

function createShapes(): Record<NodeKind, Shape> {
  const make = (geometry: BufferGeometry, lift: number): Shape => ({ geometry, edges: new EdgesGeometry(geometry, 30), lift });
  return {
    client: make(new BoxGeometry(0.9, 0.62, 0.06), 0.33),
    service: make(new BoxGeometry(0.56, 0.56, 0.56), 0.28),
    db: make(new CylinderGeometry(0.32, 0.32, 0.52, 28, 1), 0.26),
    queue: make(new BoxGeometry(1.2, 0.2, 0.26), 0.1),
    gateway: make(new BoxGeometry(0.9, 0.14, 0.62), 0.07),
    cache: make(new BoxGeometry(0.42, 0.32, 0.42), 0.16),
  };
}

type Tween = { from: number; to: number; start: number; duration: number; ease: (t: number) => number };

type NodeView = {
  id: string;
  level: number;
  group: Group;
  edgeMaterial: LineBasicMaterial;
  scale: number;
  tween: Tween | null;
};

type LinkView = {
  level: number;
  from: NodeView;
  to: NodeView;
  line: Line;
  material: LineBasicMaterial;
  packet: Mesh;
  packetMaterial: MeshBasicMaterial;
  phase: number;
};

function themeColors() {
  const cs = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    line: read("--sw-text-muted", "#a1a1aa"),
    fill: read("--sw-surface", "#18181b"),
    link: read("--sw-border-light", "#3f3f46"),
  };
}

function tweenValue(tween: Tween, now: number) {
  const t = Math.min(1, Math.max(0, (now - tween.start) / tween.duration));
  return { value: tween.from + (tween.to - tween.from) * tween.ease(t), done: t >= 1 };
}

const ELEVATION = 0.66;
const AZIMUTH = -0.55;
const SWAY = 0.22;

/** Checks WebGL on a throwaway canvas, so a missing context never reaches three.js. */
function webglAvailable() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}

export function createSizeScene(canvas: HTMLCanvasElement): SizeScene | null {
  if (!webglAvailable()) return null;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 200);
  const world = new Group();
  scene.add(world);

  let colors = themeColors();
  const shapes = createShapes();
  const fillMaterial = new MeshBasicMaterial({
    color: new Color(colors.fill),
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });

  const grid = new GridHelper(80, 80, new Color(colors.link), new Color(colors.link));
  const gridMaterial = grid.material as LineBasicMaterial;
  gridMaterial.transparent = true;
  gridMaterial.opacity = 0.7;
  world.add(grid);

  // Nodes
  const nodeViews = new Map<string, NodeView>();
  for (const node of sizeNodes) {
    const shape = shapes[node.kind];
    const group = new Group();
    const body = new Mesh(shape.geometry, fillMaterial);
    const edgeMaterial = new LineBasicMaterial({ color: new Color(colors.line) });
    const edges = new LineSegments(shape.edges, edgeMaterial);
    body.position.y = shape.lift;
    edges.position.y = shape.lift;
    group.add(body, edges);
    group.position.set(node.x, 0, node.z);
    group.scale.setScalar(0.0001);
    group.visible = false;
    world.add(group);
    nodeViews.set(node.id, { id: node.id, level: node.level, group, edgeMaterial, scale: 0, tween: null });
  }

  // Region platforms (Maximal)
  const regionViews = sizeRegions.map((region) => {
    const geometry = new EdgesGeometry(new BoxGeometry(region.w, 0.001, region.d));
    const material = new LineBasicMaterial({ color: new Color(colors.line), transparent: true, opacity: 0 });
    const outline = new LineSegments(geometry, material);
    outline.position.set(region.x, 0.002, region.z);
    world.add(outline);
    return { level: region.level, material, geometry, opacity: 0, tween: null as Tween | null };
  });

  // Links with one travelling packet each
  const packetGeometry = new SphereGeometry(0.075, 10, 8);
  const linkViews: LinkView[] = sizeLinks.map((link, i) => {
    const from = nodeViews.get(link.from)!;
    const to = nodeViews.get(link.to)!;
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute([from.group.position.x, 0.03, from.group.position.z, to.group.position.x, 0.03, to.group.position.z], 3)
    );
    const material = new LineBasicMaterial({ color: new Color(colors.link), transparent: true, opacity: 0 });
    const line = new Line(geometry, material);
    world.add(line);
    const packetMaterial = new MeshBasicMaterial({ color: new Color(LEVEL_COLORS[0]) });
    const packet = new Mesh(packetGeometry, packetMaterial);
    packet.visible = false;
    world.add(packet);
    return { level: link.level, from, to, line, material, packet, packetMaterial, phase: (i * 0.37) % 1 };
  });

  // Camera framing per level
  let aspect = 1;
  const cam = { cx: 0, cz: 0, dist: 6 };
  let camTween: { from: typeof cam; to: typeof cam; start: number; duration: number } | null = null;

  /**
   * Smallest distance at which the level's floor area (with some height) stays
   * inside the frame for every view angle of the sway.
   */
  const framingFor = (level: number) => {
    const b = boundsAt(level);
    const pad = 0.6;
    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;
    const corners: [number, number, number][] = [];
    for (const x of [b.minX - pad, b.maxX + pad]) {
      for (const z of [b.minZ - pad, b.maxZ + pad]) {
        for (const y of [0, 0.7]) corners.push([x - cx, y, z - cz]);
      }
    }
    const tanV = Math.tan((camera.fov * Math.PI) / 360);
    const tanH = tanV * aspect;
    let dist = 4.5;
    for (const az of [AZIMUTH - SWAY, AZIMUTH, AZIMUTH + SWAY]) {
      // Unit vector from the target to the camera, and the camera's right and up axes
      const c = [Math.cos(ELEVATION) * Math.sin(az), Math.sin(ELEVATION), Math.cos(ELEVATION) * Math.cos(az)];
      const rLen = Math.hypot(c[2], c[0]);
      const right = [c[2] / rLen, 0, -c[0] / rLen];
      const up = [
        c[1] * right[2] - c[2] * right[1],
        c[2] * right[0] - c[0] * right[2],
        c[0] * right[1] - c[1] * right[0],
      ];
      for (const p of corners) {
        const toward = p[0] * c[0] + p[1] * c[1] + p[2] * c[2];
        const xs = Math.abs(p[0] * right[0] + p[1] * right[1] + p[2] * right[2]);
        const ys = Math.abs(p[0] * up[0] + p[1] * up[1] + p[2] * up[2]);
        dist = Math.max(dist, toward + xs / tanH, toward + ys / tanV);
      }
    }
    return { cx, cz, dist };
  };

  let level = 1;
  let running = false;
  let reduced = false;
  let raf = 0;
  let disposed = false;
  const t0 = performance.now();

  const placeCamera = (now: number) => {
    const azimuth = AZIMUTH + (reduced ? 0 : Math.sin((now - t0) / 4200) * SWAY);
    const d = cam.dist;
    camera.position.set(
      cam.cx + d * Math.cos(ELEVATION) * Math.sin(azimuth),
      d * Math.sin(ELEVATION),
      cam.cz + d * Math.cos(ELEVATION) * Math.cos(azimuth)
    );
    camera.lookAt(cam.cx, 0, cam.cz);
  };

  const levelColor = (index: number) => {
    if (level < 5) return new Color(LEVEL_COLORS[level - 1]);
    return new Color().setHSL((index * 0.13) % 1, 0.75, 0.6);
  };

  /** Advances all tweens; returns true while something is still moving. */
  const update = (now: number) => {
    let moving = false;
    if (camTween) {
      const t = Math.min(1, (now - camTween.start) / camTween.duration);
      const k = easeInOut(t);
      cam.cx = camTween.from.cx + (camTween.to.cx - camTween.from.cx) * k;
      cam.cz = camTween.from.cz + (camTween.to.cz - camTween.from.cz) * k;
      cam.dist = camTween.from.dist + (camTween.to.dist - camTween.from.dist) * k;
      if (t >= 1) camTween = null;
      else moving = true;
    }
    for (const view of nodeViews.values()) {
      if (view.tween) {
        const { value, done } = tweenValue(view.tween, now);
        view.scale = value;
        if (done) view.tween = null;
        else moving = true;
      }
      view.group.visible = view.scale > 0.001;
      view.group.scale.setScalar(Math.max(0.0001, view.scale));
    }
    for (const region of regionViews) {
      if (region.tween) {
        const { value, done } = tweenValue(region.tween, now);
        region.opacity = value;
        if (done) region.tween = null;
        else moving = true;
      }
      region.material.opacity = region.opacity * 0.7;
    }
    linkViews.forEach((link, i) => {
      const presence = Math.min(link.from.scale, link.to.scale, 1);
      link.material.opacity = Math.max(0, presence) * 0.9;
      link.line.visible = presence > 0.01;
      const showPacket = !reduced && presence > 0.95;
      link.packet.visible = showPacket;
      if (showPacket) {
        const p = ((now - t0) / 2400 + link.phase) % 1;
        const a = link.from.group.position;
        const b = link.to.group.position;
        link.packet.position.set(a.x + (b.x - a.x) * p, 0.12, a.z + (b.z - a.z) * p);
      }
      if (level === 5) link.packetMaterial.color.setHSL((i * 0.11 + (now - t0) / 9000) % 1, 0.8, 0.6);
    });
    placeCamera(now);
    return moving;
  };

  const frame = (now: number) => {
    raf = 0;
    if (disposed) return;
    const moving = update(now);
    renderer.render(scene, camera);
    // Reduced motion: render only until a level change has settled (it is instant)
    if (running && (!reduced || moving)) raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    if (!raf && !disposed) raf = requestAnimationFrame(frame);
  };

  const setLevel = (next: number, instant: boolean) => {
    level = Math.min(5, Math.max(1, Math.round(next)));
    const now = performance.now();
    let appearIndex = 0;
    const sorted = [...nodeViews.values()].sort((a, b) => a.level - b.level);
    sorted.forEach((view, i) => {
      const target = view.level <= level ? 1 : 0;
      const isNew = view.level === level;
      view.edgeMaterial.color.set(isNew ? levelColor(i) : new Color(colors.line));
      if (instant) {
        view.scale = target;
        view.tween = null;
        return;
      }
      const goal = view.tween ? view.tween.to : view.scale > 0.5 ? 1 : 0;
      if (goal === target) return;
      view.tween =
        target === 1
          ? { from: view.scale, to: 1, start: now + 60 * appearIndex++, duration: 520, ease: easeOutBack }
          : { from: view.scale, to: 0, start: now, duration: 240, ease: easeInQuad };
    });
    for (const region of regionViews) {
      const target = region.level <= level ? 1 : 0;
      if (instant) {
        region.opacity = target;
        region.tween = null;
      } else if ((region.tween ? region.tween.to : region.opacity) !== target) {
        region.tween = { from: region.opacity, to: target, start: now + (target ? 200 : 0), duration: 600, ease: easeInOut };
      }
    }
    linkViews.forEach((link, i) => link.packetMaterial.color.copy(levelColor(i)));
    const framing = framingFor(level);
    if (instant) {
      Object.assign(cam, framing);
      camTween = null;
    } else {
      camTween = { from: { ...cam }, to: framing, start: now, duration: 1000 };
    }
    kick();
  };

  return {
    setLevel,
    setRunning: (next) => {
      running = next;
      if (running) kick();
    },
    setReducedMotion: (next) => {
      reduced = next;
      kick();
    },
    resize: (width, height) => {
      if (width < 1 || height < 1) return;
      renderer.setSize(width, height, false);
      aspect = width / height;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      const framing = framingFor(level);
      if (camTween) camTween.to = framing;
      else Object.assign(cam, framing);
      kick();
    },
    refreshTheme: () => {
      colors = themeColors();
      fillMaterial.color.set(colors.fill);
      gridMaterial.color.set(colors.link);
      for (const view of nodeViews.values()) {
        if (view.level !== level) view.edgeMaterial.color.set(colors.line);
      }
      for (const region of regionViews) region.material.color.set(colors.line);
      for (const link of linkViews) link.material.color.set(colors.link);
      kick();
    },
    dispose: () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      for (const shape of Object.values(shapes)) {
        shape.geometry.dispose();
        shape.edges.dispose();
      }
      for (const view of nodeViews.values()) view.edgeMaterial.dispose();
      for (const region of regionViews) {
        region.geometry.dispose();
        region.material.dispose();
      }
      for (const link of linkViews) {
        link.line.geometry.dispose();
        link.material.dispose();
        link.packetMaterial.dispose();
      }
      packetGeometry.dispose();
      fillMaterial.dispose();
      grid.geometry.dispose();
      gridMaterial.dispose();
      renderer.dispose();
    },
  };
}
