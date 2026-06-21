# 07. devServer 基本使用

演示 `webpack-dev-server` 的常用配置：

- 端口、host、自动开浏览器、gzip 压缩
- 静态资源目录（`static`）
- SPA 路由 fallback（`historyApiFallback`）
- 接口代理（`proxy`）
- 错误覆盖层（`client.overlay`）

> 本 demo 仅开启 `liveReload`（自动刷新），HMR 见 `08. devServer 热更新（HMR）`。

## 用法

```bash
npm install
npm start         # 启动 devServer，浏览器自动打开 http://localhost:8080
npm run build     # 生产打包
```

修改 `src/index.js` 任意内容并保存，浏览器会自动整页刷新。
点击页面上的按钮可看到 `/api/posts/1` 被代理到 `https://jsonplaceholder.typicode.com/posts/1`。
