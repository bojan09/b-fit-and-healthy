import { describe, expect, it } from "vitest";
import { safeProviderUrl } from "@/features/discovery/safe-url";

describe("safeProviderUrl", () => {
  it("accepts HTTPS URLs from the provider allowlist", () => {
    expect(
      safeProviderUrl(
        "https://www.themealdb.com/images/media/meals/example.jpg",
        "themealdb",
      ),
    ).toBe("https://www.themealdb.com/images/media/meals/example.jpg");
  });

  it("rejects other hosts and non-HTTPS URLs", () => {
    expect(
      safeProviderUrl("https://tracking.example/video.mp4", "musclewiki"),
    ).toBeNull();
    expect(
      safeProviderUrl("http://api.musclewiki.com/video.mp4", "musclewiki"),
    ).toBeNull();
  });
});
