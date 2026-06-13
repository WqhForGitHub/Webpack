// server/index.js
// 手写极简 dev server：
// 1. express 静态托管 dist
// 2. ws 在 3001 端口推送更新事件
// 3. 直接监听 dist 目录变化（webpack 构建产物 -> 触发 ws 推送）

const path = require("path");
const fs = require("fs");
const express = require("express");
const chokidar = require("chokidar");
const { WebSocketServer } = require("ws");

const DIST = path.resolve(__dirname, "../dist");
const PORT = 3000;
const WS_PORT = 3001;

// ---------- HTTP 服务 ----------
const app = express();
app.use(express.static(DIST));
app.listen(PORT, () => {
  console.log(`[dev-server] http://localhost:${PORT}`);
});

// ---------- WebSocket 服务 ----------
const wss = new WebSocketServer({ port: WS_PORT });
wss.on("connection", (ws) => {
  console.log("[ws] client connected");
});
console.log(`[dev-server] ws://localhost:${WS_PORT}`);

function broadcast(msg) {
  const data = JSON.stringify(msg);
  wss.clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) ws.send(data);
  });
}

// ---------- 文件监听 ----------
// webpack --watch 会增量产出 dist/*.hot-update.{json,js}
// 我们检测到 stats 文件（main.js 或 hot-update.json）变化后通知客户端
const watcher = chokidar.watch(DIST, { ignoreInitial: true });

let timer = null;
watcher.on("all", (event, file) => {
  console.log("[watch]", event, path.basename(file));
  // 防抖：webpack 一次构建会写入多个文件
  clearTimeout(timer);
  timer = setTimeout(() => {
    // 从 hot-update.json 文件名取 hash
    const files = fs
      .readdirSync(DIST)
      .filter((f) => f.endsWith(".hot-update.json"));
    if (files.length === 0) {
      // 首次或全量构建
      broadcast({ type: "update" });
      return;
    }
    // hot-update.json 名形如 main.<hash>.hot-update.json
    const m = files[0].match(/^([^.]+)\.([a-f0-9]+)\.hot-update\.json$/);
    const hash = m ? m[2] : Date.now().toString(16);
    broadcast({ type: "hash", hash });
    broadcast({ type: "update" });
  }, 100);
});
