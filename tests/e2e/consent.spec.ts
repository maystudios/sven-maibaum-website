import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import type { BrowserContext, Locator, Page } from "@playwright/test";

/**
 * Consent, analytics and third-party checks against the production build.
 * Network logs and screenshots go to CONSENT_EVIDENCE_DIR (default test-results/consent-evidence).
 */

const MEASUREMENT_ID = "G-TSBZ01TVDR";
const CONSENT_KEY = "consent";
const GA_COOKIE = /^_ga($|_)/;
const evidenceDir = process.env.CONSENT_EVIDENCE_DIR ?? join("test-results", "consent-evidence");

type LoggedRequest = {
  time: number;
  method: string;
  url: string;
  host: string;
  type: string;
  postData?: string;
};

type GaEvent = { name: string; page: string; tid: string | null; params: Record<string, string> };

function recordRequests(context: BrowserContext) {
  const log: LoggedRequest[] = [];
  const start = Date.now();
  context.on("request", (request) => {
    const url = request.url();
    log.push({
      time: Date.now() - start,
      method: request.method(),
      url,
      host: url.startsWith("http") ? new URL(url).host : "",
      type: request.resourceType(),
      postData: request.postData() ?? undefined,
    });
  });
  return log;
}

function thirdParty(log: LoggedRequest[], baseURL: string | undefined) {
  const own = new URL(baseURL ?? "http://localhost").host;
  return log.filter((entry) => entry.host !== "" && entry.host !== own);
}

const isGoogle = (entry: LoggedRequest) => /(^|\.)(google|googletagmanager|google-analytics|doubleclick|googleapis|gstatic)\./.test(entry.host);

/** GA4 hits: shared parameters in the URL, one event per body line when batched. */
function gaEvents(log: LoggedRequest[]): GaEvent[] {
  return log
    .filter((entry) => /\/g\/collect\?/.test(entry.url))
    .flatMap((entry) => {
      const url = new URL(entry.url);
      const lines = entry.postData ? entry.postData.split(/\r?\n/).filter(Boolean) : [""];
      return lines.map((line) => {
        const params = Object.fromEntries(url.searchParams);
        for (const [key, value] of new URLSearchParams(line)) params[key] = value;
        return {
          name: params.en ?? "",
          page: params.dl ? new URL(params.dl).pathname : "",
          tid: params.tid ?? null,
          params,
        };
      });
    });
}

const pageViews = (log: LoggedRequest[]) => gaEvents(log).filter((event) => event.name === "page_view").map((event) => event.page);

function saveEvidence(name: string, data: unknown) {
  mkdirSync(evidenceDir, { recursive: true });
  writeFileSync(join(evidenceDir, name), JSON.stringify(data, null, 2));
}

const slug = (route: string) => (route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "-"));

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
}

const banner = (page: Page) => page.getByRole("dialog", { name: "Cookie-Einstellungen" });
const switchFor = (scope: Locator, name: string) => scope.getByRole("switch", { name: new RegExp(name) });

async function storedChoice(page: Page) {
  return page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? "null"), CONSENT_KEY);
}

async function focusIsInBanner(page: Page) {
  return page.evaluate(() => Boolean(document.activeElement?.closest("[role='dialog']")));
}

async function gaCookieNames(context: BrowserContext) {
  return (await context.cookies()).map((cookie) => cookie.name).filter((name) => GA_COOKIE.test(name)).sort();
}

/** Presses Tab until the focused element's accessible text matches. */
async function tabTo(page: Page, name: string | RegExp, max = 30) {
  for (let i = 0; i < max; i += 1) {
    await page.keyboard.press("Tab");
    const label = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el ? (el.getAttribute("aria-label") ?? el.textContent ?? "").replace(/\s+/g, " ").trim() : "";
    });
    if (typeof name === "string" ? label === name : name.test(label)) return;
  }
  throw new Error(`Tab never reached ${String(name)}`);
}

