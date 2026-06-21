// webpack.config.js —— 演示 webpack-dev-server HTTP 能力
// 1. devServer.proxy 转发 /api 到第三方
// 2. setupMiddlewares 实现 mock /mock/*
// 3. headers 演示自定义响应头
// 4. https 切换 HTTP/2

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./index.html" }),
  ],
  devServer: {
    port: 8090,
    open: true,

    // 自定义响应头
    headers: {
      "X-Powered-By": "webpack-dev-server",
      "Cache-Control": "no-store",
    },

    // 反向代理：解决 CORS
    proxy: [
      {
        context: ["/api"],
        target: "https://jsonplaceholder.typicode.com",
        changeOrigin: true, // 修改 Host 头
        pathRewrite: { "^/api": "" }, // /api/todos/2 -> /todos/2
        secure: false,
      },
    ],

    // mock 中间件：/mock/* 由本地直接返回数据
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get("/mock/user", (req, res) => {
        res.json({
          id: 1,
          name: "Mocked User",
          time: new Date().toISOString(),
          source: "webpack-dev-server middleware",
        });
      });
      return middlewares;
    },

    // 默认 http；运行 npm run serve:https 可切换到 HTTPS（HTTP/2）
    server: "http",
  },
};
