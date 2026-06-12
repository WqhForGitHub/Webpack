// loaders/b-loader.js
// loader 执行顺序演示：b-loader 位于 use 数组的中间
// 通过 options.pitchBreak 控制：
//   false -> pitch 不返回，正常继续
//   true  -> pitch 返回字符串结果，触发“熔断”：
//            c-loader 的 pitch、读源文件、c-loader 的 normal 都不会执行
//            会直接跳回 a-loader 的 normal 阶段，把返回值作为它的输入
module.exports = function bLoader(source) {
  console.log("[b-loader] normal  阶段执行");
  return `${source}\n// <-- 由 b-loader 在 normal 阶段追加的注释`;
};

module.exports.pitch = function bPitch(
  remainingRequest,
  precedingRequest,
  data,
) {
  const options = this.getOptions() || {};
  console.log(
    "[b-loader] pitch   阶段执行  pitchBreak =",
    !!options.pitchBreak,
  );

  if (options.pitchBreak) {
    // 在 pitch 阶段返回非 undefined 值 -> 熔断
    // 此处直接返回一段 JS 模块代码当作"已经被处理过的源码"
    return [
      "// 这段代码来自 b-loader 的 pitch 返回值（熔断）",
      'export default "Hello from b-loader.pitch (short-circuit)!";',
    ].join("\n");
  }
};
