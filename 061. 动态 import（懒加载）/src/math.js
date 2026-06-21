// 一个比较"重"的模块，演示懒加载
export function add(a, b) {
  return a + b;
}

export function sub(a, b) {
  return a - b;
}

// 模拟一些额外代码量
export const HEAVY_DATA = new Array(1000).fill("x").join("-");
