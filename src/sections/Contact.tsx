export default function Contact() {
  return (
    <section id="contact" className="section-padding fade-in-up">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="gradient-text">Nehmen Sie Kontakt auf</span>
        </h2>
        <div className="max-w-2xl mx-auto glassmorphism p-8 md:p-10 rounded-xl shadow-2xl">
          <p className="text-center mb-6 max-w-lg mx-auto">
            Ich freue mich auf Ihre Anfrage! Füllen Sie einfach das Formular aus oder kontaktieren Sie mich direkt.
          </p>
          <div className="formspree-form-container">
            <form action="https://formspree.io/f/xvgrpazj" className="fs-form" target="_top" method="POST">
              <div className="fs-field">
                <label className="fs-label" htmlFor="name">Ihr Name</label>
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
                <label className="fs-label" htmlFor="email">Ihre E-Mail</label>
                <input
                  className="fs-input"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="max.mustermann@example.com"
                  required
                />
                <p className="fs-description">Damit ich Ihnen per E-Mail antworten kann.</p>
              </div>
              <div className="fs-field">
                <label className="fs-label" htmlFor="message">Ihre Nachricht</label>
                <textarea
                  className="fs-textarea"
                  id="message"
                  name="message"
                  placeholder="Ihre Anfrage..."
                  required
                ></textarea>
                <p className="fs-description">Was möchten Sie besprechen?</p>
              </div>
              <div className="fs-button-group">
                <button className="fs-button" type="submit">Nachricht Senden</button>
              </div>
            </form>
          </div>
          <div className="mt-10 text-center">
            <p className="mb-2">Oder erreichen Sie mich direkt:</p>
            <a
              href="mailto:contact@sven-maibaum.com"
              className="text-teal-400 hover:text-teal-300 transition duration-300"
            >
              contact@sven-maibaum.com
            </a>
            <div className="mt-6 flex justify-center space-x-6">
              <a
                href="https://www.linkedin.com/in/sven-maibaum/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition duration-300"
                aria-label="Sven Maibaum auf LinkedIn"
              >
                <i className="fab fa-linkedin fa-2x"></i>
              </a>
              <a
                href="https://github.com/maystudios"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition duration-300"
                aria-label="Sven Maibaum auf GitHub"
              >
                <i className="fab fa-github fa-2x"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
