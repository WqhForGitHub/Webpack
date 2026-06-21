# 63. splitChunks 默认行为

## 演示要点

webpack 5 内置了 `optimization.splitChunks`，**默认行为**：

| 选项 | 默认值 | 说明 |
| ---- | ---- | ---- |
| `chunks` | `'async'` | 只对动态 `import()` 产生的异步 chunk 生效 |
| `minSize` | `20000` (20KB) | 拆出的 chunk 最小体积 |
| `minChunks` | `1` | 模块至少被多少 chunk 引用才拆 |
| `maxAsyncRequests` | `30` | 异步请求最大并发数 |
| `maxInitialRequests` | `30` | 初始请求最大并发数 |
| `cacheGroups.defaultVendors` | `test: /node_modules/` | 自动拆 npm 包 |
| `cacheGroups.default` | `minChunks: 2` | 公共模块拆出条件 |

## 运行

```bash
npm install
npm run build
```

## 观察 dist 目录

- `main.[hash].js`：主入口（不含 lodash）
- `async-lodash.[hash].js`：异步 chunk（业务逻辑）
- `vendors-node_modules_lodash_lodash_js.[hash].js`：默认 vendors 缓存组拆出的 lodash

> 因为 `chunks: 'async'`，**同步**引入的 node_modules 不会被拆。要让所有同步 vendor 也拆出，需 `chunks: 'all'`，见 demo 64/65。
