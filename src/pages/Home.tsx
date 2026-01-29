import Hero from "../sections/Hero";
import About from "../sections/About";
import Philosophy from "../sections/Philosophy";
import Experience from "../sections/Experience";
import Projects from "../sections/Projects";
import Skills from "../sections/Skills";
import Contact from "../sections/Contact";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Philosophy />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </div>
  );
}
