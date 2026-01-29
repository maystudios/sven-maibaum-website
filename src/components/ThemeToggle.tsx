import { useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  className?: string;
  title?: string;
  iconSizeClass?: string;
  darkIconId?: string;
  lightIconId?: string;
};

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

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export default function ThemeToggle({
  className,
  title = "Theme wechseln",
  iconSizeClass = "w-6 h-6",
  darkIconId = "theme-toggle-dark-icon",
  lightIconId = "theme-toggle-light-icon",
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const baseClass = "inline-flex items-center justify-center min-h-[44px] min-w-[44px]";
  const mergedClassName = className ? `${baseClass} ${className}` : baseClass;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);

    const header = document.querySelector("header");
    if (header) {
      const element = header as HTMLElement;
      element.style.transform = "translateZ(0)";
      requestAnimationFrame(() => {
        element.style.transform = "";
      });
    }
  };

  return (
    <button type="button" className={mergedClassName} title={title} onClick={toggleTheme}>
      <svg
        id={darkIconId}
        className={`${theme === "dark" ? "" : "hidden"} ${iconSizeClass}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
      </svg>
      <svg
        id={lightIconId}
        className={`${theme === "light" ? "" : "hidden"} ${iconSizeClass}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
    </button>
  );
}
