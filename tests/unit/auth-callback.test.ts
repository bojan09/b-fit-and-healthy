// @vitest-environment node
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { AppwriteError } from "@/lib/appwrite/rest";
const boundary = vi.hoisted(() => ({ exchange: vi.fn(), account: vi.fn(), save: vi.fn() }));
vi.mock("@/lib/appwrite/server", () => ({
  getAppwriteConfig: () => ({ endpoint: "https://fra.cloud.appwrite.io/v1", projectId: "project" }),
  appwriteAdminRequest: boundary.exchange,
  setAppwriteSession: boundary.save,
}));
vi.mock("@/lib/appwrite/rest", async (original) => ({
  ...await original<typeof import("@/lib/appwrite/rest")>(),
  appwriteRequest: boundary.account,
}));
import { GET } from "@/app/auth/callback/route";
const origin = "https://b-fit-and-healthy.vercel.app";
function callback(query = "userId=private-user&secret=private-token&state=private-state", cookie = "appwrite_oauth_state=private-state") {
  return new Request(origin + "/auth/callback?" + query, { headers: { cookie } });
}
describe("OAuth callback", () => {
  let log: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.resetAllMocks();
    log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    boundary.exchange.mockResolvedValue({ secret: "private-session", expire: "2099-01-01T00:00:00Z" });
    boundary.account.mockResolvedValue({ prefs: { onboarding_complete: true } });
  });
  afterEach(() => vi.restoreAllMocks());
  it("reports missing callback parameters without logging credentials", async () => {
    const response = await GET(callback("state=private-state&secret=private-token"));
    expect(response.headers.get("location")).toBe(origin + "/sign-in?error=invalid-callback");
    expect(log).toHaveBeenCalledWith("Appwrite OAuth callback rejected", { reason: "missing_parameters" });
    expect(boundary.exchange).not.toHaveBeenCalled();
  });
  it("rejects missing or mismatched browser state before exchanging a token", async () => {
    for (const cookie of ["", "appwrite_oauth_state=other-state"]) {
      const response = await GET(callback(undefined, cookie));
      expect(response.headers.get("location")).toContain("error=invalid-callback");
    }
    expect(log).toHaveBeenCalledWith("Appwrite OAuth callback rejected", { reason: "state_mismatch" });
    expect(boundary.exchange).not.toHaveBeenCalled();
  });
  it("reports a missing server key without logging the request or token", async () => {
    boundary.exchange.mockRejectedValue(new Error("APPWRITE_API_KEY_REQUIRED"));
    const response = await GET(callback());
    expect(response.headers.get("location")).toContain("error=invalid-callback");
    expect(log).toHaveBeenCalledWith("Appwrite OAuth callback failed", { stage: "token_exchange", reason: "missing_api_key" });
    expect(JSON.stringify(log.mock.calls)).not.toContain("private-");
  });
  it("records Appwrite status without its potentially sensitive error message", async () => {
    boundary.exchange.mockRejectedValue(new AppwriteError("private-token private-user", 401, "general_unauthorized_scope"));
    await GET(callback());
    expect(log).toHaveBeenCalledWith("Appwrite OAuth callback failed", { stage: "token_exchange", reason: "appwrite_request_failed", status: 401 });
    expect(JSON.stringify(log.mock.calls)).not.toContain("private-");
  });
  it("identifies account lookup failures separately", async () => {
    boundary.account.mockRejectedValue(new Error("private-session"));
    await GET(callback());
    expect(log).toHaveBeenCalledWith("Appwrite OAuth callback failed", { stage: "account_lookup", reason: "unexpected_error" });
    expect(JSON.stringify(log.mock.calls)).not.toContain("private-");
  });
  it("preserves a valid callback and clears state at the path where it was set", async () => {
    const response = await GET(callback("userId=private-user&secret=private-token&state=private-state&next=/training"));
    expect(response.headers.get("location")).toBe(origin + "/training");
    expect(response.headers.get("set-cookie")).toContain("Path=/auth/callback;");
    expect(log).not.toHaveBeenCalled();
  });
});
