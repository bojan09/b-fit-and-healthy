import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ cookies: vi.fn(), getPublicEnv: vi.fn(), getServerEnv: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: mocks.cookies }));
vi.mock("@/lib/env/public", () => ({ getPublicEnv: mocks.getPublicEnv }));
vi.mock("@/lib/env/server", () => ({ getServerEnv: mocks.getServerEnv }));

import { AppwriteTablesClient } from "@/lib/appwrite/tables";

describe("Appwrite TablesDB adapter", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses the session and database boundary for list queries", async () => {
    mocks.cookies.mockResolvedValue({ get: () => ({ value: "session-secret" }) });
    mocks.getPublicEnv.mockReturnValue({ NEXT_PUBLIC_APPWRITE_ENDPOINT: "https://fra.cloud.appwrite.io/v1", NEXT_PUBLIC_APPWRITE_PROJECT_ID: "project-id" });
    mocks.getServerEnv.mockReturnValue({ APPWRITE_DATABASE_ID: "bfit-health" });
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ total: 0, rows: [] }), { status: 200 }));
    vi.stubGlobal("fetch", fetcher);

    const result = await new AppwriteTablesClient().table("habits").select("id,title").eq("user_id", "user-1");

    expect(result).toMatchObject({ data: [], error: null });
    const [url, init] = fetcher.mock.calls[0] ?? [];
    expect(String(url)).toContain("/tablesdb/bfit-health/tables/habits/rows?");
    expect(new Headers(init?.headers).get("X-Appwrite-Session")).toBe("session-secret");
    expect(JSON.parse(new URL(String(url)).searchParams.get("queries[]") ?? "{}")).toMatchObject({ method: "equal", attribute: "user_id", values: ["user-1"] });
  });

  it("assigns row ownership on user-created rows", async () => {
    mocks.cookies.mockResolvedValue({ get: () => ({ value: "session-secret" }) });
    mocks.getPublicEnv.mockReturnValue({ NEXT_PUBLIC_APPWRITE_ENDPOINT: "https://fra.cloud.appwrite.io/v1", NEXT_PUBLIC_APPWRITE_PROJECT_ID: "project-id" });
    mocks.getServerEnv.mockReturnValue({ APPWRITE_DATABASE_ID: "bfit-health" });
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ $id: "habit-1", $createdAt: "2026-10-19T00:00:00.000Z", $updatedAt: "2026-10-19T00:00:00.000Z", id: "habit-1", user_id: "user-1", title: "Walk" }), { status: 201 }));
    vi.stubGlobal("fetch", fetcher);

    const result = await new AppwriteTablesClient().table("habits").insert({ id: "habit-1", user_id: "user-1", title: "Walk" });

    expect(result.error).toBeNull();
    expect(result.data?.[0]).toMatchObject({ id: "habit-1", title: "Walk" });
    const body = JSON.parse(fetcher.mock.calls[0]?.[1]?.body as string);
    expect(body.permissions).toEqual(['read("user:user-1")', 'update("user:user-1")', 'delete("user:user-1")']);
    expect(body.data.id).toBe("habit-1");
  });
});
