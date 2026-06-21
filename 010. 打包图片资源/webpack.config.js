// webpack.config.js
// 打包图片资源 demo：
// - JS 中 import 图片 -> asset/resource，输出独立文件
// - CSS 中 url(...) 引用图片 -> 由 css-loader 解析后再交给 asset module
// - 小图（< 8KB）自动 base64 内联
// - HTML 中的 <img src> 通过 HtmlWebpackPlugin 模板语法处理
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  return {
    mode,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/bundle.[contenthash:8].js",
      assetModuleFilename: "images/[name].[hash:8][ext][query]",
      clean: true,
    },
    module: {
      rules: [
        // CSS：开发用 style-loader，生产抽取成单独 CSS 文件
        {
          test: /\.css$/,
          use: [
            mode === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader",
          ],
        },

        // 图片：常见格式统一走 asset，由阈值决定内联还是输出文件
        {
          test: /\.(png|jpe?g|gif|webp|svg)$/i,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 小于 8KB 转 base64
            },
          },
          generator: {
            filename: "images/[name].[hash:8][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "打包图片资源 Demo",
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
      port: 8082,
      open: true,
      hot: true,
    },
  };
};
