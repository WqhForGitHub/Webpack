// plugins/file-list-plugin.js
// 自定义 plugin：演示 plugin 的"工作粒度"
// plugin 可以接触整个 compiler / compilation，
// 在生命周期任何阶段做事，能力远大于 loader。
class FileListPlugin {
  apply(compiler) {
    // 在 emit 阶段（资源即将写入磁盘前）生成一个文件清单
    compiler.hooks.emit.tapAsync("FileListPlugin", (compilation, cb) => {
      let list = "# 本次构建产物清单\n\n";
      for (const filename of Object.keys(compilation.assets)) {
        const size = compilation.assets[filename].size();
        list += `- ${filename} (${size} bytes)\n`;
      }
      compilation.assets["filelist.md"] = {
        source: () => list,
        size: () => list.length,
      };
      cb();
    });
  }
}

module.exports = FileListPlugin;
