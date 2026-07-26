import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecipeLibrary } from "@/features/nutrition/recipe-library";
import { recipeCatalogue } from "@/features/nutrition/recipe-catalogue";

vi.mock("@/features/discovery/actions", () => ({
  importDiscoveryItemAction: vi.fn(),
}));

describe("RecipeLibrary", () => {
  it("filters the catalogue without a navigation round trip", () => {
    render(<RecipeLibrary recipes={recipeCatalogue} locale="en" />);

    fireEvent.change(screen.getByLabelText("Search recipes"), { target: { value: "lentil" } });
    expect(screen.getByText("Lentil and chicken salad")).toBeInTheDocument();
    expect(screen.queryByText("Berry yoghurt crunch")).not.toBeInTheDocument();
  });

  it("explains nutrition estimates and local provenance", () => {
    render(<RecipeLibrary recipes={recipeCatalogue.slice(0, 1)} locale="en" />);
    expect(screen.getAllByText("Locally curated").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Estimated nutrition").length).toBeGreaterThan(0);
  });
});
