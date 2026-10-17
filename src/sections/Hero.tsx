import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import FlipWords from "../components/FlipWords";
import { useReducedMotionPreference } from "../motion/motionPreference";
import { ease } from "../motion/motionTokens";
import { heroCtas, heroEyebrow, heroIntro, heroName, heroRolePrefix, heroRoles, heroTags, profileImage } from "../data/hero";

const FRAME_COUNT = 7;
const FRAME_GAP = 420; // px between two frames along the z axis

type CorridorFrameProps = {
  index: number;
  travel: MotionValue<number>;
  still: boolean;
};

/** One outline of the corridor; moves toward the viewer and fades as it passes. */
function CorridorFrame({ index, travel, still }: CorridorFrameProps) {
  const z = useTransform(travel, (t) => -index * FRAME_GAP + t);
  const opacity = useTransform(z, [-FRAME_GAP * FRAME_COUNT, -FRAME_GAP * 2, -60, 120], [0, 1, 1, 0]);
  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 w-[86vw] h-[62vh] md:w-[78vw] md:h-[70vh] -ml-[43vw] -mt-[31vh] md:-ml-[39vw] md:-mt-[35vh] border border-border"
      style={still ? { opacity: index < 3 ? 0.6 - index * 0.2 : 0 } : { z, opacity }}
    >
      {index % 2 === 0 ? <span className="absolute left-1/3 top-0 bottom-0 w-px bg-border" /> : null}
      {index % 3 === 0 ? <span className="absolute top-1/2 left-0 right-0 h-px bg-border" /> : null}
      {index === 2 ? <span className="absolute -left-px -top-px w-3 h-3 bg-brand" /> : null}
    </motion.div>
  );
}

/**
 * Hero in depth: a corridor of grid frames that the camera flies into on load
 * and keeps travelling through while scrolling. The content plane recedes as
 * the next section slides over it (the hero stays pinned underneath).
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotionPreference();
  const [stickyTop, setStickyTop] = useState(0);

  // Pin the hero only once its bottom is reached, so tall mobile heroes stay readable
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const measure = () => setStickyTop(Math.min(0, window.innerHeight - el.offsetHeight));
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollY } = useScroll();

  // Camera travel: an intro flight on load, then scroll distance adds forward motion
  const flight = useMotionValue(-FRAME_GAP * 3);
  useEffect(() => {
    if (reduceMotion) {
      flight.set(0);
      return;
    }
    const controls = animate(flight, 0, { duration: 1.6, ease: ease.out });
    return () => controls.stop();
  }, [flight, reduceMotion]);
  const travel = useTransform([flight, scrollY], ([f, y]) => (f as number) + (y as number) * 0.9);

  const pinStart = -stickyTop;
  const contentScale = useTransform(scrollY, [pinStart, pinStart + 900], [1, 0.86]);
  const contentOpacity = useTransform(scrollY, [pinStart, pinStart + 700], [1, 0.1]);
  const portraitY = useTransform(scrollY, [0, 900], [0, -140]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="sticky z-0 min-h-screen bg-canvas overflow-hidden flex items-center"
      style={{ top: stickyTop, perspective: "900px", perspectiveOrigin: "50% 45%" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
        {Array.from({ length: FRAME_COUNT }, (_, i) => (
          <CorridorFrame key={i} index={i} travel={travel} still={reduceMotion === true} />
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full py-28 lg:py-32"
        style={reduceMotion ? undefined : { scale: contentScale, opacity: contentOpacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div
            className="lg:col-span-7 flex flex-col gap-7"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: ease.out }}
          >
            <span className="font-mono text-xs text-brand">{heroEyebrow}</span>
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold font-display text-fg tracking-[-0.04em] leading-[0.92]">
                {heroName}
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted leading-tight mt-3">
                {heroRolePrefix} <FlipWords words={heroRoles} className="text-fg" />
              </p>
            </div>
            <p className="max-w-lg text-base md:text-lg text-muted leading-relaxed">{heroIntro}</p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#projects" className="swiss-btn-primary min-h-[44px]">
                {heroCtas.projects}
              </a>
              <a href="#contact" className="swiss-btn-secondary min-h-[44px]">
                {heroCtas.contact}
              </a>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 flex flex-col items-center lg:items-end gap-6"
            style={reduceMotion ? undefined : { y: portraitY }}
          >
            <motion.div
              className="border border-border overflow-hidden bg-surface"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: ease.out }}
            >
              <img src={profileImage.src} alt={profileImage.alt} className="w-60 h-60 md:w-72 md:h-72 object-cover" loading="eager" />
            </motion.div>
            <ul className="flex flex-wrap justify-center lg:justify-end gap-2">
              {heroTags.map((tag, i) => (
                <motion.li
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.05, ease: ease.out }}
                  className="border border-border text-muted text-xs font-mono px-3 py-1.5 rounded-sm bg-canvas"
                >
                  {tag}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
