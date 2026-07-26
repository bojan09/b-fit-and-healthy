import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReviewSheet } from "@/components/discovery/review-sheet";

describe("ReviewSheet", () => {
  it("closes with Escape and restores the trigger focus", () => {
    const onClose = vi.fn();
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = render(
      <ReviewSheet open title="Rolled oats" onClose={onClose} returnFocus={trigger}>
        <p>Review serving</p>
      </ReviewSheet>,
    );

    expect(screen.getByRole("dialog", { name: "Rolled oats" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
    rerender(
      <ReviewSheet open={false} title="Rolled oats" onClose={onClose} returnFocus={trigger}>
        <p>Review serving</p>
      </ReviewSheet>,
    );
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
