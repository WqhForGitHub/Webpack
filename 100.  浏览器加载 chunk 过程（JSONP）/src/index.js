// src/index.js
// 同步打印
console.log("[main] bundle 已加载");

// 点击按钮 -> 触发动态 import -> 浏览器通过 JSONP 拉取 chunk
document.getElementById("btn").addEventListener("click", () => {
  console.log("[main] 开始动态加载 ./async-feature");
  console.time("loadChunk");
  import(/* webpackChunkName: "async-feature" */ "./async-feature").then((mod) => {
    console.timeEnd("loadChunk");
    console.log("[main] chunk 加载完成，调用导出函数");
    mod.run();
  });
});
