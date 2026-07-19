export const priorityIds = ["movement", "strength", "nutrition", "consistency", "education"] as const;
export type PriorityId = typeof priorityIds[number];
export type AuthActionState = { status: "idle" | "error" | "success"; message?: string; fieldErrors?: Record<string, string[]> };
export const initialAuthState: AuthActionState = { status: "idle" };
