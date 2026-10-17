import { useId } from "react";
import { motion } from "motion/react";
import { useTheme } from "../lib/useTheme";
import { spring } from "../motion/motionTokens";

const RAYS = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
const TITLE = "Theme wechseln";

/** Sun and moon are one shape: a mask circle slides in to cut the crescent, rays retract. */
export default function ThemeToggleMorph() {
  const { theme, toggleTheme } = useTheme();
  const maskId = useId();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={TITLE}
      title={TITLE}
      aria-pressed={isDark}
      whileTap={{ scale: 0.86 }}
      transition={spring.press}
      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-sm text-muted hover:text-fg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
    >
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        aria-hidden="true"
        initial={false}
        animate={{ rotate: isDark ? 30 : 90 }}
        transition={spring.soft}
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle
            r="8"
            fill="black"
            initial={false}
            animate={isDark ? { cx: 17, cy: 6 } : { cx: 30, cy: -4 }}
            transition={spring.soft}
          />
        </mask>
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{ r: isDark ? 9 : 5 }}
          transition={spring.soft}
        />
        <motion.g
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.3 : 1 }}
          transition={spring.soft}
          style={{ originX: "12px", originY: "12px" }}
        >
          {RAYS.map((angle) => (
            <line
              key={angle}
              x1={12 + Math.cos(angle) * 8}
              y1={12 + Math.sin(angle) * 8}
              x2={12 + Math.cos(angle) * 10.5}
              y2={12 + Math.sin(angle) * 10.5}
            />
          ))}
        </motion.g>
      </motion.svg>
    </motion.button>
  );
}
