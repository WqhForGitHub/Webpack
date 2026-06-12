// loaders/a-loader.js
// loader 执行顺序演示：a-loader 位于 use 数组的第一个
// pitch 阶段最先执行，normal 阶段最后执行
module.exports = function aLoader(source) {
  console.log("[a-loader] normal  阶段执行  resource =", this.resourcePath);
  return `${source}\n// <-- 由 a-loader 在 normal 阶段追加的注释`;
};

module.exports.pitch = function aPitch(
  remainingRequest,
  precedingRequest,
  data,
) {
  console.log("[a-loader] pitch   阶段执行");
  console.log("   remainingRequest =", remainingRequest);
  console.log("   precedingRequest =", precedingRequest);
  // 这里不返回任何值，pitch 继续往下走（b -> c -> 读源 -> c -> b -> a）
};
