// 主入口：只有点击按钮时才异步加载 ./math.js
const btn = document.getElementById("btn");

btn.addEventListener("click", async () => {
  console.log("[main] start loading math chunk...");
  // 关键：动态 import() 返回 Promise
  // webpack 会把 ./math.js 切成独立 chunk
  const mathModule = await import("./math.js");
  console.log("[main] math chunk loaded");
  alert("1 + 2 = " + mathModule.add(1, 2));
});

console.log("[main] entry loaded, math.js 还没下载");
