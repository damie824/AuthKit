import { nestConfig } from "@repo/eslint-config/nest";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nestConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
