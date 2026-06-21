// webpack.config.js
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [
    // CopyWebpackPlugin：把不需要 webpack 处理的静态资源直接拷贝到 dist
    // 常见用途：robots.txt、manifest.json、favicon、第三方 lib、static 目录
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "dist"),
          // 全局忽略某些文件
          globOptions: {
            ignore: ["**/.DS_Store"],
          },
          // 当目标已存在 webpack 自己生成的文件时不要覆盖
          // 比如 dist/index.html 由 HtmlWebpackPlugin 生成，可以忽略
          // info: { minimized: true },
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};
