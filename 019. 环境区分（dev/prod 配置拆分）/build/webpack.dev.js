// build/webpack.dev.js
// 开发配置：mode=development、style-loader、devServer、source-map
const { merge } = require("webpack-merge");
const base = require("./webpack.base");

module.exports = merge(base, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    port: 8091,
    open: true,
    hot: true,
  },
});
