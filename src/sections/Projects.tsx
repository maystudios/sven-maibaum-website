import { useMemo, useState } from "react";
import ProjectCard from "../components/ProjectCard";
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
    <section id="projects" className="section-padding fade-in-up">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="gradient-text">Ausgewählte Projekte</span>
        </h2>
        <div id="project-filters" className="flex flex-wrap justify-center mb-6">
          {projectFilters.map((filter) => {
            const isActive = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                data-filter={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-btn ${isActive ? "active" : ""}`}
                aria-pressed={isActive}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
