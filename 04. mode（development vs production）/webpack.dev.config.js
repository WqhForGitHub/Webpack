// webpack.dev.config.js
// development 模式：
// - process.env.NODE_ENV = 'development'
// - 不压缩、不混淆，便于调试
// - 包含完整模块路径与变量名

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
