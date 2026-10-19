import { z } from "zod";

export const accountSettingsSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  units: z.enum(["metric", "imperial"]),
  timezone: z.string().trim().min(1).max(80),
});

const optionalWhole = (max: number) =>
  z.preprocess(
    (value) => (value === "" || value === undefined || value === null ? null : value),
    z.coerce.number().int().min(0).max(max).nullable(),
  );

export const dailyTargetsSchema = z.object({
  energyKcal: optionalWhole(20_000),
  waterMl: optionalWhole(20_000),
  proteinG: optionalWhole(2_000),
});
