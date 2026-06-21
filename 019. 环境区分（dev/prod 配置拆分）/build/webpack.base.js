// build/webpack.base.js
// 公共配置：dev / prod 共享的入口、输出、模块规则、HTML 插件等
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/bundle.[contenthash:8].js",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  module: {
    rules: [
      // CSS 规则在 dev/prod 中分别覆盖（loader 不一样）
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      title: "环境区分 Demo",
    }),
  ],
};
