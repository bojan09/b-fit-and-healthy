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

  it("uses the process-local budget because Appwrite has no atomic counter in this adapter", async () => {
    const unavailableStore = { rpc: vi.fn() };
    expect((await enforceRateLimit(unavailableStore, "assistant", "u", config)).allowed).toBe(true);
    expect((await enforceRateLimit(unavailableStore, "assistant", "u", config)).allowed).toBe(true);
    expect(await enforceRateLimit(unavailableStore, "assistant", "u", config)).toEqual({ allowed: false, retryAfter: 60 });
    expect(unavailableStore.rpc).not.toHaveBeenCalled();
  });
});
