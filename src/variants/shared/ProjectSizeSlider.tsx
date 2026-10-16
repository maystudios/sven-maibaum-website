import { useId, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { motion } from "motion/react";
import { spring } from "./motionTokens";
import { projectSizeLabel, projectSizeLevels } from "../../data/projectSize";

/** Owner's labels (16.10.2026), from a tiny to a very large project. */
const STEPS = projectSizeLevels.map((level) => level.label);
const LABEL = projectSizeLabel;

type ProjectSizeSliderProps = {
  defaultValue?: 1 | 2 | 3 | 4 | 5;
};

/**
 * Five-step project size slider for the contact form (prototype, not submitted).
 * A visually hidden native range input provides keyboard control (arrow keys,
 * Home/End) and the slider semantics; pointer input is mapped to the visible
 * segments. Colours: yellow, green, cyan to purple, purple with a running glow,
 * running rainbow. Running effects stop under reduced motion (see index.css).
 */
export default function ProjectSizeSlider({ defaultValue = 3 }: ProjectSizeSliderProps) {
  const id = useId();
  const [value, setValue] = useState<number>(defaultValue);
  const trackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);

  const stepFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return value;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 0.9999);
    return Math.floor(ratio * STEPS.length) + 1;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setValue(stepFromPointer(event.clientX));
    inputRef.current?.focus({ preventScroll: true });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) setValue(stepFromPointer(event.clientX));
  };

  const stopDragging = () => {
    dragging.current = false;
  };

  const fillClip = `inset(0% ${100 - value * 20}% 0% 0%)`;
  const glowClip = `inset(-14px ${100 - value * 20}% -14px 0%)`;
  const running = value >= 4;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted">
        {LABEL}
      </label>

      <div
        ref={trackRef}
        className="mv-size relative h-11 cursor-pointer select-none touch-pan-y"
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
          max={STEPS.length}
          step={1}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          aria-valuetext={STEPS[value - 1]}
          className="mv-size-input peer absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        />

        {/* Glow under the bar, only for the two largest sizes */}
        <motion.div
          className="mv-size-glow absolute inset-x-0 top-1/2 h-2.5 -mt-[5px]"
          initial={false}
          animate={{ clipPath: glowClip, opacity: running ? 0.75 : 0 }}
          transition={spring.snappy}
          aria-hidden="true"
        >
          <span className="mv-size-paint" data-step={value} />
          {running ? <span className="mv-size-sweep mv-size-sweep--glow" /> : null}
        </motion.div>

        <div
          className="mv-size-track absolute inset-x-0 top-1/2 h-2.5 -mt-[5px] rounded-[2px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[6px] peer-focus-visible:outline-brand"
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

        {/* Knob centred on the current segment */}
        <div className="absolute inset-x-0 top-1/2 h-0 pointer-events-none" aria-hidden="true">
          <motion.span
            className="absolute top-0 left-0 w-1/5 flex justify-center"
            initial={false}
            animate={{ x: `${(value - 1) * 100}%` }}
            transition={spring.snappy}
          >
            <motion.span
              key={value}
              className="block w-4 h-4 -mt-2 rounded-[3px] bg-fg shadow-[0_0_0_3px_var(--sw-bg)]"
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={spring.press}
            />
          </motion.span>
        </div>
      </div>

      <div className="grid grid-cols-5 font-mono text-[11px] leading-none" aria-hidden="true">
        {STEPS.map((step, i) => (
          <span
            key={step}
            className={`mv-size-label text-center transition-colors duration-200 ${i + 1 === value ? "is-active" : "text-faint"}`}
            data-step={i + 1}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
