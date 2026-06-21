// 异步 chunk 加载流程：
// 1) 同步代码先执行
// 2) 点击按钮触发 import() → 浏览器发起 jsonp 请求加载 chunk
// 3) chunk 加载完成 → 执行 .then 回调

console.log("[main] 主入口开始执行");

document.getElementById("btn-math").addEventListener("click", async () => {
  console.time("加载 math chunk");
  // magic comment: webpackChunkName 给 chunk 命名
  const mod = await import(/* webpackChunkName: "math" */ "./math");
  console.timeEnd("加载 math chunk");
  document.getElementById("out").textContent =
    "math.add(2,3) = " + mod.add(2, 3);
});

document.getElementById("btn-greet").addEventListener("click", async () => {
  // webpackPrefetch: true → 浏览器空闲时提前下载，下次执行无延迟
  const mod = await import(
    /* webpackChunkName: "greet" */
    /* webpackPrefetch: true */
    "./greet"
  );
  document.getElementById("out").textContent = mod.greet("Webpack");
});
