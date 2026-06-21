// webpack.config.js
// 默认配置：使用 [name] 占位符

const path = require("path");

module.exports = {
  mode: "development",

  entry: {
    app: "./src/index.js",
    vendor: "./src/vendor.js",
  },

  output: {
    path: path.resolve(__dirname, "dist/name"),
    // [name] 会被替换为 entry 的 key
    filename: "[name].js",
    clean: true,
  },
};
