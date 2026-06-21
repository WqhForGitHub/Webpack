// src/index.js
// 1) __GREETING__ 会被 replace-loader 替换为 "Hello from custom loader!"
// 2) 文件顶部会被 banner-loader 插入注释（构建产物中查看）
// 3) intro.txt 通过 txt-loader 作为字符串导入

import intro from "./intro.txt";

const message = __GREETING__;

const app = document.getElementById("app");

const h1 = document.createElement("h1");
h1.textContent = message;

const pre = document.createElement("pre");
pre.textContent = intro;
pre.style.background = "#f5f5f5";
pre.style.padding = "12px";
pre.style.borderRadius = "6px";

app.appendChild(h1);
app.appendChild(pre);

console.log("greeting =", message);
