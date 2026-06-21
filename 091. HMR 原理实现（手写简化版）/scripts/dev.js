// scripts/dev.js —— 同时启动 webpack --watch + 手写 server
const { spawn } = require("child_process");
const path = require("path");

function run(cmd, args, label) {
  const p = spawn(cmd, args, {
    cwd: path.resolve(__dirname, ".."),
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  p.stdout.on("data", (d) => process.stdout.write(`[${label}] ${d}`));
  p.stderr.on("data", (d) => process.stderr.write(`[${label}] ${d}`));
  return p;
}

const wp = run("npx", ["webpack", "--watch"], "webpack");
const sv = run("node", ["./server/index.js"], "server");

process.on("SIGINT", () => {
  wp.kill();
  sv.kill();
  process.exit(0);
});
