import { useReducedMotion } from "motion/react";

/**
 * Preview override for reviewing motion: `?motion=full` in the address forces
 * full motion even when the operating system asks for reduced motion. It is
 * read once per page load and stays in effect for client-side navigation; it
 * is not stored on the device, so a visitor never gets storage they did not
 * consent to. Without the override the visitor's reduced-motion preference
 * applies unchanged.
 */
function readOverride(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("motion") === "full";
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
