// loaders/sync-upper-loader.js
// 同步 loader 写法：
//   - 直接 return 转换后的字符串
//   - 不需要也不应该调用 this.async()
//
// 作用：
//   把源文件内容转成大写，并包成 ES Module 默认导出
module.exports = function syncUpperLoader(source) {
  console.log("[sync-upper-loader] 同步 loader 开始执行", this.resourcePath);
  const upper = String(source).toUpperCase();
  // 同步返回结果即可
  return `export default ${JSON.stringify(upper)};`;
};
