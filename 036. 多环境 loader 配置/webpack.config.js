// webpack.config.js
// 多环境 loader 配置：
//   - 同一份 webpack.config.js 根据 mode 切换 loader/plugin
//   - 开发：style-loader（注入到 <style>，更快、HMR 友好）
//   - 生产：mini-css-extract-plugin.loader（抽离为独立 .css 文件）
//
// 这样我们就有了一份典型的"多环境 loader 配置"实践。
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
          test: /\.css$/,
          // 关键：根据环境切换 loader
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: `Multi-env Loader Demo (${mode})`,
      }),
      // 仅生产环境使用抽离插件
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: "css/[name].[contenthash:8].css",
            }),
          ]
        : []),
    ],
    devServer: {
      port: 8108,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
