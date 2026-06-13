// src/index.js
// 演示通过自定义 raw-loader 把 .txt 当作字符串导入
import txt from "./hello.txt";

console.log("[raw-loader] txt 类型:", typeof txt);
console.log("[raw-loader] 内容如下：\n" + txt);

const app = document.getElementById("app");
const pre = document.createElement("pre");
pre.textContent = txt;
app.appendChild(pre);
