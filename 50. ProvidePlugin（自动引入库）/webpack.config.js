// webpack.config.js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [
    // ProvidePlugin：当源码中遇到这些标识符时，自动 require 对应的模块
    // 注意：它只是“按需 require”，没用到的模块不会被打包
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      _: "lodash",
      // 也可以指向模块的某个成员，如：
      // join: ["lodash", "join"],
    }),
  ],
};
