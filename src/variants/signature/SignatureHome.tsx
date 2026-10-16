import SignatureHero from "./SignatureHero";
import SignatureProjects from "./SignatureProjects";
import VariantContact from "../shared/VariantContact";
import About from "../../sections/About";
import Philosophy from "../../sections/Philosophy";
import Experience from "../../sections/Experience";
import Publications from "../../sections/Publications";
import Skills from "../../sections/Skills";

/** Variant 3 "Signatur": the network forward pass as the opener, springy project cards, grid transitions. */
export default function SignatureHome() {
  return (
    <div>
      <SignatureHero />
      <About />
      <Philosophy />
      <Experience />
      <SignatureProjects />
      <Publications />
      <Skills />
      <VariantContact />
    </div>
  );
}
