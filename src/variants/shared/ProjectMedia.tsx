import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { spring } from "./motionTokens";

export type MediaElement = HTMLImageElement | HTMLVideoElement;

type ProjectMediaProps = {
  src: string;
  alt: string;
  /** Optional preview clip. Plays muted while active; the image is its poster. */
  videoSrc?: string;
  /** Hover or keyboard focus on the surrounding card. */
  active: boolean;
  className?: string;
  loading?: "lazy" | "eager";
  /** Receives the visible media element (image, or video when present). */
  onMediaElement?: (el: MediaElement | null) => void;
};

/**
 * Project preview. Until real clips exist, an active preview drifts slowly
 * across the still image (Ken Burns); with `videoSrc` it plays the clip instead.
 * A quick spring zoom answers the hover at once, the drift carries on slowly.
 * Under reduced motion it stays still and never autoplays.
 * The parent provides the clipping box (overflow hidden).
 */
export default function ProjectMedia({
  src,
  alt,
  videoSrc,
  active,
  className = "",
  loading = "lazy",
  onMediaElement,
}: ProjectMediaProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active && !reduceMotion) {
      video.play().catch(() => {
        // Autoplay can be blocked; the poster frame stays visible.
      });
    } else {
      video.pause();
    }
  }, [active, reduceMotion]);

  return (
    <motion.div
      className="w-full h-full"
      initial={false}
      animate={{ scale: active ? 1.05 : 1 }}
      transition={spring.snappy}
    >
      {videoSrc ? (
        <video
          ref={(el) => {
            videoRef.current = el;
            onMediaElement?.(el);
          }}
          src={videoSrc}
          poster={src}
          muted
          loop
          playsInline
          preload="none"
          aria-label={alt}
          className={`w-full h-full object-cover ${className}`}
        />
      ) : (
        <motion.img
          ref={(el: HTMLImageElement | null) => onMediaElement?.(el)}
          src={src}
          alt={alt}
          loading={loading}
          draggable={false}
          className={`w-full h-full object-cover ${className}`}
          initial={false}
          animate={active ? { scale: [null, 1.12], x: [null, "-3%"], y: [null, "-2%"] } : { scale: 1, x: "0%", y: "0%" }}
          transition={
            active
              ? {
                  scale: { duration: 7, ease: "linear", repeat: Infinity, repeatType: "mirror" },
                  x: { duration: 9, ease: "linear", repeat: Infinity, repeatType: "mirror" },
                  y: { duration: 8, ease: "linear", repeat: Infinity, repeatType: "mirror" },
                }
              : spring.soft
          }
        />
      )}
    </motion.div>
  );
}
