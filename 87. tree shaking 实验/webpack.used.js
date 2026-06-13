// webpack.used.js —— 第一阶段：仅标记 usedExports，不压缩
// 产物中可看到 /* unused harmony export unusedA */ 注释
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/used"),
    filename: "bundle.js",
    clean: true,
  },
  optimization: {
    usedExports: true, // 标记未使用的 export
    minimize: false, // 不压缩，便于阅读注释
    concatenateModules: false,
  },
};
