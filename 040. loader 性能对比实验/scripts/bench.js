// scripts/bench.js
// 性能对比脚本：依次冷启动构建 4 种配置，打印耗时
const { execSync } = require("child_process");
const path = require("path");

function run(label, cmd) {
  // 清缓存与产物，保证冷启动
  execSync("npx rimraf dist node_modules/.cache", { stdio: "ignore" });
  const start = Date.now();
  execSync(cmd, { stdio: "ignore" });
  const cold = Date.now() - start;

  // 二次构建：命中缓存
  const start2 = Date.now();
  execSync(cmd, { stdio: "ignore" });
  const warm = Date.now() - start2;

  return { label, cold, warm };
}

console.log("开始性能对比，请耐心等待 ...");
const results = [];
results.push(run("basic", "npx webpack --config configs/webpack.basic.js"));
results.push(run("cache", "npx webpack --config configs/webpack.cache.js"));
results.push(run("thread", "npx webpack --config configs/webpack.thread.js"));
results.push(
  run("thread+cache", "npx webpack --config configs/webpack.thread-cache.js")
);

console.log("\n========== 结果（毫秒）==========");
console.log("配置".padEnd(16), "冷启动".padEnd(10), "二次构建");
results.forEach((r) => {
  console.log(
    r.label.padEnd(16),
    String(r.cold).padEnd(10),
    String(r.warm)
  );
});
