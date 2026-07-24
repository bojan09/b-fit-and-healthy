import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 1,
  workers: 4,
  timeout: 30_000,
  expect: { timeout: 7_500 },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  outputDir: "test-results",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
    serviceWorkers: "allow",
  },
  webServer: {
    command: "npm run start",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
      testIgnore: [/auth\.setup\.ts/, /authenticated-smoke\.spec\.ts/],
    },
    {
      name: "chromium-tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
      testIgnore: [/auth\.setup\.ts/, /authenticated-smoke\.spec\.ts/],
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 375, height: 812 },
      },
      testIgnore: [/auth\.setup\.ts/, /authenticated-smoke\.spec\.ts/],
    },
    {
      name: "firefox-desktop",
      grep: /@smoke/,
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1440, height: 1000 },
      },
      testIgnore: [/auth\.setup\.ts/, /authenticated-smoke\.spec\.ts/],
    },
    {
      name: "webkit-mobile",
      grep: /@smoke/,
      use: { ...devices["iPhone 13"] },
      testIgnore: [/auth\.setup\.ts/, /authenticated-smoke\.spec\.ts/],
    },
    {
      name: "auth-setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium-authenticated",
      dependencies: ["auth-setup"],
      testMatch: /authenticated-smoke\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
        storageState: "test-results/.auth/user.json",
      },
    },
  ],
});
