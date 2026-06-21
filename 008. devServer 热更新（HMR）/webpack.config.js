// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      // CSS 走 style-loader + css-loader，style-loader 默认就支持 HMR
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
  devServer: {
    port: 8080,
    open: true,
    // 关键开关：开启 HMR
    // webpack 5 + webpack-dev-server 4/5 默认 hot: true，这里显式写出便于教学
    hot: true,
    // 当 HMR 失败时回退到整页刷新
    liveReload: true,
    client: {
      overlay: true,
    },
  },
};
