import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PREVIEW_PORT ?? 4173);

/**
 * End-to-end checks against the production build (`npm run build` first).
 * `vite preview` serves `dist/`; set PREVIEW_DIR to serve another build.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  workers: 1,
  reporter: [["list"]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://localhost:${port}`,
    locale: "de-DE",
  },
  webServer: {
    command: `npx vite preview --port ${port} --strictPort${process.env.PREVIEW_DIR ? ` --outDir ${process.env.PREVIEW_DIR}` : ""}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
