// webpack.prod.config.js
// production 模式：
// - process.env.NODE_ENV = 'production'
// - 默认开启 TerserPlugin 压缩与 Tree Shaking
// - 模块路径会被混淆，变量名会被缩短

const path = require("path");

module.exports = {
  mode: "production",

  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist/prod"),
    filename: "bundle.js",
    clean: true,
  },
};
