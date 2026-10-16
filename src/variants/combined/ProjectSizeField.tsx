import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SizeSlider from "./SizeSlider";
import SizePanel from "./SizePanel";
import { ease } from "../shared/motionTokens";
import { projectSizeLevels } from "../../data/projectSize";

const ANNOUNCE_DELAY_MS = 450;

/**
 * Project size field of variant 4: the slider with a readout on the left, the
 * live illustration on the right (below on narrow screens). The panel shows
 * scope only; it is no reference to built systems.
 */
export default function ProjectSizeField() {
  const descriptionId = useId();
  const [value, setValue] = useState(3);
  const [announcement, setAnnouncement] = useState("");
  const level = projectSizeLevels[value - 1];

  // Screen readers hear the settled level once, not every step of a drag
  useEffect(() => {
    const timer = window.setTimeout(() => setAnnouncement(`${level.label}: ${level.example}`), ANNOUNCE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [level]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div className="lg:col-span-5">
        <SizeSlider value={value} onChange={setValue} describedBy={descriptionId} />
        <div className="mt-7">
          <div className="h-12 md:h-14 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={value}
                className="mv-size-label is-active font-display font-bold text-4xl md:text-5xl tracking-[-0.03em] leading-none"
                data-step={value}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.32, ease: ease.out }}
              >
                {level.label}
              </motion.p>
            </AnimatePresence>
          </div>
          <p id={descriptionId} className="mt-3 text-muted leading-relaxed min-h-[3.5rem]">
            {level.example}
          </p>
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
      <div className="lg:col-span-7">
        <SizePanel level={value} />
      </div>
    </div>
  );
}
