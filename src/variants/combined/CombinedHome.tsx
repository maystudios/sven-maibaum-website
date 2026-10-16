import MorphingProjects from "./MorphingProjects";
import ProjectSizeField from "./ProjectSizeField";
import DepthHero from "../depth/DepthHero";
import DepthTimeline from "../depth/DepthTimeline";
import About from "../../sections/About";
import Philosophy from "../../sections/Philosophy";
import Publications from "../../sections/Publications";
import Skills from "../../sections/Skills";
import Contact from "../../sections/Contact";

/**
 * Variant 4, combined after the owner's feedback (16.10.2026): the depth hero
 * and the self-drawing timeline of V2, the regular project overview with the
 * shared-element morph, V3's grid transitions (see PageFrame) and the size
 * slider with a live illustration.
 */
export default function CombinedHome() {
  return (
    <div className="relative">
      <DepthHero />
      <div className="relative z-10 bg-canvas shadow-[0_-30px_60px_-10px_rgba(0,0,0,0.65)]">
        <About />
        <Philosophy />
        <DepthTimeline />
        <MorphingProjects />
        <Publications />
        <Skills />
        <Contact band={<ProjectSizeField />} />
      </div>
    </div>
  );
}
