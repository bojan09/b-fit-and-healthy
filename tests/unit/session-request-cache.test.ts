import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((href: string) => {
    throw new Error(`redirect:${href}`);
  }),
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser },
  }),
}));
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
    getUser.mockReset();
    getUser.mockResolvedValue({
      data: { user: { id: "user-1", email: "ana@example.com" } },
    });
  });

  it("deduplicates repeated current-user reads in one server request", async () => {
    const first = await requireUser();
    const second = await requireUser();

    expect(first).toBe(second);
    expect(getUser).toHaveBeenCalledTimes(1);
  });
});
