import { motion } from "motion/react";
import MaskLines from "./MaskLines";
import { Rule } from "./Reveal";
import { ease } from "../shared/motionTokens";

type EditorialHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  id?: string;
};

/**
 * Section opener: hairline, a marginal label in the left column and a large
 * headline whose lines rise out of their masks.
 */
export default function EditorialHeading({ eyebrow, title, intro, id }: EditorialHeadingProps) {
  // A label that only repeats the headline adds nothing; leave it out.
  const label = eyebrow && eyebrow !== title ? eyebrow : null;

  return (
    <div className="grid grid-cols-12 gap-x-3 md:gap-x-6 mb-14 md:mb-20">
      <Rule className="col-span-12 mb-5 md:mb-7" />
      <div className="col-span-12 md:col-span-3">
        {label ? (
          <motion.p
            className="font-mono text-xs text-faint mb-4 md:mb-0 md:pt-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {label}
          </motion.p>
        ) : null}
      </div>
      <h2
        id={id}
        className="col-span-12 md:col-span-9 font-display font-bold text-fg tracking-[-0.035em] leading-[0.95] text-[clamp(2.4rem,6.4vw,5.75rem)]"
      >
        <MaskLines text={title} />
      </h2>
      {intro ? (
        <motion.p
          className="col-span-12 md:col-start-4 md:col-span-7 lg:col-span-6 mt-6 md:mt-8 text-muted text-lg leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: ease.out }}
        >
          {intro}
        </motion.p>
      ) : null}
    </div>
  );
}
