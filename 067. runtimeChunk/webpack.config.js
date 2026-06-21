// webpack.config.js
// 演示 optimization.runtimeChunk
//
// runtimeChunk：把 webpack 的运行时代码（chunk 加载、模块映射表等）抽到单独 chunk
//
// 三种取值：
//   false（默认）     运行时代码注入到每个 entry chunk 内
//   true / 'multiple' 每个 entry 都生成一个 runtime~xxx.js
//   'single'          全局只生成一个 runtime.js（推荐用于多入口长缓存）
//   { name: ... }     自定义 runtime chunk 名
//
// 为什么需要 runtimeChunk？
//   每次业务代码变更，模块 id/chunk hash 映射表会变，导致 main.js 的 hash 变化。
//   抽出 runtime 后，vendor.js 的 contenthash 就不会因业务变化而失效，命中长缓存。

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",

  entry: {
    app: "./src/index.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    clean: true,
  },

  optimization: {
    // 把运行时单独抽到一个 chunk
    runtimeChunk: "single",
    // 也可以这样自定义名字：
    // runtimeChunk: { name: (entrypoint) => `runtime~${entrypoint.name}` },

    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
          chunks: "all",
        },
      },
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};
