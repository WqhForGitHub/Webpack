// loaders/banner-loader.js
// 同步 loader：在内容前加横幅
module.exports = function (content) {
  console.log("  [banner-loader] running");
  return `/* === banner === */\n${content}`;
};
