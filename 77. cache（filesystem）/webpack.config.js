// webpack.config.js
// 演示「持久化缓存 cache.type = 'filesystem'」 —— 纯 webpack 5 内置能力
//
// 关键点：
//   1. cache.type: 'filesystem' 把模块解析、Babel 编译、模板等结果序列化到磁盘
//   2. cache.buildDependencies.config 指向当前配置文件 → 配置变化自动失效
//   3. cache.version 自定义字符串，外部条件变化时手动让缓存失效
//   4. cache.cacheDirectory 自定义缓存目录（默认 node_modules/.cache/webpack）
//
// 实验：
//   npm run clean      # 清除缓存 + dist
//   npm run build      # 第一次：写缓存，较慢
//   npm run build      # 第二次：命中缓存，明显更快

const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash:8].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
            // babel 自带的内存缓存层（与 webpack filesystem cache 协同）
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(__dirname, ".webpack-cache"),
    // 缓存命名空间：可以按构建场景区分
    name: "prod-cache",
    // 缓存版本：手动改这个字符串可让所有缓存失效
    version: "1.0.0",
    buildDependencies: {
      // 配置文件改了 → 整个缓存失效
      config: [__filename],
    },
    // 默认 60 天，超过则视为过期被清理
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
  // 性能提示阈值（仅打印 warning）
  performance: {
    hints: false,
  },
  // 打印更详细的 stats，方便观察 "compiled successfully in xxx ms"
  stats: {
    timings: true,
    builtAt: true,
  },
};
