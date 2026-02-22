import { motion } from "motion/react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-5%" }}
      transition={{ staggerChildren: 0.12 }}
      className={`max-w-3xl ${isCenter ? "mx-auto text-center" : "text-left"} ${className}`}
    >
      {eyebrow ? (
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }}
          className={`flex items-center gap-3 mb-4 ${isCenter ? "justify-center" : ""}`}
        >
          <span
            className="block h-px w-8"
            style={{ background: "linear-gradient(to right, #3b82f6, transparent)" }}
            aria-hidden="true"
          />
          <p className="swiss-eyebrow">
            {eyebrow}
          </p>
        </motion.div>
      ) : null}

      <motion.h2
        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
        className="swiss-heading-lg"
      >
        {title}
      </motion.h2>

      {subtitle ? (
        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }}
          className={`mt-4 text-muted text-lg max-w-2xl leading-relaxed ${isCenter ? "mx-auto" : ""}`}
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
