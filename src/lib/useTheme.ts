import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  const root = document.documentElement;
  const attr = root.getAttribute("data-theme") as Theme | null;
  if (attr === "light" || attr === "dark") {
    return attr;
  }
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/** Current colour theme on <html data-theme>, persisted in localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  return { theme, toggleTheme };
}
