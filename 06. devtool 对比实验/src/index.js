// src/index.js —— 故意制造一个运行时错误，方便在浏览器里查看 source map 是否能定位到源码
import { boom } from "./utils/math";

console.log("devtool 对比实验 demo");

document.getElementById("app").innerText = "点击按钮触发错误，查看控制台堆栈";

document.getElementById("btn").addEventListener("click", () => {
  // 这里会抛出错误，借此对比不同 devtool 在 DevTools 中显示的源码定位
  boom();
});
