import Contact from "../../sections/Contact";
import ProjectSizeSlider from "./ProjectSizeSlider";

/** Contact section of all variants: the regular form plus the project size slider prototype. */
export default function VariantContact() {
  return <Contact extraField={<ProjectSizeSlider />} />;
}
