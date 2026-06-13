// loaders/pitch-loader.js
// 演示 pitch 短路：当请求中带 ?bail 时，pitch 直接返回结果
module.exports = function (content) {
  console.log("  [pitch-loader] normal");
  return content;
};

module.exports.pitch = function (remaining, preceding, data) {
  console.log("  [pitch-loader] pitch, remaining:", remaining);
  // 这里若返回非 undefined，则跳过后面所有 loader 和文件读取
  // 返回一个"假装已经处理过"的内容
  // 默认不短路；想测试短路把下面注释打开：
  // return "// short-circuited by pitch-loader";
};
