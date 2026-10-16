import { useId, useRef } from "react";
import type { PointerEvent } from "react";
import { motion } from "motion/react";
import { spring } from "../shared/motionTokens";
import { projectSizeLabel, projectSizeLevels } from "../../data/projectSize";

type SizeSliderProps = {
  value: number;
  onChange: (value: number) => void;
  /** Id of the element that explains the current level. */
  describedBy?: string;
};

const COUNT = projectSizeLevels.length;

/**
 * Five-step size slider with the level names inside the bar: filled levels
 * read dark on colour, the current one in bold with a handle at the end of the
 * fill and a stronger tick below. A visually hidden native range input keeps
 * arrow keys, Home/End and the slider semantics.
 */
export default function SizeSlider({ value, onChange, describedBy }: SizeSliderProps) {
  const id = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);

  const stepFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return value;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 0.9999);
    return Math.floor(ratio * COUNT) + 1;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    onChange(stepFromPointer(event.clientX));
    inputRef.current?.focus({ preventScroll: true });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) {
      const next = stepFromPointer(event.clientX);
      if (next !== value) onChange(next);
    }
  };

  const stopDragging = () => {
    dragging.current = false;
  };

  const fillClip = `inset(0% ${100 - value * 20}% 0% 0%)`;
  const glowClip = `inset(-14px ${100 - value * 20}% -14px 0%)`;
  const running = value >= 4;

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted">
        {projectSizeLabel}
      </label>

      <div
        ref={trackRef}
        className="mv-size relative h-14 cursor-pointer select-none touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <input
          ref={inputRef}
          id={id}
          type="range"
          min={1}
          max={COUNT}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-valuetext={projectSizeLevels[value - 1].label}
          aria-describedby={describedBy}
          className="peer absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        />

        <motion.div
          className="mv-size-glow absolute inset-x-0 top-0 h-10"
          initial={false}
          animate={{ clipPath: glowClip, opacity: running ? 0.7 : 0 }}
          transition={spring.snappy}
          aria-hidden="true"
        >
          <span className="mv-size-paint" data-step={value} />
          {running ? <span className="mv-size-sweep mv-size-sweep--glow" /> : null}
        </motion.div>

        <div
          className="mv-size-track absolute inset-x-0 top-0 h-10 rounded-[3px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brand"
          aria-hidden="true"
        >
          <span className="mv-size-base" />
          <motion.span
            className="absolute inset-0 overflow-hidden"
            initial={false}
            animate={{ clipPath: fillClip }}
            transition={spring.snappy}
          >
            <span className="mv-size-paint" data-step={value} />
            {running ? <span className="mv-size-sweep" /> : null}
          </motion.span>
        </div>

        {/* Level names inside the segments */}
        <div className="absolute inset-x-0 top-0 h-10 grid grid-cols-5 pointer-events-none" aria-hidden="true">
          {projectSizeLevels.map((level, i) => {
            const filled = i + 1 <= value;
            const current = i + 1 === value;
            return (
              <span
                key={level.label}
                className={`flex items-center justify-center pr-1 font-mono text-[11px] sm:text-xs transition-colors duration-200 ${
                  filled ? "text-ink" : "text-faint"
                } ${current ? "font-bold" : filled ? "font-medium" : ""}`}
              >
                <motion.span initial={false} animate={{ scale: current ? 1.12 : 1 }} transition={spring.press}>
                  {level.label}
                </motion.span>
              </span>
            );
          })}
        </div>

        {/* Handle at the end of the fill */}
        <div className="absolute inset-x-0 -top-1 h-12 pointer-events-none" aria-hidden="true">
          <motion.span
            className="absolute inset-y-0 left-0 w-1/5"
            initial={false}
            animate={{ x: `${(value - 1) * 100}%` }}
            transition={spring.snappy}
          >
            <span className="absolute inset-y-0 right-[0.5px] w-[3px] rounded-full bg-fg shadow-[0_0_0_2px_var(--sw-bg)]" />
          </motion.span>
        </div>

        {/* Stop marks */}
        <div className="absolute inset-x-0 top-12 grid grid-cols-5 pointer-events-none" aria-hidden="true">
          {projectSizeLevels.map((level, i) => (
            <span key={level.label} className="flex justify-center pr-1">
              <span
                className={`block w-px transition-all duration-200 ${i + 1 === value ? "h-2 bg-fg" : "h-1 bg-slate"}`}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
