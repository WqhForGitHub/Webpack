// webpack.config.js
const path = require("path");
const EmitModifyPlugin = require("./plugins/EmitModifyPlugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [
    new EmitModifyPlugin({
      banner: "/*! 版权所有 © 2025 - 本文件在 emit 阶段被修改 */",
    }),
  ],
};
