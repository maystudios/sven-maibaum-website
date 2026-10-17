import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";
import SiteRoutes from "./SiteRoutes";
import { forceFullMotion } from "./motion/motionPreference";

/**
 * `reducedMotion="user"` makes every Motion animation fall back to
 * opacity-only when the visitor asks for less motion; the preview override
 * `?motion=full` switches that off (see motion/motionPreference.ts).
 */
export default function App() {
  useEffect(() => {
    // Page frames restore scroll positions themselves after their transition.
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MotionConfig reducedMotion={forceFullMotion ? "never" : "user"}>
        <SiteRoutes />
      </MotionConfig>
    </BrowserRouter>
  );
}
