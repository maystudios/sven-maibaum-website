import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useIsPresent } from "motion/react";
import type { Variants } from "motion/react";
import { isMorphActive } from "./morph";
import { ease } from "./motionTokens";
import { prefersReducedMotion } from "./scroll";
import type { MotionVariant } from "../variant";

/*
 * Every route renders inside a PageFrame. AnimatePresence (mode "wait") plays
 * the frame's "exit" on the old page, then mounts the new page in "initial"
 * and animates it to "enter". Overlays live in a portal so they can cover the
 * fixed header, but they still inherit the frame's variant labels.
 *
 * During a shared-element morph (project card -> project page) all variants
 * fall back to a short fade, so the flying image stays the only moving part.
 */

const FADE_OUT = { opacity: 0, transition: { duration: 0.28, ease: "easeIn" } } as const;

// Keeps the old page on screen until the overlay has fully covered it.
const holdFor = (seconds: number) => ({ opacity: 0.999, transition: { duration: seconds } });

const overlayFrame = (coverSeconds: number): Variants => ({
  initial: () => (isMorphActive() ? { opacity: 0 } : { opacity: 1 }),
  enter: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: () => (isMorphActive() || prefersReducedMotion() ? FADE_OUT : holdFor(coverSeconds)),
});

const zoomFrame: Variants = {
  initial: () => (isMorphActive() ? { opacity: 0 } : { opacity: 0, scale: 0.93 }),
  enter: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: ease.out } },
  exit: () =>
    isMorphActive()
      ? FADE_OUT
      : { opacity: 0, scale: 1.12, transition: { duration: 0.34, ease: ease.in } },
};

const CURTAIN_COVER = 0.46;

const curtain: Variants = {
  initial: () => {
    if (isMorphActive()) return { y: "100%", opacity: 0 };
    return prefersReducedMotion() ? { y: "0%", opacity: 1 } : { y: "0%", opacity: 1 };
  },
  enter: () =>
    prefersReducedMotion()
      ? { opacity: 0, transition: { duration: 0.2 } }
      : { y: "-100%", transition: { duration: 0.62, ease: ease.inOut, delay: 0.04 } },
  exit: () => {
    if (isMorphActive()) return { opacity: 0, transition: { duration: 0 } };
    if (prefersReducedMotion()) return { opacity: [0, 1], transition: { duration: 0.2 } };
    return { y: ["100%", "0%"], opacity: 1, transition: { duration: CURTAIN_COVER, ease: ease.inOut } };
  },
};

function CurtainOverlay() {
  return (
    <motion.div
      variants={curtain}
      className="fixed inset-0 z-[90] pointer-events-none bg-surface"
      aria-hidden="true"
    >
      <span className="absolute inset-x-0 top-0 h-px bg-brand" />
      <span className="absolute inset-x-0 bottom-0 h-px bg-brand" />
    </motion.div>
  );
}

const GRID_COVER = 0.52;

const cell: Variants = {
  initial: () => (isMorphActive() ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }),
  enter: (d: number) =>
    prefersReducedMotion()
      ? { opacity: 0, transition: { duration: 0.2 } }
      : { opacity: 0, scale: 0.4, transition: { duration: 0.28, delay: 0.04 + d * 0.016, ease: ease.out } },
  exit: (d: number) => {
    if (isMorphActive()) return { opacity: 0, transition: { duration: 0 } };
    if (prefersReducedMotion()) return { opacity: [0, 1], scale: 1, transition: { duration: 0.2 } };
    return { opacity: [0, 1], scale: [0.4, 1], transition: { duration: 0.24, delay: d * 0.014, ease: ease.out } };
  },
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
  variant: MotionVariant;
  children: ReactNode;
  /** Called once the page is in the DOM, before paint (scroll restore, hash jump). */
  onMounted: () => void;
};

export default function PageFrame({ variant, children, onMounted }: PageFrameProps) {
  const isPresent = useIsPresent();
  const frameRef = useRef<HTMLDivElement>(null);

  // Scale around the middle of the visible viewport, wherever the page is scrolled to
  const centerOrigin = () => {
    if (frameRef.current) {
      frameRef.current.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`;
    }
  };

  useLayoutEffect(() => {
    onMounted();
    centerOrigin();
    // Runs once per page mount; onMounted reads the current location itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!isPresent) centerOrigin();
  }, [isPresent]);

  const variants = variant === 2 ? zoomFrame : overlayFrame(variant === 1 ? CURTAIN_COVER : GRID_COVER);

  return (
    <motion.div ref={frameRef} variants={variants} initial="initial" animate="enter" exit="exit">
      {variant === 1 ? createPortal(<CurtainOverlay />, document.body) : null}
      {variant === 3 ? createPortal(<GridOverlay />, document.body) : null}
      {children}
    </motion.div>
  );
}
