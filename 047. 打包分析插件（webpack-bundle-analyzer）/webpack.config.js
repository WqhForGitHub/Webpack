// webpack.config.js
const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env = {}) => {
  const plugins = [];

  if (env.analyze) {
    // 模式 1：server（默认）—— 启动一个本地服务在浏览器中打开可视化页面
    // 模式 2：static —— 生成 report.html 静态文件
    // 模式 3：disabled + generateStatsFile —— 仅输出 stats.json
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "static",         // 生成 report.html
        reportFilename: "report.html",
        openAnalyzer: true,             // 自动打开浏览器
        generateStatsFile: true,        // 同时输出 stats.json
        statsFilename: "stats.json",
      })
    );
  }

  return {
    mode: "production",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.[contenthash:8].js",
      clean: true,
    },
    plugins,
  };
};
