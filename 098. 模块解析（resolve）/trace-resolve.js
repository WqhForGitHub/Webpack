// trace-resolve.js
// 用 webpack 内置的 enhanced-resolve（Node API）演示模块解析过程
//
// webpack 中的 resolve 实际上是调用 enhanced-resolve 完成的，
// 这个脚本不打包，只是把"传入一个 request 字符串"的解析过程跑出来。
const path = require("path");
const enhancedResolve = require("enhanced-resolve");

const myResolve = enhancedResolve.create.sync({
  extensions: [".js", ".jsx", ".json"],
  modules: [path.resolve(__dirname, "src"), "node_modules"],
  mainFiles: ["main", "index"],
  mainFields: ["browser", "module", "main"],
});

const cases = [
  ["./src/utils/math", __dirname],   // 省略扩展名
  ["./bag", path.resolve(__dirname, "src")],   // 目录 -> mainFiles
  ["tools/format", path.resolve(__dirname, "src")], // resolve.modules
];

for (const [request, ctx] of cases) {
  try {
    const r = myResolve(ctx, request);
    console.log(`${request.padEnd(20)} (from ${path.relative(__dirname, ctx) || "."}) -> ${path.relative(__dirname, r)}`);
  } catch (e) {
    console.log(`${request.padEnd(20)} -> ERROR: ${e.message}`);
  }
}
