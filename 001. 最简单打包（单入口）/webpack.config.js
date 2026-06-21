// webpack.config.js
// 纯 webpack 最简单的单入口配置（不使用任何 loader 和 plugin）

const path = require("path");

module.exports = {
  // 打包模式：development（开发） / production（生产） / none
  mode: "development",

  // 单入口：只有一个入口文件
  entry: "./src/index.js",

  // 输出配置
  output: {
    // 输出目录（必须是绝对路径）
    path: path.resolve(__dirname, "dist"),
    // 输出文件名
    filename: "bundle.js",
    // 每次打包前清理 dist 目录（webpack 5 内置功能）
    clean: true,
  },
};
