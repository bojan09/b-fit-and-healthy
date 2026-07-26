import { describe, expect, it } from "vitest";
import { runProviders } from "@/features/discovery/provider-runner";

describe("runProviders", () => {
  it("keeps successful providers when another times out", async () => {
    const outcome = await runProviders(
      [
        { id: "fast", run: async () => ["result"] },
        {
          id: "slow",
          run: async () => new Promise<string[]>(() => undefined),
        },
      ],
      { timeoutMs: 10 },
    );

    expect(outcome.results).toEqual(["result"]);
    expect(outcome.failures).toHaveLength(1);
    expect(outcome.failures[0].provider).toBe("slow");
    expect(outcome.failures[0].reason).toBe("timeout");
  });

  it("reports provider errors without exposing exception details", async () => {
    const outcome = await runProviders(
      [{ id: "broken", run: async () => Promise.reject(new Error("secret")) }],
      { timeoutMs: 50 },
    );

    expect(outcome.results).toEqual([]);
    expect(outcome.failures).toEqual([
      { provider: "broken", reason: "unavailable" },
    ]);
  });
});
