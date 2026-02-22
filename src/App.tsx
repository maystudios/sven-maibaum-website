import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProjectHeistLine from "./pages/projects/ProjectHeistLine";
import ProjectMrDork3 from "./pages/projects/ProjectMrDork3";
import ProjectLikeTik from "./pages/projects/ProjectLikeTik";
import ProjectExambyte from "./pages/projects/ProjectExambyte";
import ProjectKIMarketing from "./pages/projects/ProjectKIMarketing";
import ProjectItchio from "./pages/projects/ProjectItchio";
import ArchitectShowcase from "./pages/ArchitectShowcase";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import NotFound from "./pages/NotFound";
import Visitenkarte from "./pages/Visitenkarte";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projekte/heistline" element={<ProjectHeistLine />} />
          <Route path="/projekte/mr-dork-3" element={<ProjectMrDork3 />} />
          <Route path="/projekte/liketik" element={<ProjectLikeTik />} />
          <Route path="/projekte/exambyte" element={<ProjectExambyte />} />
          <Route path="/projekte/ki-marketing" element={<ProjectKIMarketing />} />
          <Route path="/projekte/itchio" element={<ProjectItchio />} />
          <Route path="/visitenkarte" element={<Visitenkarte />} />
          <Route path="/showcase" element={<ArchitectShowcase />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
