// scripts/compare.js
// 一次性构建所有 devtool 模式，并打印每个产物的体积，便于横向对比
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const modes = [
  "eval",
  "source-map",
  "eval-source-map",
  "eval-cheap-source-map",
  "eval-cheap-module-source-map",
  "cheap-source-map",
  "cheap-module-source-map",
  "inline-source-map",
  "hidden-source-map",
  "nosources-source-map",
  "false",
];

const distRoot = path.resolve(__dirname, "..", "dist");
if (fs.existsSync(distRoot)) {
  fs.rmSync(distRoot, { recursive: true, force: true });
}

const results = [];

for (const mode of modes) {
  const outDir = mode === "false" ? "none" : mode;
  const cmd = `npx webpack --env devtool=${mode} --output-path dist/${outDir}`;
  const start = Date.now();
  console.log(`\n>>> building devtool=${mode}`);
  execSync(cmd, { stdio: "inherit", cwd: path.resolve(__dirname, "..") });
  const cost = Date.now() - start;

  const dir = path.join(distRoot, outDir);
  let total = 0;
  for (const f of fs.readdirSync(dir)) {
    total += fs.statSync(path.join(dir, f)).size;
  }
  results.push({
    mode,
    cost: `${cost}ms`,
    size: `${(total / 1024).toFixed(2)} KB`,
  });
}

console.log("\n===== devtool 对比结果 =====");
console.table(results);
