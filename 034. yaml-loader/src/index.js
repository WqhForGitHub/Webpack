// src/index.js
// 通过自定义 yaml-loader 把 .yaml 当作 JS 对象导入
import config from "./config.yaml";

console.log("[yaml-loader] config 类型:", typeof config);
console.log("[yaml-loader] 解析结果:", config);

const app = document.getElementById("app");
const pre = document.createElement("pre");
pre.textContent = JSON.stringify(config, null, 2);
app.appendChild(pre);
