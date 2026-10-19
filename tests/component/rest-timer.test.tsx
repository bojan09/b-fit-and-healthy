import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RestTimer } from "@/features/fitness/rest-timer";

describe("RestTimer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("counts down and announces when rest is over", () => {
    render(<RestTimer seconds={2} locale="en" onDismiss={vi.fn()} />);
    expect(screen.getByRole("timer")).toHaveTextContent("0:02");
    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByRole("timer")).toHaveTextContent("0:01");
    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByRole("timer")).toHaveTextContent("0:00");
    expect(screen.getByText(/Rest is over/)).toBeInTheDocument();
  });

  it("can be skipped", () => {
    const onDismiss = vi.fn();
    render(<RestTimer seconds={60} locale="mk" onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button", { name: "Прескокни одмор" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
