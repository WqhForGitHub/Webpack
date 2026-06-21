// webpack.config.js
// 同一个 demo 中同时使用：
//  - 自定义 loader（upper-loader）：处理"单个文件"
//  - 自定义 plugin（FileListPlugin）：处理"全局产物"
const path = require("path");
const FileListPlugin = require("./plugins/file-list-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  resolveLoader: {
    // 让 webpack 能找到本地 loaders/ 目录
    modules: ["node_modules", path.resolve(__dirname, "loaders")],
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: ["upper-loader"], // 文件级转换
      },
    ],
  },
  plugins: [
    new FileListPlugin(), // 全局产物级处理
  ],
};
