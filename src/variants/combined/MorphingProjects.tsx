import type { MouseEvent } from "react";
import Projects from "../../sections/Projects";
import { startMorph } from "../shared/morph";

/**
 * The regular project section, unchanged, plus the shared-element morph: a
 * click on a card's internal link (captured before the router handles it)
 * hands the card image and title to the morph layer.
 */
export default function MorphingProjects() {
  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target === "_blank") return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.includes("/projekte/")) return;
    const card = link.closest<HTMLElement>("[data-tags]");
    const image = card?.querySelector("img") ?? null;
    const title = card?.querySelector<HTMLElement>("h3") ?? null;
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    const route = base && url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname;
    startMorph({
      route,
      title: title?.textContent ?? "",
      clipEl: image?.parentElement ?? null,
      imageEl: image,
      titleEl: title,
    });
  };

  return (
    <div onClickCapture={handleClickCapture}>
      <Projects />
    </div>
  );
}
