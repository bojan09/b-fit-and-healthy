import { z } from "zod";
import { priorityIds } from "@/features/auth/types";

const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(10).max(128);
const displayName = z.string().trim().min(2).max(60);
const timezone = z.string().trim().min(1).max(80).refine((value) => { try { new Intl.DateTimeFormat("en", { timeZone: value }).format(); return true; } catch { return false; } }, "Invalid timezone");

export const signInSchema = z.object({ email, password: z.string().min(1).max(128), next: z.string().optional() });
export const emailRequestSchema = z.object({ email, next: z.string().optional() });
export const signUpSchema = z.object({ displayName, email, password, confirmPassword: z.string(), locale: z.enum(["en", "mk"]), next: z.string().optional() }).superRefine((value, context) => { if (value.password !== value.confirmPassword) context.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords do not match" }); });
export const resetPasswordSchema = z.object({ password, confirmPassword: z.string(), next: z.string().optional() }).superRefine((value, context) => { if (value.password !== value.confirmPassword) context.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords do not match" }); });
export const onboardingSchema = z.object({ displayName, locale: z.enum(["en", "mk"]), units: z.enum(["metric", "imperial"]), timezone, priorities: z.array(z.enum(priorityIds)).min(1).max(3), next: z.string().optional() });
