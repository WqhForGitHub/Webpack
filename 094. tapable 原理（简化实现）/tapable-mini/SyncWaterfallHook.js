// tapable-mini/SyncWaterfallHook.js
// 简化版 SyncWaterfallHook：
//   - 上一个 tap 的返回值作为下一个 tap 的第一个参数
class SyncWaterfallHook {
  constructor(args = []) {
    this._args = args;
    this.taps = [];
  }

  tap(name, fn) {
    this.taps.push({ name, fn });
  }

  call(...args) {
    let [first, ...rest] = args;
    for (const t of this.taps) {
      const r = t.fn(first, ...rest);
      if (r !== undefined) first = r;
    }
    return first;
  }
}

module.exports = SyncWaterfallHook;