test.describe("before any choice", () => {
  for (const route of ["/", "/projekte/heistline/", "/projekte/mr-dork-3/", "/links/", "/datenschutz/", "/impressum/"]) {
    test(`requests nothing from third parties on ${route}`, async ({ page, context, baseURL }) => {
      const log = recordRequests(context);
      await page.goto(route, { waitUntil: "load" });
      // The page really rendered: the banner asks, and game pages show the Steam placeholder.
      await expect(banner(page)).toBeVisible();
      if (route.includes("heistline") || route.includes("mr-dork")) {
        await expect(page.locator('[data-consent-placeholder="steam"]')).toBeVisible();
      }
      await scrollThrough(page);
      await page.waitForLoadState("networkidle");
      const foreign = thirdParty(log, baseURL);
      const cookies = await context.cookies();
      const storage = await page.evaluate(() => ({
        local: Object.keys(window.localStorage),
        session: Object.keys(window.sessionStorage),
      }));
      saveEvidence(`network-before-consent-${slug(route)}.json`, {
        route,
        requests: log.length,
        thirdParty: foreign.map((entry) => entry.url),
        cookies,
        storage,
        all: log.map((entry) => `${entry.method} ${entry.url}`),
      });
      expect(foreign.map((entry) => entry.url)).toEqual([]);
      expect(cookies).toEqual([]);
      expect(storage).toEqual({ local: [], session: [] });
    });
  }

  test("prerendered HTML carries no banner state and no third-party references", async ({ request }) => {
    for (const route of ["/", "/datenschutz/", "/links/", "/projekte/heistline/"]) {
      const html = await (await request.get(route)).text();
      expect(html).toContain('<div id="root"></div>');
      expect(html).not.toMatch(/Cookie-Einstellungen|googletagmanager|fonts\.googleapis|fonts\.gstatic|cdnjs|placehold\.co/);
    }
  });
});

