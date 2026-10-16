import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import SiteRoutes from "../SiteRoutes";
import VariantLayout from "./VariantLayout";
import VariantProjectShell from "./shared/VariantProjectShell";
import EditorialHome from "./editorial/EditorialHome";
import DepthHome from "./depth/DepthHome";
import SignatureHome from "./signature/SignatureHome";
import CombinedHome from "./combined/CombinedHome";
import { ProjectShellOverride } from "./projectShellOverride";
import type { ProjectShellRenderer } from "./projectShellOverride";
import type { MotionVariant } from "./variant";

type VariantRootProps = {
  variant: MotionVariant;
};

const renderProjectShell: ProjectShellRenderer = (props) => <VariantProjectShell {...props} />;

const homes = {
  1: <EditorialHome />,
  2: <DepthHome />,
  3: <SignatureHome />,
  4: <CombinedHome />,
} as const;

/**
 * Entry of the motion design exploration. `reducedMotion="user"` makes every
 * Motion animation fall back to opacity-only when the visitor asks for less motion.
 */
export default function VariantRoot({ variant }: VariantRootProps) {
  useEffect(() => {
    // Page frames restore scroll positions themselves after their transition.
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ProjectShellOverride.Provider value={renderProjectShell}>
        <SiteRoutes layout={<VariantLayout variant={variant} />} home={homes[variant]} />
      </ProjectShellOverride.Provider>
    </MotionConfig>
  );
}
