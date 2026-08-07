import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ["tests/**/*.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" }
  },
  globalIgnores([
    ".next/**",
    ".worktrees/**",
    ".claude/worktrees/**",
    "node_modules/**",
    "prototype/**",
    "playwright-report/**",
    "test-results/**",
    ".auth/**",
    "public/sw.js"
  ])
]);
