// webpack.config.js
// 演示「长缓存 (contenthash)」+「externals (CDN)」组合方案
//
// 长缓存目标：
//   - 第三方库通过 CDN 引入，浏览器和 CDN 各自缓存一年
//   - 业务 JS / CSS 使用 [contenthash] 命名，内容变了才换文件名
//
// 关键配置：
//   1. externals：告诉 webpack「不要把 lodash/jquery 打进 bundle，
//      它们以全局变量形式存在」
//   2. output.filename / chunkFilename / MiniCssExtractPlugin.filename
//      统一使用 [contenthash:8]
//   3. optimization.runtimeChunk='single' + moduleIds='deterministic'
//      —— 防止业务代码改动连带 vendor hash 变化
//   4. splitChunks 拆 vendors（即使大部分库走 CDN，也可能还有少量本地库）

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash:8].js",
    chunkFilename: "js/[name].[contenthash:8].chunk.js",
    assetModuleFilename: "assets/[name].[contenthash:8][ext]",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  // ★ externals：告诉 webpack 这些模块来自外部 CDN，不要打入产物
  externals: {
    lodash: "_",
    jquery: "jQuery",
  },
  optimization: {
    runtimeChunk: "single",
    moduleIds: "deterministic",
    chunkIds: "deterministic",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      // 把 CDN 链接传给模板
      cdn: {
        js: [
          "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js",
          "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js",
        ],
      },
    }),
  ],
};
