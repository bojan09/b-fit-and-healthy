import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DraftCard } from "@/features/assistant/draft-card";

vi.mock("@/features/assistant/draft-actions", () => ({
  applyAssistantDraftAction: vi.fn(),
  dismissAssistantDraftAction: vi.fn(),
}));

describe("DraftCard", () => {
  afterEach(cleanup);
  it("shows review details and explicit actions", () => {
    const changes = vi.fn();
    render(<DraftCard locale="en" messageId="8f3b2a9e-a1db-4fd6-aa3b-b1b3190cc51a" onRequestChanges={changes} draft={{
      kind: "workout", title: "Upper body express", name: "Upper body express",
      description: "A short controlled session.", durationMinutes: 25,
      exerciseSlugs: ["push-up", "one-arm-row"],
    }} />);
    expect(screen.getByText(/25 minutes/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm and save/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ask for changes/i }));
    expect(changes).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /discard draft/i })).toBeInTheDocument();
  });
});