test.describe("banner", () => {
  test("offers three equal choices with nothing preselected", async ({ page }) => {
    await page.goto("/");
    const dialog = banner(page);
    await expect(dialog).toBeVisible();
    const buttons = ["Alle akzeptieren", "Ablehnen", "Einstellungen"].map((name) => dialog.getByRole("button", { name, exact: true }));
    const looks = await Promise.all(
      buttons.map((button) =>
        button.evaluate((el) => {
          const style = getComputedStyle(el);
          return {
            background: style.backgroundColor,
            color: style.color,
            border: `${style.borderTopWidth} ${style.borderTopStyle} ${style.borderTopColor}`,
            weight: style.fontWeight,
            size: style.fontSize,
            height: Math.round(el.getBoundingClientRect().height),
          };
        }),
      ),
    );
    for (const look of looks) {
      expect(look).toEqual(looks[0]);
      expect(look.height).toBeGreaterThanOrEqual(44);
    }

    await buttons[2].click();
    for (const name of ["Statistik", "Externe Medien"]) {
      const toggle = switchFor(dialog, name);
      await expect(toggle).toHaveAttribute("aria-checked", "false");
      expect((await toggle.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
    expect(await storedChoice(page)).toBeNull();
  });

  test("keyboard alone moves into the banner, ticks a category and saves", async ({ page }) => {
    await page.goto("/");
    const dialog = banner(page);
    await expect(dialog).toBeVisible();
    await expect.poll(() => focusIsInBanner(page)).toBe(true);
    // Escape cannot dismiss the banner before a choice exists.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeVisible();

    await tabTo(page, "Einstellungen");
    await page.keyboard.press("Enter");
    await tabTo(page, /^Statistik/);
    await page.keyboard.press("Space");
    await expect(switchFor(dialog, "Statistik")).toHaveAttribute("aria-checked", "true");
    await tabTo(page, "Auswahl speichern");
    await page.keyboard.press("Enter");

    await expect(dialog).toBeHidden();
    expect(await storedChoice(page)).toMatchObject({ version: 1, statistics: true, externalMedia: false });
    // Focus goes to the page content, not to <body>.
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe("MAIN");
  });

  test("asks again when the stored choice is outdated, expired or unreadable", async ({ page }) => {
    const yearAgo = new Date(Date.now() - 366 * 86_400_000).toISOString();
    const records = [
      JSON.stringify({ version: 0, updatedAt: new Date().toISOString(), statistics: true, externalMedia: true }),
      JSON.stringify({ version: 1, updatedAt: yearAgo, statistics: true, externalMedia: true }),
      "{not json",
    ];
    for (const record of records) {
      await page.goto("/impressum/");
      await page.evaluate(([key, value]) => window.localStorage.setItem(key, value), [CONSENT_KEY, record]);
      await page.reload();
      await expect(banner(page)).toBeVisible();
      await banner(page).getByRole("button", { name: "Einstellungen", exact: true }).click();
      await expect(switchFor(banner(page), "Statistik")).toHaveAttribute("aria-checked", "false");
    }
  });

  test("rejecting stores the choice, loads nothing from Google, and the footer reopens the banner", async ({ page, context, baseURL }) => {
    const log = recordRequests(context);
    await page.goto("/");
    const dialog = banner(page);
    await dialog.getByRole("button", { name: "Ablehnen", exact: true }).click();
    await expect(dialog).toBeHidden();
    const choice = await storedChoice(page);
    expect(choice).toMatchObject({ version: 1, statistics: false, externalMedia: false });
    expect(Number.isNaN(Date.parse(choice.updatedAt))).toBe(false);

    await page.reload();
    await expect(page.locator("footer").first()).toBeAttached();
    await expect(dialog).toBeHidden();

    const footerButton = page.getByRole("button", { name: "Cookie-Einstellungen" });
    await footerButton.click();
    await expect(dialog).toBeVisible();
    await expect.poll(() => focusIsInBanner(page)).toBe(true);
    await expect(switchFor(dialog, "Statistik")).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(footerButton).toBeFocused();

    await page.goto("/links/");
    await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
    await expect(dialog).toBeVisible();

    const foreign = thirdParty(log, baseURL);
    saveEvidence("network-after-reject.json", { thirdParty: foreign.map((entry) => entry.url), requests: log.length });
    expect(foreign).toEqual([]);
  });

  test("does not shift the layout", async ({ page }) => {
    const layoutShift = () =>
      page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let total = 0;
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
                if (!entry.hadRecentInput) total += entry.value;
              }
            }).observe({ type: "layout-shift", buffered: true });
            setTimeout(() => resolve(total), 3000);
          }),
      );
    await page.goto("/");
    await expect(banner(page)).toBeVisible();
    const withBanner = await layoutShift();
    await page.evaluate(
      (key) => window.localStorage.setItem(key, JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), statistics: false, externalMedia: false })),
      CONSENT_KEY,
    );
    await page.reload();
    await expect(page.locator("footer").first()).toBeAttached();
    await expect(banner(page)).toBeHidden();
    const withoutBanner = await layoutShift();
    saveEvidence("layout-shift.json", { withBanner, withoutBanner });
    expect(withBanner - withoutBanner).toBeLessThan(0.01);
  });

  for (const route of ["/datenschutz/", "/impressum/"]) {
    test(`leaves ${route} readable on a phone`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);
      const dialog = banner(page);
      await expect(dialog).toBeVisible();
      const box = (await dialog.boundingBox())!;
      expect(box.height).toBeLessThan(844 * 0.5);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect
        .poll(() => page.locator("footer").last().evaluate((el) => Math.round(el.getBoundingClientRect().bottom)))
        .toBeLessThanOrEqual(Math.round(box.y) + 1);
    });
  }

  test("screenshots at 390 and 1440 px", async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto("/");
      const dialog = banner(page);
      await expect(dialog).toBeVisible();
      await page.screenshot({ path: join(evidenceDir, `banner-${width}.png`) });
      await dialog.getByRole("button", { name: "Einstellungen", exact: true }).click();
      await expect(switchFor(dialog, "Statistik")).toBeVisible();
      await page.screenshot({ path: join(evidenceDir, `banner-${width}-settings.png`) });
      await page.goto("/links/");
      await expect(dialog).toBeVisible();
      await page.screenshot({ path: join(evidenceDir, `banner-${width}-links.png`) });
      await page.goto("/projekte/heistline/");
      const placeholder = page.locator('[data-consent-placeholder="steam"]');
      await placeholder.scrollIntoViewIfNeeded();
      await page.screenshot({ path: join(evidenceDir, `steam-placeholder-${width}.png`) });
    }
  });
});

