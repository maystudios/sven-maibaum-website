import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type FlipWordsProps = {
  words: string[];
  interval?: number;
  className?: string;
};

export default function FlipWords({ words, interval = 2500, className = "" }: FlipWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={`relative inline-block overflow-hidden ${className}`} style={{ verticalAlign: "bottom" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
