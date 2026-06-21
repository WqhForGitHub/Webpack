// loaders/txt-loader.js
// 自定义 loader：把 .txt 文件作为字符串导出
// 类似 raw-loader：把内容包成 export default "..."
module.exports = function txtLoader(source) {
  // 注意：此处需要 JSON.stringify 防止换行符 / 双引号导致语法错误
  return `export default ${JSON.stringify(source)};`;
};
