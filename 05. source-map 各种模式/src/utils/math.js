// src/utils/math.js
export function divide(a, b) {
  if (b === 0) {
    throw new Error("除数不能为 0");
  }
  return a / b;
}
