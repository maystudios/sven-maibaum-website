import { useId } from "react";

type GooglePlayBadgeProps = {
  href: string;
  productName: string;
};

export default function GooglePlayBadge({ href, productName }: GooglePlayBadgeProps) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${productName} bei Google Play öffnen`}
      className="store-badge group inline-block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <span className="inline-flex min-h-[52px] items-center gap-2.5 rounded-xl bg-black px-3.5 ring-1 ring-white/10 transition-colors group-hover:bg-[#1a1a1a]">
        <svg width="22" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={`${gradientId}-blue`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#00a0ff" />
              <stop offset="1" stopColor="#00e2ff" />
            </linearGradient>
            <linearGradient id={`${gradientId}-green`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#00c957" />
              <stop offset="1" stopColor="#00ef76" />
            </linearGradient>
            <linearGradient id={`${gradientId}-yellow`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ffe000" />
              <stop offset="1" stopColor="#ffbd00" />
            </linearGradient>
            <linearGradient id={`${gradientId}-red`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff3a44" />
              <stop offset="1" stopColor="#c2185b" />
            </linearGradient>
          </defs>
          <path
            d="M1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924z"
            fill={`url(#${gradientId}-blue)`}
          />
          <path
            d="M13.544 10.989l3.258-3.238L3.45.195A1.466 1.466 0 0 0 2.504.016l11.04 10.973z"
            fill={`url(#${gradientId}-green)`}
          />
          <path
            d="M13.544 13.056l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"
            fill={`url(#${gradientId}-red)`}
          />
          <path
            d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594z"
            fill={`url(#${gradientId}-yellow)`}
          />
        </svg>
        <span className="flex flex-col text-left text-white">
          <span className="text-[9px] font-medium uppercase leading-none tracking-[0.06em] text-white/90">
            Jetzt bei
          </span>
          <span className="mt-0.5 font-display text-[18px] font-semibold leading-tight tracking-tight">
            Google Play
          </span>
        </span>
      </span>
    </a>
  );
}
