// webpack.config.js
// 演示「业务公共模块抽离」：当一个模块被多个 entry/chunk 引用时，把它拆成独立的 common.js
// 关键配置：cacheGroups 中 minChunks ≥ 2

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",

  // 多入口：home / about / contact 都会引用 src/utils/format.js
  entry: {
    home: "./src/home.js",
    about: "./src/about.js",
    contact: "./src/contact.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    clean: true,
  },

  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 0, // demo 用：取消最小体积限制
      cacheGroups: {
        // 自定义 common 缓存组：只要被引用 ≥2 次的业务代码就抽出
        common: {
          name: "common",
          minChunks: 2,
          priority: 5,
          chunks: "all",
          reuseExistingChunk: true,
        },
      },
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "home.html",
      chunks: ["common", "home"],
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "about.html",
      chunks: ["common", "about"],
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "contact.html",
      chunks: ["common", "contact"],
    }),
  ],
};
