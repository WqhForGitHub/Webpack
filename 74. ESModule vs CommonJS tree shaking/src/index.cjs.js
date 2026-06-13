// src/index.cjs.js
// 使用 CommonJS 导入：webpack 只能保守处理，bigUnused 等很可能仍出现在 bundle

const { add } = require("./utils.cjs.js");

console.log("CJS add =", add(1, 2));
