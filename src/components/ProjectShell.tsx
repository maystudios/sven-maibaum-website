import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotionPreference } from "../motion/motionPreference";
import { useMorphTarget, useMorphState } from "../motion/morph";
import { ease } from "../motion/motionTokens";

export type ProjectShellProps = {
  title: string;
  subtitle: string;
  heroImage: string;
  heroAlt: string;
  children: ReactNode;
  ctaLabel?: string;
  ctaLink?: string;
};

/**
 * Project page shell. The hero image and the title are the landing spots of
 * the shared-element morph; afterwards the hero recedes slightly while
 * scrolling. The site header is always shown, so every page reserves its height.
 */
export default function ProjectShell({
  title,
  subtitle,
  heroImage,
  heroAlt,
  children,
  ctaLabel,
  ctaLink,
}: ProjectShellProps) {
  const { pathname } = useLocation();
  // The route this page was mounted for; useLocation already reports the next
  // route while the page is still playing its exit animation.
  const [route] = useState(pathname);
  const clipRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotionPreference();

  const morph = useMorphState();
  const [arrivedByMorph] = useState(() => morph !== null && morph.source.route === route);
  const hiddenUnderClone = useMorphTarget(route, { clip: clipRef, image: imageRef, title: titleRef });

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 140]);
  const heroScale = useTransform(scrollY, [0, 700], [1, 1.08]);

  const contentDelay = arrivedByMorph ? 0.3 : 0.12;

  return (
    <div className="bg-canvas min-h-screen pt-16">
      <Link
        to="/#projects"
        className="back-to-portfolio fixed left-4 top-[72px] z-40 inline-flex items-center gap-2 text-sm min-h-[44px]"
        aria-label="Zurück zur Projektübersicht"
      >
        &larr; Alle Projekte
      </Link>

      <div
        ref={clipRef}
        className="relative w-full h-[clamp(220px,58vh,540px)] overflow-hidden border-b border-border"
        style={{ opacity: hiddenUnderClone ? 0 : 1 }}
      >
        <motion.div className="absolute inset-0" style={reduceMotion ? undefined : { y: heroY, scale: heroScale }}>
          <motion.img
            ref={imageRef}
            src={heroImage}
            alt={heroAlt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={arrivedByMorph ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: ease.out }}
          />
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16">
        <div className="mb-12">
          <motion.h1
            ref={titleRef}
            className="font-display text-3xl sm:text-4xl font-bold text-fg tracking-tight"
            style={{ opacity: hiddenUnderClone ? 0 : 1 }}
            initial={arrivedByMorph ? false : { y: 18 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: ease.out }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="mt-4 text-muted text-lg leading-relaxed"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: contentDelay, ease: ease.out }}
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          className="space-y-8 text-sm text-muted leading-relaxed project-detail-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: contentDelay + 0.08, ease: ease.out }}
        >
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
        </motion.div>
      </div>
    </div>
  );
}
