import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRef } from "react";

const motion = vi.hoisted(() => ({ profile: "full" as "full" | "limited" | "reduced" }));
const matchMedia = vi.hoisted(() => ({ add: vi.fn(), revert: vi.fn() }));
const loadGsap = vi.hoisted(() => vi.fn(async () => ({
  gsap: { matchMedia: () => matchMedia },
})));

vi.mock("@/features/motion/use-motion-profile", () => ({
  useMotionProfile: () => motion.profile,
}));
vi.mock("@/features/motion/gsap-loader", () => ({ loadGsap }));

import { useGsapScope } from "@/features/motion/use-gsap-scope";

function Harness({ setup = vi.fn() }: { setup?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useGsapScope(root, setup, "initial");
  return <div ref={root}>Visible content</div>;
}

describe("useGsapScope", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    motion.profile = "full";
  });

  it("does not load GSAP for reduced motion", () => {
    motion.profile = "reduced";
    render(<Harness />);
    expect(loadGsap).not.toHaveBeenCalled();
  });

  it("creates a scoped match-media setup and reverts on unmount", async () => {
    const setup = vi.fn();
    const view = render(<Harness setup={setup} />);
    await vi.waitFor(() => expect(matchMedia.add).toHaveBeenCalled());
    const registered = matchMedia.add.mock.calls[0][1] as () => void;
    registered();
    expect(setup).toHaveBeenCalled();
    view.unmount();
    expect(matchMedia.revert).toHaveBeenCalledTimes(1);
  });
});
