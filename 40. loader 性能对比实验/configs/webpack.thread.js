// configs/webpack.thread.js
// 仅启用 thread-loader 多线程
const path = require("path");
const os = require("os");

module.exports = {
  mode: "production",
  entry: "../src/index.js",
  context: path.resolve(__dirname, ".."),
  output: {
    path: path.resolve(__dirname, "../dist/thread"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "../src"),
        use: [
          {
            loader: "thread-loader",
            options: { workers: Math.max(1, os.cpus().length - 1) },
          },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: false,
              presets: [["@babel/preset-env", { targets: "> 0.25%, not dead" }]],
            },
          },
        ],
      },
    ],
  },
  stats: "errors-only",
};
