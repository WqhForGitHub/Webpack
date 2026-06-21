// webpack.config.js
// 演示「多入口共享 chunk」
//
// 方式一（推荐）：splitChunks.chunks: 'all' 自动识别多入口共用模块
// 方式二：entry 配置 dependOn，显式声明依赖（webpack 5 新特性）

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",

  // —— 方式二：使用 dependOn 显式共享 ——
  // 'shared' 入口包含 lodash + jquery，其他入口通过 dependOn 共享它
  entry: {
    shared: ["lodash", "jquery"],
    pageA: { import: "./src/pageA.js", dependOn: "shared" },
    pageB: { import: "./src/pageB.js", dependOn: "shared" },
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    clean: true,
  },

  // —— 方式一：splitChunks 自动抽离也保留，组合使用 ——
  optimization: {
    runtimeChunk: "single", // 多入口共享 chunk 必须配合 single runtime，避免运行时实例冲突
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
          chunks: "all",
        },
      },
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "pageA.html",
      chunks: ["runtime", "vendors", "shared", "pageA"],
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "pageB.html",
      chunks: ["runtime", "vendors", "shared", "pageB"],
    }),
  ],
};
