import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Skip build assets, public media, and any file with an extension (images, fonts, feeds, manifests).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/|media/|sw.js|.*\\.[a-zA-Z0-9]+$).*)"]
};
