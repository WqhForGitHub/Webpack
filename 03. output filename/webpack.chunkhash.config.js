// webpack.chunkhash.config.js
// 使用 [chunkhash] 占位符：基于 chunk 内容生成 hash，不同 chunk hash 不同

const path = require("path");

module.exports = {
  mode: "development",

  entry: {
    app: "./src/index.js",
    vendor: "./src/vendor.js",
  },

  output: {
    path: path.resolve(__dirname, "dist/chunkhash"),
    // [chunkhash] 与 chunk 内容相关，chunk 内容变化才变化
    filename: "[name].[chunkhash:8].js",
    clean: true,
  },
};
