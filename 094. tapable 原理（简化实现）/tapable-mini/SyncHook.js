// tapable-mini/SyncHook.js
// 简化版 SyncHook：
//   - 注册回调：tap(name, fn)
//   - 触发：call(...args) 按注册顺序同步执行所有回调
class SyncHook {
  constructor(args = []) {
    this._args = args;
    this.taps = [];
  }

  tap(name, fn) {
    this.taps.push({ name, fn });
  }

  call(...args) {
    for (const t of this.taps) {
      t.fn(...args);
    }
  }
}

module.exports = SyncHook;
