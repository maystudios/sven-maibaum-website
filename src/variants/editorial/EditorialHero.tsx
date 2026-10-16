import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotionPreference } from "../motionPreference";
import MaskLines from "./MaskLines";
import { ClipReveal } from "./Reveal";
import { ease, spring } from "../shared/motionTokens";
import { heroCtas, heroEyebrow, heroIntro, heroName, heroRolePrefix, heroRoles, heroTags, profileImage } from "../../data/hero";

const ROLE_INTERVAL_MS = 2400;

/**
 * Editorial opener: the name set as a poster headline, roles as an index
 * column whose highlight steps through the list. While scrolling away, the two
 * name lines drift apart horizontally.
 */
export default function EditorialHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotionPreference();
  const [activeRole, setActiveRole] = useState(0);
  const [first, ...rest] = heroName.split(" ");
  const last = rest.join(" ");

  useEffect(() => {
    const timer = window.setInterval(() => setActiveRole((i) => (i + 1) % heroRoles.length), ROLE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const firstX = useTransform(scrollYProgress, [0, 1], ["0vw", "-9vw"]);
  const lastX = useTransform(scrollYProgress, [0, 1], ["0vw", "7vw"]);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen bg-canvas overflow-hidden flex flex-col pt-24 md:pt-24 pb-10">
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 flex-1 flex flex-col">
        {/* Running head */}
        <div className="flex items-baseline justify-between gap-6 font-mono text-xs text-faint">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {heroEyebrow}
          </motion.span>
          <motion.ul
            className="hidden md:flex gap-5"
            initial="hidden"
            animate="shown"
            variants={{ shown: { transition: { staggerChildren: 0.05, delayChildren: 0.35 } } }}
          >
            {heroTags.map((tag) => (
              <motion.li key={tag} variants={{ hidden: { opacity: 0, y: -6 }, shown: { opacity: 1, y: 0 } }}>
                {tag}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <motion.div
          aria-hidden="true"
          className="mt-4 h-px bg-border origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: ease.inOut }}
        />

        <h1 className="mt-8 md:mt-10 font-display font-extrabold text-fg tracking-[-0.055em] leading-[0.84] text-[clamp(4.2rem,13.2vw,13rem)]">
          <motion.span className="block" style={reduceMotion ? undefined : { x: firstX }}>
            <MaskLines text={first} immediate delay={0.05} />
          </motion.span>
          <motion.span className="block md:pl-[14vw]" style={reduceMotion ? undefined : { x: lastX }}>
            <MaskLines text={last} immediate delay={0.13} />
          </motion.span>
        </h1>

        <div className="mt-auto pt-10 grid grid-cols-12 gap-x-3 md:gap-x-6 gap-y-10 items-end">
          {/* Roles as an index column */}
          <motion.div
            className="col-span-12 sm:col-span-6 lg:col-span-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: ease.out }}
          >
            <p className="font-mono text-xs text-faint mb-3">{heroRolePrefix}</p>
            <ul className="space-y-1">
              {heroRoles.map((role, i) => {
                const active = i === activeRole;
                return (
                  <li key={role} className="relative pl-5 text-xl md:text-2xl font-semibold tracking-tight">
                    {active ? (
                      <motion.span
                        layoutId="mv-hero-role"
                        className="absolute left-0 top-1/2 -mt-px w-3 h-0.5 bg-brand"
                        transition={spring.snappy}
                      />
                    ) : null}
                    <span className={`transition-colors duration-300 ${active ? "text-fg" : "text-faint"}`}>{role}</span>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            className="col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col gap-7"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38, ease: ease.out }}
          >
            <p className="text-base md:text-lg text-muted leading-relaxed max-w-sm">{heroIntro}</p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#projects" className="swiss-btn-primary min-h-[44px]">
                {heroCtas.projects}
              </a>
              <a href="#contact" className="swiss-btn-secondary min-h-[44px]">
                {heroCtas.contact}
              </a>
            </div>
          </motion.div>

          <div className="col-span-12 lg:col-span-4 flex lg:justify-end">
            <ClipReveal immediate delay={0.2} className="w-full max-w-[18rem] lg:max-w-[14rem] aspect-square border border-border">
              <img src={profileImage.src} alt={profileImage.alt} className="w-full h-full object-cover" loading="eager" />
            </ClipReveal>
          </div>

          <ul className="md:hidden col-span-12 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-faint">
            {heroTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
