# Web analytics and session tools: comparison for sven-maibaum.com

Date read: 2026-10-16 (all sources). Scope: visitor counts, sources, page and section views, click/scroll heatmaps, session recordings, for a static React SPA (GitHub Pages, React Router, DE/EN), under GDPR and TDDDG § 25.

Method: each vendor page was downloaded with curl and every number, limit, price, retention period and hosting claim was grepped in the raw text. WebSearch was used only to find URLs, never as evidence. Legend: unmarked = verified in raw text; [U] = UNVERIFIED (see the list at the end). This is research, not legal advice. Whether a given setup needs consent under § 25 TDDDG is a question for counsel.

## 1. Comparison: hosting, privacy, consent

| Tool | Company / seat | EU hosting | DPA | Cookies / storage | Vendor own use of data | Consent needed (if storage is used) |
|---|---|---|---|---|---|---|
| PostHog Cloud | PostHog Inc. (US); German subsidiary PostHog GmbH (privacy policy) | Yes: "EU (Frankfurt)" selectable at signup | Yes, self-serve, countersigned at app.posthog.com/legal | Default: localStorage+cookie. Cookieless mode: none | Yes by default: Customer Content may be used for "Product and Model Development" unless the customer opts out in app settings | Yes in default mode. Cookieless "always" stores nothing (vendor statement) |
| Microsoft Clarity | Microsoft Corp.; EU customers contract with Microsoft Ireland Operations Ltd (FAQ) | No region choice documented. "Your data is stored in the Microsoft Azure cloud service" | Not found. FAQ calls Clarity a "data controller". Microsoft DPA URL timed out [U] | Yes: _clck and _clsk cookies | "Clarity doesn't sell data." Third-party cookies serve "operational purposes like advertising". Microsoft's own use: [U] | Yes. Consent enforced in EEA, UK, CH since 31 Oct 2025 |
| Hotjar | Hotjar Ltd (copyright line); pricing page lists "Contentsquare AI" (ownership [U]) | Yes: "stored in Ireland ... AWS ... eu-west-1". Sub-processors outside EU exist | [U] (legal pages blocked) | Yes [U] (tracking-code cookie article returned 403) | Data "exclusively reserved for use by our users and customers" unless the account admin consents | [U] |
| Matomo Cloud | InnoCraft (DPA counterparty) | Yes: Frankfurt (AWS), backups in Dublin | Yes: matomo.org/matomo-cloud-dpa | Heatmap/recording: first-party _pk_hsr cookie. Analytics cookies: [U] | No sale; DPA bars sharing for cross-context ads and targeted advertising | Vendor: consent-exempt setups exist. Details [U] |
| Plausible | Plausible Analytics; legal entity incorporated in Estonia | Yes: "Visitor data does not leave the EU", hosted in Germany | Yes, automatic for all customers | None: "We do not use cookies, browser cache or local storage" | "Your data is not used for advertising, profiling or monetization" | No (vendor claim, no storage) |
| Umami Cloud | Umami Software, Inc. (privacy policy) | "servers are located in the US and EU". Choosing the region: [U] | Yes: umami.is/dpa (processor terms) | None ("Umami does not use cookies") | "have not disclosed, sold, or shared any personal information" in prior 12 months | No (vendor claim) |
| Mouseflow | Mouseflow (DPA: Danish law; Düsseldorf address) | "Accounts with EU data residency" exist (DPA § 5.7). Plan needed: [U] | Yes: mouseflow.com/legal/dpa | Opt-out "via cookie settings" implies cookies | "We do not sell or share personal data" | [U] |
| OpenReplay | [U] (company seat not checked) | Self-host: you choose. Cloud: "Data residency — 50 regions" (EU not named) [U] | [U] | [U] | [U] | Self-host: no vendor involvement |

## 2. Comparison: features, SPA, masking, price

