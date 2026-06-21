// plugins/inspect-plugin.js
// 通过自定义 plugin 直观展示 compiler 与 compilation 的区别：
//
// compiler：
//   - 全局唯一，代表 webpack 这个"构建器"实例本身
//   - 整个生命周期只创建一次（watch 模式也是同一个 compiler）
//   - 持有：options、context、inputFileSystem、outputFileSystem、运行环境信息
//
// compilation：
//   - 每次构建都会新建一个，代表"本次编译"的产物与中间状态
//   - watch 模式下每次文件变化触发的重编译都会产生一个新的 compilation
//   - 持有：modules、chunks、assets、entrypoints 等
class InspectPlugin {
  apply(compiler) {
    const NAME = "InspectPlugin";

    // 1) compiler 钩子：整个生命周期只触发一次
    compiler.hooks.environment.tap(NAME, () => {
      console.log("\n[compiler] environment 钩子触发（仅一次）");
      console.log("[compiler] mode =", compiler.options.mode);
      console.log("[compiler] context =", compiler.context);
    });

    // 2) compilation 钩子：每次编译都会触发一次
    let compilationCount = 0;
    compiler.hooks.compilation.tap(NAME, (compilation) => {
      compilationCount += 1;
      console.log(
        `\n[compilation] 第 ${compilationCount} 次 compilation 创建`
      );
      console.log("[compilation] name =", compilation.name);
      console.log("[compilation] hash(初始) =", compilation.hash);

      // 监听本次 compilation 的内部钩子
      compilation.hooks.optimize.tap(NAME, () => {
        console.log(
          `[compilation#${compilationCount}] optimize 阶段：modules=${compilation.modules.size}`
        );
      });
    });

    // 3) emit 阶段：可以读到本次 compilation 的最终 assets
    compiler.hooks.emit.tap(NAME, (compilation) => {
      const assets = Object.keys(compilation.assets);
      console.log(
        `[compilation] emit 阶段产物 (${assets.length}):`,
        assets.join(", ")
      );
    });

    // 4) done：构建完成
    compiler.hooks.done.tap(NAME, (stats) => {
      console.log(
        `[compiler] done。总 compilation 次数 = ${compilationCount}\n`
      );
    });
  }
}

module.exports = InspectPlugin;
