// webpack.limit.js —— 用 LimitChunkCountPlugin 限制 chunk 上限
// 多余的 chunk 会被合并到现有 chunk，最终最多 maxChunks 个
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/limit"),
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    clean: true,
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 2, // 含 entry 在内最多 2 个 chunk
    }),
  ],
};
