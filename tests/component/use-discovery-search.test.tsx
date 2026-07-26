import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DiscoveryStatus } from "@/components/discovery/discovery-status";
import { useDiscoverySearch } from "@/features/discovery/use-discovery-search";

type Deferred<T> = {
  promise: Promise<T>;
  resolve(value: T): void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function response(results: string[]): Response {
  return {
    ok: true,
    json: async () => ({ results }),
  } as Response;
}

const localResults = ["Local curl"];

function DiscoverySearchHarness() {
  const search = useDiscoverySearch<string>({
    endpoint: "/api/discovery/exercises",
    localResults,
    delay: 0,
  });

  return (
    <>
      <input
        aria-label="Search exercises"
        value={search.query}
        onChange={(event) => search.setQuery(event.target.value)}
      />
      <output aria-label="Search status">{search.status}</output>
      <output aria-label="Search results">{search.results.join(", ")}</output>
      <output aria-label="Search message">{search.message}</output>
      <button type="button" onClick={search.retry}>Retry</button>
    </>
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useDiscoverySearch", () => {
  it("keeps the latest rendered results when an earlier response arrives last", async () => {
    const biceps = createDeferred<Response>();
    const triceps = createDeferred<Response>();
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => biceps.promise)
      .mockImplementationOnce(() => triceps.promise);
    vi.stubGlobal("fetch", fetchMock);

    render(<DiscoverySearchHarness />);
    const input = screen.getByRole("textbox", { name: "Search exercises" });

    fireEvent.change(input, { target: { value: "biceps" } });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    fireEvent.change(input, { target: { value: "triceps" } });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    await act(async () => {
      triceps.resolve(response(["Triceps extension"]));
      await triceps.promise;
    });
    expect(screen.getByRole("status", { name: "Search results" })).toHaveTextContent("Triceps extension");

    await act(async () => {
      biceps.resolve(response(["Biceps curl"]));
      await biceps.promise;
    });
    expect(screen.getByRole("status", { name: "Search results" })).toHaveTextContent("Triceps extension");
  });

  it("hides prior connected results immediately when an active query changes", async () => {
    const triceps = createDeferred<Response>();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(["Biceps curl"]))
      .mockImplementationOnce(() => triceps.promise);
    vi.stubGlobal("fetch", fetchMock);

    render(<DiscoverySearchHarness />);
    const input = screen.getByRole("textbox", { name: "Search exercises" });
    const results = screen.getByRole("status", { name: "Search results" });

    fireEvent.change(input, { target: { value: "biceps" } });
    await waitFor(() => expect(results).toHaveTextContent("Biceps curl"));

    fireEvent.change(input, { target: { value: "triceps" } });

    expect(results).toHaveTextContent("Local curl");
    expect(results).not.toHaveTextContent("Biceps curl");
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    await act(async () => {
      triceps.resolve(response(["Triceps extension"]));
      await triceps.promise;
    });
  });

  it("resets to local idle results after a search becomes inactive", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(["Biceps curl"]));
    vi.stubGlobal("fetch", fetchMock);

    render(<DiscoverySearchHarness />);
    const input = screen.getByRole("textbox", { name: "Search exercises" });

    fireEvent.change(input, { target: { value: "biceps" } });
    await waitFor(() => expect(screen.getByRole("status", { name: "Search status" })).toHaveTextContent("success"));
    expect(screen.getByRole("status", { name: "Search results" })).toHaveTextContent("Biceps curl");

    fireEvent.change(input, { target: { value: "b" } });
    expect(screen.getByRole("status", { name: "Search status" })).toHaveTextContent("idle");
    expect(screen.getByRole("status", { name: "Search results" })).toHaveTextContent("Local curl");

    fireEvent.change(input, { target: { value: "bi" } });
    expect(screen.getByRole("status", { name: "Search status" })).toHaveTextContent("idle");
    expect(screen.getByRole("status", { name: "Search results" })).toHaveTextContent("Local curl");
  });

  it("repeats the same request after an error when retried", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Provider unavailable" }),
      } as Response)
      .mockResolvedValueOnce(response(["Biceps curl"]));
    vi.stubGlobal("fetch", fetchMock);

    render(<DiscoverySearchHarness />);
    fireEvent.change(screen.getByRole("textbox", { name: "Search exercises" }), {
      target: { value: "biceps" },
    });
    await waitFor(() => expect(screen.getByRole("status", { name: "Search status" })).toHaveTextContent("error"));

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "/api/discovery/exercises?q=biceps",
      "/api/discovery/exercises?q=biceps",
    ]);
    await waitFor(() => expect(screen.getByRole("status", { name: "Search status" })).toHaveTextContent("success"));
  });

  it("ignores a retried response after the user searches for something newer", async () => {
    const retriedBiceps = createDeferred<Response>();
    const triceps = createDeferred<Response>();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Provider unavailable" }),
      } as Response)
      .mockImplementationOnce(() => retriedBiceps.promise)
      .mockImplementationOnce(() => triceps.promise);
    vi.stubGlobal("fetch", fetchMock);

    render(<DiscoverySearchHarness />);
    const input = screen.getByRole("textbox", { name: "Search exercises" });
    fireEvent.change(input, { target: { value: "biceps" } });
    await waitFor(() => expect(screen.getByRole("status", { name: "Search status" })).toHaveTextContent("error"));

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    fireEvent.change(input, { target: { value: "triceps" } });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));

    await act(async () => {
      triceps.resolve(response(["Triceps extension"]));
      await triceps.promise;
    });
    await act(async () => {
      retriedBiceps.resolve(response(["Biceps curl"]));
      await retriedBiceps.promise;
    });

    expect(screen.getByRole("status", { name: "Search results" })).toHaveTextContent("Triceps extension");
  });
});

describe("DiscoveryStatus", () => {
  it("renders a retry button for partial results when a callback is provided", () => {
    render(
      <DiscoveryStatus
        status="partial"
        message="Some providers are unavailable"
        onRetry={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("renders a retry button for an error when a callback is provided", () => {
    let retries = 0;
    render(
      <DiscoveryStatus
        status="error"
        message="Providers are unavailable"
        onRetry={() => {
          retries += 1;
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retries).toBe(1);
  });

  it("does not render a retry button while loading or idle", () => {
    const { rerender } = render(
      <DiscoveryStatus status="loading" message={null} onRetry={() => {}} />,
    );
    expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();

    rerender(<DiscoveryStatus status="idle" message={null} onRetry={() => {}} />);
    expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();
  });
});
