// webpack.config.js
// 演示 px -> rem 自动转换：
//   通过 postcss-loader + postcss-pxtorem 插件，
//   在打包阶段把 CSS 中的 px 单位换算成 rem。
//
// 适用于移动端/响应式适配：只要根元素 html 的 font-size 改变，
// 整个页面所有用 rem 写的尺寸都会等比缩放。
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
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "px -> rem Demo",
      }),
    ],
    devServer: {
      port: 8102,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
