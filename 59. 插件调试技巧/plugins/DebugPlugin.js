// plugins/DebugPlugin.js
// 演示 webpack 插件调试的 4 种常用技巧
class DebugPlugin {
  apply(compiler) {
    // 技巧 1：使用 webpack 内置的 logger（推荐）
    // 通过 compiler.getInfrastructureLogger 拿到带日志级别的 logger
    const logger = compiler.getInfrastructureLogger("DebugPlugin");

    compiler.hooks.beforeRun.tap("DebugPlugin", () => {
      logger.info("beforeRun: 即将开始构建");
      logger.warn("warn 级别日志样例");
      logger.debug("debug 级别日志样例（需 stats: 'verbose'）");
    });

    // 技巧 2：在 compilation 内部使用 compilation.getLogger
    compiler.hooks.compilation.tap("DebugPlugin", (compilation) => {
      const log = compilation.getLogger("DebugPlugin");
      log.group("compilation 阶段");
      log.info("modules count =", compilation.modules.size);
      log.groupEnd();
    });

    // 技巧 3：用 console.log + 标签 + JSON.stringify 大对象时只打关键字段
    compiler.hooks.emit.tap("DebugPlugin", (compilation) => {
      const assetNames = Object.keys(compilation.assets);
      console.log("[DebugPlugin] emit 阶段, assets =", assetNames);
    });

    // 技巧 4：debugger 断点（配合 node --inspect-brk）
    compiler.hooks.done.tap("DebugPlugin", (stats) => {
      // 如果用 `node --inspect-brk webpack` 启动，
      // 将命中此断点，可在 chrome://inspect 中调试
      // debugger;
      console.log(
        "[DebugPlugin] done, time =",
        stats.endTime - stats.startTime,
        "ms"
      );
    });
  }
}

module.exports = DebugPlugin;
