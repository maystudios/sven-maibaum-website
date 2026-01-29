export default function Hero() {
  return (
    <section
      id="home"
      className="hero-section min-h-screen flex items-center justify-center section-padding fade-in-up"
    >
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4">
          <span className="gradient-text">Sven Maibaum</span>
        </h1>
        <p className="text-xl md:text-2xl mb-3 max-w-3xl mx-auto">
          Leitender Software-Architekt | Spieleentwickler
        </p>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Experte für Software-Architektur, Full-Stack Entwicklung & Spieleentwicklung.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#projects"
            className="bg-gradient-to-r text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 inline-block shadow-lg glow-effect nav-link"
          >
            Meine Projekte entdecken
          </a>
          <a
            href="/showcase"
            className="bg-gradient-to-r text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 inline-block shadow-lg glow-effect"
          >
            Architektur Showcase <i className="fas fa-cogs ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
