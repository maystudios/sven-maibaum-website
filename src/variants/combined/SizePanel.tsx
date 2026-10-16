import { useEffect, useRef, useState } from "react";
import { useReducedMotionPreference } from "../motionPreference";
import type { SceneTheme } from "./sceneManifest";
import type { JourneyPlayer } from "./journeyPlayer";
import { projectSizeLevels } from "../../data/projectSize";

type SizePanelProps = {
  level: number;
};

const currentTheme = (): SceneTheme =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

const MEDIA = "absolute inset-0 w-full h-full object-cover";

/**
 * The size scene next to the slider: a camera journey from a script to
 * connected campuses (see journeyPlayer.ts). The player is a separate chunk
 * that loads when the contact section is about 800 px away; it plays only
 * while the panel is visible and follows the site theme live.
 */
export default function SizePanel({ level }: SizePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stillBackRef = useRef<HTMLImageElement>(null);
  const stillFrontRef = useRef<HTMLImageElement>(null);
  const forwardRef = useRef<HTMLVideoElement>(null);
  const reverseRef = useRef<HTMLVideoElement>(null);
  const loopRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<JourneyPlayer | null>(null);
  const reduceMotion = useReducedMotionPreference();
  const latest = useRef({ level, reduceMotion });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    latest.current = { level, reduceMotion };
  }, [level, reduceMotion]);

  useEffect(() => {
    const container = containerRef.current;
    const elements = {
      stillBack: stillBackRef.current,
      stillFront: stillFrontRef.current,
      forward: forwardRef.current,
      reverse: reverseRef.current,
      loop: loopRef.current,
    };
    if (!container || Object.values(elements).some((el) => !el)) return;
    let disposed = false;
    const cleanups: (() => void)[] = [];

    const approach = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        approach.disconnect();
        import("./journeyPlayer")
          .then(({ JourneyPlayer }) => {
            if (disposed) return;
            const player = new JourneyPlayer({
              stillBack: elements.stillBack!,
              stillFront: elements.stillFront!,
              forward: elements.forward!,
              reverse: elements.reverse!,
              loop: elements.loop!,
              theme: currentTheme(),
              level: latest.current.level,
              reduced: latest.current.reduceMotion,
              onReady: () => setReady(true),
              onError: (error) => {
                console.error("Size scene could not be shown.", error);
                setFailed(true);
              },
            });
            playerRef.current = player;
            const visibility = new IntersectionObserver((visible) => {
              player.setPanelVisible(visible.some((entry) => entry.isIntersecting));
            });
            visibility.observe(container);
            const theme = new MutationObserver(() => player.setTheme(currentTheme()));
            theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
            cleanups.push(() => {
              visibility.disconnect();
              theme.disconnect();
            });
            player.start();
          })
          .catch((error: unknown) => {
            console.error("Size scene player could not be loaded.", error);
            if (!disposed) setFailed(true);
          });
      },
      { rootMargin: "800px 0px" }
    );
    approach.observe(container);

    return () => {
      disposed = true;
      approach.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    playerRef.current?.setLevel(level);
  }, [level]);

  useEffect(() => {
    playerRef.current?.setReducedMotion(reduceMotion);
  }, [reduceMotion]);

  const current = projectSizeLevels[level - 1];

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${current.label}: ${current.example}`}
      className="relative w-full aspect-[4/3] overflow-hidden border border-border bg-canvas"
    >
      <div className={`absolute inset-0 transition-opacity duration-500 ${ready && !failed ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
        <img ref={stillBackRef} alt="" className={MEDIA} decoding="async" />
        <img ref={stillFrontRef} alt="" className={MEDIA} decoding="async" />
        <video ref={forwardRef} className={MEDIA} muted playsInline preload="none" disablePictureInPicture tabIndex={-1} />
        <video ref={reverseRef} className={MEDIA} muted playsInline preload="none" disablePictureInPicture tabIndex={-1} />
        <video ref={loopRef} className={MEDIA} muted playsInline loop preload="none" disablePictureInPicture tabIndex={-1} />
      </div>
    </div>
  );
}
