// webpack.hash.config.js
// 使用 [hash] 占位符：每次构建都会生成相同的 hash（编译级别）

const path = require("path");

module.exports = {
  mode: "development",

  entry: {
    app: "./src/index.js",
    vendor: "./src/vendor.js",
  },

  output: {
    path: path.resolve(__dirname, "dist/hash"),
    // [fullhash] 是整次编译的 hash，所有文件共用同一个
    filename: "[name].[fullhash:8].js",
    clean: true,
  },
};
