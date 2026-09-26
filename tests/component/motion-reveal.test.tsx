import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MotionReveal } from "@/features/motion/motion-reveal";

describe("MotionReveal", () => {
  afterEach(cleanup);

  it("renders content immediately and leaves animation to CSS", () => {
    const view = render(<MotionReveal className="landing-reveal"><h2>Always readable</h2></MotionReveal>);
    expect(screen.getByRole("heading", { name: "Always readable" })).toBeVisible();
    const wrapper = view.container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass("motion-reveal", "landing-reveal");
    expect(wrapper).toHaveAttribute("data-reveal", "rise");
  });

  it("supports the 3D tilt entrance variant", () => {
    const view = render(<MotionReveal variant="tilt"><p>Tilted</p></MotionReveal>);
    expect(view.container.firstElementChild).toHaveAttribute("data-reveal", "tilt");
  });
});
