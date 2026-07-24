import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AmbientPointer } from "@/components/effects/ambient-pointer";

describe("AmbientPointer", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("pauses pointer work while hidden and removes listeners on unmount", () => {
    vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    let frameCallback: FrameRequestCallback | null = null;
    const request = vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frameCallback = callback;
      return 1;
    });
    const removeWindow = vi.spyOn(window, "removeEventListener");
    const removeDocument = vi.spyOn(document, "removeEventListener");
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    const view = render(<AmbientPointer />);

    fireEvent.pointerMove(window, { clientX: 100, clientY: 120 });
    expect(request).toHaveBeenCalledTimes(1);
    act(() => { if (frameCallback) (frameCallback as FrameRequestCallback)(0); });

    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    fireEvent(document, new Event("visibilitychange"));
    fireEvent.pointerMove(window, { clientX: 200, clientY: 220 });
    expect(request).toHaveBeenCalledTimes(1);

    view.unmount();
    expect(removeWindow).toHaveBeenCalledWith("pointermove", expect.any(Function));
    expect(removeDocument).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
  });
});
