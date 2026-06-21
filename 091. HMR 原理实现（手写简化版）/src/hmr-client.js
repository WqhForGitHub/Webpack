// src/hmr-client.js
// ------ 手写 HMR 客户端 ------
// 职责：连 WebSocket，收到 update 事件后调用 webpack 的 hot API 拉取补丁

(function () {
  // 浏览器环境
  if (typeof window === "undefined") return;

  console.log("[hmr-client] connecting ws://localhost:3001");
  const ws = new WebSocket("ws://localhost:3001");

  ws.onopen = () => console.log("[hmr-client] connected");
  ws.onclose = () => console.log("[hmr-client] disconnected");

  ws.onmessage = (e) => {
    let msg;
    try {
      msg = JSON.parse(e.data);
    } catch {
      return;
    }
    console.log("[hmr-client] message:", msg);

    if (msg.type === "hash") {
      // 把最新 hash 暴露给 webpack runtime
      window.__webpack_hash__ = msg.hash;
    } else if (msg.type === "update") {
      // 收到更新通知，调用 webpack runtime 检查更新
      if (!module.hot) {
        console.warn("[hmr-client] HMR not enabled (no module.hot)");
        return;
      }
      module.hot
        .check(true) // true 表示自动 apply
        .then((updated) => {
          if (!updated) {
            console.log("[hmr-client] 没有更新，整页刷新");
            window.location.reload();
            return;
          }
          console.log("[hmr-client] 已应用更新模块:", updated);
        })
        .catch((err) => {
          console.error("[hmr-client] HMR 更新失败，整页刷新:", err);
          window.location.reload();
        });
    }
  };
})();
