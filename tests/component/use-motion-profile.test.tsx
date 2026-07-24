import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMotionProfile } from "@/features/motion/use-motion-profile";

function Harness() {
  return <output>{useMotionProfile()}</output>;
}

describe("useMotionProfile", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("reacts to reduced-motion preference changes and removes listeners", () => {
    let reduced = false;
    const listeners = new Set<() => void>();
    vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reduced : false,
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: 8 });

    const view = render(<Harness />);
    expect(screen.getByText("full")).toBeInTheDocument();

    reduced = true;
    act(() => listeners.forEach((listener) => listener()));
    expect(screen.getByText("reduced")).toBeInTheDocument();

    view.unmount();
    expect(listeners.size).toBe(0);
  });
});
