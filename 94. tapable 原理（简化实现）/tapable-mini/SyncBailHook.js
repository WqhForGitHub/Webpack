// tapable-mini/SyncBailHook.js
// 简化版 SyncBailHook：
//   - 任何一个 tap 返回非 undefined 则 "bail"（终止后续）并把结果返回
class SyncBailHook {
  constructor(args = []) {
    this._args = args;
    this.taps = [];
  }

  tap(name, fn) {
    this.taps.push({ name, fn });
  }

  call(...args) {
    for (const t of this.taps) {
      const r = t.fn(...args);
      if (r !== undefined) return r;
    }
  }
}

module.exports = SyncBailHook;
