// 这是一个有副作用的文件（修改全局对象）
// 在 package.json 的 sideEffects 数组中显式列出，确保不会被 tree-shake 删除
window.__APP_POLYFILL_LOADED__ = true;
console.log("[polyfill] 已加载（有副作用）");
