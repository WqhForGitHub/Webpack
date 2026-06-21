// src/index.js —— 同步 require + 异步 import，
// 让产物 runtime 含同步加载与异步加载两套能力
import { add } from "./math";

console.log("sync:", add(1, 2));

// 异步 chunk：让产物含 __webpack_require__.e（chunk loading）等 runtime
import(/* webpackChunkName: "lazy" */ "./lazy").then((m) => {
  console.log("lazy:", m.lazy());
});
