// webpack.config.js
// 演示 postcss-loader + autoprefixer：
//   - postcss-loader 让 webpack 调用 PostCSS 处理 CSS
//   - autoprefixer 是 PostCSS 插件，根据 browserslist 自动添加浏览器前缀
//
// loader 链顺序（从右到左）：
//   postcss-loader -> css-loader -> style-loader
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
          use: [
            "style-loader",
            "css-loader",
            "postcss-loader", // 配置在 postcss.config.js 中
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "postcss-loader + autoprefixer Demo",
      }),
    ],
    devServer: {
      port: 8101,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
