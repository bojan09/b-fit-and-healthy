import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DailyBalance } from "@/features/dashboard/daily-balance";
import { RhythmRail } from "@/features/dashboard/rhythm-rail";

describe("DailyBalance", () => {
  it("pairs every visual meter with readable values", () => {
    render(<DailyBalance title="Daily balance" rows={[{ label: "Water", value: "500 / 2,000 ml", ratio: 0.25 }, { label: "Habits", value: "1 / 3", ratio: 1 / 3 }, { label: "Active goals", value: "2", ratio: null }]} />);
    expect(screen.getByText("500 / 2,000 ml")).toBeVisible();
    expect(screen.getByLabelText("Water: 500 / 2,000 ml")).toHaveAttribute("role", "meter");
    expect(screen.getByText("2")).toBeVisible();
    expect(screen.getByRole("list", { name: "Daily balance" })).toBeVisible();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("gives an empty daily rhythm a useful next action", () => {
    render(
      <RhythmRail
        title="Your rhythm"
        waterTitle="Water"
        waterEntries={[]}
        habits={[]}
        statusLabels={{
          complete: "Complete",
          skipped: "Skipped",
          remaining: "Remaining",
        }}
        empty={{
          title: "Nothing tracked yet",
          description: "Start with one small action.",
          href: "/habits",
          action: "Choose a habit",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Nothing tracked yet" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Choose a habit" })).toHaveAttribute(
      "href",
      "/habits",
    );
  });
});
