// webpack.dev.js —— development 模式：不会真正删除未用代码
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
