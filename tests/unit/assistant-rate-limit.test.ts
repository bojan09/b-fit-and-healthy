import { beforeEach, describe, expect, it } from "vitest";
import { consumeAssistantLimit, resetAssistantLimits } from "@/features/assistant/rate-limit";

describe("assistant rate limit", () => {
  beforeEach(resetAssistantLimits);

  it("allows ten requests and rejects the eleventh for one user", () => {
    for (let index = 0; index < 10; index += 1) expect(consumeAssistantLimit("user-a", 1_000).allowed).toBe(true);
    expect(consumeAssistantLimit("user-a", 1_000)).toMatchObject({ allowed: false, retryAfter: 60 });
  });

  it("isolates users and resets after sixty seconds", () => {
    for (let index = 0; index < 10; index += 1) consumeAssistantLimit("user-a", 1_000);
    expect(consumeAssistantLimit("user-b", 1_000).allowed).toBe(true);
    expect(consumeAssistantLimit("user-a", 61_000).allowed).toBe(true);
  });
});

