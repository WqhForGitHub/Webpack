// plugins/SlowPlugin.js
// 故意写一个"慢插件"，模拟低质量插件对构建性能的影响
class SlowPlugin {
  constructor(opts = {}) {
    this.delay = opts.delay || 1000; // ms
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync("SlowPlugin", (compilation, cb) => {
      // 同步阻塞 N 毫秒
      const start = Date.now();
      while (Date.now() - start < this.delay) {
        // busy wait —— 模拟糟糕的 CPU 密集插件
      }
      cb();
    });
  }
}

module.exports = SlowPlugin;
