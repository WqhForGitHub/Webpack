// webpack.config.js
// 演示多 loader 链执行流程：
//   loader 链对单个模块的执行顺序是「从右到左 / 从下到上」
//   也可以理解为：use 数组中的最后一个 loader 最先处理源文件，
//   它的输出会被前一个 loader 接着处理，依次类推。
//
//   本例对 .chain.txt 文件应用三个自定义 loader：
//     ['loader-a', 'loader-b', 'loader-c']
//   实际处理顺序为：loader-c -> loader-b -> loader-a
//
//   每个 loader 会在原文本前后追加自己的标签，
//   通过最终生成的字符串可以直观看到执行顺序。
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
          test: /\.chain\.txt$/,
          // 执行顺序：loader-c -> loader-b -> loader-a
          use: ["loader-a", "loader-b", "loader-c"],
          type: "javascript/auto",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "多 loader 链执行流程 Demo",
      }),
    ],
    devServer: {
      port: 8096,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
