import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RouteSkeleton } from "@/components/ui/route-skeleton";

describe("RouteSkeleton", () => {
  it("announces the destination while preserving a page-shaped layout", () => {
    const { container } = render(<RouteSkeleton variant="nutrition" />);

    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Loading nutrition…")).toBeVisible();
    expect(
      container.querySelector('[data-skeleton-variant="nutrition"]'),
    ).not.toBeNull();
    expect(container.querySelectorAll(".skeleton-panel").length).toBeGreaterThan(
      1,
    );
  });
});
