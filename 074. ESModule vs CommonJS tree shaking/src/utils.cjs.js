// src/utils.cjs.js
// CommonJS 风格导出 —— webpack 对其 tree shaking 能力有限
// 由于是 module.exports 对象，webpack 必须保守地保留所有 key

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function bigUnused() {
  const arr = new Array(2000).fill(0).map((_, i) => i * i + i);
  return arr.reduce((s, v) => s + v, 0);
}

module.exports = {
  add,
  subtract,
  multiply,
  bigUnused,
};
