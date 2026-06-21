// webpack.on.js —— 启用 sideEffects 优化（默认）
// package.json 的 "sideEffects": false 告诉 webpack 整个项目无副作用
// 因此未被使用的 mul、sub、side-effect.js 会被全部 tree shake 掉

const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/on"),
    filename: "bundle.js",
    clean: true,
  },
  optimization: {
    sideEffects: true, // 默认 production 已开启
    usedExports: true,
    minimize: false,
  },
};
