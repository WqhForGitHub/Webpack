// loader-runner-mini/demo.js
// 用我们自己的 runner 模拟 webpack 调用 loader 链
const path = require("path");
const { runLoaders } = require("./runner");

const resource = path.resolve(__dirname, "../src/source.txt");

// 注意 webpack 中 loader 写法是从右到左执行（normal 阶段）
// 即：banner(upper(async(content)))
const loaders = [
  path.resolve(__dirname, "../loaders/banner-loader.js"),
  path.resolve(__dirname, "../loaders/upper-loader.js"),
  path.resolve(__dirname, "../loaders/pitch-loader.js"),
  path.resolve(__dirname, "../loaders/async-loader.js"),
];

console.log("=== 1) 正常执行（pitch 不短路） ===");
runLoaders({ resource, loaders }, (err, result) => {
  if (err) return console.error(err);
  console.log("\n--- 最终结果 ---\n" + result);
});
