// webpack.config.js
// CSS 打包：style-loader 把 css-loader 解析后的 CSS 通过 <style> 注入到 DOM
// 加载顺序（loader 从右往左执行）：css-loader -> style-loader
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
          test: /\.css$/i,
          // 顺序：先用 css-loader 把 CSS 解析为 JS 模块
          // 再用 style-loader 在运行时把样式插入到 <head> 的 <style> 标签
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "打包 CSS（style-loader）Demo",
      }),
    ],
    devServer: {
      port: 8085,
      open: true,
      hot: true,
    },
  };
};
