// webpack.config.js
// 演示 cacheGroups 自定义配置：精细化拆分第三方库
//
// cacheGroups 中的每一项都是一个「缓存组」：
//   - test:        匹配模块路径或模块对象的正则/函数
//   - name:        生成的 chunk 名
//   - priority:    优先级（数值越大越先匹配）
//   - chunks:      作用范围（'all' | 'async' | 'initial'）
//   - reuseExistingChunk: 复用已存在的 chunk
//   - enforce:     强制拆分（忽略 minSize 等限制）

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

  optimization: {
    splitChunks: {
      chunks: "all", // 同步 + 异步都参与拆分
      minSize: 0,    // demo 用：取消最小体积限制，方便观察拆包

      cacheGroups: {
        // 把 lodash 单独拆出
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: "lodash",
          priority: 30,
          chunks: "all",
        },
        // 把 jquery 单独拆出
        jquery: {
          test: /[\\/]node_modules[\\/]jquery[\\/]/,
          name: "jquery",
          priority: 30,
          chunks: "all",
        },
        // 其他 node_modules 统一打到 vendors.js
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
          chunks: "all",
        },
        // 业务代码中被多次引用的公共模块
        common: {
          name: "common",
          minChunks: 2,
          priority: 5,
          chunks: "all",
          reuseExistingChunk: true,
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
