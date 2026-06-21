// src/async-feature.js
// 异步 chunk：动态 import() 进来，被打成 async-feature.chunk.js
export function run() {
  const div = document.createElement("div");
  div.textContent = "异步 chunk 渲染的内容 - " + new Date().toLocaleTimeString();
  div.style.padding = "8px";
  div.style.marginTop = "10px";
  div.style.background = "#eef";
  document.body.appendChild(div);
  console.log("[async-feature] run()");
}
