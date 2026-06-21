// webpack.config.js
// 演示 sass-loader：把 SCSS 编译成 CSS，再交给 css-loader 与 style-loader。
//
// loader 链顺序（从右到左）：
//   sass-loader  -> 把 SCSS 编译成 CSS 文本
//   css-loader   -> 解析 CSS @import / url()，生成 JS 模块
//   style-loader -> 在运行时把 CSS 注入到 <style>
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  return {
    mode,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/bundle.[contenthash:8].js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "sass-loader Demo",
      }),
    ],
    devServer: {
      port: 8099,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
