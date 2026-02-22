import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

type HeaderProps = {
  isHome: boolean;
};

const getNavLinks = (isHome: boolean) => [
  { label: "Home",       href: isHome ? "#home"       : "/#home"       },
  { label: "Über Mich",  href: isHome ? "#about"      : "/#about"      },
  { label: "Ansatz",     href: isHome ? "#philosophy" : "/#philosophy" },
  { label: "Projekte",   href: isHome ? "#projects"   : "/#projects"   },
  { label: "Tech Stack", href: isHome ? "#skills"     : "/#skills"     },
  { label: "Kontakt",    href: isHome ? "#contact"    : "/#contact"    },
];

export default function Header({ isHome }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (!isHome) return;
    const ids = ["home", "about", "philosophy", "skills", "projects", "contact"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Pick section with largest intersection ratio
        const top = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
        setActiveSection(top.target.id);
      },
      { threshold: [0.2, 0.5], rootMargin: "-64px 0px -30% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome, location.pathname]);

  // Close mobile menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with router navigation
  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Keyboard trap for mobile menu
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
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    menu.addEventListener("keydown", handleKeyDown);
    return () => menu.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const navLinks = getNavLinks(isHome);
  const isActiveLink = (href: string, label: string) => {
    if (href === "/showcase") return location.pathname === "/showcase";
    if (label === "Projekte" && location.pathname.startsWith("/projekte")) return true;
    if (!isHome) return false;
    const hash = href.startsWith("#") ? href.slice(1) : href.includes("#") ? href.split("#")[1] : "";
    return hash === activeSection;
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
      style={{
        background: scrolled ? "rgba(9,9,11,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderColor: scrolled ? "rgba(39,39,42,0.8)" : "transparent",
      }}
    >
      <nav className="header-inner" aria-label="Hauptnavigation">
        {/* Logo – hard left */}
        <a
          href="/#home"
          className="text-lg font-bold tracking-tight text-fg hover:text-fg/80 transition-colors"
          style={{ flexShrink: 0 }}
        >
          Sven Maibaum
        </a>

        {/* Desktop: links */}
        <div className="header-desktop">
          {navLinks.map((link, i) => {
            const active = isActiveLink(link.href, link.label);
            return (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                className="text-sm transition-colors relative pb-1"
                style={{ color: active ? "#ffffff" : undefined }}
                aria-current={active ? "page" : undefined}
              >
                <span className={active ? "text-white" : "text-muted hover:text-fg transition-colors"}>
                  {link.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 block w-1 h-1 rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Mobile: Burger */}
        <div className="header-mobile">
          <button
            id="mobile-menu-button"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-muted hover:text-fg transition-colors"
            aria-label="Menü öffnen"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            ref={triggerRef}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-[60] bg-canvas border-b border-border flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Hauptmenü"
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            {/* Close button */}
            <div className="flex justify-end px-6 py-4">
              <button
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center border border-border hover:border-muted rounded-sm text-muted hover:text-fg transition-colors"
                aria-label="Menü schließen"
                onClick={() => setOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col items-center justify-center flex-1 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`block w-full text-center py-4 text-lg font-display tracking-wide min-h-[44px] transition-colors ${
                    isActiveLink(link.href, link.label)
                      ? "text-fg"
                      : "text-muted hover:text-fg"
                  }`}
                  aria-current={isActiveLink(link.href, link.label) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
