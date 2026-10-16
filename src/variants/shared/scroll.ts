/** Scroll helpers for the motion variants. They never take over user scrolling. */

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function headerOffset() {
  const header = document.querySelector("header") as HTMLElement | null;
  return header ? header.offsetHeight : 64;
}

export function jumpTo(top: number) {
  window.scrollTo({ top, behavior: "instant" });
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let activeTween = 0;

/** Short eased scroll to an absolute position; falls back to a jump under reduced motion. */
export function glideTo(target: number, duration = 700) {
  if (prefersReducedMotion()) {
    jumpTo(target);
    return;
  }
  const start = window.scrollY;
  const distance = target - start;
  if (Math.abs(distance) < 2) return;
  const startTime = performance.now();
  const tween = ++activeTween;
  // A wheel or touch gesture cancels the glide, so the user always keeps control.
  const cancel = () => {
    activeTween++;
  };
  window.addEventListener("wheel", cancel, { once: true, passive: true });
  window.addEventListener("touchstart", cancel, { once: true, passive: true });
  const step = (now: number) => {
    if (tween !== activeTween) return;
    const progress = Math.min((now - startTime) / duration, 1);
    jumpTo(start + distance * easeInOutCubic(progress));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
    }
  };
  requestAnimationFrame(step);
}

export function hashTargetTop(hash: string) {
  if (!hash || hash.length < 2) return null;
  let el: HTMLElement | null = null;
  try {
    el = document.querySelector(hash) as HTMLElement | null;
  } catch {
    return null;
  }
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY - headerOffset();
}
