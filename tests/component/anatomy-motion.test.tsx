import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRef } from "react";

const scoped = vi.hoisted(() => vi.fn());
vi.mock("@/features/motion/use-gsap-scope", () => ({ useGsapScope: scoped }));

import { useAnatomyMotion } from "@/features/anatomy/anatomy-motion";
import { AnatomyExplorer } from "@/features/anatomy/anatomy-explorer";

function Harness() {
  const root = useRef<HTMLDivElement>(null);
  useAnatomyMotion(root, "front", "pectorals");
  return <div ref={root}>
    <div data-anatomy-renderer />
    <div data-anatomy-panel><h2>Pectorals</h2><p>Details</p></div>
  </div>;
}

describe("Anatomy motion", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("coordinates renderer and panel transforms inside its own root", () => {
    render(<Harness />);
    const setup = scoped.mock.calls[0][1];
    const root = screen.getByText("Pectorals").closest("div")?.parentElement as HTMLElement;
    const fromTo = vi.fn();
    setup({ gsap: { fromTo }, root, profile: "full" });
    expect(fromTo).toHaveBeenCalledTimes(2);
    expect(scoped.mock.calls[0][2]).toBe("front:pectorals");
  });

  it("keeps directory focus and brings an offscreen atlas into view", () => {
    const view = render(<AnatomyExplorer locale="en" />);
    const stage = view.container.querySelector(".anatomy-stage") as HTMLElement;
    const scrollIntoView = vi.fn();
    stage.scrollIntoView = scrollIntoView;
    vi.spyOn(stage, "getBoundingClientRect").mockReturnValue({
      top: 900, bottom: 1500, left: 0, right: 360, width: 360, height: 600, x: 0, y: 900,
      toJSON: () => ({}),
    });
    const directoryButton = view.container.querySelector(".anatomy-directory button") as HTMLButtonElement;
    directoryButton.focus();
    fireEvent.click(directoryButton);
    expect(directoryButton).toHaveFocus();
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest", behavior: "auto" });
  });
});
