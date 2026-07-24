import { describe, expect, it } from "vitest";
import { buildSafetyResponse, classifySafety } from "@/features/assistant/safety";

describe("assistant safety boundary", () => {
  it.each([
    ["Do I have diabetes?", "diagnosis"],
    ["Should I stop taking my medication?", "medication"],
    ["Give me an 800 calorie starvation diet", "eating-risk"],
    ["I felt a sharp pain and cannot put weight on my ankle", "acute-injury"],
    ["I have chest pain and cannot breathe", "emergency"],
  ] as const)("classifies %s", (input, expected) => {
    expect(classifySafety(input)).toBe(expected);
  });

  it("allows ordinary education and planning requests", () => {
    expect(classifySafety("Explain progressive overload")).toBe("general");
    expect(classifySafety("Suggest a balanced dinner")).toBe("general");
  });

  it("produces bilingual boundary copy without diagnosis", () => {
    expect(buildSafetyResponse("diagnosis", "en")).toMatch(/cannot diagnose/i);
    expect(buildSafetyResponse("emergency", "en")).toMatch(/emergency services/i);
    expect(buildSafetyResponse("medication", "mk")).toMatch(/лекар|стручно/i);
  });
});

