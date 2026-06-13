// webpack.config.js
// 用 webpack 真实 loader-runner 跑一遍同一组 loader，与 mini-runner 输出对照
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /source\.txt$/,
        // webpack 中 loader 从右到左 normal、从左到右 pitch
        // raw-loader 等价的最简实现：让结果以字符串形式 export
        use: [
          { loader: "./loaders/to-module-loader.js" },
          { loader: "./loaders/banner-loader.js" },
          { loader: "./loaders/upper-loader.js" },
          { loader: "./loaders/pitch-loader.js" },
          { loader: "./loaders/async-loader.js" },
        ],
        type: "javascript/auto",
      },
    ],
  },
};
