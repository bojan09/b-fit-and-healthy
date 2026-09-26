import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ActionFeedback } from "@/features/motion/action-feedback";

describe("ActionFeedback", () => {
  afterEach(cleanup);

  it("keeps success text semantic and exposes the status for the CSS pulse", () => {
    render(<ActionFeedback status="success" message="Water added" />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Water added");
    expect(status).toHaveAttribute("data-action-status", "success");
    expect(status).toHaveClass("action-feedback", "success");
  });

  it("marks errors distinctly so they never get the success pulse", () => {
    render(<ActionFeedback status="error" message="Try again" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-action-status", "error");
    expect(screen.getByRole("status")).not.toHaveClass("success");
  });
});
