// 入口文件
// 同步引入的 lodash 在 chunks: 'async' 默认配置下不会被拆出
console.log("[index] 主入口启动");

document.getElementById("btn").addEventListener("click", async () => {
  // 动态 import 触发异步 chunk，splitChunks 默认会把其中的 node_modules 抽到 vendors~ 中
  const { default: _ } = await import(/* webpackChunkName: "async-lodash" */ "lodash");
  console.log("[async] lodash 加载完成", _.VERSION);
  document.getElementById("out").textContent = "lodash 版本: " + _.VERSION;
});
