import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WeightChart } from "@/features/progress/weight-chart";

describe("WeightChart", () => {
  afterEach(cleanup);
  it("uses a starting state for fewer than two records", () => {
    render(<WeightChart points={[{ date: "2026-07-19", value: 70 }]} unit="kg" emptyLabel="Add another measurement" historyLabel="History" locale="en" emptyAction={{ href: "#weight", label: "Add weight" }} />);
    expect(screen.getByText("Add another measurement")).toBeVisible();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add weight" })).toHaveAttribute("href", "#weight");
  });

  it("pairs its SVG trend with textual history", () => {
    render(<WeightChart points={[{ date: "2026-07-18", value: 71 }, { date: "2026-07-19", value: 70 }]} unit="kg" emptyLabel="Empty" historyLabel="History" locale="en" />);
    expect(screen.getByRole("img", { name: /weight trend/i })).toBeVisible();
    expect(screen.getByRole("list")).toBeVisible();
    expect(within(screen.getByRole("list")).getByText("70 kg")).toBeVisible();
  });
  it("shows the latest measurement and visible chart context in Macedonian", () => {
    render(<WeightChart points={[{ date: "2026-07-18", value: 71 }, { date: "2026-07-19", value: 70 }]} unit="kg" emptyLabel="Empty" historyLabel="Историја" locale="mk" />);
    const trend = screen.getByRole("region", { name: "Тренд на тежината" });
    expect(within(trend).getByText("Последно мерење")).toBeVisible();
    expect(within(trend).getByText("70 kg", { selector: "strong" })).toBeVisible();
    expect(within(trend).getByRole("img", { name: /Тренд на тежината/ })).toBeVisible();
    expect(within(trend).getByText("71", { selector: ".weight-trend-scale span" })).toBeVisible();
    expect(trend.querySelectorAll(".weight-trend-dates span")).toHaveLength(2);
  });
});
