import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DemoMealTracker } from "@/features/demo/demo-meal-tracker";

const meals = [
  { id: "breakfast", time: "07:40", name: { en: "Oats", mk: "Овес" }, kcal: 400, proteinG: 20, carbsG: 60, fatG: 10 }
];
const addableMeal = {
  id: "snack",
  time: "16:00",
  name: { en: "Yogurt", mk: "Јогурт" },
  kcal: 200,
  proteinG: 10,
  carbsG: 15,
  fatG: 8
};
const labels = { addFood: "Add food", total: "Total", protein: "Protein", carbs: "Carbs", fat: "Fat", kcal: "kcal" };

describe("DemoMealTracker", () => {
  afterEach(cleanup);

  it("shows initial totals computed from the meal list", () => {
    render(<DemoMealTracker meals={meals} addableMeal={addableMeal} locale="en" labels={labels} />);
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("20g")).toBeInTheDocument();
  });

  it("adds the addable meal once and updates totals", () => {
    render(<DemoMealTracker meals={meals} addableMeal={addableMeal} locale="en" labels={labels} />);
    fireEvent.click(screen.getByRole("button", { name: /Add food/i }));
    expect(screen.getByText("600")).toBeInTheDocument();
    expect(screen.getByText("Yogurt")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Add food/i })).not.toBeInTheDocument();
  });

  it("renders macro bar fills computed from actual totals, and updates them after adding food", () => {
    const { container } = render(
      <DemoMealTracker meals={meals} addableMeal={addableMeal} locale="en" labels={labels} />
    );
    const bars = container.querySelectorAll(".nutrient-line i");
    expect(bars).toHaveLength(3);

    // Initial totals: proteinG=20 (of 150 ref -> 13%), carbsG=60 (of 300 ref -> 20%), fatG=10 (of 90 ref -> 11%)
    const [proteinBar, carbsBar, fatBar] = Array.from(bars) as HTMLElement[];
    expect(proteinBar.style.background).toContain("13%");
    expect(carbsBar.style.background).toContain("20%");
    expect(fatBar.style.background).toContain("11%");

    fireEvent.click(screen.getByRole("button", { name: /Add food/i }));

    // After adding: proteinG=30 (20%), carbsG=75 (25%), fatG=18 (20%)
    expect(proteinBar.style.background).toContain("20%");
    expect(carbsBar.style.background).toContain("25%");
    expect(fatBar.style.background).toContain("20%");
  });
});
