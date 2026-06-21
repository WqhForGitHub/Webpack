// webpack.config.js
// 演示自定义 raw-loader：
//   - 对 .txt 文件应用我们写的 raw-loader
//   - loader 内部把源文本原样作为字符串导出
//   - 在 JS 中 `import txt from './hello.txt'` 拿到的就是文本字符串
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
      // 让 webpack 在本地 loaders/ 目录下也能找到自定义 loader
      modules: ["node_modules", path.resolve(__dirname, "loaders")],
    },
    module: {
      rules: [
        {
          test: /\.txt$/,
          use: ["raw-loader"],
          type: "javascript/auto",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "raw-loader Demo",
      }),
    ],
    devServer: {
      port: 8105,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
