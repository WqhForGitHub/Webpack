// webpack.config.js
// 演示「长缓存（contenthash）」最佳实践
//
// 长缓存目标：
//   - 第三方库 vendor.js 一年不变 → max-age=31536000
//   - 业务代码变更不影响 vendor 的 contenthash
//
// 实现要点：
//   1. output.filename 使用 [contenthash]
//   2. CSS 用 mini-css-extract-plugin，独立 contenthash
//   3. optimization.runtimeChunk: 'single'（避免运行时 hash 传染）
//   4. optimization.moduleIds: 'deterministic'（webpack 5 默认 production 已开启）
//   5. splitChunks 拆出 vendors

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",

  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    // 入口/同步 chunk 命名：使用 contenthash → 内容不变 hash 不变
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

  optimization: {
    // 关键：抽出 runtime，让运行时 hash 变动不影响 vendor
    runtimeChunk: "single",

    // 关键：稳定的模块 id（webpack 5 production 默认就是 deterministic）
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
    }),
  ],
};
