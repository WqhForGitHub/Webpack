# 71. 长缓存（contenthash）

## 演示要点

利用 `[contenthash]` 实现「**内容不变 → hash 不变 → 浏览器命中长缓存**」。

## 长缓存最佳实践

```js
output: {
  filename: "js/[name].[contenthash:8].js",
  chunkFilename: "js/[name].[contenthash:8].chunk.js",
}
optimization: {
  runtimeChunk: "single",          // 关键 1：抽出运行时
  moduleIds: "deterministic",       // 关键 2：稳定模块 id
  chunkIds: "deterministic",        // 关键 3：稳定 chunk id
  splitChunks: {                    // 关键 4：拆出 vendor
    chunks: "all",
    cacheGroups: {
      vendors: { test: /node_modules/, name: "vendors", priority: 10 },
    },
  },
}
```

CSS 用 `MiniCssExtractPlugin` 单独输出，并使用 `[contenthash]`，与 JS 完全独立。

## 验证步骤

```bash
npm install
npm run build
```

记录 `dist/js/vendors.xxx.js` 的 hash。

修改 `src/index.js` 内容：

```js
console.log("更新一行");
```

再次：

```bash
npm run build
```

观察：
- `vendors.[hash].js` 应保持不变 ✅
- `main.[hash].js` 与 `runtime.[hash].js` 改变

## 占位符差异

| 占位符 | 行为 |
| --- | --- |
| `[hash]` | 整个 build 的 hash，**任何变更都全变** ❌ |
| `[chunkhash]` | 单 chunk hash，但被依赖变化"传染" |
| `[contenthash]` | 仅文件内容自身的 hash，**最稳定** ✅ |
