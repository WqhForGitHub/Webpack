// webpack.config.js
// 字体文件打包：使用 asset/resource 输出到独立文件，避免被 base64 内联导致 bundle 体积膨胀
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
          test: /\.css$/,
          use: [
            mode === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader",
          ],
        },

        // 字体文件：统一用 asset/resource 发出独立文件
        // 字体文件通常比较大，且需要被多页面缓存共享，不建议内联
        {
          test: /\.(woff2?|ttf|eot|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name].[hash:8][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "打包字体文件 Demo",
      }),
      ...(mode === "production"
        ? [
            new MiniCssExtractPlugin({
              filename: "css/[name].[contenthash:8].css",
            }),
          ]
        : []),
    ],
    devServer: {
      port: 8083,
      open: true,
      hot: true,
    },
  };
};
