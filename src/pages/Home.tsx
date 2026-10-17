import Hero from "../sections/Hero";
import About from "../sections/About";
import Philosophy from "../sections/Philosophy";
import Experience from "../sections/Experience";
import Projects from "../sections/Projects";
import Publications from "../sections/Publications";
import Skills from "../sections/Skills";
import Contact from "../sections/Contact";
import ProjectSizeField from "../projectSize/ProjectSizeField";

/**
 * Home page in the direction the owner chose on 16.10.2026: the depth hero
 * and the self-drawing timeline, the project overview with the shared-element
 * morph, grid-cell page transitions (see motion/PageFrame.tsx) and the
 * project size slider with the size scene.
 */
export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <div className="relative z-10 bg-canvas shadow-[0_-30px_60px_-10px_rgba(0,0,0,0.65)]">
        <About />
        <Philosophy />
        <Experience />
        <Projects />
        <Publications />
        <Skills />
        <Contact band={<ProjectSizeField />} />
      </div>
    </div>
  );
}
