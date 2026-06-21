// src/index.js
// webpack 单入口文件
// 注意：使用了 ES Module 语法，webpack 会自动处理模块依赖关系并打包成一个文件

import { add, multiply } from "./utils/math.js";

const root = document.getElementById("app");

const a = 3;
const b = 5;

root.innerHTML = `
  <h1>Webpack 最简单打包（单入口）Demo</h1>
  <p>${a} + ${b} = ${add(a, b)}</p>
  <p>${a} × ${b} = ${multiply(a, b)}</p>
`;

console.log("打包成功，单入口 demo 已运行");
