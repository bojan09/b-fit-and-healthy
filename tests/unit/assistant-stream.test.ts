import { describe, expect, it } from "vitest";
import { encodeAssistantEvent, inferDraftKind, safeAssistantError } from "@/features/assistant/stream-domain";
import { GroqProviderError } from "@/features/assistant/groq-core";

describe("assistant stream domain", () => {
  it("encodes named SSE events without exposing object prototypes", () => {
    expect(encodeAssistantEvent({ type: "token", value: "Hello" })).toBe('event: token\ndata: {"type":"token","value":"Hello"}\n\n');
  });

  it("recognizes only approved draft intents", () => {
    expect(inferDraftKind("Plan dinner for tomorrow")).toBe("meal");
    expect(inferDraftKind("Create a 20 minute workout")).toBe("workout");
    expect(inferDraftKind("Help me build a walking habit")).toBe("habit");
    expect(inferDraftKind("Suggest a healthy recipe")).toBe("recipe");
    expect(inferDraftKind("Review my week")).toBe("summary");
    expect(inferDraftKind("What is progressive overload?")).toBeNull();
  });

  it("normalizes provider and internal failures", () => {
    expect(safeAssistantError(new GroqProviderError("RATE_LIMITED", 7), "en"))
      .toMatchObject({ type: "error", code: "RATE_LIMITED", retryAfter: 7 });
    const error = safeAssistantError(new Error("secret upstream body"), "en");
    expect(error.code).toBe("ASSISTANT_UNAVAILABLE");
    expect(error.message).not.toContain("secret");
  });
});