| Tool | Heatmaps (click/scroll) | Session recordings | Funnels / page views | SPA route changes | Manual init / consent gating | Masking in recordings | Free tier | Entry paid price |
|---|---|---|---|---|---|---|---|---|
| PostHog Cloud | Yes: click, scroll, dead and rage clicks. Free plan: 3 URLs | Yes. Free: 5K recordings/month | Product analytics and funnels: yes | Yes: capture_pageview "history_change" (default in recent defaults sets) | Yes: opt_out_capturing_by_default + opt_in_capturing(). cookieless_mode "always" or "on_reject" | Inputs masked by default. maskAllInputs, maskTextSelector, maskTextFn | 1M events, 5K recordings, 1M flag requests, 1 project, 1-year retention. Free recordings kept 1 month | Pay-as-you-go, per-unit rates [U] |
| Microsoft Clarity | Yes (homepage) | Yes | Funnel tracking: yes (FAQ) | [U] (no official page found) | Consent Mode (on by default in EEA). clarity("consent", ...) API | Default "Balanced" (numbers and emails masked). Strict and Relaxed modes. Inputs always masked | "Free service forever", no traffic limits. Data kept 30 days | 0 |
| Hotjar | Heatmaps included on free plan | Yes. Free plan records 5% of sessions (max 10k) | Funnels on all plans | [U] | [U] | Inputs suppressed by default. Text suppression site-wide and per element | Free: "200k monthly sessions", 1 project, "1 month" data access | Growth from $39/month |
| Matomo Cloud | Click, mouse-move and scroll heatmaps (add-on) | Yes (add-on). Cloud keeps 3 months | Funnels in Cloud feature list | Yes: heatmaps "fully supported out of the box". Analytics: History Change trigger (dev docs) | Consent-exempt configurations (vendor). Options [U] | Inputs, textarea, password masked. data-matomo-mask. Keystrokes off by default since 3.2.0 | No Cloud free tier. 21-day trial, no credit card | 29 per month for 50,000 hits (currency symbol missing in static HTML [U]) |
| Plausible | No | No | Funnels; scroll-depth tracking (no setup) | [U] | No consent needed (no storage) | n/a | 30-day trial. No free plan shown | $9/month for 10k pageviews |
| Umami Cloud | Business plan only ($200/month) | Business plan only: 5,000 replays included | Funnel analysis on all plans | [U] | data-auto-track="false" for manual pageviews | Replays: "moderate" masks inputs, "strict" masks all text. Block selector | Hobby $0: 100K events, 1 website, 6-month retention | Pro $20/month (1M events). Replays and heatmaps need Business |
| Mouseflow | Click and scroll heatmaps listed (tier [U]) | Yes | 1 funnel on paid entry plan | [U] | [U] | IPs and keystrokes masked by default. Text masking [U] | Free: 500 sessions/month, 1-month retention | Essential 25/month, 5,000 sessions (currency [U]) |
| OpenReplay | Listed on pricing | Listed (session replay) | Listed (funnels) | [U] | [U] | [U] | Self-hosted open source: free | Dedicated from $199/month |

## 3. Per tool: sources and key findings

**PostHog (EU Cloud).** Read 2026-10-16.
- Pricing: https://posthog.com/pricing. Free: 1M events, 5K recordings, 1 project, 1-year retention. Recordings on free kept 1 month, pay-as-you-go 90 days. Region selector shows "US (Virginia)" and "EU (Frankfurt)".
- Hosting: https://posthog.com/docs/privacy/data-storage ("PostHog Cloud EU ... hosted on servers based in Frankfurt"). Privacy policy: https://posthog.com/privacy ("hosted ... in Germany if you are a PostHog Cloud customer who has selected EU hosting").
- Own use: privacy policy, "Product and Model Development": Customer Content may be used "unless ... Customer has opted out through the applicable service settings".
- DPA: https://posthog.com/dpa (preview; countersigned version at app.posthog.com/legal).
- Heatmaps: https://posthog.com/docs/toolbar/heatmaps. "Heatmap data is free to ingest." "Viewing heatmaps from the toolbar requires a pay-as-you-go plan." Free plan lists up to 3 URLs.
- Masking: https://posthog.com/docs/session-replay/privacy. Inputs masked by default. Text masking via maskTextSelector and maskTextFn.
- Cookieless and consent: https://posthog.com/tutorials/cookieless-tracking. "always" never stores in cookies or local/session storage. "on_reject" stores nothing until the user opts in. Session replay and surveys are disabled without cookie consent.
- JS config: https://posthog.com/docs/libraries/js/config. capture_pageview "history_change" for SPAs. opt_out_capturing_by_default (default false). persistence "memory" option.
- Script size: not stated on the pages read [U].

