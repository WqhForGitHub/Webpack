// src/big-module-1.js
// 模拟较大的业务模块，用以放大编译耗时

const data = new Array(2000).fill(0).map((_, i) => ({
  id: i,
  name: `item-${i}`,
  square: i * i,
}));

export default function bigModule1() {
  return data.reduce((sum, item) => sum + item.square, 0);
}
