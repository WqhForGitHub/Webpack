// webpack.on.js —— 开启 scope hoisting（webpack 5 production 默认开启）
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/on"),
    filename: "bundle.js",
    clean: true,
  },
  optimization: {
    // 显式启用 scope hoisting（ModuleConcatenationPlugin 内部实现）
    concatenateModules: true,
    minimize: false, // 不压缩，便于阅读产物
  },
};
