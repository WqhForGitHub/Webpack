// src/index.js
// 引入 lodash 等较大的库，确保 bundle 超过 threshold（1KB），便于看到 .gz/.br 输出

import _ from "lodash";
import "./style.css";

const arr = Array.from({ length: 100 }, (_, i) => i);
const result = _.chunk(arr, 10);

const root = document.getElementById("app");
root.innerHTML = `
  <h1>gzip + brotli 压缩 demo</h1>
  <p>chunks 总数：${result.length}</p>
  <p>第一组：${result[0].join(", ")}</p>
`;

console.log("loaded", result);
