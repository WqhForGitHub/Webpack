// src/index.js
console.log("webpack-dev-server 基本使用 demo");

const app = document.getElementById("app");
app.innerHTML = `
  <h1>webpack-dev-server 基本使用</h1>
  <p>修改 src/index.js，保存后浏览器会自动刷新（liveReload）。</p>
  <button id="loadBtn">通过代理请求 /api/posts/1</button>
  <pre id="result"></pre>
`;

document.getElementById("loadBtn").addEventListener("click", async () => {
  const res = await fetch("/api/posts/1");
  const data = await res.json();
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
});
