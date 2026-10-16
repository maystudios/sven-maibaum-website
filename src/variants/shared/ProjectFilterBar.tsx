import { motion } from "motion/react";
import { spring } from "./motionTokens";
import { projectFilters } from "../../data/projects";

type ProjectFilterBarProps = {
  active: string;
  onChange: (id: string) => void;
  /** Distinguishes the sliding indicator when several bars could coexist. */
  indicatorId: string;
};

/** Project filter buttons with a spring indicator that slides to the active filter. */
export default function ProjectFilterBar({ active, onChange, indicatorId }: ProjectFilterBarProps) {
  return (
    <div className="relative mb-10 md:mb-14 flex flex-wrap items-center gap-2 border-b border-border pb-3">
      {projectFilters.map((filter) => {
        const isActive = filter.id === active;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`filter-btn relative ${isActive ? "active" : ""}`}
            aria-pressed={isActive}
          >
            {filter.label}
            {isActive && (
              <motion.span
                layoutId={indicatorId}
                className="absolute bottom-0 left-0 right-0 h-px bg-brand"
                transition={spring.snappy}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
