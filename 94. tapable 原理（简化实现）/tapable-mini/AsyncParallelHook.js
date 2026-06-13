// tapable-mini/AsyncParallelHook.js
// 简化版 AsyncParallelHook：异步并行
class AsyncParallelHook {
  constructor(args = []) {
    this._args = args;
    this.taps = [];
  }

  tapAsync(name, fn) {
    this.taps.push({ name, fn });
  }

  callAsync(...args) {
    const finalCb = args.pop();
    const taps = this.taps;
    if (taps.length === 0) return finalCb();
    let done = 0;
    let hasErr = false;
    const next = (err) => {
      if (hasErr) return;
      if (err) {
        hasErr = true;
        return finalCb(err);
      }
      done++;
      if (done === taps.length) finalCb();
    };
    for (const t of taps) {
      t.fn(...args, next);
    }
  }
}

module.exports = AsyncParallelHook;
