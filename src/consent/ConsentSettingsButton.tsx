import { openConsentSettings } from "./consentStore";
import { consentCopy } from "../data/consent";

type ConsentSettingsButtonProps = {
  className?: string;
};

/** "Cookie-Einstellungen": reopens the consent banner; focus comes back here when it closes. */
export default function ConsentSettingsButton({ className }: ConsentSettingsButtonProps) {
  return (
    <button type="button" className={className} onClick={(event) => openConsentSettings(event.currentTarget)}>
      {consentCopy.reopen}
    </button>
  );
}
