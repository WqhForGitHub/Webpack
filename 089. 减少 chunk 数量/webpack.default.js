// webpack.default.js —— 默认行为：每个动态 import 各自产出 1 个 chunk
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/default"),
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    clean: true,
  },
};
