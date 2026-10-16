/**
 * Records a scripted tour through each motion variant (?v=1|2|3) as video.
 *
 * Builds the production bundle, serves it with `vite preview` on port 4317
 * (or reuses a server already running there), records every variant at
 * 1440x900 and in mobile emulation at 390x844 (rendered at 2x), converts the
 * WebM captures to H.264 MP4 and joins one captioned comparison video per width.
 *
 * Usage:
 *   node scripts/record-variants.mjs [outputDir] [--skip-build] [--only=1,2] [--widths=1440,390] [--compare-only]
 *
 * Default outputDir: <repo>/.harness/runs/motion-variants (gitignored run artefacts);
 * pass another folder as the first argument or set RECORD_OUT.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";

const PORT = 4317;
const BASE = `http://localhost:${PORT}`;
const root = resolve(import.meta.dirname, "..");

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}`));
const outDir = resolve(args.find((a) => !a.startsWith("--")) ?? process.env.RECORD_OUT ?? join(root, ".harness", "runs", "motion-variants"));
const skipBuild = Boolean(flag("skip-build"));
const only = flag("only")?.split("=")[1]?.split(",").map(Number) ?? [1, 2, 3];
const widths = flag("widths")?.split("=")[1]?.split(",").map(Number) ?? [1440, 390];

const VARIANTS = {
  1: { slug: "v1-editorial", caption: "V1 Editorial" },
  2: { slug: "v2-tiefe", caption: "V2 Tiefe" },
  3: { slug: "v3-signatur", caption: "V3 Signatur" },
  4: { slug: "v4", caption: "V4" },
};

const VIEWPORTS = {
  1440: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false, video: { width: 1440, height: 900 } },
  390: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, video: { width: 780, height: 1688 } },
};

const FFMPEG = existsSync("C:\\ffmpeg\\bin\\ffmpeg.exe") ? "C:\\ffmpeg\\bin\\ffmpeg.exe" : "ffmpeg";
const FFPROBE = FFMPEG.replace(/ffmpeg(\.exe)?$/i, (m) => m.replace("ffmpeg", "ffprobe"));
const FONT = existsSync("C:\\Windows\\Fonts\\arial.ttf") ? "C\\:/Windows/Fonts/arial.ttf" : null;

/** The project opened in every tour (its page has no third-party embeds). */
const PROJECT = "LikeTik";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function run(cmd, cmdArgs) {
  const result = spawnSync(cmd, cmdArgs, { stdio: "inherit", shell: process.platform === "win32", cwd: root });
  if (result.status !== 0) throw new Error(`${cmd} ${cmdArgs.join(" ")} failed with ${result.status}`);
}

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await wait(300);
  }
  throw new Error(`Preview server did not start at ${url}`);
}

function startPreview() {
  return spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: root,
    shell: process.platform === "win32",
    stdio: ["ignore", "inherit", "inherit"],
  });
}

function stopPreview(child) {
  if (!child?.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    child.kill("SIGTERM");
  }
}

// ── Tour helpers ────────────────────────────────────────────────────────────

/**
 * Scrolls in small per-frame steps over a fixed time, so scroll-linked motion
 * is visible and the timing does not depend on how busy the machine is.
 */
async function scrollToY(page, target, ms) {
  await page.evaluate(
    ([to, duration]) =>
      new Promise((done) => {
        const from = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const end = Math.max(0, Math.min(to, max));
        const start = performance.now();
        const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2;
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          window.scrollTo({ top: from + (end - from) * ease(t), behavior: "instant" });
          if (t < 1) requestAnimationFrame(step);
          else done();
        };
        requestAnimationFrame(step);
      }),
    [target, ms]
  );
}

async function scrollBy(page, dy, ms) {
  const y = await page.evaluate(() => window.scrollY);
  await scrollToY(page, y + dy, ms);
}

async function topOf(page, selector, offset = 0) {
  return page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect().top + window.scrollY - off : null;
    },
    [selector, offset]
  );
}

async function scrollToEl(page, selector, ms, offset = 64) {
  const top = await topOf(page, selector, offset);
  if (top !== null) await scrollToY(page, top, ms);
}

async function hover(page, locator, ms) {
  const box = await locator.boundingBox();
  if (!box) return;
  await page.mouse.move(box.x + box.width * 0.4, box.y + Math.min(box.height * 0.5, 140), { steps: 10 });
  await wait(ms);
}

async function press(page, locator, mobile) {
  if (mobile) await locator.tap();
  else await locator.click();
}

