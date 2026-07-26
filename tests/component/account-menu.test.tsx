import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AccountMenu } from "@/components/shell/account-menu";

describe("AccountMenu", () => {
  afterEach(cleanup);
  const signOut = async () => undefined;

  it("keeps account actions behind one compact disclosure", () => {
    render(<AccountMenu name="Stan" locale="en" signOut={signOut} />);

    expect(screen.queryByRole("menuitem", { name: "Profile" })).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Open account menu for Stan" }),
    );

    expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveAttribute(
      "href",
      "/settings#profile",
    );
    expect(screen.getByRole("menuitem", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings#preferences",
    );
    expect(screen.getByRole("menuitem", { name: "Sign out" })).toBeInTheDocument();
  });

  it("closes on Escape", () => {
    render(<AccountMenu name="Stan" locale="en" signOut={signOut} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Open account menu for Stan" }),
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menuitem", { name: "Profile" })).not.toBeInTheDocument();
  });
});
