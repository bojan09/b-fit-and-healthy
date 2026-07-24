import { test as setup, expect } from "@playwright/test";
import {
  authStatePath,
  hasE2ECredentials,
  signInDedicatedAccount,
  writeEmptyAuthState,
} from "./fixtures/auth";

setup("create dedicated account state", async ({ page }) => {
  if (!hasE2ECredentials()) {
    await writeEmptyAuthState();
    setup.skip(
      true,
      "E2E_TEST_EMAIL and E2E_TEST_PASSWORD are not configured.",
    );
  }

  await signInDedicatedAccount(page);
  await expect(page).not.toHaveURL(/\/sign-in/);
  await page.context().storageState({ path: authStatePath });
});
