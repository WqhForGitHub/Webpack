// loaders/csv-loader.js
// 自定义 csv-loader：
//   - 输入：.csv 源文本
//   - 处理：用 papaparse 解析为 { fields, data }
//   - 输出：合法 JS 模块（默认导出对象数组）
const Papa = require("papaparse");

module.exports = function (source) {
  const result = Papa.parse(source, {
    header: true,        // 第一行作为字段名
    skipEmptyLines: true,
    dynamicTyping: true, // 自动转换数字 / 布尔
  });
  return `module.exports = ${JSON.stringify(result.data)};`;
};
