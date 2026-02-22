import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ProjectCard from "../components/ProjectCard";
import SectionHeading from "../components/SectionHeading";
import { projectCards, projectFilters } from "../data/projects";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projectCards;
    }
    return projectCards.filter((project) =>
      project.filters.includes(activeFilter)
    );
  }, [activeFilter]);

  return (
    <section id="projects" className="swiss-section">
      <div className="swiss-container">
        <SectionHeading eyebrow="Portfolio" title="Ausgewählte Projekte" className="mb-12" />

        <div className="flex items-center gap-1 mb-12 border-b border-border pb-0 relative">
          {projectFilters.map((filter) => {
            const isActive = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-btn relative ${isActive ? "active" : ""}`}
                aria-pressed={isActive}
              >
                {filter.label}
                {isActive && (
                  <motion.div
                    layoutId="active-filter"
                    className="absolute bottom-0 left-0 right-0 h-px bg-brand"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
