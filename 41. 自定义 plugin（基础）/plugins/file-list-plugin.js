// plugins/file-list-plugin.js
// 自定义 plugin（基础版）：
//   - 一个 webpack plugin 必须是含有 `apply(compiler)` 方法的类
//   - 在 apply 中通过 compiler.hooks.<xxx>.tap(name, fn) 订阅钩子
//   - 这里在 emit 阶段把所有产物文件列表写入 filelist.md
class FileListPlugin {
  constructor(options = {}) {
    this.filename = options.filename || "filelist.md";
  }

  apply(compiler) {
    // 给所有日志加一个统一前缀
    const PLUGIN_NAME = "FileListPlugin";

    // emit 钩子：在产物即将被写入磁盘前触发
    // tap：同步钩子注册方式（最基础）
    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
      const assets = Object.keys(compilation.assets);
      let content = `# 构建产物清单\n\n本次共生成 ${assets.length} 个文件：\n\n`;
      assets.forEach((name) => {
        const size = compilation.assets[name].size();
        content += `- ${name} (${size} bytes)\n`;
      });

      // 把生成的内容塞进 compilation.assets，webpack 会负责把它写到 dist
      compilation.assets[this.filename] = {
        source: () => content,
        size: () => content.length,
      };
    });

    // done 钩子：构建完全结束后触发
    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      console.log(
        `[${PLUGIN_NAME}] done. assets:`,
        Object.keys(stats.compilation.assets).length
      );
    });
  }
}

module.exports = FileListPlugin;
