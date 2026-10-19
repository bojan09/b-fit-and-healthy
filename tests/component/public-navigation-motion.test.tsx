import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
vi.mock("@/components/providers/locale-provider", () => ({
  useLocale: () => ({ locale: "en" }),
}));

import { PublicNavigation } from "@/components/shell/public-navigation";

describe("public navigation motion", () => {
  beforeEach(() => { route.pathname = "/"; });
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("keeps native menu semantics and exposes links immediately", () => {
    render(<PublicNavigation />);
    const menu = screen.getByLabelText("Open menu");
    expect(menu.closest("details")).toHaveAttribute("data-motion-menu");
    fireEvent.click(menu);
    expect(screen.getAllByRole("link", { name: "Features" })).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
  });
  it("keeps the active destination on locale-prefixed routes", () => {
    route.pathname = "/en/features/nutrition";
    render(<PublicNavigation />);
    for (const link of screen.getAllByRole("link", { name: "Features" })) expect(link).toHaveAttribute("aria-current", "page");
  });

  it("closes the menu when a pointer is pressed outside it", () => {
    render(<PublicNavigation />);
    const details = screen.getByLabelText("Open menu").closest("details")!;
    details.open = true;
    fireEvent.pointerDown(document.body);
    expect(details.open).toBe(false);
  });
});
