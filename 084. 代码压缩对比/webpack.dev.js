// webpack.dev.js —— mode: development，不压缩但有部分优化
const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/dev"),
    filename: "bundle.js",
    clean: true,
  },
};
