// eslint.config.js
import expo from "eslint-config-expo/flat.js";
import tsParser from "@typescript-eslint/parser";
import { configs as tsConfigs } from "typescript-eslint";
import eslint from "@eslint/js";

export default [
  eslint.configs.recommended,
  ...expo,
  ...tsConfigs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-deprecated": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      semi: ["error", "always"],
      quotes: ["error", "double"],
      eqeqeq: ["error", "always"],
    },
  },
  {
    ignores: ["node_modules/**", "dist/**", "build/**", ".expo/**", ".next/**", "coverage/**"],
  },
];
