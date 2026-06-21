// 数学工具：纯函数模块（无副作用）
// 因 package.json 中 sideEffects 数组里没有它，可以被安全 tree-shake

export function add(a, b) {
  return a + b;
}

export function sub(a, b) {
  return a - b;
}

export function mul(a, b) {
  return a * b;
}

// 一个"很大"的未使用函数，用来观察打包体积变化
export function heavyButUnused() {
  const arr = new Array(1000).fill(0).map((_, i) => i * i * i);
  return arr.reduce((a, b) => a + b, 0);
}
