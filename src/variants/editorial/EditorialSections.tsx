import { motion } from "motion/react";
import AboutBio from "../../components/AboutBio";
import EditorialHeading from "./EditorialHeading";
import MaskLines from "./MaskLines";
import { ClipReveal, Rule } from "./Reveal";
import { ease } from "../shared/motionTokens";
import { profileImage } from "../../data/hero";
import { aboutHeading } from "../../data/sections";
import { philosophyHeading, philosophyItems } from "../../data/philosophy";
import { experienceHeading, experiences } from "../../data/experience";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -10% 0px" },
} as const;

/** About: portrait opens with a clip, the biography reads like a feature with a lead paragraph. */
export function EditorialAbout() {
  return (
    <section id="about" className="bg-canvas py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <EditorialHeading eyebrow={aboutHeading.eyebrow} title={aboutHeading.title} />
        <div className="grid grid-cols-12 gap-x-3 md:gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-28">
              <ClipReveal className="aspect-[4/5] border border-border">
                <img src={profileImage.src} alt={profileImage.alt} className="w-full h-full object-cover" loading="lazy" />
              </ClipReveal>
            </div>
          </div>
          <motion.div
            className="col-span-12 md:col-span-8 lg:col-span-7 lg:col-start-6"
            {...fadeUp}
            transition={{ duration: 0.55, ease: ease.out }}
          >
            <AboutBio className="mv-editorial-bio space-y-5 text-muted text-lg leading-relaxed" />
            <a href="#contact" className="swiss-btn-primary mt-10 min-h-[44px]">
              {aboutHeading.cta}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Philosophy: four principles as editorial rows, title left, text right. */
export function EditorialPhilosophy() {
  return (
    <section id="philosophy" className="bg-canvas py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <EditorialHeading eyebrow={philosophyHeading.eyebrow} title={philosophyHeading.title} intro={philosophyHeading.intro} />
        <ul>
          {philosophyItems.map(({ title, description }, i) => (
            <li key={title} className="grid grid-cols-12 gap-x-3 md:gap-x-6">
              <Rule className="col-span-12" delay={i * 0.06} />
              <h3 className="col-span-12 md:col-span-5 pt-6 md:pt-8 pb-3 md:pb-10 font-display font-bold text-fg tracking-[-0.03em] leading-[1.02] text-[clamp(1.75rem,3.4vw,2.9rem)]">
                <MaskLines text={title} />
              </h3>
              <motion.p
                className="col-span-12 md:col-span-6 md:col-start-7 pb-10 md:pt-9 text-muted leading-relaxed"
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.12, ease: ease.out }}
              >
                {description}
              </motion.p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Experience: a typeset table, one hairline per position. */
export function EditorialExperience() {
  return (
    <section id="experience" className="bg-canvas py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <EditorialHeading eyebrow={experienceHeading.eyebrow} title={experienceHeading.title} />
        <ul>
          {experiences.map((exp, i) => (
            <li key={exp.title} className="grid grid-cols-12 gap-x-3 md:gap-x-6">
              <Rule className="col-span-12" delay={i * 0.06} />
              <motion.p
                className="col-span-12 md:col-span-3 pt-6 md:pt-8 font-mono text-xs text-faint"
                {...fadeUp}
                transition={{ duration: 0.4, ease: ease.out }}
              >
                {exp.period}
              </motion.p>
              <div className="col-span-12 md:col-span-4 pt-3 md:pt-7">
                <h3 className="font-display font-bold text-fg text-2xl md:text-[1.75rem] tracking-tight leading-tight">
                  <MaskLines text={exp.title} />
                </h3>
                <p className="mt-2 text-muted">{exp.company}</p>
              </div>
              <motion.div
                className="col-span-12 md:col-span-5 pt-4 md:pt-8 pb-10"
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.1, ease: ease.out }}
              >
                <p className="text-muted text-sm leading-relaxed mb-4">{exp.detail}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="border border-border text-faint text-xs px-2 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
