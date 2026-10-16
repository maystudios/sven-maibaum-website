import { motion } from 'motion/react';
import SectionHeading from "../components/SectionHeading";
import AboutBio from "../components/AboutBio";
import { aboutHeading } from "../data/sections";
import { profileImage } from "../data/hero";

export default function About() {
  return (
    <section
      id="about"
      className="bg-canvas border-t border-border py-24"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <SectionHeading eyebrow={aboutHeading.eyebrow} title={aboutHeading.title} className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Left column: image */}
          <motion.div
            className="md:col-span-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-10%" }}
          >
            <motion.div
              className="border border-border overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(59,130,246,0.5)" }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={profileImage.src}
                alt={profileImage.alt}
                className="w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Right column: biography */}
          <motion.div
            className="md:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-10%" }}
          >
            <AboutBio />

            <motion.a
              href="#contact"
              className="swiss-btn-primary inline-flex items-center gap-2 mt-8 min-h-[44px]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {aboutHeading.cta}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="translate-y-px">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
