import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpace,
  email,
  min_value as minVal,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("tos", required);

    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpace);
    defineRule("email", email);
    defineRule("email", email);
    defineRule("min_value", minVal);
    defineRule("max_value", maxValue);
    defineRule("passwords_mismatch", confirmed);
    defineRule("excluded", excluded);
    defineRule("country_excluded", excluded);
    defineRule("type_excluded", excluded);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `the field ${ctx.field} is required.`,
          min: `the field ${ctx.field} is too short.`,
          max: `the field ${ctx.field} is  too long.`,
          alpha_spaces: `the field ${ctx.field} mau only containt alphabetical character.`,
          email: `the field ${ctx.field} most be a  valid email.`,
          min_value: `the field ${ctx.field} is  too low.`,
          max_value: `the field ${ctx.field} is  too high.`,
          excluded: `you are not allow to use this value for the field ${ctx.field} .`,
          country_excluded: "you can not use this location .",
          type: "you can not use this type .",
          passwords_mismatch: "the password don't match.",
          tos: "you must accept the terms of this servece. ",
        };
        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `the field ${ctx.field} is invalid`;
        return message;
      },
      validateOnBlur: true,
      validateOnCange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