test.describe("statistics", () => {
  test("accepting loads GA and sends one page_view per route change", async ({ page, context }) => {
    const log = recordRequests(context);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(log.filter(isGoogle)).toEqual([]);

    await banner(page).getByRole("button", { name: "Alle akzeptieren", exact: true }).click();
    await expect.poll(() => pageViews(log), { timeout: 20_000 }).toEqual(["/"]);
    expect(gaEvents(log).every((event) => event.tid === MEASUREMENT_ID)).toBe(true);
    await expect.poll(() => gaCookieNames(context)).toEqual(["_ga", `_ga_${MEASUREMENT_ID.slice(2)}`]);

    await page.locator("footer").getByRole("link", { name: "Impressum", exact: true }).click();
    await expect(page).toHaveURL(/\/impressum$/);
    await expect.poll(() => pageViews(log), { timeout: 20_000 }).toEqual(["/", "/impressum"]);
    await page.locator("footer").getByRole("link", { name: "Datenschutz", exact: true }).click();
    await expect(page).toHaveURL(/\/datenschutz$/);
    await expect.poll(() => pageViews(log), { timeout: 20_000 }).toEqual(["/", "/impressum", "/datenschutz"]);

    // Absence of a duplicate can only be shown by waiting past GA's batching window.
    await page.waitForTimeout(6000);
    expect(pageViews(log)).toEqual(["/", "/impressum", "/datenschutz"]);
    // Consent Mode: ads storage denied, analytics granted (gcs=G101); no ad personalisation (npa=1).
    for (const event of gaEvents(log)) {
      expect(event.params.gcs).toBe("G101");
      expect(event.params.npa).toBe("1");
    }
    const hosts = [...new Set(log.filter(isGoogle).map((entry) => entry.host))].sort();
    saveEvidence("network-after-accept.json", {
      googleHosts: hosts,
      gaEvents: gaEvents(log),
      google: log.filter(isGoogle).map((entry) => `${entry.method} ${entry.url}`),
    });
    for (const host of hosts) expect(host).toMatch(/^(www\.googletagmanager\.com|([a-z0-9-]+\.)?google-analytics\.com)$/);
  });

  test("contact form values never reach Google", async ({ page, context }) => {
    const log = recordRequests(context);
    await page.route("https://api.emailjs.com/**", (route) => route.fulfill({ status: 200, contentType: "text/plain", body: "OK" }));
    await page.goto("/");
    await banner(page).getByRole("button", { name: "Alle akzeptieren", exact: true }).click();
    await expect.poll(() => pageViews(log), { timeout: 20_000 }).toEqual(["/"]);

    const values = { name: "Kanarienvogel", email: "kanarienprobe@example.org", message: "Nachrichtenkanarie4711" };
    await page.locator("#name").fill(values.name);
    await page.locator("#email").fill(values.email);
    await page.locator("#message").fill(values.message);
    await page.getByRole("button", { name: "Nachricht senden" }).click();
    // GA saw the form (otherwise the check below would pass vacuously) ...
    await expect.poll(() => gaEvents(log).some((event) => event.name === "form_start"), { timeout: 20_000 }).toBe(true);
    // ... and form events are batched; wait for GA to flush before checking what it sent.
    await page.waitForTimeout(8000);

    const sent = log.filter(isGoogle).map((entry) => {
      const raw = `${entry.url}\n${entry.postData ?? ""}`;
      return `${raw}\n${decodeURIComponent(raw.replace(/\+/g, " "))}`;
    });
    saveEvidence("ga-form-events.json", gaEvents(log).filter((event) => event.name !== "page_view"));
    for (const value of Object.values(values)) {
      for (const payload of sent) expect(payload).not.toContain(value);
    }
  });

  test("withdrawing stops GA and deletes its cookies", async ({ page, context }) => {
    const log = recordRequests(context);
    await page.goto("/");
    const dialog = banner(page);
    await dialog.getByRole("button", { name: "Alle akzeptieren", exact: true }).click();
    await expect.poll(() => pageViews(log), { timeout: 20_000 }).toEqual(["/"]);
    await expect.poll(() => gaCookieNames(context)).toEqual(["_ga", `_ga_${MEASUREMENT_ID.slice(2)}`]);
    const cookiesBefore = await gaCookieNames(context);
    // GA sends events in batches; let it flush, so every later hit belongs to the withdrawal phase.
    await page.waitForTimeout(6000);
    const hitsBeforeWithdrawal = gaEvents(log).length;

    // Reopen without scrolling: a scroll here would queue a GA scroll event before the withdrawal.
    await page.getByRole("button", { name: "Cookie-Einstellungen" }).dispatchEvent("click");
    const statistics = switchFor(dialog, "Statistik");
    await expect(statistics).toHaveAttribute("aria-checked", "true");
    await statistics.click();
    await dialog.getByRole("button", { name: "Auswahl speichern" }).click();
    await expect(dialog).toBeHidden();
    await expect.poll(() => gaCookieNames(context)).toEqual([]);
    expect(await storedChoice(page)).toMatchObject({ statistics: false, externalMedia: true });

    // Each of these would produce GA events if the tag were still sending:
    // the 90 % scroll on "/" and two client-side route changes.
    await scrollThrough(page);
    await page.locator("footer").getByRole("link", { name: "Impressum", exact: true }).click();
    await expect(page).toHaveURL(/\/impressum$/);
    await page.locator("footer").getByRole("link", { name: "Datenschutz", exact: true }).click();
    await expect(page).toHaveURL(/\/datenschutz$/);
    // Absence of hits can only be shown by waiting past GA's batching window.
    await page.waitForTimeout(6000);
    const eventsAfterWithdrawal = gaEvents(log).slice(hitsBeforeWithdrawal);
    const cookiesAfterNavigation = await gaCookieNames(context);

    const beforeReload = log.length;
    await page.reload();
    await page.waitForLoadState("networkidle");
    const afterReload = log.slice(beforeReload).filter(isGoogle);
    saveEvidence("network-withdrawal.json", {
      cookiesBefore,
      cookiesAfterNavigation,
      eventsBeforeWithdrawal: gaEvents(log).slice(0, hitsBeforeWithdrawal).map(({ name, page: path, params }) => ({ name, path, gcs: params.gcs })),
      eventsAfterWithdrawal: eventsAfterWithdrawal.map(({ name, page: path, params }) => ({ name, path, params })),
      googleRequestsAfterReload: afterReload.map((entry) => entry.url),
    });
    expect(eventsAfterWithdrawal).toEqual([]);
    expect(cookiesAfterNavigation).toEqual([]);
    expect(afterReload).toEqual([]);
  });

  test("consent given again in the same page resumes GA from the next route change", async ({ page, context }) => {
    const log = recordRequests(context);
    await page.goto("/");
    const dialog = banner(page);
    await dialog.getByRole("button", { name: "Alle akzeptieren", exact: true }).click();
    await expect.poll(() => pageViews(log), { timeout: 20_000 }).toEqual(["/"]);

    const settingsButton = page.getByRole("button", { name: "Cookie-Einstellungen" });
    await settingsButton.dispatchEvent("click");
    await switchFor(dialog, "Statistik").click();
    await dialog.getByRole("button", { name: "Auswahl speichern" }).click();
    await expect.poll(() => gaCookieNames(context)).toEqual([]);

    await settingsButton.dispatchEvent("click");
    await switchFor(dialog, "Statistik").click();
    await dialog.getByRole("button", { name: "Auswahl speichern" }).click();
    await page.locator("footer").getByRole("link", { name: "Impressum", exact: true }).click();
    await expect(page).toHaveURL(/\/impressum$/);
    await expect.poll(() => pageViews(log), { timeout: 20_000 }).toEqual(["/", "/impressum"]);
    await expect.poll(() => gaCookieNames(context)).toEqual(["_ga", `_ga_${MEASUREMENT_ID.slice(2)}`]);
  });

  test("withdrawal also deletes GA cookies set on the parent domain", async ({ page, context, baseURL }) => {
    // Serve the build under a production-like host name, so GA sets its cookies on the parent domain.
    const host = "http://www.sven-maibaum.test";
    await context.route(`${host}/**`, async (route) => {
      const url = new URL(route.request().url());
      const response = await route.fetch({ url: `${baseURL}${url.pathname}${url.search}` });
      await route.fulfill({ response });
    });
    await page.goto(`${host}/`);
    const dialog = banner(page);
    await dialog.getByRole("button", { name: "Alle akzeptieren", exact: true }).click();
    await expect.poll(() => gaCookieNames(context), { timeout: 20_000 }).toEqual(["_ga", `_ga_${MEASUREMENT_ID.slice(2)}`]);
    const before = (await context.cookies())
      .filter((cookie) => GA_COOKIE.test(cookie.name))
      .map(({ name, domain }) => ({ name, domain }));

    await page.getByRole("button", { name: "Cookie-Einstellungen" }).dispatchEvent("click");
    await switchFor(dialog, "Statistik").click();
    await dialog.getByRole("button", { name: "Auswahl speichern" }).click();
    await expect.poll(() => gaCookieNames(context)).toEqual([]);
    saveEvidence("cookies-parent-domain.json", { before, after: await gaCookieNames(context) });
    expect(before.every((cookie) => cookie.domain === ".sven-maibaum.test")).toBe(true);
  });
});

