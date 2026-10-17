import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import {
  closeConsentSettings,
  needsAnswer,
  saveConsent,
  useConsent,
  useConsentSettings,
} from "./consentStore";
import type { ConsentDecisions, ConsentRecord } from "./consentStore";
import { consentCategories, consentCopy } from "../data/consent";

/** One look for all choices, so that no button is favoured (equal weight). */
const choiceButton =
  "inline-flex min-h-[44px] items-center justify-center rounded-md border border-slate bg-canvas px-5 text-sm font-semibold tracking-wide text-fg transition-colors duration-200 hover:border-brand hover:text-brandLight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:translate-y-px";

/**
 * Own consent banner: a non-modal dialog at the bottom of every page. It shows
 * while a category is undecided, or when the visitor reopens it via
 * "Cookie-Einstellungen". It never covers the page with a backdrop, and a
 * spacer of its height at the end of the document keeps the page end readable.
 */
export default function ConsentBanner() {
  const consent = useConsent();
  const settings = useConsentSettings();
  if (!settings.open && !needsAnswer(consent)) return null;
  // A new key per reopening resets the expanded state and the moved focus.
  return <ConsentDialog key={settings.openCount} consent={consent} startExpanded={settings.open} />;
}

type ConsentDialogProps = {
  consent: ConsentRecord | null;
  startExpanded: boolean;
};

function ConsentDialog({ consent, startExpanded }: ConsentDialogProps) {
  const id = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(startExpanded);
  // Only switches the visitor touched; the rest follows the stored choice.
  const [touched, setTouched] = useState<Partial<ConsentDecisions>>({});
  const [height, setHeight] = useState(0);

  const decisions: ConsentDecisions = {
    statistics: touched.statistics ?? consent?.statistics === true,
    externalMedia: touched.externalMedia ?? consent?.externalMedia === true,
  };

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const observer = new ResizeObserver(() => setHeight(dialog.offsetHeight));
    observer.observe(dialog);
    return () => observer.disconnect();
  }, []);

  const decide = (next: ConsentDecisions) => {
    saveConsent(next);
    // The banner took focus when it opened by itself; hand it to the page, not to <body>.
    if (!closeConsentSettings()) focusPageContent();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && !needsAnswer(consent)) {
      event.stopPropagation();
      closeConsentSettings();
    }
  };

  const titleId = `${id}-title`;
  const textId = `${id}-text`;
  const detailsId = `${id}-details`;

  return (
    <>
      <div aria-hidden="true" style={{ height }} />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        aria-describedby={textId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="fixed inset-x-0 bottom-0 z-[80] max-h-[85vh] overflow-y-auto border-t border-slate bg-surface text-fg focus:outline-none"
      >
        <div className="swiss-container py-5 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h2 id={titleId} className="font-display text-base font-semibold text-fg">
                {consentCopy.title}
              </h2>
              <p id={textId} className="mt-2 text-sm leading-relaxed text-muted">
                {consentCopy.intro} {consentCopy.policyLead}{" "}
                <Link to="/datenschutz" className="text-brandLight underline underline-offset-4 hover:text-fg">
                  {consentCopy.policyLink}
                </Link>
                .
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
              <button type="button" className={choiceButton} onClick={() => decide({ statistics: true, externalMedia: true })}>
                {consentCopy.acceptAll}
              </button>
              <button type="button" className={choiceButton} onClick={() => decide({ statistics: false, externalMedia: false })}>
                {consentCopy.rejectAll}
              </button>
              <button
                type="button"
                className={`${choiceButton} col-span-2`}
                aria-expanded={expanded}
                aria-controls={detailsId}
                onClick={() => setExpanded((open) => !open)}
              >
                {consentCopy.settings}
              </button>
            </div>
          </div>

          <div id={detailsId} hidden={!expanded} className="mt-5 border-t border-border pt-5">
            <div className="grid gap-5 md:grid-cols-3 md:gap-8">
              {consentCategories.map((category) => (
                <CategorySwitch
                  key={category.id}
                  id={`${id}-${category.id}`}
                  label={category.label}
                  description={category.description}
                  checked={decisions[category.id]}
                  onChange={(value: boolean) => setTouched((current) => ({ ...current, [category.id]: value }))}
                />
              ))}
              <div>
                <p className="flex min-h-[44px] items-center justify-between gap-4 text-sm font-semibold text-fg">
                  {consentCopy.necessaryLabel}
                  <span className="text-xs font-normal text-muted">{consentCopy.necessaryState}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{consentCopy.necessaryDescription}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button type="button" className={`${choiceButton} w-full sm:w-auto`} onClick={() => decide(decisions)}>
                {consentCopy.save}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function focusPageContent() {
  const main = document.querySelector<HTMLElement>("main");
  if (!main) return;
  if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
  main.focus({ preventScroll: true });
}

type CategorySwitchProps = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function CategorySwitch({ id, label, description, checked, onChange }: CategorySwitchProps) {
  const descriptionId = `${id}-description`;
  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={descriptionId}
        onClick={() => onChange(!checked)}
        className="group flex min-h-[44px] w-full items-center justify-between gap-4 rounded-md text-left text-sm font-semibold text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {label}
        <span
          aria-hidden="true"
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 ${
            checked ? "border-brand bg-brand" : "border-slate bg-canvas group-hover:border-brand"
          }`}
        >
          <span
            className={`h-4 w-4 rounded-full bg-cloud transition-transform duration-200 ${checked ? "translate-x-[22px]" : "translate-x-[3px]"}`}
          />
        </span>
      </button>
      <p id={descriptionId} className="mt-1 text-sm leading-relaxed text-muted">
        {description}
      </p>
    </div>
  );
}
