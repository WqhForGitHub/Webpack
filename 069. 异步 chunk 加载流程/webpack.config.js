// webpack.config.js
// 演示「异步 chunk 加载流程」
//
// 当代码使用 import('xxx') 动态导入时，webpack 会：
//   1. 把目标模块单独打成一个 chunk
//   2. 主 chunk 中保留一个 webpack_require.e(chunkId) 调用
//   3. 运行时通过 <script> 标签 jsonp 方式按需加载这个 chunk
//
// 关注点：
//   - magic comments：webpackChunkName / webpackPrefetch / webpackPreload
//   - publicPath：异步加载时的资源根路径
//   - chunkFilename：异步 chunk 输出名

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",

  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    // 异步 chunk 的命名规则（无 webpackChunkName 时使用）
    chunkFilename: "chunks/[name].[contenthash:8].js",
    // 异步 chunk 加载时的请求前缀，必须配置正确否则 404
    publicPath: "/",
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};