// Some layouts render the link twice (wide and narrow); take the one on screen
const projectLink = (page) => page.locator(`#projects a[aria-label="Mehr anzeigen – ${PROJECT}"]:visible`).first();

async function projectsTour(page, variant, mobile) {
  const vh = mobile ? 844 : 900;

  if (variant === 2) {
    // Pinned depth stack: travel until the target layer (fifth) is in front
    await scrollToEl(page, "#projects", 1200, 0);
    await wait(400);
    const stackTarget = (index) =>
      page.evaluate((i) => {
        const section = document.querySelector("#projects");
        const travel = section.offsetHeight - window.innerHeight;
        const top = section.getBoundingClientRect().top + window.scrollY;
        return top + travel * (0.05 + (i / 10) * 0.9);
      }, index);
    await scrollToY(page, await stackTarget(2), 2600);
    await wait(300);
    if (!mobile) await hover(page, page.locator("#projects [data-depth-active='true']"), 1200);
    await scrollToY(page, await stackTarget(4), 2000);
    await wait(400);
    if (!mobile) {
      await hover(page, page.locator("#projects [data-depth-active='true']"), 1200);
      return page.locator("#projects [data-depth-active='true']");
    }
    return projectLink(page);
  }

  if (variant === 1) {
    await scrollToEl(page, "#projects", 1300, 0);
    await wait(500);
    if (mobile) {
      await scrollBy(page, 1500, 2400);
      await wait(500);
      return projectLink(page);
    }
    await scrollBy(page, 420, 800);
    await wait(300);
    await hover(page, page.locator('#projects a[aria-label="Mehr anzeigen – HeistLine"]'), 1300);
    await hover(page, projectLink(page), 1500);
    return projectLink(page);
  }

  await scrollToEl(page, "#projects", 1300, 0);
  await wait(400);
  if (mobile) {
    await scrollBy(page, vh * 3.2, 3200);
    await wait(500);
    return projectLink(page);
  }
  await scrollBy(page, 360, 700);
  await wait(300);
  const cards = page.locator("#projects article");
  await hover(page, cards.nth(0), 1200);
  await hover(page, cards.nth(1), 1200);
  const target = projectLink(page);
  const box = await target.boundingBox();
  if (box) await scrollBy(page, box.y - vh * 0.6, 900);
  await wait(200);
  return target;
}

/**
 * Variant 4: hero scroll, the self-drawing timeline, the regular project grid
 * with the morph into a project and back (grid transition both ways), then a
 * slow sweep of the size slider with the live panel.
 */
