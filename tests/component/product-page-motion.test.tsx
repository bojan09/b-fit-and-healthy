import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({ pathname: "/nutrition" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
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
    view.unmount();

    route.pathname = "/today";
    render(<ProductPageMotion><p>Dashboard content</p></ProductPageMotion>);
    expect(screen.queryByTestId("motion-reveal")).not.toBeInTheDocument();
    expect(screen.getByText("Dashboard content")).toBeVisible();
  });
});
