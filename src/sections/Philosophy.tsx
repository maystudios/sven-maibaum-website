import { motion } from "motion/react";
import { philosophyHeading, philosophyItems } from "../data/philosophy";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Philosophy() {
  return (
    <section id="philosophy" className="bg-canvas border-t border-border py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest text-muted font-medium mb-4">
            {philosophyHeading.eyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-fg leading-tight">
            {philosophyHeading.title}
          </h2>
          <p className="mt-4 text-muted text-lg max-w-xl">
            {philosophyHeading.intro}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {philosophyItems.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="relative bg-canvas p-8 group cursor-default"
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ boxShadow: "inset 0 0 0 1px #3b82f6" }}
              />

              <div className="mb-5 inline-flex items-center justify-center w-10 h-10 bg-surface text-brand">
                <Icon size={20} strokeWidth={1.5} />
              </div>

              <h3 className="text-fg font-bold text-lg mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
