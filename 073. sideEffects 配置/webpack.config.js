// webpack.config.js
// 演示「sideEffects 配置」 —— 纯 webpack
//
// 知识点：
//   1. package.json 中的 "sideEffects" 字段告诉 webpack 哪些文件「有副作用」，
//      不能被 tree shaking 删除。
//   2. "sideEffects": false 表示整包都没副作用，可以放心摇树。
//   3. "sideEffects": ["*.css", "./src/polyfill.js"] 表示 CSS 和 polyfill
//      被 import 但没有用到具名导出时也不能删除。
//   4. 必须在 production 模式（或显式开启 optimization.usedExports +
//      TerserPlugin）才会真正删除未使用的 export。
//
// 实验步骤：
//   npm run build
//   查看 dist/main.[hash].js
//     - utils.js 中只有 used() 应该出现，unused()/big() 被摇掉
//     - polyfill.js 因为在 sideEffects 数组里，会被保留
//     - style.css 因为在 sideEffects 中，会被打入 CSS 输出

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash:8].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    // production 模式下默认开启
    usedExports: true,
    minimize: true,
    sideEffects: true, // 关键：读取 package.json 的 sideEffects 字段
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
    }),
  ],
};
