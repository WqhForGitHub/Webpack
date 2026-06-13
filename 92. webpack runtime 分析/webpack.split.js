// webpack.split.js —— 抽离 runtime：runtime 单独成一个 chunk
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/split"),
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    clean: true,
  },
  optimization: {
    minimize: false,
    runtimeChunk: "single", // 抽出独立 runtime.js
    splitChunks: { chunks: "all" },
  },
};
