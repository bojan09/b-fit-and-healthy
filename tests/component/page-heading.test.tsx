import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeading } from "@/components/ui/page-heading";

describe("PageHeading", () => {
  it("renders one page title with supporting copy and actions", () => {
    render(
      <PageHeading
        eyebrow="Friday, 25 July"
        title="Good to see you"
        description="A clear view of what matters today."
        actions={<button>Open goals</button>}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Good to see you" }),
    ).toBeVisible();
    expect(screen.getByText("Friday, 25 July")).toBeVisible();
    expect(
      screen.getByText("A clear view of what matters today."),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Open goals" })).toBeVisible();
  });
});
