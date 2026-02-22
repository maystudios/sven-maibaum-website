import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { ProjectCard as ProjectCardType } from "../data/projects";

type ProjectCardProps = {
  project: ProjectCardType;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const cardContent = (
    <>
      <div className="overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-display font-bold text-fg text-lg mb-2">
            {project.title}
          </h3>
          <p className="text-muted text-sm mb-4 leading-relaxed">
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag.label} className={tag.className}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="swiss-btn-primary inline-flex items-center gap-1 px-4 py-2 text-sm min-h-[44px]"
              aria-label={`${project.cta} – ${project.title}`}
            >
              {project.cta}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="translate-y-px">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : (
            <Link
              to={project.route ?? "#"}
              className="swiss-btn-secondary inline-flex items-center gap-1 px-4 py-2 text-sm min-h-[44px]"
              aria-label={`${project.cta} – ${project.title}`}
            >
              {project.cta}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="translate-y-px">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(59, 130, 246, 0.1)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-surface border border-border rounded-sm overflow-hidden flex flex-col h-full hover:border-brand transition-colors duration-200"
      data-tags={project.dataTags.join(" ")}
    >
      {cardContent}
    </motion.div>
  );
}
