// webpack.config.js
// webpack 5 内置支持 JSON：可直接通过 import 引入 .json 文件
// type: 'json' 默认对 .json 启用，无需额外 loader
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
    // webpack 5 默认就能解析 JSON，这里显式声明仅作教学示意
    module: {
      rules: [
        // 默认行为已等价于：{ test: /\.json$/, type: 'json' }
        // 写出来仅为了让学员看清打包流程
        {
          test: /\.json$/i,
          type: "json",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "打包 JSON Demo",
      }),
    ],
    devServer: {
      port: 8084,
      open: true,
      hot: true,
    },
  };
};
