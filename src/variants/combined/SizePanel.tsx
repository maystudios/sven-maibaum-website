import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import SizeDiagram from "./SizeDiagram";
import type { SizeScene } from "./sizeScene";

type SizePanelProps = {
  level: number;
};

type Mode = "pending" | "webgl" | "fallback";

/**
 * Live illustration next to the size slider. three.js is imported only when
 * the panel comes near the viewport (separate chunk), renders only while the
 * panel is visible, shows still frames under reduced motion and falls back to
 * the SVG diagram when WebGL is unavailable.
 */
export default function SizePanel({ level }: SizePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SizeScene | null>(null);
  const levelRef = useRef(level);
  const reduceMotion = useReducedMotion() === true;
  const reduceRef = useRef(reduceMotion);
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    levelRef.current = level;
    reduceRef.current = reduceMotion;
  }, [level, reduceMotion]);

  // Load three.js once the contact section approaches
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        import("./sizeScene")
          .then(({ createSizeScene }) => {
            const canvas = canvasRef.current;
            if (cancelled || !canvas) return;
            const scene = createSizeScene(canvas);
            if (!scene) {
              console.info("Size panel: WebGL is not available, showing the 2D diagram instead.");
              setMode("fallback");
              return;
            }
            const rect = canvas.getBoundingClientRect();
            scene.resize(rect.width, rect.height);
            scene.setReducedMotion(reduceRef.current);
            scene.setLevel(levelRef.current, true);
            sceneRef.current = scene;
            setMode("webgl");
          })
          .catch((error: unknown) => {
            console.error("Size panel: three.js could not be loaded, showing the 2D diagram.", error);
            if (!cancelled) setMode("fallback");
          });
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setLevel(level, reduceMotion);
  }, [level, reduceMotion]);

  useEffect(() => {
    sceneRef.current?.setReducedMotion(reduceMotion);
  }, [reduceMotion]);

  // Render only while visible; follow size and theme changes
  useEffect(() => {
    const scene = sceneRef.current;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (mode !== "webgl" || !scene || !container || !canvas) return;
    const visibility = new IntersectionObserver((entries) => {
      scene.setRunning(entries.some((entry) => entry.isIntersecting));
    });
    visibility.observe(container);
    const sizing = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      scene.resize(rect.width, rect.height);
    });
    sizing.observe(canvas);
    const theme = new MutationObserver(() => scene.refreshTheme());
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      visibility.disconnect();
      sizing.disconnect();
      theme.disconnect();
      scene.setRunning(false);
    };
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] lg:aspect-[16/11] overflow-hidden border border-border bg-canvas"
      aria-hidden="true"
    >
      {mode !== "webgl" ? <SizeDiagram level={level} /> : null}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${mode === "webgl" ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
