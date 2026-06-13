// 模拟一个体积较大的模块
const data = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: `item-${i}`,
  payload: `lorem-ipsum-dolor-sit-amet-${i}`,
}));

export function heavyA() {
  return data.length;
}
