import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

describe("ConfirmSubmitButton", () => {
  afterEach(cleanup);
  it("arms on the first press and only submits on the second", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <ConfirmSubmitButton message="Delete this workout?">Delete</ConfirmSubmitButton>
      </form>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Delete this workout?");
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("disarms when focus leaves the button", () => {
    render(<form><ConfirmSubmitButton message="Sure?">Delete</ConfirmSubmitButton></form>);
    const button = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(button);
    fireEvent.blur(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });
});
