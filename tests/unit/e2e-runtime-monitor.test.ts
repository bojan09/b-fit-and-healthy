import { describe, expect, it } from "vitest";
import {
  formatRuntimeIssues,
  isApplicationUrl,
  shouldReportFailedRequest,
  type RuntimeIssue,
} from "../../tests/e2e/fixtures/runtime-monitor";

describe("Phase 10A runtime monitoring", () => {
  it("classifies only local application URLs", () => {
    expect(
      isApplicationUrl(
        "http://127.0.0.1:3000/blog",
        "http://127.0.0.1:3000",
      ),
    ).toBe(true);
    expect(
      isApplicationUrl(
        "https://vercel.live/tool.js",
        "http://127.0.0.1:3000",
      ),
    ).toBe(false);
  });

  it("formats route-scoped failures without request secrets", () => {
    const issues: RuntimeIssue[] = [{
      kind: "console",
      route: "/anatomy",
      message: "Hydration failed",
    }];

    expect(formatRuntimeIssues(issues)).toBe(
      "[console] /anatomy: Hydration failed",
    );
    expect(formatRuntimeIssues(issues)).not.toContain("authorization");
  });

  it("ignores only intentional Next.js prefetch aborts", () => {
    const baseURL = "http://127.0.0.1:3000";

    expect(shouldReportFailedRequest({
      url: `${baseURL}/anatomy`,
      errorText: "net::ERR_ABORTED",
      resourceType: "fetch",
      headers: { "next-router-prefetch": "1" },
    }, baseURL)).toBe(false);
    expect(shouldReportFailedRequest({
      url: `${baseURL}/_next/static/app.js`,
      errorText: "net::ERR_ABORTED",
      resourceType: "script",
      headers: {},
    }, baseURL)).toBe(true);
    expect(shouldReportFailedRequest({
      url: "https://vercel.live/tool.js",
      errorText: "net::ERR_FAILED",
      resourceType: "script",
      headers: {},
    }, baseURL)).toBe(false);
  });
});
