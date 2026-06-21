// src/math.js
export function add(a, b) {
  // 加法
  return a + b;
}

export function multiply(a, b) {
  // 乘法
  return a * b;
}

export function subtract(a, b) {
  // 减法（未被使用）
  return a - b;
}

export function unusedFunction() {
  // 此函数被 import 但未实际调用
  console.log("never called");
  return 42;
}
