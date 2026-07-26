import "server-only";
import { parseServerEnv, type ServerEnv } from "@/lib/env/server-schema";

export { parseServerEnv, type ServerEnv };

export function getServerEnv(): ServerEnv {
  return parseServerEnv({
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_MODEL: process.env.GROQ_MODEL,
    USDA_FDC_API_KEY: process.env.USDA_FDC_API_KEY,
    THEMEALDB_API_KEY: process.env.THEMEALDB_API_KEY,
    MUSCLEWIKI_API_KEY: process.env.MUSCLEWIKI_API_KEY,
  });
}
