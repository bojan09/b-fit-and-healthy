import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SetupChecklist } from "@/features/dashboard/setup-checklist";

describe("SetupChecklist", () => {
  afterEach(cleanup);

  it("links each unfinished step and counts progress", () => {
    render(<SetupChecklist locale="en" signals={{ hasTargets: true, hasHabits: false, hasMeals: false, hasGoals: false }} />);
    expect(screen.getByRole("heading", { name: /Get set up/ })).toHaveTextContent("1/4");
    expect(screen.getByRole("link", { name: "Add a first habit" })).toHaveAttribute("href", "/habits");
    expect(screen.queryByRole("link", { name: "Set your daily targets" })).not.toBeInTheDocument();
  });

  it("disappears when everything is done and localises to Macedonian", () => {
    const { container, rerender } = render(<SetupChecklist locale="mk" signals={{ hasTargets: false, hasHabits: true, hasMeals: true, hasGoals: true }} />);
    expect(screen.getByRole("link", { name: "Постави дневни цели" })).toHaveAttribute("href", "/settings#targets");
    rerender(<SetupChecklist locale="mk" signals={{ hasTargets: true, hasHabits: true, hasMeals: true, hasGoals: true }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
