// loaders/yaml-loader.js
// 自定义 yaml-loader：
//   - 输入：.yaml / .yml 源文本
//   - 处理：用 js-yaml 解析成 JS 对象
//   - 输出：合法 JS 模块（module.exports = {...}）
const yaml = require("js-yaml");

module.exports = function (source) {
  const data = yaml.load(source);
  // 用 JSON.stringify 把对象序列化为 JS 字面量
  return `module.exports = ${JSON.stringify(data)};`;
};
