// loader-c.js
// use 数组中位于最右侧 -> 最先执行
module.exports = function (source) {
  console.log("[loader-c] 收到原始文件 ->\n" + source);
  return `[C-START]\n${source}\n[C-END]`;
};
