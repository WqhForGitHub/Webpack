// plugins/DoneLogPlugin.js
// 在 done 钩子中输出本次构建的统计信息
// done 是 AsyncSeriesHook，回调参数是 stats 对象

class DoneLogPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("DoneLogPlugin", (stats) => {
      const info = stats.toJson({
        assets: true,
        chunks: false,
        modules: false,
        children: false,
      });

      const startTime = stats.startTime;
      const endTime = stats.endTime;

      console.log("\n========== DoneLogPlugin ==========");
      console.log(`✓ 构建完成，耗时：${endTime - startTime} ms`);
      console.log(`✓ 是否有错误：${stats.hasErrors()}`);
      console.log(`✓ 是否有警告：${stats.hasWarnings()}`);
      console.log(`✓ 输出资源数量：${info.assets.length}`);
      console.log("✓ 资源列表：");
      info.assets.forEach((a) => {
        console.log(`    - ${a.name}  (${a.size} bytes)`);
      });

      if (stats.hasErrors()) {
        console.log("✗ 错误信息：");
        info.errors.forEach((e) => console.log(`    ${e.message || e}`));
      }
      console.log("===================================\n");
    });
  }
}

module.exports = DoneLogPlugin;
