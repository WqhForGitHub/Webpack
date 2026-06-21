// webpack.off.js —— 关闭 sideEffects 优化
// mul、sub、side-effect.js 都会被保留在产物中（即使没用到）

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
    sideEffects: false, // 关闭
    usedExports: true,
    minimize: false,
  },
};
