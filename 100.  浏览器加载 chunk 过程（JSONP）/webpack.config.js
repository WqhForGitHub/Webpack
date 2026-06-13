// webpack.config.js
// 演示浏览器加载 chunk 过程（JSONP）：
//   - 通过动态 import() 触发代码分割
//   - 输出多个 chunk
//   - 主 bundle 中包含 webpack JSONP runtime（__webpack_require__.e + jsonpCallback）
//   - 异步 chunk 在浏览器里通过插入 <script> 标签来加载，最后调用全局回调把 modules 注入
const path = require("path");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
    publicPath: "/dist/",
    clean: true,
    // 显式指定 chunkLoading 为 jsonp（web 默认就是 jsonp）
    chunkLoading: "jsonp",
    // 自定义 jsonp 全局函数名，便于调试时观察
    chunkLoadingGlobal: "myJsonp",
  },
  optimization: {
    // 把 webpack runtime 单独抽出来，更直观看到 JSONP 实现
    runtimeChunk: "single",
  },
};
