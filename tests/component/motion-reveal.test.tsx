import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const animate = vi.hoisted(() => vi.fn((_target, _from, to) => to.onComplete?.()));
vi.mock("@/features/motion/use-motion-profile", () => ({
  useMotionProfile: () => "full",
}));
vi.mock("@/features/motion/gsap-loader", () => ({
  loadGsap: vi.fn(async () => ({ gsap: { fromTo: animate } })),
}));

import { MotionReveal } from "@/features/motion/motion-reveal";

describe("MotionReveal", () => {
  let intersect: (entries: Array<{ isIntersecting: boolean }>) => void;
  const disconnect = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: typeof intersect) { intersect = callback; }
      observe = vi.fn();
      disconnect = disconnect;
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders content visibly before enhancement and reveals once", async () => {
    const view = render(<MotionReveal><h2>Always readable</h2></MotionReveal>);
    expect(screen.getByRole("heading", { name: "Always readable" })).toBeVisible();
    expect(view.container.firstElementChild).toHaveAttribute("data-motion-state", "static");

    await act(async () => intersect([{ isIntersecting: true }]));
    await vi.waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(view.container.firstElementChild).toHaveAttribute("data-motion-state", "complete");
  });

  it("keeps static content readable when IntersectionObserver is unavailable", () => {
    vi.unstubAllGlobals();

    const view = render(<MotionReveal><h2>Still readable</h2></MotionReveal>);

    expect(screen.getByRole("heading", { name: "Still readable" })).toBeVisible();
    expect(view.container.firstElementChild).toHaveAttribute(
      "data-motion-state",
      "static",
    );
    expect(animate).not.toHaveBeenCalled();
  });
});
