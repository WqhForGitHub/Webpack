// src/utils/math.js
export function boom() {
  // 故意访问 undefined 上的属性
  const a = undefined;
  return a.foo.bar;
}
