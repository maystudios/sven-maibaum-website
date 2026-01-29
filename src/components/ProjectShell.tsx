import type { ReactNode } from "react";

type ProjectShellProps = {
  title: string;
  subtitle: string;
  heroImage: string;
  heroAlt: string;
  children: ReactNode;
  ctaLabel?: string;
  ctaLink?: string;
};

export default function ProjectShell({
  title,
  subtitle,
  heroImage,
  heroAlt,
  children,
  ctaLabel,
  ctaLink,
}: ProjectShellProps) {
  return (
    <section className="section">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="glass rounded-[32px] border border-mist/70 p-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-gradient">
            {title}
          </h1>
          <p className="mt-4 text-sm text-slate">{subtitle}</p>
        </div>
        <div className="overflow-hidden rounded-[32px] border border-mist/70 bg-white/80 shadow-glass">
          <img
            src={heroImage}
            alt={heroAlt}
            className="w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="space-y-8 text-sm text-slate leading-relaxed">
          {children}
          {ctaLabel && ctaLink ? (
            <a
              href={ctaLink}
              target={ctaLink.startsWith("http") ? "_blank" : undefined}
              rel={ctaLink.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-glow transition hover:bg-brandDark"
            >
              {ctaLabel}
            </a>
          ) : null}
        </div>
        <a
          href="/#projects"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-slate hover:text-ink"
        >
          ← Alle Projekte anzeigen
        </a>
      </div>
    </section>
  );
}
