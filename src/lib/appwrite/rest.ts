export type AppwriteConfig = {
  endpoint: string;
  projectId: string;
};

export type AppwriteRequestOptions = {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  session?: string;
  apiKey?: string;
  body?: unknown;
  fetcher?: typeof fetch;
};

export class AppwriteError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly type: string | undefined,
  ) {
    super(message);
    this.name = "AppwriteError";
  }
}

export async function appwriteRequest<T = unknown>(
  config: AppwriteConfig,
  path: string,
  options: AppwriteRequestOptions,
): Promise<T> {
  const headers = new Headers({ "X-Appwrite-Project": config.projectId });
  if (options.session) headers.set("X-Appwrite-Session", options.session);
  if (options.apiKey) headers.set("X-Appwrite-Key", options.apiKey);
  if (options.body !== undefined) headers.set("Content-Type", "application/json");

  const response = await (options.fetcher ?? fetch)(
    `${config.endpoint.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    {
      method: options.method,
      headers,
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
      cache: "no-store",
    },
  );

  const text = await response.text();
  let payload: { message?: string; type?: string } & Record<string, unknown> = {};
  if (text) {
    try {
      payload = JSON.parse(text) as typeof payload;
    } catch {
      payload = {};
    }
  }

  if (!response.ok) {
    throw new AppwriteError(
      typeof payload.message === "string" ? payload.message : "Appwrite request failed",
      response.status,
      typeof payload.type === "string" ? payload.type : undefined,
    );
  }

  return payload as T;
}
