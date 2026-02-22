import ThemeToggle from "../components/ThemeToggle";

const currentYear = new Date().getFullYear();

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="sticky top-0 z-40 bg-surface/90 border-b border-border backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/#home" className="text-xl font-display font-bold text-fg">
            Sven Maibaum
          </a>
          <ThemeToggle title="Toggle theme" iconSizeClass="w-5 h-5" />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-5xl font-extrabold mb-4 text-fg">404</h1>
          <p className="text-xl mb-6 text-muted">Diese Seite existiert leider nicht.</p>
          <a
            href="/"
            className="swiss-btn-primary inline-flex items-center justify-center min-h-[44px] py-3 px-8 text-lg"
          >
            Zurück zur Startseite
          </a>
        </div>
      </main>

      <footer className="py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-faint">&copy; {currentYear} Sven Maibaum. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
