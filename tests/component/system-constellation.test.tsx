import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SystemConstellation } from "@/features/landing/system-constellation";

describe("SystemConstellation", () => {
  afterEach(cleanup);
  it("exposes the three system modules as links", () => {
    render(<SystemConstellation locale="en" />);
    expect(screen.getByRole("link", { name: /fuel/i })).toHaveAttribute("href", "/features/nutrition");
    expect(screen.getByRole("link", { name: /move/i })).toHaveAttribute("href", "/features/training");
    expect(screen.getByRole("link", { name: /learn/i })).toHaveAttribute("href", "/blog");
  });

  it("explains a module when its link receives focus", () => {
    render(<SystemConstellation locale="en" />);
    fireEvent.focus(screen.getByRole("link", { name: /move/i }));
    expect(screen.getByText("Train with purpose")).toBeInTheDocument();
  });
});
