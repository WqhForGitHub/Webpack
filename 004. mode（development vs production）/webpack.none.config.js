// webpack.none.config.js
// none 模式：
// - 不开启任何默认优化
// - 输出最原始的 webpack runtime 包裹代码

const path = require("path");

module.exports = {
  mode: "none",

  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist/none"),
    filename: "bundle.js",
    clean: true,
  },
};
