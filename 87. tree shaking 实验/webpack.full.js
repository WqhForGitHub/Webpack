// webpack.full.js —— 第二阶段：完整 production 配置，
// usedExports 标记 + Terser 真正删除死代码
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/full"),
    filename: "bundle.js",
    clean: true,
  },
  optimization: {
    usedExports: true,
    sideEffects: true,
    minimize: true, // 启用 Terser 删除被标记的死代码
    concatenateModules: true,
  },
};
