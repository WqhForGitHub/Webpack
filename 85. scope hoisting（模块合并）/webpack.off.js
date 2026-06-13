// webpack.off.js —— 关闭 scope hoisting，每个模块独立函数包裹
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/off"),
    filename: "bundle.js",
    clean: true,
  },
  optimization: {
    concatenateModules: false, // 关闭 scope hoisting
    minimize: false,
  },
};
