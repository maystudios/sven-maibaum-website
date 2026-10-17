import { useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { ease } from "./motionTokens";
import { prefersReducedMotion } from "./scroll";

/*
 * Every route renders inside a PageFrame. AnimatePresence (mode "wait") plays
 * the frame's "exit" on the old page, then mounts the new page in "initial"
 * and animates it to "enter". The grid overlay lives in a portal so it can
 * cover the fixed header, but it still inherits the frame's variant labels.
 *
 * The grid plays once per route change in both directions, also when a
 * shared-element morph carries the navigation; the morph clone flies above
 * it (MorphLayer sits over the overlay). Under reduced motion both the page
 * and the grid only fade.
 */

const FADE_OUT = { opacity: 0, transition: { duration: 0.28, ease: "easeIn" } } as const;

const GRID_COVER = 0.52;

// Keeps the old page on screen until the grid has fully covered it.
const holdFor = (seconds: number) => ({ opacity: 0.999, transition: { duration: seconds } });

const frame: Variants = {
  initial: { opacity: 1 },
  enter: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: () => (prefersReducedMotion() ? FADE_OUT : holdFor(GRID_COVER)),
};

const cell: Variants = {
  initial: { opacity: 1, scale: 1 },
  enter: (d: number) =>
    prefersReducedMotion()
      ? { opacity: 0, transition: { duration: 0.2 } }
      : { opacity: 0, scale: 0.4, transition: { duration: 0.28, delay: 0.03 + d * 0.014, ease: ease.out } },
  exit: (d: number) =>
    prefersReducedMotion()
      ? { opacity: [0, 1], scale: 1, transition: { duration: 0.2 } }
      : { opacity: [0, 1], scale: [0.4, 1], transition: { duration: 0.24, delay: d * 0.014, ease: ease.out } },
};

function GridOverlay() {
  const width = window.innerWidth;
  const cols = width >= 1024 ? 12 : width >= 768 ? 8 : 4;
  const size = width / cols;
  const rows = Math.ceil(window.innerHeight / size);
  const cells = Array.from({ length: rows * cols }, (_, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    // A few accent cells, placed deterministically so every transition looks the same
    return { i, d: r + c, accent: (r * 5 + c * 3) % 13 === 0 };
  });
  return (
    <div
      className="fixed inset-0 z-[90] pointer-events-none grid"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridAutoRows: `${size}px` }}
      aria-hidden="true"
    >
      {cells.map(({ i, d, accent }) => (
        <motion.div
          key={i}
          custom={d}
          variants={cell}
          className={accent ? "bg-brand" : "bg-surface"}
          style={{ boxShadow: "inset 0 0 0 0.5px var(--sw-border)" }}
        />
      ))}
    </div>
  );
}

type PageFrameProps = {
  children: ReactNode;
  /** Called once the page is in the DOM, before paint (scroll restore, hash jump). */
  onMounted: () => void;
};

export default function PageFrame({ children, onMounted }: PageFrameProps) {
  useLayoutEffect(() => {
    onMounted();
    // Runs once per page mount; onMounted reads the current location itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div variants={frame} initial="initial" animate="enter" exit="exit">
      {createPortal(<GridOverlay />, document.body)}
      {children}
    </motion.div>
  );
}
