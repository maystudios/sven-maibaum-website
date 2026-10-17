/**
 * Manifest of the size scene (public/assets/size-scene/manifest.json): one
 * continuous camera journey across scales, played forward or in reverse, with
 * an idle loop and a still per level. Level times and duration are read from
 * the manifest; they are not fixed in code.
 */
export type SceneTheme = "dark" | "light";

export type SceneManifest = {
  version: 2;
  width: number;
  height: number;
  fps: number;
  themes: SceneTheme[];
  journey: { forward: string; reverse: string; levelTimes: number[]; duration: number };
  loops: { pattern: string };
  stills: { pattern: string };
};

export const SCENE_BASE = `${import.meta.env.BASE_URL}assets/size-scene/`;

/** Fills `{theme}` and `{level}` (1 = Mini) in a manifest path. */
export function sceneUrl(pattern: string, theme: SceneTheme, level?: number) {
  return SCENE_BASE + pattern.replaceAll("{theme}", theme).replaceAll("{level}", String(level ?? ""));
}

const positive = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;

/** Validates the fields the player relies on; throws with a readable reason otherwise. */
export function parseManifest(data: unknown): SceneManifest {
  const m = data as Partial<SceneManifest> | null;
  const fail = (reason: string): never => {
    throw new Error(`Size scene manifest invalid: ${reason}`);
  };
  if (!m || m.version !== 2) fail("version must be 2");
  if (!positive(m!.width) || !positive(m!.height) || !positive(m!.fps)) fail("width, height and fps must be positive numbers");
  const journey = m!.journey;
  if (!journey || typeof journey.forward !== "string" || typeof journey.reverse !== "string") fail("journey.forward and journey.reverse are required");
  if (!positive(journey!.duration)) fail("journey.duration must be positive");
  const times = journey!.levelTimes;
  if (!Array.isArray(times) || times.length !== 5) fail("journey.levelTimes must list five times");
  times.forEach((t, i) => {
    if (typeof t !== "number" || t < 0 || t > journey!.duration || (i > 0 && t <= times[i - 1])) fail("journey.levelTimes must rise within the duration");
  });
  if (!m!.loops || typeof m!.loops.pattern !== "string") fail("loops.pattern is required");
  if (!m!.stills || typeof m!.stills.pattern !== "string") fail("stills.pattern is required");
  if (!Array.isArray(m!.themes) || m!.themes.length === 0) fail("themes must not be empty");
  return m as SceneManifest;
}
