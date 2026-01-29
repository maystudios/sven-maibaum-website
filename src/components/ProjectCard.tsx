import { Link } from "react-router-dom";
import type { ProjectCard } from "../data/projects";

type ProjectCardProps = {
  project: ProjectCard;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const className = "glassmorphism rounded-xl overflow-hidden shadow-xl project-card";

  return (
    <div className={className} data-tags={project.dataTags.join(" ")}>
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-56 object-cover"
        loading="lazy"
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3
            className={`text-xl font-semibold mb-2 ${project.accent}`.trim()}
            style={project.accentStyle ? { color: project.accentStyle } : undefined}
          >
            {project.title}
          </h3>
          <p className="text-sm mb-2">{project.summary}</p>
          <div className="mb-4">
            {project.tags.map((tag) => (
              <span key={tag.label} className={tag.className}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-auto pt-4">
          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className={project.buttonClass}>
              {project.cta} &rarr;
            </a>
          ) : (
            <Link to={project.route ?? "#"} className={project.buttonClass}>
              {project.cta} &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
