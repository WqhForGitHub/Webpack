// webpack.config.js
// 动态 import：webpack 遇到 import() 调用时，会自动把目标模块
// 拆分为独立 chunk，按需通过 jsonp 加载，达成"懒加载"。
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    // 主 chunk
    filename: "js/[name].js",
    // 异步 chunk 命名：默认是数字 ID，[name] 会用 chunkId
    chunkFilename: "js/chunk-[name].js",
    clean: true,
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
