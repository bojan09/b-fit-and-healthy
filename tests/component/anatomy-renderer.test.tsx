import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnatomyRenderer } from "@/features/anatomy/anatomy-renderer";
import { AnatomyExplorer } from "@/features/anatomy/anatomy-explorer";

describe("AnatomyRenderer (CSS 3D turntable)", () => {
  afterEach(cleanup);

  it("renders both atlas faces and makes only the active face interactive", () => {
    const view = render(<AnatomyRenderer view="front" locale="en" selectedMuscleId="pectorals" onSelectMuscle={vi.fn()} />);
    const turntable = view.container.querySelector(".anatomy-turntable") as HTMLElement;
    expect(turntable).toHaveAttribute("data-view", "front");
    const front = view.container.querySelector(".anatomy-face-front") as HTMLElement;
    const back = view.container.querySelector(".anatomy-face-back") as HTMLElement;
    expect(front).not.toHaveAttribute("aria-hidden");
    expect(back).toHaveAttribute("aria-hidden", "true");
    expect(back).toHaveAttribute("inert");
    expect(front).not.toHaveAttribute("inert");
    expect(within(front).getByRole("button", { name: "Pectorals" })).toHaveAttribute("aria-pressed", "true");
  });

  it("selects a muscle from the visible face by pointer or keyboard", () => {
    const onSelect = vi.fn();
    const view = render(<AnatomyRenderer view="back" locale="en" selectedMuscleId="trapezius" onSelectMuscle={onSelect} />);
    const back = view.container.querySelector(".anatomy-face-back") as HTMLElement;
    const lats = within(back).getByRole("button", { name: "Latissimus dorsi" });
    fireEvent.click(lats);
    fireEvent.keyDown(lats, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith("latissimus");
  });
});

describe("AnatomyExplorer", () => {
  afterEach(cleanup);

  it("turns the figure when the view changes and keeps directory focus", () => {
    const view = render(<AnatomyExplorer locale="en" />);
    const turntable = view.container.querySelector(".anatomy-turntable") as HTMLElement;
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(turntable).toHaveAttribute("data-view", "back");

    const stage = view.container.querySelector(".anatomy-stage") as HTMLElement;
    const scrollIntoView = vi.fn();
    stage.scrollIntoView = scrollIntoView;
    vi.spyOn(stage, "getBoundingClientRect").mockReturnValue({
      top: 900, bottom: 1500, left: 0, right: 360, width: 360, height: 600, x: 0, y: 900,
      toJSON: () => ({}),
    });
    const entry = view.container.querySelector(".anatomy-directory button[aria-pressed]") as HTMLButtonElement;
    entry.focus();
    fireEvent.click(entry);
    expect(entry).toHaveFocus();
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest", behavior: "auto" });
  });
});
