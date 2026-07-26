import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExerciseLibrary } from "@/features/fitness/exercise-library";
vi.mock("@/features/discovery/actions", () => ({
  importDiscoveryItemAction: vi.fn(),
}));
describe("ExerciseLibrary", () => { it("searches, filters, clears, and explains empty results", () => { render(<ExerciseLibrary locale="en" />); fireEvent.change(screen.getByRole("searchbox"), { target: { value: "squat" } }); expect(screen.getByText("Bodyweight squat")).toBeInTheDocument(); expect(screen.queryByText("Push-up")).not.toBeInTheDocument(); fireEvent.change(screen.getByLabelText("Equipment"), { target: { value: "Cable" } }); expect(screen.getByText("No exercises match those filters.")).toBeInTheDocument(); fireEvent.click(screen.getAllByRole("button", { name: "Clear filters" })[0]); expect(screen.getByText("Push-up")).toBeInTheDocument(); }); });
