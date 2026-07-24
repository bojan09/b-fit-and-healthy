import AxeBuilder from "@axe-core/playwright";
import type { Page, TestInfo } from "@playwright/test";

export async function analyzeAccessibility(page: Page, testInfo?: TestInfo) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const blocking = results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );
  const review = results.violations.filter(
    (violation) =>
      violation.impact === "moderate" || violation.impact === "minor",
  );

  if (review.length && testInfo) {
    await testInfo.attach("axe-review.json", {
      body: Buffer.from(JSON.stringify(review, null, 2)),
      contentType: "application/json",
    });
  }

  return blocking;
}

export function formatAxeViolations(
  violations: Awaited<ReturnType<typeof analyzeAccessibility>>,
) {
  return violations
    .map((violation) => {
      const targets = violation.nodes.flatMap((node) => node.target).join(", ");
      return `${violation.id} (${violation.impact}): ${targets}\n${violation.helpUrl}`;
    })
    .join("\n\n");
}
