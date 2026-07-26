import { z } from "zod";

export const accountSettingsSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  units: z.enum(["metric", "imperial"]),
  timezone: z.string().trim().min(1).max(80),
});
