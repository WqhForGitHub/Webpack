// loader-b.js
// use 数组中部 -> 第二个执行
module.exports = function (source) {
  console.log("[loader-b] 收到上游产出 ->\n" + source);
  return `[B-START]\n${source}\n[B-END]`;
};
