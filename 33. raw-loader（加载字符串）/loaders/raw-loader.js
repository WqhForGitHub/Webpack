// loaders/raw-loader.js
// 自定义 raw-loader：
//   - 输入：任意文本文件源内容
//   - 处理：不处理，原样作为字符串
//   - 输出：合法 JS 模块（module.exports = "...原始字符串..."）
module.exports = function (source) {
  // 同步 loader：直接返回 JS 代码字符串
  // 用 JSON.stringify 做安全转义（处理换行、引号等）
  return `module.exports = ${JSON.stringify(source)};`;
};
