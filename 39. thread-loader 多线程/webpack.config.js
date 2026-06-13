// webpack.config.js
// thread-loader 多线程：
//   - thread-loader 必须放在 use 数组的第一个（最先执行 = 最后链接 worker）
//   - 后续 loader（这里是 babel-loader）会在 worker 池中执行
//   - 适用于"重量级 loader"（babel / ts-loader 等），轻量 loader 反而会因进程通信开销变慢
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const os = require("os");

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
          test: /\.js$/,
          include: path.resolve(__dirname, "src"),
          use: [
            {
              loader: "thread-loader",
              options: {
                // 默认 CPU 核数 - 1
                workers: Math.max(1, os.cpus().length - 1),
                // worker 启动延迟，可以减小冷启动开销
                workerParallelJobs: 50,
                poolTimeout: 2000,
              },
            },
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                presets: [["@babel/preset-env", { targets: "> 0.25%, not dead" }]],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "thread-loader Demo",
      }),
    ],
    devServer: {
      port: 8111,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
