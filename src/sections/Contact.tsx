import { motion } from "motion/react";
import SectionHeading from "../components/SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="swiss-section">
      <div className="swiss-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left column – info */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <SectionHeading eyebrow="Kontakt" title="Nehmen Sie Kontakt auf" align="left" className="mb-8" />
            <p className="swiss-body mb-10 max-w-md">
              Ich freue mich auf Ihre Anfrage! Füllen Sie einfach das Formular
              aus oder kontaktieren Sie mich direkt.
            </p>

            <nav className="space-y-4" aria-label="Kontakt-Links">
              <motion.a
                href="https://github.com/maystudios"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-fg transition-colors group"
                aria-label="Sven Maibaum auf GitHub"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <span className="w-8 h-px bg-border group-hover:bg-brand transition-colors" />
                GitHub
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/sven-maibaum/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-fg transition-colors group"
                aria-label="Sven Maibaum auf LinkedIn"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <span className="w-8 h-px bg-border group-hover:bg-brand transition-colors" />
                LinkedIn
              </motion.a>
              <motion.a
                href="mailto:contact@sven-maibaum.com"
                className="flex items-center gap-3 text-muted hover:text-fg transition-colors group"
                aria-label="E-Mail an Sven Maibaum"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <span className="w-8 h-px bg-border group-hover:bg-brand transition-colors" />
                contact@sven-maibaum.com
              </motion.a>
            </nav>
          </motion.div>

          {/* Right column – form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <form
              action="https://formspree.io/f/xvgrpazj"
              className="fs-form"
              target="_top"
              method="POST"
            >
              <div className="fs-field">
                <label className="fs-label" htmlFor="name">
                  Ihr Name
                </label>
                <input
                  className="fs-input"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Max Mustermann"
                  required
                />
              </div>
              <div className="fs-field">
                <label className="fs-label" htmlFor="email">
                  Ihre E-Mail
                </label>
                <input
                  className="fs-input"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="max.mustermann@example.com"
                  required
                />
                <p className="fs-description">
                  Damit ich Ihnen per E-Mail antworten kann.
                </p>
              </div>
              <div className="fs-field">
                <label className="fs-label" htmlFor="message">
                  Ihre Nachricht
                </label>
                <textarea
                  className="fs-textarea"
                  id="message"
                  name="message"
                  placeholder="Ihre Anfrage..."
                  required
                />
                <p className="fs-description">
                  Was möchten Sie besprechen?
                </p>
              </div>
              <div className="fs-button-group">
                <button className="fs-button" type="submit">
                  Nachricht Senden
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