async function tourCombined(page, mobile) {
  const vh = mobile ? 844 : 900;
  await page.goto(`${BASE}/?v=4`, { waitUntil: "networkidle" });
  await page.waitForSelector("#home");
  const ready = Date.now();
  await wait(2000);

  // Into the corridor; the about section slides over the pinned hero
  await scrollToY(page, vh * 1.3, 3600);
  await wait(300);

  // The experience line draws itself
  await scrollToEl(page, "#experience", mobile ? 3200 : 2600, 64);
  await wait(200);
  await scrollBy(page, mobile ? vh * 2.2 : vh * 1.1, mobile ? 3800 : 3200);
  await wait(300);

  // Regular project overview, then forward into a project
  await scrollToEl(page, "#projects", 1400, 0);
  await wait(400);
  const target = projectLink(page);
  if (mobile) {
    await scrollBy(page, vh * 1.2, 1600);
    await wait(300);
  } else {
    await scrollBy(page, 330, 700);
    await wait(200);
    const cards = page.locator("#projects [data-tags]");
    await hover(page, cards.nth(0), 1100);
    await hover(page, cards.nth(1), 1100);
  }
  const box = await target.boundingBox();
  if (box) await scrollBy(page, box.y - vh * 0.6, 1000);
  await wait(300);
  await press(page, target, mobile);
  await page.waitForURL(/\/projekte\//, { timeout: 15000 });
  await wait(2200);
  await scrollBy(page, mobile ? 800 : 600, 1300);
  await wait(500);

  // Back: the grid plays again
  await page.goBack();
  await page.waitForURL((url) => url.pathname === "/");
  await wait(1900);

  // Contact: slider and live panel, one level at a time
  if (mobile) {
    await page.locator("#mobile-menu-button").tap();
    await wait(900);
    await page.locator("#mobile-menu a", { hasText: "Kontakt" }).tap();
  } else {
    await page.locator(".header-desktop a", { hasText: "Kontakt" }).click();
  }
  await wait(1600);
  await scrollToEl(page, "#contact .mv-size", 900, mobile ? 120 : Math.round(vh * 0.36));
  await wait(600);
  const track = page.locator("#contact .mv-size");
  const slider = page.locator('#contact input[type="range"]');
  const trackBox = await track.boundingBox();
  const holds = [2000, 2000, 2200, 2800, 3800];
  for (let step = 0; step < holds.length; step++) {
    if (mobile && trackBox) {
      await page.touchscreen.tap(trackBox.x + trackBox.width * (0.1 + step * 0.2), trackBox.y + 20);
    } else if (step === 0 && trackBox) {
      await page.mouse.click(trackBox.x + trackBox.width * 0.1, trackBox.y + 20);
    } else {
      await slider.press("ArrowRight");
    }
    await wait(holds[step]);
  }
  return ready;
}

/** Returns the moment the page was visible, so the video can skip the blank load. */
async function tour(page, variant, mobile) {
  if (variant === 4) return tourCombined(page, mobile);
  const vh = mobile ? 844 : 900;
  await page.goto(`${BASE}/?v=${variant}`, { waitUntil: "networkidle" });
  await page.waitForSelector("#home");
  const ready = Date.now();
  await wait(2000);

  // Down through about, approach and experience
  const experience = (await topOf(page, "#experience", 64)) ?? vh * 3;
  await scrollToY(page, experience, mobile ? 7000 : 5200);
  await wait(300);
  await scrollBy(page, mobile ? vh * 1.6 : vh * 0.7, mobile ? 1800 : 1200);
  await wait(200);

  const target = await projectsTour(page, variant, mobile);

  // Shared-element transition into the project page
  await target.scrollIntoViewIfNeeded().catch(() => {});
  await press(page, target, mobile);
  await page.waitForURL(/\/projekte\//, { timeout: 15000 });
  await wait(2000);
  await scrollBy(page, mobile ? 900 : 650, 1400);
  await wait(500);

  // Back home: the scroll position is restored
  await page.goBack();
  await page.waitForURL((url) => url.pathname === "/");
  await wait(1500);

  // Another route through the footer
  await scrollToEl(page, "footer", mobile ? 2600 : 2000, 0);
  await wait(300);
  const impressum = page.locator('footer a[href="/impressum"]');
  await impressum.scrollIntoViewIfNeeded();
  await press(page, impressum, mobile);
  await page.waitForURL(/\/impressum/);
  await wait(1500);
  await scrollBy(page, 320, 700);
  await wait(300);

  // Back to the contact section through the header (page transition again)
  if (mobile) {
    await page.locator("#mobile-menu-button").tap();
    await wait(1000);
    await page.locator("#mobile-menu a", { hasText: "Kontakt" }).tap();
  } else {
    await page.locator(".header-desktop a", { hasText: "Kontakt" }).click();
  }
  await page.waitForURL((url) => url.pathname === "/" && url.hash === "#contact");
  await wait(1500);

  // Project size slider from Mini to Maximal; longest pauses on the animated sizes
  await scrollToEl(page, "#contact .mv-size", 900, Math.round(vh * 0.45));
  await wait(300);
  const track = page.locator("#contact .mv-size");
  const slider = page.locator('#contact input[type="range"]');
  const box = await track.boundingBox();
  const holds = [900, 900, 900, 2300, 3200];
  for (let step = 0; step < holds.length; step++) {
    if (mobile && box) {
      await page.touchscreen.tap(box.x + box.width * (0.1 + step * 0.2), box.y + box.height / 2);
    } else if (step === 0 && box) {
      await page.mouse.click(box.x + box.width * 0.1, box.y + box.height / 2);
    } else {
      await slider.press("ArrowRight");
    }
    await wait(holds[step]);
  }

  // Theme toggle: sun and moon morph into each other
  const toggle = page.locator(`${mobile ? ".header-mobile" : ".header-desktop"} button[aria-label="Theme wechseln"]`);
  await press(page, toggle, mobile);
  await wait(1500);
  await press(page, toggle, mobile);
  await wait(900);
  return ready;
}

// ── Video files ─────────────────────────────────────────────────────────────

function mp4From(webm, mp4, trimStart = 0) {
  spawnSync(
    FFMPEG,
    ["-y", "-loglevel", "error", "-ss", trimStart.toFixed(2), "-i", webm, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "18", "-movflags", "+faststart", mp4],
    { stdio: "inherit" }
  );
}

function probeDuration(file) {
  const res = spawnSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file], { encoding: "utf8" });
  return Number.parseFloat(res.stdout);
}

