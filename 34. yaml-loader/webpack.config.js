// webpack.config.js
// 演示自定义 yaml-loader：
//   - 对 .yaml / .yml 文件应用我们写的 yaml-loader
//   - loader 内部使用 js-yaml 解析为 JS 对象
//   - 由 yaml-loader 输出 `module.exports = {...}`
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
    resolveLoader: {
      modules: ["node_modules", path.resolve(__dirname, "loaders")],
    },
    module: {
      rules: [
        {
          test: /\.ya?ml$/,
          use: ["yaml-loader"],
          type: "javascript/auto",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "yaml-loader Demo",
      }),
    ],
    devServer: {
      port: 8106,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
