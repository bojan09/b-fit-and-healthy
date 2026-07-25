import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({ pathname: "/nutrition" }));
const markNavigationReady = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
vi.mock("@/lib/performance/navigation-marks", () => ({ markNavigationReady }));
vi.mock("@/features/motion/motion-reveal", () => ({
  MotionReveal: ({ children }: { children: React.ReactNode }) =>
    <div data-testid="motion-reveal">{children}</div>,
}));

import { ProductPageMotion } from "@/features/motion/product-page-motion";

describe("ProductPageMotion", () => {
  afterEach(() => {
    cleanup();
    route.pathname = "/nutrition";
  });

  it("enhances Nutrition and Training but leaves other product pages stable", () => {
    const view = render(<ProductPageMotion><p>Page content</p></ProductPageMotion>);
    expect(screen.getByTestId("motion-reveal")).toBeInTheDocument();
    expect(markNavigationReady).toHaveBeenCalledWith("/nutrition");
    view.unmount();

    route.pathname = "/today";
    render(<ProductPageMotion><p>Dashboard content</p></ProductPageMotion>);
    expect(screen.queryByTestId("motion-reveal")).not.toBeInTheDocument();
    expect(screen.getByText("Dashboard content")).toBeVisible();
  });
});
