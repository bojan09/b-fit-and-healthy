import { describe, expect, it } from "vitest";
import { discoveryQuerySchema } from "@/features/discovery/schemas";

describe("discoveryQuerySchema", () => {
  it("accepts an exercise muscle as search intent", () => {
    expect(discoveryQuerySchema.safeParse({ muscle: " biceps " }).success).toBe(true);
  });

  it("accepts an exercise type as search intent", () => {
    expect(discoveryQuerySchema.safeParse({ type: "core" }).success).toBe(true);
  });

  it("accepts equipment as search intent", () => {
    expect(discoveryQuerySchema.safeParse({ equipment: "dumbbell" }).success).toBe(true);
  });

  it("still requires at least one search criterion", () => {
    expect(discoveryQuerySchema.safeParse({}).success).toBe(false);
  });
});
