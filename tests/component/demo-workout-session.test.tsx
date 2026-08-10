import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DemoWorkoutSession } from "@/features/demo/demo-workout-session";

const session = {
  title: { en: "Full-body strength", mk: "Тренинг" },
  duration: { en: "38 min", mk: "38 мин" },
  exercises: [
    { id: "squat", name: { en: "Back squat", mk: "Клек" }, sets: "4 × 6", done: true },
    { id: "row", name: { en: "Barbell row", mk: "Веслање" }, sets: "3 × 10", done: false }
  ]
};
const labels = { done: "Done", pending: "Up next", complete: "complete" };

describe("DemoWorkoutSession", () => {
  afterEach(cleanup);

  it("shows the initial done count", () => {
    render(<DemoWorkoutSession session={session} locale="en" labels={labels} />);
    expect(screen.getByText(/1\/2 complete/)).toBeInTheDocument();
  });

  it("toggling an exercise updates the done count", () => {
    render(<DemoWorkoutSession session={session} locale="en" labels={labels} />);
    fireEvent.click(screen.getByRole("button", { name: /Barbell row/i }));
    expect(screen.getByText(/2\/2 complete/)).toBeInTheDocument();
  });
});
