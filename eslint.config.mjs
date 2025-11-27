import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: ["**/node_modules/**", ".next/**", "coverage/**", "**/._*", ".DS_Store"],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default config;
