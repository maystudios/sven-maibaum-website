import { openConsentSettings } from "./consentStore";
import { consentCopy } from "../data/consent";

type ConsentSettingsButtonProps = {
  className?: string;
  /** Classes for the label inside, e.g. the link underline, when the button is padded to 44 px */
  labelClassName?: string;
};

/** "Cookie-Einstellungen": reopens the consent banner; focus comes back here when it closes. */
export default function ConsentSettingsButton({ className, labelClassName }: ConsentSettingsButtonProps) {
  return (
    <button type="button" className={className} onClick={(event) => openConsentSettings(event.currentTarget)}>
      <span className={labelClassName}>{consentCopy.reopen}</span>
    </button>
  );
}
