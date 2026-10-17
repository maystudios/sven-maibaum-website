import { useReducedMotion } from "motion/react";

/**
 * Preview override for reviewing motion: `?motion=full` forces full motion
 * even when the operating system asks for reduced motion (kept in
 * sessionStorage for the tab), `?motion=auto` clears it. Without the override
 * the visitor's reduced-motion preference applies unchanged.
 */
const STORAGE_KEY = "motion-override";

function readOverride(): boolean {
  if (typeof window === "undefined") return false;
  const param = new URLSearchParams(window.location.search).get("motion");
  try {
    if (param === "full") {
      window.sessionStorage.setItem(STORAGE_KEY, "full");
      return true;
    }
    if (param === "auto") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return false;
    }
    return window.sessionStorage.getItem(STORAGE_KEY) === "full";
  } catch {
    // sessionStorage can be unavailable; fall back to the URL only
    return param === "full";
  }
}

/** Resolved once per page load. */
export const forceFullMotion = readOverride();

if (forceFullMotion && typeof document !== "undefined") {
  // Lets CSS skip its reduced-motion rules (see index.css, html:not([data-motion="full"]))
  document.documentElement.setAttribute("data-motion", "full");
}

/** Reduced-motion preference of the visitor, unless the preview override forces full motion. */
export function prefersReducedMotion() {
  if (forceFullMotion || typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Hook version of prefersReducedMotion that follows changes of the system setting. */
export function useReducedMotionPreference() {
  const system = useReducedMotion() === true;
  return forceFullMotion ? false : system;
}
