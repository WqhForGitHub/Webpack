// webpack.config.js
// CSS 抽离：使用 mini-css-extract-plugin 把 CSS 抽离成独立 .css 文件
// 开发环境用 style-loader 便于 HMR；生产环境用 MiniCssExtractPlugin.loader 抽离
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  const isProd = mode === "production";

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
          use: [
            // 生产：抽离为独立 css 文件；开发：仍走 style-loader 注入 <style>
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "CSS 抽离 Demo",
      }),
      // 仅生产环境生成独立 CSS 文件
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: "css/[name].[contenthash:8].css",
              chunkFilename: "css/[name].[contenthash:8].chunk.css",
            }),
          ]
        : []),
    ],
    devServer: {
      port: 8086,
      open: true,
      hot: true,
    },
  };
};
