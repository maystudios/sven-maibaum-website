import { motion } from 'motion/react';
import FlipWords from "../components/FlipWords";

const heroTags = ['Unreal Engine', 'Java / Spring Boot', 'React', 'Python / KI', 'Unity'];

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-canvas min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Geometric grid background — 100×100 px cells */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {/* Vertical lines — 100 px spacing, covers up to ~4000 px wide (4K) */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${(i + 1) * 100}px`, backgroundColor: 'rgba(39,39,42,0.4)' }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: i * 0.06, ease: 'easeOut' }}
          />
        ))}
        {/* Horizontal lines — 100 px spacing, covers up to ~1800 px tall */}
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{ top: `${(i + 1) * 100}px`, backgroundColor: 'rgba(39,39,42,0.3)' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 70%)" }}
        />
      </div>

      {/* Top accent rule */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, transparent, rgba(59,130,246,0.5), transparent)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left column */}
          <div className="lg:col-span-7 flex flex-col gap-8">

            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="block w-6 h-px bg-brand" />
              <span className="text-xs font-mono uppercase tracking-widest text-brand">
                Portfolio
              </span>
            </motion.div>

            {/* Heading + subtitle */}
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-fg tracking-tight leading-none">
                Sven Maibaum
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted leading-tight mt-2">
                Experte für{" "}
                <FlipWords
                  words={["Software-Architektur", "Spieleentwicklung", "Full-Stack-Dev", "KI & Tooling"]}
                  className="text-brand"
                />
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              className="max-w-lg text-base md:text-lg text-muted leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              Ich baue skalierbare Systeme, immersive Spiele und smarte Tools –
              vom Backend bis zum Game Engine Plugin.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href="#projects"
                className="swiss-btn-primary inline-flex items-center justify-center min-h-[44px]"
              >
                Projekte ansehen
              </a>
              <a
                href="#contact"
                className="swiss-btn-secondary inline-flex items-center gap-2 min-h-[44px]"
              >
                Kontakt
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="translate-y-px">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
          </div>

          {/* Right column: profile image + tags */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-center lg:items-end gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="border border-border overflow-hidden rounded-sm"
              whileHover={{ boxShadow: "0 0 0 2px #3b82f6" }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={`${import.meta.env.BASE_URL}assets/images/sven_maibaum_profile.webp`}
                alt="Sven Maibaum - Profilbild"
                className="w-64 h-64 md:w-72 md:h-72 object-cover"
                loading="eager"
              />
            </motion.div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-2">
              {heroTags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.35, delay: 0.6 + i * 0.07, ease: "easeOut" }}
                  className="border border-border text-muted text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom accent rule */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-border/50 pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      />
    </section>
  );
}
