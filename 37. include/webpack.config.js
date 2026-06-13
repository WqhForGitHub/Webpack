// webpack.config.js
// include / exclude 演示：
//   - 用 include 明确"只处理 src/ 目录下的 JS"
//   - 用 exclude 排除 node_modules
//   - 这是性能优化常用手段：缩小 babel-loader 的处理范围
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  return {
    mode,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/bundle.[contenthash:8].js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          // include：只处理 src/ 下的 JS，第三方库不会被 babel 处理（性能更好）
          include: path.resolve(__dirname, "src"),
          // exclude：双保险，明确排除 node_modules
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "> 0.25%, not dead" }]],
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "include Demo",
      }),
    ],
    devServer: {
      port: 8109,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
