import { useLayoutEffect, useSyncExternalStore } from "react";
import type { RefObject } from "react";
import { prefersReducedMotion } from "./scroll";

/**
 * Shared-element transition from a project card into the project page. A fixed overlay clone of the image and the
 * title flies from the source rectangles to the hero image and the page title.
 *
 * Flow: startMorph (click) -> page exit fades -> project page registers its
 * target -> MorphLayer flies the clone -> landMorph reveals the real elements
 * -> clearMorph removes the clone.
 */

export type Rect = { x: number; y: number; w: number; h: number };

export type TitleStyle = {
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  letterSpacing: string;
  lineHeight: string;
  color: string;
};

export type MorphSource = {
  route: string;
  imageSrc: string;
  natural: { w: number; h: number };
  /** Visible (clipped) image box. */
  clipRect: Rect;
  /** Box of the image element itself, larger than clipRect while the preview drifts. */
  imageRect: Rect;
  title: string;
  titleRect: Rect | null;
  titleStyle: TitleStyle | null;
};

export type MorphTarget = {
  clipRect: Rect;
  imageRect: Rect;
  titleRect: Rect | null;
  titleFontSize: number;
};

export type MorphPhase = "hold" | "flying" | "landed";

export type MorphState = {
  id: number;
  source: MorphSource;
  target: MorphTarget | null;
  phase: MorphPhase;
};

let state: MorphState | null = null;
let nextId = 1;
let safetyTimer = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: MorphState | null) {
  state = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

export function useMorphState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

function toRect(r: DOMRect): Rect {
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

type MorphElements = {
  route: string;
  title: string;
  /** Element that clips the preview image (usually its overflow-hidden wrapper). */
  clipEl: HTMLElement | null;
  imageEl: HTMLImageElement | HTMLVideoElement | null;
  titleEl: HTMLElement | null;
};

/** Measures the clicked preview and starts the transition. Returns false if it did not start. */
export function startMorph({ route, title, clipEl, imageEl, titleEl }: MorphElements) {
  if (prefersReducedMotion() || !clipEl || !imageEl) return false;
  const clip = clipEl.getBoundingClientRect();
  if (clip.width < 8 || clip.height < 8) return false;
  const imageSrc = imageEl instanceof HTMLVideoElement ? imageEl.poster : imageEl.currentSrc || imageEl.src;
  if (!imageSrc) return false;

  const naturalW = imageEl instanceof HTMLVideoElement ? imageEl.videoWidth : imageEl.naturalWidth;
  const naturalH = imageEl instanceof HTMLVideoElement ? imageEl.videoHeight : imageEl.naturalHeight;
  const natural = naturalW > 0 && naturalH > 0 ? { w: naturalW, h: naturalH } : { w: clip.width, h: clip.height };

  let titleRect: Rect | null = null;
  let titleStyle: TitleStyle | null = null;
  if (titleEl) {
    titleRect = toRect(titleEl.getBoundingClientRect());
    const cs = window.getComputedStyle(titleEl);
    titleStyle = {
      fontSize: parseFloat(cs.fontSize),
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      letterSpacing: cs.letterSpacing,
      lineHeight: cs.lineHeight,
      color: cs.color,
    };
  }

  window.clearTimeout(safetyTimer);
  const id = nextId++;
  setState({
    id,
    source: {
      route,
      imageSrc,
      natural,
      clipRect: toRect(clip),
      imageRect: toRect(imageEl.getBoundingClientRect()),
      title,
      titleRect,
      titleStyle,
    },
    target: null,
    phase: "hold",
  });
  // Never leave a clone behind if the target page does not register in time.
  safetyTimer = window.setTimeout(() => {
    if (state?.id === id && state.phase === "hold") clearMorph();
  }, 2500);
  return true;
}

function registerTarget(target: MorphTarget) {
  if (!state || state.phase !== "hold") return;
  setState({ ...state, target, phase: "flying" });
}

export function landMorph(id: number) {
  if (state?.id === id) setState({ ...state, phase: "landed" });
}

export function clearMorph() {
  window.clearTimeout(safetyTimer);
  if (state) setState(null);
}

type TargetRefs = {
  clip: RefObject<HTMLElement | null>;
  image: RefObject<HTMLImageElement | null>;
  title: RefObject<HTMLElement | null>;
};

/**
 * Registers the hero image and title of a project page as the morph target.
 * Returns true while the real elements should stay hidden under the clone.
 */
export function useMorphTarget(route: string, refs: TargetRefs) {
  const morph = useMorphState();
  const isTarget = morph !== null && morph.source.route === route;

  useLayoutEffect(() => {
    if (!state || state.source.route !== route || state.phase !== "hold") return;
    const clip = refs.clip.current;
    const image = refs.image.current;
    if (!clip || !image) {
      clearMorph();
      return;
    }
    const titleEl = refs.title.current;
    registerTarget({
      clipRect: toRect(clip.getBoundingClientRect()),
      imageRect: toRect(image.getBoundingClientRect()),
      titleRect: titleEl ? toRect(titleEl.getBoundingClientRect()) : null,
      titleFontSize: titleEl ? parseFloat(window.getComputedStyle(titleEl).fontSize) : 0,
    });
  }, [route, refs.clip, refs.image, refs.title]);

  return isTarget && morph.phase !== "landed";
}
