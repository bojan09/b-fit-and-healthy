import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const prefetch = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({ prefetch }),
}));

import { NavigationIntent } from "@/components/shell/navigation-intent";

describe("NavigationIntent", () => {
  afterEach(() => {
    prefetch.mockClear();
    delete document.documentElement.dataset.navigationPending;
  });

  it("warms an internal route on pointer or keyboard intent", () => {
    render(<NavigationIntent href="/nutrition">Nutrition</NavigationIntent>);
    const link = screen.getByRole("link", { name: "Nutrition" });

    fireEvent.pointerEnter(link);
    fireEvent.focus(link);

    expect(prefetch).toHaveBeenCalledWith("/nutrition");
  });

  it("marks an internal navigation as pending immediately", () => {
    render(
      <NavigationIntent
        href="/training"
        onClick={(event) => event.preventDefault()}
      >
        Training
      </NavigationIntent>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Training" }));

    expect(document.documentElement.dataset.navigationPending).toBe(
      "/training",
    );
  });
});
