// loaders/markdown-loader.js
// 自定义 markdown-loader：
//   - 输入：.md 源文本
//   - 处理：用 marked 把 markdown 转成 HTML 字符串
//   - 输出：合法 JS 模块（module.exports = "..."）
const { marked } = require("marked");

module.exports = function (source) {
  // 同步 loader：直接返回字符串
  const html = marked.parse(source);
  // 必须返回合法 JS：把 HTML 字符串作为默认导出
  return `module.exports = ${JSON.stringify(html)};`;
};
