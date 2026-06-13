# 90. HTTP

纯 webpack（webpack-dev-server）演示前端常见的 HTTP 场景。

## 演示内容

| 按钮 | 行为 | 知识点 |
|------|------|--------|
| fetch 直连 | 浏览器直接请求 `https://jsonplaceholder.typicode.com/todos/1` | CORS（允许） |
| fetch 经 proxy | 请求 `/api/todos/2`，被 devServer 转发 | `devServer.proxy` |
| 访问 mock 接口 | 请求 `/mock/user`，由本地中间件响应 | `setupMiddlewares` |

## 启动

```bash
npm install
npm run serve            # http://localhost:8090
npm run serve:https      # https://localhost:8090（HTTP/2）
```

## 核心配置

```js
devServer: {
  // 1. 自定义响应头
  headers: { "X-Powered-By": "webpack-dev-server" },

  // 2. 反向代理（解决 CORS）
  proxy: [{
    context: ["/api"],
    target: "https://jsonplaceholder.typicode.com",
    changeOrigin: true,
    pathRewrite: { "^/api": "" }
  }],

  // 3. mock 中间件
  setupMiddlewares: (mws, devServer) => {
    devServer.app.get("/mock/user", (req, res) => res.json({ ... }));
    return mws;
  },

  // 4. 切换 HTTPS
  server: "https"   // 或 "http" / "spdy"
}
```

## 观察

打开 DevTools → Network：

- 直连：`Origin` 头是 localhost，需对方允许 CORS
- proxy：浏览器只看到 `localhost:8090/api/...`，无 CORS 问题
- mock：响应来自本地 Express 中间件，可任意造数据
- HTTPS：协议列显示 `h2`，HTTP/2 多路复用
