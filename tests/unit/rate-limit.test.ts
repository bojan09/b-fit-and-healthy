import { beforeEach, describe, expect, it, vi } from "vitest";
import { consumeLocalLimit, enforceRateLimit, resetLocalLimits } from "@/lib/rate-limit";

const config = { limit: 2, windowMs: 60_000 };

describe("shared rate limit", () => {
  beforeEach(resetLocalLimits);

  it("keeps scopes independent", () => {
    consumeLocalLimit("a", "u", config, 0);
    consumeLocalLimit("a", "u", config, 0);
    expect(consumeLocalLimit("a", "u", config, 0).allowed).toBe(false);
    expect(consumeLocalLimit("b", "u", config, 0).allowed).toBe(true);
  });

  it("denies when the shared store reports the budget is spent", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [{ allowed: false, retry_after: 42 }], error: null });
    expect(await enforceRateLimit({ rpc }, "assistant", "u", config)).toEqual({ allowed: false, retryAfter: 42 });
    expect(rpc).toHaveBeenCalledWith("consume_rate_limit", { p_scope: "assistant", p_limit: 2, p_window_seconds: 60 });
  });

  it("falls back to the local limiter when the shared store fails", async () => {
    const rpc = vi.fn().mockRejectedValue(new Error("down"));
    expect((await enforceRateLimit({ rpc }, "x", "u", config)).allowed).toBe(true);
    expect((await enforceRateLimit({ rpc }, "x", "u", config)).allowed).toBe(true);
    expect((await enforceRateLimit({ rpc }, "x", "u", config)).allowed).toBe(false);
  });

  it("falls back when the function is missing", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: "not found" } });
    expect((await enforceRateLimit({ rpc }, "y", "u", config)).allowed).toBe(true);
  });
});
