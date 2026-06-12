// loaders/banner-loader.js
// 自定义 loader：在源文件顶部插入注释 banner
// loader 本质：(source) => transformedSource
// 通过 this.getOptions() 读取在 webpack.config.js 中传入的 options
// 通过 schema-utils 校验 options 形状
const { validate } = require("schema-utils");

const schema = {
  type: "object",
  properties: {
    text: { type: "string" },
    author: { type: "string" },
  },
  required: ["text"],
  additionalProperties: false,
};

module.exports = function bannerLoader(source) {
  const options = this.getOptions() || {};
  validate(schema, options, { name: "banner-loader" });

  const banner = [
    "/**",
    ` * ${options.text}`,
    options.author ? ` * @author ${options.author}` : null,
    ` * @file   ${this.resourcePath}`,
    " */",
  ]
    .filter(Boolean)
    .join("\n");

  return `${banner}\n${source}`;
};
