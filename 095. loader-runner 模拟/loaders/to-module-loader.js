// loaders/to-module-loader.js
// 把字符串包装成 module.exports = "..."，让 .txt 可以被 import
module.exports = function (content) {
  return `module.exports = ${JSON.stringify(content)};`;
};
