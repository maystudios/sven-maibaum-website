import { motion } from "motion/react";
import { Link } from "react-router-dom";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

export default function NotFound() {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-canvas"
      aria-label="404 – Seite nicht gefunden"
    >
      {/* Grid backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(var(--sw-border) 1px, transparent 1px),
              linear-gradient(90deg, var(--sw-border) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
            opacity: 0.35,
          }}
        />
        {/* Vignette – fades grid toward edges */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, var(--sw-bg) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow label */}
        <motion.p
          variants={rise}
          className="swiss-eyebrow text-brand mb-5 tracking-widest"
        >
          Fehler
        </motion.p>

        {/* Giant 404 */}
        <motion.div variants={rise} className="relative">
          <span
            aria-hidden="true"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "clamp(7rem, 28vw, 16rem)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              background:
                "linear-gradient(135deg, #3B82F6 0%, #60A5FA 55%, #93C5FD 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "block",
              userSelect: "none",
            }}
          >
            404
          </span>
          {/* Subtle reflection / ghost */}
          <span
            aria-hidden="true"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "clamp(7rem, 28vw, 16rem)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "var(--sw-border)",
              display: "block",
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              transform: "scaleY(-1)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 60%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 60%)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            404
          </span>
        </motion.div>

        {/* Horizontal rule – spacing below the reflection */}
        <motion.div
          variants={rise}
          className="mt-16 mb-7"
          style={{
            height: "1px",
            width: "clamp(200px, 40vw, 320px)",
            background: "var(--sw-border)",
          }}
        />

        {/* Headline */}
        <motion.h1
          variants={rise}
          className="swiss-heading-md text-fg mb-3"
        >
          Seite nicht gefunden
        </motion.h1>

        {/* Body copy */}
        <motion.p
          variants={rise}
          className="swiss-body text-muted mb-10"
          style={{ maxWidth: "30rem" }}
        >
          Diese Seite existiert nicht oder wurde verschoben. Vielleicht hilft
          dir die Startseite weiter.
        </motion.p>

        {/* Actions */}
        <motion.div
          variants={rise}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
          <Link
            to="/"
            className="swiss-btn-primary inline-flex items-center justify-center min-h-[44px] px-8"
          >
            Zurück zur Startseite
          </Link>
          <Link
            to="/#projekte"
            className="swiss-btn-secondary inline-flex items-center justify-center min-h-[44px] px-8"
          >
            Projekte ansehen
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
