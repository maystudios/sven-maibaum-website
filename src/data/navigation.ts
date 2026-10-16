export type NavLink = {
  label: string;
  href: string;
};

/** Main navigation; on the home page links are plain anchors, elsewhere they lead back home. */
export const getNavLinks = (isHome: boolean): NavLink[] => [
  { label: "Home",          href: isHome ? "#home"         : "/#home"         },
  { label: "Über Mich",     href: isHome ? "#about"        : "/#about"        },
  { label: "Ansatz",        href: isHome ? "#philosophy"   : "/#philosophy"   },
  { label: "Projekte",      href: isHome ? "#projects"     : "/#projects"     },
  { label: "Publikationen", href: isHome ? "#publications" : "/#publications" },
  { label: "Tech Stack",    href: isHome ? "#skills"       : "/#skills"       },
  { label: "Kontakt",       href: isHome ? "#contact"      : "/#contact"      },
];

/** Section ids on the home page that the navigation tracks. */
export const homeSectionIds = ["home", "about", "philosophy", "projects", "publications", "skills", "contact"];
