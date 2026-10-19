import { describe, expect, it, vi } from "vitest";
import { appwriteRequest, type AppwriteConfig } from "@/lib/appwrite/rest";

const config: AppwriteConfig = {
  endpoint: "https://fra.cloud.appwrite.io/v1",
  projectId: "6ac945000038e9b28df4",
};

describe("Appwrite REST boundary", () => {
  it("sends the project, session, and JSON body without exposing an API key", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ $id: "row-1" }), { status: 201 }));

    const result = await appwriteRequest<{ $id: string }>(config, "/tablesdb/db/tables/logs/rows", {
      method: "POST",
      session: "session-secret",
      body: { amount: 200 },
      fetcher,
    });

    expect(result.$id).toBe("row-1");
    const [url, init] = fetcher.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);
    expect(url).toBe("https://fra.cloud.appwrite.io/v1/tablesdb/db/tables/logs/rows");
    expect(init).toMatchObject({ method: "POST", body: JSON.stringify({ amount: 200 }) });
    expect(headers.get("X-Appwrite-Project")).toBe("6ac945000038e9b28df4");
    expect(headers.get("X-Appwrite-Session")).toBe("session-secret");
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.has("X-Appwrite-Key")).toBe(false);
  });

  it("uses a server API key only when explicitly supplied", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    await appwriteRequest(config, "/users", { method: "GET", apiKey: "server-secret", fetcher });
    const headers = new Headers(fetcher.mock.calls[0]?.[1]?.headers);
    expect(headers.get("X-Appwrite-Key")).toBe("server-secret");
  });

  it("returns a safe typed error for failed Appwrite requests", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      message: "Invalid credentials",
      type: "user_invalid_credentials",
      code: 401,
    }), { status: 401 }));

    await expect(appwriteRequest(config, "/account", { method: "GET", fetcher })).rejects.toMatchObject({
      status: 401,
      type: "user_invalid_credentials",
    });
  });
});
