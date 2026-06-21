// webpack.config.js
// 演示 compiler vs compilation：
//   - 通过 InspectPlugin 在不同钩子里打印 compiler / compilation 的关键信息
//   - 在 watch / serve 模式下会清晰看到 compilation 多次创建，compiler 只创建一次
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InspectPlugin = require("./plugins/inspect-plugin");

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
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "compiler vs compilation",
      }),
      new InspectPlugin(),
    ],
    devServer: {
      port: 8113,
      open: true,
    },
    stats: "minimal",
  };
};
