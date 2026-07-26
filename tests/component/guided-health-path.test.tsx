import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GuidedHealthPath } from "@/features/landing/guided-health-path";

describe("GuidedHealthPath", () => {
  afterEach(cleanup);

  it("presents Fuel, Move, and Learn in a semantic ordered path", () => {
    render(<GuidedHealthPath locale="en" />);

    const path = screen.getByRole("navigation", {
      name: "Connected health path",
    });
    const links = within(path).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "01FuelMake food information usefulNext useful step",
      "02MoveTrain with purpose",
      "03LearnUnderstand your next step",
    ]);
    expect(screen.getByRole("link", { name: /fuel/i })).toHaveAttribute(
      "href",
      "/features/nutrition",
    );
    expect(screen.getByRole("link", { name: /move/i })).toHaveAttribute(
      "href",
      "/features/training",
    );
    expect(screen.getByRole("link", { name: /learn/i })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  it("marks Fuel as the next useful action", () => {
    render(<GuidedHealthPath locale="en" />);
    expect(screen.getByText("Next useful step")).toBeInTheDocument();
  });
});
