export type ExerciseProviderId = "exercise-api" | "wger" | "wrkout";

export class ExerciseProviderUnavailableError extends Error {
  readonly provider: ExerciseProviderId;
  readonly status: number | null;

  constructor(provider: ExerciseProviderId, status: number | null = null) {
    super(`${provider} provider unavailable`);
    this.name = "ExerciseProviderUnavailableError";
    this.provider = provider;
    this.status = status;
  }
}

export function requireExerciseProviderResponse(
  provider: ExerciseProviderId,
  response: Response,
) {
  if (!response.ok) {
    throw new ExerciseProviderUnavailableError(provider, response.status);
  }
}

export function rethrowExerciseProviderError(
  provider: ExerciseProviderId,
  error: unknown,
): never {
  if (error instanceof ExerciseProviderUnavailableError) throw error;
  if (error instanceof DOMException && error.name === "AbortError") throw error;
  throw new ExerciseProviderUnavailableError(provider);
}
