// webpack.config.js
const path = require("path");
const DebugPlugin = require("./plugins/DebugPlugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  // 开启 stats 详细模式，infrastructureLogger 才会输出 debug 级别
  infrastructureLogging: {
    level: "verbose",
  },
  stats: {
    logging: "verbose",
    loggingDebug: ["DebugPlugin"], // 仅对该插件输出 debug
  },
  plugins: [new DebugPlugin()],
};
