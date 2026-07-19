import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AmbientPointer } from "@/components/effects/ambient-pointer";

describe("AmbientPointer", () => {
  afterEach(() => vi.restoreAllMocks());

  it("is decorative and updates pointer coordinates once per frame", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    });
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { frames.push(callback); return 1; });

    const { container } = render(<AmbientPointer />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    fireEvent.pointerMove(window, { clientX: 120, clientY: 240 });
    expect(frames).toHaveLength(1);
    frames[0](0);
    expect(document.documentElement.style.getPropertyValue("--pointer-x")).toBe("120px");
    expect(document.documentElement.style.getPropertyValue("--pointer-y")).toBe("240px");
  });
});
