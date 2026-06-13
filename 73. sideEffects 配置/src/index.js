// src/index.js
// 入口：演示 sideEffects

import { used } from "./utils.js";
// 仅 import polyfill（不使用任何导出），由于 polyfill.js 在 sideEffects 列表中，
// 它会被保留下来执行
import "./polyfill.js";
// CSS 文件 —— 在 sideEffects 中被声明，不会被摇掉
import "./style.css";

console.log("used result =", used(2, 3));
