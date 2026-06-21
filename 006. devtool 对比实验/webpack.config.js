// webpack.config.js
// 通过 --env devtool=xxx 动态切换 devtool，方便对比不同模式产物
const path = require("path");

module.exports = (env = {}) => {
  let devtool = env.devtool;
  if (devtool === "false" || devtool === false) {
    devtool = false;
  }

  return {
    mode: "development",
    entry: "./src/index.js",
    devtool: devtool,
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      clean: true,
    },
  };
};
