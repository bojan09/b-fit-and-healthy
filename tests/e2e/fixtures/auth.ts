import fs from "node:fs/promises";
import path from "node:path";
import type { Page } from "@playwright/test";

export const authStatePath = "test-results/.auth/user.json";

export function hasE2ECredentials() {
  return Boolean(
    process.env.E2E_TEST_EMAIL && process.env.E2E_TEST_PASSWORD,
  );
}

export async function writeEmptyAuthState() {
  await fs.mkdir(path.dirname(authStatePath), { recursive: true });
  await fs.writeFile(
    authStatePath,
    JSON.stringify({ cookies: [], origins: [] }),
  );
}

export async function signInDedicatedAccount(page: Page) {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;
  if (!email || !password) {
    throw new Error("Dedicated E2E credentials are not configured.");
  }

  await page.goto("/sign-in?next=%2Ftoday");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL(/\/(today|onboarding)/);
}
