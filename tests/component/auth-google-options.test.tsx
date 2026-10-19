import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth/actions", () => ({
  signInAction: vi.fn(), signUpAction: vi.fn(), magicLinkAction: vi.fn(), forgotPasswordAction: vi.fn(), googleOAuthAction: vi.fn(),
}));
import { AuthForm } from "@/features/auth/auth-form";

describe("Google authentication entry points", () => {
  afterEach(cleanup);
  it.each(["sign-in", "sign-up"] as const)("offers Google on %s with the requested destination", (mode) => {
    render(<AuthForm mode={mode} locale="en" next="/training" />);
    const google = screen.getByRole("button", { name: "Continue with Google" });
    expect(google).toBeVisible();
    expect(google.closest("form")?.querySelector('input[name="next"]')).toHaveValue("/training");
  });
  it("localizes Google authentication on registration", () => {
    render(<AuthForm mode="sign-up" locale="mk" />);
    expect(screen.getByRole("button", { name: "Продолжи со Google" })).toBeVisible();
  });
});
