import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReviewSheet } from "@/components/discovery/review-sheet";

describe("ReviewSheet focus handling", () => {
  it("wraps Tab and Shift+Tab inside the dialog", () => {
    render(
      <ReviewSheet open title="Oats" onClose={vi.fn()} footer={<button type="button">Save</button>}>
        <p>Body</p>
      </ReviewSheet>,
    );
    const close = screen.getAllByRole("button", { name: "Close review" }).find((b) => b.className.includes("icon-action"))!;
    const save = screen.getByRole("button", { name: "Save" });
    save.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(save).toHaveFocus();
  });

  it("does not steal focus again when the parent re-renders with a new onClose", () => {
    const { rerender } = render(<ReviewSheet open title="Oats" onClose={() => undefined}><input aria-label="Grams" /></ReviewSheet>);
    const input = screen.getByLabelText("Grams");
    input.focus();
    rerender(<ReviewSheet open title="Oats" onClose={() => undefined}><input aria-label="Grams" /></ReviewSheet>);
    expect(input).toHaveFocus();
  });
});
