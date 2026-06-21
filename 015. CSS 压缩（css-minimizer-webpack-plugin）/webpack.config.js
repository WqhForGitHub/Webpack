// webpack.config.js
// CSS 压缩：使用 css-minimizer-webpack-plugin
// 注意：一旦在 optimization.minimizer 中自定义了数组，需要同时把 JS 的压缩器（TerserPlugin）显式加上
// 否则在生产模式下 JS 不会被压缩
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

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
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
      ],
    },
    optimization: {
      // 生产环境才执行压缩；开发环境无需压缩
      minimize: isProd,
      minimizer: [
        // JS 压缩（默认行为，但一旦自定义 minimizer 就需要手动加上）
        new TerserPlugin(),
        // CSS 压缩
        new CssMinimizerPlugin(),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "CSS 压缩 Demo",
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: "css/[name].[contenthash:8].css",
            }),
          ]
        : []),
    ],
    devServer: {
      port: 8087,
      open: true,
      hot: true,
    },
  };
};
