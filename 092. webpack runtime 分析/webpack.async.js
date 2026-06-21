// webpack.async.js —— 含异步 import：runtime 带 chunk loading
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/async"),
    filename: "bundle.js",
    chunkFilename: "[name].chunk.js",
    clean: true,
  },
  optimization: { minimize: false },
};
