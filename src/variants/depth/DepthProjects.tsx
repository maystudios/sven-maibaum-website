import { useRef, useState } from "react";
import type { RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import ProjectMedia from "../shared/ProjectMedia";
import type { MediaElement } from "../shared/ProjectMedia";
import { startMorph } from "../shared/morph";
import { ease, spring } from "../shared/motionTokens";
import { glideTo } from "../shared/scroll";
import { projectCards } from "../../data/projects";
import type { ProjectCard } from "../../data/projects";
import { projectsHeading } from "../../data/sections";

const STEP_VH = 55; // scroll distance per project
const DEPTH_STEP = 280; // px along z between two layers
const RANGE: [number, number] = [0.05, 0.95]; // part of the pinned scroll that moves the stack

type CardRefs = { clip: HTMLDivElement | null; media: MediaElement | null };

type DepthCardProps = {
  project: ProjectCard;
  index: number;
  position: MotionValue<number>;
  isActive: boolean;
  onRefs: (id: string, refs: Partial<CardRefs>) => void;
  onOpen: (project: ProjectCard) => void;
};

/** One screenshot layer; its depth follows the scroll position of the pinned section. */
function DepthCard({ project, index, position, isActive, onRefs, onOpen }: DepthCardProps) {
  const [hovered, setHovered] = useState(false);
  const distance = useTransform(position, (p) => index - p); // > 0 behind, < 0 already passed
  const z = useTransform(distance, (d) => -d * DEPTH_STEP);
  // Layers behind step up and to the right, so each one peeks out of the stack
  const x = useTransform(distance, (d) => d * 64);
  const y = useTransform(distance, (d) => d * -78);
  const rotateY = useTransform(distance, [-1, 0, 4], [10, 0, -12]);
  const opacity = useTransform(distance, [-0.75, -0.2, 0, 3.2, 4.2], [0, 1, 1, 0.9, 0]);

  return (
    <motion.div
      className="absolute inset-x-[6%] top-[22%] aspect-[16/10]"
      style={{ z, x, y, rotateY, opacity, pointerEvents: isActive ? "auto" : "none" }}
    >
      <div
        ref={(el) => onRefs(project.id, { clip: el })}
        role="presentation"
        data-depth-active={isActive ? "true" : "false"}
        className={`relative w-full h-full overflow-hidden border bg-surface cursor-pointer transition-colors duration-300 ${
          isActive ? "border-slate" : "border-border"
        }`}
        style={{ boxShadow: "0 40px 90px -30px rgba(0,0,0,0.75)" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onOpen(project)}
      >
        <ProjectMedia
          src={project.image}
          videoSrc={project.video}
          alt=""
          active={isActive && hovered}
          loading={index < 3 ? "eager" : "lazy"}
          onMediaElement={(el) => {
            if (el) onRefs(project.id, { media: el });
          }}
        />
      </div>
    </motion.div>
  );
}

function ProjectAction({ project, onOpen }: { project: ProjectCard; onOpen: (project: ProjectCard) => void }) {
  const label = `${project.cta} – ${project.title}`;
  if (project.link) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={label} className="swiss-btn-primary min-h-[44px]">
        {project.cta}
      </a>
    );
  }
  return (
    <Link
      to={project.route ?? "/"}
      aria-label={label}
      className="swiss-btn-secondary min-h-[44px]"
      onClick={() => onOpen(project)}
    >
      {project.cta}
    </Link>
  );
}

