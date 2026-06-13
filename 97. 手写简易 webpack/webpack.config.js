// 与 mini.config.js 等价，方便对照"真实 webpack 输出"
const path = require("path");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist-webpack"),
    filename: "bundle.js",
    clean: true,
  },
};
