import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Card } from "@/components/ui/card";

describe("Card", () => {
  afterEach(cleanup);

  it("applies the angled-cut clip-path by default", () => {
    render(<Card data-testid="card">content</Card>);
    expect(screen.getByTestId("card").className).toContain("card-cut");
  });

  it("stays rectangular when cut is set to false, for dense data UI", () => {
    render(
      <Card data-testid="card" cut={false}>
        content
      </Card>,
    );
    expect(screen.getByTestId("card").className).not.toContain("card-cut");
  });
});
