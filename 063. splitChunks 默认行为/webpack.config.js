// webpack.config.js
// 演示 splitChunks 的默认行为
// 默认配置：
//   - chunks: 'async'（只对异步 chunk 生效）
//   - minSize: 20000（被拆分模块至少 20KB）
//   - minChunks: 1
//   - maxAsyncRequests: 30
//   - maxInitialRequests: 30
//   - cacheGroups: { defaultVendors: { test: /[\\/]node_modules[\\/]/ }, default: { minChunks: 2 } }

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",

  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    clean: true,
  },

  // 启用 splitChunks 的默认行为：chunks: 'async'
  // 即只有动态 import() 引入的 node_modules 模块或体积 > 20KB 的代码会被自动拆出
  optimization: {
    splitChunks: {
      chunks: "async", // 默认值。改成 'all' 才会对同步 vendor 也拆分
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};
