import { expect, test as base, type Page } from "@playwright/test";

export type RuntimeIssue = {
  kind: "console" | "pageerror" | "requestfailed" | "response";
  route: string;
  message: string;
};

export type RuntimeMonitor = {
  issues: RuntimeIssue[];
  assertClean(): void;
};

export function isApplicationUrl(candidate: string, baseURL: string) {
  return new URL(candidate).origin === new URL(baseURL).origin;
}

export type FailedRequestEvidence = {
  url: string;
  errorText: string;
  resourceType: string;
  headers: Record<string, string>;
};

export function shouldReportFailedRequest(
  request: FailedRequestEvidence,
  baseURL: string,
) {
  if (!isApplicationUrl(request.url, baseURL)) return false;
  const intentionalPrefetchAbort =
    request.errorText === "net::ERR_ABORTED" &&
    request.resourceType === "fetch" &&
    (
      request.headers["next-router-prefetch"] === "1" ||
      request.headers.purpose === "prefetch"
    );
  return !intentionalPrefetchAbort;
}

export function formatRuntimeIssues(issues: RuntimeIssue[]) {
  return issues
    .map((issue) => `[${issue.kind}] ${issue.route}: ${issue.message}`)
    .join("\n");
}

export function createRuntimeMonitor(
  page: Page,
  baseURL: string,
): RuntimeMonitor {
  const issues: RuntimeIssue[] = [];
  const route = () => new URL(page.url() || baseURL).pathname;

  page.on("pageerror", (error) => {
    issues.push({ kind: "pageerror", route: route(), message: error.message });
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      issues.push({
        kind: "console",
        route: route(),
        message: message.text(),
      });
    }
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText ?? "failed";
    if (shouldReportFailedRequest({
      url: request.url(),
      errorText: failure,
      resourceType: request.resourceType(),
      headers: request.headers(),
    }, baseURL)) {
      issues.push({
        kind: "requestfailed",
        route: route(),
        message: `${request.method()} ${new URL(request.url()).pathname}: ${failure}`,
      });
    }
  });
  page.on("response", (response) => {
    if (isApplicationUrl(response.url(), baseURL) && response.status() >= 500) {
      issues.push({
        kind: "response",
        route: route(),
        message: `${response.status()} ${new URL(response.url()).pathname}`,
      });
    }
  });

  return {
    issues,
    assertClean() {
      expect(issues, formatRuntimeIssues(issues)).toEqual([]);
    },
  };
}

export const test = base.extend<{ runtimeMonitor: RuntimeMonitor }>({
  runtimeMonitor: async ({ page, baseURL }, provide) => {
    const monitor = createRuntimeMonitor(
      page,
      baseURL ?? "http://127.0.0.1:3000",
    );
    await provide(monitor);
    monitor.assertClean();
  },
});

export { expect } from "@playwright/test";
