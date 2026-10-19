import { beforeEach, describe, expect, it, vi } from "vitest";

const getCurrentAppwriteUser = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((href: string) => {
    throw new Error(`redirect:${href}`);
  }),
}));
vi.mock("@/lib/appwrite/server", () => ({ getCurrentAppwriteUser }));
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    cache:
      <Args extends unknown[], Result>(reader: (...args: Args) => Result) => {
        const values = new Map<string, Result>();
        return (...args: Args) => {
          const key = JSON.stringify(args);
          if (!values.has(key)) values.set(key, reader(...args));
          return values.get(key) as Result;
        };
      },
  };
});

import { requireUser } from "@/features/auth/session";

describe("request-scoped session reads", () => {
  beforeEach(() => {
    getCurrentAppwriteUser.mockReset();
    getCurrentAppwriteUser.mockResolvedValue({ $id: "user-1", id: "user-1", email: "ana@example.com", name: "Ana" });
  });

  it("deduplicates repeated current-user reads in one server request", async () => {
    const first = await requireUser();
    const second = await requireUser();

    expect(first).toBe(second);
    expect(getCurrentAppwriteUser).toHaveBeenCalledTimes(1);
  });
});
