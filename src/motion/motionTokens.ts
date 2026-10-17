import type { Transition } from "motion/react";

/**
 * Motion tokens of the site. They are to be recorded in the "Bewegung" section
 * of WEBSITE.md (open point there) and mirrored in index.css where CSS needs them.
 */
export const ease = {
  /** Fast start, long settle: entrances and reveals. */
  out: [0.16, 1, 0.3, 1] as const,
  /** Symmetric, decisive: wipes and curtains. */
  inOut: [0.76, 0, 0.24, 1] as const,
  /** Accelerating: exits. */
  in: [0.7, 0, 0.84, 0] as const,
};

export const spring = {
  /** Button and card press feedback. */
  press: { type: "spring", stiffness: 600, damping: 24, mass: 0.6 } satisfies Transition,
  /** Hover lifts and indicator moves. */
  snappy: { type: "spring", stiffness: 420, damping: 32 } satisfies Transition,
  /** Larger elements settling into place. */
  soft: { type: "spring", stiffness: 220, damping: 28 } satisfies Transition,
};

export const duration = {
  /** Upper bound until text is readable (WEBSITE.md, "Bewegung", rule 4). */
  readable: 0.6,
  reveal: 0.55,
  page: 0.45,
};
