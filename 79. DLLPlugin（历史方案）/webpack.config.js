// webpack.config.js
// 第二步：业务代码主构建
//
// 通过 DllReferencePlugin 读取 dll-manifest.json：
//   - 主 bundle 不再包含 lodash / jquery，体积变小，编译更快
//   - 通过 add-asset-html-webpack-plugin 自动把 vendors.dll.js 注入到 HTML

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.[contenthash:8].js",
    clean: true,
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require("./dll/vendors-manifest.json"),
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    // 把 dll/vendors.dll.js 拷贝到 dist 并自动 <script> 注入
    new AddAssetHtmlPlugin([
      {
        filepath: path.resolve(__dirname, "dll/vendors.dll.js"),
        outputPath: "dll",
        publicPath: "dll",
      },
    ]),
  ],
};
