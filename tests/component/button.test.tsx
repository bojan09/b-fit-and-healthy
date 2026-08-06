import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  afterEach(cleanup);

  it("applies the angled-cut clip-path to primary and secondary variants by default", () => {
    render(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Primary" }).className).toContain("ui-button-cut");
    expect(screen.getByRole("button", { name: "Secondary" }).className).toContain("ui-button-cut");
  });

  it("keeps quiet and danger variants rectangular", () => {
    render(
      <>
        <Button variant="quiet">Quiet</Button>
        <Button variant="danger">Danger</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Quiet" }).className).not.toContain("ui-button-cut");
    expect(screen.getByRole("button", { name: "Danger" }).className).not.toContain("ui-button-cut");
  });

  it("lets a consumer opt a primary button back to rectangular via cut={false}", () => {
    render(<Button variant="primary" cut={false}>Primary</Button>);
    expect(screen.getByRole("button", { name: "Primary" }).className).not.toContain("ui-button-cut");
  });
});
