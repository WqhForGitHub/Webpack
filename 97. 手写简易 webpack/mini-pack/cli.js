// mini-pack/cli.js
// 入口：读取 webpack.config.js 风格的配置，调用 mini-pack
const path = require("path");
const Compiler = require("./compiler");
const config = require("../mini.config");

const compiler = new Compiler({
  ...config,
  context: path.resolve(__dirname, ".."),
});

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("\n[mini-pack] done.");
  console.log("  modules:", stats.modules.length);
  console.log("  output :", stats.outputPath);
});
