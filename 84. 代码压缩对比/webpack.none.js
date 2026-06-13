// webpack.none.js —— mode: none，不压缩、不优化
const path = require("path");
module.exports = {
  mode: "none",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/none"),
    filename: "bundle.js",
    clean: true,
  },
};
