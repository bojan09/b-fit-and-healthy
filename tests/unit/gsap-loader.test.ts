import { afterEach, describe, expect, it } from "vitest";
import { loadGsap, resetGsapLoaderForTests } from "@/features/motion/gsap-loader";

describe("GSAP loader", () => {
  afterEach(() => resetGsapLoaderForTests());

  it("caches one dynamic import promise", async () => {
    const first = loadGsap();
    const second = loadGsap();
    expect(first).toBe(second);
    const loaded = await first;
    expect(loaded.gsap).toBeDefined();
  });
});
