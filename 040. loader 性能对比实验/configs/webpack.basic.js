// configs/webpack.basic.js
// 基线：仅使用 babel-loader，无任何加速
const path = require("path");
module.exports = {
  mode: "production",
  entry: "../src/index.js",
  context: path.resolve(__dirname, ".."),
  output: {
    path: path.resolve(__dirname, "../dist/basic"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "../src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: false,
              presets: [["@babel/preset-env", { targets: "> 0.25%, not dead" }]],
            },
          },
        ],
      },
    ],
  },
  stats: "errors-only",
};
