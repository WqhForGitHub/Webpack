// src/polyfill.js
// 没有任何导出，只有副作用（往全局 window 上挂方法）。
// 在 package.json 的 sideEffects 中声明后，即使没人 import 它的具名导出，
// 也能保证这段代码被打入 bundle 并执行。

if (typeof globalThis !== "undefined") {
  globalThis.__MY_POLYFILL_LOADED__ = true;
  console.log("[polyfill] loaded");
}
