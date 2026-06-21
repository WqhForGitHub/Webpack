// webpack.config.js
// 纯 webpack 多入口配置（entry object）

const path = require("path");

module.exports = {
  mode: "development",

  // 多入口：entry 使用对象形式，key 是 chunk 名，value 是入口路径
  entry: {
    home: "./src/home.js",
    about: "./src/about.js",
    contact: "./src/contact.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    // 使用 [name] 占位符，对应 entry 中的 key
    filename: "[name].bundle.js",
    clean: true,
  },
};
