// loaders/replace-loader.js
// 自定义 loader：把源码中的若干字符串按规则替换
// options.rules: Array<{ search: string | RegExp, replace: string }>
const { validate } = require("schema-utils");

const schema = {
  type: "object",
  properties: {
    rules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          search: {},
          replace: { type: "string" },
        },
        required: ["search", "replace"],
      },
    },
  },
  required: ["rules"],
  additionalProperties: false,
};

module.exports = function replaceLoader(source) {
  const options = this.getOptions() || {};
  validate(schema, options, { name: "replace-loader" });

  let output = source;
  for (const rule of options.rules) {
    // 简单实现：字符串走 split/join，正则原样使用
    if (rule.search instanceof RegExp) {
      output = output.replace(rule.search, rule.replace);
    } else {
      output = output.split(rule.search).join(rule.replace);
    }
  }
  return output;
};
