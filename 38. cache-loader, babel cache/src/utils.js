// 故意写一些较慢/较多的代码，方便观察缓存收益
export function heavy() {
  let sum = 0;
  for (let i = 0; i < 1000; i++) sum += i;
  return sum;
}

export const utils = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  spread: (...nums) => nums.reduce((a, b) => a + b, 0),
};
