import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDiscoverySearch } from "@/features/discovery/use-discovery-search";

describe("useDiscoverySearch", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("shows local results immediately and waits before requesting providers", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: ["local", "provider"], partial: false }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const local = ["local"];
    const { result } = renderHook(() =>
      useDiscoverySearch({ endpoint: "/api/discovery/recipes", localResults: local }),
    );

    expect(result.current.results).toEqual(local);
    act(() => result.current.setQuery("oats"));
    expect(fetchMock).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTimeAsync(275));
    expect(fetchMock).toHaveBeenCalledOnce();
    await act(async () => Promise.resolve());
    expect(result.current.results).toEqual(["local", "provider"]);
  });

  it("keeps results when a provider response is partial", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: ["verified"], partial: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() =>
      useDiscoverySearch({
        endpoint: "/api/discovery/foods",
        localResults: ["local"],
        delay: 0,
      }),
    );
    act(() => result.current.setQuery("oats"));
    await waitFor(() => expect(result.current.status).toBe("partial"));
    expect(result.current.results).toEqual(["verified"]);
    expect(result.current.message).toMatch(/Some sources/);
  });
});
