import "server-only";
import { parseServerEnv, type ServerEnv } from "@/lib/env/server-schema";

export { parseServerEnv, type ServerEnv };

export function getServerEnv(): ServerEnv {
  return parseServerEnv({
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    USDA_FDC_API_KEY: process.env.USDA_FDC_API_KEY
  });
}
