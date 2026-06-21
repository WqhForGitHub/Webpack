// plugins/EmitModifyPlugin.js
// 在 emit 阶段修改即将输出到 dist 的文件内容
// emit 钩子是文件写入磁盘前最后能修改 compilation.assets 的时机

const { sources } = require("webpack");
const { RawSource } = sources;

class EmitModifyPlugin {
  constructor(options = {}) {
    this.banner = options.banner || "/* modified by EmitModifyPlugin */";
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync("EmitModifyPlugin", (compilation, callback) => {
      Object.keys(compilation.assets).forEach((filename) => {
        if (/\.js$/.test(filename)) {
          // 1. 取出原始内容
          const original = compilation.assets[filename].source();
          // 2. 拼接新内容（在头部加 banner）
          const modified = `${this.banner}\n${original}`;
          // 3. 写回 compilation.assets
          compilation.assets[filename] = new RawSource(modified);
        }
      });

      // 额外：动态新增一个文件
      const extraContent = `// 此文件由 EmitModifyPlugin 在 emit 阶段动态生成\n// 时间：${new Date().toISOString()}\n`;
      compilation.assets["emit-extra.txt"] = new RawSource(extraContent);

      callback();
    });
  }
}

module.exports = EmitModifyPlugin;
