// webpack.config.js
// 纯 webpack 实现 图片懒加载 demo
// 核心：webpack 5 asset modules + 动态 import() + IntersectionObserver

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    // 异步 chunk 文件名（图片懒加载会触发 import()，生成异步 chunk）
    chunkFilename: "chunks/[name].[contenthash:8].js",
    // 静态资源输出目录
    assetModuleFilename: "images/[name].[contenthash:8][ext]",
    clean: true,
  },
  module: {
    rules: [
      {
        // webpack 5 asset modules：自动处理图片
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 小于 4kb 转 base64
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 8083,
    open: true,
  },
};
