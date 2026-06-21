// webpack.config.js
// 演示 chunk 命名策略
//
// 三种命名场景：
//   1. 入口 chunk     → output.filename
//   2. 异步 chunk      → output.chunkFilename + magic comment
//   3. splitChunks    → cacheGroups.name 或 splitChunks.name(默认 false)
//
// 占位符：
//   [name]         chunk 名（来自 entry key 或 webpackChunkName）
//   [id]           chunk 数字 id
//   [hash]         整个 build 的 hash（不推荐，每次都变）
//   [chunkhash]    单个 chunk 内容 hash（依赖项变也会变）
//   [contenthash]  内容 hash（推荐，长缓存友好）

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",

  entry: {
    app: "./src/index.js",
    admin: "./src/admin.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    // 入口 chunk 命名规则
    filename: "js/[name].[contenthash:8].js",
    // 异步 chunk 命名规则
    chunkFilename: "js/async/[name].[contenthash:8].chunk.js",
    clean: true,
  },

  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // 自定义命名：vendor 类
        lodashVendor: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: "vendor-lodash",
          priority: 30,
          chunks: "all",
        },
        // 也可以用函数动态命名
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const pkg = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            return pkg ? `vendor-${pkg[1].replace("@", "")}` : "vendors";
          },
          priority: 10,
          chunks: "all",
        },
      },
    },
  },

  plugins: [
    new HtmlWebpackPlugin({ template: "./index.html", filename: "app.html", chunks: ["app"] }),
    new HtmlWebpackPlugin({ template: "./index.html", filename: "admin.html", chunks: ["admin"] }),
  ],
};
