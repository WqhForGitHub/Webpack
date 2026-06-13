// webpack.single.js —— 仅同步 require：runtime 最小
// 入口换成只 require math，去掉 import()
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/sync-only.js",
  output: {
    path: path.resolve(__dirname, "dist/single"),
    filename: "bundle.js",
    clean: true,
  },
  optimization: {
    minimize: false, // 不压缩，便于阅读 runtime
  },
};
