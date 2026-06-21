// src/utils/common.js
// 公共模块：会被多个入口共同引用（默认每个 bundle 都会包含一份）
export function greet(pageName) {
  return `Hello from ${pageName} page!`;
}
