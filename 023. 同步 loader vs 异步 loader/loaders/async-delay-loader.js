// loaders/async-delay-loader.js
// 异步 loader 写法：
//   1) const callback = this.async()
//   2) 在异步任务完成后调用 callback(err, result)
//   3) 整个 loader 在 callback 被调用前不会让 pipeline 继续往下走
//
// 作用：
//   - 模拟异步任务（这里用 setTimeout 等待 options.delay 毫秒）
//   - 给内容加上 options.prefix 前缀
//   - 输出 ES Module 默认导出字符串
module.exports = function asyncDelayLoader(source) {
  const options = this.getOptions() || {};
  const delay = typeof options.delay === "number" ? options.delay : 0;
  const prefix = typeof options.prefix === "string" ? options.prefix : "";

  // 1. 申请异步模式，得到 callback
  const callback = this.async();

  console.log(
    `[async-delay-loader] 异步 loader 开始执行（delay=${delay}ms） ${this.resourcePath}`,
  );

  // 2. 模拟异步任务（HTTP / DB / fs ...）
  setTimeout(() => {
    try {
      const transformed = `${prefix}${String(source)}`;
      const code = `export default ${JSON.stringify(transformed)};`;
      console.log("[async-delay-loader] 异步任务完成，回调 callback");
      // 3. 完成后调用 callback(err, result)
      callback(null, code);
    } catch (err) {
      callback(err);
    }
  }, delay);
};
