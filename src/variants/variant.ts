/**
 * Motion design exploration: selects one of three variants via `?v=1|2|3`.
 * The choice is kept in sessionStorage so it survives client-side route changes
 * and reloads within the tab. `?v=0` (or any other value) clears it again.
 * Without a selection the regular site renders unchanged.
 */
export type MotionVariant = 1 | 2 | 3;

const STORAGE_KEY = "motion-variant";

function parseVariant(value: string | null): MotionVariant | null {
  if (value === "1" || value === "2" || value === "3") {
    return Number(value) as MotionVariant;
  }
  return null;
}

function readVariant(): MotionVariant | null {
  if (typeof window === "undefined") return null;
  try {
    const param = new URLSearchParams(window.location.search).get("v");
    if (param !== null) {
      const fromParam = parseVariant(param);
      if (fromParam) {
        window.sessionStorage.setItem(STORAGE_KEY, String(fromParam));
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
      return fromParam;
    }
    return parseVariant(window.sessionStorage.getItem(STORAGE_KEY));
  } catch {
    // sessionStorage can be unavailable (privacy mode); fall back to the URL only
    return parseVariant(new URLSearchParams(window.location.search).get("v"));
  }
}

/** Resolved once per page load; switching variants needs a reload with `?v=`. */
export const activeVariant: MotionVariant | null = readVariant();
