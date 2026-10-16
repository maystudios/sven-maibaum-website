import DepthHero from "./DepthHero";
import DepthTimeline from "./DepthTimeline";
import DepthProjects from "./DepthProjects";
import VariantContact from "../shared/VariantContact";
import About from "../../sections/About";
import Philosophy from "../../sections/Philosophy";
import Publications from "../../sections/Publications";
import Skills from "../../sections/Skills";

/**
 * Variant 2 "Tiefe": the page is a stack of planes. The hero stays pinned
 * underneath while the following sections slide over it, projects travel
 * toward the viewer, the timeline draws itself.
 */
export default function DepthHome() {
  return (
    <div className="relative">
      <DepthHero />
      <div className="relative z-10 bg-canvas shadow-[0_-30px_60px_-10px_rgba(0,0,0,0.65)]">
        <About />
        <Philosophy />
        <DepthTimeline />
        <DepthProjects />
        <Publications />
        <Skills />
        <VariantContact />
      </div>
    </div>
  );
}
