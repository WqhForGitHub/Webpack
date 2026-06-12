// src/index.js
// 通过同步 loader 与异步 loader 分别加载两个 .txt 文件，并把内容显示在页面上
import upperText from "./hello.upper.txt"; // 走 sync-upper-loader
import asyncText from "./data.async.txt"; // 走 async-delay-loader

const app = document.getElementById("app");

const h1 = document.createElement("h1");
h1.textContent = "同步 loader vs 异步 loader Demo";

const h2a = document.createElement("h2");
h2a.textContent = "同步 loader 输出（hello.upper.txt）：";
const preA = document.createElement("pre");
preA.textContent = upperText;
preA.style.background = "#f5f5f5";
preA.style.padding = "12px";
preA.style.borderRadius = "6px";

const h2b = document.createElement("h2");
h2b.textContent = "异步 loader 输出（data.async.txt）：";
const preB = document.createElement("pre");
preB.textContent = asyncText;
preB.style.background = "#eef7ff";
preB.style.padding = "12px";
preB.style.borderRadius = "6px";

app.append(h1, h2a, preA, h2b, preB);

console.log("upperText =", upperText);
console.log("asyncText =", asyncText);
