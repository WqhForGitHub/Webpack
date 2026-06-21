// loaders/upper-loader.js
// 同步 loader：把内容全部转大写
module.exports = function (content) {
  console.log("  [upper-loader] running");
  return content.toUpperCase();
};
