import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  isHome: boolean;
};

const getNavLinks = (isHome: boolean) => [
  { label: "Home", href: isHome ? "#home" : "/#home", hoverClass: "hover:text-teal-400" },
  { label: "Über Mich", href: isHome ? "#about" : "/#about", hoverClass: "hover:text-teal-400" },
  { label: "Showcase", href: "/showcase", hoverClass: "hover:text-purple-400" },
  { label: "Projekte", href: isHome ? "#projects" : "/#projects", hoverClass: "hover:text-teal-400" },
  { label: "Kontakt", href: isHome ? "#contact" : "/#contact", hoverClass: "hover:text-teal-400" },
];

export default function Header({ isHome }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const currentHash = location.hash;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    if (!menu) return;
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, details,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (first) first.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    menu.addEventListener("keydown", handleKeyDown);
    return () => menu.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const navLinks = getNavLinks(isHome);
  const isActiveLink = (href: string, label: string) => {
    if (href === "/showcase") return location.pathname === "/showcase";
    if (href.startsWith("/#")) return location.pathname === "/" && currentHash === href.replace("/", "");
    if (href.startsWith("#")) return location.pathname === "/" && currentHash === href;
    if (label === "Projekte" && location.pathname.startsWith("/projekte")) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center h-full">
        <a href="/#home" className="text-xl font-bold gradient-text nav-link relative z-50 py-2">
          Sven Maibaum
        </a>

        <div className="flex items-center">
          <nav className="hidden md:flex space-x-6 mr-6" aria-label="Hauptnavigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`${
                  isActiveLink(link.href, link.label)
                    ? link.label === "Showcase"
                      ? "text-purple-400"
                      : "text-teal-400"
                    : ""
                } ${link.hoverClass} transition duration-300 nav-link`}
                aria-current={isActiveLink(link.href, link.label) ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <ThemeToggle
            className="theme-switcher mr-4 md:mr-0 relative z-50 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
            title="Theme wechseln"
          />

          <div className="md:hidden flex items-center relative z-50">
            <button
              id="mobile-menu-button"
              className="focus:outline-none p-2 min-h-[44px] min-w-[44px] rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menü öffnen"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              ref={triggerRef}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`md:hidden fixed inset-0 z-[60] mobile-menu-overlay backdrop-blur-xl transform transition-transform duration-300 ease-in-out flex flex-col justify-center shadow-2xl ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "var(--bg-color-alt)", opacity: 1 }}
        role="dialog"
        aria-modal={open ? "true" : "false"}
        aria-hidden={open ? "false" : "true"}
        aria-label="Hauptmenü"
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <button
          id="close-mobile-menu-button"
          className="absolute top-6 right-6 p-4 min-h-[44px] min-w-[44px] rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Menü schließen"
          onClick={() => setOpen(false)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <nav className="flex flex-col items-center space-y-8 text-xl font-medium w-full">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`mobile-menu-link block w-full text-center py-4 min-h-[44px] transition-colors ${
                isActiveLink(link.href, link.label)
                  ? link.label === "Showcase"
                    ? "text-purple-400"
                    : "text-teal-400"
                  : ""
              } ${link.label === "Showcase" ? "hover:bg-purple-500/10" : "hover:bg-teal-500/10"}`}
              aria-current={isActiveLink(link.href, link.label) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label === "Showcase" ? "Architektur Showcase" : link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
