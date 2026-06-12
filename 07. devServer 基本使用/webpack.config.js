// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash:8].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "devServer 基本使用",
    }),
  ],
  // 关键：devServer 配置
  devServer: {
    // 服务器监听的端口
    port: 8080,
    // 自动打开浏览器
    open: true,
    // 启用 gzip 压缩
    compress: true,
    // 监听的 host，0.0.0.0 表示局域网内可访问
    host: "0.0.0.0",
    // 历史路由模式 fallback：所有 404 请求都回退到 index.html
    historyApiFallback: true,
    // 静态资源目录（dev-server 会把这个目录的文件直接对外暴露）
    static: {
      directory: path.resolve(__dirname, "public"),
      watch: true,
    },
    // 启动后是否在控制台显示完整 URL 等信息
    client: {
      logging: "info",
      overlay: true, // 编译错误覆盖在页面上
      progress: true, // 显示编译进度
    },
    // 接口代理示例：将 /api 请求转发到目标后端
    proxy: [
      {
        context: ["/api"],
        target: "https://jsonplaceholder.typicode.com",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    ],
    // 不在内存中输出 dist 文件夹，但通过浏览器可访问
    hot: false, // 本 demo 仅演示自动刷新，HMR 留到 08 章
    liveReload: true,
  },
};
