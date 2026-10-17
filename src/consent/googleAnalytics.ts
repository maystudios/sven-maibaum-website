/**
 * Google Analytics 4 behind the "Statistik" consent. Nothing here runs, and no
 * request goes to Google, until `enableAnalytics` is called after consent.
 *
 * - Consent Mode v2: all four types default to denied; only analytics_storage
 *   is granted, before `config`, so ads storage and ads data stay denied.
 * - Google signals and ad personalisation are switched off in the tag.
 * - Page views: the `config` call counts the current page; enhanced
 *   measurement counts later route changes from the History API. No manual
 *   page_view is sent, which would count every route change twice.
 * - Withdrawal: `ga-disable-<ID>` makes the loaded tag send nothing more
 *   (a denied update alone would leave it sending cookieless pings), and the
 *   _ga / _ga_<ID> cookies are deleted.
 * Sources: docs/research/2026-10-17-google-analytics-consent.md
 */
export const MEASUREMENT_ID = "G-TSBZ01TVDR";
const DISABLE_FLAG = `ga-disable-${MEASUREMENT_ID}`;
const GA_COOKIE = /^_ga($|_)/;

type Gtag = (command: string, ...params: unknown[]) => void;
/** The globals gtag.js reads: its command queue and the per-property opt-out flag. */
type AnalyticsGlobals = { dataLayer?: unknown[] } & Record<string, unknown>;
const globals = () => window as unknown as AnalyticsGlobals;

let loaded = false;

/** gtag.js reads the Arguments object itself, so this cannot use rest parameters. */
const gtag = function () {
  const g = globals();
  g.dataLayer = g.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params
  g.dataLayer.push(arguments);
} as Gtag;

function setDisabled(disabled: boolean) {
  globals()[DISABLE_FLAG] = disabled;
}

export function enableAnalytics() {
  setDisabled(false);
  if (loaded) {
    gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }
  loaded = true;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("set", { allow_google_signals: false, allow_ad_personalization_signals: false });
  gtag("config", MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.onerror = () => {
    console.warn("[analytics] Google Analytics could not be loaded (blocked or offline); the site works without it.");
  };
  document.head.appendChild(script);
}

export function disableAnalytics() {
  setDisabled(true);
  if (loaded) gtag("consent", "update", { analytics_storage: "denied" });
  deleteAnalyticsCookies();
}

/** GA sets its cookies on the highest possible domain, so try every level of the host name. */
function deleteAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => GA_COOKIE.test(name));
  if (names.length === 0) return;
  const labels = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < labels.length - 1; i += 1) domains.push(`; domain=.${labels.slice(i).join(".")}`);
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}
