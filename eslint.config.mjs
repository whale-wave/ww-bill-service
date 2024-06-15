import antf from "@antfu/eslint-config";

export default antf({
  ignores: ["tsconfig.json", "test", "yarn.lock", "package.json", "eslint.config.mjs", ".husky"]
}, {
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
      allow: ["warn", "error"]
    }]
  }
});
