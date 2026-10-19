import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { getPublicEnv } from "@/lib/env/public";
import { getServerEnv } from "@/lib/env/server";
import { appwriteRequest, AppwriteError } from "@/lib/appwrite/rest";

// Appwrite tables are manifest-driven at runtime, so the adapter accepts dynamic field keys.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;
type Query = { method: string; attribute: string; values?: unknown[] };
type QueryOptions = { count?: "exact"; head?: boolean };
type Result<T = Row[]> = { data: T | null; error: AppwriteError | Error | null; count?: number };
type ListRows = { total: number; rows: Array<Row & { $id: string; $createdAt?: string; $updatedAt?: string }> };

const createdAtTables = new Set(["profiles", "user_settings", "goals", "daily_targets", "water_logs", "body_measurements", "habits", "habit_checkins", "notifications", "foods", "food_favourites", "meal_entries", "recipes", "saved_recipes", "meal_plan_items", "grocery_items", "exercises", "workout_programs", "workout_templates", "workout_template_exercises", "planned_workouts", "workout_sessions", "workout_session_exercises", "workout_sets", "ai_conversations", "ai_messages", "external_content_snapshots"]);
const updatedAtTables = new Set(["profiles", "user_settings", "goals", "daily_targets", "body_measurements", "habits", "habit_checkins", "foods", "meal_entries", "recipes", "meal_plan_items", "grocery_items", "workout_programs", "workout_templates", "workout_template_exercises", "planned_workouts", "workout_sessions", "workout_session_exercises", "workout_sets", "ai_conversations", "external_content_snapshots"]);

function defaults(tableId: string, now: string): Row {
  const today = now.slice(0, 10);
  const byTable: Record<string, Row> = {
    profiles: { display_name: "", locale: "en", onboarding_complete: false },
    user_settings: { units: "metric", theme: "system", timezone: "UTC", reminders_enabled: false, weekly_summary_enabled: true },
    goals: { starts_on: today, status: "active" },
    daily_targets: { effective_from: today },
    water_logs: { logged_at: now },
    body_measurements: { recorded_on: today },
    habits: { position: 0, is_archived: false },
    habit_checkins: { checkin_on: today },
    notifications: { kind: "general" },
    foods: { source: "custom", serving_grams: 100, energy_kcal: 0, protein_g: 0, carbohydrate_g: 0, fat_g: 0, fibre_g: 0, is_public: false },
    meal_entries: { logged_on: today, protein_g: 0, carbohydrate_g: 0, fat_g: 0, fibre_g: 0 },
    recipes: { prep_minutes: 0, cook_minutes: 0, servings: 1, energy_kcal: 0, protein_g: 0, carbohydrate_g: 0, fat_g: 0, fibre_g: 0, tags: [], is_public: false },
    recipe_ingredients: { position: 0 },
    recipe_steps: { position: 0 },
    meal_plan_items: { servings: 1 },
    grocery_items: { category: "Other", is_checked: false, source: "manual" },
    exercises: { equipment: [], instructions_en: [], instructions_mk: [], safety_en: "", safety_mk: "", is_public: true },
    workout_programs: { description: "", is_active: true },
    workout_templates: { description: "", difficulty: "beginner", expected_duration_minutes: 30, goal: "general" },
    workout_template_exercises: { target_sets: 3, rest_seconds: 90, note: "" },
    planned_workouts: { status: "planned" },
    workout_sessions: { status: "active", started_at: now, note: "" },
    workout_session_exercises: { target_sets: 3, rest_seconds: 90 },
    workout_sets: { is_bodyweight: false, is_complete: false, note: "" },
    ai_conversations: { locale: "en", title: "New conversation", expires_at: new Date(Date.now() + 30 * 86400000).toISOString(), last_message_at: now },
    ai_messages: { status: "complete" },
    external_content_snapshots: { schema_version: 1 },
    rate_limits: { window_started_at: now, request_count: 0 },
  };
  return byTable[tableId] ?? {};
}

function stamp(tableId: string, input: Row, update = false): Row {
  const now = new Date().toISOString();
  const row = update ? { ...input } : { ...defaults(tableId, now), ...input };
  if (!update && createdAtTables.has(tableId) && !row.created_at) row.created_at = now;
  if (updatedAtTables.has(tableId)) row.updated_at = now;
  return row;
}

