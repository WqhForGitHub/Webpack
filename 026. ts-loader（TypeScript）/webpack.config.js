// webpack.config.js
// 演示 ts-loader：让 webpack 直接处理 TypeScript 源文件
//
// 关键点：
//   - resolve.extensions 中加入 .ts，使得 import './foo' 能匹配 foo.ts
//   - rules 中对 .ts/.tsx 使用 ts-loader
//   - 实际编译规则由根目录下的 tsconfig.json 控制
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  return {
    mode,
    entry: "./src/index.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/bundle.[contenthash:8].js",
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "ts-loader Demo",
      }),
    ],
    devServer: {
      port: 8098,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
