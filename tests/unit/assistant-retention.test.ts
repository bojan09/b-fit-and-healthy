import { describe, expect, it } from "vitest";
import { conversationExpiry, conversationTitle, isConversationActive } from "@/features/assistant/retention";

describe("assistant conversation retention", () => {
  it("expires exactly thirty days after creation", () => {
    expect(conversationExpiry(new Date("2026-07-23T12:00:00.000Z"))).toBe("2026-08-22T12:00:00.000Z");
  });

  it("treats the expiry instant as inactive", () => {
    expect(isConversationActive("2026-08-22T11:59:59.999Z", new Date("2026-08-22T11:59:59.998Z"))).toBe(true);
    expect(isConversationActive("2026-08-22T11:59:59.999Z", new Date("2026-08-22T11:59:59.999Z"))).toBe(false);
  });

  it("creates a deterministic bounded title", () => {
    expect(conversationTitle("   Help me plan a balanced dinner for tonight   ")).toBe("Help me plan a balanced dinner for tonight");
    expect(conversationTitle("x".repeat(120))).toHaveLength(80);
    expect(conversationTitle("")).toBe("New conversation");
  });
});

