// webpack.config.js
// 演示 resolve 配置：extensions / modules / mainFiles / mainFields
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  resolve: {
    // 1) 自动补全的扩展名（按顺序尝试）
    extensions: [".js", ".jsx", ".json"],

    // 2) 默认 ['node_modules']；这里加入 src 让 'tools/x' 可以从 src/tools/x 找
    modules: [path.resolve(__dirname, "src"), "node_modules"],

    // 3) 当 require 一个目录时，按 mainFiles 找入口文件
    //    默认 ['index']
    mainFiles: ["main", "index"],

    // 4) require 一个 npm 包时，按 mainFields 顺序读 package.json
    //    web 项目常配 ['browser', 'module', 'main']
    mainFields: ["browser", "module", "main"],
  },
};
