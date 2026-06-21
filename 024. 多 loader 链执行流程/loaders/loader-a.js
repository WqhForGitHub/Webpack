// loader-a.js
// 在 use 数组中位于最左侧 -> 最后一个执行
module.exports = function (source) {
  console.log("[loader-a] 收到上游产出 ->\n" + source);
  const result = `[A-START]\n${source}\n[A-END]`;
  // 由于 loader-a 是链中最后一个执行的 loader，
  // 它必须返回合法 JavaScript（因为 type: 'javascript/auto'）
  return `module.exports = ${JSON.stringify(result)};`;
};