function comparison(files, captions, out, size) {
  const inputs = files.flatMap((f) => ["-i", f]);
  const fontSize = Math.round(size.height * 0.04);
  const parts = files.map((_, i) => {
    const draw = FONT
      ? `,drawtext=fontfile='${FONT}':text='${captions[i]}':fontcolor=white:fontsize=${fontSize}:box=1:boxcolor=black@0.7:boxborderw=${Math.round(fontSize * 0.5)}:x=(w-text_w)/2:y=h-text_h-${Math.round(fontSize * 1.5)}:enable='lt(t,4)'`
      : "";
    return `[${i}:v]scale=${size.width}:${size.height},setsar=1,fps=25${draw}[v${i}]`;
  });
  const concat = `${files.map((_, i) => `[v${i}]`).join("")}concat=n=${files.length}:v=1:a=0[out]`;
  spawnSync(
    FFMPEG,
    ["-y", "-loglevel", "error", ...inputs, "-filter_complex", `${parts.join(";")};${concat}`, "-map", "[out]", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-movflags", "+faststart", out],
    { stdio: "inherit" }
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

function buildComparisons() {
  for (const width of widths) {
    const files = [1, 2, 3].map((v) => join(outDir, `${VARIANTS[v].slug}-${width}.mp4`)).filter(existsSync);
    if (files.length < 2) continue;
    const out = join(outDir, `comparison-${width}.mp4`);
    const captions = [1, 2, 3].filter((v) => existsSync(join(outDir, `${VARIANTS[v].slug}-${width}.mp4`))).map((v) => VARIANTS[v].caption);
    comparison(files, captions, out, VIEWPORTS[width].video);
    console.log(`[comparison-${width}] ${out} ${probeDuration(out).toFixed(1)} s`);
  }
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  if (flag("compare-only")) {
    buildComparisons();
    return;
  }
  const rawDir = join(outDir, "raw");
  mkdirSync(rawDir, { recursive: true });

  if (!skipBuild) run("npm", ["run", "build"]);
  // Reuse a preview server that is already running on the port (it serves dist/ from disk)
  const alreadyUp = await fetch(BASE).then((r) => r.ok).catch(() => false);
  const preview = alreadyUp ? null : startPreview();
  const results = [];
  try {
    await waitForServer(BASE);
    const browser = await chromium.launch();
    try {
      for (const width of widths) {
        const config = VIEWPORTS[width];
        for (const variant of only) {
          const { slug } = VARIANTS[variant];
          const context = await browser.newContext({
            viewport: config.viewport,
            deviceScaleFactor: config.deviceScaleFactor,
            isMobile: config.isMobile,
            hasTouch: config.hasTouch,
            reducedMotion: "no-preference",
            colorScheme: "dark",
            locale: "de-DE",
            recordVideo: { dir: rawDir, size: config.video },
          });
          const page = await context.newPage();
          const started = Date.now();
          let error = null;
          let trim = 0;
          try {
            const ready = await tour(page, variant, config.isMobile);
            trim = Math.max(0, (ready - started) / 1000 - 0.3);
          } catch (e) {
            error = e;
            console.error(`[${slug}-${width}] tour failed:`, e.message);
            await wait(1000);
          }
          const video = page.video();
          await context.close();
          const webm = await video.path();
          const mp4 = join(outDir, `${slug}-${width}.mp4`);
          mp4From(webm, mp4, trim);
          const duration = probeDuration(mp4);
          results.push({ file: mp4, duration, error: error?.message ?? null });
          console.log(`[${slug}-${width}] ${mp4} ${duration.toFixed(1)} s${error ? " (with error)" : ""}`);
        }
      }
    } finally {
      await browser.close();
    }
  } finally {
    stopPreview(preview);
  }

  // Raw WebM captures are intermediate files
  for (const name of readdirSync(rawDir)) rmSync(join(rawDir, name), { force: true });
  rmSync(rawDir, { recursive: true, force: true });

  // Comparisons always use all variant videos present in the folder
  buildComparisons();

  console.log("\nVideos:");
  for (const r of results) {
    const size = (statSync(r.file).size / 1024 / 1024).toFixed(1);
    console.log(`${r.file}  ${size} MB  ${r.duration.toFixed(1)} s${r.error ? `  ERROR: ${r.error}` : ""}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
