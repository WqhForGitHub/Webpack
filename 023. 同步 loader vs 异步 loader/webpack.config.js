// webpack.config.js
// 演示同步 loader 与异步 loader 的写法对比：
//   1) sync-upper-loader：同步 loader，直接 return
//   2) async-delay-loader：异步 loader，使用 this.async() + callback
//
// 同步 loader：
//   - 直接 return result
//   - 或调用 this.callback(null, result)
//
// 异步 loader：
//   - const cb = this.async()
//   - 在异步操作完成后调用 cb(err, result)
//   - 在等待异步任务期间，loader pipeline 会“等”当前 loader
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
          // 演示同步 loader：把 .upper.txt 文件内容转成大写并 export 出来
          test: /\.upper\.txt$/,
          use: ["sync-upper-loader"],
          type: "javascript/auto",
        },
        {
          // 演示异步 loader：等待 200ms 后再返回结果，
          // 用于模拟读取数据库 / HTTP / 文件系统等异步任务
          test: /\.async\.txt$/,
          use: [
            {
              loader: "async-delay-loader",
              options: { delay: 200, prefix: "[async] " },
            },
          ],
          type: "javascript/auto",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "同步 loader vs 异步 loader Demo",
      }),
    ],
    devServer: {
      port: 8095,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
