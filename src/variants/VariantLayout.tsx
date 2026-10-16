import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useNavigationType, useOutlet } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Footer from "../components/Footer";
import VariantHeader from "./shared/VariantHeader";
import PageFrame from "./shared/PageFrame";
import MorphLayer from "./shared/MorphLayer";
import { glideTo, hashTargetTop, jumpTo } from "./shared/scroll";
import type { MotionVariant } from "./variant";

type VariantLayoutProps = {
  variant: MotionVariant;
};

const FILE_PATH = /\.[a-z0-9]{2,5}$/i;

function stripBase(pathname: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (base && pathname.startsWith(base)) return pathname.slice(base.length) || "/";
  return pathname;
}

/**
 * Layout for the motion variants: persistent header, animated page frames,
 * client-side navigation for plain links (so every route change can animate)
 * and scroll restoration for back/forward.
 */
export default function VariantLayout({ variant }: VariantLayoutProps) {
  const location = useLocation();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [mountedPath, setMountedPath] = useState(location.pathname);

  const locationRef = useRef(location);
  const navigationTypeRef = useRef(navigationType);
  const scrollPositions = useRef(new Map<string, number>());

  useEffect(() => {
    locationRef.current = location;
    navigationTypeRef.current = navigationType;
  }, [location, navigationType]);

  // Remember the scroll position of every history entry for back/forward
  useEffect(() => {
    const save = () => scrollPositions.current.set(locationRef.current.key, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, []);

  // Plain <a href="/..."> links (header, footer, content) navigate client-side,
  // so the page transition can play instead of a full reload.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const path = stripBase(url.pathname);
      if (FILE_PATH.test(path)) return;

      event.preventDefault();
      const current = locationRef.current;
      if (path === current.pathname) {
        if (url.hash) {
          const top = hashTargetTop(url.hash);
          if (top !== null) glideTo(top);
          navigate({ pathname: path, hash: url.hash }, { replace: true, preventScrollReset: true });
        } else {
          glideTo(0);
        }
        return;
      }
      navigate(path + url.search + url.hash);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [navigate]);

  // The old page has left: start the new one at the top (restored or hash
  // positions are applied once it has mounted).
  const handleExitComplete = useCallback(() => {
    jumpTo(0);
  }, []);

  const handlePageMounted = useCallback(() => {
    const current = locationRef.current;
    const saved = scrollPositions.current.get(current.key);
    if (navigationTypeRef.current === "POP" && saved !== undefined) {
      jumpTo(saved);
    } else if (current.hash) {
      const top = hashTargetTop(current.hash);
      if (top !== null) jumpTo(top);
      // Images above the anchor may still change the layout; settle once more.
      window.setTimeout(() => {
        const settled = hashTargetTop(current.hash);
        if (settled !== null && Math.abs(settled - window.scrollY) > 24) glideTo(settled, 400);
      }, 450);
    }
    setMountedPath(current.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-canvas" data-motion-variant={variant}>
      <VariantHeader pageKey={mountedPath} />
      <main>
        <AnimatePresence mode="wait" initial={false} onExitComplete={handleExitComplete}>
          <PageFrame key={location.pathname} variant={variant} onMounted={handlePageMounted}>
            {outlet}
            <Footer />
          </PageFrame>
        </AnimatePresence>
      </main>
      <MorphLayer />
    </div>
  );
}
