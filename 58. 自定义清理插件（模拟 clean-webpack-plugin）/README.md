# 58. 自定义清理插件（模拟 clean-webpack-plugin）

## 目标
不依赖 `clean-webpack-plugin`，纯 webpack 实现一个自定义清理插件，每次构建前清空 `output.path`。

## 核心实现
```js
class MyCleanPlugin {
  apply(compiler) {
    compiler.hooks.beforeRun.tap("MyCleanPlugin", (c) => {
      const outputPath = c.options.output.path;
      this.cleanDir(outputPath);
    });
  }
}
```

## 关键点
1. **挂载时机**：`beforeRun`（编译开始前）。也可用 `emit` 阶段，但 `beforeRun` 更早、更安全。
2. **递归删除**：`fs.readdirSync` + `fs.statSync` 区分目录 / 文件
3. **exclude 选项**：保留 `.gitkeep`、`README.md` 等占位文件
4. **filename 含 hash**：每次内容变更会生成新 hash 文件名，更能体现"清理"效果

## 与 webpack5 内置 `output.clean: true` 的差别
- 内置版本：在 `processAssets` 阶段，只删「上一次构建生成、本次没生成」的文件，更智能
- 自定义版本：粗暴清空整个目录

## 运行
```bash
npm install
npm run build      # 第 1 次：dist 中产生 bundle.[hash1].js
# 改一下 src/index.js 内容
npm run build      # 第 2 次：bundle.[hash1].js 被清掉，只剩 bundle.[hash2].js
```
