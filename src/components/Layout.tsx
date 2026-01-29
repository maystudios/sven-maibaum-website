import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;
  const isHome = path === "/";
  const projectPaths = new Set([
    "/projekte/heistline",
    "/projekte/mr-dork-3",
    "/projekte/liketik",
    "/projekte/exambyte",
    "/projekte/ki-marketing",
    "/projekte/itchio",
  ]);
  const isProjectPage = projectPaths.has(path);
  const specialDetailPages = new Set([
    "/projekte/liketik",
    "/projekte/exambyte",
    "/projekte/ki-marketing",
  ]);
  const isSpecialDetail = specialDetailPages.has(path);
  const isLegalPage = path === "/impressum" || path === "/datenschutz" || path === "/agb";
  const isShowcase = path === "/showcase";
  const isKnown = isHome || isProjectPage || isLegalPage || isShowcase;
  const isNotFound = !isKnown;
  const showHeader = (isHome || isProjectPage) && !isSpecialDetail;
  const showFooter = !isShowcase && !isNotFound && !isSpecialDetail;

  useEffect(() => {
    const animated = Array.from(document.querySelectorAll<HTMLElement>(".fade-in-up"));
    if (animated.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      animated.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animated.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a.nav-link") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const hash = href.startsWith("#")
        ? href
        : href.includes("#")
          ? "#" + href.split("#")[1]
          : "";
      if (!hash || hash.length < 2) return;

      const targetElement = document.querySelector(hash) as HTMLElement | null;
      if (!targetElement) return;

      event.preventDefault();
      const header = document.querySelector("header.fixed") as HTMLElement | null;
      const headerOffset = header ? header.offsetHeight : 0;
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      if (href.startsWith("/")) {
        history.replaceState(null, "", hash);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [location.pathname]);

  useEffect(() => {
    if (!location.hash) return;
    const targetElement = document.querySelector(location.hash) as HTMLElement | null;
    if (!targetElement) return;
    const header = document.querySelector("header.fixed") as HTMLElement | null;
    const headerOffset = header ? header.offsetHeight : 0;
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen">
      {showHeader ? <Header isHome={isHome} /> : null}
      <main>
        <Outlet />
      </main>
      {showFooter ? <Footer /> : null}
    </div>
  );
}