**Microsoft Clarity.** Read 2026-10-16.
- Pricing and features: https://clarity.microsoft.com/ ("Für immer kostenlos", German page). FAQ: https://learn.microsoft.com/en-us/clarity/faq ("Clarity is a free service forever"). No traffic limits.
- Hosting and DPA: FAQ "Your data is stored in the Microsoft Azure cloud service"; EU customers contract with MIOL. "Clarity is GDPR-compliant as a data controller." DPA: [U] (timeout).
- Consent: https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-consent. Consent Mode on by default in EEA/UK/CH. Cookies _clck and _clsk. Without consent, each pageview counts as a separate session (no-consent page).
- Masking: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking (Balanced default, Strict, Relaxed; inputs always masked).
- Retention: FAQ "retained for the webmaster's consumption up to 30 days".
- Caveat: FAQ says third-party cookies support "operational purposes like advertising", and the UET tag in Microsoft Advertising controls Clarity. Microsoft's own use of Clarity data: [U] (terms page is JS-rendered, https://clarity.microsoft.com/terms).

**Hotjar.** Read 2026-10-16.
- Pricing: https://www.hotjar.com/pricing/. Free: 200k monthly sessions listed, 1 project, 1 month data access, "5% sessions captured (max. 10k)" for replays. Growth "From $39 / month". Contentsquare AI listed.
- Hosting: https://help.hotjar.com/hc/en-us/articles/36819972898193-Data-Safety-Privacy-Security. "stored in Ireland ... eu-west-1". Sub-processors outside EU.
- Retention conflict: pricing says free "1 month data access"; https://help.hotjar.com/hc/en-us/articles/36819991007505-How-Long-Does-Hotjar-Keep-My-Data says Recordings and Heatmaps keep data "365 days ... This applies to all accounts and plans". Which one applies to free: unresolved.
- Masking: https://help.hotjar.com/hc/en-us/articles/36819956605329-How-to-Suppress-Text-Images-Videos-and-User-Input-from-Collected-Data. "By default, Hotjar suppresses user input."
- Blocked: privacy policy and GDPR pages (403), DPA (not found), cookie list (403). SPA and consent-gating docs: not found on official pages [U].

**Matomo Cloud.** Read 2026-10-16.
- Pricing: https://matomo.org/pricing/. Cloud entry plan 50,000 hits, "29 Per month (excl. tax)". 21-day trial (https://matomo.org/cloud/); no credit card needed for the trial (https://matomo.org/pricing/). "When you choose to use our Cloud-hosted version, the data is stored in Frankfurt, Germany."
- DPA: https://matomo.org/matomo-cloud-dpa/. Hosting "by Amazon Web Services (AWS) in European data centres (Frankfurt, with backups in Dublin)". Session recording captures "all mouse events ... and keypresses". Deletion within 30 days after termination.
- Own use: DPA bars sale and targeted advertising. Privacy policy: "We will never sell your personal data to anyone."
- Heatmaps: https://matomo.org/faq/heatmap-session-recording/faq_24217/ (click, mouse move, scroll). Recording retention on Cloud: 3 months (https://matomo.org/faq/heatmap-session-recording/how-long-can-i-keep-heatmaps-and-session-recordings/). Cookie _pk_hsr: https://matomo.org/faq/heatmap-session-recording/faq_24303/.
- Masking: https://matomo.org/faq/heatmap-session-recording/data-masking-in-heatmaps-and-session-recordings/. Keystroke recording off by default since 3.2.0.
- SPA: https://matomo.org/faq/heatmap-session-recording/faq_24229/ ("fully supported out of the box"). https://developer.matomo.org/guides/spa-tracking (History Change trigger).
- Consent: https://matomo.org/cookie-consent-banners/ (cookieless tracking article). Add-on prices: [U] (JS-rendered).

