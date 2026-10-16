import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../shared/motionTokens";

type ClipRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Reveal on mount instead of when scrolled into view. */
  immediate?: boolean;
};

/** Image reveal: a clip-path opens from the bottom while the content settles from a slight zoom. */
export function ClipReveal({ children, className = "", delay = 0, immediate = false }: ClipRevealProps) {
  const reduceMotion = useReducedMotion();
  const hidden = reduceMotion ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" };
  const shown = reduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" };
  const transition = { duration: reduceMotion ? 0.2 : 0.95, ease: ease.inOut, delay };
  const trigger = immediate ? { animate: shown } : { whileInView: shown, viewport: { once: true, margin: "0px 0px -8% 0px" } };

  return (
    <motion.div className={`overflow-hidden ${className}`} initial={hidden} transition={transition} {...trigger}>
      <motion.div
        className="w-full h-full"
        initial={{ scale: 1.18 }}
        transition={{ duration: 1.3, ease: ease.out, delay }}
        {...(immediate ? { animate: { scale: 1 } } : { whileInView: { scale: 1 }, viewport: { once: true } })}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

type RuleProps = {
  className?: string;
  delay?: number;
};

/** Hairline that draws itself from the left when it enters the viewport. */
export function Rule({ className = "", delay = 0 }: RuleProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`h-px bg-border origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 1.1, ease: ease.inOut, delay }}
    />
  );
}
