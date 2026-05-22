// ESLint flat config (Next.js 16 / ESLint 9).
// `next lint` was removed in Next 16 — run ESLint directly via `npm run lint`.
import nextConfig from "eslint-config-next/core-web-vitals";

// eslint-config-next ships a flat-config array; unwrap CJS/ESM interop just in case.
const nextFlatConfig = Array.isArray(nextConfig) ? nextConfig : (nextConfig.default ?? []);

const eslintConfig = [
  ...nextFlatConfig,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
