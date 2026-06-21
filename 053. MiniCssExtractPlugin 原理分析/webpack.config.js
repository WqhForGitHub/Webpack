// webpack.config.js
// MiniCssExtractPlugin 原理分析：
// 1. 它由两部分组成：plugin + loader
// 2. loader：替代 style-loader，把 css-loader 处理后的 CSS 内容
//    "标记"为需要被抽离的资源，而不是注入到 <style>
// 3. plugin：在 compilation 阶段，遍历所有模块，
//    把被标记的 CSS 内容收集起来，最终通过 emit 钩子
//    生成独立的 .css 文件
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 关键：用 MiniCssExtractPlugin.loader 替代 style-loader
          // 它会"截获"CSS 模块的内容，交给 plugin 来抽离
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    // plugin 在 compilation.hooks.processAssets 阶段
    // 把所有 CSS 内容合并写入到 [name].css 文件
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
};
