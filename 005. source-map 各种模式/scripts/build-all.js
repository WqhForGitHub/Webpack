// scripts/build-all.js
// 一键构建全部 devtool 模式产物

const { execSync } = require("child_process");

const devtools = [
  "eval",
  "source-map",
  "eval-source-map",
  "cheap-source-map",
  "cheap-module-source-map",
  "inline-source-map",
  "hidden-source-map",
  "nosources-source-map",
  "false", // 不开启
];

for (const d of devtools) {
  const outDir = d === "false" ? "none" : d;
  const cmd = `npx webpack --env devtool=${d} --output-path dist/${outDir}`;
  console.log(`\n>>> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

console.log("\n全部 devtool 模式打包完成，请到 dist/ 下分别查看产物。");
