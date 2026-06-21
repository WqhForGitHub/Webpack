// src/index.js
// 演示 3 种 HTTP 请求：
// 1. 直连第三方 API（CORS）
// 2. 通过 devServer.proxy 转发（无 CORS 问题）
// 3. 访问 devServer 自定义中间件 mock 接口

const out = () => document.getElementById("output");

function show(label, data) {
  out().textContent = `[${label}]\n` + JSON.stringify(data, null, 2);
}

// 1. 直连：浏览器直接请求 jsonplaceholder.typicode.com
document.getElementById("btn-fetch").addEventListener("click", async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await res.json();
    show("DIRECT", data);
  } catch (e) {
    show("DIRECT ERROR", { message: e.message });
  }
});

// 2. 通过 devServer 代理：/api/* 会被转发到 jsonplaceholder
//    避免浏览器 CORS 报错
document.getElementById("btn-proxy").addEventListener("click", async () => {
  try {
    const res = await fetch("/api/todos/2");
    const data = await res.json();
    show("PROXY (/api -> jsonplaceholder)", data);
  } catch (e) {
    show("PROXY ERROR", { message: e.message });
  }
});

// 3. mock 接口：由 devServer.setupMiddlewares 提供
document.getElementById("btn-mock").addEventListener("click", async () => {
  try {
    const res = await fetch("/mock/user");
    const data = await res.json();
    show("MOCK (/mock/user)", data);
  } catch (e) {
    show("MOCK ERROR", { message: e.message });
  }
});
