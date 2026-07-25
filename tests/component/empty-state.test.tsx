import { render, screen } from "@testing-library/react";
import { Circle } from "lucide-react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState", () => {
  it("explains the empty state and offers one useful action", () => {
    render(
      <EmptyState
        icon={Circle}
        title="No tracked activity yet"
        description="Log water or complete a habit to begin."
        action={<button>Add water</button>}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "No tracked activity yet" }),
    ).toBeVisible();
    expect(
      screen.getByText("Log water or complete a habit to begin."),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Add water" })).toBeVisible();
  });
});