function normalized(row: Row & { $id?: string; $createdAt?: string; $updatedAt?: string }) {
  const attributes = { ...row };
  const $id = attributes.$id;
  const $createdAt = attributes.$createdAt;
  const $updatedAt = attributes.$updatedAt;
  delete attributes.$id;
  delete attributes.$createdAt;
  delete attributes.$updatedAt;
  delete attributes.$permissions;
  for (const key of ["draft", "payload", "instructions_en", "instructions_mk"]) {
    if (typeof attributes[key] === "string") {
      try { attributes[key] = JSON.parse(attributes[key]); } catch { /* Keep malformed legacy text inspectable. */ }
    }
  }
  return {
    ...attributes,
    ...(typeof $id === "string" ? { id: $id } : {}),
    ...(typeof $createdAt === "string" ? { created_at: $createdAt } : {}),
    ...(typeof $updatedAt === "string" ? { updated_at: $updatedAt } : {}),
  };
}

function project(row: Row, selection: string) {
  if (!selection.trim() || selection.trim() === "*") return row;
  const columns = selection.split(",").map((column) => column.trim()).filter((column) => /^[A-Za-z_$][\w$]*$/.test(column));
  if (!columns.length) return row;
  return Object.fromEntries(columns.filter((key) => key in row).map((key) => [key, row[key]]));
}

export class AppwriteTablesClient {
  table(tableId: string) {
    return new AppwriteTableQuery(tableId);
  }
}

class AppwriteTableQuery implements PromiseLike<Result<Row[]>> {
  private filters: Query[] = [];
  private orders: Query[] = [];
  private selection = "*";
  private mode: "list" | "insert" | "upsert" | "update" | "delete" = "list";
  private payload: Row | Row[] = {};
  private conflict: string[] = [];
  private take = 100;
  private singleMode: "single" | "maybeSingle" | null = null;
  private queryOptions: QueryOptions = {};
  private execution?: Promise<Result<Row[]>>;

  constructor(private readonly tableId: string) {}

  select(columns = "*", options: QueryOptions = {}) {
    this.selection = columns;
    this.queryOptions = options;
    return this;
  }

  eq(attribute: string, value: unknown) { this.filters.push({ method: "equal", attribute, values: [value] }); return this; }
  gte(attribute: string, value: unknown) { this.filters.push({ method: "greaterThanEqual", attribute, values: [value] }); return this; }
  lte(attribute: string, value: unknown) { this.filters.push({ method: "lessThanEqual", attribute, values: [value] }); return this; }
  gt(attribute: string, value: unknown) { this.filters.push({ method: "greaterThan", attribute, values: [value] }); return this; }
  in(attribute: string, values: unknown[]) { this.filters.push({ method: "equal", attribute, values }); return this; }
  is(attribute: string, value: null | boolean) { this.filters.push({ method: value === null ? "isNull" : "equal", attribute, ...(value === null ? {} : { values: [value] }) }); return this; }
  not(attribute: string, operator: string, value: unknown) {
    const method = operator === "is" && value === null ? "isNotNull" : operator === "eq" ? "notEqual" : "notEqual";
    this.filters.push({ method, attribute, ...(value === null ? {} : { values: [value] }) });
    return this;
  }
  order(attribute: string, options: { ascending?: boolean } = {}) { this.orders.push({ method: options.ascending === false ? "orderDesc" : "orderAsc", attribute }); return this; }
  limit(value: number) { this.take = Math.max(1, Math.min(5000, Math.floor(value))); return this; }
  single() { this.singleMode = "single"; return this.execute() as Promise<Result<Row>>; }
  maybeSingle() { this.singleMode = "maybeSingle"; return this.execute() as Promise<Result<Row>>; }
  insert(data: Row | Row[]) { this.mode = "insert"; this.payload = data; return this; }
  upsert(data: Row | Row[], options: { onConflict?: string } = {}) { this.mode = "upsert"; this.payload = data; this.conflict = (options.onConflict ?? "").split(",").filter(Boolean); return this; }
  update(data: Row) { this.mode = "update"; this.payload = data; return this; }
  delete() { this.mode = "delete"; return this; }

