import antf from "@antfu/eslint-config";
import globals from "globals";

export default antf({
  ignores: ["tsconfig.json", "test", "yarn.lock", "package.json", "eslint.config.mjs", ".husky", "src/migrations", "migrations"]
}, {
  languageOptions: {
    globals: {
      ...globals.jest,
      ...globals.node
    }
  },
  rules: {
    "style/semi": ["error", "always"],
    "style/member-delimiter-style": ["error", {
      multiline: {
        delimiter: "semi",
        requireLast: true
      },
      singleline: {
        delimiter: "semi",
        requireLast: false
      },
      multilineDetection: "brackets"
    }],
    "no-console": ["error", {
      allow: ["warn", "error", "info"]
    }],
    "node/prefer-global/process": ["error", "always"],
    "ts/consistent-type-imports": "off"
  }
});
