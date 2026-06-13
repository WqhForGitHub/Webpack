// webpack.config.js
const path = require("path");
const webpack = require("webpack");
const pkg = require("./package.json");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [
    // BannerPlugin：在每个 chunk 文件头部注入注释
    // 注意 banner 字符串不要包含 /* */，webpack 会自动加上
    new webpack.BannerPlugin({
      banner: [
        `name: ${pkg.name}`,
        `version: ${pkg.version}`,
        `author: webpack-demo`,
        `build time: ${new Date().toISOString()}`,
        `Copyright (c) ${new Date().getFullYear()} All Rights Reserved.`,
      ].join("\n"),
      // entryOnly: true,                 // 只给入口文件加 banner
      // include: /\.js$/,                // 仅匹配 js
      // exclude: /vendor/,
      // raw: false,                      // raw=true 时 banner 原样输出（不自动包 /* */）
    }),
  ],
};
