import { grantExternalMedia, useConsent } from "../consent/consentStore";
import { steamPlaceholderCopy } from "../data/consent";

type SteamWidgetProps = {
  appId: number;
  title: string;
  /** Own image from the repository, shown until the visitor consents to external media */
  image: string;
  className?: string;
};

/**
 * Steam store widget behind the "Externe Medien" consent. Before consent the
 * page shows an own placeholder with the game image, a store link and a button
 * that gives this consent; the iframe from store.steampowered.com loads only then.
 */
export default function SteamWidget({ appId, title, image, className = "" }: SteamWidgetProps) {
  const consent = useConsent();
  const frame = `w-full max-w-[646px] border border-border ${className}`;

  if (consent?.externalMedia === true) {
    return <iframe src={`https://store.steampowered.com/widget/${appId}/`} title={`${title} im Steam-Store`} className={`${frame} h-[190px]`} />;
  }

  return (
    <div data-consent-placeholder="steam" className={`${frame} flex min-h-[190px] flex-col overflow-hidden bg-surface sm:flex-row`}>
      <img src={image} alt="" className="h-28 w-full shrink-0 object-cover sm:h-auto sm:w-[38%]" loading="lazy" />
      <div className="flex flex-col justify-center gap-3 p-4">
        <p className="font-display text-sm font-semibold text-fg">{title} auf Steam</p>
        <p className="text-xs leading-relaxed text-muted">{steamPlaceholderCopy.notice}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="swiss-btn-secondary min-h-[44px] px-4 py-2 text-sm" onClick={grantExternalMedia}>
            {steamPlaceholderCopy.load}
          </button>
          <a
            href={`https://store.steampowered.com/app/${appId}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="swiss-btn-secondary min-h-[44px] px-4 py-2 text-sm"
          >
            {steamPlaceholderCopy.store}
          </a>
        </div>
      </div>
    </div>
  );
}
