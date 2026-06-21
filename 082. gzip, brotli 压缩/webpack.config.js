// webpack.config.js
// 演示「gzip + brotli 静态资源压缩」 —— 通过 compression-webpack-plugin
//
// 工作方式：
//   构建结束后，在 dist 中除了输出原始文件（main.xxx.js / xxx.css），
//   还会额外生成 .gz 和 .br 文件。
//
// 服务器（nginx / express compression / koa-static）可以开启
// 「静态预压缩」直接返回这些预先生成好的 .gz / .br，
// 比运行时压缩快得多，也省 CPU。
//
// 关键参数：
//   algorithm     —— 'gzip' 或 'brotliCompress'
//   test          —— 哪些文件需要压缩
//   threshold     —— 文件超过多少字节才值得压缩
//   minRatio      —— 压缩比小于多少才保留压缩文件（避免压缩反而变大）
//   filename      —— 输出文件名模板，默认 [path][base].gz
//   deleteOriginalAssets —— 是否删除原文件（CDN 双投递场景才用）

const path = require("path");
const zlib = require("zlib");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash:8].js",
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),

    // ★ gzip
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 1024, // > 1KB 才压
      minRatio: 0.8, // 压缩比 < 0.8 才保留
      filename: "[path][base].gz",
    }),

    // ★ brotli（压缩率更高，主流浏览器都支持 Accept-Encoding: br）
    new CompressionPlugin({
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      threshold: 1024,
      minRatio: 0.8,
      filename: "[path][base].br",
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // 0-11，越大越慢压缩比越高
        },
      },
    }),
  ],
};
