// webpack.config.js
// 演示 loader 的执行顺序：pitch 阶段（从左到右 / 从上到下）+ normal 阶段（从右到左 / 从下到上）
// 配置三个自定义 loader：a-loader、b-loader、c-loader
// use: ['a-loader', 'b-loader', 'c-loader']
//
// 完整执行顺序应当是：
//   1) a.pitch
//   2) b.pitch
//   3) c.pitch
//   4) 读取源文件
//   5) c (normal)
//   6) b (normal)
//   7) a (normal)
//
// 如果某个 loader 的 pitch 返回了非 undefined 的值，则会“熔断”：
//   - 后续 pitch / 实际读源 / 后续 normal 阶段都被跳过
//   - 直接把该返回值当作结果，跳回到上一个 loader 的 normal 阶段
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  // 通过命令行 --env pitchBreak 让 b-loader 在 pitch 阶段直接返回结果，触发熔断
  const pitchBreak = !!(env && env.pitchBreak);

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
          test: /\.js$/,
          exclude: /node_modules/,
          // use 中的执行顺序：
          //   pitch:  a -> b -> c
          //   normal: c -> b -> a
          use: [
            { loader: "a-loader" },
            { loader: "b-loader", options: { pitchBreak } },
            { loader: "c-loader" },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "loader 执行顺序（pitch）Demo",
      }),
    ],
    devServer: {
      port: 8094,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
