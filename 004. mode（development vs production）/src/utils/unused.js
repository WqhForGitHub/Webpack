// src/utils/unused.js
// 此模块被 import 但未使用，production 模式应通过 tree-shaking 移除
export function unusedFn() {
  console.log("我是不会被使用的函数，应被 tree-shaking 移除");
}
