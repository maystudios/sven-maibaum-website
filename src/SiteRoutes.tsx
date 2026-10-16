import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProjectHeistLine from "./pages/projects/ProjectHeistLine";
import ProjectMrDork3 from "./pages/projects/ProjectMrDork3";
import ProjectMobileGames from "./pages/projects/ProjectMobileGames";
import ProjectAppDevelopment from "./pages/projects/ProjectAppDevelopment";
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
import Links from "./pages/Links";

type SiteRoutesProps = {
  /** Layout route element that renders the shared header, footer and <Outlet />. */
  layout: ReactElement;
  /** Element for the home route. */
  home: ReactElement;
};

/** Single route table, shared by the regular site and the motion variants. */
export default function SiteRoutes({ layout, home }: SiteRoutesProps) {
  return (
    <Routes>
      {/* Standalone social link page: no shared header/footer */}
      <Route path="/links" element={<Links />} />
      <Route element={layout}>
        <Route path="/" element={home} />
        <Route path="/projekte/heistline" element={<ProjectHeistLine />} />
        <Route path="/projekte/mr-dork-3" element={<ProjectMrDork3 />} />
        <Route path="/projekte/mobile-games" element={<ProjectMobileGames />} />
        <Route path="/projekte/app-entwicklung" element={<ProjectAppDevelopment />} />
        <Route
          path="/projekte/shapes-puzzle-escape"
          element={<Navigate to="/projekte/mobile-games#shapes" replace />}
        />
        <Route
          path="/projekte/tiles-logic-puzzle"
          element={<Navigate to="/projekte/mobile-games#tiles" replace />}
        />
        <Route
          path="/projekte/hydroloop"
          element={<Navigate to="/projekte/mobile-games#hydroloop" replace />}
        />
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
  );
}
