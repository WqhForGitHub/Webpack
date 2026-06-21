// webpack.config.js
// 通过 --env devtool=xxx 动态切换 devtool

const path = require("path");

module.exports = (env = {}) => {
  // env.devtool 可能是 false（字符串） 或具体 devtool 名称
  let devtool = env.devtool;
  if (devtool === "false" || devtool === false) {
    devtool = false;
  }

  return {
    mode: "development",

    entry: "./src/index.js",

    // devtool：source map 生成策略
    // 常见可选值见 README
    devtool: devtool,

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      clean: true,
    },
  };
};
