// webpack.contenthash.config.js
// 使用 [contenthash] 占位符：基于文件内容生成 hash（最适合长缓存）

const path = require("path");

module.exports = {
  mode: "production",

  entry: {
    app: "./src/index.js",
    vendor: "./src/vendor.js",
  },

  output: {
    path: path.resolve(__dirname, "dist/contenthash"),
    // [contenthash] 仅与文件内容相关，文件内容不变就不变（缓存友好）
    filename: "[name].[contenthash:8].js",
    clean: true,
  },
};