/** Reduced motion: no pinning and no depth travel, a plain list of projects. */
function StaticProjects() {
  return (
    <section id="projects" className="swiss-section">
      <div className="swiss-container">
        <p className="font-mono text-xs text-faint mb-3">{projectsHeading.eyebrow}</p>
        <h2 className="font-display font-bold text-fg text-4xl md:text-6xl tracking-[-0.03em] mb-12">{projectsHeading.title}</h2>
        <ul className="grid gap-8 md:grid-cols-2">
          {projectCards.map((project) => (
            <li key={project.id} className="border border-border bg-surface">
              <div className="aspect-[16/10] overflow-hidden">
                <ProjectMedia src={project.image} alt={project.title} active={false} />
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-fg text-xl mb-2">{project.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-5">{project.summary}</p>
                <ProjectAction project={project} onOpen={() => undefined} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Pinned project narrative: the screenshots are layered in CSS 3D and travel
 * toward the viewer while the page scrolls. Scrolling stays native; the section
 * is simply taller than the viewport and its stage is sticky.
 */
export default function DepthProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const wideTitleRef = useRef<HTMLHeadingElement>(null);
  const narrowTitleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const cardRefs = useRef(new Map<string, CardRefs>());
  const reduceMotion = useReducedMotion();
  const count = projectCards.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const position = useTransform(scrollYProgress, RANGE, [0, count - 1]);
  useMotionValueEvent(position, "change", (p) => {
    const next = Math.min(count - 1, Math.max(0, Math.round(p)));
    setActiveIndex((current) => (current === next ? current : next));
  });
  const progressBar = useTransform(scrollYProgress, RANGE, [0, 1]);

  const active = projectCards[activeIndex];

  const registerRefs = (id: string, refs: Partial<CardRefs>) => {
    const current = cardRefs.current.get(id) ?? { clip: null, media: null };
    cardRefs.current.set(id, { ...current, ...refs });
  };

  const openProject = (project: ProjectCard) => {
    if (project.link) {
      window.open(project.link, "_blank", "noopener,noreferrer");
      return;
    }
    if (!project.route) return;
    const refs = cardRefs.current.get(project.id);
    startMorph({
      route: project.route,
      title: project.title,
      clipEl: refs?.clip ?? null,
      imageEl: refs?.media ?? null,
      titleEl: window.matchMedia("(min-width: 1024px)").matches ? wideTitleRef.current : narrowTitleRef.current,
    });
  };

  const openFromCard = (project: ProjectCard) => {
    openProject(project);
    if (project.route && !project.link) navigate(project.route);
  };

  const jumpTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const travel = section.offsetHeight - window.innerHeight;
    const progress = RANGE[0] + (index / (count - 1)) * (RANGE[1] - RANGE[0]);
    glideTo(section.offsetTop + travel * progress, 600);
  };

  if (reduceMotion) return <StaticProjects />;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-canvas border-t border-border"
      style={{ height: `${(count - 1) * STEP_VH + 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-16 pt-20 md:pt-24 pb-8 grid grid-rows-[auto_minmax(0,1fr)_auto] lg:grid-rows-1 lg:grid-cols-12 gap-x-10 gap-y-4">
          <div className="lg:col-span-5 lg:row-start-1 flex flex-col">
            <p className="font-mono text-xs text-faint mb-2">{projectsHeading.eyebrow}</p>
            <h2 className="font-display font-bold text-fg tracking-[-0.03em] leading-[1] text-3xl md:text-5xl">
              {projectsHeading.title}
            </h2>

            <div className="hidden lg:block mt-auto">
              <ActiveInfo project={active} titleRef={wideTitleRef} onOpen={openProject} />
            </div>

            <nav className="mt-6 lg:mt-10 flex gap-1.5" aria-label={projectsHeading.title}>
              {projectCards.map((project, i) => (
                <button
                  key={project.id}
                  type="button"
                  aria-label={project.title}
                  aria-current={i === activeIndex ? "true" : undefined}
                  onClick={() => jumpTo(i)}
                  className="group relative h-11 flex-1 max-w-10 flex items-center"
                >
                  <span className="block w-full h-0.5 bg-border overflow-hidden">
                    <motion.span
                      className="block h-full bg-fg origin-left"
                      initial={false}
                      animate={{ scaleX: i === activeIndex ? 1 : i < activeIndex ? 0.35 : 0 }}
                      transition={spring.snappy}
                    />
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="relative lg:col-span-7 lg:row-start-1 min-h-0" style={{ perspective: "1200px", perspectiveOrigin: "50% 20%" }}>
            <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              {projectCards.map((project, i) => (
                <DepthCard
                  key={project.id}
                  project={project}
                  index={i}
                  position={position}
                  isActive={i === activeIndex}
                  onRefs={registerRefs}
                  onOpen={openFromCard}
                />
              ))}
            </div>
            <motion.span
              aria-hidden="true"
              className="absolute left-0 right-0 bottom-0 h-px bg-brand origin-left"
              style={{ scaleX: progressBar }}
            />
          </div>

          <div className="lg:hidden">
            <ActiveInfo project={active} titleRef={narrowTitleRef} onOpen={openProject} compact />
          </div>
        </div>
      </div>
    </section>
  );
}

type ActiveInfoProps = {
  project: ProjectCard;
  titleRef: RefObject<HTMLHeadingElement | null>;
  onOpen: (project: ProjectCard) => void;
  compact?: boolean;
};

function ActiveInfo({ project, titleRef, onOpen, compact = false }: ActiveInfoProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: ease.out }}
      >
        <h3
          ref={titleRef}
          className={`font-display font-bold text-fg tracking-[-0.035em] leading-[1] ${compact ? "text-2xl" : "text-4xl xl:text-5xl"}`}
        >
          {project.title}
        </h3>
        <p className={`mt-3 text-muted leading-relaxed ${compact ? "text-sm line-clamp-3" : ""}`}>{project.summary}</p>
        {!compact ? (
          <div className="mt-4 flex flex-wrap">
            {project.tags.map((tag) => (
              <span key={tag.label} className={tag.className}>
                {tag.label}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-4">
          <ProjectAction project={project} onOpen={onOpen} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
