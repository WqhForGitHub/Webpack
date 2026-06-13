// loaders/async-loader.js
// 异步 loader：通过 this.async() 拿到异步回调
module.exports = function (content) {
  console.log("  [async-loader] running (async)");
  const cb = this.async();
  setTimeout(() => {
    cb(null, content + "\n// async loader appended");
  }, 100);
};
