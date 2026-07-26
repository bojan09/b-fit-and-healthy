import { discoveryItemSchema } from "@/features/discovery/schemas";

const allowedExerciseProviders = new Set([
  "local",
  "wger",
  "exercise-api",
  "wrkout",
]);

export const discoveryImportSchema = discoveryItemSchema.superRefine(
  (item, context) => {
    if (item.kind !== "exercise") return;

    if (!allowedExerciseProviders.has(item.provider)) {
      context.addIssue({
        code: "custom",
        path: ["provider"],
        message: "Exercise provider provenance is not permitted.",
      });
    }
  },
);
