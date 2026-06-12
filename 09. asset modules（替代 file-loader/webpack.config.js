// webpack.config.js
// 演示 webpack 5 内置的 Asset Modules，无需 file-loader / url-loader / raw-loader
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash:8].js",
    // 资源文件统一输出到 assets 目录，使用文件指纹
    assetModuleFilename: "assets/[name].[hash:8][ext][query]",
    clean: true,
  },
  module: {
    rules: [
      // 1) asset/resource —— 替代 file-loader：发出独立文件，模块返回 URL
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[hash:8][ext]",
        },
      },

      // 2) asset/inline —— 替代 url-loader 的“一定内联”模式，转 base64 DataURL
      {
        test: /\.svg$/i,
        type: "asset/inline",
      },

      // 3) asset/source —— 替代 raw-loader：将文件作为字符串导出
      {
        test: /\.txt$/i,
        type: "asset/source",
      },

      // 4) asset —— 通用资源，自动在 resource / inline 之间根据体积切换
      //    小于 8KB 的内联，大于的发出独立文件（默认阈值 8KB，可通过 parser.dataUrlCondition.maxSize 调整）
      {
        test: /\.(woff2?|ttf|eot|otf)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8 KB
          },
        },
        generator: {
          filename: "fonts/[name].[hash:8][ext]",
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
  devServer: {
    port: 8081,
    open: true,
    hot: true,
  },
};
