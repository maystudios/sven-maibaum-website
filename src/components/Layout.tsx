import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;
  const isHome = path === "/";

  // Scroll to top on route change (unless navigating to a hash anchor)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // IntersectionObserver for .fade-in-up CSS animations (fallback)
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

  // Smooth scroll for nav-link anchors
  useEffect(() => {
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const scrollTo = (target: number, duration = 700) => {
      const start = window.scrollY;
      const distance = target - start;
      if (Math.abs(distance) < 2) return;
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        window.scrollTo(0, start + distance * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const getHeaderOffset = () => {
      const header = document.querySelector("header") as HTMLElement | null;
      return header ? header.offsetHeight : 64;
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      // Match any internal hash link (nav, hero CTAs, etc.)
      const anchor = target?.closest('a[href^="#"], a[href^="/#"]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank") return;

      const href = anchor.getAttribute("href") || "";
      const hash = href.startsWith("#") ? href : "#" + href.split("#")[1];
      if (!hash || hash.length < 2) return;

      const targetEl = document.querySelector(hash) as HTMLElement | null;
      if (!targetEl) return;

      event.preventDefault();
      const top = targetEl.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
      scrollTo(top);
      history.replaceState(null, "", hash);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [location.pathname]);

  // Smooth scroll to hash on navigation
  useEffect(() => {
    if (!location.hash) return;
    const targetEl = document.querySelector(location.hash) as HTMLElement | null;
    if (!targetEl) return;
    const header = document.querySelector("header") as HTMLElement | null;
    const headerOffset = header ? header.offsetHeight : 64;
    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    setTimeout(() => {
      const start = window.scrollY;
      const distance = top - start;
      if (Math.abs(distance) < 2) return;
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / 700, 1);
        window.scrollTo(0, start + distance * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 50);
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen bg-canvas">
      <Header isHome={isHome} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
