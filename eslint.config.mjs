import { globalIgnores } from "eslint/config";
import nextCoreVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    ".tsupgrader/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
  ]),
];

export default eslintConfig;