test.describe("external media", () => {
  test("the Steam widget loads only after consent and leaves again on withdrawal", async ({ page, context, baseURL }) => {
    const log = recordRequests(context);
    await page.goto("/projekte/heistline/");
    const placeholder = page.locator('[data-consent-placeholder="steam"]');
    await placeholder.scrollIntoViewIfNeeded();
    await expect(placeholder).toBeVisible();
    await expect(placeholder.locator("img")).toBeVisible();
    await expect(placeholder.getByRole("link", { name: /Steam-Store/ })).toHaveAttribute("href", /store\.steampowered\.com\/app\/3613860\//);
    await expect(page.locator('iframe[src*="steampowered"]')).toHaveCount(0);
    expect(thirdParty(log, baseURL)).toEqual([]);

    await placeholder.getByRole("button", { name: "Steam-Widget laden" }).click();
    const iframe = page.locator('iframe[src="https://store.steampowered.com/widget/3613860/"]');
    await expect(iframe).toBeVisible();
    await expect.poll(() => log.some((entry) => entry.host === "store.steampowered.com")).toBe(true);
    expect(await storedChoice(page)).toMatchObject({ statistics: null, externalMedia: true });
    await expect(banner(page)).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(log.filter(isGoogle).map((entry) => entry.url)).toEqual([]);
    saveEvidence("network-steam-after-consent.json", {
      thirdPartyHosts: [...new Set(thirdParty(log, baseURL).map((entry) => entry.host))].sort(),
      thirdParty: thirdParty(log, baseURL).map((entry) => `${entry.method} ${entry.url}`),
      cookies: (await context.cookies()).map(({ name, domain, path, expires, secure, sameSite }) => ({ name, domain, path, expires, secure, sameSite })),
    });

    await banner(page).getByRole("button", { name: "Ablehnen", exact: true }).click();
    await expect(iframe).toHaveCount(0);
    await expect(placeholder).toBeVisible();
  });
});
