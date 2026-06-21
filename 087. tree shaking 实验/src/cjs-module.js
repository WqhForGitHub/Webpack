// CommonJS 模块：使用 module.exports
// CommonJS 是动态的（运行时决定 exports），webpack 无法静态分析摇掉未用导出
module.exports.used = function () {
  return "CJS used function";
};

module.exports.unusedA = function () {
  console.log("CJS unusedA");
  return "CJS will NOT be removed even if unused";
};

module.exports.unusedB = function () {
  console.log("CJS unusedB");
  return Array.from({ length: 1000 }, (_, i) => i).join(",");
};
