import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ActionFeedback } from "@/features/motion/action-feedback";

describe("ActionFeedback", () => {
  afterEach(cleanup);

  it("keeps success text semantic and exposes the status for the CSS pulse", () => {
    render(<ActionFeedback status="success" message="Water added" />);
    expect(screen.getByRole("status")).toHaveTextContent("Water added");
    const feedback = screen.getByText("Water added").closest(".action-feedback");
    expect(feedback).toHaveAttribute("data-action-status", "success");
    expect(feedback).toHaveClass("action-feedback", "success");
  });

  it("announces errors assertively and never gives them the success pulse", () => {
    render(<ActionFeedback status="error" message="Try again" />);
    const region = screen.getByRole("alert");
    expect(region).toHaveAttribute("aria-live", "assertive");
    const feedback = screen.getByText("Try again").closest(".action-feedback");
    expect(feedback).toHaveAttribute("data-action-status", "error");
    expect(feedback).not.toHaveClass("success");
  });

  it("keeps the live region element mounted when the message changes", () => {
    const { rerender } = render(<ActionFeedback status="success" message="One" />);
    const region = screen.getByRole("status");
    rerender(<ActionFeedback status="success" message="Two" />);
    expect(screen.getByRole("status")).toBe(region);
    expect(region).toHaveTextContent("Two");
  });
});
