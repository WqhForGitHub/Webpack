# 60. 插件性能影响分析

## 思路
1. 写一个 `SlowPlugin`，在 `emit` 钩子中 busy-wait 1.5 秒，模拟劣质插件。
2. 写一个 `TimingPlugin`，使用 `hook.intercept({ register })` 包装其它插件的 tap，统计每个插件在每个 hook 上的耗时。
3. 通过 `FAST=1` 环境变量切换是否启用 `SlowPlugin`，直接对比构建总耗时。

## 关键 API：`hook.intercept`
```js
compiler.hooks.emit.intercept({
  register(tapInfo) {
    const orig = tapInfo.fn;
    tapInfo.fn = (...args) => {
      // 计时...
      return orig(...args);
    };
    return tapInfo;
  }
});
```
这是 `speed-measure-webpack-plugin` 的核心思想。

## 运行 & 对比
```bash
npm install

# 启用慢插件
npm run build:nofast
# 看构建总耗时 + 报告中 SlowPlugin emit 占了 ~1500ms

# 关闭慢插件
npm run build:fast
# 总耗时显著下降
```

## 排查插件性能的常用工具
- `speed-measure-webpack-plugin`（业界事实标准）
- `webpack --profile --json > stats.json` + 在线分析
- 自定义 TimingPlugin（本 demo 演示）

## 优化建议
1. 不在 `compilation` 等高频 hook 中做重计算
2. 大文件操作放在 `processAssets` 阶段，并指明合适的 stage
3. 异步逻辑用 `tapAsync` / `tapPromise`，避免阻塞主线程
4. 缓存：用 `compilation.cache` API 复用上次结果
