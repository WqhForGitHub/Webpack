// loaders/c-loader.js
// loader 执行顺序演示：c-loader 位于 use 数组的最后一个
// pitch 阶段最后执行；normal 阶段最先执行（紧挨着读源文件）
module.exports = function cLoader(source) {
  console.log("[c-loader] normal  阶段执行（最先拿到源文件内容）");
  return `${source}\n// <-- 由 c-loader 在 normal 阶段追加的注释`;
};

module.exports.pitch = function cPitch(
  remainingRequest,
  precedingRequest,
  data,
) {
  console.log("[c-loader] pitch   阶段执行（最后一个 pitch）");
};
