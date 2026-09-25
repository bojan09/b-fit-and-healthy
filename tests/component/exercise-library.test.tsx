import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { exercises } from "@/features/fitness/catalogue";
import { ExerciseLibrary } from "@/features/fitness/exercise-library";
import type { DiscoveryExercise } from "@/features/discovery/types";

vi.mock("@/features/discovery/actions", () => ({
  importDiscoveryItemAction: vi.fn(),
}));

function connectedExercise(
  overrides: Partial<DiscoveryExercise> = {},
): DiscoveryExercise {
  return {
    id: "exercise-api:connected_curl",
    kind: "exercise",
    provider: "exercise-api",
    externalId: "connected_curl",
    title: "Connected curl",
    normalizedTitle: "connected curl",
    sourceUrl: "https://exercise-api.com/v1/exercises/connected_curl",
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
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    equipment: ["dumbbell"],
    difficulty: "beginner",
    movementPattern: "elbow flexion",
    instructions: ["Curl with control."],
    safety: null,
    media: [],
    ...overrides,
  };
}

function connectedExercises(
  count: number,
  title = "Connected curl",
  muscle = "biceps",
) {
  return Array.from({ length: count }, (_, index) => connectedExercise({
    id: `exercise-api:${muscle}_${index + 1}`,
    externalId: `${muscle}_${index + 1}`,
    title: `${title} ${index + 1}`,
    normalizedTitle: `${title.toLocaleLowerCase()} ${index + 1}`,
    primaryMuscles: [muscle],
  }));
}

async function finishDebounce() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(275);
  });
}

