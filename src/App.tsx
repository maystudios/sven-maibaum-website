import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SiteRoutes from "./SiteRoutes";
import { activeVariant } from "./variants/variant";

// Motion design variants (?v=1|2|3|4) load as a separate chunk, so the regular
// site neither downloads nor runs any of their code.
const VariantRoot = lazy(() => import("./variants/VariantRoot"));

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {activeVariant ? (
        <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
          <VariantRoot variant={activeVariant} />
        </Suspense>
      ) : (
        <SiteRoutes layout={<Layout />} home={<Home />} />
      )}
    </BrowserRouter>
  );
}
