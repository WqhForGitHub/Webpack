// scripts/gen.js
// 自动生成大量 src/mod*.js 文件，用于放大 loader 处理耗时的差异
const fs = require("fs");
const path = require("path");

const SRC = path.resolve(__dirname, "../src");
const FILE_COUNT = 80; // 生成模块数量

if (!fs.existsSync(SRC)) fs.mkdirSync(SRC, { recursive: true });

const imports = [];
const calls = [];

for (let i = 0; i < FILE_COUNT; i++) {
  const name = `mod${i}`;
  const filePath = path.join(SRC, `${name}.js`);
  const code = `// auto-generated
export const ${name} = (...args) => {
  const obj = { name: "${name}", sum: args.reduce((a,b)=>a+b,0) };
  return { ...obj, tag: "v1" };
};
`;
  fs.writeFileSync(filePath, code);
  imports.push(`import { ${name} } from "./${name}";`);
  calls.push(`console.log(${name}(1,2,3));`);
}

const indexPath = path.join(SRC, "index.js");
fs.writeFileSync(
  indexPath,
  `// auto-generated entry\n${imports.join("\n")}\n\n${calls.join("\n")}\n`
);

console.log(`generated ${FILE_COUNT} modules into ${SRC}`);
