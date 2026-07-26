import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AnatomyExplorer } from "@/features/anatomy/anatomy-explorer";

describe("AnatomyExplorer encyclopedia", () => {
  afterEach(cleanup);
  it("explains benefit and training options for the selected muscle", () => {
    render(<AnatomyExplorer locale="en" />);
    expect(screen.getByText("Why it matters")).toBeInTheDocument();
    expect(screen.getByText("Exercises to explore")).toBeInTheDocument();
  });

  it("searches, filters, switches views, and recovers from empty results", () => {
    render(<AnatomyExplorer locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "hamstrings" } });
    expect(screen.getByRole("button", { name: /Hamstrings/ })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Body region"), { target: { value: "chest" } });
    expect(screen.getByText("No muscles match those filters.")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Clear filters" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getAllByRole("button", { name: /Latissimus dorsi/ }).length).toBeGreaterThan(0);
  });
});
