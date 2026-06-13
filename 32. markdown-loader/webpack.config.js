// webpack.config.js
// 演示自定义 markdown-loader：
//   - 对 .md 文件应用我们写的 markdown-loader
//   - loader 内部使用 marked 把 Markdown 编译为 HTML 字符串
//   - 由 markdown-loader 直接输出 `module.exports = "<html...>"`
//
// 这样在 JS 中 `import html from './doc.md'` 拿到的就是 HTML 字符串。
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
    resolveLoader: {
      modules: ["node_modules", path.resolve(__dirname, "loaders")],
    },
    module: {
      rules: [
        {
          test: /\.md$/,
          use: ["markdown-loader"],
          type: "javascript/auto",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "markdown-loader Demo",
      }),
    ],
    devServer: {
      port: 8104,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
