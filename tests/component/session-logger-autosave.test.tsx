import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SessionLogger } from "@/features/fitness/session-logger";

const exercises = [{ id: "e1", name: "Squat", target: "3 × 8", sets: [{ id: "s1", reps: 8, loadKg: 40, isComplete: false, isBodyweight: false }] }];

describe("SessionLogger persistence", () => {
  it("submits the set row when the complete box is ticked", () => {
    const submit = vi.spyOn(HTMLFormElement.prototype, "requestSubmit").mockImplementation(() => undefined);
    render(<SessionLogger sessionId="s" exercises={exercises} updateAction={vi.fn()} />);
    fireEvent.click(screen.getByLabelText("Set complete"));
    expect(submit).toHaveBeenCalledOnce();
    submit.mockRestore();
  });

  it("keeps a cleared rep field empty instead of coercing it to zero", () => {
    render(<SessionLogger sessionId="s" exercises={exercises} />);
    const reps = screen.getAllByLabelText("Repetitions").find((e) => e.tagName === "INPUT") as HTMLInputElement;
    fireEvent.change(reps, { target: { value: "" } });
    expect(reps.value).toBe("");
  });
});
