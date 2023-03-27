require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
  ],
  overrides: [
    {
      files: ["cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx}"],
      extends: ["plugin:cypress/recommended"],
    },
    {
      files: ["src/components/__tests__/**.spec.js"], //the files array can contain a list of files "**.spec.js" ayy we7ed youfa b spec.js
      globals: {
        // this option is an object of variables that can be used from within our files
        test: "readonly",
        describe: "readonly",
        expect: "readonly",
        vi: "readonly",
        beforeEach: "readonly",
        it: "readonly",
      },
    },
  ],
  env: {
    node: true,
  },
  rules: {
    "vue/multi-word-component-names": "off",
  },
};
