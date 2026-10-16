import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useReducedMotionPreference } from "../motionPreference";
import FlipWords from "../../components/FlipWords";
import NetworkSvg from "../../components/NetworkSvg";
import { ease } from "../shared/motionTokens";
import { buildLayers, forwardPass, initParams, layerDraw, seededRandom } from "../../lib/neuralNetwork";
import { heroCtas, heroEyebrow, heroIntro, heroName, heroRolePrefix, heroRoles, heroTags } from "../../data/hero";

// Same topology and geometry as the publication illustration
const TOPOLOGY = [3, 5, 4, 2];
const X_POSITIONS = [40, 120, 200, 280];
const MID_Y = 95;
const GAP_Y = 30;
const SPREAD = (X_POSITIONS[X_POSITIONS.length - 1] - X_POSITIONS[0]) * 0.4;
const INTRO_LEVEL = 0.4; // how far the intro pass runs before scrolling takes over

type NetworkState = { activations: number[][]; draw: number[] };

/**
 * The forward pass of Sven's network as the hero signature. On load the signal
 * enters the first layers; scrolling carries it through to the output, scrolling
 * back reverses it. Nothing reacts to the cursor.
 */
export default function SignatureHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotionPreference();

  // Deterministic weights and inputs: the signature looks the same on every visit
  const network = useMemo(() => {
    const random = seededRandom(20231105);
    const params = initParams(TOPOLOGY, random);
    const inputs = Array.from({ length: TOPOLOGY[0] }, () => random());
    return {
      layers: buildLayers(TOPOLOGY, X_POSITIONS, MID_Y, GAP_Y),
      absWeights: params.weights.map((layer) => layer.map((row) => row.map(Math.abs))),
      full: forwardPass(TOPOLOGY, inputs, params),
    };
  }, []);

  const computeState = (wave: number): NetworkState => {
    const xMin = X_POSITIONS[0];
    const xMax = X_POSITIONS[X_POSITIONS.length - 1];
    const waveX = xMin - SPREAD + (xMax - xMin + SPREAD * 2) * wave;
    const draw = layerDraw(X_POSITIONS, waveX, SPREAD);
    return { activations: network.full.map((layer, l) => layer.map((a) => a * draw[l])), draw };
  };

  const [state, setState] = useState<NetworkState>(() => computeState(reduceMotion ? 1 : 0));

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const intro = useMotionValue(0);
  const wave = useTransform([intro, scrollYProgress], ([i, p]) =>
    Math.min(1, Math.min(i as number, INTRO_LEVEL) + Math.min(1, (p as number) / 0.7) * (1 - INTRO_LEVEL))
  );

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(intro, INTRO_LEVEL, { duration: 1.8, delay: 0.3, ease: ease.out });
    return () => controls.stop();
  }, [intro, reduceMotion]);

  useMotionValueEvent(wave, "change", (w) => {
    if (!reduceMotion) setState(computeState(w));
  });

  // The network drifts a little slower than the page, so it sits in its own plane
  const networkY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen bg-canvas overflow-hidden flex items-center">
      {/* Swiss column grid */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-16 grid grid-cols-4 lg:grid-cols-12 gap-x-6">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.span
              key={i}
              className={`h-full border-l border-border origin-top ${i >= 4 ? "hidden lg:block" : ""}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.1, delay: i * 0.035, ease: ease.inOut }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pt-28 pb-16 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-10 items-center">
        <motion.div className="lg:col-span-6 flex flex-col gap-7" style={reduceMotion ? undefined : { y: textY }}>
          <motion.span
            className="font-mono text-xs text-brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {heroEyebrow}
          </motion.span>
          <motion.h1
            className="font-display font-extrabold text-fg tracking-[-0.045em] leading-[0.9] text-[clamp(3.4rem,8.5vw,7.5rem)]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: ease.out }}
          >
            {heroName}
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted leading-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: ease.out }}
          >
            {heroRolePrefix} <FlipWords words={heroRoles} className="text-fg" />
          </motion.p>
          <motion.p
            className="max-w-lg text-base md:text-lg text-muted leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: ease.out }}
          >
            {heroIntro}
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: ease.out }}
          >
            <a href="#projects" className="swiss-btn-primary min-h-[44px]">
              {heroCtas.projects}
            </a>
            <a href="#contact" className="swiss-btn-secondary min-h-[44px]">
              {heroCtas.contact}
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-6 relative"
          style={reduceMotion ? undefined : { y: networkY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <NetworkSvg
            layers={network.layers}
            activations={state.activations}
            absWeights={network.absWeights}
            drawProgress={state.draw}
            fadeAlpha={1}
            viewBox="0 0 320 210"
            className="w-full max-w-[640px] mx-auto overflow-visible"
            labelY={200}
            labelFont="'Geist Mono', ui-monospace, monospace"
          />
          <ul className="mt-6 flex flex-wrap justify-center lg:justify-end gap-2">
            {heroTags.map((tag, i) => (
              <motion.li
                key={tag}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.45 + i * 0.05, ease: ease.out }}
                className="border border-border text-muted text-xs font-mono px-3 py-1.5 rounded-sm bg-canvas"
              >
                {tag}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
