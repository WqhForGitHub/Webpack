// webpack.config.js
// 手动拆 vendor 的两种思路：
//   方式 A：多入口 entry，把第三方库单独作为一个 entry
//   方式 B：splitChunks.cacheGroups 中配置 test: /node_modules/
//
// 这里演示「方式 A：多入口手动拆」——最直观的手动拆 vendor 方案。
// 这种方式 webpack 4 之前很流行（CommonsChunkPlugin 时代），现在仍然有效。

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",

  // 方式 A：手动把 vendor 单独作为一个 entry
  entry: {
    // 业务代码
    main: "./src/index.js",
    // 手动列出第三方库 → 打包到 vendor.js
    vendor: ["lodash", "jquery"],
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      // 同时注入 main 和 vendor
      chunks: ["vendor", "main"],
    }),
  ],
};
