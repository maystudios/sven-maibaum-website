import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ease } from "../shared/motionTokens";

type MaskLinesProps = {
  text: string;
  className?: string;
  /** Seconds before the first line starts. */
  delay?: number;
  /** Seconds between two lines. */
  stagger?: number;
  /** Reveal on mount instead of when scrolled into view. */
  immediate?: boolean;
};

/**
 * Line-by-line mask reveal: every word sits in its own mask, words that share
 * a rendered line rise together. Line membership is measured after layout and
 * on resize, so it follows the real line breaks at every width.
 */
export default function MaskLines({ text, className = "", delay = 0, stagger = 0.06, immediate = false }: MaskLinesProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const [lineOf, setLineOf] = useState<number[]>([]);
  const words = text.split(" ");
  const show = immediate || inView;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const tops: number[] = [];
      const lines: number[] = [];
      el.querySelectorAll<HTMLElement>("[data-mask-word]").forEach((word) => {
        const top = word.offsetTop;
        let line = tops.findIndex((t) => Math.abs(t - top) < 4);
        if (line === -1) {
          tops.push(top);
          line = tops.length - 1;
        }
        lines.push(line);
      });
      setLineOf(lines);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return (
    <span ref={ref} className={`block ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span data-mask-word className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em]">
            <motion.span
              className="inline-block"
              initial={{ y: "112%" }}
              animate={{ y: show ? "0%" : "112%" }}
              transition={{ duration: 0.45, ease: ease.out, delay: delay + (lineOf[i] ?? 0) * stagger }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
