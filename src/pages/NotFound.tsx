import ThemeToggle from "../components/ThemeToggle";

const currentYear = new Date().getFullYear();

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glassmorphism shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/#home" className="text-xl font-bold gradient-text">
            Sven Maibaum
          </a>
          <ThemeToggle className="theme-switcher" title="Toggle theme" iconSizeClass="w-5 h-5" />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-5xl font-extrabold mb-4 gradient-text">404</h1>
          <p className="text-xl mb-6">Diese Seite existiert leider nicht.</p>
          <a
            href="/"
            className="bg-gradient-to-r text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 inline-block shadow-lg glow-effect"
          >
            Zurück zur Startseite
          </a>
        </div>
      </main>

      <footer className="py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {currentYear} Sven Maibaum. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
