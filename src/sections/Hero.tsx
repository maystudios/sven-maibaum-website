import { motion } from 'motion/react';
import FlipWords from "../components/FlipWords";

const heroTags = ['Unreal Engine', 'Java / Spring Boot', 'React', 'Python / KI', 'Unity'];

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-canvas min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Blue radial gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 70%)" }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, rgba(59,130,246,0.5), transparent)" }}
      />

      {/* Geometric grid background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Vertical lines – 12 columns */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${(i + 1) * (100 / 13)}%`, backgroundColor: 'rgba(39,39,42,0.4)' }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: i * 0.06, ease: 'easeOut' }}
          />
        ))}
        {/* Horizontal lines – 8 rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{ top: `${(i + 1) * (100 / 9)}%`, backgroundColor: 'rgba(39,39,42,0.3)' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.2 + i * 0.07, ease: 'easeOut' }}
          />
        ))}
        {/* Accent dot 1 */}
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-brand"
          style={{ left: `calc(100% / 13 * 3)`, top: `calc(100% / 9 * 3)`, transform: 'translate(-50%, -50%)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.7] }}
          transition={{ duration: 0.8, delay: 1.2 }}
        />
        {/* Accent dot 2 */}
        <motion.div
          className="absolute w-1 h-1 rounded-full bg-brandLight"
          style={{ left: `calc(100% / 13 * 9)`, top: `calc(100% / 9 * 6)`, transform: 'translate(-50%, -50%)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.5] }}
          transition={{ duration: 0.8, delay: 1.5 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left column: text */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Accent line + eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-brand/60" />
              <span className="text-xs uppercase tracking-widest text-faint">
                Software-Architekt &amp;{" "}
                <FlipWords
                  words={["Spieleentwickler", "Full-Stack-Entwickler", "KI-Enthusiast", "Unreal-Engine-Experte"]}
                  className="text-brand"
                />
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold font-display text-fg tracking-tight leading-none mb-6">
              Sven Maibaum
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted max-w-xl mb-8 leading-relaxed">
              Experte für Software-Architektur, Full-Stack Entwicklung &amp; Spieleentwicklung.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="swiss-btn-primary inline-flex items-center gap-2 min-h-[44px]"
              >
                Projekte ansehen
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="#contact"
                className="swiss-btn-secondary inline-flex items-center gap-2 min-h-[44px]"
              >
                Kontakt
              </a>
            </div>
          </motion.div>

          {/* Right column: profile image + tags */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-center lg:items-end gap-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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

            {/* Skill tags */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-2">
              {heroTags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.35, delay: 0.6 + i * 0.07, ease: "easeOut" }}
                  className="border border-border text-muted text-xs uppercase tracking-wide px-3 py-1.5 rounded-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
