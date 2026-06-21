// webpack.config.js
// 通过自定义 plugin 在 compilation 完成后输出"模块依赖图"
const path = require("path");
const ModuleGraphPlugin = require("./plugins/module-graph-plugin");

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
    new ModuleGraphPlugin({
      filename: "module-graph.json",
    }),
  ],
};
