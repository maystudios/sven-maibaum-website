import EditorialHero from "./EditorialHero";
import { EditorialAbout, EditorialExperience, EditorialPhilosophy } from "./EditorialSections";
import EditorialProjectIndex from "./EditorialProjectIndex";
import VariantContact from "../shared/VariantContact";
import Publications from "../../sections/Publications";
import Skills from "../../sections/Skills";

/** Variant 1 "Editorial": typography carries the motion, images open with clips. */
export default function EditorialHome() {
  return (
    <div>
      <EditorialHero />
      <EditorialAbout />
      <EditorialPhilosophy />
      <EditorialExperience />
      <EditorialProjectIndex />
      <Publications />
      <Skills />
      <VariantContact />
    </div>
  );
}
