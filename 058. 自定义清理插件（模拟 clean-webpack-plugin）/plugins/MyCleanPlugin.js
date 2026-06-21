// plugins/MyCleanPlugin.js
// 模拟 clean-webpack-plugin 的核心逻辑：
// 在打包前清空 output.path 目录。
//
// 实现思路：
//   1. 在 compiler.hooks.beforeRun（或 emit）阶段读取 output.path
//   2. 递归删除目录下的所有文件（保留目录本身）
//   3. 通过 compiler.hooks.beforeRun 钩子保证清理在编译开始前执行
const fs = require("fs");
const path = require("path");

class MyCleanPlugin {
  constructor(options = {}) {
    // 允许通过 exclude 配置保留某些文件
    this.exclude = options.exclude || [];
  }

  // 递归清空目录
  cleanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (this.exclude.includes(item)) continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        this.cleanDir(full);
        // 子目录如果空了再删除
        if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
      } else {
        fs.unlinkSync(full);
      }
    }
  }

  apply(compiler) {
    // beforeRun：每次 webpack 启动构建前
    compiler.hooks.beforeRun.tap("MyCleanPlugin", (c) => {
      const outputPath = c.options.output.path;
      console.log(`[MyCleanPlugin] cleaning ${outputPath}`);
      this.cleanDir(outputPath);
    });
  }
}

module.exports = MyCleanPlugin;