**Plausible.** Read 2026-10-16.
- Pricing (from homepage): https://plausible.io/ shows $9/month (up to 10k pageviews), $14/month (Growth), $19/month (Business), 30-day free trial, no card. https://plausible.io/pricing returned 404.
- Hosting and no-cookie claim: https://plausible.io/data-policy ("Visitor data does not leave the EU"; "We do not use cookies, browser cache or local storage"; "not used for advertising, profiling or monetization").
- DPA: https://plausible.io/dpa (data "hosted ... in Germany"). Automatic for all customers: https://plausible.io/docs/compliance.
- Script: homepage says "54 times smaller than Google Analytics", "135KB less JavaScript". Absolute size: [U].
- No heatmaps and no session recordings on homepage or docs (0 matches). Scroll-depth tracking is built in.
- SPA routing: no statement in https://plausible.io/docs/plausible-script [U].

**Umami Cloud.** Read 2026-10-16.
- Pricing: https://umami.is/pricing. Hobby $0 (100K events, 1 website, 6-month retention). Pro $20/month (1M events, 2-year retention). Business $200/month (10M events, 5-year retention, session replays, heatmaps). Replays: 5,000 included, then $0.005 each.
- Hosting: https://docs.umami.is/docs/cloud/faq. "Umami Cloud servers are located in the US and EU." Region selection: [U].
- Cookies: https://docs.umami.is/docs/tracker-configuration ("Umami does not use cookies to tell them apart"). Homepage: "No cookies, no consent banner".
- DPA: https://umami.is/dpa. Privacy: https://umami.is/privacy ("have not disclosed, sold, or shared any personal information").
- Manual control: data-auto-track="false" with manual pageviews (tracker-configuration).
- Replays: https://docs.umami.is/docs/replays (sample rate, mask levels, block selector). Replay storage and cookies: [U].
- SPA routing: [U] (not stated on fetched docs).

**Mouseflow (other EU-residency option).** Read 2026-10-16.
- Pricing: https://www.mouseflow.com/pricing/. Free: 500 monthly sessions, 1 project, 1-month retention. Essential: 25/month, 5,000 sessions, 3-month retention, 1 funnel. Currency symbol absent in static HTML [U].
- DPA: https://www.mouseflow.com/legal/dpa/. § 5.7 "Accounts with EU data residency ... storage and automated processing shall be carried out exclusively within ... the EU or the EEA". Which plan: [U]. Third-party claims about Belgium/Google Cloud and US hosting conflict and are not used.
- Privacy: https://www.mouseflow.com/legal/privacy/ ("We do not sell or share personal data"; "IPs and keystrokes are masked by default").

**OpenReplay (other, self-host).** Read 2026-10-16.
- Pricing: https://openreplay.com/pricing/. Self-hosted open source: free. Dedicated "From $199/mo" (7-day trial). Serverless usage-based (price [U]).
- Self-hosting needs your own server, which a GitHub Pages site does not provide. Not recommended for this site.

## 4. Recommendation

Requirements: EU hosting, heatmaps, recordings, free or low cost, manual init after consent.

**Best fit: PostHog Cloud, EU (Frankfurt), free plan.** It meets all four requirements on verified facts:
- EU hosting is selectable (pricing page and privacy policy).
- Heatmaps (click, scroll) and recordings are included, with 5K recordings and 1M events per month free.
- Consent-gated loading is documented: opt_out_capturing_by_default plus opt_in_capturing() after consent. Or cookieless_mode "on_reject" if you want counts without a banner.
- Recordings are masked for inputs by default. Text masking is configurable.

Set-up points:
1. Create the project in the EU region at signup. Region cannot be assumed to be changeable later [U].
2. Sign the DPA in app.posthog.com/legal.
3. Opt out of "Product and Model Development" through the app settings. The privacy policy confirms the opt-out exists; the exact menu was not checked.
4. Initialise with opt_out_capturing_by_default: true and call opt_in_capturing() only after consent. Use persistence "memory" until then.
5. Set maskAllInputs: true and maskTextSelector for sensitive blocks. Note that heatmap viewing in the toolbar needs pay-as-you-go.
6. Use capture_pageview: "history_change". The docs say it listens to the browser History API, which React Router uses. Confirm with a test on this site.

