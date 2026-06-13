// webpack.config.js —— bundle 体积分析示例
// 提供两种分析方式：
// 1. webpack 内置 stats 输出（performance hint + stats: 'detailed'）
// 2. webpack-bundle-analyzer 可视化树状图（npm run analyze）

const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env = {}) => {
  const isAnalyze = env.analyze === true || env.analyze === "true";

  return {
    mode: "production",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash:8].js",
      chunkFilename: "[name].[contenthash:8].chunk.js",
      clean: true,
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
          },
        },
      },
    },
    // 性能预算：超过阈值会在终端 warning
    performance: {
      hints: "warning",
      maxAssetSize: 250 * 1024,
      maxEntrypointSize: 400 * 1024,
    },
    // 详细 stats，便于 CLI 直接看体积
    stats: {
      assets: true,
      assetsSort: "size",
      modules: false,
      chunks: true,
      chunkModules: false,
    },
    plugins: [
      ...(isAnalyze
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: "static", // 输出 report.html
              reportFilename: "bundle-report.html",
              openAnalyzer: false,
              generateStatsFile: true,
              statsFilename: "stats.json",
            }),
          ]
        : []),
    ],
  };
};
