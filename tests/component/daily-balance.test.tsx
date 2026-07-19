import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DailyBalance } from "@/features/dashboard/daily-balance";

describe("DailyBalance", () => {
  it("pairs every visual meter with readable values", () => {
    render(<DailyBalance title="Daily balance" rows={[{ label: "Water", value: "500 / 2,000 ml", ratio: 0.25 }, { label: "Habits", value: "1 / 3", ratio: 1 / 3 }, { label: "Active goals", value: "2", ratio: null }]} />);
    expect(screen.getByText("500 / 2,000 ml")).toBeVisible();
    expect(screen.getByLabelText("Water: 500 / 2,000 ml")).toHaveAttribute("role", "meter");
    expect(screen.getByText("2")).toBeVisible();
  });
});
