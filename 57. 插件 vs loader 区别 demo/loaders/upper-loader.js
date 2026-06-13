// loaders/upper-loader.js
// 自定义 loader：演示 loader 的"工作粒度"
// loader 只关心「单个文件的内容转换」：输入是 source（字符串/Buffer），
// 输出还是 source。它对整个构建流程一无所知。
module.exports = function (source) {
  // 把 .txt 文件中所有内容转大写，再包装成 ESM 默认导出
  const upper = source.toUpperCase();
  return `export default ${JSON.stringify(upper)};`;
};
