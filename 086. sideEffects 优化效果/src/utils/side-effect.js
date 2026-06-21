// 副作用模块：修改全局变量
// 即使没人 import 它的具体导出，只要被 import "./side-effect"，
// 在 sideEffects=true 时会被保留
console.log("[side-effect] 模块被加载，并修改 globalThis");
globalThis.__APP_LOADED__ = true;
