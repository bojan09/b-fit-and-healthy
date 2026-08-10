import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Card } from "@/components/ui/card";

describe("Card", () => {
  afterEach(cleanup);

  it("stays rectangular by default", () => {
    render(<Card data-testid="card">content</Card>);
    expect(screen.getByTestId("card").className).not.toContain("card-cut");
  });

  it("applies the angled-cut clip-path when cut is explicitly enabled", () => {
    render(
      <Card data-testid="card" cut>
        content
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("card-cut");
  });
});
