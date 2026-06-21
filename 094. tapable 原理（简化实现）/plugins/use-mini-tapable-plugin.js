// plugins/use-mini-tapable-plugin.js
// 自定义插件：在 webpack 流程中使用我们手写的 mini-tapable
//   - 演示：插件内部维护一组自定义 hooks，所有钩子都用我们手写的 SyncHook
const { SyncHook, AsyncSeriesHook } = require("../tapable-mini");

class UseMiniTapablePlugin {
  constructor() {
    this.hooks = {
      beforeWrite: new SyncHook(["asset"]),
      afterDone: new AsyncSeriesHook(["stats"]),
    };
  }

  apply(compiler) {
    const PLUGIN_NAME = "UseMiniTapablePlugin";

    // 注册我们自己的 SyncHook 监听
    this.hooks.beforeWrite.tap("logger", (asset) => {
      console.log(`[mini-tapable] beforeWrite: ${asset}`);
    });
    this.hooks.beforeWrite.tap("counter", (asset) => {
      console.log(`[mini-tapable] beforeWrite counter for: ${asset}`);
    });

    // 注册 AsyncSeriesHook 监听
    this.hooks.afterDone.tapAsync("delay-log", (stats, cb) => {
      setTimeout(() => {
        console.log(`[mini-tapable] async afterDone, modules=${stats.modules}`);
        cb();
      }, 50);
    });

    // 把 mini-tapable 嫁接到 webpack 真正的 hook 上
    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
      Object.keys(compilation.assets).forEach((name) => {
        this.hooks.beforeWrite.call(name);
      });
    });

    compiler.hooks.done.tapAsync(PLUGIN_NAME, (stats, cb) => {
      this.hooks.afterDone.callAsync(
        { modules: stats.compilation.modules.size },
        cb
      );
    });
  }
}

module.exports = UseMiniTapablePlugin;
