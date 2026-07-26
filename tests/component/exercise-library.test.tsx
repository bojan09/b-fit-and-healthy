import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExerciseLibrary } from "@/features/fitness/exercise-library";

vi.mock("@/features/discovery/actions", () => ({
  importDiscoveryItemAction: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ExerciseLibrary", () => {
  it("searches, filters, clears, and explains empty results", () => {
    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "squat" },
    });
    expect(screen.getByText("Bodyweight squat")).toBeInTheDocument();
    expect(screen.queryByText("Push-up")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Equipment"), {
      target: { value: "Cable" },
    });
    expect(screen.getByText(
      "No exercises match those filters.",
    )).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", {
      name: "Clear filters",
    })[0]);
    expect(screen.getByText("Push-up")).toBeInTheDocument();
  });

  it("shows connected source and commercial license before saving", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{
          id: "exercise-api:barbell_bench_press",
          kind: "exercise",
          provider: "exercise-api",
          externalId: "barbell_bench_press",
          title: "Barbell bench press",
          normalizedTitle: "barbell bench press",
          sourceUrl: "https://exercise-api.com/v1/exercises/barbell_bench_press",
          attribution: "Exercise data by ExerciseAPI, licensed under CC BY 4.0.",
          retrievedAt: "2026-07-26T00:00:00.000Z",
          quality: "curated",
          completeness: ["instructions"],
          alternates: [],
          license: {
            id: "CC-BY-4.0",
            name: "CC BY 4.0",
            url: "https://creativecommons.org/licenses/by/4.0/",
            attribution: "Exercise data by ExerciseAPI",
            commercialUse: true,
          },
          primaryMuscles: ["chest"],
          secondaryMuscles: ["triceps"],
          equipment: ["barbell", "bench"],
          difficulty: null,
          movementPattern: "horizontal press",
          instructions: ["Set the shoulders.", "Press with control."],
          safety: null,
          media: [],
        }],
      }),
    }));

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "barbell" },
    });

    expect(await screen.findByText("ExerciseAPI")).toBeInTheDocument();
    expect(screen.getByText("CC BY 4.0")).toBeInTheDocument();
    expect(screen.getByText(/1 connected exercise/i)).toBeInTheDocument();
    expect(document.querySelector("video")).toBeNull();

    fireEvent.click(screen.getByRole("button", {
      name: /Review Barbell bench press/i,
    }));
    expect(screen.getByRole("dialog", {
      name: "Barbell bench press",
    })).toBeInTheDocument();
    expect(screen.getByText("Set the shoulders.")).toBeInTheDocument();
    expect(screen.getByText(/Exercise data by ExerciseAPI/)).toBeInTheDocument();
  });
});
