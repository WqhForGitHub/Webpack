// webpack.config.js
// 通过 FAST 环境变量切换"慢插件"的启停，
// 直观感受插件对构建总耗时的影响
const path = require("path");
const SlowPlugin = require("./plugins/SlowPlugin");
const TimingPlugin = require("./plugins/TimingPlugin");

const FAST = process.env.FAST === "1";

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [
    new TimingPlugin(),
    // FAST=1 时跳过慢插件，FAST=0 / 未设置 时启用慢插件
    ...(FAST ? [] : [new SlowPlugin({ delay: 1500 })]),
  ],
};
