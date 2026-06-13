# 91. HMR 原理实现（手写简化版）

不使用 `webpack-dev-server` / `webpack-hot-middleware`，从 0 实现热更新。

## 架构图

```
┌──────────────────┐    构建产出     ┌──────────────┐
│  webpack --watch │ ─────────────▶ │   dist/      │
└──────────────────┘                │  *.hot-update│
                                    │  main.js     │
                                    └──────┬───────┘
                                           │ chokidar 监听
┌──────────────────┐    WS 推送 update   ┌─▼──────────────┐
│  浏览器          │◀─────────────────── │  我们的 server │
│  hmr-client.js   │                     │  express + ws  │
│  module.hot.check│  HTTP 拉取 hot-update.js
└──────────────────┘────────────────────▶└────────────────┘
```

## 核心步骤

1. **构建侧**：`HotModuleReplacementPlugin` 让 webpack 产出 `*.hot-update.{json,js}` 与 `module.hot` runtime
2. **服务侧**：手写 server 用 `chokidar` 监听 `dist/`，变化时通过 WebSocket 通知浏览器
3. **浏览器侧**：手写 `hmr-client.js`：
   - 收到 ws 消息 → 调用 `module.hot.check(true)`
   - webpack runtime 自动 fetch 新的 `hot-update.json` + `hot-update.js`
   - 应用补丁，逐模块替换
4. **业务侧**：在 `index.js` 中调用 `module.hot.accept('./message', cb)` 声明哪些模块支持热替换，未声明则会 bubble up 直至触发整页刷新

## 启动

```bash
npm install
npm run dev
# 打开 http://localhost:3000
```

## 体验

修改 [src/message.js](src/message.js) 中的字符串 → 控制台会看到：

```
[watch] add main.<hash>.hot-update.json
[ws] message: { type: 'hash', ... }
[ws] message: { type: 'update' }
[hmr-client] 已应用更新模块: ["./src/message.js"]
[HMR] message 更新为: ...
```

页面文字直接更新，**不刷新页面**、**不丢失运行时状态**。

## 真正的 webpack-dev-server 还做了什么？

我们简化版省略了：

- 错误覆盖层（overlay）
- HMR 失败时的 fallback 策略
- Source Map 路由
- liveReload + history fallback
- compiler 直接对接（in-memory fs，无需写入 dist）
- progress 输出

但**核心思路一致**：watch → ws 通知 → `module.hot.check` → 替换。
