import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

type ProjectShellProps = {
  title: string;
  subtitle: string;
  heroImage: string;
  heroAlt: string;
  children: ReactNode;
  ctaLabel?: string;
  ctaLink?: string;
  hasSiteHeader?: boolean;
};

export default function ProjectShell({
  title,
  subtitle,
  heroImage,
  heroAlt,
  children,
  ctaLabel,
  ctaLink,
  hasSiteHeader = false,
}: ProjectShellProps) {
  return (
    <div className={`bg-canvas min-h-screen ${hasSiteHeader ? "pt-16" : ""}`}>
      {/* Back button – fixed top-left */}
      <Link
        to="/#projects"
        className={`back-to-portfolio fixed left-4 z-40 inline-flex items-center gap-2 text-sm min-h-[44px] ${hasSiteHeader ? "top-[72px]" : "top-4"}`}
        aria-label="Zurück zur Projektübersicht"
      >
        &larr; Alle Projekte
      </Link>

      {/* Hero image */}
      <motion.div
        className="border-b border-border overflow-hidden"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      >
        <img
          src={heroImage}
          alt={heroAlt}
          className="w-full max-h-[500px] object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-6 sm:px-10 py-16"
      >
        <div className="mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-fg tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-muted text-lg leading-relaxed">{subtitle}</p>
        </div>

        <div className="space-y-8 text-sm text-muted leading-relaxed project-detail-content">
          {children}

          {ctaLabel && ctaLink ? (
            <a
              href={ctaLink}
              target={ctaLink.startsWith("http") ? "_blank" : undefined}
              rel={ctaLink.startsWith("http") ? "noreferrer" : undefined}
              className="swiss-btn-primary inline-flex items-center px-6 py-3 text-sm min-h-[44px]"
            >
              {ctaLabel}
            </a>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
