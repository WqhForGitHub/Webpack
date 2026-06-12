// webpack.config.js
// 自动清理 dist：
// - webpack 5 推荐方式：output.clean = true（内置，无需安装额外插件）
// - 旧方案：clean-webpack-plugin（需要额外依赖）
// 通过 --env legacy 切换到旧方案以便对比
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env = {}, argv) => {
  const mode = argv.mode || "development";
  const useLegacy = !!env.legacy;

  return {
    mode,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/bundle.[contenthash:8].js",
      // webpack 5 内置：每次构建前清空 output.path
      // 当使用 clean-webpack-plugin 时关闭，避免重复清理
      clean: !useLegacy,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "自动清理 dist Demo",
      }),
      // 仅当显式启用 legacy 时使用 clean-webpack-plugin
      ...(useLegacy ? [new CleanWebpackPlugin()] : []),
    ],
    devServer: {
      port: 8089,
      open: true,
      hot: true,
    },
  };
};
