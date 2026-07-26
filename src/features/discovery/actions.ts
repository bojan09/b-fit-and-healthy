"use server";

import { revalidatePath } from "next/cache";
import type { AuthActionState } from "@/features/auth/types";
import { discoveryItemSchema } from "@/features/discovery/schemas";
import { createClient } from "@/lib/supabase/server";

export async function importDiscoveryItemAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = formData.get("item");
  if (typeof raw !== "string") {
    return { status: "error", message: "Choose an item to save." };
  }

  let candidate: unknown;
  try {
    candidate = JSON.parse(raw);
  } catch {
    return { status: "error", message: "The selected item is not valid." };
  }

  const parsed = discoveryItemSchema.safeParse(candidate);
  if (!parsed.success) {
    return { status: "error", message: "The selected item is incomplete." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Sign in to save this item." };

  try {
    const { saveDiscoverySnapshot } = await import(
      "@/features/discovery/repository"
    );
    await saveDiscoverySnapshot(user.id, parsed.data);
    revalidatePath("/recipes");
    revalidatePath("/exercises");
    revalidatePath("/training");
    return { status: "success", message: `${parsed.data.title} saved.` };
  } catch {
    return { status: "error", message: "This item could not be saved." };
  }
}
