import { createContext } from "react";
import type { ReactNode } from "react";
import type { ProjectShellProps } from "../components/ProjectShell";

export type ProjectShellRenderer = (props: ProjectShellProps) => ReactNode;

/**
 * Lets the motion variants swap the project page shell without touching the
 * individual project pages. Null (default) keeps the regular ProjectShell.
 */
export const ProjectShellOverride = createContext<ProjectShellRenderer | null>(null);
