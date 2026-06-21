// webpack.config.js
const path = require("path");
const MyCleanPlugin = require("./plugins/MyCleanPlugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash:8].js",
    // 注意：不开启 webpack5 内置的 clean: true，
    // 改用我们自定义的插件来演示原理
  },
  plugins: [
    new MyCleanPlugin({
      // 可选：保留某些文件不被清理
      exclude: [".gitkeep"],
    }),
  ],
};
