// webpack.config.js
// 演示 babel-loader：将 ES6+ 代码（箭头函数、class、const、解构等）
// 编译成兼容旧浏览器的 ES5 代码。
//
// 关键依赖：
//   - @babel/core      Babel 核心编译器
//   - @babel/preset-env 根据 targets 自动选择需要转换的语法
//   - babel-loader     桥接 webpack 与 Babel
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
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    // targets 决定 Babel 把代码降级到什么程度
                    // 这里指定较老的浏览器以便观察转换结果
                    targets: "> 0.25%, ie 11, not dead",
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "babel-loader Demo",
      }),
    ],
    devServer: {
      port: 8097,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
