// tapable-mini/AsyncSeriesHook.js
// 简化版 AsyncSeriesHook：
//   - tapAsync(name, (...args, cb) => {...})：异步串行执行
class AsyncSeriesHook {
  constructor(args = []) {
    this._args = args;
    this.taps = [];
  }

  tapAsync(name, fn) {
    this.taps.push({ name, fn });
  }

  callAsync(...args) {
    const finalCb = args.pop();
    let i = 0;
    const taps = this.taps;
    const next = (err) => {
      if (err) return finalCb(err);
      if (i >= taps.length) return finalCb();
      const t = taps[i++];
      t.fn(...args, next);
    };
    next();
  }
}

module.exports = AsyncSeriesHook;
