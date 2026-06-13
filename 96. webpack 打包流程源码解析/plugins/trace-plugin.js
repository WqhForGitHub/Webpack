// plugins/trace-plugin.js
// 通过订阅 compiler / compilation 上几乎所有关键 hook，
// 把 webpack 真实的"打包流程"按顺序打印出来，
// 方便对照源码理解：
//
//   webpack(options)
//      └─ new Compiler()
//      └─ WebpackOptionsApply.process()    // 应用各种内部插件
//      └─ compiler.run() / compiler.watch()
//          └─ beforeRun -> run -> beforeCompile -> compile -> make
//                -> finishMake -> afterCompile -> shouldEmit -> emit
//                -> afterEmit -> done
//          └─ Compilation 内部又有大量 hook
class TracePlugin {
  apply(compiler) {
    const log = (phase, extra = "") => {
      console.log(`[trace] ${phase} ${extra}`);
    };

    // === Compiler 层 hooks（按真实触发顺序） ===
    compiler.hooks.environment.tap("Trace", () => log("environment"));
    compiler.hooks.afterEnvironment.tap("Trace", () => log("afterEnvironment"));
    compiler.hooks.entryOption.tap("Trace", () => log("entryOption"));
    compiler.hooks.afterPlugins.tap("Trace", () => log("afterPlugins"));
    compiler.hooks.afterResolvers.tap("Trace", () => log("afterResolvers"));
    compiler.hooks.initialize.tap("Trace", () => log("initialize"));

    compiler.hooks.beforeRun.tap("Trace", () => log("beforeRun"));
    compiler.hooks.run.tap("Trace", () => log("run"));
    compiler.hooks.normalModuleFactory.tap("Trace", () =>
      log("normalModuleFactory created")
    );
    compiler.hooks.contextModuleFactory.tap("Trace", () =>
      log("contextModuleFactory created")
    );

    compiler.hooks.beforeCompile.tap("Trace", () => log("beforeCompile"));
    compiler.hooks.compile.tap("Trace", () => log("compile"));
    compiler.hooks.thisCompilation.tap("Trace", (compilation) => {
      log("thisCompilation");
      hookCompilation(compilation, log);
    });
    compiler.hooks.compilation.tap("Trace", () => log("compilation"));

    compiler.hooks.make.tap("Trace", () => log("make"));
    compiler.hooks.finishMake.tap("Trace", () => log("finishMake"));
    compiler.hooks.afterCompile.tap("Trace", () => log("afterCompile"));
    compiler.hooks.shouldEmit.tap("Trace", () => {
      log("shouldEmit");
      return true;
    });
    compiler.hooks.emit.tap("Trace", () => log("emit"));
    compiler.hooks.assetEmitted.tap("Trace", (file) =>
      log("assetEmitted", file)
    );
    compiler.hooks.afterEmit.tap("Trace", () => log("afterEmit"));

    compiler.hooks.done.tap("Trace", (stats) => {
      log("done", `(modules=${stats.compilation.modules.size})`);
    });
  }
}

function hookCompilation(compilation, log) {
  // === Compilation 层关键 hooks ===
  compilation.hooks.buildModule.tap("Trace", (m) =>
    log("compilation.buildModule", short(m.resource))
  );
  compilation.hooks.succeedModule.tap("Trace", (m) =>
    log("compilation.succeedModule", short(m.resource))
  );
  compilation.hooks.finishModules.tap("Trace", () =>
    log("compilation.finishModules")
  );
  compilation.hooks.seal.tap("Trace", () => log("compilation.seal"));
  compilation.hooks.optimize.tap("Trace", () => log("compilation.optimize"));
  compilation.hooks.afterOptimizeChunks.tap("Trace", () =>
    log("compilation.afterOptimizeChunks")
  );
  compilation.hooks.processAssets.tap(
    {
      name: "Trace",
      stage: -2000,
    },
    () => log("compilation.processAssets (early)")
  );
  compilation.hooks.afterProcessAssets.tap("Trace", () =>
    log("compilation.afterProcessAssets")
  );
}

function short(p) {
  if (!p) return "";
  return p.split(/[\\/]/).slice(-2).join("/");
}

module.exports = TracePlugin;
