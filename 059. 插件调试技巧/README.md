# 59. 插件调试技巧

开发 webpack 插件时常用的 4 种调试方法。

## 1. 使用 webpack 内置 Logger（推荐）
```js
const logger = compiler.getInfrastructureLogger("MyPlugin");
logger.info(...); logger.warn(...); logger.debug(...);
```
配合配置：
```js
infrastructureLogging: { level: "verbose" }
stats: { logging: "verbose", loggingDebug: ["MyPlugin"] }
```
优点：与 webpack 内部日志体系一致，可分级别过滤。

## 2. compilation.getLogger
```js
compiler.hooks.compilation.tap("X", c => {
  const log = c.getLogger("X");
  log.group("..."); log.info(...); log.groupEnd();
});
```
适合单次编译内部的细粒度日志，支持 `group` / `groupEnd` 缩进。

## 3. console.log + 标签 + 关键字段裁剪
```js
console.log("[X] emit assets =", Object.keys(compilation.assets));
```
最简单粗暴，但对大对象（compilation / module）千万别整体打印——会导致循环引用 + 输出爆炸。

## 4. Node.js 断点调试
```bash
node --inspect-brk ./node_modules/webpack/bin/webpack.js
```
然后打开 `chrome://inspect`，在源码中加 `debugger` 即可逐行调试。

## 加分技巧
- **webpack-stats.json**：`webpack --json > stats.json`，再用 `webpack-bundle-analyzer` 或在线 analyse 工具可视化
- **`SpeedMeasurePlugin`**：测每个插件 / loader 的耗时，定位性能瓶颈
- **`tap("name", { stage: ... })`** 时，把名字写得有辨识度，方便在日志里搜

## 运行
```bash
npm install
npm run build
npm run build:verbose   # 看到完整 verbose 日志
```
