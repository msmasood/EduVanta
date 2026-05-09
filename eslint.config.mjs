import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // The React Compiler ESLint plugin emits false-positive "Cannot access refs
  // during render" errors when react-hook-form's useController() is used.
  // The field object properties are not actual React refs.
  {
    files: [
      "src/components/forms/**/*.tsx",
      "src/components/data-table/**/*.tsx",
    ],
    rules: {
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
