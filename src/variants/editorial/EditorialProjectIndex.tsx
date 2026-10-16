import { useMemo, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import EditorialHeading from "./EditorialHeading";
import { ClipReveal, Rule } from "./Reveal";
import ProjectFilterBar from "../shared/ProjectFilterBar";
import ProjectMedia from "../shared/ProjectMedia";
import type { MediaElement } from "../shared/ProjectMedia";
import { startMorph } from "../shared/morph";
import { ease, spring } from "../shared/motionTokens";
import { projectCards } from "../../data/projects";
import type { ProjectCard } from "../../data/projects";
import { projectsHeading } from "../../data/sections";

const isWide = () => window.matchMedia("(min-width: 1024px)").matches;

type RowLinkProps = {
  project: ProjectCard;
  className: string;
  children: ReactNode;
  onActivate: () => void;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function RowLink({ project, className, children, onActivate, onNavigate }: RowLinkProps) {
  const label = `${project.cta} – ${project.title}`;
  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={className}
        onMouseEnter={onActivate}
        onFocus={onActivate}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      to={project.route ?? "/"}
      aria-label={label}
      className={className}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}

type IndexRowProps = {
  project: ProjectCard;
  active: boolean;
  dimmed: boolean;
  onActivate: () => void;
  /** Starts the morph from the shared preview frame (wide screens). */
  startFromPreview: (project: ProjectCard, titleEl: HTMLElement | null) => void;
};

function IndexRow({ project, active, dimmed, onActivate, startFromPreview }: IndexRowProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<MediaElement | null>(null);
  const reduceMotion = useReducedMotion();

  const handleNavigate = () => {
    if (!project.route) return;
    if (isWide()) {
      startFromPreview(project, titleRef.current);
    } else {
      startMorph({
        route: project.route,
        title: project.title,
        clipEl: clipRef.current,
        imageEl: mediaRef.current,
        titleEl: titleRef.current,
      });
    }
  };

  return (
    <motion.li
      layout={reduceMotion ? false : "position"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={spring.soft}
      className="relative"
    >
      <Rule />
      <RowLink
        project={project}
        className="group block py-5 md:py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        onActivate={onActivate}
        onNavigate={handleNavigate}
      >
        <div className="flex items-baseline">
          <motion.h3
            ref={titleRef}
            className={`font-display font-bold tracking-[-0.045em] leading-[0.95] text-[clamp(2.1rem,5.6vw,4.9rem)] transition-colors duration-300 ${
              active ? "text-fg" : dimmed ? "text-faint" : "text-fg"
            }`}
            animate={{ x: active ? "0.35em" : "0em" }}
            transition={spring.snappy}
          >
            {project.title}
          </motion.h3>
        </div>
      </RowLink>

      {/* Narrow screens: no hover, so each row carries its own preview */}
      <div className="lg:hidden pb-8">
        <div ref={clipRef} className="relative aspect-video overflow-hidden border border-border">
          <ClipReveal className="absolute inset-0">
            <ProjectMedia
              src={project.image}
              alt={project.title}
              active={false}
              onMediaElement={(el) => {
                if (el) mediaRef.current = el;
              }}
            />
          </ClipReveal>
        </div>
        <p className="mt-4 text-muted text-sm leading-relaxed">{project.summary}</p>
      </div>
    </motion.li>
  );
}

/**
 * Projects as an editorial index: large titles, the preview frame on the right
 * follows hover and keyboard focus (it never follows the cursor position).
 */
export default function EditorialProjectIndex() {
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const previewClip = useRef<HTMLDivElement>(null);
  const previewMedia = useRef<MediaElement | null>(null);

  const projects = useMemo(
    () => (filter === "all" ? projectCards : projectCards.filter((p) => p.filters.includes(filter))),
    [filter]
  );
  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  const startFromPreview = (project: ProjectCard, titleEl: HTMLElement | null) => {
    if (!project.route) return;
    startMorph({
      route: project.route,
      title: project.title,
      clipEl: previewClip.current,
      imageEl: previewMedia.current,
      titleEl,
    });
  };

  return (
    <section id="projects" className="bg-canvas py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <EditorialHeading eyebrow={projectsHeading.eyebrow} title={projectsHeading.title} />
        <ProjectFilterBar active={filter} onChange={setFilter} indicatorId="mv-editorial-filter" />

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-10">
          <ul
            className="lg:col-span-7"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {projects.map((project) => (
                <IndexRow
                  key={project.id}
                  project={project}
                  active={project.id === active?.id}
                  dimmed={hovering}
                  onActivate={() => setActiveId(project.id)}
                  startFromPreview={startFromPreview}
                />
              ))}
            </AnimatePresence>
          </ul>

          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-28">
              <div ref={previewClip} className="relative aspect-[4/3] overflow-hidden border border-border bg-surface">
                <AnimatePresence initial={false}>
                  {active ? (
                    <motion.div
                      key={active.id}
                      className="absolute inset-0"
                      style={{ zIndex: 2 }}
                      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                      exit={{ zIndex: 1, transition: { duration: 0.6 } }}
                      transition={{ duration: 0.6, ease: ease.inOut }}
                    >
                      <ProjectMedia
                        src={active.image}
                        alt={active.title}
                        active={hovering}
                        loading="eager"
                        onMediaElement={(el) => {
                          if (el) previewMedia.current = el;
                        }}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                {active ? (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: ease.out }}
                    className="mt-6"
                  >
                    <p className="text-muted leading-relaxed">{active.summary}</p>
                    <div className="mt-4 flex flex-wrap">
                      {active.tags.map((tag) => (
                        <span key={tag.label} className={tag.className}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
