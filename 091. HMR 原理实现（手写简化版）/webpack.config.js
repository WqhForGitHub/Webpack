// webpack.config.js
// 关键：开启 hot=true，并把手写 hmr-client 注入到 entry

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  // 多入口：业务代码 + 手写 HMR 客户端
  entry: {
    main: ["./src/hmr-client.js", "./src/index.js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/", // HMR 需要 publicPath 指向静态服务器根
    hotUpdateChunkFilename: "[id].[fullhash].hot-update.js",
    hotUpdateMainFilename: "[runtime].[fullhash].hot-update.json",
    clean: true,
  },
  plugins: [
    // webpack 的核心 HMR runtime —— 提供 module.hot.* 与 hot update chunks
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ template: "./index.html" }),
  ],
};
