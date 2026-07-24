import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const scoped = vi.hoisted(() => vi.fn());
vi.mock("@/features/motion/use-gsap-scope", () => ({ useGsapScope: scoped }));

import { LandingMotion } from "@/features/landing/landing-motion";

describe("LandingMotion", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("keeps hero content and actions visible before enhancement", () => {
    render(<LandingMotion>
      <section data-motion-hero>
        <h1>Build healthier days</h1>
        <a href="/sign-up">Get started</a>
      </section>
    </LandingMotion>);
    expect(screen.getByRole("heading", { name: "Build healthier days" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Get started" })).toBeVisible();
    expect(scoped).toHaveBeenCalledTimes(1);
  });
});
