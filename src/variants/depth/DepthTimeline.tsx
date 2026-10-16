import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotionPreference } from "../motionPreference";
import type { MotionValue } from "motion/react";
import { ease } from "../shared/motionTokens";
import { experienceHeading, experiences } from "../../data/experience";
import type { ExperienceEntry } from "../../data/experience";

type EntryProps = {
  entry: ExperienceEntry;
  /** Position of this entry along the line, 0..1. */
  at: number;
  progress: MotionValue<number>;
  still: boolean;
};

function TimelineEntry({ entry, at, progress, still }: EntryProps) {
  // The dot lights up the moment the drawn line reaches it
  const lit = useTransform(progress, [at - 0.04, at + 0.02], [0, 1]);
  const dotScale = useTransform(lit, [0, 1], [0.5, 1]);

  return (
    <motion.li
      className="relative grid md:grid-cols-[200px_1fr] gap-3 md:gap-8 pl-8 md:pl-0"
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -18% 0px" }}
      transition={{ duration: 0.55, ease: ease.out }}
    >
      <span aria-hidden="true" className="absolute left-[3px] md:left-[195px] top-1.5 w-2.5 h-2.5 rounded-full border border-border bg-canvas" />
      <motion.span
        aria-hidden="true"
        className="absolute left-[3px] md:left-[195px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand"
        style={still ? undefined : { opacity: lit, scale: dotScale }}
      />
      <div className="text-sm">
        <p className="font-mono text-xs text-faint mb-1">{entry.period}</p>
        <p className="font-medium text-muted">{entry.company}</p>
      </div>
      <div>
        <h3 className="font-display font-bold text-fg text-xl mb-2 tracking-tight">{entry.title}</h3>
        <p className="text-muted text-sm leading-relaxed mb-4">{entry.detail}</p>
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span key={tag} className="border border-border text-faint text-xs px-2 py-0.5 rounded-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.li>
  );
}

/** Experience with a timeline that draws itself in step with the scroll position. */
export default function DepthTimeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotionPreference();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  // Light smoothing so the line feels drawn, without lagging behind the page
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });
  const count = experiences.length;
  const [stops, setStops] = useState<number[]>(() => experiences.map((_, i) => (count > 1 ? i / (count - 1) : 0)));

  // Where each dot sits along the line, measured from the rendered layout
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const height = list.offsetHeight || 1;
      setStops(Array.from(list.children, (child) => ((child as HTMLElement).offsetTop + 10) / height));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="relative bg-canvas border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <p className="font-mono text-xs text-faint mb-3">{experienceHeading.eyebrow}</p>
        <h2 className="font-display font-bold text-fg text-4xl md:text-6xl tracking-[-0.03em] leading-[1] mb-16">
          {experienceHeading.title}
        </h2>

        <div className="relative">
          <span aria-hidden="true" className="absolute left-[7px] md:left-[199px] top-0 bottom-0 w-px bg-border" />
          <motion.span
            aria-hidden="true"
            className="absolute left-[7px] md:left-[199px] top-0 bottom-0 w-px bg-brand origin-top"
            style={{ scaleY: reduceMotion ? 1 : progress }}
          />
          <ol ref={listRef} className="space-y-14">
            {experiences.map((entry, i) => (
              <TimelineEntry
                key={entry.title}
                entry={entry}
                at={stops[i] ?? 0}
                progress={progress}
                still={reduceMotion}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
