// webpack.config.js
// 演示自定义 plugin 的使用：
//   - 在 plugins 数组中 new 出我们自己写的 FileListPlugin
//   - 构建结束后会在 dist/ 下生成 filelist.md
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileListPlugin = require("./plugins/file-list-plugin");

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
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "Custom Plugin Basic",
      }),
      new FileListPlugin({ filename: "filelist.md" }),
    ],
    devServer: {
      port: 8112,
      open: true,
    },
    stats: "minimal",
  };
};
