import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const scoped = vi.hoisted(() => vi.fn());
vi.mock("@/features/motion/use-gsap-scope", () => ({ useGsapScope: scoped }));
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/components/providers/locale-provider", () => ({
  useLocale: () => ({ locale: "en" }),
}));

import { PublicNavigation } from "@/components/shell/public-navigation";

describe("public navigation motion", () => {
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
    expect(scoped).toHaveBeenCalled();
  });
});
