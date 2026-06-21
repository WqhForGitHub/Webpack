// webpack.config.js
// HTML 模板：使用 html-webpack-plugin
// - 自动把 entry chunk 作为 <script> 注入到模板中
// - 支持模板插值（<%= htmlWebpackPlugin.options.title %>）
// - 多入口可以为每个 chunk 生成对应 HTML
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  const isProd = mode === "production";

  return {
    mode,
    entry: {
      home: "./src/home.js",
      about: "./src/about.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/[name].[contenthash:8].js",
      clean: true,
    },
    plugins: [
      // 首页：基于模板注入 home chunk
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "index.html",
        title: "首页 - HTML 模板 Demo",
        chunks: ["home"],
        // 生产环境压缩 HTML
        minify: isProd
          ? {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
            }
          : false,
      }),
      // 关于页：基于同一模板注入 about chunk
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "about.html",
        title: "关于 - HTML 模板 Demo",
        chunks: ["about"],
        minify: isProd
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
      }),
    ],
    devServer: {
      port: 8088,
      open: true,
      hot: true,
    },
  };
};
