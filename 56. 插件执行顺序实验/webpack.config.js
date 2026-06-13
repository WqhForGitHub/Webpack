// webpack.config.js
// 插件执行顺序实验：
// 同一个钩子上有多个 tap，执行顺序受 2 个因素控制：
//   1. tap 注册顺序（先 tap 先执行）—— 这是默认规则
//   2. tap 选项的 stage / before 字段（用于覆盖默认顺序）
//
// 不同钩子之间的执行顺序则由 webpack 内部生命周期决定：
//   environment → afterEnvironment → entryOption → afterPlugins
//   → beforeRun → run → beforeCompile → compile → thisCompilation
//   → compilation → make → afterCompile → emit → afterEmit → done
const path = require("path");

// 工具：制造一个会在多个钩子上注册的"探针"插件
class ProbePlugin {
  constructor(name) {
    this.name = name;
  }
  apply(compiler) {
    const tag = `[${this.name}]`;
    compiler.hooks.environment.tap(this.name, () =>
      console.log(tag, "environment")
    );
    compiler.hooks.beforeRun.tap(this.name, () =>
      console.log(tag, "beforeRun")
    );
    compiler.hooks.compile.tap(this.name, () =>
      console.log(tag, "compile")
    );
    compiler.hooks.emit.tap(this.name, () => console.log(tag, "emit"));
    compiler.hooks.done.tap(this.name, () => console.log(tag, "done"));
  }
}

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  // 数组中的注册顺序 = 默认 tap 顺序
  plugins: [
    new ProbePlugin("A"),
    new ProbePlugin("B"),
    new ProbePlugin("C"),
  ],
};
