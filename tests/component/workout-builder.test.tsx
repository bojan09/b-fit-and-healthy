import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WorkoutBuilder } from "@/features/fitness/workout-builder";

afterEach(cleanup);

describe("WorkoutBuilder", () => {
  it("adds, reorders, removes, and validates exercise rows", () => {
    render(<WorkoutBuilder />);

    expect(screen.getByText(
      "Add at least one exercise to save this workout.",
    )).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {
      name: "Add Bodyweight squat",
    }));
    fireEvent.click(screen.getByRole("button", { name: "Add Push-up" }));
    fireEvent.click(screen.getByRole("button", { name: "Move Push-up up" }));
    expect(screen.getAllByTestId("builder-row")[0]).toHaveTextContent("Push-up");
    fireEvent.click(screen.getByRole("button", { name: "Remove Push-up" }));
    expect(screen.queryByTestId("builder-error")).not.toBeInTheDocument();
  });

  it("keeps every row action in a stable labelled rail", () => {
    render(<WorkoutBuilder initial={{
      prescriptions: [{
        exerciseSlug: "bodyweight-squat",
        sets: 3,
        repMin: 8,
        repMax: 12,
        durationSeconds: null,
        restSeconds: 90,
      }],
    }} />);

    const rail = screen.getByRole("group", {
      name: "Reorder or remove Bodyweight squat",
    });
    expect(within(rail).getAllByRole("button")).toHaveLength(3);
    expect(within(rail).getByRole("button", {
      name: "Move Bodyweight squat up",
    })).toBeDisabled();
  });

  it("renders timed prescriptions without fake repetition copy", () => {
    render(<WorkoutBuilder initial={{
      prescriptions: [{
        exerciseSlug: "cat-cow",
        sets: 1,
        repMin: null,
        repMax: null,
        durationSeconds: 40,
        restSeconds: 20,
      }],
    }} />);

    expect(screen.getByText("40 sec · 20 sec rest")).toBeInTheDocument();
    expect(screen.queryByText(/8–12 reps/)).not.toBeInTheDocument();
  });
});
