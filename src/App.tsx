import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProjectHeistLine from "./pages/projects/ProjectHeistLine";
import ProjectMrDork3 from "./pages/projects/ProjectMrDork3";
import ProjectShapesPuzzleEscape from "./pages/projects/ProjectShapesPuzzleEscape";
import ProjectTilesLogicPuzzle from "./pages/projects/ProjectTilesLogicPuzzle";
import ProjectHydroLoop from "./pages/projects/ProjectHydroLoop";
import ProjectLikeTik from "./pages/projects/ProjectLikeTik";
import ProjectExambyte from "./pages/projects/ProjectExambyte";
import ProjectItchio from "./pages/projects/ProjectItchio";
import ProjectMaxsimCli from "./pages/projects/ProjectMaxsimCli";
import ProjectCcTemplates from "./pages/projects/ProjectCcTemplates";
import ProjectFabStore from "./pages/projects/ProjectFabStore";
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
          <Route path="/projekte/shapes-puzzle-escape" element={<ProjectShapesPuzzleEscape />} />
          <Route path="/projekte/tiles-logic-puzzle" element={<ProjectTilesLogicPuzzle />} />
          <Route path="/projekte/hydroloop" element={<ProjectHydroLoop />} />
          <Route path="/projekte/liketik" element={<ProjectLikeTik />} />
          <Route path="/projekte/exambyte" element={<ProjectExambyte />} />
          <Route path="/projekte/itchio" element={<ProjectItchio />} />
          <Route path="/projekte/maxsimcli" element={<ProjectMaxsimCli />} />
          <Route path="/projekte/cc-templates" element={<ProjectCcTemplates />} />
          <Route path="/projekte/fab-store" element={<ProjectFabStore />} />
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
