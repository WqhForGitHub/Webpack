// plugins/TapDemoPlugin.js
// 演示 tap / tapAsync / tapPromise 三种钩子注册方式

class TapDemoPlugin {
  apply(compiler) {
    // 1. tap：同步钩子（也可以注册到异步钩子上，但不能做异步操作）
    //    compile 是 SyncHook，只能用 tap
    compiler.hooks.compile.tap("TapDemoPlugin", (params) => {
      console.log("\n[tap] compile 钩子触发（同步）");
    });

    // 2. tapAsync：异步钩子，使用 callback 回调
    //    emit 是 AsyncSeriesHook，可以用 tap / tapAsync / tapPromise
    compiler.hooks.emit.tapAsync("TapDemoPlugin", (compilation, callback) => {
      console.log("[tapAsync] emit 钩子触发（异步 callback）");
      setTimeout(() => {
        console.log("[tapAsync] 异步任务完成，调用 callback()");
        callback();
      }, 500);
    });

    // 3. tapPromise：异步钩子，返回 Promise
    //    afterEmit 是 AsyncSeriesHook
    compiler.hooks.afterEmit.tapPromise("TapDemoPlugin", (compilation) => {
      console.log("[tapPromise] afterEmit 钩子触发（异步 Promise）");
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("[tapPromise] Promise resolve");
          resolve();
        }, 500);
      });
    });

    // done 钩子（AsyncSeriesHook），这里用 tap 同步注册（不做异步）
    compiler.hooks.done.tap("TapDemoPlugin", (stats) => {
      console.log("[tap] done 钩子触发（构建完成）\n");
    });
  }
}

module.exports = TapDemoPlugin;
