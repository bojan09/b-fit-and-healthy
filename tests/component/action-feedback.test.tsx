import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const scoped = vi.hoisted(() => vi.fn());
vi.mock("@/features/motion/use-gsap-scope", () => ({ useGsapScope: scoped }));

import { ActionFeedback } from "@/features/motion/action-feedback";

describe("ActionFeedback", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("keeps success text semantic and registers one restrained pulse", () => {
    render(<ActionFeedback status="success" message="Water added" />);
    expect(screen.getByRole("status")).toHaveTextContent("Water added");
    expect(screen.getByRole("status")).toHaveAttribute("data-action-status", "success");
    const setup = scoped.mock.calls[0][1];
    const fromTo = vi.fn();
    setup({
      gsap: { fromTo },
      root: screen.getByRole("status"),
      profile: "full",
    });
    expect(fromTo).toHaveBeenCalledTimes(1);
  });

  it("never plays success motion for an error", () => {
    render(<ActionFeedback status="error" message="Try again" />);
    const setup = scoped.mock.calls[0][1];
    const fromTo = vi.fn();
    setup({
      gsap: { fromTo },
      root: screen.getByRole("status"),
      profile: "full",
    });
    expect(fromTo).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveAttribute("data-action-status", "error");
  });
});
