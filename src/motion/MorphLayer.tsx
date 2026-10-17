import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import { clearMorph, landMorph, useMorphState } from "./morph";
import type { MorphSource, MorphTarget, Rect } from "./morph";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

type Frame = {
  clipPath: string;
  imageTransform: string;
  titleTransform: string;
};

/**
 * The image is always drawn like `object-fit: cover` of an interpolated box,
 * so it never distorts; a second interpolated box clips it.
 */
function frameAt(source: MorphSource, target: MorphTarget | null, t: number): Frame {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clip = target ? lerpRect(source.clipRect, target.clipRect, t) : source.clipRect;
  const box = target ? lerpRect(source.imageRect, target.imageRect, t) : source.imageRect;
  const { w: nw, h: nh } = source.natural;
  const scale = Math.max(box.w / nw, box.h / nh);
  const dx = box.x + (box.w - nw * scale) / 2;
  const dy = box.y + (box.h - nh * scale) / 2;

  let titleTransform = "";
  if (source.titleRect && source.titleStyle) {
    const from = source.titleRect;
    const to = target?.titleRect ?? from;
    const toScale = target && target.titleFontSize > 0 ? target.titleFontSize / source.titleStyle.fontSize : 1;
    titleTransform = `translate3d(${lerp(from.x, to.x, t)}px, ${lerp(from.y, to.y, t)}px, 0) scale(${lerp(1, toScale, t)})`;
  }

  return {
    clipPath: `inset(${clip.y}px ${vw - clip.x - clip.w}px ${vh - clip.y - clip.h}px ${clip.x}px)`,
    imageTransform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`,
    titleTransform,
  };
}

/** Fixed overlay that carries the shared image and title between routes. */
export default function MorphLayer() {
  const morph = useMorphState();
  const rootRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  const id = morph?.id;
  const phase = morph?.phase;

  useEffect(() => {
    if (!morph || morph.phase !== "flying" || !morph.target) return;
    const { source, target } = morph;
    const apply = (t: number) => {
      const frame = frameAt(source, target, t);
      if (clipRef.current) clipRef.current.style.clipPath = frame.clipPath;
      if (imageRef.current) imageRef.current.style.transform = frame.imageTransform;
      if (titleRef.current) titleRef.current.style.transform = frame.titleTransform;
    };
    const flight = animate(0, 1, {
      type: "spring",
      visualDuration: 0.62,
      bounce: 0.12,
      onUpdate: apply,
      onComplete: () => landMorph(morph.id),
    });
    return () => flight.stop();
    // The flight starts once per transition; id and phase identify it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, phase]);

  useEffect(() => {
    if (phase !== "landed" || !rootRef.current) return;
    // The real hero is visible underneath now; fade the clone out.
    const fade = animate(rootRef.current, { opacity: 0 }, { duration: 0.18, ease: "easeOut" });
    fade.then(() => clearMorph());
    return () => fade.stop();
  }, [id, phase]);

  if (!morph) return null;
  const { source } = morph;
  // Render the clone exactly over the source; the flight updates styles directly.
  const start = frameAt(source, null, 0);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[95] pointer-events-none" aria-hidden="true">
      <div ref={clipRef} className="absolute inset-0 overflow-hidden" style={{ clipPath: start.clipPath }}>
        <img
          ref={imageRef}
          src={source.imageSrc}
          alt=""
          className="absolute left-0 top-0 max-w-none"
          style={{
            width: source.natural.w,
            height: source.natural.h,
            transformOrigin: "0 0",
            transform: start.imageTransform,
          }}
        />
      </div>
      {source.titleRect && source.titleStyle ? (
        <span
          ref={titleRef}
          className="absolute left-0 top-0 whitespace-nowrap"
          style={{
            transformOrigin: "0 0",
            transform: start.titleTransform,
            fontSize: source.titleStyle.fontSize,
            fontWeight: source.titleStyle.fontWeight,
            fontFamily: source.titleStyle.fontFamily,
            letterSpacing: source.titleStyle.letterSpacing,
            lineHeight: source.titleStyle.lineHeight,
            color: source.titleStyle.color,
          }}
        >
          {source.title}
        </span>
      ) : null}
    </div>
  );
}
