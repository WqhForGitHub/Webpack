// plugins/TimingPlugin.js
// 自制简易 SpeedMeasurePlugin：
// 包装其他插件的 tap，记录每个 hook 的执行时长
class TimingPlugin {
  apply(compiler) {
    const timings = {}; // { pluginName: { hookName: totalMs } }

    // hook 集合：测主要的几个核心 hook
    const hookNames = [
      "beforeRun",
      "compile",
      "compilation",
      "make",
      "afterCompile",
      "emit",
      "afterEmit",
      "done",
    ];

    hookNames.forEach((hookName) => {
      const hook = compiler.hooks[hookName];
      if (!hook || !hook.intercept) return;
      hook.intercept({
        register: (tapInfo) => {
          const original = tapInfo.fn;
          tapInfo.fn = (...args) => {
            const s = process.hrtime.bigint();
            const result = original.apply(null, args);
            const e = process.hrtime.bigint();
            const ms = Number(e - s) / 1e6;
            const key = tapInfo.name;
            timings[key] = timings[key] || {};
            timings[key][hookName] = (timings[key][hookName] || 0) + ms;
            return result;
          };
          return tapInfo;
        },
      });
    });

    compiler.hooks.done.tap("TimingPlugin", () => {
      console.log("\n========== Plugin Timing Report ==========");
      Object.keys(timings).forEach((plugin) => {
        const total = Object.values(timings[plugin]).reduce(
          (a, b) => a + b,
          0
        );
        console.log(`- ${plugin}  total ${total.toFixed(2)} ms`);
        Object.entries(timings[plugin]).forEach(([hk, ms]) => {
          console.log(`    ${hk}: ${ms.toFixed(2)} ms`);
        });
      });
      console.log("==========================================\n");
    });
  }
}

module.exports = TimingPlugin;