function activateNativeButton(
  button: HTMLElement,
  key: "Enter" | " ",
) {
  if (!(button instanceof HTMLButtonElement)) {
    throw new TypeError("Keyboard activation requires a native button.");
  }

  const code = key === "Enter" ? "Enter" : "Space";
  button.focus();
  const keyDownAllowed = fireEvent.keyDown(button, { key, code });

  if (key === "Enter" && keyDownAllowed) {
    act(() => button.click());
  }

  const keyUpAllowed = fireEvent.keyUp(button, { key, code });
  if (key === " " && keyDownAllowed && keyUpAllowed) {
    act(() => button.click());
  }
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("ExerciseLibrary", () => {
  it("renders localized curated media and movement badges inside each exercise link", () => {
    render(<ExerciseLibrary locale="en" />);

    const media = screen.getAllByTestId("exercise-card-media");
    expect(media).toHaveLength(Math.min(exercises.length, 24));
    expect(within(media[0]).getByAltText("Athlete at the bottom of a bodyweight squat with feet grounded")).toHaveAttribute(
      "sizes",
      "(max-width: 48rem) 100vw, (max-width: 72rem) 50vw, 33vw",
    );

    const squatLink = screen.getByRole("link", { name: /Bodyweight squat/i });
    expect(squatLink).toHaveAttribute("href", "/exercises/bodyweight-squat");
    expect(within(squatLink).getByText("Squat")).toBeInTheDocument();
  });

  it("searches connected libraries when only a muscle is selected", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [connectedExercise()] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByLabelText("Muscle"), {
      target: { value: "biceps" },
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(275);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/discovery/exercises?muscle=biceps&q=biceps",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(
      within(screen.getByRole("region", {
        name: "Connected libraries",
      })).getByText("Connected curl"),
    ).toBeInTheDocument();
  });

  it("searches connected libraries when only equipment is selected", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [connectedExercise()] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByLabelText("Equipment"), {
      target: { value: "Dumbbells" },
    });
    await finishDebounce();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/discovery/exercises?equipment=Dumbbells&q=Dumbbells",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("searches connected libraries when only exercise type is selected", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [connectedExercise()] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByLabelText("Exercise type"), {
      target: { value: "strength" },
    });
    await finishDebounce();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/discovery/exercises?type=strength&q=strength",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("preserves typed text with structured filters without duplicating the query", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "curl" },
    });
    fireEvent.change(screen.getByLabelText("Muscle"), {
      target: { value: "biceps" },
    });
    fireEvent.change(screen.getByLabelText("Equipment"), {
      target: { value: "Dumbbells" },
    });
    fireEvent.change(screen.getByLabelText("Exercise type"), {
      target: { value: "strength" },
    });
    await finishDebounce();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/discovery/exercises?muscle=biceps&equipment=Dumbbells&type=strength&q=curl",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("reveals connected exercises in pages of 12", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: connectedExercises(25) }),
    }));

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "curl" },
    });
    await finishDebounce();

    expect(screen.getAllByRole("button", {
      name: /Review Connected curl/i,
    })).toHaveLength(12);
    fireEvent.click(screen.getByRole("button", { name: "Show 12 more" }));
    expect(screen.getAllByRole("button", {
      name: /Review Connected curl/i,
    })).toHaveLength(24);
    fireEvent.click(screen.getByRole("button", { name: "Show 1 more" }));
    expect(screen.getAllByRole("button", {
      name: /Review Connected curl/i,
    })).toHaveLength(25);
    expect(screen.queryByRole("button", {
      name: /Show \d+ more/,
    })).not.toBeInTheDocument();
  });

  it("resets connected disclosure when the selected muscle changes", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockImplementation(async (url: string) => ({
      ok: true,
      json: async () => ({
        results: url.includes("muscle=triceps")
          ? connectedExercises(25, "Connected extension", "triceps")
          : connectedExercises(25),
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByLabelText("Muscle"), {
      target: { value: "biceps" },
    });
    await finishDebounce();
    fireEvent.click(screen.getByRole("button", { name: "Show 12 more" }));
    expect(screen.getAllByRole("button", {
      name: /Review Connected curl/i,
    })).toHaveLength(24);

    fireEvent.change(screen.getByLabelText("Muscle"), {
      target: { value: "triceps" },
    });
    await finishDebounce();

    expect(screen.getAllByRole("button", {
      name: /Review Connected extension/i,
    })).toHaveLength(12);
  });

  it("clears connected discovery without a broad request and resets disclosure", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: connectedExercises(25) }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "curl" },
    });
    fireEvent.change(screen.getByLabelText("Equipment"), {
      target: { value: "Dumbbells" },
    });
    fireEvent.change(screen.getByLabelText("Muscle"), {
      target: { value: "biceps" },
    });
    fireEvent.change(screen.getByLabelText("Exercise type"), {
      target: { value: "strength" },
    });
    await finishDebounce();
    expect(screen.getAllByRole("button", {
      name: /Review Connected curl/i,
    })).toHaveLength(12);
    fireEvent.click(screen.getByRole("button", { name: "Show 12 more" }));
    expect(screen.getAllByRole("button", {
      name: /Review Connected curl/i,
    })).toHaveLength(24);

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByLabelText("Equipment")).toHaveValue("");
    expect(screen.getByLabelText("Muscle")).toHaveValue("");
    expect(screen.getByLabelText("Exercise type")).toHaveValue("");
    expect(screen.queryByRole("button", {
      name: /Review Connected curl/i,
    })).not.toBeInTheDocument();
    expect(screen.getByText(
      "Search or choose a filter to check connected libraries.",
    )).toBeInTheDocument();

    await finishDebounce();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "curl" },
    });
    await finishDebounce();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.getAllByRole("button", {
      name: /Review Connected curl/i,
    })).toHaveLength(12);
  });

  it("keeps partial connected results and retries the current search", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        partial: true,
        results: [connectedExercise()],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "curl" },
    });
    await finishDebounce();

    expect(screen.getByRole("button", {
      name: /Review Connected curl/i,
    })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    await finishDebounce();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("labels both result regions and exposes connected exercise metadata", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [connectedExercise()] }),
    }));

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "connected" },
    });
    await finishDebounce();

    expect(screen.getByRole("region", {
      name: "Curated by B Fit & Healthy",
    })).toBeInTheDocument();
    const connectedRegion = screen.getByRole("region", {
      name: "Connected libraries",
    });
    const card = within(connectedRegion).getByRole("button", {
      name: /Review Connected curl/i,
    });
    expect(within(card).getByText("ExerciseAPI")).toBeInTheDocument();
    expect(within(card).getByText("CC BY 4.0")).toBeInTheDocument();
    expect(within(card).getByText("beginner")).toBeInTheDocument();
    expect(within(card).getByText("dumbbell")).toBeInTheDocument();
    expect(within(card).getByText("Instructions available")).toBeInTheDocument();
    expect(within(card).getByText(
      "Exercise data by ExerciseAPI, licensed under CC BY 4.0.",
    )).toBeInTheDocument();

    activateNativeButton(card, "Enter");
    expect(screen.getByRole("dialog", {
      name: "Connected curl",
    })).toBeInTheDocument();
  });

  it("shows wger exercise attribution on the card and its license URL in review", async () => {
    vi.useFakeTimers();
    const wgerExercise = connectedExercise({
      id: "wger:42",
      provider: "wger",
      externalId: "42",
      title: "Wger curl",
      normalizedTitle: "wger curl",
      sourceUrl: "https://wger.de/en/exercise/42/view",
      attribution: "wger open exercise database",
      quality: "community",
      license: {
        id: "CC-BY-SA-4.0",
        name: "CC BY-SA 4.0",
        url: "https://creativecommons.org/licenses/by-sa/4.0/",
        attribution: "Exercise authored by Ada Trainer",
        commercialUse: true,
      },
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [wgerExercise] }),
    }));

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "wger" },
    });
    await finishDebounce();

    const card = screen.getByRole("button", {
      name: /Review Wger curl from wger/i,
    });
    expect(within(card).getByText(
      "Exercise authored by Ada Trainer",
    )).toBeInTheDocument();
    expect(within(card).getByText(
      "wger open exercise database",
    )).toBeInTheDocument();

    fireEvent.click(card);
    expect(screen.getByRole("link", {
      name: "View license",
    })).toHaveAttribute(
      "href",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    );
  });

  it("explains when only curated exercises match", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    }));

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "squat" },
    });
    await finishDebounce();

    expect(screen.getByRole("link", {
      name: /Bodyweight squat/i,
    })).toBeInTheDocument();
    expect(screen.getByText(
      "No connected matches. Curated exercises remain available.",
    )).toBeInTheDocument();
  });

  it("explains when only connected exercises match", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [connectedExercise({
          title: "Remote-only curl",
          normalizedTitle: "remote only curl",
        })],
      }),
    }));

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "remote-only" },
    });
    await finishDebounce();

    expect(screen.getByRole("button", {
      name: /Review Remote-only curl/i,
    })).toBeInTheDocument();
    expect(screen.getByText(
      "No curated matches. Showing connected library results.",
    )).toBeInTheDocument();
  });

  it("explains when neither result source has a match", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    }));

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "nothing-like-this" },
    });
    await finishDebounce();

    expect(screen.getByText(
      "No exercises found in curated or connected libraries.",
    )).toBeInTheDocument();
  });

  it("keeps matching curated exercises usable when connected search fails", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(
      new Error("Provider unavailable"),
    ));

    render(<ExerciseLibrary locale="en" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "squat" },
    });
    await finishDebounce();

    expect(screen.getByRole("link", {
      name: /Bodyweight squat/i,
    })).toBeInTheDocument();
    expect(screen.getByText(
      "Connected search is unavailable. Matching curated exercises remain usable.",
    )).toBeInTheDocument();
  });

  it("exposes keyboard-operable filter disclosure state", () => {
    render(<ExerciseLibrary locale="en" />);

    const filterButton = screen.getByRole("button", { name: "Filters" });
    expect(filterButton).toHaveAttribute("aria-expanded", "false");
    const controlledId = filterButton.getAttribute("aria-controls");
    expect(controlledId).toBeTruthy();
    expect(document.getElementById(controlledId!)).toBeInTheDocument();

    activateNativeButton(filterButton, "Enter");
    expect(filterButton).toHaveAttribute("aria-expanded", "true");
    activateNativeButton(filterButton, " ");
    expect(filterButton).toHaveAttribute("aria-expanded", "false");
  });

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
    const dialog = screen.getByRole("dialog", {
      name: "Barbell bench press",
    });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("Set the shoulders.")).toBeInTheDocument();
    expect(within(dialog).getByText(
      /Exercise data by ExerciseAPI/,
    )).toBeInTheDocument();
  });
});
