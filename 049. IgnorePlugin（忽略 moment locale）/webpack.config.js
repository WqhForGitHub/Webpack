// webpack.config.js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [
    // moment 默认会把所有 locale 文件全部打包进来（约 200KB+）
    // 用 IgnorePlugin 忽略 moment/locale 目录下的所有文件
    // 然后业务代码中按需手动 import "moment/locale/zh-cn"
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
};
