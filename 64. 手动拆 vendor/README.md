# 64. 手动拆 vendor

## 演示要点

**手动拆 vendor**：把第三方库（lodash、jquery）单独打到 `vendor.js`，业务代码打到 `main.js`，从而：

- 第三方库变化频率低 → 利用浏览器长期缓存
- 业务代码变化频率高 → 单独更新

## 实现方式

```js
entry: {
  main: "./src/index.js",
  vendor: ["lodash", "jquery"],
}
```

`HtmlWebpackPlugin` 中通过 `chunks: ["vendor", "main"]` 控制注入顺序，确保 vendor 在 main 之前。

## 运行

```bash
npm install
npm run build
```

## dist 输出

- `vendor.[hash].js`：第三方库（lodash + jquery）
- `main.[hash].js`：业务代码（含从 vendor 中 import 的引用）

> ⚠️ 这种方式有缺陷：业务代码里如果再 `import 'lodash'`，依然会被打到 main 里（webpack 5 会去重，但更精确的方式是用 `splitChunks.cacheGroups`，见 demo 65）。
