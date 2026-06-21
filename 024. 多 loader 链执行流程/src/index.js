// 入口文件：导入 .chain.txt，最终拿到的是经过 loader-c -> loader-b -> loader-a
// 处理后的字符串，通过 DOM 渲染到页面，便于直观查看执行顺序。
import text from "./text.chain.txt";

const root = document.getElementById("app");
const pre = document.createElement("pre");
pre.textContent = text;
root.appendChild(pre);

console.log("最终模块导出：\n" + text);