  then<TResult1 = Result<Row[]>, TResult2 = never>(
    onfulfilled?: ((value: Result<Row[]>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    this.execution ??= this.execute();
    return this.execution.then(onfulfilled, onrejected);
  }

  private async request<T>(path: string, method: "GET" | "POST" | "PATCH" | "DELETE", body?: unknown) {
    const [session, databaseId] = await Promise.all([
      cookies().then((store) => store.get(`a_session_${getPublicEnv().NEXT_PUBLIC_APPWRITE_PROJECT_ID}`)?.value),
      Promise.resolve(getServerEnv().APPWRITE_DATABASE_ID),
    ]);
    if (!session) throw new Error("APPWRITE_SESSION_REQUIRED");
    if (!databaseId) throw new Error("APPWRITE_DATABASE_ID_REQUIRED");
    const route = `/tablesdb/${encodeURIComponent(databaseId)}/tables/${encodeURIComponent(this.tableId)}/rows${path}`;
    const env = getPublicEnv();
    return appwriteRequest<T>({ endpoint: env.NEXT_PUBLIC_APPWRITE_ENDPOINT, projectId: env.NEXT_PUBLIC_APPWRITE_PROJECT_ID }, route, { method, session, body });
  }

  private async listRows(filters = this.filters, limit = this.take): Promise<ListRows> {
    const query = new URLSearchParams();
    for (const item of [...filters, ...this.orders, { method: "limit", attribute: "", values: [limit] }]) {
      query.append("queries[]", JSON.stringify(item));
    }
    return this.request<ListRows>(`?${query.toString()}`, "GET");
  }

  private permissions(data: Row) {
    const owner = typeof data.user_id === "string" ? data.user_id : typeof data.owner_id === "string" ? data.owner_id : undefined;
    return owner ? [`read("user:${owner}")`, `update("user:${owner}")`, `delete("user:${owner}")`] : [];
  }

  private async createRow(data: Row) {
    const rowId = typeof data.id === "string" ? data.id : randomUUID();
    const row = stamp(this.tableId, { ...data, id: rowId });
    for (const key of ["draft", "payload", "instructions_en", "instructions_mk"]) {
      if (row[key] !== undefined && row[key] !== null && typeof row[key] !== "string") row[key] = JSON.stringify(row[key]);
    }
    const created = await this.request<Row & { $id: string; $createdAt?: string; $updatedAt?: string }>("", "POST", {
      rowId,
      data: row,
      permissions: this.permissions(row),
    });
    return normalized(created);
  }

  // The query builder intentionally returns either arrays or single rows based on its terminal method.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async execute(): Promise<any> {
    try {
      if (this.mode === "list") {
        const rows = await this.listRows();
        const data = rows.rows.map((row) => project(normalized(row), this.selection));
        const shaped = this.singleMode === "single" ? data[0] ?? null : this.singleMode === "maybeSingle" ? data[0] ?? null : data;
        if (this.singleMode === "single" && data.length !== 1) return { data: null, error: new Error("APPWRITE_ROW_COUNT_MISMATCH") };
        return { data: shaped, error: null, ...(this.queryOptions.count ? { count: rows.total } : {}) };
      }

      if (this.mode === "insert") {
        const input = Array.isArray(this.payload) ? this.payload : [this.payload];
        const rows = await Promise.all(input.map((row) => this.createRow(row)));
        const data = rows.map((row) => project(row, this.selection));
        return { data: this.singleMode === "single" || this.singleMode === "maybeSingle" ? data[0] ?? null : data, error: null };
      }

      if (this.mode === "upsert") {
        const input = Array.isArray(this.payload) ? this.payload : [this.payload];
        const rows: Row[] = [];
        for (const row of input) {
          const conflictFilters = this.conflict.map((attribute) => ({ method: "equal", attribute, values: [row[attribute]] }));
          const existing = conflictFilters.length ? await this.listRows([...this.filters, ...conflictFilters], 1) : { rows: [] };
          if (existing.rows[0]) {
            const id = existing.rows[0].$id;
            const updated = await this.request<Row>(`/${encodeURIComponent(id)}`, "PATCH", { data: stamp(this.tableId, row, true) });
            rows.push(normalized(updated));
          } else rows.push(await this.createRow(row));
        }
        return { data: rows.map((row) => project(row, this.selection)), error: null };
      }

      if (this.mode === "update") {
        const existing = await this.listRows();
        const rows = await Promise.all(existing.rows.map((row) => this.request<Row>(`/${encodeURIComponent(row.$id)}`, "PATCH", { data: stamp(this.tableId, this.payload, true) })));
        return { data: rows.map(normalized), error: null };
      }

      const existing = await this.listRows();
      await Promise.all(existing.rows.map((row) => this.request(`/${encodeURIComponent(row.$id)}`, "DELETE")));
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error("APPWRITE_REQUEST_FAILED") };
    }
  }
}

export async function createAppwriteTablesClient() {
  return new AppwriteTablesClient();
}
