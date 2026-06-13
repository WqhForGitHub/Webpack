// webpack.config.js
// 演示 Tree Shaking + sideEffects 副作用标记
//
// Tree Shaking 三个先决条件：
//   1. ES Modules 静态 import/export（不能是 CommonJS 的 require）
//   2. mode: 'production' （或显式 optimization.usedExports + minimize）
//   3. package.json 中标记 "sideEffects": false 或数组（告诉 webpack 哪些文件有副作用）
//
// 关键：optimization.usedExports = true → 标记未使用的导出
//      optimization.minimize = true   → 由 TerserPlugin 真正删掉
//      package.json 中 sideEffects → 让 webpack 敢于删整个未引用的模块
//
// 当一个模块的所有 export 都未被使用，且文件被声明为「无副作用」时，
// webpack 才会把整个 import 语句删除（modules concatenation 后效果更佳）。

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",

  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    clean: true,
  },

  optimization: {
    // production 模式下默认开启
    usedExports: true,
    minimize: true,
    // 配合 package.json 中 sideEffects 字段
    sideEffects: true,
    // 模块拼接，让 tree shaking 更有效
    concatenateModules: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};
