// webpack.config.js
// 演示自定义 csv-loader：
//   - 对 .csv 文件应用我们写的 csv-loader
//   - loader 内部使用 papaparse 把 CSV 解析为对象数组
//   - 输出 `module.exports = [{...}, {...}]`
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
          test: /\.csv$/,
          use: ["csv-loader"],
          type: "javascript/auto",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "csv-loader Demo",
      }),
    ],
    devServer: {
      port: 8107,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
