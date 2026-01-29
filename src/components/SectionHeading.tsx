type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : "text-left"}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-gradient">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base text-slate leading-relaxed">{subtitle}</p>
      ) : null}
    </div>
  );
}