Runners-up:
- **Matomo Cloud**: strongest EU and DPA posture (Frankfurt, DPA with no-sale wording, documented SPA support). No free Cloud tier, and heatmap/recording add-on prices are unverified. Pick it if the budget allows.
- **Hotjar**: free heatmaps and recordings with Ireland hosting. Weaknesses: free replay capture is only 5%, the retention statement conflicts, cookie and DPA details are unverified.
- **Umami Cloud**: no cookies, EU servers, DPA. Heatmaps and replays need Business at $200/month, so it fails the low-cost requirement.
- **Plausible**: best privacy story and cheapest paid plan, but no heatmaps and no recordings. Good as a second, cookieless analytics layer if desired.
- **Microsoft Clarity**: free, with heatmaps and recordings. It is not a good fit for this brief: Clarity describes itself as a controller (FAQ), no EU residency choice is documented, the DPA is unverified, and cookies require consent in the EEA.
- **Mouseflow**: EU-residency accounts exist and the free tier is usable, but the plan needed and the currency are unverified.

## 5. Unverified list

1. PostHog JS SDK script size. Checked: https://posthog.com/docs/libraries/js/config (not stated).
2. PostHog pay-as-you-go unit prices (recordings, events). https://posthog.com/pricing (values come from calculator, not static HTML).
3. Clarity script size. https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup (not stated).
4. Clarity SPA route handling. No official page found. Guessed learn.microsoft.com URLs returned 404.
5. Clarity DPA. https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA (curl timeout).
6. Clarity: Microsoft's own use of Clarity data. https://clarity.microsoft.com/terms (JS-rendered, no text).
7. Hotjar privacy policy and GDPR commitment. https://www.hotjar.com/legal/policies/privacy/ and https://www.hotjar.com/legal/compliance/gdpr-commitment/ (403).
8. Hotjar DPA. https://www.hotjar.com/legal/policies/dpa/ (404). Other guessed paths 404.
9. Hotjar tracking-code cookies. https://help.hotjar.com/hc/en-us/articles/36819973371409-Cookies-Set-by-the-Hotjar-Tracking-Code (403).
10. Hotjar SPA handling and consent-gated loading. Official docs not fetched.
11. Hotjar script size. Not checked.
12. Hotjar retention conflict: "1 month" (pricing) vs "365 days ... all accounts and plans" (help article). Which applies to free: unresolved.
13. Hotjar headquarters (Malta) and Contentsquare ownership: only third-party sources, plus the "Contentsquare AI" listing on the pricing page.
14. Matomo entry price currency (https://matomo.org/pricing/): symbol not in static HTML.
15. Matomo heatmap/recording add-on prices and quotas (https://matomo.org/pricing/): JS-rendered.
16. Matomo analytics cookie names, tracker script size, consent-exempt options. https://matomo.org/cookie-consent-banners/ and https://developer.matomo.org/guides/spa-tracking.
17. Plausible absolute script size (only "54 times smaller than GA" verified). https://plausible.io/ .
18. Plausible SPA route handling. https://plausible.io/docs/plausible-script (not stated). https://plausible.io/pricing is 404.
19. Umami: SPA route handling, replay cookies or storage, script size, region choice. https://docs.umami.is/docs/tracker-configuration, https://docs.umami.is/docs/replays, https://docs.umami.is/docs/cloud/faq.
20. Mouseflow: currency of plan prices (https://www.mouseflow.com/pricing/); which plan includes EU residency; heatmap availability per tier; text masking; SPA handling.
21. OpenReplay: company seat (third-party: France); EU-specific region; cloud free tier and serverless price; privacy page https://openreplay.com/privacy-policy/ (404).
22. Third-party claims not used as facts: Plausible hosted on Hetzner in Falkenstein; Mouseflow EU hosting in Belgium on Google Cloud; Mouseflow hosting in the US per EuroStack.
