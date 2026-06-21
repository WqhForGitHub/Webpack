// src/utils.esm.js
// 标准 ESM 具名导出 —— 完全可被 tree shaking

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function bigUnused() {
  // 仅用来检验是否被删除
  const arr = new Array(2000).fill(0).map((_, i) => i * i + i);
  return arr.reduce((s, v) => s + v, 0);
}
