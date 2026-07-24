import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AssistantCanvas } from "@/features/assistant/assistant-canvas";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));
vi.mock("@/features/assistant/draft-actions", () => ({
  applyAssistantDraftAction: vi.fn(),
  deleteAssistantConversationAction: vi.fn(),
  dismissAssistantDraftAction: vi.fn(),
}));

const props = {
  locale: "en" as const,
  conversations: [],
  initialConversation: null,
  context: {
    locale: "en" as const,
    profile: { displayName: "Ana", units: "metric", timezone: "Europe/Skopje" },
    goals: ["strength 3 sessions"],
    preferences: ["units:metric"],
    today: { energyKcal: 1310, proteinG: 74, waterMl: 1500, habitsCompleted: 2, habitsTotal: 3, movementMinutes: 34 },
    trends: { days: 30, mealsLogged: 20, workoutsCompleted: 6, habitCompletionRate: 72, weightChangeKg: null },
  },
};

describe("AssistantCanvas", () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(cleanup);

  it("renders useful prompts and transparent context", () => {
    render(<AssistantCanvas {...props} />);
    expect(screen.getByRole("heading", { name: /what would make today easier/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /plan dinner/i })).toBeInTheDocument();
    expect(screen.getByText(/deletes after 30 days/i)).toBeInTheDocument();
    expect(screen.getByText(/1,310 kcal/i)).toBeInTheDocument();
  });

  it("streams a response into the polite conversation region", async () => {
    const payload = [
      'event: meta\ndata: {"type":"meta","conversationId":"5ca8019f-a1db-4fd6-aa3b-b1b3190cc51a","expiresAt":"2026-08-22T12:00:00.000Z"}\n\n',
      'event: token\ndata: {"type":"token","value":"A balanced "}\n\n',
      'event: token\ndata: {"type":"token","value":"dinner can be simple."}\n\n',
      'event: done\ndata: {"type":"done","messageId":"8f3b2a9e-a1db-4fd6-aa3b-b1b3190cc51a"}\n\n',
    ].join("");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(payload, {
      status: 200,
      headers: { "content-type": "text/event-stream" },
    })));
    render(<AssistantCanvas {...props} />);
    fireEvent.change(screen.getByLabelText(/message your coach/i), { target: { value: "Plan dinner" } });
    fireEvent.click(screen.getByRole("button", { name: /^send$/i }));
    await waitFor(() => expect(screen.getByText("A balanced dinner can be simple.")).toBeInTheDocument());
  });
});
