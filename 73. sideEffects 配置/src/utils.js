// src/utils.js
// 三个具名导出，只有 used 被实际使用，其余应被 tree-shaking 删除

export function used(a, b) {
  return a + b;
}

export function unused() {
  console.log("I am unused, should be removed by tree shaking");
}

export function big() {
  // 较大的函数，便于在打包结果中观察是否被删除
  const arr = new Array(1000).fill(0).map((_, i) => i * i);
  return arr.reduce((s, v) => s + v, 0);
}
