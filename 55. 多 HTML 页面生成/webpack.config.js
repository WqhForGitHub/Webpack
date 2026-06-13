// webpack.config.js
// 多 HTML 页面（MPA, Multi-Page Application）：
// - 多入口 entry
// - 多个 HtmlWebpackPlugin 实例（每个对应一个页面）
// - 用 chunks 选项把每个 HTML 与对应的 entry chunk 关联
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    home: "./src/home.js",
    about: "./src/about.js",
    contact: "./src/contact.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash:8].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "home.html",
      template: "./src/template.html",
      title: "Home Page",
      chunks: ["home"], // 只引入 home 这个 chunk
    }),
    new HtmlWebpackPlugin({
      filename: "about.html",
      template: "./src/template.html",
      title: "About Page",
      chunks: ["about"],
    }),
    new HtmlWebpackPlugin({
      filename: "contact.html",
      template: "./src/template.html",
      title: "Contact Page",
      chunks: ["contact"],
    }),
  ],
};
