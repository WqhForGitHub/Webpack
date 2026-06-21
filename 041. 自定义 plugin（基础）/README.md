# 41. 自定义 plugin（基础）

实现一个最简单的 webpack plugin：在构建结束前生成一个 `filelist.md`，列出所有产物文件。

## Plugin 基本结构

```js
class FileListPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap("FileListPlugin", (compilation) => {
      // 通过 compilation.assets 添加新文件
    });
  }
}
```

要点：
- plugin 是一个**带 `apply(compiler)` 方法的类**。
- `compiler.hooks.<name>` 是各个生命周期钩子。
- `tap` 是同步钩子的订阅方式（异步可使用 `tapAsync` / `tapPromise`）。
- 在 `emit` 钩子里通过 `compilation.assets[name] = { source, size }` 写入产物。

## 安装 / 运行

```bash
npm install
npm run build
```

构建完成后，`dist/filelist.md` 就是插件生成的清单文件。
