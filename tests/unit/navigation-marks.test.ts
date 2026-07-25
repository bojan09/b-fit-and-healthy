import { afterEach, describe, expect, it } from "vitest";
import {
  NAVIGATION_INTENT_MARK,
  NAVIGATION_READY_MARK,
  markNavigationIntent,
  markNavigationReady,
} from "@/lib/performance/navigation-marks";

describe("navigation marks", () => {
  afterEach(() => {
    performance.clearMarks();
    delete document.documentElement.dataset.navigationPending;
  });

  it("marks intent and ready states without leaving pending UI behind", () => {
    markNavigationIntent("/nutrition");
    expect(document.documentElement.dataset.navigationPending).toBe(
      "/nutrition",
    );
    expect(performance.getEntriesByName(NAVIGATION_INTENT_MARK)).toHaveLength(1);

    markNavigationReady("/nutrition");
    expect(document.documentElement.dataset.navigationPending).toBeUndefined();
    expect(performance.getEntriesByName(NAVIGATION_READY_MARK)).toHaveLength(1);
  });
});
