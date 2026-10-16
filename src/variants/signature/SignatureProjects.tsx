import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ProjectFilterBar from "../shared/ProjectFilterBar";
import ProjectMedia from "../shared/ProjectMedia";
import { startMorph } from "../shared/morph";
import type { MediaElement } from "../shared/ProjectMedia";
import { ease, spring } from "../shared/motionTokens";
import { projectCards } from "../../data/projects";
import type { ProjectCard } from "../../data/projects";
import { projectsHeading } from "../../data/sections";

const STRETCHED_LINK = "after:absolute after:inset-0 after:content-['']";

function SpringCard({ project, index }: { project: ProjectCard; index: number }) {
  const [active, setActive] = useState(false);
  const clipRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<MediaElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const label = `${project.cta} – ${project.title}`;

  return (
    <motion.article
      className="relative h-full flex flex-col bg-surface border border-border rounded-sm overflow-hidden focus-within:border-brand"
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.985 }}
      transition={{ ...spring.soft, delay: (index % 3) * 0.06 }}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <motion.span
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-0.5 bg-brand origin-left z-10"
        initial={false}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={spring.snappy}
      />
      <div ref={clipRef} className="relative aspect-[16/10] overflow-hidden border-b border-border">
        <ProjectMedia
          src={project.image}
          alt={project.title}
          active={active}
          onMediaElement={(el) => {
            if (el) mediaRef.current = el;
          }}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 ref={titleRef} className="font-display font-bold text-fg text-xl tracking-tight mb-2">
          {project.title}
        </h3>
        <p className="text-muted text-sm mb-5 leading-relaxed">{project.summary}</p>
        <div className="flex flex-wrap mb-4">
          {project.tags.map((tag, i) => (
            <motion.span
              key={tag.label}
              className={tag.className}
              initial={false}
              animate={{ y: active ? -3 : 0 }}
              transition={{ ...spring.press, delay: active ? i * 0.04 : 0 }}
            >
              {tag.label}
            </motion.span>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-border">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`swiss-btn-primary px-4 py-2 min-h-[44px] ${STRETCHED_LINK}`}
            >
              {project.cta}
            </a>
          ) : (
            <Link
              to={project.route ?? "/"}
              aria-label={label}
              className={`swiss-btn-secondary px-4 py-2 min-h-[44px] ${STRETCHED_LINK}`}
              onClick={() => {
                if (!project.route) return;
                startMorph({
                  route: project.route,
                  title: project.title,
                  clipEl: clipRef.current,
                  imageEl: mediaRef.current,
                  titleEl: titleRef.current,
                });
              }}
            >
              {project.cta}
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/** Project grid with spring micro-interactions; each card opens its page through the shared-element morph. */
export default function SignatureProjects() {
  const [filter, setFilter] = useState("all");
  const reduceMotion = useReducedMotion();
  const projects = useMemo(
    () => (filter === "all" ? projectCards : projectCards.filter((p) => p.filters.includes(filter))),
    [filter]
  );

  return (
    <section id="projects" className="swiss-section">
      <div className="swiss-container">
        <div className="mb-10 md:mb-14">
          <p className="font-mono text-xs text-faint mb-3">{projectsHeading.eyebrow}</p>
          <motion.h2
            className="font-display font-bold text-fg tracking-[-0.035em] leading-[1] text-4xl md:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: ease.out }}
          >
            {projectsHeading.title}
          </motion.h2>
        </div>
        <ProjectFilterBar active={filter} onChange={setFilter} indicatorId="mv-signature-filter" />
        <motion.ul layout={!reduceMotion} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {projects.map((project, i) => (
              <motion.li
                key={project.id}
                layout={!reduceMotion}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
                transition={spring.soft}
                className="h-full"
              >
                <SpringCard project={project} index={i} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
