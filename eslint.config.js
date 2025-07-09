// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from "eslint";
import pluginPrettier from "eslint-plugin-prettier";
import expoConfig from "eslint-config-expo/flat";

export default defineConfig({
  extends: [
    "plugin:prettier/recommended",
    expoConfig,
  ],
  ignorePatterns: ["dist/*"],
  overrides: [
    {
      files: ["**/*.tsx", "**/*.ts", "**/*.js"],
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        globals: {
          browser: true,
          es2021: true,
        },
      },
      plugins: {
        prettier: pluginPrettier,
      },
      rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "no-console": ["warn"],
        indent: ["error", 2],
        eqeqeq: ["error", "always"],
      },
    },
  ],
});
