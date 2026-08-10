import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DemoHabitList } from "@/features/demo/demo-habit-list";

const habits = [
  { id: "water", title: { en: "Drink water", mk: "Пиј вода" }, done: true },
  { id: "walk", title: { en: "Walk", mk: "Прошетка" }, done: false }
];

describe("DemoHabitList", () => {
  afterEach(cleanup);

  it("renders habits in the given locale and reflects initial done state", () => {
    render(<DemoHabitList habits={habits} locale="en" title="Habits" />);
    expect(screen.getByRole("button", { name: /Drink water/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Walk/i })).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles a habit's done state on click, locally", () => {
    render(<DemoHabitList habits={habits} locale="en" title="Habits" />);
    const walkButton = screen.getByRole("button", { name: /Walk/i });
    fireEvent.click(walkButton);
    expect(walkButton).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(walkButton);
    expect(walkButton).toHaveAttribute("aria-pressed", "false");
  });
});
