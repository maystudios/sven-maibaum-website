import { useEffect } from "react";
import { useConsent } from "./consentStore";
import { disableAnalytics, enableAnalytics } from "./googleAnalytics";

/** Starts Google Analytics on statistics consent and stops it (cookies included) on withdrawal, without a reload. */
export function useAnalyticsConsent() {
  const statistics = useConsent()?.statistics === true;
  useEffect(() => {
    if (statistics) enableAnalytics();
    else disableAnalytics();
  }, [statistics]);
}
