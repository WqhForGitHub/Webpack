// configs/webpack.thread-cache.js
// thread-loader + 全部缓存（最佳实践）
const path = require("path");
const os = require("os");

module.exports = {
  mode: "production",
  entry: "../src/index.js",
  context: path.resolve(__dirname, ".."),
  output: {
    path: path.resolve(__dirname, "../dist/thread-cache"),
    filename: "bundle.js",
    clean: true,
  },
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(
      __dirname,
      "../node_modules/.cache/webpack-thread-cache"
    ),
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
              cacheDirectory: path.resolve(
                __dirname,
                "../node_modules/.cache/babel-thread-cache"
              ),
              cacheCompression: false,
              presets: [["@babel/preset-env", { targets: "> 0.25%, not dead" }]],
            },
          },
        ],
      },
    ],
  },
  stats: "errors-only",
};
