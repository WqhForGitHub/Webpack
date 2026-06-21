// webpack.config.js
// 演示 less-loader：把 LESS 编译为 CSS。
//
// loader 链顺序（从右到左）：
//   less-loader  -> 把 LESS 编译成 CSS 文本
//   css-loader   -> 解析 CSS 中的依赖
//   style-loader -> 把 CSS 注入到页面
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
          test: /\.less$/i,
          use: ["style-loader", "css-loader", "less-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "less-loader Demo",
      }),
    ],
    devServer: {
      port: 8100,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
