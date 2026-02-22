export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center text-center px-6 bg-canvas">
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
  );
}
