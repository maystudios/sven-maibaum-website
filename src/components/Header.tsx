import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggleMorph from "./ThemeToggle";
import { useReducedMotionPreference } from "../motion/motionPreference";
import { ease, spring } from "../motion/motionTokens";
import { getNavLinks, homeSectionIds } from "../data/navigation";

type HeaderProps = {
  /** Pathname of the page that is currently mounted (lags behind the URL during a transition). */
  pageKey: string;
};

export default function Header({ pageKey }: HeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useReducedMotionPreference();
  const menuHidden = reduceMotion ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" };
  const menuShown = reduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track the active home section once the page behind the transition has mounted
  useEffect(() => {
    if (pageKey !== "/") return;
    const sections = homeSectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;
    // The section that crosses a thin band at 40 % of the viewport is active;
    // this also works for sections far taller than the screen (pinned projects).
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActiveSection(hit.target.id);
      },
      { threshold: 0, rootMargin: "-40% 0px -59% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pageKey]);

  // Close the mobile menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with router navigation
  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Keyboard trap for the mobile menu
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    if (!menu) return;
    const focusable = menu.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
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
    if (label === "Projekte" && location.pathname.startsWith("/projekte")) return true;
    if (!isHome) return false;
    const hash = href.startsWith("#") ? href.slice(1) : href.includes("#") ? href.split("#")[1] : "";
    return hash === activeSection;
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: ease.out }}
      className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300"
      style={{ borderColor: scrolled ? "var(--sw-border)" : "transparent" }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 max-md:!opacity-100"
        style={{
          opacity: scrolled ? 1 : 0,
          background: "var(--sw-header-scrolled-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      />
      <nav className="relative flex items-center w-full max-w-7xl mx-auto h-16 px-6 sm:px-10 lg:px-16" aria-label="Hauptnavigation">
        <a
          href={isHome ? "#home" : "/#home"}
          className="mv-link text-lg font-bold tracking-tight text-fg shrink-0"
        >
          Sven Maibaum
        </a>

        <div className="header-desktop">
          {navLinks.map((link, i) => {
            const active = isActiveLink(link.href, link.label);
            return (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.04, ease: ease.out }}
                className={`mv-link relative text-sm py-2 transition-colors ${active ? "text-fg" : "text-muted hover:text-fg"}`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="mv-nav-active"
                    className="absolute -bottom-1 left-1/2 -ml-0.5 block w-1 h-1 rounded-full bg-brand"
                    transition={spring.snappy}
                  />
                )}
              </motion.a>
            );
          })}
          <ThemeToggleMorph />
        </div>

        <div className="header-mobile">
          <ThemeToggleMorph />
          <motion.button
            id="mobile-menu-button"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-muted hover:text-fg transition-colors"
            aria-label="Menü öffnen"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            ref={triggerRef}
            whileTap={{ scale: 0.88 }}
            transition={spring.press}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={menuHidden}
            animate={menuShown}
            exit={menuHidden}
            transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: ease.inOut }}
            className="md:hidden fixed inset-0 z-[60] bg-canvas flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Hauptmenü"
          >
            <div className="flex justify-end px-6 py-4">
              <motion.button
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center border border-border rounded-sm text-muted hover:text-fg transition-colors"
                aria-label="Menü schließen"
                onClick={() => setOpen(false)}
                whileTap={{ scale: 0.88 }}
                transition={spring.press}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            <nav className="flex flex-col justify-center flex-1 px-8 gap-1" aria-label="Mobile Navigation">
              {navLinks.map((link, i) => (
                <div key={link.label} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ ...spring.soft, delay: 0.12 + i * 0.04 }}
                    className={`block py-2 text-4xl font-bold tracking-tight min-h-[44px] ${
                      isActiveLink(link.href, link.label) ? "text-fg" : "text-muted"
                    }`}
                    aria-current={isActiveLink(link.href, link.label) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
